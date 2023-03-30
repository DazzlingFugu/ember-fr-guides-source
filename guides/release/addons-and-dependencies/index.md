Lorsque vous développez votre app Ember, il est probable que vous recontriez des scénarios communs qui ne sont pas adressés par le framework en lui-même. Peut-être voulez-vous employer un préprocesseur CSS pour écrire vos feuilles de style ? ou bien utiliser une librairie JS populaire ? ou peut-être importer des composants ayant été écrits par une autre équipe de votre organisation ?

Pour résoudre certains de ces problèmes, Ember CLI fournit un format appelé [Ember Addons](#toc_addons) afin de distribuer des librairies réutilisables. De plus, vous pourriez vouloir faire usage de dépendances front-end comme un framework CSS ou un sélecteur de date JavaScript qui ne sont pas spécifiques à Ember.

## Addons

Les addons sont des paquets (ou _packages_) JavaScript qui s'intègrent avec Ember. Par exemple, [`ember-cli-sass`](https://github.com/adopted-ember-addons/ember-cli-sass) est un addon qui permet d'utiliser SASS/SCSS dans les applications. Ember CLI vous permet de l'installer à l'aide de la commande suivante&nbsp;:

```bash
ember install ember-cli-sass
```

Quand cette commande s'exécute, elle modifie votre `package.json` (ainsi que `package-lock.json` ou `yarn.lock`) et, en général, importe d'autres dépendances. Certains addons génèrent aussi, lorsque c'est nécessaire, des fichiers additionnels dans votre projet.

Il existe une multitude d'addons répondant à tous types de besoins. Pour plus de détails et pour consulter d'autres exemples sur ce que les addons peuvent faire, nous vous invitons à jeter un oeil à la [documentation de Ember CLI](https://cli.emberjs.com/release/basic-use/using-addons/).

La communauté Ember publie et maintient de nombreux addons, il peut donc être difficile de savoir si l'un (ou plusieurs&nbsp;!) d'entre eux couvre vos besoins. Le site web [Ember Observer](https://www.emberobserver.com/) conserve un index à jour des addons Ember, triés par catégorie et notés selon des critères objectifs. Si vous recherchez un addon, nous vous recommandons de commencer vos recherches par là&nbsp;!

## Paquets NPM classiques

Bien qu'il existe différentes manières de gérer les dépendances, il est important de noter que `ember-auto-import` peut nettement simplifier le processus, en particulier pour les débutants. `ember-auto-import` permet d'importer des paquets NPM sans configuration spécifique. Il est contenu par défaut dans les nouvelles apps Ember et peut être installé dans les plus anciennes à l'aide de la commande `ember install ember-auto-import`. Pour des instructions plus détaillées, suivez le [README du projet](https://github.com/ef4/ember-auto-import).

## Autres fichiers

Les fichiers JavaScript tiers qui ne sont disponibles ni en tant qu'addon, ni en tant que paquet NPM doivent être placés dans le dossier `vendor/` de votre projet.

Les fichiers propres à votre projet (comme `robots.txt`, `favicon`, les polices d'écriture personnalisées, etc...) doivent être placés dans le dossier `public/`.

## Compiler les fichiers

Lorsque vous utilisez des dépendances qui ne sont pas incluses dans un addon, vous devez expliquer à Ember CLI comment inclure ces fichiers dans le _build_ (l'application compilée). Pour ce faire, il faut éditer le fichier `ember-cli-build.js`. N'importez que des fichiers se trouvant dans les dossiers `node_modules` et `vendor`.

### Variables globales fournies par les fichiers JavaScript

Certains fichiers fournissent des variables globales (comme `moment` dans l'exemple ci-dessous), celles-ci peuvent être utilisées sans qu'un `import` soit nécessaire. Fournissez le chemin vers le fichier en seul et unique argument&nbsp;:

```javascript {data-filename=ember-cli-build.js}
app.import("node_modules/moment/moment.js");
```

Vous devrez ensuite ajouter `"moment"` au champ `globals` de `.eslintrc.js`, de manière à empêcher l'erreur ESLint sur les variables non définies.

### Modules JavaScript AMD anonymes

Vous pouvez transformer un module AMD anonyme en module nommé en utilisant une transformation `amd`&nbsp;:

```javascript {data-filename=ember-cli-build.js}
app.import("node_modules/moment/moment.js", {
  using: [{ transformation: "amd", as: "moment" }],
});
```

La transformation ci-dessus permet d'importer moment dans l'application (ex&nbsp;: `import moment from 'moment';`).

### Modules JavaScript CommonJS

[ember-cli-cjs-transform](https://github.com/rwjblue/ember-cli-cjs-transform) permet d'importer des modules CommonJS dans une application Ember. Il effectue automatiquement des opérations de compilation et de mise en cache, et devrait télécharger toutes les dépendances référencées par `require`. Il n'est pas encore inclus dans Ember CLI par défaut, vous devrez donc l'installer si vous en avez besoin&nbsp;:

```bash
ember install ember-cli-cjs-transform
```

```javascript {data-filename=ember-cli-build.js}
app.import("node_modules/showdown/dist/showdown.js", {
  using: [{ transformation: "cjs", as: "showdown" }],
});
```

Vous pouvez maintenant importer `showdown` dans votre application (ex&nbsp;: `import showdown from 'showdown';`).

### Fichiers spécifiques à un environment

Si vous souhaitez utiliser différents fichiers dans différents environnements, spécifiez un objet en premier paramètre de `app.import`. Chaque clé de l'objet est le nom de l'environnement, et sa valeur est le fichier à utiliser dans cet environnement&nbsp;:

```javascript {data-filename=ember-cli-build.js}
app.import({
  development: "node_modules/moment/moment.js",
  production: "node_modules/moment/min/moment.min.js",
});
```

Si vous souhaitez importer un fichier dans un seul environnement, vous pouvez nester `app.import` dans un bloc `if`. Pour les fichiers requis durant l'exécution des tests, vous devrez aussi utiliser l'option `{type: 'test'}` afin de vous assurer qu'ils soient bien disponibles en mode test.

```javascript {data-filename=ember-cli-build.js}
if (app.env === "development") {
  // Only import when in development mode
  app.import("vendor/ember-renderspeed/ember-renderspeed.js");
}
if (app.env === "test") {
  // Only import in test mode and place in test-support.js
  app.import("node_modules/sinonjs/sinon.js", { type: "test" });
  app.import("node_modules/sinon-qunit/lib/sinon-qunit.js", { type: "test" });
}
```

### CSS

Fournissez le chemin de fichier en premier argument&nbsp;:

```javascript {data-filename=ember-cli-build.js}
app.import("node_modules/foundation/css/foundation.css");
```

Tous les fichiers de style ajoutés de cette manière seront concaténés dans un fichier de sortie `/assets/vendor.css`.

### Autres fichiers

Les fichier situés dans le dossier `public/` seront copiés tels quels dans le répertoire de sortie `dist/`.

Par exemple, un fichier `favicon` dont le chemin est `public/images/favicon.ico` sera copié dans `dist/images/favicon.ico`.

Tous les fichiers tiers, qu'ils soient inclus manuellement dans `vendor/` ou via un gestionnaire de paquets comme NPM, doivent être ajoutés avec `app.import()`.

Les fichiers tiers qui ne sont pas ajoutés avec `app.import()` ne seront pas présents dans le _build_ final.

Par défaut, les fichiers importés avec `import` seront copiés dans `dist/` tels qu'ils sont, avec la structure du répertoire maintenue.

```javascript {data-filename=ember-cli-build.js}
app.import("node_modules/font-awesome/fonts/fontawesome-webfont.ttf");
```

Cet exemple créerait un fichier de police dans `dist/font-awesome/fonts/fontawesome-webfont.ttf`.

Vous pouvez, si vous le souhaitez, indiquer à `import()` de placer le fichier à un emplacement différent. L'exemple suivant copierait le fichier dans `dist/assets/fontawesome-webfont.ttf`&nbsp;:

```javascript {data-filename=ember-cli-build.js}
app.import("node_modules/font-awesome/fonts/fontawesome-webfont.ttf", {
  destDir: "assets",
});
```

Si certaines dépendances nécessitent d'être chargées avant les autres, définissez la propriété `prepend` à `true` en deuxième argument de `import()`. Ceci ajoutera la dépendance au début du fichier vendor au lieu de l'ajouter à la fin (ce qui est le comportement par défaut)&nbsp;:

```javascript {data-filename=ember-cli-build.js}
app.import("node_modules/es5-shim/es5-shim.js", {
  type: "vendor",
  prepend: true,
});
```

<!-- eof - needed for pages that end in a code block  -->
