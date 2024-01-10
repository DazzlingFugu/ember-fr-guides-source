import 'dotenv/config';
import { execSync } from 'child_process';
import fs from 'fs';
import minimist from 'minimist-lite';

// Declare repository
const repo = 'DazzlingFugu/ember-fr-guides-source';

// Read Github token
const token = process.env.GITHUB_TOKEN;

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

// True if the ref-upstream branch cannot be updated because we need some manual checks between ref-upstream and upstream/master
let hasPendingDiff = false;

// Some issues haven't been posted on Github, so it would be neat to stay on the catchup branch at the end of the process
let issuePostingError = false;

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

          // Once diff paths are ready, run "git apply" to patch the markdown file automatically
          try {
            // Does the current file already exist or is it a new page in the Ember Guides?
            let isNew = !fs.existsSync(unversionedFileName);
            // git apply runs after we've initialized isNew, because it can create the missing file
            runShell(`git apply ${diffName}`);
            // If the page is new, git apply works but we still need to push an issue
            if (isNew) filesToPost.push({ filename: unversionedFileName });
            // Remove the file if the apply was successfull
            fs.unlink(diffName, function(err) {
              if (err) {
                console.error(err);
              } else {
                console.log(`${diffName} handled and deleted`);
              }
            });
            resolve(0);
          } catch (error) {
            console.log(`"git apply" command failed for ${diffName}`);
            filesToPost.push({ filename: unversionedFileName, diffName });
            resolve(2);
          }
          resolve(0);
        });
      });
    });
  });
  console.log('Ready to create the patch files');
  return Promise.all(writePromises).then((result) => {
    const hasErrors = result.some((status) => status === 1);
    if (hasErrors) {
      hasPendingDiff = true;
      console.log('Writing operations have been completed with errors. Some of the patch files are applied or stored in scripts/patches/, and manual actions have been added to the warning list.');
    } else {
      console.log('All writing operations have been completed without errors, patch files are applied or stored in scripts/patches/');
    }
    return result.some((status) => status === 0);
  });
}

/* 
 * This function returns the headers required for all requests to GitHub API.
 * It includes both posting issues and opening the catchup PR.
 */
const getRequestHeaders = () => {
  return {
    'Accept': 'application/vnd.github+json',
    'Authorization': `token ${token}`,
    'X-GitHub-Api-Version': '2022-11-28'
  }
}

/* 
 * This function generates the body of the Github issues posted by postIssue function.
 * Note the diffBlock can be undefined if the file was initially non-existing in origin/ref-upstream branch,
 * this case happens when new pages are added to the latest version of the Ember Guides.
 */
const getIssueBody = (filename, diffblock) => {
  diffblock = diffblock 
    ? `
In the snippet below, you can see what changes were done in the latest English documentation. The purpose of this issue is to adjust the French translation to match the new version:

\`\`\`diff
${diffblock}
\`\`\`
`
    : 'This is the first translation for this file.';
  return `
Please assign yourself to the issue or let a comment at the very moment you start the translation.
      
File: \`${filename}\`
From Ember: **${currentEmberVersion}**
To Ember: **${newEmberVersion}**

${diffblock}
`
}

// This function posts a GitHub issue related to the given file
const postIssue = (file) => {
  const { filename, diffName } = file;
  const shorterName = filename.substring(6);

  let diffblock;
  if (diffName) {
    // We need this replacement to not break the body string
    diffblock = fs.readFileSync(diffName, 'utf8');
    diffblock = diffblock.replaceAll('```', '');
  }

  return fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: 'POST',
    headers: getRequestHeaders(),
    body: JSON.stringify({
      title: `Translate \`${shorterName}\`, Ember ${newEmberVersion}`,
      body: getIssueBody(filename, diffblock),
      labels: ['Guides FR trad']
    })
  });
}

const openCatchupPR = () => {
  return fetch(`https://api.github.com/repos/${repo}/pulls`, {
    method: 'POST',
    headers: getRequestHeaders(),
    body: JSON.stringify({
      title: `Catch up latest docs: from ${currentEmberVersion} to ${newEmberVersion}`,
      body: 'This is an automatic catch up PR to align our non-translated documentation with the latest official documentation.',
      head: catchupBranch,
      base: 'master',
      labels: ['Guides FR trad']
    })
  });
}

/*
 * This function post a GitHub issue for each file that couldn't be patched automatially.
 * It works with a classic for loop that pauses the execution during the request and wait one second after the answer is received.
 * This is done to control timing and concurrency, as explained in GitHub API documentation.
 */
const postAllIssues = async () => {
  for (const file of filesToPost) {
    try {
      console.log(`Attempting to open an issue for ${file.filename}`);
      const response = await postIssue(file);
      const jsonResponse = await response.json();
      console.log('Server responded with:', jsonResponse);
    } catch (error) {
      console.error('Issue posting has failed:', error);
      warnings.push(`
ACTION REQUIRED: The issue for file ${file.filename} (${file.diffName}) couldn't be opened automatically.
-> Open it manually using the dedicated issue template.

`);
      issuePostingError = true;
    } finally {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  // If one of the post failed, we keep the diff files so we can easily open the issue manually
  if (issuePostingError) {
    console.error("At least one Github issue was not posted, scripts/patches folder won't be deleted so missing issues can be posted manually");
  } else {
    try {
      // If and once the issues are posted, delete patches folder and files
      fs.rmSync('scripts/patches', { recursive: true, force: true });
      console.log('scripts/patches folder and files did their job, deleted');
    } catch(error) {
      console.error('Failed to delete the folder scripts/patches and its content.')
    }
  }
}

/*
 * This function adds, commits, and pushes the modifications in "guides" folder
 */
const pushChanges = () => {
  try {
    runShell('git add guides');
    runShell(`git commit -m "feat: automatic catch up from ${currentEmberVersion} to ${newEmberVersion}"`);
    runShell(`git push origin ${catchupBranch}`);
  } catch (error) {
    warnings.push(`
ACTION REQUIRED: Failed to push the catchup branch
-> Check what's the issue, then push the changes and open the Github PR manually.

`);
    throw error;
  }
}

/*
 * This function performs a switch to the master branch.
 * The error message highlights the fact this is perform at the end of the process,
 * to warn the developer that despite this last error, the process is completed.
 */
const switchToMaster = () => {
  try {
    runShell('git switch master');
  } catch (error) {
    console.error('The process is complete, but failed to switch back to master');
  }
}

/*
 * This function performs a switch to the catchup branch.
 * The success message highlights the fact this is perform at the end of the process, 
 * to exit on the catchup branch so post failures can be easily handled manually.
 */
const switchToCatchup = () => {
  try {
    runShell(`git switch ${catchupBranch}`);
    console.log('Stay on the catchup branch at the end of the process, so non-posted issues can be handled.');
  } catch (error) {
    console.error(`The process is complete, but failed to switch back to ${catchupBranch}`);
    warnings.push(`
ACTION REQUIRED: The process failed to switch back to ${catchupBranch}. 
-> Switch manually to ${catchupBranch} then complete the other required actions.

  `);
  }
}

/*
 * This function switches to the ref-upstream branch to reset it to the latest upstream/master,
 * then it pushes ref-upstream branch to the origin repository.
 */
const updateRefUpstream = () => {
  try {
    runShell('git switch ref-upstream');
    runShell('git reset --hard upstream/master');
    runShell('git push origin -f ref-upstream');
  } catch (error) {
    warnings.push(`
ACTION REQUIRED: The process failed to reset ref-upstream to the latest upstream/master. 
-> Perform manually:
* git switch ref-upstream
* git reset --hard upstream/master
* git push origin -f ref-upstream
  `);
    throw new Error('Failed to reset ref-upstream to the latest upstream/master');
  }
}

/*
 * This function performs the last actions once most of the catchup is done
 * It updates ref-upstream to upstream/master if there's no pending manual action,
 * then it switches back to master.
 */
const closeProcess = () => {
  if (hasPendingDiff) {
    warnings.push(`
ACTION REQUIRED: To manage some of the warnings above, you might need to use ref-upstream in its current state, so it was not updated. 
-> Once you are done with everything above, run:
 * git switch ref-upstream
 * git reset --hard upstream/master
 * git push origin -f ref-upstream

  `);
  }
  else {
    try {
      /* Reset ref-upstream to the current upstream/master to get ready for the next catchup
       * ref-upstream should always match the version under translation */
      updateRefUpstream();

      /* Then go back to master only if there's no diff file to post manually.
       * If there are diff files to post manually, then it's more convinient to stay on the catchup branch */
      if (!issuePostingError) {
        switchToMaster();
      } else {
        switchToCatchup();
      }
    } catch(error) {
      throw error;
    }
  }
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

    /* Try to apply the diff files automatically and keep track of the failed and new ones.
     * hasAutoApply is true if at least one file could be patched automatically. */
    let hasAutoApply = await writeDiffFiles();
    console.log('Files to post on GitHub:', filesToPost);

    /* Post Github issues for diff files that couldn't be handled automatically
     * we await so the POST for issues and the POST for the catchup PR below are not done at the same time */
    await postAllIssues();

    // Post the catchup PR if there's at least one patched file to commit
    if (hasAutoApply) {
      try {
        pushChanges();

        try {
          console.log('Attempting to post the catch up PR');
          const prResponse = await openCatchupPR();
          const jsonPrResponse = await prResponse.json();
          console.log('Server responded with:', jsonPrResponse);
        } catch (error) {
          console.error(`Failed to post the catchup PR. This was caused by: ${error}`);
          warnings.push(`
ACTION REQUIRED: The catchup PR was not opened automatically on GitHub.
-> Chack what's the issue, then open the PR on GitHub manually.
  
  `);
        }

      } catch (error) {
        console.error('Failed to push the catchup branch.');
      }
    }

  } else {
    console.log('No change between both versions of the Ember Guides.');
  }

  closeProcess();
  printWarningMessages();

} catch (error) {
  console.error(error);
  printWarningMessages();
  process.exitCode = 1;
}