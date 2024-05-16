## Création de _Records_

Vous pouvez créer des _records_ (enregistrements) en appelant la méthode
[`createRecord()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/createRecord?anchor=createRecord) sur le _store_ (magasin, réserve).

```javascript
this.store.createRecord('post', {
  title: 'Rails is Omakase',
  body: 'Lorem ipsum',
});
```

Pour rendre disponible le _store_, vous pouvez [injecter le service _`store`_](../#toc_injecting-the-store).

## Mettre à jour des _Records_

Faire des modifications à des _records_ EmberData est aussi simple que de mettre à jour l'attribut que vous souhaitez modifier&nbsp;:

```javascript
this.store.findRecord('post', 1).then(function (post) {
  // ...après que le _record_ soit chargé
  post.title = 'Un nouveau post';
});
```

## _Records_ persistants

Les _records_ dans EmberData persistent sur une base de pré-instance.
Appelez [`save()`](https://api.emberjs.com/ember-data/release/classes/Model/methods/save?anchor=save) sur une instance de `Model` et ça va créer une requête réseau.

EmberData s'occupe de suivre l'état de chaque _record_ pour vous. Ça permet à EmberData de traiter différemment les _records_ créés de ceux déjà existants pendant la sauvegarde.

Par défaut, EmberData va `POST` les _records_ nouvellement créés à leur URL type.

```javascript
let post = store.createRecord('post', {
  title: 'Rails is Omakase',
  body: 'Lorem ipsum',
});

post.save(); // => POST à '/posts'
```

Les _records_ déjà existants au niveau du _backend_ sont mis à jour en utilisant le verbe HTTP `PATCH`.

```javascript
store.findRecord('post', 1).then(function (post) {
  post.title; // => "Rails is Omakase"

  post.title = 'Un nouvel article';

  post.save(); // => PATCH à '/posts/1'
});
```

Vous pouvez vérifier si un _record_ a des changements en cours non sauvegardés en vérifiant sa propriété [`hasDirtyAttributes`](https://api.emberjs.com/ember-data/release/classes/Model/properties/hasDirtyAttributes?anchor=hasDirtyAttributes). Vous pouvez également voir quelles parties du _record_ ont été modifiées et quelle était leur valeur d'origine en utilisant la méthode [`changedAttributes()`](https://api.emberjs.com/ember-data/release/classes/Model/methods/changedAttributes?anchor=changedAttributes). `changedAttributes` retourne un objet dont les clés sont les propriétés modifiées et les valeurs sont un tableau de valeurs `[ancienneValeur, nouvelleValeur]`.

```javascript
person.isAdmin; // => false
person.hasDirtyAttributes; // => false
person.isAdmin = true;
person.hasDirtyAttributes; // => true
person.changedAttributes(); // => { isAdmin: [false, true] }
```

À ce stade, vous pouvez soit conserver vos changements avec `save()` ou les annuler en utilisant [`rollbackAttributes()`](https://api.emberjs.com/ember-data/release/classes/Model/methods/rollbackAttributes?anchor=rollbackAttributes)

```javascript
person.hasDirtyAttributes; // => true
person.changedAttributes(); // => { isAdmin: [false, true] }

person.rollbackAttributes();

person.hasDirtyAttributes; // => false
person.isAdmin; // => false
person.changedAttributes(); // => {}
```

## Gérer les erreurs de validation

Si le serveur _backend_ retourne des erreurs de validations après une tentative de sauvegarde, elles seront disponibles dans la propriété `errors` de votre modèle. Voici un exemple montrant comment vous pouvez afficher les erreurs apparaissant en essayant de sauvegarder un article dans votre _template_&nbsp;:

```handlebars
{{#each this.post.errors.title as |error|}}
  <div class='error'>{{error.message}}</div>
{{/each}}
{{#each this.post.errors.body as |error|}}
  <div class='error'>{{error.message}}</div>
{{/each}}
```

## Promesses

[`save()`](https://api.emberjs.com/ember-data/release/classes/Model/methods/save?anchor=save) retourne une promesse, ce qui facilite la gestion asynchrone des succès et des échecs. Voici un exemple de cas fréquent&nbsp;:

```javascript
// On suppose que l'on a déjà injecté le router et les services du _store_
const newPost = this.store.createRecord('post', {
  title: 'Rails is Omakase',
  body: 'Lorem ipsum',
});

try {
  await newPost.save();
  this.router.transitionTo('posts.show', newPost.id);
} catch (error) {
  // gestion de l'erreur
}
```

## Supprimer des _Records_

Supprimer des _records_ est aussi simple que d'en créer. Appelez [`deleteRecord()`](https://api.emberjs.com/ember-data/release/classes/Model/methods/deleteRecord?anchor=deleteRecord) sur n'importe quelle instance de `Model`. Ça donne au _record_ l'attribut `isDeleted`. La suppression peut alors être sauvegardée en utilisant `save()`. Sinon, vous pouvez utiliser la méthode [`destroyRecord`](https://api.emberjs.com/ember-data/release/classes/Model/methods/destroyRecord?anchor=destroyRecord) pour supprimer et sauvegarder en même temps.

```javascript
let post = store.peekRecord('post', 1);
post.deleteRecord();
post.isDeleted; // => true
post.save(); // => DELETE to /posts/1

// OR
post = store.peekRecord('post', 2);
post.destroyRecord(); // => DELETE to /posts/2
```

<!-- eof - needed for pages that end in a code block  -->
