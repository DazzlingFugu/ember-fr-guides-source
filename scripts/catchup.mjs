import { execSync } from 'child_process';
import fs from 'fs';
import minimist from 'minimist-lite';

/*
 * Read script arguments
 * We expect options "from" and "to" to have decimal values (e.g. 5.4, 6.0...)
 * By default, minimist-lite would treat these values as numbers so "6.0" would be parsed as "6".
 * This is not the intended behavior, so we specify that "from" and "to" should be treated as strings.
 */
const argv = minimist(process.argv.slice(2), { string: ['from', 'to'] });

// Read current Ember version (under translation)
const currentEmberVersion = `${argv.from}`;
if (currentEmberVersion.match(/\d+[.]\d+/g)?.[0] !== currentEmberVersion) {
  console.error('Error: please provide the current Ember version under translation to option --from (e.g. --from=5.1)');
  process.exit(2);
}
console.log(`Ember version under translation: ${currentEmberVersion}`);

// Read new Ember version (documented by the English guides)
const newEmberVersion = `${argv.to}`;
if (newEmberVersion.match(/\d+[.]\d+/g)?.[0] !== newEmberVersion) {
  console.error('Error: please provide the new Ember version documented on upstream to option --to (e.g. --to=5.4)');
  process.exit(2);
}
console.log(`New Ember version documented on upstream: ${newEmberVersion}`);

// Name of the catchup branch we will work on
const catchupBranch = `catchup-${newEmberVersion}`;

// List of filenames that changed between origin/ref-upstream and upstream/master
let files;

/* 
 * List of { filename, diffname } that require a GitHub issue to be adjusted manually
 * Example:
 * { filename: "my-page.md", diffName: "3.diff" } 
 * This mean that the diff between origin/ref-upstream and upstream/master for the file "my-page.md"
 * has been printed in "3.diff".
 * The command "git apply 3.diff" failed, probably because "my-page.md" was already translated into French.
 * Therefore, we need to open a GitHub issue showing the diff English to English so translators know how to adjust the translation.
 */
let filesToPost = [];

// List of manual actions to perform if the script encounters some failures
let warnings = [];

/* 
 * This function executes a shell command using execSync with an additional log.
 * If the command failed, execSync throws the error, so use runShell inside a try...catch.
 */
const runShell = (command) => {
  console.log(`Attempting to execute: "${command}"`);
  execSync(command);
}

/*
 * This function prints the messages stored in warnings.
 * It should always be called before forcing the process to exit.
 */
const printWarningMessages = () => {
  if (warnings.length > 0) {
    console.log(`
The process has been completed with warnings.
Here are all the actions you should perform manually to fully complete it:

`);
    for (const warning of warnings) {
      console.warn(warning);
    };
  }
}

/*
 * This function looks for the paths guides/release in the provided string and replace it with guides.
 * We need this to adjust the paths to our scaffolding:
 * The official English guides allow to navigate to legacy versions of Ember, it's "versioned" docs.
 * The French guides show only the latest version, so we don't have a dropdown to navigate, it's "unversioned" docs.
 * It's the scaffolding of the guides folder that impacts the dropdown presence: instead of having a release/ folder
 * that corresponds to the latest version, we have the docs at the root of guides directly.
 */
const unversionPath = (stringContent) => {
  return stringContent.replace(/guides\/release/g, 'guides');
}

/* 
 * This function compares the given filename in both branches and output a [index].diff file.
 * Example: 
 * filename = guides/accessibility/index.md, index = 3
 * The diff between ref-upstream and upstream/master for this file is printed in 3.diff
 */
const createDiff = (filename, index) => {
  const diffName = `scripts/patches/${index}.diff`;
  try {
    runShell(`git diff ref-upstream upstream/master -- ${filename} > ${diffName}`);
    return diffName;
  } catch (error) {
    warnings.push(`
ACTION REQUIRED: The diff file was not created for ${filename}.
-> Check manually if there is a diff to handle between origin/ref-upstream and upstream/master for this file.

`);
    throw new Error(`Failed to create the diff for ${filename}. This was caused by: ${err}`);
  }
}

/* 
 * This function executes all the read/write/unlink operations on diff files.
 *
 * files is the list of files (as path) that changed between ref-upstream and upstream/master
 * filesToPost is an empty array of objects { filename, diffName } this function is in charge to fill,
 * it will keep track of all the files whose diff can't be applied automatically, and we will reuse it
 * to post Github issues.
 */
const writeDiffFiles = async () => {
  let writePromises = files.map(async (filename, index) => {
    return new Promise((resolve) => {
      let diffName;
      try {
        diffName = createDiff(filename, index);
      } catch (error) {
        console.error(error);
        resolve(1);
      }
      // Read the created diff file, we need to access its content to adjust it to our Guidemaker scaffolding
      fs.readFile(diffName, 'utf8', function(err, data) {
        if (err) {
          warnings.push(`
ACTION REQUIRED: The patch paths could not be edited for ${diffName} because the file couldn't be read.
-> Check what's the issue then edit the path manually:
* Find and replace "guides/release" with "guides" in ${diffName}
* Run "git apply ${diffName}"
    If the command is successful, commit the file.
    If the command fails, open a GitHub issue and copy the diff using the provided issue template.

`);
          console.error(`Failed to read ${diffName} to edit the patch path. This was caused by: ${err}`);
          resolve(1);
        }

        // Matching Guidemaker scaffolding consists in replacing path guides/release with guides
        const unversionedFileName = unversionPath(filename);
        const replacement = unversionPath(data);

        fs.writeFile(diffName, replacement, 'utf8', function(err) {
          if (err) {
            warnings.push(`
ACTION REQUIRED: The patch paths could not be edited for ${diffName} because the file couldn't be edited.
-> Check what's the issue then edit the path manually:
 * Find and replace "guides/release" with "guides" in ${diffName}
 * Run "git apply ${diffName}"
   If the command is successful, commit the file.
   If the command fails, open a GitHub issue and copy the diff using the provided issue template.
            
            `);
            console.error(`Failed to write ${diffName} to edit the patch path. This was caused by: ${err}`);
            resolve(1);
          }
          console.log(`Path in ${diffName} updated`);
          // next commit, our diff file is now ready to be applied with 'git apply'
          resolve(0);
        });
      });
    });
  });
  console.log('Ready to create the patch files');
  return Promise.all(writePromises).then((result) => {
    const hasErrors = result.some((status) => status === 1);
    if (hasErrors) {
      console.log('Writing operations have been completed with errors. Some of the patch files are applied or stored in scripts/patches/, and manual actions have been added to the warning list.');
    } else {
      console.log('All writing operations have been completed without errors, patch files are applied or stored in scripts/patches/');
    }
  });
}

try {

  try {
    // Create a catchup branch out of the current branch (should be up to date master)
    runShell(`git switch --create ${catchupBranch}`);
    // Fetch the latest ref-upstream branch (English version under translation on this repo)
    runShell('git fetch');
    // Fetch the latest updates in the official Ember Guides
    runShell('git fetch upstream');
    // Output the list of markdown files impacted by latest changes on upstream
    runShell('git diff --name-only origin/ref-upstream upstream/master -- guides/release > list.diff');
  } catch (error) {
    throw new Error('Failed to create the diff between origin/ref-upstream and upstream/master in a new branch. The catchup cannot continue.');
  }

  // Read list.diff to extract the list of path to markdown files
  let data = fs.readFileSync('list.diff', 'utf8');
  files = data.split(/[\n\r]/).filter(name => name.length);
  fs.unlink('list.diff', function(err) {
    if (err) {
      console.error('Failed to delete list.diff');
    } else {
      console.log('list.diff did its job, deleted');
    }
  });

  // If there's no diff in the guides part, we can stop here
  if (files && files.length > 0) {

    // Create a directory to put the children diff
    fs.mkdirSync('scripts/patches', { recursive: true });
    console.log('scripts/patches folder created to store the patch files');

    await writeDiffFiles();

  } else {
    console.log('No change between both versions of the Ember Guides.');
  }

  printWarningMessages();

} catch (error) {
  console.error(error);
  process.exitCode = 1;
}