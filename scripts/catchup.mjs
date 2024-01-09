import { execSync } from 'child_process';
import fs from 'fs';

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
    runShell('git switch --create catchup');
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