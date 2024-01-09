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
 * This function executes a shell command using execSync with an additional log.
 * If the command failed, execSync throws the error, so use runShell inside a try...catch.
 */
const runShell = (command) => {
  console.log(`Attempting to execute: "${command}"`);
  execSync(command);
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
    // Do something
  } else {
    console.log('No change between both versions of the Ember Guides.');
  }

} catch (error) {
  console.error(error);
  process.exitCode = 1;
}