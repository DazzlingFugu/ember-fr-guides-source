Maintenant que nous récupérons de vraies données depuis notre "serveur", ajoutons une nouvelle fonctionnalité, une page dédiée pour chacune de nos locations&nbsp;:

<img src="/images/tutorial/part-2/route-params/grand-old-mansion@2x.png" alt="L'app Super Rentals (page location) à la fin du chapitre" width="1024" height="1381">

En ajoutant ces pages locations, nous apprendrons les concepts suivants&nbsp;:

- Routes avec segments dynamiques
- Liens avec segments dynamiques
- Tests de composants avec accès au routeur
- Accéder aux paramètres des segments dynamiques
- Partager des configurations communes entre les tests

## Routes avec segments dynamiques

Il serait pratique que chacune de nos pages locations soit disponible via une URL prédictible, comme `/rentals/grand-old-mansion`. Aussi, puisque chaque page est dédiée à une seule location, nous pouvons afficher des informations plus détaillées sur la propriété en question. Il serait également intéressant de pouvoir mettre un signet sur une location, et de partager des liens directs vers chaque annonce de location afin que nos utilisateurs puissent revenir sur ces pages plus tard, une fois qu'ils ont fini de naviguer.

Mais commençons par le commencement&nbsp;: nous devons ajouter une route pour cette nouvelle page. Nous pouvons le faire en ajoutant une route `rental` au routeur.

```js { data-filename="app/router.js" data-diff="+12" }
import EmberRouter from '@ember/routing/router';
import config from 'super-rentals/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('about');
  this.route('contact', { path: '/getting-in-touch' });
  this.route('rental', { path: '/rentals/:rental_id' });
});
```

Remarquez que nous faisons quelque chose d'un peu différent ici. Au lieu d'utiliser le chemin par défaut (`/rental`), nous spécifions un chemin personnalisé. Non seulement nous utilisons un chemin personnalisé, mais nous passons également un `:rental_id`, qui est ce qu'on appelle un [segment dynamique](.../../../routing/defining-your-routes/#toc_dynamic-segments). Lorsque ces routes seront évaluées, le `rental_id` sera remplacé par l'`id` de la location vers laquelle nous essayons de naviguer.

## Liens avec segments dynamiques

Maintenant que cette route est en place, nous pouvons mettre à jour notre composant `<Rental>` pour créer un "lien" vers chaque page détaillée de nos locations&nbsp;!

```js { data-filename="app/components/rental.hbs" data-diff="-7,+8,+9,+10,+11,+12" }
<article class="rental">
  <Rental::Image
    src={{@rental.image}}
    alt="Photo de la propriété {{@rental.title}}"
  />
  <div class="details">
    <h3>{{@rental.title}}</h3>
    <h3>
      <LinkTo @route="rental" @model={{@rental}}>
        {{@rental.title}}
      </LinkTo>
    </h3>
    <div class="detail owner">
      <span>Propriétaire :</span> {{@rental.owner}}
    </div>
    <div class="detail type">
      <span>Type :</span> {{@rental.type}}
    </div>
    <div class="detail location">
      <span>Adresse :</span> {{@rental.city}}
    </div>
    <div class="detail bedrooms">
      <span>Nombre de chambres :</span> {{@rental.bedrooms}}
    </div>
  </div>
  <Map
    @lat={{@rental.location.lat}}
    @lng={{@rental.location.lng}}
    @zoom="9"
    @width="150"
    @height="150"
    alt="Carte de la propriété {{@rental.title}}"
  />
</article>
```

Puisque nous faisons un lien vers la route `rental` que nous venons de créer, nous savons que cette route nécessite un segment dynamique. Nous devons donc passer un argument `@model` pour que le composant `<LinkTo>` puisse générer l'URL appropriée pour ce modèle.

Voyons ce que ça donne. Si nous retournons dans notre navigateur et actualisons la page, nous devrions voir nos liens, mais, pour l'instant, quelque chose ne va pas&nbsp;!

<img src="/images/tutorial/part-2/route-params/broken-links@2x.png" alt="Les liens sont cassés" width="1024" height="1129">

Les liens pointent tous sur `/rentals/undefined`. Mince&nbsp;! C'est parce que `<LinkTo>` essaie d'utiliser la propriété `id` de notre modèle pour remplacer le segment dynamique et générer l'URL.

Alors quel est le problème&nbsp;? Eh bien notre modèle n'a pas de propriété `id`&nbsp;! Et donc le composant `<LinkTo>` est bien incapable de le trouver pour générer l'URL. Oups&nbsp;!

Heureusement, nous pouvons corriger ça assez facilement. Il se trouve que les données retournées par notre serveur (les données JSON qui se trouvent dans notre dossier `public/api`) ont bien un attribut `id`. On peut le vérifier en visitant `http://localhost:4200/api/rentals.json`.

<img src="/images/tutorial/part-2/route-params/data@2x.png" alt="Nos données ont bien un attribut id" width="1024" height="512">

Si on regarde les données JSON ici, on peut voir que l'`id` est présent au même niveau que la clé `attributes`. Nous avons donc accès à cette donnée, le seul problème est que nous ne l'avons pas incluse dans notre modèle&nbsp;! Changeons notre _hook_ de modèle (_model hook_) dans la route `index` de manière à ce que l'`id` soit inclus.

```js { data-filename="app/routes/index.js" data-diff="-11,+12,-21,+22" }
import Route from '@ember/routing/route';

const COMMUNITY_CATEGORIES = ['Copropriété', 'Maison de ville', 'Appartement'];

export default class IndexRoute extends Route {
  async model() {
    let response = await fetch('/api/rentals.json');
    let { data } = await response.json();

    return data.map((model) => {
      let { attributes } = model;
      let { id, attributes } = model;
      let type;

      if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
        type = 'Dans une copropriété';
      } else {
        type = 'Propriété indépendante';
      }

      return { type, ...attributes };
      return { id, type, ...attributes };
    });
  }
}
```

Maintenant que nous avons inclus l'`id` du modèle, nous devrions voir des URLs correctes pour chaque location de notre page d'index une fois la page actualisée.

## Tests de composants avec accès au routeur

Très bien, il ne nous reste plus qu'une dernière étape&nbsp;: mettre à jour les tests. Nous pouvons ajouter un `id` à l'objet `rental` que nous avons défini dans nos tests à l'aide de `setProperties`, puis ajouter une assertion pour confirmer l'URL.

```js { data-filename="tests/integration/components/rental-test.js" data-diff="+12,+34,+35,+36" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders information about a rental property', async function (assert) {
    this.setProperties({
      rental: {
        id: 'grand-old-mansion',
        title: 'Le Manoir Ancien',
        owner: 'Veruca Salt',
        city: 'San Francisco',
        location: {
          lat: 37.7749,
          lng: -122.4194,
        },
        category: 'Domaine',
        type: 'Propriété indépendante',
        bedrooms: 15,
        image:
          'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
        description:
          'Ce manoir ancien et spacieux se trouve sur un domaine de plus de 100 acres de collines et de forêts de séquoias denses.',
      },
    });

    await render(hbs`<Rental @rental={{this.rental}} />`);

    assert.dom('article').hasClass('rental');
    assert.dom('article h3').hasText('Le Manoir Ancien');
    assert
      .dom('article h3 a')
      .hasAttribute('href', '/rentals/grand-old-mansion');
    assert.dom('article .detail.owner').includesText('Veruca Salt');
    assert.dom('article .detail.type').includesText('Propriété indépendante');
    assert.dom('article .detail.location').includesText('San Francisco');
    assert.dom('article .detail.bedrooms').includesText('15');
    assert.dom('article .image').exists();
    assert.dom('article .map').exists();
  });
});
```

Si nous exécutons les tests dans le navigateur, tout devrait passer&nbsp;!

<img src="/images/tutorial/part-2/route-params/pass@2x.png" alt="Les tests passent" width="1024" height="768">

## Accéder aux paramètres des segments dynamiques

Super&nbsp;! Nous faisons de gros progrès.

Maintenant que nous avons notre route `rental`, finissons la page `rental`. La première chose à faire est de rendre notre route capable de faire quelque chose, justement. Nous avons certes ajouté la route, mais nous ne l'avons pas encore implémentée. Alors faisons ça en créant un fichier de route.

```js { data-filename="app/routes/rental.js" }
import Route from '@ember/routing/route';

const COMMUNITY_CATEGORIES = ['Copropriété', 'Maison de ville', 'Appartement'];

export default class RentalRoute extends Route {
  async model(params) {
    let response = await fetch(`/api/rentals/${params.rental_id}.json`);
    let { data } = await response.json();

    let { id, attributes } = data;
    let type;

    if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
      type = 'Dans une copropriété';
    } else {
      type = 'Propriété indépendante';
    }

    return { id, type, ...attributes };
  }
}
```

On notera que le _hook_ de modèle dans notre `RentalRoute` est "presque" le même que celui de `IndexRoute`. Il y a une différence majeure entre ces deux routes, et on peut voir cette différence reflétée ici.

Contrairement à `IndexRoute`, nous avons un objet `params` qui est passé dans notre _hook_ de modèle. C'est parce que nous avons besoin de récupérer nos données depuis le point de terminaison (_endpoint_) `/api/rentals/${id}.json`, **pas** le point de terminaison `/api/rentals.json` que nous utilisions précédemment. Nous savons déjà que les points de terminaison d'une location individuelle récupèrent un seul objet location, plutôt qu'un tableau, et que la route utilise un segment dynamique `/:rental_id` pour déterminer quelle location nous essayons de récupérer sur le serveur.

Mais comment le segment dynamique arrive-t-il jusqu'à la fonction `fetch`&nbsp;? Eh bien, nous devons le passer dans la fonction. Nous avons accès à la valeur du segment dynamique `/:rental_id` à travers l'objet `params`, ce qui est bien pratique. C'est pourquoi nous avons un argument `params` dans notre _hook_ de modèle ici. Il est transmis à ce _hook_, et nous utilisons l'attribut `params.rental_id` pour déterminer les données que nous voulons récupérer avec `fetch`.

En dehors de ces différences mineures, le reste de la route est pratiquement la même que ce que nous avions dans la route d'index.

## Afficher les détails d'un modèle avec un composant

Ensuite, créons un composant `<Rental::Detailed>`.

```shell
$ ember generate component rental/detailed
installing component
  create app/components/rental/detailed.hbs
  skip app/components/rental/detailed.js
  tip to add a class, run `ember generate component-class rental/detailed`
installing component-test
  create tests/integration/components/rental/detailed-test.js
```

```handlebars { data-filename="app/components/rental/detailed.hbs" data-diff="-1,+2,+3,+4,+5,+6,+7,+8,+9,+10,+11,+12,+13,+14,+15,+16,+17,+18,+19,+20,+21,+22,+23,+24,+25,+26,+27,+28,+29,+30,+31,+32,+33,+34,+35,+36,+37,+38,+39,+40,+41,+42,+43,+44,+45" }
{{yield}}
<Jumbo>
  <h2>{{@rental.title}}</h2>
  <p>Bien trouvé&nbsp;! Voilà ce qui semble être un bon endroit où rester près de {{@rental.city}}.</p>
  <a href="#" target="_blank" rel="external nofollow noopener noreferrer" class="share button">
    Partager sur Twitter
  </a>
</Jumbo>

<article class="rental detailed">
  <Rental::Image
    src={{@rental.image}}
    alt="Photo de la propriété {{@rental.title}}"
  />

  <div class="details">
    <h3>À propos de {{@rental.title}}</h3>

    <div class="detail owner">
      <span>Propriétaire :</span> {{@rental.owner}}
    </div>
    <div class="detail type">
      <span>Type :</span> {{@rental.type}} – {{@rental.category}}
    </div>
    <div class="detail location">
      <span>Adresse :</span> {{@rental.city}}
    </div>
    <div class="detail bedrooms">
      <span>Nombre de chambres :</span> {{@rental.bedrooms}}
    </div>
    <div class="detail description">
      <p>{{@rental.description}}</p>
    </div>
  </div>

  <Map
    @lat={{@rental.location.lat}}
    @lng={{@rental.location.lng}}
    @zoom="12"
    @width="894"
    @height="600"
    alt="Carte de la propriété {{@rental.title}}"
    class="large"
  />
</article>
```

Ce composant est similaire à notre composant `<Rental>`, à quelques différences près&nbsp;:

- Il affiche une bannière avec un bouton de partage en haut (l'implémentation se fera plus tard).
- Il affiche une image plus grande par défaut, avec quelques informations détaillées supplémentaires.
- Il affiche une carte plus grande.
- Il affiche une description.

## Partager des configurations communes entre les tests

Maintenant que nous avons ce _template_ en place, ajoutons des tests pour notre nouveau composant.

```handlebars { data-filename="tests/integration/components/rental/detailed-test.js" data-diff="-9,-10,-11,+12,+13,+14,+15,+16,+17,+18,+19,+20,+21,+22,+23,+24,+25,+26,+27,+28,+29,+30,+31,+32,-34,+35,+36,-38,+39,+40,+41,+42,+43,+44,+45,-47,-48,-49,-50,-51,-52,+53,+54,-56,+57,+58,+59,+60,+61,+62,+63,+64" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental/detailed', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
  hooks.beforeEach(function () {
    this.setProperties({
      rental: {
        id: 'grand-old-mansion',
        title: 'Le Manoir Ancien',
        owner: 'Veruca Salt',
        city: 'San Francisco',
        location: {
          lat: 37.7749,
          lng: -122.4194,
        },
        category: 'Domaine',
        type: 'Propriété indépendante',
        bedrooms: 15,
        image:
          'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
        description:
          'Ce manoir ancien et spacieux se trouve sur un domaine de plus de 100 acres de collines et de forêts de séquoias denses.',
      },
    });
  });

    await render(hbs`<Rental::Detailed />`);
  test('it renders a header with a share button', async function (assert) {
    await render(hbs`<Rental::Detailed @rental={{this.rental}} />`);

    assert.dom(this.element).hasText('');
    assert.dom('.jumbo').exists();
    assert.dom('.jumbo h2').containsText('Le Manoir Ancien');
    assert
      .dom('.jumbo p')
      .containsText('a nice place to stay near San Francisco');
    assert.dom('.jumbo a.button').containsText('Partager sur Twitter');
  });

    // Template block usage:
    await render(hbs`
      <Rental::Detailed>
        template block text
      </Rental::Detailed>
    `);
  test('it renders detailed information about a rental property', async function (assert) {
    await render(hbs`<Rental::Detailed @rental={{this.rental}} />`);

    assert.dom(this.element).hasText('template block text');
    assert.dom('article').hasClass('rental');
    assert.dom('article h3').containsText('À propos de Le Manoir Ancien');
    assert.dom('article .detail.owner').containsText('Veruca Salt');
    assert.dom('article .detail.type').containsText('Propriété indépendante');
    assert.dom('article .detail.location').containsText('San Francisco');
    assert.dom('article .detail.bedrooms').containsText('15');
    assert.dom('article .image').exists();
    assert.dom('article .map').exists();
  });
});
```

On peut utiliser le _hook_ `beforeEach` pour partager du code par défaut, ce qui nous permet d'avoir deux tests qui se concentrent chacun sur un aspect distinct du composant. Ça ressemble à d'autres tests que nous avons déjà écrit (en espérant que ça ait l'air facile&nbsp;!)

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p>Comme son nom l'indique, le <em>hook</em> <code>beforeEach</code> s'exécute <strong>une fois</strong> avant que chaque fonction <code>test</code> soit exécutée. Ce <em>hook</em> est l'endroit idéal pour configurer ce dont tous les tests du fichier ont besoin. D'autre part, si vous avez besoin de faire du nettoyage après chaque test, il existe un <em>hook</em> <code>afterEach</code>&nbsp;!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

<img src="/images/tutorial/part-2/route-params/pass-2@2x.png" alt="Les tests passent comme attendu" width="1024" height="768">

## Ajouter un _template_ de route

Pour terminer, ajoutons un _template_ `rental` pour "invoquer" notre composant `<Rental::Detailed>`, puis ajouter un test d'acceptance pour ce nouveau comportement de notre app.

```handlebars { data-filename="app/templates/rental.hbs" }
<Rental::Detailed @rental={{@model}} />
```

```js { data-filename="tests/acceptance/super-rentals-test.js" data-diff="+22,+23,+24,+25,+26,+27,+28,+29,+30,+31,+32,+33,+34,+35,+36,+37,+38,+39" }
import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'super-rentals/tests/helpers';

module('Acceptance | super rentals', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('Bienvenue sur "Super Rentals" !');

    assert.dom('.jumbo a.button').hasText('À propos de nous');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });

  test('viewing the details of a rental property', async function (assert) {
    await visit('/');
    assert.dom('.rental').exists({ count: 3 });

    await click('.rental:first-of-type a');
    assert.strictEqual(currentURL(), '/rentals/grand-old-mansion');
  });

  test('visiting /rentals/grand-old-mansion', async function (assert) {
    await visit('/rentals/grand-old-mansion');

    assert.strictEqual(currentURL(), '/rentals/grand-old-mansion');
    assert.dom('nav').exists();
    assert.dom('h1').containsText('SuperRentals');
    assert.dom('h2').containsText('Le Manoir Ancien');
    assert.dom('.rental.detailed').exists();
  });

  test('visiting /about', async function (assert) {
    await visit('/about');

    assert.strictEqual(currentURL(), '/about');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('À propos de "Super Rentals"');

    assert.dom('.jumbo a.button').hasText('Contactez-nous');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/getting-in-touch');
  });

  test('visiting /getting-in-touch', async function (assert) {
    await visit('/getting-in-touch');

    assert.strictEqual(currentURL(), '/getting-in-touch');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('Contactez-nous');

    assert.dom('.jumbo a.button').hasText('À propos');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });

  test('navigating using the nav-bar', async function (assert) {
    await visit('/');

    assert.dom('nav').exists();
    assert.dom('nav a.menu-index').hasText('SuperRentals');
    assert.dom('nav a.menu-about').hasText('À propos');
    assert.dom('nav a.menu-contact').hasText('Contact');

    await click('nav a.menu-about');
    assert.strictEqual(currentURL(), '/about');

    await click('nav a.menu-contact');
    assert.strictEqual(currentURL(), '/getting-in-touch');

    await click('nav a.menu-index');
    assert.strictEqual(currentURL(), '/');
  });
});
```

Maintenant, quand nous visitons `http://localhost:4200/rentals/grand-old-mansion`, voici ce que nous voyons&nbsp;:

<img src="/images/tutorial/part-2/route-params/grand-old-mansion@2x.png" alt="Une page dédiée pour Le Manoir Ancien" width="1024" height="1381">

Et si nous lançons les tests...

<img src="/images/tutorial/part-2/route-params/pass-3@2x.png" alt="Tous les tests passent !" width="1024" height="768">

...ils passent tous&nbsp;! Bon travail&nbsp;!

Cette page "a l'air" terminée, mais il nous reste un bouton de partage qui ne fonctionne pas. Nous aborderons ça dans le chapitre suivant.
