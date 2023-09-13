Dans ce chapitre, vous installerez _[Ember CLI](https://cli.emberjs.com/release/)_, puis vous l'utiliserez pour générer un nouveau projet Ember ainsi que quelques _templates_ et styles basiques pour votre nouvelle app. À la fin de ce chapitre, vous devriez avoir une page d'accueil sur laquelle s'affiche la mignonne petite bouille du Professeur Tomster&nbsp;:

<img src="/images/tutorial/part-1/orientation/styled-with-tomster@2x.png" alt="L'app Super Rentals à la fin du chapitre" width="1024" height="250">

En construisant votre page d'accueil, vous apprendrez à&nbsp;:

- Installer Ember CLI
- Créer une nouvelle app Ember avec Ember CLI
- Démarrer et arrêter le serveur de développement
- Éditer des fichiers et les recharger automatiquement
- Travailler avec HTML, CSS et des fichiers dans une app Ember

## Installer Ember CLI

Installez la dernière version de Ember CLI en exécutant la commande suivante. Si vous l'aviez déjà fait en suivant le guide de [Prise en main](../../../getting-started/quick-start/), vous pouvez sauter cette section&nbsp;!

```shell
$ npm install -g ember-cli
```

Pour vérifier que votre installation a réussi, exécutez&nbsp;:

```shell
$ ember --version
ember-cli: 4.5.0
node: 14.19.1
os: linux x64
```

Si un numéro de version s'affiche, vous êtes prêt pour la suite.

## Créer une nouvelle app Ember avec Ember CLI

On crée un nouveau projet en utilisant la commande `new` de Ember CLI. Elle suit la syntaxe `ember new <project-name>`. Dans notre cas, le nom du projet serait `super-rentals`. Nous utiliserons aussi l'option `--lang en`, qui définit l'anglais comme langue principale de l'app et améliore l'[accessibilité](../../../accessibility/application-considerations/) du site web.

```shell
$ ember new super-rentals --lang en
installing app
Ember CLI v4.5.0

Creating a new Ember app in /home/runner/work/super-rentals-tutorial/super-rentals-tutorial/dist/code/super-rentals:
  create .editorconfig
  create .ember-cli
  create .eslintignore
  create .eslintrc.js
  create .github/workflows/ci.yml
  create .prettierignore
  create .prettierrc.js
  create .template-lintrc.js
  create .watchmanconfig
  create README.md
  create app/app.js
  create app/components/.gitkeep
  create app/controllers/.gitkeep
  create app/helpers/.gitkeep
  create app/index.html
  create app/models/.gitkeep
  create app/router.js
  create app/routes/.gitkeep
  create app/styles/app.css
  create app/templates/application.hbs
  create config/ember-cli-update.json
  create config/environment.js
  create config/optional-features.json
  create config/targets.js
  create ember-cli-build.js
  create .gitignore
  create package.json
  create public/robots.txt
  create testem.js
  create tests/helpers/index.js
  create tests/index.html
  create tests/integration/.gitkeep
  create tests/test-helper.js
  create tests/unit/.gitkeep
  create vendor/.gitkeep

Installing packages... This might take a couple of minutes.
npm: Installing dependencies ...
npm: Installed dependencies

Initializing git repository.
Git: successfully initialized.

Successfully created project super-rentals.
Get started by typing:

  $ cd super-rentals
  $ npm start

Happy coding!
```

Un nouveau dossier `super-rentals` a dû être créé pour nous. Nous pouvons naviguer à l'intérieur en utilisant la commande `cd`.

```shell
$ cd super-rentals
```

Pour le reste du tutoriel, toutes les commandes devrons être exécutées à l'intérieur du dossier `super-rentals`. Ce dossier possède la structure suivante&nbsp;:

```plain
super-rentals
├── .github
│   └── workflows
│       └── ci.yml
├── app
│   ├── components
│   │   └── .gitkeep
│   ├── controllers
│   │   └── .gitkeep
│   ├── helpers
│   │   └── .gitkeep
│   ├── models
│   │   └── .gitkeep
│   ├── routes
│   │   └── .gitkeep
│   ├── styles
│   │   └── app.css
│   ├── templates
│   │   └── application.hbs
│   ├── app.js
│   ├── index.html
│   └── router.js
├── config
│   ├── ember-cli-update.json
│   ├── environment.js
│   ├── optional-features.json
│   └── targets.js
├── public
│   └── robots.txt
├── tests
│   ├── helpers
│   │   └── index.js
│   ├── integration
│   │   └── .gitkeep
│   ├── unit
│   │   └── .gitkeep
│   ├── index.html
│   └── test-helper.js
├── vendor
│   └── .gitkeep
├── .editorconfig
├── .ember-cli
├── .eslintcache
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── .prettierignore
├── .prettierrc.js
├── .template-lintrc.js
├── .watchmanconfig
├── README.md
├── ember-cli-build.js
├── package.json
├── package-lock.json
└── testem.js

17 répertoires, 36 fichiers
```

Nous apprendrons le rôle de ces fichiers et dossiers le long du tutoriel. Pour l'instant, sachez seulement que nous passerons la majeure partie du temps à travailler dans le dossier `app`.

## Démarrer et arrêter le serveur de développement

Ember CLI fournit beaucoup de commandes différentes adaptées à de nombreuses tâches, comme la commande `ember new` que nous avons vue plus tôt. Ember CLI fournit aussi un serveur de développement ( _development server_), que nous pouvons démarrer avec la commande `ember server`:

```shell
$ ember server
building... 

Build successful (9761ms) – Serving on http://localhost:4200/
```

Le serveur de développement est chargé de compiler notre application puis de la servir aux navigateurs. Il peut mettre un peu de temps à démarrer. Une fois qu'il est prêt et lancé, ouvrez le navigateur de votre choix et visitez <http://localhost:4200>. Vous devriez voir la page de bienvenue suivante&nbsp;:

<img src="/images/tutorial/part-1/orientation/welcome@2x.png" alt="Welcome to Ember!" width="1024" height="906">

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p>L'adresse <code>localhost</code> dans l'URL signifie que vous ne pouvez accéder au serveur de développement que depuis votre machine locale. Si vous voulez partagez vos travaux avec le reste du monde, vous devrez <em><a href="https://cli.emberjs.com/release/basic-use/deploying/">déployer</a></em> votre application publiquement sur Internet. Nous verrons comment le faire dans la Partie 2 du tutoriel.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Vous pouvez stopper le serveur de développement à tout moment en tapant `Ctrl + C` dans le terminal où `ember server` a été lancé (c'est-à-dire taper le "C" de votre clavier _pendant_ que vous maintenez la touche "Ctrl" enfoncée). Une fois le serveur arrêté, vous pouvez le démarrer à nouveau avec la même commande `ember server`. Nous vous recommandons d'avoir deux fenêtres de terminal ouvertes&nbsp;: une dans laquelle vous lancez le serveur en tâche de fond, une autre pour taper les autres commandes Ember CLI.

## Éditer des fichier et les recharger automatiquement

Le serveur de développement possède une fonctionnalité appelée _live reload_ (rechargement en direct / instantané), qui monitore votre application pour savoir quand des fichiers sont modifiés, re-compile tout automatiquement et rafraîchit les pages ouvertes dans le navigateur s'il y en a. C'est très pratique durant le développement, alors essayons&nbsp;!

Comme l'indique le texte de la page de bienvenue, son code source se trouve dans `app/templates/application.hbs`. Essayons d'éditer ce fichier et de remplacer son contenu par le nôtre&nbsp;:

```handlebars { data-filename="app/templates/application.hbs" data-diff="-1,-2,-3,-4,-5,-6,-7,+8" }
{{page-title "SuperRentals"}}

{{!-- Le composant suivant affiche le message de bienvenue par défaut de Ember. --}}
<WelcomePage />
{{!-- N'hésitez pas à le supprimer ! --}}

{{outlet}}
Bonjour tout le monde !!!
```

Juste après que vous ayez sauvegardé le fichier, votre navigateur devrait rafraîchir automatiquement la page et afficher nos salutations à tout le monde. Pratique&nbsp;!

<img src="/images/tutorial/part-1/orientation/hello-world@2x.png" alt="Bonjour tout le monde !!!" width="1024" height="250">

Quand vous avez terminé vos explorations, supprimez le fichier `app/templates/application.hbs`. Nous n'en aurons plus besoin pour un moment, donc commençons depuis zéro. Nous pourrons le rajouter plus tard, au moment opportun.

Encore une fois, si votre navigateur est toujours ouvert, l'onglet devrait afficher automatiquement une page blanche dès que vous avez supprimé le fichier. Ça montre que nous n'avons plus de template d'application dans notre app.

## Travailler avec HTML, CSS et des fichiers dans une app Ember

Créez un fichier `app/templates/index.hbs` et copiez-y le balisage suivant&nbsp;;

```handlebars { data-filename="app/templates/index.hbs" }
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>Bienvenue sur "Super Rentals" !</h2>
  <p>Nous espérons que vous trouverez l'endroit parfait où séjourner.</p>
</div>
```

<!-- spell ignore -->
Si vous vous dites "Tiens, ça ressemble à du HTML&nbsp;!", alors vous avez raison&nbsp;! Dans leur forme la plus simple, les _templates_ Ember ne sont vraiment que du HTML. Si vous être déjà familier avec HTML, vous devriez vous sentir comme chez vous.

Bien entendu, contrairement au HTML, les templates Ember peuvent faire bien plus qu'afficher du contenu statique. Nous verrons ça en action bientôt.

Après avoir sauvegardé le fichier, l'onglet de votre navigateur devrait se rafraîchir automatiquement, et montrer le message de bienvenue que nous venons d'écrire.

<img src="/images/tutorial/part-1/orientation/unstyled@2x.png" alt="Bienvenue sur Super Rentals ! (sans style)" width="1024" height="250">

Avant de faire quoi que ce soit d'autre, ajoutons des styles à notre app. Protégeons notre vue de ce balisage triste, nous avons déjà passé suffisamment de temps à le regarder.

Heureusement, nos designers nous ont envoyé un peu de CSS à utiliser, alors nous pouvons <a href="/downloads/style.css" download="app.css">télécharger la feuille de style</a> et la copier dans `app/styles/app.css`. Ce fichier contient tous les styles dont nous avons besoin pour construire le reste de l'app.

```css { data-filename="app/styles/app.css" }
@import url(https://fonts.googleapis.com/css?family=Lato:300,300italic,400,700,700italic);

/**
 * Base Elements
 */

* {
  margin: 0;
  padding: 0;
}

body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
div,
span,
a,
button {
  font-family: 'Lato', 'Open Sans', 'Helvetica Neue', 'Segoe UI', Helvetica, Arial, sans-serif;
  line-height: 1.5;
}

body {
  background: #f3f3f3;
}

/* ...snip... */
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p>Le fichier CSS est assez long, alors nous ne le montrons pas en entier ci-dessus. Assurez-vous d'utiliser le lien de téléchargement dans le paragraphe précédent pour obtenir le fichier complet&nbsp;!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Si vous êtes familier avec CSS, libre à vous de personnaliser ces styles à votre goût&nbsp;! Gardez simplement à l'esprit que vous pourriez alors noter des différences visuelles entre vos écrans et ceux du tutoriel.

Quand vous êtes prêt, sauvegardez le fichier CSS&nbsp;; notre serveur de développement, fiable comme il est, devrait l'utiliser et rafraîchir la page immédiatement. Fini les contenus sans style&nbsp;!

<img src="/images/tutorial/part-1/orientation/styled@2x.png" alt="Bienvenue sur Super Rentals ! (avec les styles)" width="1024" height="250">

Pour que le contenu corresponde à la maquette de notre designer, nous devrons aussi télécharger l'image `teaching-tomster.png`, qui est référencée dans le fichier CSS&nbsp;:

```css { data-filename=app/styles/app.css }
.tomster {
  background: url(../assets/images/teaching-tomster.png);
  /* ...snip... */
}
```

Comme nous l'avons appris plus tôt, la convention Ember veut que le code source soit placé dans le dossier `app`. Pour les autres fichiers comme les images ou les polices d'écriture, la convention est de les placer dans le dossier `public`. Nous suivrons cette convention <a href="/downloads/teaching-tomster.png" download="teaching-tomster.png">en téléchargeant l'image</a> et en l'enregistrant dans `public/assets/images/teaching-tomster.png`.

Ember CLI et le serveur de développement s'appuient tous les deux sur ces conventions pour les dossiers et rendent leur contenu automatiquement disponible pour le navigateur.

Vous pouvez le vérifier en visitant `http://localhost:4200/assets/images/teaching-tomster.png`. L'image devrait s'afficher dans la page de bienvenue sur laquelle nous avons travaillé. Vous pourriez avoir besoin de rafraîchir manuellement pour que le navigateur prenne en compte le nouveau fichier.

<img src="/images/tutorial/part-1/orientation/styled-with-tomster@2x.png" alt="Bienvenue sur Super Rentals ! (avec Tomster)" width="1024" height="250">
