import 'dotenv/config';
import fetch from 'node-fetch';
import fs from 'fs';
import minimist from 'minimist-lite';
import shell from 'shelljs';

// Declare repository
const repo = 'dazzlingfugu/ember-fr-guides-source';

// Read Github token
const token = process.env.GITHUB_TOKEN;

// Read script arguments
const argv = minimist(process.argv.slice(2));

const currentEmberVersion = `${argv.from}`;
if (currentEmberVersion.match(/\d+[.]\d+/g)?.[0] !== currentEmberVersion) {
  console.log('Error: please provide the current Ember version under translation to option --from (e.g. --from=5.1)');
  process.exit(2);
}
console.log(`Ember version under translation: ${currentEmberVersion}`);

const newEmberVersion = `${argv.to}`;
if (newEmberVersion.match(/\d+[.]\d+/g)?.[0] !== newEmberVersion) {
  console.log('Error: please provide the new Ember version documented on upstream to option --to (e.g. --to=5.4)');
  process.exit(2);
}
console.log(`New Ember version documented on upstream: ${newEmberVersion}`);

// Create a catchup branch out of the current branch (should be up to date master)
const catchupBranch = `catchup-${newEmberVersion}`;

if (shell.exec(`git switch --create ${catchupBranch}`).code !== 0) {
  console.log(`shelljs: "git switch --create ${catchupBranch}" command failed`);
  process.exit(1);
}
console.log(`shelljs: "git switch --create ${catchupBranch}" executed`);

// Fetch the latest updates in the official Ember Guides
if (shell.exec('git fetch upstream').code !== 0) {
  console.log('shelljs: "git fetch upstream" command failed');
  process.exit(1);
}
console.log('shelljs: "git fetch upstream" executed');

// Output the list of markdown files impacted by latest changes on upstream
if (shell.exec('git diff --name-only ref-upstream upstream/master -- guides/release > list.diff').code !== 0) {
  console.log('shelljs: "git diff --name-only ref-upstream upstream/master -- guides/release > list.diff" command failed');
  process.exit(1);
}
console.log('shelljs: "git diff --name-only ref-upstream upstream/master -- guides/release > list.diff" executed');

// Read list.diff to extract the list of path to markdown files
let data = fs.readFileSync('list.diff', 'utf8');
let files = data.split(/[\n\r]/).filter(name => name.length);
fs.unlink('list.diff', function(err) {
  if (err) throw err;
  console.log('list.diff did its job, deleted');
});

// Create a directory to put the children diff
fs.mkdirSync('scripts/patches');
console.log('scripts/patches folder created to store the patch files');

// Compare filename in both branches and output a [index].diff
const createDiff = (filename, index) => {
  const diffName = `scripts/patches/${index}.diff`
  if (shell.exec(`git diff ref-upstream upstream/master -- ${filename} > ${diffName}`).code !== 0) {
    console.log(`shelljs: "git diff ref-upstream upstream/master -- ${filename} > ${diffName}" command failed`);
    process.exit(1);
  }
  console.log(`shelljs: "git diff ref-upstream upstream/master -- ${filename} > ${diffName}" executed`);
  return diffName;
}

// Execute all the read/write/unlink operations on diff files
const writeDiffFiles = async (filesToPost) => {
  let writePromises = files.map((filename, index) => {
    const diffName = createDiff(filename, index);
    return new Promise((resolve, reject) => {
      // Rewrite the path to adjust it to our Guidemaker scaffolding
      fs.readFile(diffName, 'utf8', function(err, data) {
        if (err) reject(err);
        const replacement = data.replace(/guides\/release/g, 'guides');
        fs.writeFile(diffName, replacement, 'utf8', function(err) {
          if (err) reject(err);
          console.log(`path in ${diffName} updated`);
          // Try to apply automatically
          if (shell.exec(`git apply ${diffName}`).code !== 0) {
            shell.echo(`shelljs: "git apply" command failed for ${diffName}`);
            filesToPost.push({filename, diffName})
          } else {
            // Remove the file if the apply was successfull
            fs.unlink(diffName, function(err) {
              if (err) throw err;
              console.log(`${diffName} handled and deleted`);
            });
          }
          resolve();
        });
      });
    });
  });
  console.log('Ready to create the patch files');
  await Promise.all(writePromises).then(() => {
    console.log('All writing operations are done, patch files are applied or stored in scripts/patches/');
  });
}

// Post a GitHub issue
const postIssue = (file) => {
  const { filename, diffName } = file;
  let diffblock = fs.readFileSync(diffName, 'utf8');
  diffblock = diffblock.replaceAll('```', '');
  let shorterName = filename.substring(14);

  return fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `token ${token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: JSON.stringify({
      title: `Translate \`${shorterName}\`, Ember ${newEmberVersion}`,
      body: `
Please assign yourself to the issue or let a comment at the very moment you start the translation.
        
File: \`${filename}\`
From Ember: **${currentEmberVersion}**
To Ember: **${newEmberVersion}**
        
\`\`\`diff
${diffblock}
\`\`\`
      `,
      labels: ['Guides FR trad']
    })
  });
}

// Try to apply the diff files automatically and keep track of the failed ones
let filesToPost = [];
await writeDiffFiles(filesToPost);
console.log('Files to post on GitHub', filesToPost);

let issuePostingError = false;

// Post the diff files content that couldn't be handled automatically to Github
filesToPost.forEach(async (file) => {
  try {
    console.log(`Attempting to open an issue for ${file.filename}`);
    const response = await postIssue(file);
    const jsonResponse = await response.json();
    console.log('Server responded with:', jsonResponse);
  } catch (error) {
    console.log('Issue posting has failed:', error);
    issuePostingError = true;
  }
  await new Promise(resolve => setTimeout(resolve, 1000));
});

if (!issuePostingError) {
  // Once the issues are posted, delete patches folder and files
  fs.rmSync('scripts/patches', { recursive: true, force: true });
  console.log('scripts/patches folder and files did their job, deleted');
}
// If one of the post failed, the files are still here so we can easily open the issue manually

// Add, commit, push the modifications done automatically so far
if (shell.exec('git add guides').code !== 0) {
  console.log('shelljs: "git add guides" command failed');
  process.exit(1);
}
console.log('shelljs: "git add guides" executed');

if (shell.exec(`git commit -m "feat: automatic catch up from ${currentEmberVersion} to ${newEmberVersion}"`).code !== 0) {
  console.log('shelljs: "git commit -m" command failed');
  process.exit(1);
}
console.log('shelljs: "git commit -m" executed');

if (shell.exec(`git push origin ${catchupBranch}`).code !== 0) {
  console.log(`shelljs: "git push origin ${catchupBranch}" command failed`);
  process.exit(1);
}
console.log(`shelljs: "git push origin ${catchupBranch}" executed`);

// Post the catchup PR
try{
  console.log('Attempting to post the catch up PR');
  const prResponse = await fetch(`https://api.github.com/repos/${repo}/pulls`, {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `token ${token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: JSON.stringify({
      title: `Catch up latest docs: from ${currentEmberVersion} to ${newEmberVersion}`,
      body: 'This is an automatic catch up PR to align our non-translated documentation with the latest official documentation.',
      head: catchupBranch,
      base: 'master',
      labels: ['Guides FR trad']
    })
  });
  const jsonPrResponse = await prResponse.json();
  console.log('Server responded with:', jsonPrResponse);
} catch (error) {
  console.log('Catch up PR posting has failed:', error);
}

// Replace ref-upstream with current upstream then go back to master
if (shell.exec('git switch ref-upstream').code !== 0) {
  console.log('shelljs: "git switch ref-upstream" command failed');
  process.exit(1);
}
console.log('shelljs: "git switch ref-upstream" executed');

if (shell.exec('git reset --hard upstream/master').code !== 0) {
  console.log('shelljs: "git reset --hard upstream/master" command failed');
  process.exit(1);
}
console.log('shelljs: "git reset --hard upstream/master" executed');

if (shell.exec('git push origin -f ref-upstream').code !== 0) {
  console.log('shelljs: "git push origin -f ref-upstream" command failed');
  process.exit(1);
}
console.log('shelljs: "git push origin -f ref-upstream" executed');

if (shell.exec('git switch master').code !== 0) {
  console.log('shelljs: "git switch master" command failed');
  process.exit(1);
}
console.log('shelljs: "git switch master" executed');