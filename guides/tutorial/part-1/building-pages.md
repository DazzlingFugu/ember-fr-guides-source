Dans ce chapitre, vous allez construire les premières pages de votre app Ember et définir des liens entre elles. Une fois ce chapitre terminé, votre app devrait contenir deux nouvelles pages – une page d'à propos et une page de contact. Ces pages seront accessibles via des liens sur la page d'accueil.

<img src="/images/tutorial/part-1/building-pages/index-with-link@2x.png" alt="L'app Super Rentals (page d'accueil) à la fin du chapitre" width="1024" height="250">

<img src="/images/tutorial/part-1/building-pages/about-with-link@2x.png" alt="L'app Super Rentals (page d'à propos) à la fin du chapitre" width="1024" height="274">

<img src="/images/tutorial/part-1/building-pages/contact-with-link@2x.png" alt="L'app Super Rentals (page de contact) à la fin du chapitre" width="1024" height="444">

Tandis que vous construirez ces pages, vous apprendrez à&nbsp;:

- Définir des routes
- Utiliser des <span lang="en">_templates_</span> de routes
- Paramétrer des URLs
- Lier des pages avec le composant `<LinkTo>`
- Passer des arguments et des attributs aux composants

## Définir des routes

Notre [première page](../orientation/) faite, ajoutons-en une seconde&nbsp;!

Cette fois, nous aimerions que cette page soit servie sur l'URL `/about`. Pour cela, nous devrons dire à Ember que nous voulons ajouter une page à cette adresse. Sinon, Ember pensera que nous avons visité une URL invalide&nbsp;!

L'endroit où définir quelles pages sont disponible est le _router_. Ouvrez `app/router.js` et écrivez le changement suivant&nbsp;:

```js { data-filename="app/router.js" data-diff="-9,+10,+11,+12" }
import EmberRouter from '@ember/routing/router';
import config from 'super-rentals/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {});
Router.map(function () {
  this.route('about');
});
```

Ce code ajoute une _[route](../../../routing/defining-your-routes/)_ appelée "_about_" (à propos), qui est servie par défaut à l'URL `/about`.

## Utiliser des <span lang="en">_templates_</span> de routes

Ceci en place, nous pouvons créer un nouveau <span lang="en">_template_</span> `app/templates/about.hbs` avec le contenu suivant&nbsp;:

```handlebars { data-filename="app/templates/about.hbs" }
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>À propos de "Super Rentals"</h2>
  <p>
    Le site web "Super Rentals" est un projet très sympa créé pour explorer Ember.
    En réalisant un site de location de propriétés, nous pouvons imaginer voyager
    ET apprendre à construire des applications Ember en même temps.
  </p>
</div>
```

Pour voir le résultat, naviguez sur `http://localhost:4200/about`.

<img src="/images/tutorial/part-1/building-pages/about@2x.png" alt="Page d'à propos" width="1024" height="250">

Avec ça, notre seconde page est terminée&nbsp;!

## Définir des routes avec des chemins personnalisés

Nous voilà lancés&nbsp;! Ne nous arrêtons pas en si bon chemin et créons une troisième page. Cette fois, la situation est un peu différente. Tout le monde dans notre entreprise appelle cette nouvelle page la page "contact". Mais le vieux site web que nous sommes en train de remplacer a déjà une page similaire, servie à l'ancienne URL `/getting-in-touch`.

Mettons que nous voulons garder les URLs existantes pour le nouveau site sans avoir à taper `getting-in-touch` dans toute la nouvelle base de code&nbsp;! Heureusement, nous pouvons garder le meilleur des deux monde&nbsp;:

```js { data-filename="app/router.js" data-diff="+11" }
import EmberRouter from '@ember/routing/router';
import config from 'super-rentals/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('about');
  this.route('contact', { path: '/getting-in-touch' });
});
```

Ici, nous venons d'ajouter la route `contact`, mais nous spécifions explicitement un chemin pour cette route. Ça nous permet de garder l'ancienne URL, mais d'utiliser le nouveau nom plus court pour la route et le nom de fichier du template.

En parlant du template, créons-en un aussi. Ajoutons le fichier `app/templates/contact.hbs`&nbsp;:

```handlebars { data-filename="app/templates/contact.hbs" }
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>Contactez-nous</h2>
  <p>
    Les représentants de "Super Rentals" aimeraient vous aider à<br>
    choisir une destination ou répondre à toutes vos questions.
  </p>
  <address>
    Siège social de Super Rentals
    <p>
      1212 Test Address Avenue<br>
      Testington, OR 97233
    </p>
    <a href="tel:503.555.1212">+1 (503) 555-1212</a><br>
    <a href="mailto:superrentalsrep@emberjs.com">superrentalsrep@emberjs.com</a>
  </address>
</div>
```

Ember s'appuie sur des conventions fortes et des valeurs par défaut intuitives. Si nous partions de zéro, l'URL par défaut `/contact` ne nous dérangerait pas. Cependant, si les valeurs par défaut ne fonctionnent pas pour nous, il n'y a aucun problème à personnaliser Ember pour nos besoins&nbsp;!

Une fois la route et le template ci-dessus ajoutés, notre nouvelle page devrait être disponible sur `http://localhost:4200/getting-in-touch`.

<img src="/images/tutorial/part-1/building-pages/contact@2x.png" alt="Page de contact" width="1024" height="394">

## Lier des pages avec le composant `<LinkTo>`

Nous avons mis tant d'effort dans ces pages, nous devons nous assurer que les utilisateurs les trouverons&nbsp;! Pour cela, en web, on utilise des [hyperliens](https://developer.mozilla.org/fr/docs/Learn/HTML/Introduction_to_HTML/Creating_hyperlinks) (_hyperlinks_), aussi appelés tout simplement liens.

Étant donné qu'Ember supporte très bien les URLs clé en main, nous pourrions "juste" lier nos pages ensemble à l'aide de la balise `<a>` et du `href` adéquat. Cependant, cliquer sur ces liens obligerait le navigateur à rafraîchir entièrement la page (_full-page refresh_), ce qui signifie qu'il devrait demander la page au serveur pour la récupérer, puis tout recharger à partir de zéro.

Avec Ember, on peut faire mieux que ça&nbsp;! Plutôt que d'utiliser la bonne vieille balise `<a>`, Ember fournit une alternative appelée `<LinkTo>`. Par exemple, voici comment l'utiliser sur la page créée plus tôt&nbsp;:

```handlebars { data-filename="app/templates/index.hbs" data-diff="+5" }
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>Bienvenue sur "Super Rentals" !</h2>
  <p>Nous espérons que vous trouverez l'endroit parfait où séjourner.</p>
  <LinkTo @route="about" class="button">À propos de nous</LinkTo>
</div>
```

```handlebars { data-filename="app/templates/about.hbs" data-diff="+9" }
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>À propos de "Super Rentals"</h2>
  <p>
    Le site web "Super Rentals" est un projet très sympa créé pour explorer Ember.
    En réalisant un site de location de propriétés, nous pouvons imaginer voyager
    ET apprendre à construire des applications Ember en même temps.
  </p>
  <LinkTo @route="contact" class="button">Contactez-nous</LinkTo>
</div>
```

```handlebars { data-filename="app/templates/contact.hbs" data-diff="+17" }
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>Contactez-nous</h2>
  <p>
    Les représentants de "Super Rentals" aimeraient vous aider à<br>
    choisir une destination ou répondre à toutes vos questions.
  </p>
  <address>
    Siège social de Super Rentals
    <p>
      1212 Test Address Avenue<br>
      Testington, OR 97233
    </p>
    <a href="tel:503.555.1212">+1 (503) 555-1212</a><br>
    <a href="mailto:superrentalsrep@emberjs.com">superrentalsrep@emberjs.com</a>
  </address>
  <LinkTo @route="about" class="button">À propos</LinkTo>
</div>
```

Pas mal de choses se passent ici, voyons ça point par point.

`<LinkTo>` est un exemple de [composant]((../../../components/introducing-components/)) (_component_). Vous pouvez les distinguer des balises HTML classiques car leur nom commence par une majuscule. Tout comme les balises HTML classiques, les composants sont un bloc de construction clé pour réaliser l'interface utilisateur d'une application.

Nous en dirons beaucoup plus sur les composants plus tard. Pour l'instant, vous pouvez les penser comme des "balises personnalisées" pour compléter celles existant nativement pour le navigateur.

La syntaxe `@route=...` correspond à la façon de passer des [arguments](../../../components/component-arguments-and-html-attributes/) au composant. Ici, l'argument spécifie vers _quelle_ route nous voulons créer un lien. (Notez qu'il s'agit du _nom_ de la route et non pas du _chemin_, c'est pourquoi nous spécifions `"about"` et pas `"/about"`, et `"contact"` plutôt que `"/getting-in-touch"`.)

En plus des arguments, les composants supportent aussi les attributs HTML habituels. Dans notre exemple, nous avons ajouté une classe `"button"` pour appliquer un style, et nous pourrions également définir d'autres attributs comme l'attribut [ARIA](https://webaim.org/techniques/aria/) [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles). On les passe sans le symbole `@` (`class=...` et non `@class=...`), ainsi Ember sait que ce sont des attributs HTML standards.

Sous le capot, le composant `<LinkTo>` génère pour nous une balise `<a>` standard avec le `href` adéquat pour la route spécifique. Cette balise `<a>` fonctionne avec les [lecteurs d'écran](https://webaim.org/projects/screenreadersurvey/) (<span lang="en">_screen readers_</span>) et les utilisateurs peuvent aussi bien enregistrer le lien dans leurs marque-pages ou l'ouvrir dans un nouvel onglet.

Cependant, quand on clique sur ces liens spéciaux, Ember intercepte le clic, affiche le contenu de la nouvelle page et met à jour l'URL. Tout ça se fait localement, sans avoir à attendre le serveur, et évitant ainsi de recharger toute la page.

<!-- TODO: make this a gif instead -->

<img src="/images/tutorial/part-1/building-pages/index-with-link@2x.png" alt="Page d'index après l'ajout du lien" width="1024" height="250">

<img src="/images/tutorial/part-1/building-pages/about-with-link@2x.png" alt="Page d'à propos après l'ajout du lien" width="1024" height="274">

<img src="/images/tutorial/part-1/building-pages/contact-with-link@2x.png" alt="Page de contact après l'ajout du lien" width="1024" height="444">

Nous en apprendront plus sur la manière dont tout cela fonctionne très bientôt. D'ici là, cliquez sur le lien dans le navigateur. Avez-vous remarqué à quel point c'était rapide&nbsp;?

Félicitations&nbsp;! Vous êtes en chemin de devenir un·e grand·e artisan·e du web&nbsp;!
