# Contributing

The French Ember Guides are maintained by a (very small) all-volunteer group of the Ember French community members. We'd love to have you join our efforts to translate the Guides and make Ember more accessible to French developers!

There are essentially two ways to contribute to this repository: you can work on the translation itself, or you can work on a more technical topic to ease our life with the maintenance. You can choose one or the other depending on your preferences, you can also just review PRs.

This contributing guide will focus on the translation.

## I want to translate a page of the guide!

Please note that no attempt is made to translate content for older versions of the Guides. We focus only on the latest release.

### 1. Assign yourself a page

- Find a page you want to translate in the list of [issues](https://github.com/DazzlingFugu/ember-fr-guides-source/issues) to make sure no one is already working on it.
- If you find the issue and it's free, assign yourself to it or leave a comment to notify people you're going to start the translation.
- If the file you wish to translate is missing from the issues list (which can happen), open a new issue using the template "File to translate".
- Translate the page entirely and submit it for review before starting another page.

### 2. Clone the repository / Keep your fork updated

If it's your first contribution, fork this repository from GitHub interface, then on your machine:
```
git clone <your fork's url>
git remote add upstream https://github.com/DazzlingFugu/ember-fr-guides-source.git
```

As you tackle new issues, you'll want to be sure that you always start by working on the most recent code. The second command sets an upstream. By pulling from it, you can sync up your fork's `master` branch with its upstream repository's `master` branch. For this to work, make sure you're always committing to a different branch, not `master`.

Each time you want to start a new page:
```
git switch master
git pull upstream master
git switch --create some-branch-name
```

### 3. Translate and lint the page

Here is the journey to submit a PR:
1. Translate the `.md` page of your choice.
2. Once the file is in French, add the path of the page to the `.remarkignore` file (in alphabetical order)
3. Run `npm run lint`

The command `npm run lint` runs the tools that will spellcheck your page. If all files are green and the command ends without error, you are good! If there are warnings, you need to fix them. The three most common errors are a misspelled French word, a commonly used English term that you haven't translated on purpose, and a word repeated twice.

If there are errors because you kept an English term commonly used in French, add this word to the 
`.local.dic` file and then run the command `npm run lint:fix:local-dic`.

If there are errors such as "a word is repeated twice" but it's expected in French (“Je vais vous "faire faire" une jolie traduction”), make sure to fix all the other errors of the same paragraph before adding `<!-- spell ignore -->` above the paragraph.

Each PR should have:
- **1 commit** (keep the commit stack clean with one commit, and make the message clear enough to identify the issue number or the file at first glance)
- **2~3 files changed** (`[some-page].md`, `.remarkignore`, optionally `.local.dic`)

**Grammalecte**: if you use Visual Studio Code, you can improve the spellchecking tools that will assist you in writing a perfect file in French. Check out how to [install Grammalecte plugin in Visual Studio Code](./CONTRIBUTING_GRAMMALECTE.md).

### 4. Label your PR

Once you're at the point that you'd like feedback: 
- Submit a Pull Request
- Add the label "**Guides FR trad**" on it

## What syntax rules should I follow?

### 1. Translate the UI data, but not the code

Don't translate variable names in code blocks. Most French-speaker devs have their codebase in English, the purpose of these translations is to explain Ember concepts in a more accessible language. In the code blocks, translate the UI-related elements, what a French user would see on the page or would hear when using a screen reader.

```diff
  <button type="button" class="image large" {{on "click" this.toggleSize}}>
-    <img ...attributes alt="Picture of the rental">
-    <small>View smaller</small>
+    <img ...attributes alt="Photo de la propriété">
+    <small>Réduire</small>
  </button>
  ```

### 2. Use _italics_ for English terms, and explain them

Some technical terms can be intuitively translated into French. For instance, we will translate "tag" to "balise" or "generator" to "générateur, this won't be shocking to the reader. We should translate as soon as it's intuitive enough. 

On the other hand, some terms are not intuitive to translate and we generally keep the English one. For instance, we wouldn't naturally say "assistant" for "helper" or "fabrique" for "factory".

In any case, when you encounter a technical term:
- Put the English in _italic_ style and keep the regular style for French.
- The first time the word appears on the page, use the language you'll reuse along the page and add the language you _won't_ use in parenthesis so the reader can do the link between English and French.

In this example, we will stick to "espace de nom" in the rest of the page:
```diff
- Components like these are known as namespaced components. Namespacing allows us to organize our components by folders according to their purpose.
+ Les composants comme ceux-ci sont appelés composants à espace de nom (_namespaced components_). Les espaces de nom permettent d'organiser les composants par dossiers selon leur fonction.
```

In this example, we will go for "store" and "record" in the rest of the page:
```diff
- The EmberData store provides an interface for retrieving records of a single type. Use `store.findRecord()` to retrieve a record.
+ Le _store_ (magasin, réserve) d'EmberData fournit une interface pour récupérer les _records_ (enregistrements) d'un type donné. Utilisez `store.findRecord()` pour récupérer un _record_.
```

If the literal translation of a term is _reeeeally_ convoluted, don't hesitate to be wordy about it. The purpose is to make it understandable to non-English speakers:

```diff
- This method is also known as the _model hook_.
+ Cette méthode est aussi appelée le _model hook_ (_hook_ signifie littéralement "un crochet" mais se traduit mal dans un contexte technique. On peut voir le _hook_ comme une fonction mise à disposition et exécutée en interne par le framework, et dont on définit le contenu, on y "accroche" du code).
```

### 3. Translate article descriptions, but not their titles

Some pages of the Guides reference articles, introduced with a title and sometimes a description. If this resource is also available in French (for instance, a lot of pages from MDN website are translated), then use the French URL in the translation (be careful with that MDN example though, because some pages are not translated entirely and it can be better to keep the English).

If the resource is not translated or if the translation is incomplete, keep the English link and translate only the description, not the title of the resource itself, because we need to make clear to the reader it's an English document:
```diff
- [Using ARIA:](https://www.w3.org/TR/using-aria/) a practical guide for developers on how to add accessibility information to HTML element
+ <!-- spell ignore -->
+ <span lang="en">[Using ARIA](https://www.w3.org/TR/using-aria/)</span>&nbsp;: un guide pratique pour ajouter aux éléments HTML des informations accessibles.
```

Markdown supports HTML. Embedding English titles in a `<span lang="en">` HTML tag informs assistive technologies the content of that link is written in English. Using this information, screen readers can adapt the voice so the reading is more natural and understandable.

### 4. Set non-breakable spaces

`&nbsp;` is the HTML sign for "non-breakable space" and can be used in markdown as well. If the space is not set non-breakable, then a punctuation mark like ":" or ";" could be separated from the previous word and moved to the next line, which is incorrect.
```diff
- Using ARIA: a practical guide (...)
+ Using ARIA&nbsp;: un guide pratique (...)
```

## What tone should I use?

### 1. General tone

To stick to the official Guides tone, try to find the right balance to be "relax" without being too familiar:
- Prefer "ça" over "cela"
- Use "nous" when you mean "you & the reader", let's do this together (this is used a lot in the tutorial): "À présent, faisons ça"
- Use "on" as the undefined pronoun, when you talk about a general rule: "En général, on écrit les variable en anglais"

### 2. Inclusive writing

We avoid the "·" character in the translation because all screen readers don't handle it very well. However, there are other ways to be inclusive in your writing. Be aware of all masculine endings and don't hesitate to rephrase the sentence in order to use a more neutral tone.

```diff
If (...), the developer would need to write the following additional code

- Si (...), alors le développeur aurait dû écrire le code suivant
+ Si (...), alors nous aurions dû écrire le code suivant
```

If you don't see how to make the sentence neutral and it's only one spot on the page, prefer the "·" character over the masculine term.

### 3. Can I use Google Translate to go faster?

You are free to use the method and tools you like to translate the file, what matters is the result. 

Tools like [DeepL](https://www.deepl.com) can set up an approximative translation for you, then you can fix the mistakes with your own words. But keep in mind you could have _a lot_ of things to fix because it produces very literal translations. Most of the time translating yourself directly is just faster.

In the end, the point is to "sound French".

If you have any questions, if you are not sure what to work on, or if you are looking for a buddy to pair with, you can join the #-lang-french channel in the [Ember Community Discord](https://discordapp.com/invite/zT3asNS).
