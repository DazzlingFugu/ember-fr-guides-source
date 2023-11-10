var shell = require('shelljs');

// Fetch the latest updates in the official Ember Guides
if (shell.exec('git fetch upstream').code !== 0) {
  shell.echo('shelljs: "git fetch upstream" command failed');
  shell.exit(1);
}

shell.echo('shelljs: "git fetch upstream" executed');

// Switch to ref-upstream to point to the English commit we are translating
if (shell.exec('git switch ref-upstream').code !== 0) {
  shell.echo('shelljs: "git switch ref-upstream" command failed');
  shell.exit(1);
}

shell.echo('shelljs: "git switch ref-upstream" executed');

// Output a diff file to visualize how the latest changes impact our current version
if (shell.exec('git diff -R upstream/master -- guides/release > english.diff').code !== 0) {
  shell.echo('shelljs: "git diff -R upstream/master -- guides/release > english.diff" command failed');
  shell.exit(1);
}

shell.echo('shelljs: "git diff -R upstream/master -- guides/release > english.diff" executed');
