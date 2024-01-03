EmberData inclut plusieurs types d'associations pour vous aider à définir comment vos modèles sont liés les uns aux autres.

### One-to-One

Pour déclarer une association _one-to-one_ entre deux modèles, utilisez `belongsTo`&nbsp;:

```javascript {data-filename=app/models/user.js}
import Model, { belongsTo } from '@ember-data/model';

export default class UserModel extends Model {
  @belongsTo('profile') profile;
}
```

```javascript {data-filename=app/models/profile.js}
import Model, { belongsTo } from '@ember-data/model';

export default class ProfileModel extends Model {
  @belongsTo('user') user;
}
```

### One-to-Many

Pour déclarer une association _one-to-many_ entre deux modèles, utilisez `belongsTo` ainsi que `hasMany`, comme ça&nbsp;:

```javascript {data-filename=app/models/blog-post.js}
import Model, { hasMany } from '@ember-data/model';

export default class BlogPostModel extends Model {
  @hasMany('comment') comments;
}
```

```javascript {data-filename=app/models/comment.js}
import Model, { belongsTo } from '@ember-data/model';

export default class CommentModel extends Model {
  @belongsTo('blog-post') blogPost;
}
```

### Many-to-Many

Pour déclarer une association _many-to-many_ entre deux modèles, utilisez `hasMany`&nbsp;:

```javascript {data-filename=app/models/blog-post.js}
import Model, { hasMany } from '@ember-data/model';

export default class BlogPostModel extends Model {
  @hasMany('tag') tags;
}
```

```javascript {data-filename=app/models/tag.js}
import Model, { hasMany } from '@ember-data/model';

export default class TagModel extends Model {
  @hasMany('blog-post') blogPosts;
}
```

### Inverses explicites

EmberData fera de son mieux pour découvrir quelles associations sont liées les unes aux autres.
Par exemple, dans le code _one-to-many_ ci-dessus, EmberData comprend que
modifier la relation `comments` doit aussi mettre à jour l'association `blogPost` à l'inverse,
car `blogPost` est la seule association de ce modèle.

Cependant, parfois vous pouvez avoir plusieurs `belongsTo`/`hasMany` pour
le même type. Vous pouvez spécifier quelle propriété du modèle lié est l'inverse
en utilisant l'option `inverse` sur `belongsTo` ou `hasMany`. Les associations sans inverse
peuvent être indiquées en utilisant `{ inverse: null }`.

```javascript {data-filename=app/models/comment.js}
import Model, { belongsTo } from '@ember-data/model';

export default class CommentModel extends Model {
  @belongsTo('blog-post', { inverse: null }) onePost;
  @belongsTo('blog-post') twoPost;
  @belongsTo('blog-post') redPost;
  @belongsTo('blog-post') bluePost;
}
```

```javascript {data-filename=app/models/blog-post.js}
import Model, { hasMany } from '@ember-data/model';

export default class BlogPostModel extends Model {
  @hasMany('comment', {
    inverse: 'redPost',
  })
  comments;
}
```

### Associations réflexives

Quand vous voulez définir une association réflexive (un modèle qui a une association
avec lui-même), vous devez explicitement définir l'inverse de l'association. S'il
n'y a pas d'association inverse alors vous pouvez mettre l'inverse à `null`.

Voici un exemple d'association réflexive _one-to-many_&nbsp;:

```javascript {data-filename=app/models/folder.js}
import Model, { belongsTo, hasMany } from '@ember-data/model';

export default class FolderModel extends Model {
  @hasMany('folder', { inverse: 'parent' }) children;
  @belongsTo('folder', { inverse: 'children' }) parent;
}
```

Voici un exemple d'association réflexive _one-to-one_&nbsp;:

```javascript {data-filename=app/models/user.js}
import Model, { attr, belongsTo } from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') name;
  @belongsTo('user', { inverse: 'bestFriend' }) bestFriend;
}
```

Vous pouvez aussi définir une association réflexive qui n'a pas d'inverse&nbsp;:

```javascript {data-filename=app/models/folder.js}
import Model, { belongsTo } from '@ember-data/model';

export default class FolderModel extends Model {
  @belongsTo('folder', { inverse: null }) parent;
}
```

### Polymorphisme

Le polymorphisme est un concept puissant qui permet aux développeurs
d'abstraire des fonctionnalités communes dans une classe de base.
Considérons l'exemple suivant&nbsp;: un utilisateur avec plusieurs
méthodes de paiement. Ils pourraient avoir un compte Paypal lié, et plusieurs
cartes de crédit.

Notez que pour que le polymorphisme fonctionne, EmberData s'attend
à ce qu'un type polymorphe soit déclaré par un "type" de déclaration
polymorphe via la propriété réservée `type` sur le modèle.
Confus&nbsp;? Voir la réponse de l'API ci-dessous.

En premier, regardons la définition du modèle&nbsp;:

```javascript {data-filename=app/models/user.js}
import Model, { hasMany } from '@ember-data/model';

export default class UserModel extends Model {
  @hasMany('payment-method', { polymorphic: true }) paymentMethods;
}
```

```javascript {data-filename=app/models/payment-method.js}
import Model, { belongsTo } from '@ember-data/model';

export default class PaymentMethodModel extends Model {
  @belongsTo('user', { inverse: 'paymentMethods' }) user;
}
```

```javascript {data-filename=app/models/payment-method-cc.js}
import { attr } from '@ember-data/model';
import PaymentMethod from './payment-method';

export default class PaymentMethodCcModel extends PaymentMethod {
  @attr last4;

  get obfuscatedIdentifier() {
    return `**** **** **** ${this.last4}`;
  }
}
```

```javascript {data-filename=app/models/payment-method-paypal.js}
import { attr } from '@ember-data/model';
import PaymentMethod from './payment-method';

export default class PaymentMethodPaypalModel extends PaymentMethod {
  @attr linkedEmail;

  get obfuscatedIdentifier() {
    let last5 = this.linkedEmail
      .split('')
      .reverse()
      .slice(0, 5)
      .reverse()
      .join('');

    return `••••${last5}`;
  }
}
```

Notre API peut configurer ces associations de la manière suivante&nbsp;:

```json
{
  "data": {
    "id": "8675309",
    "type": "user",
    "attributes": {
      "name": "Anfanie Farmeo"
    },
    "relationships": {
      "payment-methods": {
        "data": [
          {
            "id": "1",
            "type": "payment-method-paypal"
          },
          {
            "id": "2",
            "type": "payment-method-cc"
          },
          {
            "id": "3",
            "type": "payment-method-apple-pay"
          }
        ]
      }
    }
  },
  "included": [
    {
      "id": "1",
      "type": "payment-method-paypal",
      "attributes": {
        "linked-email": "ryan@gosling.io"
      }
    },
    {
      "id": "2",
      "type": "payment-method-cc",
      "attributes": {
        "last4": "1335"
      }
    },
    {
      "id": "3",
      "type": "payment-method-apple-pay",
      "attributes": {
        "last4": "5513"
      }
    }
  ]
}
```

### Données imbriquées en lecture seule

Certains modèles peuvent avoir des propriétés qui sont des objets de données profondément
imbriqués en lecture seule. La solution naïve serait de définir
un modèle pour chaque objet imbriqué et utiliser `hasMany` et `belongsTo` pour
créer l'association imbriquée. Cependant, puisque les données en lecture seule n'auront
jamais besoin d'être mises à jour et sauvegardées cela aboutit souvent à la création
d'une grande quantité de code pour très peu d'avantages. Une approche alternative est de
définir cette association en utilisant un attribut sans transformation (`@attr`). Cela
simplifie l'accès aux valeurs en lecture seule des autres objets et templates sans
devoir définir de modèles superflus.

### Création de _Records_ (enregistrements)

Supposons que nous ayons un modèle `blog-post` et un autre modèle `comment`. Un article de blog peut avoir plusieurs commentaires qui lui sont liés. La bonne association est montrée ci-dessous&nbsp;:

```javascript {data-filename=app/models/blog-post.js}
import Model, { hasMany } from '@ember-data/model';

export default class BlogPostModel extends Model {
  @hasMany('comment') comments;
}
```

```javascript {data-filename=app/models/comment.js}
import Model, { belongsTo } from '@ember-data/model';

export default class CommentModel extends Model {
  @belongsTo('blog-post') blogPost;
}
```

Maintenant, supposons que nous voulons ajouter des commentaires sur un article existant. Nous pouvons le faire de deux manières différentes, en premier nous avons besoin de chercher un article de blog qui est déjà chargé dans le _store_ en utilisant son identifiant&nbsp;:

```javascript
let myBlogPost = this.store.peekRecord('blog-post', 1);
```

Maintenant nous pouvons soit mettre à jour l'association `belongsTo` dans notre nouveau commentaire, soit mettre à jour l'association `hasMany` de l'article de blog. Comme vous pouvez le constater, nous n'avons pas besoin de mettre à jour à la fois `hasMany` et `belongsTo`, EmberData le fera pour nous.

En premier, regardons comment définir l'association `belongsTo` dans notre nouveau commentaire&nbsp;;

```javascript
let comment = this.store.createRecord('comment', {
  blogPost: myBlogPost,
});
comment.save();
```

Dans l'extrait ci-dessus, nous référençons `myBlogPost` pendant que nous créons le _record_. Cela permettra à Ember de savoir que le commentaire nouvellement créé appartient à `myBlogPost`.
Cela créera un nouveau _record_ `comment` et le sauvegardera sur le serveur. EmberData mettra aussi à jour `myBlogPost` en incluant notre commentaire nouvellement créé dans l'association `comments`.

La seconde manière de faire la même chose est de lier les deux _records_ ensemble en mettant à jour l'association `hasMany` de blogPost, comme montré ci-dessous&nbsp;:

```javascript
let comment = this.store.createRecord('comment', {});
let comments = await myBlogPost.comments;
comments.push(comment);
comment.save().then(function () {
  myBlogPost.save();
});
```

Dans le cas ci-dessus, la nouvelle association `belongsTo` du commentaire sera automatiquement définie à l'article de blog parent.

Bien que `createRecord` soit assez simple, la seule chose à laquelle il faut faire attention est que vous ne pouvez actuellement pas assigner une promesse comme association.

Par exemple, si vous voulez définir une propriété `author` d'un article de blog, ça **ne fonctionnerait pas** si l'utilisateur avec l'ID `1` n'est pas déjà chargé dans le _store_&nbsp;:

```javascript
this.store.createRecord('blog-post', {
  title: 'Rails is Omakase',
  body: 'Lorem ipsum',
  author: this.store.findRecord('user', 1),
});
```

Cependant, vous pouvez facilement définir l'association une fois que la promesse est résolue&nbsp;:

```javascript
let blogPost = this.store.createRecord('blog-post', {
  title: 'Rails is Omakase',
  body: 'Lorem ipsum',
});

this.store.findRecord('user', 1).then(function (user) {
  blogPost.author = user;
});
```

### Récupérer les _records_ liés

Quand vous récupérez des données depuis le serveur pour un modèle qui a une association avec
un ou plusieurs autres modèles, vous voudrez peut-être récupérer les _records_ liés à ces modèles
en même temps. Par exemple, lors de la récupération d'un article de blog, vous voulez aussi
peut-être accéder aux commentaires associés à l'article. La spécification [JSON:API](https://jsonapi.org/format/#fetching-includes)
permet aux serveurs d'accepter un paramètre de requête, via la clé `include`, en tant que
requête afin d'inclure ces _records_ liés dans la réponse retournée aux clients.
La valeur du paramètre doit être une liste de noms d'associations, séparés par des virgules.

Si vous utilisez un adaptateur qui supporte JSON:API, comme celui par défaut d'Ember [`JSONAPIAdapter`](https://api.emberjs.com/ember-data/release/classes/JSONAPIAdapter), vous pouvez facilement ajouter le paramètre `include` aux requêtes serveur créées par les méthodes `findRecord()`, `findAll()`,
`query()` et `queryRecord()`.

Chacune des méthodes `findRecord()` et `findAll()` accepte un argument `options` dans
lequel vous pouvez spécifier le paramètre `include`.
Par exemple, prenons un modèle `post` (article) qui a une association `hasMany` avec le modèle `comment` (commentaire),
lors de la récupération d'un article spécifique, nous pouvons demander au serveur de renvoyer
également les commentaires de cet article. Comme ça&nbsp;:

```javascript {data-filename=app/routes/post.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PostRoute extends Route {
  @service store;
  model(params) {
    return this.store.findRecord('post', params.post_id, {
      include: 'comments',
    });
  }
}
```

Les commentaires de l'article seraient alors disponibles dans votre template via `model.comments`.

Les associations imbriquées peuvent être spécifiées dans le paramètre `include`, sous la forme
d'une liste de noms d'associations, séparés par des points.
Ainsi, pour récupérer à la fois les commentaires de l'article et les auteurs de ces
commentaires, la requête ressemblerait à ça&nbsp;:

```javascript {data-filename=app/routes/post.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PostRoute extends Route {
  @service store;
  model(params) {
    return this.store.findRecord('post', params.post_id, {
      include: 'comments,comments.author',
    });
  }
}
```

Chacune des méthodes `query()` et `queryRecord()` accepte un argument `query` qui est directement
sérialisé dans les paramètres de l'URL et le paramètre `include` peut faire partie de cet argument.
Par exemple&nbsp;:

```javascript {data-filename=app/routes/adele.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdeleRoute extends Route {
  @service store;
  model() {
    // GET to /artists?filter[name]=Adele&include=albums
    return this.store
      .query('artist', {
        filter: { name: 'Adele' },
        include: 'albums',
      })
      .then(function (artists) {
        return artists[0];
      });
  }
}
```

### Mettre à jour des _records_ existants

Parfois nous voulons définir des associations sur des _records_ déjà existants. Nous pouvons simplement définir une association `belongsTo`&nbsp;:

```javascript
let blogPost = this.store.peekRecord('blog-post', 1);
let comment = this.store.peekRecord('comment', 1);
comment.blogPost = blogPost;
comment.save();
```

Ou bien, nous pourrions mettre à jour l'association `hasMany` en définissant un _record_ dans l'association&nbsp;:

```javascript
let blogPost = this.store.peekRecord('blog-post', 1);
let comment = this.store.peekRecord('comment', 1);
let comments = await blogPost.comments;
comments.push(comment);
blogPost.save();
```

### Supprimer des associations

Pour supprimer une association `belongsTo`, nous pouvons la définir à `null`, ce qui la supprimera aussi du côté de `hasMany`&nbsp;:

```javascript
let comment = this.store.peekRecord('comment', 1);
comment.blogPost = null;
comment.save();
```

Il est également possible de supprimer un _record_ d'une association `hasMany`&nbsp;:

```javascript
let blogPost = this.store.peekRecord('blog-post', 1);
let comment = this.store.peekRecord('comment', 1);
let comments = await blogPost.comments;
comments.removeObject(comment);
blogPost.save();
```

Comme dans les exemples précédents, l'association `belongsTo` du commentaire sera également effacée par EmberData.

### Les associations en tant que promesses

Lorsque nous travaillons avec des associations, il est important de se souvenir qu'elles retournent des promesses.

Par exemple, si nous devions travailler sur les commentaires asynchrones d'un article de blog, nous devrions attendre que la promesse soit résolue&nbsp;:

```javascript
let blogPost = this.store.peekRecord('blog-post', 1);

let comments = await blogPost.comments;
// now we can work with the comments
```

La même chose s'applique aux associations `belongsTo` :

```javascript
let comment = this.store.peekRecord('comment', 1);

let blogPost = await comment.blogPost;
// the blogPost is available here
```

Les templates Handlebars seront automatiquement mis à jour pour refléter une promesse résolue. Nous pouvons afficher une liste de commentaires dans un article de blog comme ça&nbsp;:

```handlebars
<ul>
  {{#each this.blogPost.comments as |comment|}}
    <li>{{comment.id}}</li>
  {{/each}}
</ul>
```

EmberData interrogera le serveur pour obtenir les _records_ appropriés et régénérera le template une fois les données reçues.
