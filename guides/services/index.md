Un [`Service`](https://api.emberjs.com/ember/release/classes/Service) est un objet Ember instancié pour toute la durée de vie de l'application, et qui rend accessible différentes parties de l'application.

Les services sont utiles aux fonctionnalités qui nécessitent des états partagés ou des connexions persistantes. Parmi les exemples d'utilisation des Services, on a&nbsp;:

* les sessions et l'authentification des utilisateurs
* la géolocalisation
* les _WebSockets_
* les notifications ou événements envoyés par le serveur (_server-sent events_)
* les appels API ne fonctionnant pas avec EmberData
* les APIs tierces
* le _log in_

### Définir des services

Les services peuvent être générés à l'aide du générateur de `service` d'Ember CLI. Par exemple, la commande suivante créera le service `ShoppingCart` (panier de courses)&nbsp;:

```bash
ember generate service shopping-cart
```

Les services doivent étendre la classe [`Service`](https://api.emberjs.com/ember/release/classes/Service)&nbsp;:

```javascript {data-filename=app/services/shopping-cart.js}
import Service from '@ember/service';

export default class ShoppingCartService extends Service {
}
```

Comme tous les objets Ember, un service est initialisé et peut posséder ses propres propriétés et méthodes. Ci-dessous, le service `ShoppingCart` gère un tableau d'éléments qui représente les éléments se trouvant actuellement dans le panier.

```javascript {data-filename=app/services/shopping-cart.js}
import { A } from '@ember/array';
import Service from '@ember/service';

export default class ShoppingCartService extends Service {
  items = A([]);

  add(item) {
    this.items.pushObject(item);
  }

  remove(item) {
    this.items.removeObject(item);
  }

  empty() {
    this.items.clear();
  }
}
```

### Accéder à des services

Pour accéder à un service, vous pouvez l'injecter dans n'importe quel objet résolu par le _container_ de l'application, comme un composant ou un autre service, en utilisant le décorateur `service` du module `@ember/service`.

Il y a deux façons d'utiliser ce décorateur. Soit vous l'invoquez sans argument, soit vous lui passez le nom enregistré pour le service. Quand aucun argument n'est passé, le service est chargé en fonction du nom de la propriété décorée.

Ainsi, vous pouvez charger le service `ShoppingCart` comme ci-dessous&nbsp;:

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class CartContentsComponent extends Component {
  // Will load the service defined in: app/services/shopping-cart.js
  @service shoppingCart;
}
```

Ce code injecte le service `ShoppingCart` dans le composant et le rend accessible en tant que propriété `shoppingCart`.

L'autre façon d'injecter le service est de fournir le nom du service en argument du décorateur&nbsp;:

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class CartContentsComponent extends Component {
  // Will load the service defined in: app/services/shopping-cart.js
  @service('shopping-cart') cart;
}
```

Ce code injecte le service `ShoppingCart` dans le composant et le rend accessible en tant que propriété `cart`.

Parfois, un service peut ou non exister, par exemple quand un <span lang="en">_initializer_</span> l'enregistre de manière conditionnelle. Comme une injection classique provoquera une erreur si le service n'existe pas, vous devez rechercher le service en utilisant la méthode [`getOwner`](https://api.emberjs.com/ember/release/classes/@ember%2Fapplication/methods/getOwner?anchor=getOwner) de Ember&nbsp;:

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { getOwner } from '@ember/application';

export default class CartContentsComponent extends Component {
  // Will load the service defined in: app/services/shopping-cart.js
  get cart() {
    return getOwner(this).lookup('service:shopping-cart');
  }
}
```

Les propriétés injectées sont chargée en différé (_lazy loading_). Ça signifie que le service ne sera pas instancié jusqu'à ce que la propriété soit appelée explicitement. Une fois chargé, le service persiste aussi longtemps que l'application existe.

Ci-dessous, l'action `remove` (retirer) est ajoutée au composant `cart-contents`&nbsp;:

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class CartContentsComponent extends Component {
  @service('shopping-cart') cart;

  @action
  remove(item) {
    this.cart.remove(item);
  }
}
```

Une fois injecté dans un composant, un service peut aussi être utilisé dans le template.

Ici, la propriété `cart` est utilisée pour afficher les éléments du panier&nbsp;:

```handlebars {data-filename=app/components/cart-contents.hbs}
<ul>
  {{#each this.cart.items as |item|}}
    <li>
      {{item.name}}
      <button type="button" {{on "click" (fn this.remove item)}}>Retirer</button>
    </li>
  {{/each}}
</ul>
```

<!-- eof - needed for pages that end in a code block  -->
