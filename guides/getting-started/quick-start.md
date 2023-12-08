Bienvenue dans Ember&nbsp;! Suivez ce guide pour construire une application web simple utilisant HTML, JavaScript, l'outil de ligne de commande et quelques-unes des meilleures fonctionnalités de Ember. En chemin, nous vous présenterons la communauté Ember afin que vous sachiez vers qui vous tourner pour recevoir de l'aide ou continuer votre apprentissage.

Voici les étapes que nous couvrirons&nbsp;:

1. Installer Ember
2. Créer une nouvelle application
3. Définir une route
4. Écrire un composant d'UI
5. _Builder_ l'app pour la déployer en production
6. Déployer l'app sur Netlify

## Installer Ember

Ember peut être installé avec une simple commande npm, le gestionnaire de paquets de Node.js. Tapez ceci dans votre terminal&nbsp;:

```bash
npm install -g ember-cli
```

Vous n'avez pas npm&nbsp;? [Apprenez comment installer Node.js et npm ici](https://docs.npmjs.com/getting-started/installing-node). Pour une liste complète de toutes les dépendances nécessaires à un projet Ember CLI, visitez [Ember CLI Guides - Installing](https://cli.emberjs.com/release/basic-use/).

## Créer une nouvelle application

Une fois Ember CLI installé à l'aide de npm, vous avez accès à une nouvelle commande `ember` dans votre terminal. Vous pouvez désormais taper la commande `ember new` pour créer une nouvelle application&nbsp;:

```bash
ember new ember-quickstart --lang en
```

Cette commande crée un nouveau dossier appelé `ember-quickstart` et prépare une nouvelle application Ember à l'intérieur. L'option `--lang en` définit l'anglais comme langue principale afin d'améliorer dès le départ l'[accessibilité](../../accessibility/application-considerations/). Telle quelle, l'application fraîchement créée inclut&nbsp;:

- Un serveur de développement
- Un compilateur de templates
- La minification des fichiers JavaScript et CSS
- Les fonctionnalités modernes via Babel

En fournissant tout ce dont vous avez besoin pour construire une application web prête pour la production, Ember fait de la création d'un nouveau projet une promenade de santé.

Assurons-nous que tout fonctionne comme attendu. Tapez la commande `cd` pour accéder au répertoire `ember-quickstart` et démarrez le serveur de développement&nbsp;:

```bash
cd ember-quickstart
ember serve
```

Après quelques secondes, vous devriez voir le contenu suivant dans votre terminal&nbsp;:

```text
Livereload server on http://localhost:7020
Serving on http://localhost:4200/
```

(Pour arrêter le serveur, tapez Ctrl-C dans votre terminal.)

Visitez [`http://localhost:4200`](http://localhost:4200) dans le navigateur de votre choix.
Vous devriez voir une page de bienvenue Ember, et rien d'autre.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        Si vous rencontrez un problème pour démarrer le serveur et afficher la page de bienvenue, d'autres devs Ember seront ravis de vous aider&nbsp;! Visitez <a href="https://emberjs.com/community/">la page Ember Community</a> pour rejoindre des groupes de discussion ou des forums.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Félicitations&nbsp;! Vous venez de créer et lancer votre première app Ember.

## Écrire du HTML dans un template

Nous commencerons par éditer le template de l'`application`. Ce template est toujours celui affiché à l'écran quand un utilisateur charge votre application. Dans votre éditeur, ouvrez `app/templates/application.hbs` et changez le contenu comme suit&nbsp;:

```handlebars {data-filename=app/templates/application.hbs}
<h1>Registre de noms</h1>

{{outlet}}
```

Ember détecte automatiquement que le fichier a changé et recharge la page pour vous en arrière-plan. Vous devriez voir la page de bienvenue remplacée par "Compteur de visites". Nous avons aussi ajouté un `{{outlet}}` à cette page. Cela signifie que toute route à afficher le sera à cet endroit.

## Définir une route

Construisons une application qui affiche une liste de scientifiques. Pour cela, la première étape est de créer une route. Dans un premier temps, imaginez les routes comme étant les différentes pages de votre application.

Ember inclut des _generators_ (générateurs) qui automatisent l'écriture des morceaux de code les plus courants. Pour générer une route, tapez ceci dans une nouvelle fenêtre de votre terminal, toujours depuis le répertoire `ember-quickstart`&nbsp;:

```bash
ember generate route scientists
```

Vous verrez les journaux suivants:

```text
installing route
  create app/routes/scientists.js
  create app/templates/scientists.hbs
updating router
  add route scientists
installing route-test
  create tests/unit/routes/scientists-test.js
```

Ember vous indique les fichiers qu'il a créé pour vous&nbsp;:

1. Un template à afficher quand l'utilisateur visite `/scientists`.
2. Un objet `Route` qui récupère le modèle utilisé par ce template.
3. Une entrée dans le routeur de l'application (situé dans `app/router.js`).
4. Un test unitaire pour cette route.

Ouvrez le template fraîchement créé dans `app/templates/scientists.hbs` et ajoutez le contenu HTML suivant&nbsp;:

```handlebars {data-filename=app/templates/scientists.hbs}
{{page-title "Scientifiques"}}
<h2>Liste de Scientifiques</h2>
```

Dans votre navigateur, ouvrez [`http://localhost:4200/scientists`](http://localhost:4200/scientists). Vous devriez voir le `<h2>` que nous avons écrit dans `scientists.hbs`, juste en dessous du `<h1>` provenant du template `application.hbs`.

Puisque la route "scientist" est imbriquée dans la route de l'application, Ember affiche son contenu à l'intérieur de la directive `{{outlet}}` du template de l'application.

Maintenant que le rendu du template `scientists` est prêt, fournissons-lui quelques données à afficher. Pour cela, nous allons spécifier un _model_ (modèle) pour cette route en éditant `app/routes/scientists.js`.

Partons du code créé pour nous par le générateur et ajoutons une méthode `model()` à la `Route`&nbsp;:

```javascript {data-filename="app/routes/scientists.js"}
import Route from "@ember/routing/route";

export default class ScientistsRoute extends Route {
  model() {
    return ["Marie Curie", "Mae Jemison", "Albert Hofmann"];
  }
}
```

Cet exemple de code utilise une fonctionnalité de JavaScript appelée les classes. Apprenez-en davantage avec cette [vue d'ensemble des dernières fonctionnalités JavaScript](https://ponyfoo.com/articles/es6).

La méthode `model()` d'une route vous permet de retourner n'importe quelles données que vous souhaitez rendre accessible au template. Si vous devez récupérer des données de manière asynchrone, la méthode `model()` supporte n'importe quelle librairie basée sur les [Promises (promesses) JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise).

À présent, indiquons à Ember comment transformer ce tableau de `string` en HTML. Ouvrez le template `scientists` et ajoutez le code suivant pour itérer sur le tableau et l'afficher&nbsp;:

```handlebars {data-filename="app/templates/scientists.hbs"}
<h2>Liste de Scientifiques</h2>

<ul>
  {{#each @model as |scientist|}}
    <li>{{scientist}}</li>
  {{/each}}
</ul>
```

Ici, nous utilisons le _helper_ `each` pour itérer sur chaque élément transmis par le _hook_ `model()` (Le terme _hook_ désigne une fonction "prévue par le framework"&nbsp;: parce que la méthode `model()` se trouve dans un fichier spécifique et porte un nom spécifique, Ember sait où la trouver et exécute le code que vous y avez écrit à un moment précis.)

Ember affiche le bloc contenu à l'intérieur du _helper_ `{{#each}}...{{/each}}` pour chaque élément (dans notre cas, chaque scientifique) du tableau. L'élément (le scientifique) en cours de traitement est rendu disponible dans une variable `scientist`, notée `as |scientist|` dans le _helper_ `each`.

Le résultat final consiste en une balise `<li>` par scientifique du tableau à l'intérieur de la balise `<ul>` (pour _unordered list_, liste non ordonnée).

## Écrire un composant d'UI

<!-- spell ignore -->
À mesure que votre application grandit, vous constaterez que vous partagez certains éléments d'UI entre plusieurs pages, ou bien que vous utiliserez les mêmes plusieurs fois dans la même page. Ember vous permet d'améliorer facilement vos templates en en faisant des composants réutilisables.

Créons un composant `<PeopleList>` que nous pouvons utiliser à de multiples endroits pour afficher une liste de personnes.

Comme toujours, un générateur nous rend la tâche facile. Créez un nouveau composant en tapant&nbsp;:

```bash
ember generate component people-list
```

Copiez-collez le contenu du template `scientists` dans celui de `<PeopleList>`, puis éditez-le comme suit&nbsp;:

```handlebars {data-filename=app/components/people-list.hbs}
<h2>{{@title}}</h2>

<ul>
  {{#each @people as |person|}}
    <li>{{person}}</li>
  {{/each}}
</ul>
```

Nous avons changé le titre ("Liste de Scientifiques") écrit en dur en `{{@title}}`. `@` indique que `@title` est un argument qui sera passé au composant, ce qui facilite sa réutilisation dans d'autres endroits de l'application.

Nous avons aussi renommé `scientist` en `person`, un mot plus générique, afin de découpler le composant de l'endroit précis où il est utilisé.

Notre composant s'appelle `<PeopleList>`, ce nom est basé sur le nom du fichier. Notez que les lettres P et L sont en majuscule.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        Le nom d'un composant est dérivé de son nom de fichier.
        La première lettre et les lettres situées après chaque <code>-</code> sont en majuscule, et les tirets supprimés.
        Cette syntaxe est connue sous le nom de "pascal case".
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Sauvegardez ce template et retournez sur le template `scientists`.

Nous allons indiquer à notre composant&nbsp;:

1. Quel titre utiliser, via l'argument `@title`.
2. Quel tableau de personnes utiliser, via l'argument `@people`. Nous fournirons le `@model` de la route comme liste de personnes.

Pour cela, nous allons devoir faire quelques changements dans le code écrit précédemment.

Dans le reste des exemples de codes de ce tutoriel, à chaque fois que nous ajouterons ou supprimerons du code, nous montrerons un "diff". Les lignes à supprimer commenceront par un signe moins, et les lignes à ajouter par un signe plus. Si vous utilisez un lecteur d'écran tandis que vous parcourez le Guide, nous recommandons, pour la meilleure expérience, l'utilisation de Firefox et NVDA ou Safari et VoiceOver.

Remplaçons l'ancien code avec la version avec composant&nbsp;:

```handlebars {data-filename="app/templates/scientists.hbs" data-diff="-1,-2,-3,-4,-5,-6,-7,+8"}
<h2>Liste de Scientifiques</h2>

<ul>
  {{#each @model as |scientist|}}
    <li>{{scientist}}</li>
  {{/each}}
</ul>
<PeopleList @title="Liste de Scientifiques" @people={{@model}} />
```

Retournez sur votre navigateur et vous devriez constater que l'UI est identique. La seule différence est que, maintenant, l'affichage de la liste est géré par un composant réutilisable et plus facile à maintenir.

Vous pouvez voir le composant en action en créant une nouvelle route affichant une liste de personnes différentes. Par exemple, en exercice additionnel (à faire vous-mêmes), vous pourriez essayer de créer une route `programmers` qui affiche une liste de programmeur et programmeuses célèbres. Si vous réutilisez le composant `<PeopleList>`, vous pouvez le faire pratiquement sans ajouter de code.

## Répondre aux interactions utilisateur

Pour l'instant, notre application liste des données, mais il n'y a aucun moyen pour l'utilisateur d'interagir avec les informations. En application web, nous voulons souvent répondre aux actions utilisateur comme les clics ou les survols avec la souris. Ember nous simplifie la tâche.

D'abord, modifions le composant `<PeopleList>` pour inclure un bouton&nbsp;:

```handlebars {data-filename="app/components/people-list.hbs"}
<h2>{{@title}}</h2>

<ul>
  {{#each @people as |person|}}
    <li>
      <button type="button">{{person}}</button>
    </li>
  {{/each}}
</ul>
```

Maintenant que nous avons un bouton, nous devons le brancher pour "faire quelque chose" quand un utilisateur clique dessus. Pour rester simple, admettons que, au moment du clic, nous voulons afficher un message d'alerte contenant le nom de la personne.

Jusque-là, notre composant `<PeopleList>` est purement présentationnel, il prend des arguments en entrée et les affiche à l'aide d'un template. Pour donner un comportement à notre composant – ici, gérer le clic – nous devons "attacher du code" au composant.

Pour cela, en plus du template, un composant peut aussi avoir un fichier JavaScript. Créez un fichier `.js` avec le même nom et dans le même dossier que le template (`app/components/people-list.js`), et collez le contenu suivant&nbsp;:

```javascript {data-filename="app/components/people-list.js"}
import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class PeopleListComponent extends Component {
  @action
  showPerson(person) {
    alert(`Le nom de cette personne est ${person}!`);
  }
}
```

_Note: Si vous voulez que ce fichier soit généré pour vous, vous pouvez passer l'option `-gc` quand vous lancez le générateur de composant._

Ici, nous avons créé une classe de composant basique et ajouté une méthode qui accepte une personne en argument et affiche une boîte de dialogue avec son nom. Le _decorator_ (décorateur) `@action` indique que nous souhaitons utiliser cette méthode en tant qu'"action" dans notre template, en réponse à une interaction utilisateur.

Le comportement implémenté, nous pouvons retourner sur le template du composant et le mettre à jour&nbsp;:

```handlebars {data-filename="app/components/people-list.hbs" data-diff="-6,+7"}
<h2>{{@title}}</h2>

<ul>
  {{#each @people as |person|}}
    <li>
      <button type="button">{{person}}</button>
      <button type="button" {{on "click" this.showPerson}}>{{person}}</button>
    </li>
  {{/each}}
</ul>
```

Ici, nous utilisons le _modifier_ `on` pour attacher l'action `this.showPerson` au bouton qui se trouve dans le template.

<!-- spell ignore -->
Cependant, nous avons un problème. Si vous essayez dans le navigateur, vous vous apercevrez que cliquer sur les boutons affiche une boîte de dialogue annonçant "Le nom de cette personne est `[Object MouseEvent]`!", eek&nbsp;!

La cause de ce bug est que l'action que nous avons écrite prend un argument (le nom de la personne), et nous avons oublié de le passer. Fixer ça est assez simple&nbsp;:

```handlebars {data-filename="app/components/people-list.hbs" data-diff="-6,+7"}
<h2>{{@title}}</h2>

<ul>
  {{#each @people as |person|}}
    <li>
      <button type="button" {{on "click" this.showPerson}}>{{person}}</button>
      <button
        type="button"
        {{on "click" (fn this.showPerson person)}}
      >{{person}}</button>
    </li>
  {{/each}}
</ul>
```

Au lieu de passer l'action directement au _modifier_ `on`, nous utilisons le _helper_ `fn` pour passer `person` en tant qu'argument attendu par l'action.

Essayez dans votre navigateur. Cette fois, tout devrait se comporter comme espéré&nbsp;!

## _Builder_ pour la production

Maintenant que nous avons écrit notre application et vérifié qu'elle fonctionne en développement, il est temps de la préparer au déploiement pour nos utilisateurs.

Pour cela, lancez la commande suivante&nbsp;:

```bash
ember build --environment=production
```

La commande `build` empaquette tous les fichiers qui constituent votre application &mdash; JavaScript, templates, CSS, polices web, images, etc... &mdash; Dans le Guide, nous appellerons le résultat de cette commande le "build" et emploierons l'anglicisme "builder" en tant que verbe d'action pour cette opération.

Ici, nous avons dit à Ember de builder l'application pour l'environnement de production via l'option `--environment`. On obtient ainsi un paquet optimisé et prêt à être téléversé sur votre serveur web. Une fois le build terminé, vous trouverez tous les fichiers concaténés et minifiés dans le dossier `dist/` de votre application.

La communauté Ember accorde beaucoup de valeur à la collaboration et à la construction d'outils communs sur lesquels chacun puisse s'appuyer. Si vous êtes intéressé par un moyen fiable et rapide de déployer votre application en production, jetez un œil à l'addon [ember-cli-deploy](http://ember-cli-deploy.com/).

Si vous déployez votre application sur un serveur web Apache, créez d'abord un nouvel hôte virtuel pour votre application. Pour vous assurer que toutes les routes sont traitées par l'`index.html`, ajoutez la directive suivante dans la configuration de l'hôte virtuel de l'application&nbsp;:

```apacheconf
FallbackResource index.html
```

## Déployer l'app sur Netlify

[Netlify](http://netlify.com/products) est l'une des nombreuses solutions existantes pour déployer votre application sur le web et la partager&nbsp;!

![À propos de Netlify](/images/quick-guide/netlify/netlify-product.png)

Pourquoi Netlify?

Cette solution ne requiert pas de connaissances avancées pour déployer votre site web en production. Netlify offre une option de compte gratuit et aucune carte bancaire n'est requise. Le Guide Ember officiel est hébergé sur Netlify, tandis que d'autres ressources de `emberjs.com` sont hébergées sur Heroku, Fastly, GitHub pages, et AWS.
Dans l'ensemble, les devs Ember ont de nombreuses possibilités à leur disposition pour déployer leurs apps&nbsp;! Netlify en est une parmi d'autres.

Suivre les étapes suivantes vous aidera à mettre en place votre site en quelques minutes&nbsp;:

D'abord, [créez un compte Netlify](https://app.netlify.com/signup) si vous n'en avez pas déjà un&nbsp;:

![Déployer sur Netlify](/images/quick-guide/netlify/create-netlify-account.png)

L'étape suivante est d'indiquer au serveur web comment traiter les URLs. Il y a deux manières de le faire.

La première est de créer un fichier `_redirects` dans votre dossier `ember-quickstart/public`. Écrivez `/* /index.html 200` à la première ligne et sauvegardez le fichier. Cela indiquera au serveur de rediriger toutes les pages sur `index.html`. Une fois redirigée, l'app Ember.js elle-même générera le HTML correspondant aux URLs comme `/scientists`.

La deuxième est d'utiliser un addon créé par la communauté, comme [ember-cli-netlify](https://github.com/shipshapecode/ember-cli-netlify), pour gérer les URLs.

Vous voilà prêt à déployer votre app en production sur la plateforme Netlify. Il y a deux manières de le faire&nbsp;:

1. Déployer sur Netlify en utilisant le glisser-déposer
2. Déployer sur Netlify en utilisant Git (plus précisément GitHub)

**Déployer sur Netlify en utilisant le glisser-déposer**

Vous pourriez avoir besoin de recréer le dossier `dist` pour inclure les changements faits dans le fichier `_redirects` en relançant la commande&nbsp;:

```bash
ember build --environment=production
```

Une fois que vous êtes connecté à votre compte Netlify, dans la section "Sites", vous devriez voir la zone de glisser-déposer de Netlify.

![Netlify, zone de glissez-déposez](/images/quick-guide/netlify/drag-and-drop/02.png)

Ensuite, trouvez votre dossier `dist` sur votre ordinateur et glissez-déposez-le dans cette zone.

<!-- spell ignore -->
Quand vos fichiers ont été téléversés avec succès, vous devriez voir le statut de votre déploiement dans la section "Getting started".

![Prise en main avec le glisser-déposer sur Netlify](/images/quick-guide/netlify/drag-and-drop/03.png)

<!-- spell ignore -->
Une fois que vous voyez le message "Your site is deployed" comme ci-dessus, votre site est en ligne et, pour le voir, vous pouvez cliquer sur le lien fourni au-dessus de la section "Getting started".

![Voir votre site sur Netlify](/images/quick-guide/netlify/drag-and-drop/04.png)

Félicitations! Votre site est en production !

**Déployer sur Netlify en utilisant Git (plus précisément GitHub)**

<!-- spell ignore -->
Assurez-vous que vous êtes connecté à votre compte Netlify, puis dans la section "Sites", cliquez sur le bouton "New site from Git".

![Netlify Déploiement Continu Git](/images/quick-guide/netlify/github/new-site-from-git.png)

<!-- spell ignore -->
Cliquez sur le bouton "GitHub" sous "Continuous Deployment" pour connecter votre compte GitHub. Lors de cette étape, vous devrez interagir avec une série d'écrans de login GitHub et on vous demandera de configurer vos préférences GitHub relatives à Netlify.

![Netlify choisissez votre répertoire GitHub pour déployer](/images/quick-guide/netlify/github/connect-to-github.png)

Une fois votre compte GitHub connecté avec succès à Netlify, vous devriez voir une liste de répertoires. Sélectionnez ou recherchez le répertoire GitHub que vous souhaitez déployer.

![Netlify Options de Déploiement par Défaut Ember](/images/quick-guide/netlify/github/select-github-repo.png)

<!-- spell ignore -->
Si vous avez pu sélectionner le répertoire et qu'il s'agit d'une application Ember, Netlify générera automatiquement des options de déploiement par défaut comme montré ci-dessous. Ici, admettons que vous ne souhaitez pas changer les options. Si tout vous semble en ordre, cliquez sur le bouton "Deploy site".

![Netlify GitHub Vue d'Ensemble du Déploiement](/images/quick-guide/netlify/github/github-create-new-site.png)

<!-- spell ignore -->
Une fois que vous avez cliqué sur le bouton "Deploy site", vous serez redirigé sur l'"Overview" (vue d'ensemble) de votre site web et vous devriez voir le statut de votre déploiement.

![Netlify GitHub Confirmation du Déploiement](/images/quick-guide/netlify/github/github-deploy-confirmation.png)

<!-- spell ignore -->
Quand vous voyez "Your site is deployed" comme ci-dessus, votre site est en ligne et, pour le voir, vous pouvez cliquer sur le lien fourni au-dessus de la section "Getting started".

![Voir votre site sur Netlify](/images/quick-guide/netlify/github/github-live.png)

Félicitations! Votre site est en production !

## Étapes suivantes

Maintenant que votre app est déployée, que devriez-vous faire ensuite&nbsp;?

### Monter au niveau suivant

Il existe un tutoriel officiel gratuit dans le Guide qui approfondit quelques-unes des fonctionnalités que nous avons vues. [Pourquoi ne pas l'essayer&nbsp;?](../../tutorial/part-1/)

### Explorer l'écosystème

À présent que vous connaissez les bases, vous sentez-vous plus créatif et aventureux&nbsp;? La communauté Ember a créé des centaines d'addons que vous pouvez utiliser gratuitement dans votre app. Les addons vous permettent d'ajouter rapidement des fonctionnalités comme des calendriers, barres de navigation, outils de paiement, d'authentification, thèmes, etc... Visitez [Ember Observer](https://emberobserver.com) pour jeter un œil à toutes les possibilités&nbsp;!

### Ajoutez un style

L'app que nous avons réalisée est un peu brute. Connaissez-vous CSS&nbsp;? Placez vos feuilles de style dans `app/styles/app.css`, qui est inclus automatiquement dans le build de votre app.

### Connectez-vous à la communauté Ember

Une chose qui rend Ember si spécial est que chaque app que vous créez a _beaucoup_ en commun avec les apps que d'autres ont réalisées avant vous. Ainsi, il y a de grandes chances que vous puissiez échanger avec des développeurs et développeuses qui partagent les mêmes intérêts et défis techniques que vous. Visitez la page [Ember Community](https://emberjs.com/community/) pour apprendre comment entrer en contact. Trouvez un meetup à venir, posez des questions, suivez la newsletter et plus encore&nbsp;!

Nous espérons vous voir&nbsp;!
