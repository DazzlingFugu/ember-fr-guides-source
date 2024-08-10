import { runShell } from "./logger.mjs";

export function initCatchup(catchupBranch) {
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
    throw new Error('Failed to create the diff between origin/ref-upstream and upstream/master in a new branch');
  }
}

// Adds, commits, and pushes the modifications only in "guides" folder
export function pushGuides(currentEmberVersion, newEmberVersion, catchupBranch) {
  try {
    runShell('git add guides');
    runShell(`git commit -m "feat: automatic catch up from ${currentEmberVersion} to ${newEmberVersion}"`);
    runShell(`git push origin ${catchupBranch}`);
  } catch (error) {
    throw new Error('Failed to push the catchup branch.');
  }
}

/* 
 * Reset ref-upstream to the current upstream/master to get ready for the next catchup
 * ref-upstream should always match the version under translation
*/
export function updateRefUpstream() {
  try {
    runShell('git switch ref-upstream');
    runShell('git reset --hard upstream/master');
    runShell('git push origin -f ref-upstream');
  } catch (error) {
    throw new Error('Failed to reset ref-upstream to the latest upstream/master');
  }
}

/* 
 * Compares the given filename in both branches and output a [index].diff file.
 * Example: 
 * filename = guides/accessibility/index.md, index = 3
 * The diff between ref-upstream and upstream/master for this file is printed in 3.diff
 */
export function createDiff(filename, index) {
  const diffName = `scripts/patches/${index}.diff`;
  try {
    runShell(`git diff ref-upstream upstream/master -- ${filename} > ${diffName}`);
    return diffName;
  } catch (error) {
    throw new Error(`Failed to create the diff for ${filename}. This was caused by: ${err}`);
  }
}