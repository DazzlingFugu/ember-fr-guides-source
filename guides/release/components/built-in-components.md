Ember fournit deux composants prêts à l'emploi pour construire des formulaires:

* [`<Input>`](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Input?anchor=Input)
* [`<Textarea>`](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Textarea?anchor=Textarea)

Le markup HTML de ces composants est similaire à celui des éléments natifs `<input>` et `<textarea>`. À la différence des éléments natifs, `<Input>` et `<Textarea>` mettent automatiquement à jour l'état des valeurs qui leur sont liées.

## `<Input>`

Nous avons dit plus haut que les composants _built-in_ (c'est-à-dire "construits à l'intérieur du framework") ont un markup HTML similaire à celui de leur équivalent natif. Que'est-ce que ça signifie ?

Considérons l'exemple suivant, le template d'un fichier.

```handlebars
<label for="user-question">Posez une question sur Ember :</label>
<Input
  id="user-question"
  @type="text"
  @value="Comment fonctionnent les champs textes ?"
/>
```

Quand Ember rend ce template, vous pouvez voir le code HTML suivant : 

```html
<label for="user-question">Posez une question sur Ember :</label>
<input id="user-question" type="text" value="Comment fonctionnent les champs textes ?" />
```


### Associer _labels_ et _inputs_

Chaque _input_ (champ texte) doit être associé à un _label_ (étiquette). Il y a différentes manières d'écrire cette association en HTML. Le composant built-in `<Input>` permet de :

1. Imbriquer l'input dans le label.

   ```handlebars
   <label>
     Posez une question sur Ember :

     <Input
       @type="text"
       @value={{this.userQuestion}}
     />
   </label>
   ```

2. Créer un ID (unique dans la page web), puis associer le label et l'input à l'aide des attributs `for` et `id`.

   ```handlebars
   <label for={{this.myUniqueId}}>
     Posez une question sur Ember :
   </label>

   <Input
     id={{this.myUniqueId}}
     @type="text"
     @value={{this.userQuestion}}
   />
   ```

3. Utiliser l'attribut `aria-label` pour décrire l'input à l'aide d'un texte invisible à l'écran mais détectable par les technologies d'assistance.

   ```handlebars
   <Input
     aria-label="Posez une question sur Ember"
     @type="text"
     @value={{this.userQuestion}}
   />
   ```

Il est plus approprié d'utiliser l'élément `<label>`, mais l'attribut `aria-label` devient utile dans les cas où un intitulé visible n'est pas possible.


### Définir les attributs de `<Input>`

À quelques exceptions près, vous pouvez passer [les attributs de input](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#Attributes) au composant `<Input>`.

Par exemple, l'attribut `aria-labelledby` peut être utile pour implémenter un champ de recherche. Le bouton de recherche peut servir de label pour l'élément input :

```handlebars
<Input aria-labelledby="button-search" />
<button id="button-search" type="button">Rechercher</button>
```

Quand un attribut est assigné avec des doubles quotes (`"button-search"` dans l'exemple ci-dessus), sa valeur est assignée directement à l'élément.

Vous pouvez aussi lier l'attribut `value` à une propriété définie dans votre application.
Dans l'exemple suivant, l'attribut `disabled` est lié à la valeur de `isReadOnly` dans le contexte courant.

```handlebars
<label for="input-name">Nom :</label>
<Input
  id="input-name"
  @value={{this.name}}
  disabled={{this.isReadOnly}}
  maxlength="50"
/>
```

Rappelez-vous qu'il y a quelques exceptions. Les attributs d'input suivants doivent être passés au composant `<Input>` comme argumens (les arguments sont préfixés du symbole `@`) :

- `@checked`
- `@type`
- `@value`


### Actions

À partir de Ember Octane, il est recommandé d'utiliser le modifier `{{on}}` pour appeler une action lors d'un _event_ (événement se produisant sur la page) comme [l'event "input"](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/input_event).

```handlebars
<label for="input-name">Nom :</label>
<Input
  id="input-name"
  @value={{this.name}}
  {{on "input" this.validateName}}
/>
```

[À propos du modifier `{{on}}`](../../upgrading/current-edition/action-on-and-fn/#toc_the-on-modifier)

Pour terminer, Ember fournit également plusieurs events d'input spécifiques :  `@enter`, `@insert-newline` et `@escape-press`. Ces events n'existent pas sur les éléments input natifs, mais vous pourriez les trouver utiles pour implémenter les intéractions clavier.

Le style moderne (ou Ember Octane) pour gérer les events clavier est [d'écrire un modifier](../../upgrading/current-edition/glimmer-components/#toc_writing-your-own-modifiers) afin de séparer les responsabilités : le composant gère les états, tandis que le modifier gère les intéractions avec le DOM. L'action appelée lors d'un event reçoit alors un objet `event` en paramètre.

[La communauté propose des addons](https://emberobserver.com/?query=keyboard) permettant de gérer les events clavier. Par exemple, avec [ember-keyboard](https://github.com/adopted-ember-addons/ember-keyboard), vous pouvez écrire :

```handlebars
{{!-- Before --}}
<Input
  @enter={{this.doSomething}}
  @escape-press={{this.doSomethingElse}}
/>

{{!-- After --}}
<Input
  {{on-key "Enter" this.doSomething}}
  {{on-key "Escape" this.doSomethingElse event="keydown"}}
/>
```

Notez que l'event `keydown` est utilisé pour détecter l'appui sur la touche `Escape` car `keypress` est déprécié.


### Cases à cocher

Vous pouvez utiliser le composant [`<Input>`](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Input?anchor=Input) pour créer une _checkbox_ (case à cocher). Assignez le texte `"checkbox"` à l'argument `@type`, et utilisez `@checked` à la place de `@value`.

```handlebars
<label for="admin-checkbox">Est admin ?</label>
<Input
  id="admin-checkbox"
  @type="checkbox"
  @checked={{this.isAdmin}}
/>
```

Pour appeler une action lors d'events spécifiques, utilisez le modifier `{{on}}` :

```handlebars
<label for="admin-checkbox">Est admin ?</label>
<Input
  id="admin-checkbox"
  @type="checkbox"
  @checked={{this.isAdmin}}
  {{on "input" this.validateRole}}
/>
```


## `<Textarea>`

L'exemple suivant montre comment lier `this.userComment` à la valeur d'un élément _textarea_ (texte multi-lignes).

```handlebars
<label for="user-comment">Commentaire :</label>
<Textarea
  id="user-comment"
  @value={{this.userComment}}
  rows="6"
  cols="80"
/>
```


### Définir les attributs d'un `<Textarea>`

À l'exception de l'argument `@value`, vous pouvez passer tous les [attributs](https://developer.mozilla.org/fr/docs/Web/HTML/Element/textarea#Attributes) que `<textarea>` supporte nativement.

<!--
  TODO:
  Move this section to a dedicated page for how to build forms.
  Please present a solution that does not use `{{mut}}`.
-->
## Lier les attributs dynamiques

Vous pourriez avoir besoin de lier dynamiquement une propriété à un input si vous construisez, par exemple, un formulaire dynamique. Pour ça, vous devrez utiliser conjointement les helpers [`{{get}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/get?anchor=get) et [`{{mut}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/mut?anchor=mut) comme dans l'exemple suivant :

```handlebars
<label for="input-name">Nom :</label>
<Input
  id="input-name"
  @value={{mut (get this.person this.field)}}
/>
```

Le helper `{{get}}` permet de spécifier dynamiquement quelle propriété est liée à la valeur de l'input, tandis que le helper `{{mut}}` permet la mise à jour de cette propriété en fonction du texte entré dans l'input. Pour plus de détails sur ces deux helpers, consultez [`{{get}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/get?anchor=get)
et [`{{mut}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/mut?anchor=mut).
