Les initialiseurs (_initializers_) offrent la possibilité de configurer l'application lors de son démarrage.

Il y a deux types d'initialiseurs&nbsp;: les initialiseurs d'application (_initializers_) et les initialiseurs d'instance d'application (_instance initializers_).

Les initialiseurs d'application s'exécutent lors du démarrage de l'app et constituent le principal moyen de configurer les [injections de dépendance](../dependency-injection/). 

Les initialiseurs d'instance d'application s'exécutent lorsque l'app a fini de charger. Ils permettent de configurer l'état initial de l'app ainsi que les injections de dépendance locales à l'instance d'application (par exemple pour mettre en place des tests A/B).

Les opérations effectuées dans les initialiseurs doivent être aussi légères que possible pour minimiser le délai de chargement de votre app. Bien qu'il existe des techniques avancées pour obtenir des initialiseurs d'application asynchrones (`deferReadiness` et `advanceReadiness`), ces techniques sont généralement à éviter. Toutes les conditions de chargement asynchrone (par exemple l'autorisation de l'utilisateur) sont presque toujours mieux gérées dans les méthodes de route de votre app, qui permettent des interactions avec le DOM en attendant que les conditions soient résolues.

## Application Initializers

Application initializers can be created with Ember CLI's `initializer` generator:

```bash
ember generate initializer shopping-cart
```

Let's customize the `shopping-cart` initializer to inject a `cart` property into all the routes in your application:

```javascript {data-filename=app/initializers/shopping-cart.js}
export function initialize(application) {
  application.inject('route', 'cart', 'service:shopping-cart');
};

export default {
  initialize
};
```

## Application Instance Initializers

Application instance initializers can be created with Ember CLI's `instance-initializer` generator:

```bash
ember generate instance-initializer logger
```

Let's add some simple logging to indicate that the instance has booted:

```javascript {data-filename=app/instance-initializers/logger.js}
export function initialize(applicationInstance) {
  let logger = applicationInstance.lookup('logger:main');
  logger.log('Hello from the instance initializer!');
}

export default {
  initialize
};
```

## Specifying Initializer Order

If you'd like to control the order in which initializers run, you can use the `before` and/or `after` options:

```javascript {data-filename=app/initializers/config-reader.js}
export function initialize(application) {
  // ... your code ...
};

export default {
  before: 'websocket-init',
  initialize
};
```

```javascript {data-filename=app/initializers/websocket-init.js}
export function initialize(application) {
  // ... your code ...
};

export default {
  after: 'config-reader',
  initialize
};
```

```javascript {data-filename=app/initializers/asset-init.js}
export function initialize(application) {
  // ... your code ...
};

export default {
  after: ['config-reader', 'websocket-init'],
  initialize
};
```

Note that ordering only applies to initializers of the same type (i.e. application or application instance).
Application initializers will always run before application instance initializers.

## Customizing Initializer Names

By default initializer names are derived from their module name. This initializer will be given the name `logger`:

```javascript {data-filename=app/instance-initializers/logger.js}
export function initialize(applicationInstance) {
  let logger = applicationInstance.lookup('logger:main');
  logger.log('Hello from the instance initializer!');
}

export default { initialize };
```

If you want to change the name you can simply rename the file, but if needed you can also specify the name explicitly:

```javascript {data-filename=app/instance-initializers/logger.js}
export function initialize(applicationInstance) {
  let logger = applicationInstance.lookup('logger:main');
  logger.log('Hello from the instance initializer!');
}

export default {
  name: 'my-logger',
  initialize
};
```

This initializer will now have the name `my-logger`.
