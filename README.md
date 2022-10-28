[![This project uses GitHub Actions for continuous integration.](https://github.com/DazzlingFugu/ember-fr-guides-source/workflows/CI/badge.svg)](https://github.com/DazzlingFugu/ember-fr-guides-source/actions?query=workflow%3ACI)

# Ember Guides French Source

This repository contains the French translation of the official Ember.js Guides:
- [Ember.js Guides website (English)](https://github.com/ember-learn/ember-website),
- [Ember Guides Source (English)](https://github.com/ember-learn/guides-source)

## Contributing

Welcome and thanks for your help!

First-time contributors are encouraged to look at issues that are labeled **help wanted** or **good first issue**. If you have questions or want a buddy to pair with, you can join the [#lang-french](https://discord.com/channels/480462759797063690/486235962700201984) in the [Ember Community Discord](https://discordapp.com/invite/zT3asNS).

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for additional instructions on how to format your work and submit a PR.

The Ember French Guides content is written in Markdown. In general, your PR should make edits to only the files in the `/guides/release` directory, which corresponds to the latest version of Ember. 

## Local development

**NOTE:** This project uses [Volta](https://volta.sh/) to ensure the correct Node.js and NPM version is used during local development.

To run the Ember Guides app locally, type these commands into your terminal:

```bash
git clone git://github.com/DazzlingFugu/ember-fr-guides-source.git

cd ember-fr-guides-source
npm install
npm run setup
npm start
```

Afterwards, visit [http://localhost:4200](http://localhost:4200) in your browser.

Note: On Mac, if you get the error `Error: EMFILE: too many open files, watch`, try installing Watchman. Install [Homebrew](https://brew.sh/) if you don't have it. Then, in your terminal, run `brew install watchman`

### Linting and spellchecking

The guides are spellchecked and linted for Markdown consistency. You can check your edits by running,

```bash
npm run lint
```

Linting and spellchecking must pass or they will fail in CI (continuous integration). See [CONTRIBUTING.md](CONTRIBUTING.md) for more information on linting and spellchecking.

### Internal and external links

Testing of internal and external links can be performed using three commands:

```bash
# Run all test scripts in `/node-tests` except those located
# in `/node-tests/local`. In particular, this command checks
# all internal links across the French Guides.
npm run test:node

# Run all test scripts in `/node-tests/local`. In particular,
# this command checks all external links in the release version
# of the Guides and across all versions of the official Guides. 
npm run test:node-local

# When checking external links in the release version, don't
# check links to the API docs (https://api.emberjs.com).
npm run test:node-local-exclude-api-urls
```
