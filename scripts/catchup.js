var fs = require('fs');
var shell = require('shelljs');

// Create a catchup branch out of the current branch (should be up to date master)
if (shell.exec('git checkout -b catchup').code !== 0) {
  console.log('shelljs: "git checkout -b catchup" command failed');
  shell.exit(1);
}

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

// Find and replace the paths to markdonw files to adjust it to our Guidemaker scaffolding
const renameDiffPath = (cbSplitDiff, cbRemoveAutoDiff) => {
  fs.readFile('english.diff', 'utf8', function (error, data) {
    if (error) {
      return console.log(error);
    }

    var result = data.replace(/guides\/release/g, 'guides');

    fs.writeFile('english.diff', result, 'utf8', function (error) {
      if (error) return console.log(error);
      cbSplitDiff(cbRemoveAutoDiff);
    });
  });
}

// Separate the diff into multiple files and try to apply
const splitDiff = (cbRemoveAutoDiff) => {
  fs.readFile('english.diff', 'utf8', function (error, data) {
    if (error) {
      return console.log(error);
    }
    // Consider a line starting with "diff --git b/" should be a diff block
    let search = /diff --git b\//;
    let blocks = data.split(search);

    // As files operations are not synchronous, let's keep track of the number of handled files
    let blockLength = blocks.length;
    let blockCounter = 0;

    // We'll keep in this array the "children diff" to remove after auto apply
    let autoApplyDone = [];

    blocks.forEach((block, index) => {
      if (block.length) {
        // Create a file scripts/diff-N containing only the current diff block
        fs.writeFile(`scripts/diff--${index}.diff`, `diff --git b/${block}`, function (err) {
          if (err) throw err;
          console.log(`scripts/diff--${index}.diff created`);
          if (shell.exec(`git apply scripts/diff--${index}.diff`).code !== 0) {
            console.log(`shelljs: "git apply" command failed for diff--${index}.diff`);
          } else {
            // If git apply worked, push the handled diff in the list of handled files
            autoApplyDone.push(`scripts/diff--${index}.diff`);
            console.log(`scripts/diff--${index}.diff applied automatically`);
          }
          blockCounter++;
          if (blockCounter >= blockLength - 1) {
            cbRemoveAutoDiff(autoApplyDone);
          }
        });
      }
    });
  });
}

// Remove applied diff
const removeAutoDiff = (autoApplyDone) => {
  autoApplyDone.forEach((filename) => {
    fs.unlink(filename, function(err) {
      if (err) {
         return console.error(err);
      }
      console.log(`${filename} handled and deleted`);
   });
  });
}

// Execute the functions to manage the diff one by one
renameDiffPath(
  splitDiff,
  removeAutoDiff
);
