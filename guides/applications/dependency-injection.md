Les applications Ember utilisent le modèle de conception d'injection de dépendance ("DI" pour [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection)) pour déclarer et instancier des classes d'objets et des dépendances entre elles.

Généralement, les [services](../../services/) sont la principale méthode d'Ember pour partager l'état via l'injection de dépendances. Dans la plupart des cas, vous ne devriez pas avoir besoin d'apprendre comment travailler directement avec le système DI d'Ember, ni comment enregistrer et configurer manuellement des dépendances. Cependant, cela peut occasionnellement être nécessaire. Ce guide couvre les détails du système et explique comment l'utiliser en cas de besoin.

## Tour d'horizon

Les applications et les instances d'application jouent chacune un rôle dans la mise en œuvre de la DI d'Ember.

Une [`Application`](https://api.emberjs.com/ember/release/classes/Application) sert de _registry_ (registre) pour les déclarations de dépendances. Les _factories_ (usines / fabriques), c'est-à-dire les classes, sont enregistrées avec l'application, tout comme les règles qui régissent l'injection de dépendances, et qui sont appliquées quand les objets sont instanciés.

Une _[`ApplicationInstance`](https://api.emberjs.com/ember/release/classes/ApplicationInstance)_ (instance d'application) sert de _owner_ (propriétaire) pour les objets instanciés à partir des _factories_ enregistrées. Les instances d'application fournissent un moyen de "rechercher" (c'est-à-dire d'instancier et/ou de récupérer) des objets.

> _Note: Bien qu'une `Application` serve de registre principal pour une app, chaque `ApplicationInstance` peut également servir de registre. Les enregistrements au niveau de l'instance sont utiles pour fournir des personnalisations au niveau de l'instance, telles que les tests A/B d'une fonctionnalité._

## Enregistrement des _factories_

Une _factory_ (fabrique) peut représenter n'importe quelle partie de votre application, comme une route , un modèle ou un _template_. Chaque _factory_ est enregistrée avec une clé particulière. Par exemple, le _template_ d'index est enregistré avec la clé `template:index`, et la route de l'application est enregistrée avec la clé `route:application`.

Les clés d'enregistrement sont formées de deux segments séparés par deux points (`:`). Le premier segment est le type de `factory` du framework, et le second est le nom de la _factory_ en question. Ainsi, le template d'index a pour clé `template:index`. Ember a plusieurs types de _factories_ intégrées, tels que `service`, `route`, `template` et `component`.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p>
          Vous vous demandez peut-être comment retrouver le nom d'une <em>factory</em>&nbsp;?
        </p>
        <p>
          Les <em>factorie</em> ont des noms `kebab-cased` et les dossiers son suffixés d'un <em>slash</em>. Par exemple, un contrôleur <code>app/controllers/users/primary-teachers</code> est enregistré sous le nom <code>controller:users/primary-teachers</code>.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Vous pouvez créer votre propre type de _factory_ en l'enregistrant simplement avec le nouveau type. Par exemple, pour créer un type `user` (utilisateur), vous devez enregistrer votre _factory_ avec `application.register('user:user-to-register')`.

Les enregistrements de _factory_ doivent être effectués dans les initialiseurs d'application (_initializers_) ou d'instance d'application (_instance initializers_), le premier étant beaucoup plus courant.

Par exemple, un initialiseur d'application pourrait enregistrer une _factory_ `Logger` (enregistreur de messages) avec la clé `logger:main`:

```javascript {data-filename=app/initializers/logger.js}
import EmberObject from '@ember/object';

export function initialize(application) {
  let Logger = EmberObject.extend({
    log(m) {
      console.log(m);
    }
  });

  application.register('logger:main', Logger);
}

export default {
  name: 'logger',
  initialize: initialize
};
```

### Enregistrer des objets déjà instanciés

Par défaut, Ember tentera d'instancier une _factory_ enregistrée lorsqu'elle est recherchée (_lookup_). Lors de l'enregistrement d'un objet déjà instancié au lieu d'une classe, utilisez l'option `instantiate: false` pour éviter les tentatives de ré-instanciation lors des recherches.

Dans l'exemple suivant, le `logger` est un objet JavaScript simple qui doit être renvoyé "tel quel" lorsqu'il est recherché&nbsp;:

```javascript {data-filename=app/initializers/logger.js}
export function initialize(application) {
  let logger = {
    log(m) {
      console.log(m);
    }
  };

  application.register('logger:main', logger, { instantiate: false });
}

export default {
  name: 'logger',
  initialize: initialize
};
```

### Enregistrer des singletons _vs._ des non-singletons

Par défaut,les enregistrements sont traités comme des "singletons". Cela signifie simplement qu'une instance sera créée lors de la première recherche, puis que cette même instance sera alors mise en cache et retournée lors des recherches suivantes.

Quand vous souhaitez qu'un nouvel objet soit créé à chaque recherche, enregistrez vos _factories_ en tant que non-singletons à l'aide de l'option `singleton: false`.

Dans l'exemple suivant, la classe `Message` est enregistrée en tant que non-singleton&nbsp;:

```javascript {data-filename=app/initializers/notification.js}
import EmberObject from '@ember/object';

export function initialize(application) {
  let Message = EmberObject.extend({
    text: ''
  });

  application.register('notification:message', Message, { singleton: false });
}

export default {
  name: 'notification',
  initialize: initialize
};
```

## Injections de _factory_

Une fois qu'une _factory_ est enregistrée, elle peut être "injectée" là où elle est nécessaire.

Les _factories_ peuvent être injectées dans des "types" entiers de _factories_ avec des "injections de type". Par exemple:

```javascript {data-filename=app/initializers/logger.js}
import EmberObject from '@ember/object';

export function initialize(application) {
  let Logger = EmberObject.extend({
    log(m) {
      console.log(m);
    }
  });

  application.register('logger:main', Logger);
  application.inject('route', 'logger', 'logger:main');
}

export default {
  name: 'logger',
  initialize: initialize
};
```

Avec une telle injection de type, toutes les _factories_ de type `route` seront instanciées avec la propriété `logger` injectée. La valeur de `logger` viendra de la _factory_ nommée `logger:main`.

Dans cet exemple d'application, les routes peuvent maintenant accéder au `logger` injecté&nbsp;:

```javascript {data-filename=app/routes/index.js}
import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
  activate() {
    // La propiété logger est injectée dans toutes les routes
    this.logger.log('Entrée dans la route d\'index !');
  }
}
```

Les injections peuvent également être effectuées dans une _factory_ spécifique en utilisant sa clé complète&nbsp;:

```javascript
application.inject('route:index', 'logger', 'logger:main');
```

Dans ce cas, le `logger` sera injecté seulement dans la route d'index.

Les injections peuvent être réalisées dans n'importe quelle classe qui nécessite une instanciation. Cela inclut toutes les principales classes du framework Ember, telles que les composants, les _helpers_, les routes et le routeur.

### Injections ad hoc

Les injections de dépendances peuvent également être déclarées directement sur les classes Ember en utilisant `inject`. Actuellement, `inject` supporte l'injection de contrôleurs (via `import { inject } from '@ember/controller';`) et de services (via `import { service } from '@ember/service';`).

Le code suivant injecte le service `shopping-cart` dans le composant `cart-contents` en tant que propriété `cart`&nbsp;:

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class CartContentComponent extends Component {
  @service('shopping-cart') cart;
}
```

Si vous souhaitez injecter un service portant le même nom que la propriété, il suffit de ne pas indiquer le nom du service (la version du nom avec tiret `-` sera utilisée)&nbsp;:

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class CartContentComponent extends Component {
  @service shoppingCart;
}
```

## Rechercher une instance de _factory_ (_Lookups_)

Pour récupérer une instance de _factory_ de l'application en cours d'exécution, on appelle la méthode [`lookup`](https://api.emberjs.com/ember/release/classes/ApplicationInstance/methods/lookup?anchor=lookup) de l'instance d'application. Cette méthode prend un `string` pour identifier la _factory_ et retourne l'objet demandé&nbsp;:

```javascript
applicationInstance.lookup('factory-type:factory-name');
```

L'instance d'application est passée aux _instance initializers_ d'Ember et est ajoutée en tant que _owner_ de chaque objet instancié.

### Utiliser une instance d'application dans un _instance initializer_

Les _instance initializers_ reçoivent une instance d'application en argument, offrant ainsi l'opportunité de rechercher une instance de _factory_ enregistrée&nbsp;:

```javascript {data-filename=app/instance-initializers/logger.js}
export function initialize(applicationInstance) {
  let logger = applicationInstance.lookup('logger:main');

  logger.log('Hello from the instance initializer!');
}

export default {
  name: 'logger',
  initialize: initialize
};
```

### Obtenir une instance d'application depuis une instance de _factory_

[`Ember.getOwner`](https://api.emberjs.com/ember/release/classes/@ember%2Fapplication/methods/getOwner?anchor=getOwner) retourne l'instance d'application qui "détient" un objet. Ça signifie que les objets fournis par le frameworks comme les composants, les _helpers_ ou les routes peuvent appeler [`Ember.getOwner`](https://api.emberjs.com/ember/release/classes/@ember%2Fapplication/methods/getOwner?anchor=getOwner) pour effectuer une recherche de leur instance d'application pendant l'exécution.

Par exemple, ce composant joue des chansons avec différents services audio en fonction de l'`audioType` de la chanson&nbsp;:

```javascript {data-filename=app/components/play-audio.js}
import Component from '@glimmer/component';
import { getOwner } from '@ember/application';

// Usage:
//
// <PlayAudio @song=this.song />
//
export default class PlayAudioComponent extends Component {
  get audioService() {
    if (!this.args.song) {
      return null;
    }

    let applicationInstance = getOwner(this);
    let { audioType } = this.args.song;

    return applicationInstance.lookup(`service:audio-${audioType}`);
  }

  click() {
    let player = this.audioService;
    player.play(this.args.song.file);
  }
}
```

<!-- eof - needed for pages that end in a code block  -->
