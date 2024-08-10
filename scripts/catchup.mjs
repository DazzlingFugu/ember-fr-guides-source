import 'dotenv/config'
import chalk from 'chalk'
import fs from 'fs'
import minimist from 'minimist-lite'
import { processFiles } from './catchup/filesProcessor.mjs'
import { initCatchup, pushGuides, updateRefUpstream } from './catchup/gitActions.mjs'
import GitHubAdapter from './catchup/github.mjs'
import { log, raise, success, warn, runShell, printActionsRequired, action } from './catchup/logger.mjs'

/* ------------------------------------------------------------------ */
const REPO = 'DazzlingFugu/ember-fr-guides-source'
/* ------------------------------------------------------------------ */

const argv = minimist(process.argv.slice(2), { string: ['from', 'to'] });

// Read current Ember version (under translation)
const currentEmberVersion = `${argv.from}`;
if (currentEmberVersion.match(/\d+[.]\d+/g)?.[0] !== currentEmberVersion) {
  raise(`please provide the current Ember version under translation to option ${chalk.cyan.bold('--from')} (e.g. --from=5.1)`)
  process.exit(9);
}
log(`Ember version under translation: ${chalk.cyan.bold(currentEmberVersion)}`);

// Read new Ember version (documented by the English guides)
const newEmberVersion = `${argv.to}`;
if (newEmberVersion.match(/\d+[.]\d+/g)?.[0] !== newEmberVersion) {
  raise(`please provide the new Ember version documented on upstream to option ${chalk.cyan.bold('--to')} (e.g. --to=5.4)`)
  process.exit(9);
}
log(`New Ember version documented on upstream: ${chalk.cyan.bold(newEmberVersion)}`);

// Name of the catchup branch we will work on
const catchupBranch = `catchup-${newEmberVersion}`;

function fsIssueOnApplyPatches() {
  return action(`Something went wront while processing the patch files, so you can choose one of the following options:
-> Go back to master branch, delete this branch and try to rerun the script.
  If you run into the same result, investigate what part of the script cause the problem, or complete the catchup manually.
  To complete the catchup manually:
-> Follow all the ACTION REQUIRED above to process the patch files manually.
  If the present catchup branch has changes in the guides folder, run:
  * git add guides
  * git commit -m "feat: automatic catch up from ${currentEmberVersion} to ${newEmberVersion}"
  * git push origin ${catchupBranch}
  * Then open the catchup PR on GitHub
  -> Once this is done, run:
    * git switch ref-upstream
    * git reset --hard upstream/master
    * git push origin -f ref-upstream

  `)
}

function gitIssueOnPushGuides() {
  return action(`Failed to push the catchup branch
-> Check what's the issue, then push the changes and open the Github PR manually:
  * git add guides
  * git commit -m "feat: automatic catch up from ${currentEmberVersion} to ${newEmberVersion}"
  * git push origin ${catchupBranch}
  * Then open the catchup PR on GitHub

`)
}

function requestIssueOnOpenPR() {
  return action(`The catchup PR was not opened automatically on GitHub.
-> Check what's the issue, then open the PR on GitHub manually.

  `)
}

function gitIssueOnUpdateRefUpstream() {
  return action(`The process is complete, but failed to reset ref-upstream to the latest upstream/master. 
-> Perform manually:
* git switch ref-upstream
* git reset --hard upstream/master
* git push origin -f ref-upstream

  `)
}

function requestIssueSummary() {
  return action(`Some of the steps failed while opening the GitHub issues and catchup branch.
-> Follow all the ACTION REQUIRED above to complete the catchup.
  Once this is done, run:
    * git switch ref-upstream
    * git reset --hard upstream/master
    * git push origin -f ref-upstream

  `);
}

try {
  // Create and read list.diff to extract the list of filenames that changed between origin/ref-upstream and upstream/master
  initCatchup(catchupBranch);
  let data = fs.readFileSync('list.diff', 'utf8');
  let files = data.split(/[\n\r]/).filter(name => name.length);

  // If there's no diff in the guides part, we can stop here
  if (!files && !files.length) {
    success('No change between both versions of the Ember Guides.')
    try {
      updateRefUpstream()
    } catch(error) {
      printActionsRequired([gitIssueOnUpdateRefUpstream()])
    }
  }

  /* 
   * Process the diff:
   * For each file, processFiles creates an indivitual patch file
   * and tries to "git apply" it automatically.
   */
  let { 
    filesToPost, // These are the files - new or translated - that require a GitHub issue to be handled by translators
    hasAutoApply, // This is true if at least one file has been patched automatically, so we'll have to open a PR to merge the patch
    hasDiffIssues, // This is true if there was a problem while processing the patch files
    actionsRequired // These are the manual actions to do to get a ready-for-GitHub list of patches if something went wrong.
  } = await processFiles(files);

  // If there were issues processing the file, we stop the catchup and simply explain how to terminate it manually 
  if (hasDiffIssues) {
    actionsRequired.push(fsIssueOnApplyPatches());
    printActionsRequired(actionsRequired);
    throw new Error('Something went wront while processing the patch files');
  }

  // Object in charge to perform requests to GitHub API
  const githubAdapter = new GitHubAdapter(
    REPO,
    process.env.GITHUB_TOKEN,
    currentEmberVersion,
    newEmberVersion,
    catchupBranch
  );

  /* 
   * Post GitHub issues for diff files that couldn't be handled automatically.
   * We await so the POST for issues and the POST for the catchup PR below are not done at the same time. 
   * The returned actionRequired keep track of the failed request, so we can easily complete the catchup manually
   */
  actionsRequired = await githubAdapter.postAllIssues(filesToPost);

  // If there's at least one patched file to commit, let's commit it and open a catch-up PR
  if (hasAutoApply) {
    try {
      pushGuides(currentEmberVersion, newEmberVersion, catchupBranch)
      try {
        log('Attempting to post the catch up PR');
        await githubAdapter.openCatchupPR();
        success('Server responded successfully');
      } catch (error) {
        raise(`Failed to post the catchup PR. This was caused by: ${error}`);
        actionsRequired.push(requestIssueOnOpenPR());
      }
    } catch (error) {
      raise(error);
      actionsRequired.push(gitIssueOnPushGuides());
    }
  }

  // If at least one request failed, we stop the catchup and print the explanations to complete manually
  if (actionsRequired.length > 0) {
    actionsRequired.push(requestIssueSummary());
    printActionsRequired(actionsRequired);
    throw new Error('Something went wrong while posting the GitHub issues and catchup branch');
  }

  try {
    updateRefUpstream()
    try {
      runShell('git switch master');
    } catch (error) {
      warn('The catchup is fully completed, but the process failed to switch back to master');
    }
  } catch(error) {
    printActionsRequired([gitIssueOnUpdateRefUpstream()]);
    throw new Error(error);
  }
  
  // Files clean-up
  try {
    fs.unlinkSync('list.diff');
    fs.rmSync('scripts/patches', { recursive: true, force: true });
    log('list.diff and scripts/patches folder and files did their job, deleted');
  } catch(error) {
    warn('The catchup is fully completed, but the process failed to delete list.diff, scripts/patches folder and its content.')
  }
} catch (error) {
  raise(error);
  process.exitCode = 1;
}
