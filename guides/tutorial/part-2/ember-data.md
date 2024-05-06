Dans ce chapitre, nous allons nous atteler à supprimer du code dupliqué dans nos gestionnaires de routes (_route handlers_), en utilisant EmberData pour gérer nos données. Visuellement, le résultat final sera exactement comme avant&nbsp;:

<img src="/images/tutorial/part-2/ember-data/homepage@2x.png" alt="L'app Super Rentals à la fin du chapitre" width="1024" height="1129">

Pendant cette refactorisation, vous apprendrez ce qui suit&nbsp;:

- Les modèles EmberData
- Tester les modèles
- Charger un modèle dans une route
- Le _store_ d'EmberData
- Travailler avec des adaptateurs et des sérialiseurs

## Qu'est-ce qu'EmberData&nbsp;?

Maintenant que nous avons ajouté quelques fonctionnalités, il est à nouveau temps de nettoyer un peu&nbsp;!

Plus tôt dans le tutoriel, nous avons ajouté la route `rental`. De mémoire, nous n'avons rien fait de trop exotique en ajoutant cette route&nbsp;; nous avons simplement copié-collé une bonne partie de la logique de la route `index`.

```js { data-filename="app/routes/index.js" }
import Route from '@ember/routing/route';

const COMMUNITY_CATEGORIES = ['Copropriété', 'Maison de ville', 'Appartement'];

export default class IndexRoute extends Route {
  async model() {
    let response = await fetch('/api/rentals.json');
    let { data } = await response.json();

    return data.map((model) => {
      let { id, attributes } = model;
      let type;

      if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
        type = 'Dans une copropriété';
      } else {
        type = 'Propriété indépendante';
      }

      return { id, type, ...attributes };
    });
  }
}
```

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

<!-- spell ignore -->
Cette duplication a occasionné de la "dette technique", rendant notre code plus difficile à maintenir sur le long terme. Par exemple, si nous voulions changer la manière dont la récupération des données fonctionne, alors nous devrions éditer les deux routes `index` et `rental`. Si nous éditions un seul endroit mais oubliions l'autre, nous pourrions nous retrouver avec des bugs très subtils dans l'application&nbsp;! _Eeerk_&nbsp;_!_

De plus, à mesure que nous travaillons sur l'app, il y a des chances que nous devions ajouter plus de routes pour récupérer des données du serveur. Puisque tous nos points d'API suivent le format [JSON:API](https://jsonapi.org/), nous aurions à copier ce contenu par défaut dans chaque nouvelle route&nbsp;!

Heureusement, nous n'allons pas faire ça. Il se trouve qu'il existe une solution bien meilleure&nbsp;: utiliser EmberData&nbsp;! Comme son nom l'indique, [EmberData](../../../models/) est une librairie qui permet de gérer les données et "l'état de l'application" dans les applications Ember.

Il y a beaucoup à apprendre sur EmberData, commençons par couvrir les fonctionnalités qui répondent à notre problème immédiat.

## Les modèles EmberData

EmberData est construit sur l'idée d'organiser les données de votre app en [objets modèles (_models_)](../../../models/defining-models/). Chaque objet représente une unité d'information que l'app présente à l'utilisateur. Par exemple, la donnée `rental` sur laquelle nous avons travaillé serait une bonne candidate.

Mais assez parlé, essayons plutôt&nbsp;!

```js { data-filename="app/models/rental.js" }
import Model, { attr } from '@ember-data/model';

const COMMUNITY_CATEGORIES = ['Copropriété', 'Maison de ville', 'Appartement'];

export default class RentalModel extends Model {
  @attr title;
  @attr owner;
  @attr city;
  @attr location;
  @attr category;
  @attr image;
  @attr bedrooms;
  @attr description;

  get type() {
    if (COMMUNITY_CATEGORIES.includes(this.category)) {
      return 'Dans une copropriété';
    } else {
      return 'Propriété indépendante';
    }
  }
}
```

Ici, on a créé une classe `RentalModel` qui étend la superclasse `Model` de EmberData. Quand on récupère la liste des locations du serveur, chaque location est représentée par une instance, aussi appelée  _[record](../../../models/finding-records/)_ (enregistrement), de notre classe `RentalModel`.

Le décorateur (_decorator_) `@attr` permet de déclarer les attributs d'une location. Ces attributs correspondent directement aux données `attributes` que le serveur est censé fournir dans sa réponse&nbsp;:

```json { data-filename="public/api/rentals/grand-old-mansion.json" }
{
  "data": {
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
      "description": "Ce manoir ancien et spacieux se trouve sur un domaine de plus de 100 acres de collines et de forêts de séquoias denses."
    }
  }
}
```

On accède aux attributs d'une instance de `RentalModel` en utilisant une notation standard avec un point, comme `model.title` ou `model.location.lat`. En plus des attributs déclarés avec `@attr`, l'instance a toujours un attribut _id_ implicite, qui sert d'identifiant unique à l'objet modèle et auquel on peut accéder avec `model.id`.

La classe `Model` de EmberData n'est pas différente des autres classes avec lesquelles nous avons travaillé jusqu'ici, dans le sens où elle est l'endroit idéal pour définir des comportements personnalisés. Par exemple, on a déplacé dans la classe `RentalModel` notre logique de `type` (qui était une source de duplication majeure et non nécessaire dans nos gestionnaires de route) à l'intérieur d'un _getter_ (accesseur). Une fois que tout fonctionnera ici, nous irons faire un peu de ménage.

Les attributs déclarés avec le décorateur `@attr` fonctionnent avec l'_auto-track_ mentionné [dans un chapitre précédent](../../part-1/reusable-components/). Ainsi, on peut référencer librement les attributs d'un modèle dans un _getter_ (`this.category`), et Ember saura quand invalider le résultat.

## Tester les modèles

Jusque-là, nous n'avions pas d'endroit idéal pour écrire les tests de la logique `type` des locations. Maintenant que nous lui avons trouvé un foyer dans la classe modèle, il est également plus facile de tester son comportement. Nous allons ajouter un fichier de test à l'aide du générateur `model-test`&nbsp;:

```shell
$ ember generate model-test rental
installing model-test
  create tests/unit/models/rental-test.js
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p>On aurait aussi pu utiliser la commande <code>ember generate model rental</code> en premier lieu, celle-ci aurait créé à la fois le modèle et son fichier de test.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Le générateur a créé du code par défaut pour nous, c'est un très bon point de départ pour écrire nos tests&nbsp;:

```js { data-filename="tests/unit/models/rental-test.js" data-diff="-7,-8,+9,-11,-12,+13,+14,+15,+16,+17,+18,+19,+20,+21,+22,+23,+24,+25,+26,+27,+28,+29,+30,+31,+32,+33,+34,+35,+36,+37,+38,+39,+40,+41,+42" }
import { module, test } from 'qunit';
import { setupTest } from 'super-rentals/tests/helpers';

module('Unit | Model | rental', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
  test('it has the right type', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('rental', {});
    assert.ok(model);
    let rental = store.createRecord('rental', {
      id: 'grand-old-mansion',
      title: 'Le Manoir Ancien',
      owner: 'Veruca Salt',
      city: 'San Francisco',
      location: {
        lat: 37.7749,
        lng: -122.4194,
      },
      category: 'Domaine',
      bedrooms: 15,
      image:
        'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
      description:
        'Ce manoir ancien et spacieux se trouve sur un domaine de plus de 100 acres de collines et de forêts de séquoias denses.',
    });

    assert.strictEqual(rental.type, 'Propriété indépendante');

    rental.category = 'Copropriété';
    assert.strictEqual(rental.type, 'Dans une copropriété');

    rental.category = 'Maison de ville';
    assert.strictEqual(rental.type, 'Dans une copropriété');

    rental.category = 'Appartement';
    assert.strictEqual(rental.type, 'Dans une copropriété');

    rental.category = 'Domaine';
    assert.strictEqual(rental.type, 'Propriété indépendante');
  });
});
```

Ce test de modèle est un [test unitaire (_unit test_)](../../../testing/testing-models/). Contrairement aux tests que nous avons écrits jusqu'à maintenant, celui-ci "n'affiche" rien. Il ne fait qu'instancier le modèle `rental` et le tester directement, en manipulant ses attributs et en faisant des assertions sur leur valeur.

Il est important de noter qu'EmberData fournit un [service `store`](../../../services/) (magasin, réserve), aussi connu sous le nom de _EmberData store_. Dans notre test, l'API `this.owner.lookup('service:store')` accède au _store_ d'EmberData. Le _store_ fournit une méthode `createRecord` (créer un enregistrement) qui instancie un modèle pour nous.

Exécuter les tests dans le navigateur confirme que tout fonctionne comme prévu&nbsp;:

<img src="/images/tutorial/part-2/ember-data/pass-1@2x.png" alt="Tous les tests passent !" width="1024" height="1024">

## Charger un modèle dans une route

Très bien, maintenant que notre modèle est prêt, il est temps de refactorer nos gestionnaires de route pour utiliser EmberData et supprimer le code dupliqué&nbsp;!

```js { data-filename="app/routes/index.js" data-diff="-2,-3,+4,-7,-8,-9,-10,-11,-12,-13,+14,-16,-17,-18,-19,-20,-21,-22,-23,+24,+25" }
import Route from '@ember/routing/route';

const COMMUNITY_CATEGORIES = ['Copropriété', 'Maison de ville', 'Appartement'];
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  async model() {
    let response = await fetch('/api/rentals.json');
    let { data } = await response.json();

    return data.map((model) => {
      let { id, attributes } = model;
      let type;
  @service store;

      if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
        type = 'Dans une copropriété';
      } else {
        type = 'Propriété indépendante';
      }

      return { id, type, ...attributes };
    });
  async model() {
    return this.store.findAll('rental');
  }
}
```

```js { data-filename="app/routes/rental.js" data-diff="-2,-3,+4,-7,-8,-9,-10,-11,-12,+13,-15,-16,-17,-18,-19,-20,-21,+22,+23" }
import Route from '@ember/routing/route';

const COMMUNITY_CATEGORIES = ['Copropriété', 'Maison de ville', 'Appartement'];
import { service } from '@ember/service';

export default class RentalRoute extends Route {
  async model(params) {
    let response = await fetch(`/api/rentals/${params.rental_id}.json`);
    let { data } = await response.json();

    let { id, attributes } = data;
    let type;
  @service store;

    if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
      type = 'Dans une copropriété';
    } else {
      type = 'Propriété indépendante';
    }

    return { id, type, ...attributes };
  async model(params) {
    return this.store.findRecord('rental', params.rental_id);
  }
}
```

Eh bien... voilà qui supprime beaucoup de code&nbsp;! Et c'est rendu possible grâce au pouvoir des conventions&nbsp;!

## Le _store_ d'EmberData

Comme dit précédemment, EmberData fournit un service _store_ qui peut être injecté dans une route avec la déclaration `@service store;`, rendant ainsi le _store_ disponible en tant que `this.store`. Ce service possède les méthodes `find` et `findAll` pour charger les _records_. La méthode [`findRecord`](../../../models/finding-records/#toc_retrieving-a-single-record) prend un type de modèle (dans le cas présent, `rental`) et un ID de modèle (ici, le `params.rental_id` de l'URL) en paramètres et récupère un unique _record_ depuis le _store_, tandis que [`findAll`](../../../models/finding-records/#toc_retrieving-multiple-records) prend seulement le type de modèle en paramètre et récupère tous les _records_ de ce type.

Le _store_ d'EmberData agit comme un intermédiaire entre notre app et le serveur&nbsp;: il fait beaucoup de choses importantes, comme mettre en cache les réponses renvoyées par le serveur. Si nous requêtons un certain _record_ (instance d'une classe modèle) que nous avions déjà récupéré du serveur plus tôt, le _store_ d'EmberData fait en sorte que nous puissions accéder à ce _record_ immédiatement, sans avoir à les demander une nouvelle fois au serveur et attendre la réponse. En revanche, si la réponse pour ce _record_ n'est pas déjà mise en cache dans le _store_, il est bien requêté au serveur. Pratique, n'est-ce pas&nbsp;?

Voilà qui fait beaucoup de théorie, mais est-ce que ça va fonctionner dans notre app&nbsp;? Exécutons les tests pour le découvrir&nbsp;!

<img src="/images/tutorial/part-2/ember-data/fail-1@2x.png" alt="Quelques tests échouent !" width="1024" height="960">

<!-- spell ignore -->
Nooon, quelques tests échouent&nbsp;! Cela dit, c'est chouette d'être ainsi informé des problèmes potentiels (Vive les tests de non-régression &nbsp;!)

Si on regarde le message d'erreur, il apparaît que le _store_ ne visite pas la bonne URL quand on récupère les données du serveur, conduisant à des erreurs 404. Plus précisément&nbsp;:

- Quand la requête `findAll('rental')` s'exécute, elle cherche à récupérer les données de `/rentals`, au lieu de `/api/rentals.json`.
- Quand la requête `find('rental', 'grand-old-mansion')` s'exécute, elle cherche à récupérer les données de `/rentals/grand-old-mansion`, au lieu de `/api/rentals/grand-old-mansion.json`.

Ok, très bien, donc il nous faut indiquer à EmberData de requêter les données à la bonne adresse. Mais d'abord, comment EmberData sait-il comment récupérer les données de notre serveur&nbsp;?

## Travailler avec des adaptateurs et des sérialiseurs

EmberData utilise une architecture [adaptateur (_adapter_)](../../../models/customizing-adapters/) et [sérialiseur (_serializer_)](../../../models/customizing-serializers/). L'adaptateur s'occupe de "comment" et "où" EmberData doit récupérer les données du serveur, par exemple faut-il utiliser HTTP, HTTPS, des _WebSockets_ ou le _local storage_&nbsp;? Quelles sont les URLs, les en-têtes et les paramètres pour ces requêtes&nbsp;? Le sérialiseur, lui, est chargé de convertir les données retournées par le serveur en un format qu'EmberData comprend.

L'idée est la suivante&nbsp;: en supposant que votre _backend_ expose un protocole cohérent et un format d'échange pour accéder à ses données, on peut alors écrire une seule paire d'adaptateur-sérialiseur pour traiter toutes les récupérations de données pour l'application entière.

Il se trouve que le format JSON:API est le protocole de données et format d'échange par défaut de EmberData. Autrement dit, EmberData fournit clé en main un adaptateur et un sérialiseur JSON:API. C'est une très bonne nouvelle pour nous, puisque c'est aussi ce que notre serveur implémente. Quelle heureuse coïncidence&nbsp;!

Cependant, comme mentionné ci-dessus, il y a quelques différences mineures entre le fonctionnement de notre serveur et les présomptions d'EmberData. Nous pouvons personnaliser le comportement par défaut en définissant notre propre adaptateur et sérialiseur&nbsp;:

```js { data-filename="app/adapters/application.js" }
import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace = 'api';

  buildURL(...args) {
    return `${super.buildURL(...args)}.json`;
  }
}
```

```js { data-filename="app/serializers/application.js" }
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {}
```

Par convention, les adaptateurs se trouvent dans `app/adapters`. De plus, l'adaptateur nommé `application` est appelé "adaptateur de l'application" (_application adapter_), et récupérera les données de tous les modèles de l'app.

Dans ce fichier nouvellement créé, nous définissons une classe `ApplicationAdapter`, qui hérite du [`JSONAPIAdapter`](https://api.emberjs.com/ember-data/release/classes/JSONAPIAdapter) intégré. Ça nous permet d'hériter de toutes les fonctionnalités par défaut de JSON:API, tout en personnalisant ce qui ne fonctionne pas pour nous par défaut. Plus spécifiquement&nbsp;:

- Les URLs de nos ressources sont préfixées d'un _namespace_ (espace de nom) `/api`.
- Les URLs de nos ressources ont une extension `.json`.

Comme préfixer une URL avec un _namespace_ est très commun dans les apps Ember, le `JSONAPIAdapter` a une API pour le faire. Il suffit d'assigner le préfixe souhaité à la propriété `namespace`, qui, dans notre cas, est `api`.

Ajouter une extension `.json` est un peu moins répandu, il n'y a pas d'API de configuration déclarative propre pour le faire. Alors, nous avons besoin de surcharger la méthode [`buildURL`](https://api.emberjs.com/ember-data/release/classes/JSONAPIAdapter/methods/buildURL?anchor=buildURL) de EmberData. Dans `buildURL` nous appelons `super.buildURL(...args)` pour invoquer son implémentation par défaut, celle de `JSONAPIAdapter`. Ça nous renvoie l'URL que l'adaptateur "aurait construite", quelque chose comme `/api/rentals` et `/api/rentals/grand-old-mansion`, étant donné la configuration du `namespace` au-dessus. Tout ce que nous avons à faire, c'est ajouter `.json` à cette URL puis la retourner.

De la même manière, les sérialiseurs se situent dans `app/serializers`. L'adaptateur et le sérialiseur sont toujours ajoutés par paire. Nous avons ajouté un adaptateur `application`, donc nous avons aussi ajouté le sérialiseur correspondant. Puisque les données JSON retournées par notre serveur sont conformes à JSON:API, le sérialiseur par défaut [`JSONAPISerializer`](https://api.emberjs.com/ember-data/release/classes/JSONAPISerializer) fonctionne très bien pour nous, pas besoin de le personnaliser.

Avec notre adaptateur et notre sérialiseur en place, nos tests devraient passer à nouveau.

<img src="/images/tutorial/part-2/ember-data/pass-2@2x.png" alt="Une fois de plus, tous nos tests passent !" width="1024" height="1024">

L'interface utilisateur aussi fonctionne exactement comme avant, seulement avec moins de code&nbsp;!

<img src="/images/tutorial/part-2/ember-data/homepage@2x.png" alt="La page d'accueil fonctionne exactement comme avant, mais avec bien moins de code !" width="1024" height="1129">

<img src="/images/tutorial/part-2/ember-data/detailed@2x.png" alt="La page de détail fonctionne exactement comme avant, mais avec bien moins de code !" width="1024" height="1381">

EmberData offre de très, très nombreuses fonctionnalités (comme gérer les _relationships_ entre différents modèles) et il y a bien davantage à apprendre à son sujet. Par exemple, s'il y a des incohérences entre les différents points d'entrées de votre _backend_, EmberData vous permet de définir des adaptateurs et des sérialiseurs par modèle, plus spécifiques&nbsp;! Si vous voulez en savoir plus sur EmberData, jeter un œil à [sa section dédiée](../../../models/) dans le Guide&nbsp;!
