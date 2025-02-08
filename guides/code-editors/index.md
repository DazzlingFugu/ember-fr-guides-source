Pendant le développement, vous pouvez ajouter à votre éditeur de code des extensions spécifiques à Ember pour étendre ses fonctionnalités. Vous trouverez ci-dessous une liste de certaines des extensions disponibles, dont beaucoup sont créées et maintenues par la communauté&nbsp;:

<!-- spell ignore -->
## Visual Studio Code

<!-- spell ignore -->
Visual Studio Code est un éditeur de code optimisé pour la construction et le débogage d'applications web modernes. C'est l'un des éditeurs de texte les plus populaires parmi les devs Ember.

### Pack d'extensions

Installez le pack d'extension pour obtenir tout ce dont vous avez besoin pour travailler sur des projets Ember.

[Ember.js Extension Pack](https://marketplace.visualstudio.com/items?itemName=EmberTooling.emberjs) - Le pack installera les addons suivants&nbsp;:

### Coloration syntaxique

<!-- spell ignore -->
[Glimmer Templates Syntax](https://marketplace.visualstudio.com/items?itemName=lifeart.vscode-glimmer-syntax) - Formatage syntaxique pour les _templates_ Glimmer

### Serveur de langage

<!-- spell ignore -->
[Stable Ember Language Server](https://marketplace.visualstudio.com/items?itemName=lifeart.vscode-ember-unstable) - Un serveur de langage complet et stable. Son nom vient historiquement de Ember Language Server, dont il est un _fork_, et de ses efforts pour suivre les évolutions d'Ember.

### _Workflow_ (flux de travail)

[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - Intègre ESLint dans VS Code.

[EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) - Remplace si possible les paramètres de l'utilisateur et du _workspace_ (espace de travail) avec les paramètres trouvés dans les fichiers `.editorconfig`. Le fichier `.editorconfig` aide les développeurs à définir et à maintenir des styles de codage cohérents entre différents éditeurs et IDE.

[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Prettier est un outil de formatage de code qui a des avis arrêtés sur ledit format. Il applique un style cohérent en analysant le code et en le réimprimant avec ses propres règles qui prennent en compte la longueur de ligne maximale, en imbriquant le code si nécessaire. Prettier supporte Handlebars, Ember et Glimmer.

### _Templates_ Glimmer typés

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        Cet addon ne fait pas partie du pack d'extension mais devrait être envisagé pour les projets Ember construits avec TypeScript. En savoir plus sur <a href="https://typed-ember.gitbook.io/glint/">Glint ici</a>.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

[Glint](https://marketplace.visualstudio.com/items?itemName=typed-ember.glint-vscode) est un ensemble d'outils pour aider à développer du code s'appuyant sur la VM Glimmer pour le rendu, comme les projets Ember v3.24+ et GlimmerX.

## Vim et Neovim

Vim est un éditeur de texte hautement configurable conçu pour rendre la création et la modification de tout type de texte très efficace. Il est inclus dans la plupart des systèmes UNIX et dans Apple OS X sous la forme de «&nbsp;vi&nbsp;». D'autre part, Neovim est un éditeur de texte hyper-extensible basé sur Vim. Les deux éditeurs partagent une série d'extensions compatibles entre elles énumérées ci-dessous.

Vous devrez supprimer tout linter ou gestionnaire de complétion actuellement installé (ou les désactiver pour les fichiers `.js`, `.ts` ou `.hbs`), et suivre les guides d'installation des paquets suivants&nbsp;:

### Coloration syntaxique

Une seule de ces solutions est nécessaire, `tree-sitter` étant la plus fidèle.

[nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter) - Mise en surbrillance statique de haute fidélité supportant `.gjs`, `.gts` et le `hbs` imbriqué. Utilisez `ensure_installed = { 'glimmer' }`. Un exemple de configuration `nvim-treesitter` [peut être trouvé ici](https://github.com/NullVoxPopuli/dotfiles/blob/main/home/.config/nvim/lua/plugins/syntax.lua#L15).

ou

[vim-ember-hbs](https://github.com/joukevandermaas/vim-ember-hbs) - Ajout de la coloration syntaxique et de l'indentation des _templates_ Ember à Vim. Pour obtenir la coloration intégrée, il faut utiliser ces plugins supplémentaires&nbsp;:

- [vim-javascript](https://github.com/pangloss/vim-javascript)
- [vim-js-pretty-template](https://github.com/Quramy/vim-js-pretty-template)

### Serveur de langage

Une seule de ces solutions doit être utilisée à un instant donné.

LSP natif avec assistant, de [Mason.nvim](https://github.com/williamboman/mason.nvim). Permet d'installer et gérer facilement les serveurs LSP, les serveurs DAP, les linters et les formateurs. Un exemple de configuration Mason+LSP [peut être trouvé ici](https://github.com/NullVoxPopuli/dotfiles/tree/main/home/.config/nvim/lua).

ou

<!-- spell ignore -->
[Conquer for Completion (COC) for Neovim](https://github.com/neoclide/coc.nvim) - Un moteur IntelliSense qui prend le contrôle de tout le _linting_, _hinting_, et l'intégration du serveur de langue.

Avec le plugin Ember [coc-ember](https://github.com/NullVoxPopuli/coc-ember) - Extension du serveur de langue Ember.js comprenant des instructions de configuration utiles.

### Formatage de code / _Workflow_

[ember.vim](https://github.com/dsawardekar/ember.vim) - Raccourcis pour naviguer dans les fichiers liés aux projets Ember.js.

<!-- spell ignore -->
[Ember Tools](https://github.com/AndrewRadev/ember_tools.vim) - Divers outils pour travailler avec des projets Ember.js.

## Atom

<!-- spell ignore -->
Atom est l'éditeur de texte piratable du 21ème siècle.

[atom-ide-ember](https://github.com/josa42/atom-ide-ember) - Paquet Atom pour utiliser le serveur de langue Ember.

[emberjs-atom](https://atom.io/packages/emberjs-atom) - Autocomplétion et formatage de code Ember.js pour Atom.

[atom-ember-snippets](https://github.com/mattmcmanus/atom-ember-snippets) - Formateur de code Ember.js ES6, EmberData et Handlebars pour l'éditeur Atom.

[language-ember-htmlbars](https://atom.io/packages/language-ember-htmlbars) - Ajout de la coloration syntaxique et de l'indentation des _templates_ Ember à Atom.

<!-- spell ignore -->
## Sublime Text

Un éditeur de texte sophistiqué pour le code, le balisage et la prose.

<!-- spell ignore -->
[ember-cli-sublime-snippets](https://github.com/terminalvelocity/ember-cli-sublime-snippets) - Formateur de code Ember CLI pour Sublime Text 3.

<!-- spell ignore -->
[ember-component-template-split-view](https://github.com/mmitchellgarcia/ember-component-template-split-view) - Plugin Sublime Text extrêmement simple qui vous permettra d'ouvrir les fichiers de _template_ ou de route correspondants avec les composants Ember.js.

## CodeLobster IDE

CodeLobster IDE est un éditeur multi-plateformes gratuit et astucieux.

[Le plugin CodeLobster IDE pour Ember](http://www.codelobster.com/emberjs.html) fournit de l'auto-complétion et des _tooltips_ (infobulles) pour les fonction Ember.js, ainsi que du contexte et des aides dynamiques.