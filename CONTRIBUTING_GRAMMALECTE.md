# Installing Grammalecte in Visual Studio Code

## Motivation

This project has a linter which can be run with `npm run lint`. This linter consists of a series of [Unified](https://unifiedjs.com/) plugins that spellcheck the files in French, and it relies on a French dictionary. It essentially checks words exist, among other little things. It's not able to evaluate the grammar like an actual spellchecker. In other words, just because you run `npm run lint` doesn't mean your grammar and conjugation are correct.

To answer this problem, the current recommendation is to add an actual spellcheck plugin to your code editor. If you use Visual Studio Code, then you can use Grammalecte.

## Download Grammalecte

Visit https://grammalecte.net/#download and select "CLI & Serveur". Once the zip file is downloaded, decompress it and move it wherever you want on your system. Take good note of the path you choose, you'll need it to configure the plugin in the next step. 

## Add the plugin to Visual Studio Code

Open Visual Studio Code and open the "Extensions" panel. In the search bar, type in "grammalecte", you should find this plugin: https://marketplace.visualstudio.com/items?itemName=jenselme.grammalecte .

Install the plugin and read carefully the instructions. First, it requires Python3. Then it explains how to let Visual Studio Code know where to find the Grammalecte script.

Access the plugin settings by clicking the cog icon next to the uninstall button. In the input "Path To Grammalecte Cli", indicate the path you choose for the Grammalecte folder and point to `grammalecte-cli.py`, as required by the installation instructions. Eventually, have a look at the other options to see what you wish to activate.

By default, `.md` extension is already present in the list of extensions that Grammalecte can run, so you are good to go! If you have configured everything correctly, you should see Grammalecte underlining things in the documentation files. Don't consider every syntax detail, Grammalecte is not familiar with markdown specifics. Focus on French grammar and conjugation.