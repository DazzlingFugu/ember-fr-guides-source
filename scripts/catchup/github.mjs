
import chalk from 'chalk'
import { readFileSync } from 'fs';
import { log, action, raise, success } from './logger.mjs'

function issueTitle(shorterName, newEmberVersion) {
  return `Translate \`${shorterName}\`, Ember ${newEmberVersion}`
}

function issueBody(filename, currentEmberVersion, newEmberVersion, diffName) {
  return `
Please assign yourself to the issue or let a comment at the very moment you start the translation.

File: \`${filename}\`
From Ember: **${currentEmberVersion}**
To Ember: **${newEmberVersion}**

${issueBodyDiff(diffName)}
`
}

/* 
 * Generates the code snippet of the Github issues posted by postIssue function.
 * Note the diffName can be undefined if the file was initially non-existing in origin/ref-upstream branch,
 * this case happens when new pages are added to the latest version of the Ember Guides.
 */
function issueBodyDiff(diffName) {
  if (!diffName) return 'This is the first translation for this file.'

  // We need this replacement to not break the body string
  let diffblock = readFileSync(diffName, 'utf8');
  diffblock = diffblock.replaceAll('```', '');

  return `
In the snippet below, you can see what changes were done in the latest English documentation. The purpose of this issue is to adjust the French translation to match the new version:

\`\`\`diff
${diffblock}
\`\`\`
`
}

export default class GitHubAdapter {
  constructor(repo, token, currentEmberVersion, newEmberVersion, catchupBranch) {
    this.repo = repo
    this.token = token
    this.currentEmberVersion = currentEmberVersion
    this.newEmberVersion = newEmberVersion
    this.catchupBranch = catchupBranch
  }

  /* 
   * Returns the headers required for all requests to GitHub API.
   * It includes both posting issues and opening the catchup PR.
   */
  _getRequestHeaders() {
    return {
      'Accept': 'application/vnd.github+json',
      'Authorization': `token ${this.token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }
  }

  /*
   * Posts a GitHub issue for each file that couldn't be patched automatially.
   * It works with a classic for loop that pauses the execution during the request and wait one second after the answer is received.
   * This is done to control timing and concurrency, as explained in GitHub API documentation.
   */
  async postAllIssues(filesToPost) {
    let actionRequired = [];
    for (const file of filesToPost) {
      try {
        log(`Attempting to open an issue for ${chalk.magenta(file.filename)}`);
        await this.postIssue(file);
        success('Server responded successfully');
      } catch (error) {
        raise('Issue posting has failed:', error);
        actionRequired.push(action(`The issue for file ${file.filename} (${file.diffName}) couldn't be opened automatically.
 -> Open it manually using the dedicated issue template.
`));
      } finally {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    };
    return actionRequired;
  }

  async postIssue(file) {
    const { filename, diffName } = file;
    const shorterName = filename.substring(6);

    let response = await fetch(`https://api.github.com/repos/${this.repo}/issues`, {
      method: 'POST',
      headers: this._getRequestHeaders(this.token),
      body: JSON.stringify({
        title: issueTitle(shorterName, this.newEmberVersion),
        body: issueBody(filename, this.currentEmberVersion, this.newEmberVersion, diffName),
        labels: ['Guides FR trad']
      })
    });
    return response.json();
  }

  async openCatchupPR() {
    let response = await fetch(`https://api.github.com/repos/${this.repo}/pulls`, {
      method: 'POST',
      headers: this._getRequestHeaders(this.token),
      body: JSON.stringify({
        title: `Catch up latest docs: from ${this.currentEmberVersion} to ${this.newEmberVersion}`,
        body: 'This is an automatic catch up PR to align our non-translated documentation with the latest official documentation.',
        head: this.catchupBranch,
        base: 'master',
        labels: ['Guides FR trad']
      })
    });
    return response.json();
  }
}
