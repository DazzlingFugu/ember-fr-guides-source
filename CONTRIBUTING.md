# Contributing

The French Ember Guides are maintained by a (small) all-volunteer group of the Ember French community members. We'd love to have you join our efforts to translate the Guides and make Ember more accessible to French developers!

Here are a few ways you can help:

* _Contributing to the Guides' translation_: Visit the repository issues and pick one labeled "**Guides FR trad**". Assigned it to yourself or post a comment as soon as you start working to let maintainers know you are on it. If the file you wish to translate is missing in the issues, open a new issue using the template "File to translate".

* _Writing infrastructure code_: You can also help out with the French Guides by improving the code that is used to build the content. The French Guides rely almost entirely on [ember-learn/guides-source](https://github.com/ember-learn/guides-source) sources, a script clones `guide-source` repository to build the app using the French content instead of the official English one. If you have a specific issue that you are trying to fix and you're not sure which repo to work on then it is worth opening an issue on this repo and we can help to point you in the right direction.

Please note that no attempt is made to translate content for older versions of the Guides. We focus only on the current release.

If you have questions, want a suggestion of what to work on, or would like a buddy to pair with, you can join the #-lang-french channel in the [Ember Community Discord](https://discordapp.com/invite/zT3asNS).

## Making Your First Translation PR

- Fork this repository (click "fork" on the repository's home page in GitHub)

- Clone the forked repository with `git clone <your fork's url>` and create a branch with `git checkout -b some-branch-name`.

- Keep your commit stack clean with one commit, for instance: `git commit -m "feat: translate guides/release/index.md`

- Once you're at the point that you'd like feedback, submit a Pull Request (new Pull Request button). Choose `master` for the base and your branch name for `compare`, then submit it!

- Your PR will be reviewed by another contributor, and then either merged or have changes requested.

You are free to use the method you like to translate the file. Here are a few recommendations:

- Don't translate variable names and don't modify code blocks. Most French-speaker developers have their code base in English, the purpose of this translation is to explain Ember concepts in a more accessible language.

- Keep the translation as close as possible to the original one and respect the original characters' case.

- [Google translate](https://translate.google.fr/?hl=fr&sl=en&tl=fr&op=translate) is an efficient translation tool that can set up an approximative translation for you, then you can fix the mistakes with your own words.

## Keeping your fork updated

As you tackle new issues, you'll want to be sure that you always start by working on the most recent code. To sync up your fork's  `master` with a parent repository's `master`, set an upstream and pull from it. For this to work, you should make sure you're always committing to a branch, not `master`.

```
git remote add upstream https://github.com/dazzlingfugu/ember-fr-guides-source.git
git checkout master
git pull upstream master
```

## Spellchecking/linting

The Guides are spellchecked and linted for markdown consistency. You can test your contributions by running `npm run lint`. Linting and spellchecking must pass or they will fail in CI (continuous integration).

Spellchecking uses a French dictionary [dictionary-fr](https://www.npmjs.com/package/dictionary-fr). As variable names and code blocks mustn't be modified, a local dictionary `.local.dic` contains English words and terms that are common to the Ember community. Translating a specific guide sometimes requires placing new words and terms in the `.local.dic` dictionary file.
