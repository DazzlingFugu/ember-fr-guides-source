import chalk from 'chalk'
import { existsSync, mkdirSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { log, raise, action, runShell, success, warn } from "./logger.mjs"
import { createDiff } from "./gitActions.mjs"

function patchIssueOnRead(diffName) {
  return action(`The patch paths could not be edited for ${chalk.magenta.bold(diffName)} because the file couldn't be read.
-> Check what's the issue then edit the path manually:
* Find and replace "guides/release" with "guides" in ${chalk.magenta.bold(diffName)}
* Run "git apply ${chalk.magenta.bold(diffName)}"
  If the command is successful, commit the file.
  If the command fails, open a GitHub issue and copy the diff using the provided issue template.
  
  `)
}

function patchIssueOnEdit(diffName) {
  return action(`The patch paths could not be edited for ${chalk.magenta.bold(diffName)} because the file couldn't be edited.
-> Check what's the issue then edit the path manually:
* Find and replace "guides/release" with "guides" in ${chalk.magenta.bold(diffName)}
* Run "git apply ${chalk.magenta.bold(diffName)}"
  If the command is successful, commit the file.
  If the command fails, open a GitHub issue and copy the diff using the provided issue template.
  
  `)
}

/*
 * Looks for the paths guides/release in the provided string and replaces it with guides.
 * We need this to adjust the paths to our scaffolding:
 * The official English guides allow to navigate to legacy versions of Ember, it's "versioned" docs.
 * The French guides show only the latest version, so we don't have a dropdown to navigate, it's "unversioned" docs.
 * It's the scaffolding of the guides folder that impacts the dropdown presence: instead of having a release/ folder
 * that corresponds to the latest version, we have the docs at the root of guides directly.
 */
function unversionPath(stringContent) {
  return stringContent.replace(/guides\/release/g, 'guides')
}

/* 
 * Executes all the read/write operations on diff files.
 * files is the list of files (as paths) that changed between ref-upstream and upstream/master
 */
async function applyPatches(files) {
  /* 
   * List of { filename, diffname} that will require a GitHub issue to be adjust manually
   * Example: pushing { filename: "my-page.md", diffName: "3.diff" } in this array means that
   * the diff between origin/ref-upstream and upstream/master for the file "my-page.md" has been printed in "3.diff".
   * The command "git apply 3.diff" failed, probably because "my-page.md" was already translated into French.
   * Therefore, we need to open a GitHub issue showing the diff English to English so translators know how to adjust the translation.
   */
  let filesToPost = []
  let actionsRequired = []

  // This is an array of promises we're going to run in parallel to process all the diff files
  let writePromises = await files.map(async (filename, index) => {
    // Matching Guidemaker scaffolding consists in replacing path guides/release with guides
    const unversionedFileName = unversionPath(filename)
    let diffName
  
    try {
      // We create the diff between origin/ref-upstream and upstream/master
      diffName = createDiff(filename, index)
      // Then we read the content of the newly created diff
      let fileContent
      try {
        fileContent = await readFile(diffName, 'utf8')
      } catch (error) {
        actionsRequired.push(patchIssueOnRead(diffName))
        throw new Error(`Failed to read ${chalk.magenta.bold(diffName)} to edit the patch path. This was caused by: ${error}`)
      }
      // To replace all paths to guides/release with guides
      try {
        const replacement = unversionPath(fileContent)
        fileContent = await writeFile(diffName, replacement, 'utf8')
        success(`Path in ${chalk.bold(diffName)} updated`)
      } catch (error) {
        actionsRequired.push(patchIssueOnEdit(diffName))
        throw new Error(`Failed to write ${chalk.magenta.bold(diffName)} to edit the patch path. This was caused by: ${error}`)
      }
    } catch (error) {
      raise(error)
      return 1
    }

    // Once diff paths are ready, run "git apply" to patch the markdown file automatically
    try {
      // Does the current file already exist or is it a new page in the Ember Guides?
      let isNew = !existsSync(unversionedFileName)
      // git apply runs after we've initialized isNew, because it can create the missing file
      runShell(`git apply ${diffName}`)
      // If the page is new, git apply works but we still need to push an issue for the 1st translation
      if (isNew) filesToPost.push({ filename: unversionedFileName })
      return 0
    } catch (error) {
      // git apply fails if the file was modified on both sides, so it's an already-translated file
      warn(`"git apply" command failed for ${chalk.magenta.bold(diffName)}`)
      filesToPost.push({ filename: unversionedFileName, diffName })
      return 2
    }
  })

  log('Ready to create the patch files')
  let result = await Promise.all(writePromises)

  const hasDiffIssues = result.some((status) => status === 1)
  if (hasDiffIssues) {
    raise('Writing operations terminated with errors. Some of the patch files are applied or stored in scripts/patches/, and items have been added to the "action required" list.')
  } else {
    success('All writing operations completed without errors, patch files are applied or stored in scripts/patches/')
  }
  return { 
    filesToPost,
    hasAutoApply: result.some((status) => status === 0),
    hasDiffIssues,
    actionsRequired,
  }
}

export async function processFiles(files) {
  // Create a directory to put the children diff
  mkdirSync('scripts/patches', { recursive: true });
  log('scripts/patches folder created to store the patch files');

  /* Try to apply the diff files automatically and keep track of the failed ones.
    * hasAutoApply is true if at least one file could be patched automatically. */
  let results = await applyPatches(files);
  log(`Files to post on GitHub: ${chalk.bold.magenta(results.filesToPost.map(({ filename }) => filename))}`);
  return results;
}