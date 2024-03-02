Dans ce chapitre, nous supprimerons les données en dur du composant `<Rental>`. À la fin, votre app affichera enfin de vraies données venant du serveur&nbsp;:

<img src="/images/tutorial/part-1/working-with-data/three-properties@2x.png" alt="L'app Super Rentals à la fin du chapitre" width="1024" height="1129" />

Dans ce chapitre, vous apprendrez à&nbsp;:

- Travailler avec les fichiers de route
- Retourner des données locales à partir du <span lang="en">_model hook_</span>
- Accéder aux modèles des routes depuis les <span lang="en">_templates_</span>
- _Mocker_ les données du serveur avec des fichiers JSON statiques
- Récupérer les données distantes à partir du <span lang="en">_model hook_</span>
- Adapter les données du serveur
- Créer des boucles et des variables locales dans les <span lang="en">_templates_</span> avec `{{#each}}`

## Travailler avec les fichiers de route

Jusque-là, nous avons tout codé en dur dans notre composant `<Rental>`. Mais ce n'est probablement pas très maintenable, surtout qu'à terme, nous voulons que nos données proviennent plutôt d'un serveur. Allons-y, déplaçons une partie des valeurs en dur en dehors du composant pour préparer le terrain. 

Ce que nous voulons à terme, c'est que l'app récupère les données du serveur, puis les affiche en tant que contenu dynamique depuis les <span lang="en">_templates_</span>. Pour faire ça, il nous faut un endroit où écrire le code qui va récupérer les données et les charger dans les routes.

Dans Ember, [les fichiers de route](../../../routing/defining-your-routes/) sont l'endroit idéal. Nous n'en avions pas eu besoin jusqu'ici car toutes nos routes ne faisaient essentiellement qu'afficher des pages statiques, mais nous sommes sur le point de changer ça.

Commençons par créer un ficher de route pour la route d'index. Créons-le au chemin `app/routes/index.js` avec le contenu suivant&nbsp;:

```js { data-filename="app/routes/index.js" }
import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
  async model() {
    return {
      title: 'Le Manoir Ancien',
      owner: 'Veruca Salt',
      city: 'San Francisco',
      Adresse : {
        lat: 37.7749,
        lng: -122.4194,
      },
      category: 'Domaine',
      type: 'Indépendant',
      bedrooms: 15,
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
      description: 'Ce manoir ancien et spatieux se trouve sur un domaine de plus de 100 acres de collines et de forêts de séquoias denses.',
    };
  }
}
```

Ça fait beaucoup de nouvelles choses d'un seul coup, alors voyons ça. D'abord, nous importons la [classe Route](https://api.emberjs.com/ember/release/classes/Route) dans le fichier. Cette classe est utilisée comme point de départ pour ajouter des fonctionnalités à une route, comme charger des données.

Ensuite, nous étendons la classe `Route` à notre propre `IndexRoute`, que nous [exportons](https://javascript.info/import-export#export-default) également afin que le reste de l'application puisse l'utiliser.

## Retourner des données locales à partir du <span lang="en">_model hook_</span>

Jusque-là, tout va bien. Mais que se passe-t-il dans cette classe de route&nbsp;? Nous avons implémenté une méthode _[async](https://developer.mozilla.org/docs/Learn/JavaScript/Asynchronous/Concepts)_ appelée `model()`. Cette méthode est aussi appelée le <span lang="en">_model hook_</span> (<span lang="en">_hook_</span> signifie littéralement "un crochet" mais se traduit mal dans un contexte technique. On peut voir le <span lang="en">_hook_</span> comme une fonction mise à disposition et exécutée en interne par le framework, et dont on définit le contenu, on y "accroche" du code).

Le <span lang="en">_model hook_</span> est responsable de la récupération et de la préparation de toutes les données dont la route a besoin. Ember va appeler ce <span lang="en">_hook_</span> automatiquement en entrant dans une route, afin que vous ayez l'opportunité d'exécuter votre propre code pour obtenir les données qu'il vous faut. L'objet retourné par le <span lang="en">_hook_</span> est appelé le [<span lang="en">_model_</span> (modèle)](../../../routing/specifying-a-routes-model/) de la route (sans blague&nbsp;!)

Habituellement, c'est là qu'on récupère les données d'un serveur. Puisque la récupération des données est une opération asynchrone, le <span lang="en">_model hook_</span> est marqué `async`. Ceci nous donne la possibilité d'utiliser le mot-clé `await` pour attendre la fin de l'opération.

Nous y viendrons un peu plus tard. Pour le moment, nous retournons simplement le même modèle de données codé en dur, extrait du composant `<Rental>`, mais au format d'un [objet JavaScript](https://developer.mozilla.org/docs/Learn/JavaScript/Objects/Basics)

## Accéder aux modèles des routes depuis les <span lang="en">_templates_</span>

Maintenant que nous avons préparé un modèle de données pour notre route, utilisons-le dans notre <span lang="en">_template_</span>. Dans les <span lang="en">_templates_</span> de route, nous pouvons accéder au modèle de la route en tant que `@model`. Dans notre cas, il contiendra le [POJO](https://fr.wikipedia.org/wiki/Plain_old_Java_object) retourné par notre <span lang="en">_model hook_</span>.

Pour tester ça, modifions notre <span lang="en">_template_</span> et essayons d'afficher la propriété `title` du modèle&nbsp;:

```handlebars { data-filename="app/templates/index.hbs" data-diff="+7,+8" }
<Jumbo>
  <h2>Bienvenue sur "Super Rentals" !</h2>
  <p>Nous espérons que vous trouverez l'endroit parfait où séjourner.</p>
  <LinkTo @route="about" class="button">À propos de nous</LinkTo>
</Jumbo>

<h1>{{@model.title}}</h1>

<div class="rentals">
  <ul class="results">
    <li><Rental /></li>
    <li><Rental /></li>
    <li><Rental /></li>
  </ul>
</div>
```

En regardant la page dans le navigateur, nous devrions voir la donnée `title` de notre modèle reflétée par un nouveau titre.

<img src="/images/tutorial/part-1/working-with-data/model-header@2x.png" alt="Nouveau titre utilisant une des données de @model" width="1024" height="512" />

Super&nbsp;!

Ok, maintenant que nous sommes certains d'avoir un modèle à notre disposition, supprimons le code en dur écrit plus tôt&nbsp;! Plutôt que de coder explicitement en dur les informations sur la location dans le composant `<Rental>`, passons-lui l'objet modèle.

Essayons.

D'abord, passons le modèle au composant `<Rental>` sous la forme de l'argument `@rental`. Nous supprimerons aussi la balise `<h1>` ajoutée pour le test, maintenant que nous savons que ça fonctionne&nbsp;:

```handlebars { data-filename="app/templates/index.hbs" data-diff="-7,-8,-11,-12,-13,+14,+15,+16" }
<Jumbo>
  <h2>Bienvenue sur "Super Rentals" !</h2>
  <p>Nous espérons que vous trouverez l'endroit parfait où séjourner.</p>
  <LinkTo @route="about" class="button">À propos de nous</LinkTo>
</Jumbo>

<h1>{{@model.title}}</h1>

<div class="rentals">
  <ul class="results">
    <li><Rental /></li>
    <li><Rental /></li>
    <li><Rental /></li>
    <li><Rental @rental={{@model}} /></li>
    <li><Rental @rental={{@model}} /></li>
    <li><Rental @rental={{@model}} /></li>
  </ul>
</div>
```

En passant `@model` au composant `<Rental>` sous la forme de l'argument `@rental`, nous aurons accès à l'objet modèle "Le Manoir Ancien" dans le <span lang="en">_template_</span> de `<Rental>`&nbsp;! À présent, nous pouvons remplacer nos valeurs en dur par les valeurs à l'intérieur de notre modèle `@rental`.

```handlebars { data-filename="app/components/rental.hbs" data-diff="-3,-4,+5,+6,-9,+10,-12,+13,-16,+17,-20,+21,-24,+25,-29,-30,+31,+32,-36,+37" }
<article class="rental">
  <Rental::Image
    src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg"
    alt="A picture of Le Manoir Ancien"
    src={{@rental.image}}
    alt="A picture of {{@rental.title}}"
  />
  <div class="details">
    <h3>Le Manoir Ancien</h3>
    <h3>{{@rental.title}}</h3>
    <div class="detail owner">
      <span>Propriétaire :</span> Veruca Salt
      <span>Propriétaire :</span> {{@rental.owner}}
    </div>
    <div class="detail type">
      <span>Type:</span> Standalone
      <span>Type:</span> {{@rental.type}}
    </div>
    <div class="detail location">
      <span>Adresse :</span> San Francisco
      <span>Adresse :</span> {{@rental.city}}
    </div>
    <div class="detail bedrooms">
      <span>Nombre de chambres :</span> 15
      <span>Nombre de chambres :</span> {{@rental.bedrooms}}
    </div>
  </div>
  <Map
    @lat="37.7749"
    @lng="-122.4194"
    @lat={{@rental.location.lat}}
    @lng={{@rental.location.lng}}
    @zoom="9"
    @width="150"
    @height="150"
    alt="A map of Le Manoir Ancien"
    alt="A map of {{@rental.title}}"
  />
</article>
```

Puisque l'objet modèle contient exactement les mêmes données que celles, précédemment codées en dur, de "Le Manoir Ancien", la page devrait rester exactement telle qu'elle était avant les changements.

<img src="/images/tutorial/part-1/working-with-data/using-model-data@2x.png" alt="Nouvelle entête utilisant les données de @model" width="1024" height="512" />

Il ne nous reste plus qu'une chose à faire&nbsp;: mettre à jour les tests pour refléter les changements.

Parce que les tests des composants sont supposés afficher et tester un seul composant en isolation du reste de l'app, ils ne peuvent pas effectuer de navigation, ce qui signifie qu'ils n'ont pas accès aux données du <span lang="en">_model hook_</span>.

Ainsi, dans le test de notre composant `<Rental>`, nous devons créer les données d'une autre manière. Nous pouvons le faire en utilisant la méthode `setProperties` apprise dans le [chapitre précédent](../reusable-components/).

```js { data-filename="tests/integration/components/rental-test.js" data-diff="-10,+11,+12,+13,+14,+15,+16,+17,+18,+19,+20,+21,+22,+23,+24,+25,+26,+27,+28,+29,+30" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders information about a rental property', async function (assert) {
    await render(hbs`<Rental />`);
    this.setProperties({
      rental: {
        title: 'Le Manoir Ancien',
        owner: 'Veruca Salt',
        city: 'San Francisco',
        Adresse : {
          lat: 37.7749,
          lng: -122.4194,
        },
        category: 'Domaine',
        type: 'Propriété indépendante',
        bedrooms: 15,
        image:
          'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
        description:
          'Ce manoir ancien et spatieux se trouve sur un domaine de plus de 100 acres de collines et de forêts de séquoias denses.',
      },
    });

    await render(hbs`<Rental @rental={{this.rental}} />`);

    assert.dom('article').hasClass('rental');
    assert.dom('article h3').hasText('Le Manoir Ancien');
    assert.dom('article .detail.owner').includesText('Veruca Salt');
    assert.dom('article .detail.type').includesText('Propriété indépendante');
    assert.dom('article .detail.location').includesText('San Francisco');
    assert.dom('article .detail.bedrooms').includesText('15');
    assert.dom('article .image').exists();
    assert.dom('article .map').exists();
  });
});
```

Notez que nous devons aussi mettre à jour l'invocation du composant `<Rental>` dans l'appel à la fonction `render`, pour lui passer l'argument `@rental` ici aussi. Si nous relançons nos tests, ils devraient tous passer&nbsp;!

<img src="/images/tutorial/part-1/working-with-data/pass@2x.png" alt="Tous nos tests passent" width="1024" height="768" />

## _Mocker_ les données du serveur avec des fichiers JSON statiques

Maintenant que nous avons préparé le terrain, attaquons la partie amusante en supprimant _toutes_ les valeurs en dur du <span lang="en">_model hook_</span> et récupérons des données provenant du serveur&nbsp;!

Dans une app en production, les données que nous récupérons proviendraient probablement d'un serveur d'API distant. Pour éviter de configurer un serveur d'API juste pour ce tutoriel, nous placerons des données JSON dans le dossier `public`. De cette manière, nous pouvons toujours demander ces données JSON avec des requêtes HTTP classiques (mais sans avoir à écrire de la logique serveur).

Mais d'où proviendrons ces données&nbsp;? Vous pouvez  <a href="/downloads/data.zip" download="data.zip">télécharger ce fichier de données</a>, dans lequel nous avons préparé quelques données JSON et les avons groupées dans un fichier au format `.zip`. Extrayez ce contenu dans votre dossier `public`.

Quand vous aurez fini, votre dossier `public` devrait avoir le contenu suivant&nbsp;:

```plain
public
├── api
│   ├── rentals
│   │   ├── downtown-charm.json
│   │   ├── grand-old-mansion.json
│   │   └── urban-living.json
│   └── rentals.json
├── assets
│   └── images
│       └── teaching-tomster.png
└── robots.txt

4 directories, 6 files
```

Vous pouvez vérifier que tout fonctionne correctement en navigant sur `http://localhost:4200/api/rentals.json`.

<img src="/images/tutorial/part-1/working-with-data/data@2x.png" alt="Notre serveur servant les propriétés à louer en tant que données JSON" width="1024" height="512" />

Super&nbsp;! Notre "serveur" est maintenant prêt et en marche, il sert nos propriétés à louer en tant que données JSON.

## Récupérer les données distantes à partir du <span lang="en">_model hook_</span>

Maintenant, tournons de nouveau notre attention vers le <span lang="en">_model hook_</span>. Nous devons le modifier afin qu'il récupère effectivement les données du serveur.

```js { data-filename="app/routes/index.js" data-diff="-5,-6,-7,-8,-9,-10,-11,-12,-13,-14,-15,-16,-17,-18,+19,+20,+21" }
import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
  async model() {
    return {
      title: 'Le Manoir Ancien',
      owner: 'Veruca Salt',
      city: 'San Francisco',
      Adresse : {
        lat: 37.7749,
        lng: -122.4194,
      },
      category: 'Domaine',
      type: 'Propriété indépendante',
      bedrooms: 15,
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
      description: 'Ce manoir ancien et spatieux se trouve sur un domaine de plus de 100 acres de collines et de forêts de séquoias denses.',
    };
    let response = await fetch('/api/rentals.json');
    let parsed = await response.json();
    return parsed;
  }
}
```

Que se passe-t-il ici&nbsp;? D'abord, nous utilisons l'[API Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) du navigateur pour demander nos données JSON situées à l'adresse `public/api/rentals.json`, la même URL que nous avons visité plus tôt.

Comme mentionné ci-dessus, récupérer les données provenant du serveur est généralement une opération asynchrone. L'API Fetch prend ça en compte, c'est pourquoi `fetch` est une fonction `async`, tout comme notre <span lang="en">_model hook_</span>. Pour exploiter la réponse, nous devons la pairer avec le mot-clé `await`.

L'API Fetch retourne un [objet réponse](https://developer.mozilla.org/docs/Web/API/Response) de façon asynchrone. Une fois que nous avons cet objet, nous pouvons convertir la réponse du serveur au format dont nous avons besoin&nbsp;; dans notre cas, nous savons que le serveur envoie les données au format JSON, donc nous pouvons utiliser la méthode `json()` pour ["parser"](https://developer.mozilla.org/docs/Web/API/Body/json) les données de réponses en conséquence. Parser les données de réponse est aussi une opération asynchrone, donc nous employons le mot-clé `await` ici aussi.

## Adapter les données du serveur

Avant d'aller plus loin, prenons une seconde pour regarder à nouveau les données du serveur.

```json { data-filename="public/api/rentals.json" }
{
  "data": [
    {
      "type": "rentals",
      "id": "grand-old-mansion",
      "attributes": {
        "title": "Le Manoir Ancien",
        "owner": "Veruca Salt",
        "city": "San Francisco",
        "location": {
          "lat": 37.7749,
          "lng": -122.4194
        },
        "category": "Domaine",
        "bedrooms": 15,
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg",
        "description": "Ce manoir ancien et spatieux se trouve sur un domaine de plus de 100 acres de collines et de forêts de séquoias denses."
      }
    },
    {
      "type": "rentals",
      "id": "urban-living",
      "attributes": {
        "title": "Urban Living",
        "owner": "Mike Teavee",
        "city": "Seattle",
        "location": {
          "lat": 47.6062,
          "lng": -122.3321
        },
        "category": "Copropriété",
        "bedrooms": 1,
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/20/Seattle_-_Barnes_and_Bell_Buildings.jpg",
        "description": "Un rêve pour les banlieusards. Cette location est à distance de marche de 2 arrêts de bus et du métro."
      }
    },
    {
      "type": "rentals",
      "id": "downtown-charm",
      "attributes": {
        "title": "Downtown Charm",
        "owner": "Violet Beauregarde",
        "city": "Portland",
        "location": {
          "lat": 45.5175,
          "lng": -122.6801
        },
        "category": "Appartement",
        "bedrooms": 3,
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f7/Wheeldon_Apartment_Building_-_Portland_Oregon.jpg",
        "description": "La commodité est à votre porte avec cette charmante location du centre-ville. D'excellents restaurants et une vie nocturne active se trouvent à quelques mètres."
      }
    }
  ]
}
```

Ces données suivent le format [JSON:API](https://jsonapi.org/), qui est "légèrement" différent des données en dur que nous retournions du <span lang="en">_model hook_</span> auparavant.

Tout d'abord, le format JSON:API retourne un tableau imbriqué sous la clé `"data"`, plutôt qu'un objet pour une seule propriété à louer. Quand on y pense, ça fait sens&nbsp;; à ce stade nous voulons afficher une liste entière de locations provenant du serveur, et non plus une seule, donc un tableau d'objets représentant les propriétés à louer est exactement ce qu'il nous faut.

Les objets représentant les locations, contenus dans le tableau, ont également une structure légèrement différente. Chaque objet de données possède un `type` et un `id`, que nous n'avons pas (encore&nbsp;!) l'intention d'utiliser dans notre <span lang="en">_template_</span>. Pour l'instant, les seules données dont nous avons vraiment besoin sont celles imbriquées dans la clé `attributes`.

Il y a une autre différence clé ici, et il faut avoir le regard aiguisé pour la détecter&nbsp;: les données provenant du serveur n'ont pas la propriété `type` qui existait dans notre objet modèle codé en dur. La propriété `type` pouvait être `"Propriété indépendante"` ou `"Dans une copropriété"` en fonction du type de location, et elle est requise par notre composant `<Rental>`.

Dans la [Partie 2](../../part-2/) de ce tutoriel, nous apprendrons un moyen plus pratique d'exploiter les données au format JSON:API. Pour l'instant, fixons simplement les données en gérant nous-mêmes les différences dans entre les formats.

Nous pouvons gérer ça dans le <span lang="en">_model hook_</span>&nbsp;:

```js { data-filename="app/routes/index.js" data-diff="+3,+4,-8,-9,+10,+11,+12,+13,+14,+15,+16,+17,+18,+19,+20,+21,+22,+23" }
import Route from '@ember/routing/route';

const COMMUNITY_CATEGORIES = ['Copropriété', 'Maison de ville', 'Appartement'];

export default class IndexRoute extends Route {
  async model() {
    let response = await fetch('/api/rentals.json');
    let parsed = await response.json();
    return parsed;
    let { data } = await response.json();

    return data.map((model) => {
      let { attributes } = model;
      let type;

      if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
        type = 'Dans une copropriété';
      } else {
        type = 'Propriété indépendante';
      }

      return { type, ...attributes };
    });
  }
}
```

Après avoir parser les données JSON, nous extrayons l'objet `attributes`, nous y rajoutons l'attribut `type` manquant manuellement, puis nous le retournons du <span lang="en">_model hook_</span>. De cette manière, le reste de l'app n'y verra que du feu.

Super&nbsp;! Maintenant, passons à la suite.

## Créer des boucles et des variables locales dans les <span lang="en">_templates_</span> avec `{{#each}}`

Le dernier changement à faire se situe dans le <span lang="en">_template_</span> de route `index.hbs`, où nous invoquons les composants `<Rental>`. Précédemment, nous passions `@model` à nos composants via `@rental`. Sauf que `@model` n'est plus un objet simple, mais un tableau&nbsp;! Ainsi, il faut changer le <span lang="en">_template_</span> pour prendre ça en compte.

Voyons comment&nbsp;:

```handlebars { data-filename="app/templates/index.hbs" data-diff="-9,-10,-11,+12,+13,+14" }
<Jumbo>
  <h2>Bienvenue sur "Super Rentals" !</h2>
  <p>Nous espérons que vous trouverez l'endroit parfait où séjourner.</p>
  <LinkTo @route="about" class="button">À propos de nous</LinkTo>
</Jumbo>

<div class="rentals">
  <ul class="results">
    <li><Rental @rental={{@model}} /></li>
    <li><Rental @rental={{@model}} /></li>
    <li><Rental @rental={{@model}} /></li>
    {{#each @model as |rental|}}
      <li><Rental @rental={{rental}} /></li>
    {{/each}}
  </ul>
</div>
```

Nous utilisons la syntaxe `{{#each}}...{{/each}}` pour itérer et boucler sur le tableau retourné par le <span lang="en">_model hook_</span>. Pour chaque itération sur le tableau (c'est-à-dire pour chaque élément à l'intérieur du tableau), nous affichons le bloc qui lui est passé une seule fois. Dans notre cas, le bloc est notre composant `<Rental>`, entouré de balises `<li>`.

À l'intérieur du bloc, nous avons accès à l'élément de l'itération "courante" via la variable `{{rental}}`. Pourquoi&nbsp;`rental`? Eh bien, parce que c'est le nom que nous avons choisi de lui donner&nbsp;! Cette variable vient de la déclaration `as |rental|` de la boucle `each`. Nous aurions très bien pu l'appeler autrement, comme `as |property|`, auquel cas nous aurions accédé à l'élément courant via la variable `{{property}}`.

Maintenant, regardons notre navigateur et voyons à quoi ressemble notre route d'index avec ce changement.

<img src="/images/tutorial/part-1/working-with-data/three-properties@2x.png" alt="Trois propriétés à louer différentes" width="1024" height="1129" />

Hourra&nbsp;! Nous voyons enfin différentes propriétés à louer dans notre liste. Et nous avons joué avec `fetch` et écrit une boucle. Plutôt productif, si vous voulez mon avis.

Et encore mieux, nos tests passent toujours&nbsp;!

<img src="/images/tutorial/part-1/working-with-data/pass-2@2x.png" alt="Tous nos tests passent" width="1024" height="768" />
