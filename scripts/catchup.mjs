import fs from 'fs';
import shell from 'shelljs';

// Create a catchup branch out of the current branch (should be up to date master)
if (shell.exec('git checkout -b catchup').code !== 0) {
  console.log('shelljs: "git checkout -b catchup" command failed');
  shell.exit(1);
}

console.log('shelljs: "git checkout -b catchup" executed');

// Fetch the latest updates in the official Ember Guides
if (shell.exec('git fetch upstream').code !== 0) {
  console.log('shelljs: "git fetch upstream" command failed');
  shell.exit(1);
}

console.log('shelljs: "git fetch upstream" executed');

// Switch to ref-upstream to point to the English commit we are translating
if (shell.exec('git switch ref-upstream').code !== 0) {
  console.log('shelljs: "git switch ref-upstream" command failed');
  shell.exit(1);
}

console.log('shelljs: "git switch ref-upstream" executed');

// Output a diff file to visualize how the latest changes impact our current version
if (shell.exec('git diff -R upstream/master -- guides/release > english.diff').code !== 0) {
  console.log('shelljs: "git diff -R upstream/master -- guides/release > english.diff" command failed');
  shell.exit(1);
}

console.log('shelljs: "git diff -R upstream/master -- guides/release > english.diff" executed');

// Stash the english diff to ref-upstream so we can re-switch to catchup
if (shell.exec('git stash').code !== 0) {
  console.log('shelljs: "git stash" command failed');
  shell.exit(1);
}

console.log('shelljs: "git stash" executed');

// Go back to catchup branch where we want to actually apply the diff
if (shell.exec('git switch catchup').code !== 0) {
  console.log('shelljs: "git switch catchup" command failed');
  shell.exit(1);
}

console.log('shelljs: "git switch catchup" executed');

// Find and replace the paths to markdown files to adjust it to our Guidemaker scaffolding
let data = fs.readFileSync('english.diff', 'utf8');
let result = data.replace(/guides\/release/g, 'guides');
fs.writeFileSync('english.diff', result, 'utf8');

console.log('paths in english.diff updated from guides/release to guides');

/*
 * english.diff is now ready to be used on the catchup branch
 * Next step is to separate it into multiple patch files then
 * try to apply these patches with git apply
 */

// This function removes the patch files applied successfully
const removeAutoDiff = async (autoApplyDone) => {
  autoApplyDone.forEach((filename) => {
    fs.unlink(filename, function(err) {
      if (err) throw err;
      console.log(`${filename} did its job, deleted`);
   });
  });
}

// This function copies each block found in english.diff into a patch file and try to apply
const splitDiff = async (blocks, autoApplyDone) => {
  let writePromises = blocks.filter(block => block.length).map((block, index) => {
    return new Promise((resolve, reject) => {
      // Create a file scripts/patches/diff-N containing only the current diff block
      fs.writeFile(`scripts/patches/diff--${index}.diff`, `diff --git b/${block}`, function (err) {
        if (err) reject(err);
        console.log(`scripts/patches/diff--${index}.diff created`);
        if (shell.exec(`git apply scripts/patches/diff--${index}.diff`).code !== 0) {
          console.log(`shelljs: "git apply" command failed for diff--${index}.diff`);
        } else {
          // If git apply worked, push the handled diff in the list of handled files
          autoApplyDone.push(`scripts/patches/diff--${index}.diff`);
          console.log(`scripts/patches/diff--${index}.diff applied automatically`);
        }
        resolve();
      });
    });
  });
  console.log('ready to create the patch files');
  await Promise.all(writePromises).then(() => {
    console.log('english.diff split done, patch files are applied or stored in scripts/patches/');
  });
}

// Create a directory to put the children diff
fs.mkdirSync('scripts/patches');
console.log('scripts/patches folder created to store the patch files');
// Assume that a line of english.diff starting with "diff --git b/" should be a diff block
data = fs.readFileSync('english.diff', 'utf8');
let search = /diff --git b\//;
let blocks = data.split(search);
// We'll keep in this array the children diff to remove after auto apply
let autoApplyDone = [];
// For each block, create a child diff & try to apply it automatically
await splitDiff(blocks, autoApplyDone);
// Remove patch file for all successful apply
removeAutoDiff(autoApplyDone);
