Le _store_ (magasin, réserve) d'EmberData fournit une interface pour récupérer les _records_ (enregistrements) d'un type donné.

### Récupération d'un seul _record_

Utilisez [`store.findRecord()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/findRecord?anchor=findRecord) pour récupérer un _record_ via son type et son ID.
Cela renverra une promesse qui sera résolue avec le _record_ demandé&nbsp;:

```javascript
// GET /blog-posts/1
this.store.findRecord('blog-post', 1)  // => GET /blog-posts/1
  .then(function(blogPost) {
      // Do something with `blogPost`
  });
```

Utilisez [`store.peekRecord()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/peekRecord?anchor=peekRecord) pour récupérer un _record_ via son type et son ID, sans déclencher de requête réseau.
Cela renverra le _record_ uniquement s'il est déjà présent dans le _store_&nbsp;:

```javascript
let blogPost = this.store.peekRecord('blog-post', 1); // => no network request
```

### Récupération de plusieurs _records_

Utilisez [`store.findAll()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/findAll?anchor=findAll) pour récupérer tous les _records_ d'un type donné&nbsp;:

```javascript
// GET /blog-posts
this.store.findAll('blog-post') // => GET /blog-posts
  .then(function(blogPosts) {
    // Do something with `blogPosts`
  });
```

Utilisez [`store.peekAll()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/peekAll?anchor=peekAll) pour récupérer tous les _records_ d'un type donné qui sont déjà chargés dans le _store_, sans déclencher de requête réseau&nbsp;:

```javascript
let blogPosts = this.store.peekAll('blog-post'); // => no network request
```

`store.findAll()` retourne une `PromiseArray` qui est résolue avec un `RecordArray` et `store.peekAll` retourne directement un `RecordArray`.

Il est important de noter que `RecordArray` n'est pas un tableau JavaScript, mais un objet qui implémente [`MutableArray`](https://api.emberjs.com/ember/release/classes/MutableArray).
C'est important car, par exemple, si vous voulez récupérer des _records_ via leur index,
la notation `[]` ne fonctionnera pas (vous devez utiliser `objectAt(index)` à la place).

### Requêter plusieurs _records_

EmberData offre la possibilité de rechercher des _records_ qui répondent à certains critères.
Appelez [`store.query()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/query?anchor=query) fera une requête `GET` avec l'objet qui lui est passé sérialisé en tant que paramètre de requête (_query params_).
Cette méthode retourne un `PromiseArray` de la même manière que `findAll`.

Par exemple, on peut rechercher tous les modèles `person` qui portent le nom de
`Peter`&nbsp;:

```javascript
// GET to /persons?filter[name]=Peter
this.store.query('person', {
  filter: {
    name: 'Peter'
  }
}).then(function(peters) {
  // Do something with `peters`
});
```

### Requêter un seul _record_

Si vous utilisez un adaptateur prenant en charge les requêtes capables de renvoyer un seul modèle,
EmberData fournit une méthode pratique, [`store.queryRecord()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/queryRecord?anchor=queryRecord), qui retourne une promesse résolue avec un unique _record_.
La requête est faite via la méthode `queryRecord()` définie par l'adapteur.

Par exemple, si l'API de votre serveur fournit un _endpoint_ pour l'utilisateur actuellement connecté&nbsp;:

```text
// GET /api/current_user
{
  user: {
    id: 1234,
    username: 'admin'
  }
}
```

Et si l'adapteur du modèle `User` définit une méthode `queryRecord()` qui cible le _endpoint_&nbsp;:

```javascript {data-filename=app/adapters/user.js}
import Adapter from '@ember-data/adapter';
import fetch from 'fetch';

export default class UserAdapter extends Adapter {
  queryRecord(store, type, query) {
    return fetch('/api/current_user');
  }
}
```

Puis, appeler [`store.queryRecord()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/queryRecord?anchor=queryRecord) récupérera cet objet depuis le serveur&nbsp;:

```javascript
store.queryRecord('user', {}).then(function(user) {
  let username = user.get('username');
  console.log(`Currently logged in as ${username}`);
});
```

Tout comme `store.query()`, un objet peut également être transmis à `store.queryRecord()` qui peut alors être utilisé par la méthode `queryRecord()` de l'Adapteur afin de qualifier la requête.
Cependant, l'adapteur doit renvoyer un seul modèle et non un tableau contenant un élément,
sinon EmberData lèvera une exception.

Notez que [l'adapteur JSON:API](https://api.emberjs.com/ember-data/release/classes/JSONAPIAdapter) par défaut d'Ember ne fournit pas la fonctionnalité nécessaire pour prendre en charge directement `queryRecord()` car il se repose sur des requêtes REST qui retournent les données sous la forme d'un tableau.

Si l'API de votre serveur ou votre adapteur ne fournit que des réponses sous forme de tableau mais que vous souhaitez récupérer un seul _record_, vous pouvez également utiliser la méthode `query()` comme suit&nbsp;:

```javascript
// GET to /users?filter[email]=tomster@example.com
tom = store.query('user', {
  filter: {
    email: 'tomster@example.com'
  }
}).then(function(users) {
  return users[0]; // the first object
});
```

<!-- eof - needed for pages that end in a code block  -->
