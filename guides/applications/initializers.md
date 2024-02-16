Les initialiseurs (_initializers_) offrent la possibilité de configurer l'application lors de son démarrage.

Il y a deux types d'initialiseurs&nbsp;: les initialiseurs d'application (_initializers_) et les initialiseurs d'instance d'application (_instance initializers_).

Les initialiseurs d'application s'exécutent lors du démarrage de l'app et constituent le principal moyen de configurer les [injections de dépendance](../dependency-injection/). 

Les initialiseurs d'instance d'application s'exécutent lorsque l'app a fini de charger. Ils permettent de configurer l'état initial de l'app ainsi que les injections de dépendance locales à l'instance d'application (par exemple pour mettre en place des tests A/B).

Les opérations effectuées dans les initialiseurs doivent être aussi légères que possible pour minimiser le délai de chargement de votre app. Bien qu'il existe des techniques avancées pour obtenir des initialiseurs d'application asynchrones (`deferReadiness` et `advanceReadiness`), ces techniques sont généralement à éviter. Toutes les conditions de chargement asynchrone (par exemple l'autorisation de l'utilisateur) sont presque toujours mieux gérées dans les méthodes de route de votre app, qui permettent des interactions avec le DOM en attendant que les conditions soient résolues.

## Initialiseurs d'application

Les initialiseurs d'application peuvent être créés avec le générateur `initializer` d'Ember CLI&nbsp;:

```bash
ember generate initializer shopping-cart
```

Personnalisons l'initialiseur `shopping-cart` (panier, chariot) pour injecter une propriété `cart` dans toutes les routes de l'application&nbsp;:

```javascript {data-filename=app/initializers/shopping-cart.js}
export function initialize(application) {
  application.inject('route', 'cart', 'service:shopping-cart');
};

export default {
  initialize
};
```

## Initialiseurs d'instance d'application

Les initialiseurs d'instance d'application peuvent être créés avec le générateur `instance-initializer` d'Ember CLI&nbsp;:

```bash
ember generate instance-initializer logger
```

Affichons un simple message pour indiquer que l'instance a démarré&nbsp;:

```javascript {data-filename=app/instance-initializers/logger.js}
export function initialize(applicationInstance) {
  let logger = applicationInstance.lookup('logger:main');
  logger.log('Bonjour de l\'initialiseur d\'instance !');
}

export default {
  initialize
};
```

## Spécifier l'ordre d'initialisation

Pour contrôler l'ordre dans lequel les initialiseurs s'exécutent, utilisez les options `before` et/ou `after`&nbsp;:

```javascript {data-filename=app/initializers/config-reader.js}
export function initialize(application) {
  // ... votre code ...
};

export default {
  before: 'websocket-init',
  initialize
};
```

```javascript {data-filename=app/initializers/websocket-init.js}
export function initialize(application) {
  // ... votre code ...
};

export default {
  after: 'config-reader',
  initialize
};
```

```javascript {data-filename=app/initializers/asset-init.js}
export function initialize(application) {
  // ... votre code ...
};

export default {
  after: ['config-reader', 'websocket-init'],
  initialize
};
```

Notez que cet ordre concerne uniquement les initialiseurs de même type (c'est-à-dire d'application ou d'instance d'application). Les initialiseurs d'application s'exécutent toujours avant les initialiseurs d'instance d'application.

## Personnaliser le nom des initialiseurs

Par défaut, le nom d'un initialiseur est dérivé du nom de son module. L'initialiseur suivant aura pour nom `logger`&nbsp;:

```javascript {data-filename=app/instance-initializers/logger.js}
export function initialize(applicationInstance) {
  let logger = applicationInstance.lookup('logger:main');
  logger.log('Bonjour de l\'initialiseur d\'instance !');
}

export default { initialize };
```

Pour changer le nom, vous pouvez simplement renommer le fichier, ou si besoin, spécifier un nom explicitement&nbsp;:

```javascript {data-filename=app/instance-initializers/logger.js}
export function initialize(applicationInstance) {
  let logger = applicationInstance.lookup('logger:main');
  logger.log('Bonjour de l\'initialiseur d\'instance !');
}

export default {
  name: 'my-logger',
  initialize
};
```

Cet initialiseur aura maintenant le nom `my-logger`.
