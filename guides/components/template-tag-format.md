Le format _template tag_ (balise _template_) est une nouvelle façon puissante d'écrire des composants dans Ember. Il s'agit d'un format de fichier unique qui combine le JavaScript du composant et le code du _template_ Glimmer. La balise `<template>` est utilisée pour garder une séparation claire entre le langage de _template_ et le JavaScript qui l'entoure.

Les composants _template tag_ utilisent l'extension de fichier `.gjs`. Cette abréviation signifie «&nbsp;Glimmer JavaScript&nbsp;». L'extension de fichier `.gts` est également supportée pour les composants TypeScript.

Ce nouveau format est officiellement [l'avenir de la création de composants dans Ember](https://rfcs.emberjs.com/id/0779-first-class-component-templates/), et il est stable et utilisable aujourd'hui. La RFC (_Requests for comments_, littéralement "demande de commentaires") est actuellement au stade « Acceptée », et le travail est en cours pour la rendre « Prête pour la publication ». Il devrait devenir le moyen recommandé et par défaut de créer toutes les applications Ember dans un avenir proche, une fois que tous les aspects de l'implémentation auront été suffisamment peaufinés.

Vous êtes impatient de commencer ? Rendez-vous dans la [section d'installation](#toc_installation) pour utiliser dès aujourd'hui les composants _template tag_ dans vos apps et _addons_.

## Écrire des composants _template tag_

Tout comme pour les fichiers JavaScript et les _template_ Glimmer distincts, le format _template tag_ propose les concepts de composant _template-only_ (le composant consiste simplement en un _template_) et de composant _class-based_ (basé sur la classe JavaScript). Dans la section suivante, examinons la manière dont ces concepts diffèrent entre les deux formats de composant.

### Composants _template-only_

Le composant suivant a été créé dans une [section précédente](../component-arguments-and-html-attributes/) pour extraire un modèle d'avatar dans un composant réutilisable.

```handlebars {data-filename="app/components/avatar.hbs"}
<aside>
  <div class="avatar" title={{@title}}>{{@initial}}</div>
</aside>
```
Cette disposition peut être transformée en un composant _template tag_ en enveloppant le code dans une balise `<template>` et en changeant l'extension du fichier en `.gjs`.

```gjs {data-filename="app/components/avatar.gjs"}
<template>
  <aside>
    <div class="avatar" title={{@title}}>{{@initial}}</div>
  </aside>
</template>
```

La balise _template_ de plus haut niveau est exportée en tant que composant par défaut du fichier. Vous pouvez écrire cet export explicitement, mais ce n'est pas nécessaire. L'exemple suivant est équivalent au précédent.

```gjs {data-filename="app/components/avatar.gjs"}
export default <template>
  <aside>
    <div class="avatar" title={{@title}}>{{@initial}}</div>
  </aside>
</template>;
```

### Composant basés sur la classe

Une balise `<template>` peut également être incorporée à une définition de classe d'un composant. C'est utile lorsque vous avez besoin d'ajouter un état ou une autre logique à votre composant. Prenons l'exemple du composant `<Avatar>` suivant, où un titre par défaut est ajouté quand l'argument `title` (titre) n'est pas fourni.

```gjs {data-filename="app/components/avatar.gjs"}
import Component from '@glimmer/component';

export default class Avatar extends Component {
  get titleWithDefault() {
    return this.args.title ?? 'Avatar sans titre';
  }

  <template>
    <aside>
      <div class="avatar" title={{this.titleWithDefault}}>{{@initial}}</div>
    </aside>
  </template>
}
```

## Importer composants, _helpers_ et modifieurs

Dans les templates Ember, let "invocables" (_invokable_) sont des éléments que vous pouvez "invoquer" dans un _template_. Ils incluent les [composants](./introducing-components/), les [_helpers_](./helper-functions/) et les [modifieurs](./template-lifecycle-dom-and-modifiers/). Dans le format _template tag_, ces invocables doivent être importés pour pouvoir être utilisés. Ça permet de mieux comprendre d'où viennent les valeurs et ce qu'elles font, ainsi que d'optimiser le _build_.

### Importer des invocables depuis sa propre app

Lorsqu'on veut utiliser le composant `<Avatar>` tel que défini précédemment dans un autre fichier de composant, il faut d'abord l'importer. On le fait à l'aide de l'instruction `import`, tout comme on importerait n'importe quel autre module JavaScript.

```gjs {data-filename="app/components/message.gjs"}
import Avatar from './avatar';

<template>
  <Avatar
    @title={{@avatarTitle}}
    @initial={{@avatarInitial}}
  />
  <section>
    {{@message}}
  </section>
</template>
```

L'exemple ci-dessus illustre la définition d'un composant _template-only_ `<Message>`. La syntaxe d'import pour les composants basés sur des classes est la même.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        Les composants importés ne sont pas nécessairement définis à l'aide du nouveau format _template tag_. C'est intentionnel, et très puissant, car ça permet <strong>l'adoption incrémentale</strong> du nouveau format.
        <br><br>
        Le seul prérequis pour le composant importé est d'être défini via <a href="https://rfcs.emberjs.com/id/0481-component-templates-co-location">la structure dite en "colocation"</a> plutôt que d'avoir le fichier JavaScript et le _template_ Glimmer dans des dossiers séparés.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

#### Composants imbriqués

Component files can be organized in nested directory structures on the file system. Prior to the template tag format, the file path from the root component directory had be specified before to the component name, separated with `::`.

For example, when moving the "Avatar" component to the `app/components/messages` namespace, referencing it using double colons would be done as follows.

```handlebars {data-filename="app/components/avatar-usage.hbs"}
<Messages::Avatar
  @title="Picture of Zoey"
  @initial="Zoey"
/>
```

This quirk is no longer necessary with the template tag format. Instead, importing now works the same as importing any other JavaScript module.

```gjs {data-filename="app/components/avatar-usage.gjs"}
import Avatar from './messages/avatar';

<template>
  <Avatar
    @title="Picture of Zoey"
    @initial="Zoey"
  />
</template>
```

#### Helpers and modifiers

Importing helpers and modifiers from your own app also follows the same principle of using standard JavaScript import syntax. Instead of importing from `app/components`, the path to import from is `app/helpers` and `app/modifiers` respectively.

Prior to the template tag format, helpers and modifiers were referenced based on their name in the "kebab-case" convention. For example, a `randomNumber` function as helper would be referenced as `{{random-number}}` in a template. In the new way of doing things, standard module import conventions are used. This means that the helper is referenced using the name it is exported as, which is `randomNumber` in this case.

```gjs {data-filename="app/components/random-number.gjs"}
import randomNumber from '../helpers/random-number';

<template>
  {{randomNumber}}
</template>
```

### Importing from addons

Just as with components, helpers, and modifiers from your own app, external invokables from addons also have to be imported. This is done using the same `import` statement, but with a path referencing the addon.

The structure of files within Ember addons is mostly standardized. This means that the path to import from can be derived from the addon's name. For example, an addon that is named `ember-foo` will likely have its components, helpers, and modifiers available as default import from the following locations:

```gjs
ember-foo/components/example-component
ember-foo/helpers/example-helper
ember-foo/modifiers/example-modifier
```

To import the "ExampleComponent" component from the `ember-foo` addon, the following import statement can be used.

```js
import ExampleComponent from 'ember-foo/components/example-component';
```

Some addons may choose to re-export their invokables from the root index as named exports. Usually addons will document this usage in their README, if supported, which may look like:

```js
import { ExampleComponent } from 'ember-foo';
```

### Importing built-ins

The Ember built-in helpers, modifiers, and components are available for import from the following locations.

```js
// Built-in helpers
import { array } from '@ember/helper';
import { concat } from '@ember/helper';
import { fn } from '@ember/helper';
import { get } from '@ember/helper';
import { hash } from '@ember/helper';

// Built-in modifiers
import { on } from '@ember/modifier';

// Built-in components
import { Input } from '@ember/component';
import { LinkTo } from '@ember/routing';
import { Textarea } from '@ember/component';
```

#### Keywords

While most items should be imported into scope explicitly, some of the existing constructs in the language are not importable and are available as keywords instead:

`action`, `debugger`, `each-in`, `each`, `has-block-params`, `has-block`, `hasBlock`, `if`, `in-element`, `let`, `link-to`  (non-block form curly invocations), `loc`, `log`, `mount`, `mut`, `outlet`, `query-params`, `readonly`, `unbound`, `unless`, `with`, and `yield`

These keywords do not have to be imported into scope and will always be available.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        Feeling a bit lost with remembering all import paths?
        <br><br>
        Make sure to look at your editor setup to see if it can help you with auto-completion of import paths. See the <a href="#toc_editor-integrations">Editor Integrations</a> section for more information.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## New capabilities

In the examples above, functionality that was already available before was covered using the template tag format. The template tag format, however, unlocks a number of new capabilities that were not possible before.

### Locally-scoped values

The template tag format follows JavaScript module syntax. Any value that isn't exported is only available locally within the file. This is useful for defining helper functions that are only used within the component, or for defining constants that are used multiple times within the template.

In the following example, a "Square" component is defined that calculates the square of a number. The `value` constant is defined locally, and the `square` helper function is only available within the component.

```gjs {data-filename="app/components/square.gjs"}
const value = 2;

function square(number) {
  return number * number;
}

<template>
  The square of {{value}} equals {{square value}}
</template>
```

This will render to `The square of 2 equals 4`.

### Multiple components per file

The template tag format allows defining multiple components within a single file. This is useful for defining components that are closely related to each other, but are not used in other parts of the app.

The following example defines a "CustomSelect" component that renders a `<select>` element with a list of options. The locally-defined "Option" component is used to render each option in the list.

```gjs {data-filename="app/components/custom-select.gjs"}
const Option = <template>
  <option selected={{@selected}} value={{@value}}>
    {{@value}}
  </option>
</template>;

const CustomSelect = <template>
  <select>
    {{#each @options as |opt|}}
      <Option
        @value={{opt.value}}
        @selected={{eq opt @selectedOption}}
      />
    {{/each}}
  </select>
</template>;

export default CustomSelect;
```

This can be a powerful refactoring technique to break up large components into smaller ones. (where it makes sense!)

## Testing

Historically, Ember's integration tests have been written using the `hbs` tagged template literal. This is no longer necessary with the template tag format. Instead, use the `<template>` tag to define a template to render.

The following example showcases how the "Avatar" component can be tested using the template tag format.

```gjs {data-filename="tests/integration/components/avatar-test.gjs"}
import Avatar from 'app/components/avatar';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';

module('Integration | Component | avatar', function (hooks) {
  setupRenderingTest(hooks);

  test('renders name argument', async function (assert) {
    const initial = 'Zoey';
    await render(
      <template>
        <Avatar @title="Picture of Zoey" @initial={{initial}} />
      </template>
    );
    assert.dom().hasText(initial);
  });
});
```

Notice how the same semantics now apply to tests as well: local values in scope can be referenced directly, and invokables from your own app or addons need to be imported.

## Installation

Install the [ember-template-imports](https://github.com/ember-template-imports/ember-template-imports) addon to start using template tag components. This addon provides all the build tooling required to support the new component authoring format.

```bash
npm add --save-dev ember-template-imports
```

### Integration with external tooling

You may need to upgrade dependency versions or install additional plugins to have proper integration with external tools. The following commonly-used tools are supported:

- [ember-template-lint](https://github.com/ember-template-lint/ember-template-lint): Versions 5.8.0 and up.
- [eslint-plugin-ember](https://github.com/ember-cli/eslint-plugin-ember): Versions 11.6.0 and up.
- [Prettier](https://github.com/prettier/prettier): Versions 3.1.0 and up. This requires installing the [prettier-plugin-ember-template-tag](https://github.com/gitKrystan/prettier-plugin-ember-template-tag).
- [Glint](https://github.com/typed-ember/glint): Requires installing the [environment-ember-template-imports](https://github.com/typed-ember/glint/tree/main/packages/environment-ember-template-imports) plugin.

## Editor Integrations

You may need to configure your editor to get syntax highlighting inside embedded templates and support for the `.gjs` and `.gts` file extension.

### Visual Studio Code

The [Ember.js extension pack](https://marketplace.visualstudio.com/items?itemName=EmberTooling.emberjs) bundles everything you need to get started. More specifically, the [vscode-glimmer-syntax](https://marketplace.visualstudio.com/items?itemName=lifeart.vscode-glimmer-syntax) extension will add support for `glimmer-js` and `glimmer-ts` languages and provide syntax highlighting. The [ember-language-server](https://github.com/lifeart/ember-language-server) extension provides automatic import completions and other useful features.

### Neovim

Here's an [example Neovim Config](https://github.com/NullVoxPopuli/dotfiles/blob/main/home/.config/nvim/lua/plugins/syntax.lua#L52) with support for good highlighting of embedded templates in JS and TS, using:

- [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter)
- [tree-sitter-glimmer](https://github.com/alexlafroscia/tree-sitter-glimmer)

### Other editors

For other editors, you may be able to get support using one of these other syntax definitions:

- [TextMate](https://github.com/lifeart/vsc-ember-syntax/tree/master/syntaxes)
- [TreeSitter](https://github.com/alexlafroscia/tree-sitter-glimmer)

