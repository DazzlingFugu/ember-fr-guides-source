Souvent, on a besoin de répéter un même composant de multiples fois, l'un à la suite de l'autre, avec des données différentes pour chaque invocation. Pour boucler ainsi sur les éléments d'une liste, on peut utiliser le _helper_ [`{{#each}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each?anchor=each), et répéter une section de _template_ pour chaque élément.

Par exemple, dans une app de messagerie, nous pourrions avoir un composant `<Message>` que nous répéterions pour chaque message que les utilisateurs se sont envoyés.

```handlebars {data-filename="app/components/messages.hbs"}
<div class="messages">
  <Message
    @username="Tomster"
    @userIsActive={{true}}
    @userLocalTime="16:56"
  >
    <p>
      Hey Zoey, as-tu eu l'occasion de regarder le document
      de brainstorming pour l'EmberConf que je t'ai envoyé ?
    </p>
  </Message>
  <Message
    @username="Zoey"
    @userIsActive={{true}}
  >
    <p>Hey !</p>

    <p>
      J'adore les idées ! Je suis vraiment enthousiaste de voir la 
      direction que prend l'EmberConf cette année, je suis sûre que ce 
      sera la meilleure de toutes.
      Quelques notes rapides :
    </p>

    <ul>
      <li>
        Tout à fait d'accord sur le fait qu'on devrait doubler le budget 
        café cette année (c'est vraiment impressionnant tout ce qu'on 
        boit !)
      </li>
      <li>
        Un dirigeable rendrait certainement le lieu très facile à trouver, 
        mais je pense que c'est peut-être un peu hors budget. On 
        pourrait peut-être louer des projecteurs à la place ?
      </li>
      <li>
        On a absolument besoin de plus de roues pour hamster, l'année dernière la file d'attente était <em>beaucoup</em> trop longue. Je vais m'occuper de ça maintenant, avant que la saison des locations soit à son pic.
      </li>
    </ul>

    <p>Dis-moi quand tu auras fixé les dates !</p>
  </Message>

  <NewMessageInput />
</div>
```

D'abord, nous pourrions créer une classe de composant et, dans un tableau, y extraire les parties différentes de chaque composant `<Message>`. On extrairait le `username`, `userIsActive`, `userLocalTime` et le contenu du bloc pour chaque message. Pour le contenu du bloc, puisque c'est du HTML pur et simple, nous pouvons l'extraire en tant que chaîne de caractères.

```js {data-filename="app/components/messages.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MessagesComponent extends Component {
  @tracked messages = [
    {
      username: 'Tomster',
      active: true,
      localTime: '16:56',
      content: `
        <p>
          Hey Zoey, as-tu eu l'occasion de regarder le document
          de brainstorming pour l'EmberConf que je t'ai envoyé ?
        </p>
      `
    },
    {
      username: 'Zoey',
      active: true,
      content: `
        <p>Hey !</p>

        <p>
          J'adore les idées ! Je suis vraiment enthousiaste de voir la 
          direction que prend l'EmberConf cette année, je suis sûre que ce 
          sera la meilleure de toutes.
          Quelques notes rapides :
        </p>

        <ul>
          <li>
            Tout à fait d'accord sur le fait qu'on devrait doubler le budget 
            café cette année (c'est vraiment impressionnant tout ce qu'on 
            boit !)
          </li>
          <li>
            Un dirigeable rendrait certainement le lieu très facile à trouver, 
            mais je pense que c'est peut-être un peu hors budget. On 
            pourrait peut-être louer des projecteurs à la place ?
          </li>
          <li>
            On a absolument besoin de plus de roues pour hamster, l'année dernière la file d'attente était <em>beaucoup</em> trop longue. Je vais m'occuper de ça maintenant, avant que la saison des locations soit à son pic.
          </li>
        </ul>

        <p>Dis-moi quand tu auras fixé les dates !</p>
      `
    }
  ];
}
```

Ensuite, nous ajoutons le _helper_ `{{each}}` au _template_ et lui passons `this.messages`. `{{each}}` reçoit chaque message en tant que premier paramètre de bloc, et nous pouvons alors utiliser cet élément dans le _template_ du bloc pour la boucle.

```handlebars {data-filename="app/components/messages.hbs" data-diff="+2,+3,+4,+5,+6,+7,+8,+9,+10,-11,-12,-13,-14,-15,-16,-17,-18,-19,-20,-21,-22,-23,-24,-25,-26,-27,-28,-29,-30,-31,-32,-33,-34,-35,-36,-37,-38,-39,-40,-41,-42,-43,-44,-45,-46,-47,-48,-49,-50,-51"}
<div class="messages">
  {{#each this.messages as |message|}}
    <Message
      @username={{message.username}}
      @userIsActive={{message.active}}
      @userLocaltime={{message.localTime}}
    >
      {{{message.content}}}
    </Message>
  {{/each}}
  <Message
    @username="Tomster"
    @userIsActive={{true}}
    @userLocalTime="16:56"
  >
    <p>
      Hey Zoey, as-tu eu l'occasion de regarder le document
      de brainstorming pour l'EmberConf que je t'ai envoyé ?
    </p>
  </Message>
  <Message
    @username="Zoey"
    @userIsActive={{true}}
  >
    <p>Hey !</p>

    <p>
      J'adore les idées ! Je suis vraiment enthousiaste de voir la 
      direction que prend l'EmberConf cette année, je suis sûre que ce 
      sera la meilleure de toutes.
      Quelques notes rapides :
    </p>

    <ul>
      <li>
        Tout à fait d'accord sur le fait qu'on devrait doubler le budget 
        café cette année (c'est vraiment impressionnant tout ce qu'on 
        boit !)
      </li>
      <li>
        Un dirigeable rendrait certainement le lieu très facile à trouver, 
        mais je pense que c'est peut-être un peu hors budget. On 
        pourrait peut-être louer des projecteurs à la place ?
      </li>
      <li>
        On a absolument besoin de plus de roues pour hamster, l'année dernière la file d'attente était <em>beaucoup</em> trop longue. Je vais m'occuper de ça maintenant, avant que la saison des locations soit à son pic.
      </li>
    </ul>

    <p>Dis-moi quand tu auras fixé les dates !</p>
  </Message>

  <NewMessageInput />
</div>
```

Notez que nous utilisons des accolades triples autour de `{{{message.content}}}`. C'est comme ça qu'Ember sait qu'il faut insérer directement du contenu HTML, plutôt qu'une chaîne de caractères.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p>
        Les accolades triples sont un moyen pratique d'insérer dynamiquement du HTML dans les _templates_ Ember, mais il n'est pas recommandé de le faire pour les apps en production. Insérer du HTML inconnu peut créer des résultats inattendus et des failles de sécurité. Assurez-vous d'assainir (<em>sanitize</em>) le HTML avant de l'afficher.
        </p>
        <p>
        Il est possible d'utiliser la fonction <a href="https://api.emberjs.com/ember/release/functions/@ember%2Ftemplate/htmlSafe">htmlSafe</a> pour marquer un HTML assaini en tant que HTML sûr (<em>safe</em>), puis d'utiliser des accolades doubles pour afficher le HTML. On peut également créer un <a href="../helper-functions"><em>helper</em></a> qui assaini le HTML, le marque comme sûr puis retourne le résultat.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### Mettre à jour une liste

Ensuite, ajoutons un moyen pour les utilisateurs d'envoyer un nouveau message. D'abord, il nous faut une action pour créer le nouveau message. Nous l'ajouterons au composant `<NewMessageInput />`&nbsp;:

```handlebars {data-filename="app/components/new-message-input.hbs" data-diff="-1,+2,-3,+4"}
<form>
<form {{on "submit" this.createMessage}}>
  <input>
  <Input @value={{this.message}}>
  <button type="submit">
    Envoyer
  </button>
</form>
```

Nous utilisons l'événement `submit` sur le formulaire lui-même plutôt que d'ajouter un gestionnaire d'événement `click` au bouton, car il s'agit de soumettre le formulaire en entier. Nous avons aussi changé la balise `input` pour lui préférer le composant intégré `<Input>`, qui met à jour la valeur passée à `@value` automatiquement. Ensuite, créons la classe de composant&nbsp;:

```javascript {data-filename="app/components/new-message-input.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class NewMessageInputComponent extends Component {
  @tracked message;

  @action
  createMessage(event) {
    event.preventDefault();

    if (this.message && this.args.onCreate) {
      this.args.onCreate(this.message);

      // réinitialise le message saisi
      this.message = '';
    }
  }
}
```

Cette action utilise l'argument `onCreate` pour exposer une API publique permettant de définir ce qui se passe quand un message est créé. De cette façon, le composant `<NewMessageInput>` n'a pas à se soucier du contexte extérieur, il peut se concentrer sur son seul travail, obtenir le nouveau message saisi.

À présent, mettons à jour le composant parent pour passer ce nouvel argument.

```handlebars {data-filename="app/components/messages.hbs" data-diff="-12,+13"}
<div class="messages">
  {{#each this.messages as |message|}}
    <Message
      @username={{message.username}}
      @userIsActive={{message.active}}
      @userLocaltime={{message.localTime}}
    >
      {{{message.content}}}
    </Message>
  {{/each}}

  <NewMessageInput />
  <NewMessageInput @onCreate={{this.addMessage}} />
</div>
```

Puis dans la classe de composant, ajoutons l'action `addMessage`. Cette action va créer le nouveau message à partir du texte que le `<NewMessageInput>` nous donne, avant de le pousser dans le tableau de messages.

```js {data-filename="app/components/messages.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MessagesComponent extends Component {
  username = 'Zoey';

  @action
  addMessage(messageText) {
    this.messages = [...this.messages, {
      username: this.username,
      active: true,
      content: `<p>${messageText}</p>`
    }];
  }

  @tracked messages = [
    {
      username: 'Tomster',
      active: true,
      localTime: '16:56',
      content: `
        <p>
          Hey Zoey, as-tu eu l'occasion de regarder le document
          de brainstorming pour l'EmberConf que je t'ai envoyé ?
        </p>
      `
    },
    {
      username: 'Zoey',
      active: true,
      content: `
        <p>Hey !</p>

        <p>
          J'adore les idées ! Je suis vraiment enthousiaste de voir la 
          direction que prend l'EmberConf cette année, je suis sûre que ce 
          sera la meilleure de toutes.
          Quelques notes rapides :
        </p>

        <ul>
          <li>
            Tout à fait d'accord sur le fait qu'on devrait doubler le budget 
            café cette année (c'est vraiment impressionnant tout ce qu'on 
            boit !)
          </li>
          <li>
            Un dirigeable rendrait certainement le lieu très facile à trouver, 
            mais je pense que c'est peut-être un peu hors budget. On 
            pourrait peut-être louer des projecteurs à la place ?
          </li>
          <li>
            On a absolument besoin de plus de roues pour hamster, l'année dernière 
            la file d'attente était <em>beaucoup</em> trop longue. Je vais m'occuper
            de ça maintenant, avant que la saison des locations soit à son pic.
          </li>
        </ul>

        <p>Dis-moi quand tu auras fixé les dates !</p>
      `
    }
  ];
}
```

Maintenant, à chaque fois que nous tapons une valeur et la soumettons via le formulaire, un nouvel objet message est ajouté au tableau, et `{{each}}` met à jour l'affichage avec le nouvel élément.

### Index des éléments

L'index de chaque élément d'un tableau est fourni en tant que second paramètre de bloc. C'est utile lorsque vous avez besoin de l'index, par exemple si vous voulez afficher des positions dans une file d'attente&nbsp;:

```javascript
import Component from '@glimmer/component';

export default class SomeComponent extends Component {
  queue = [
    { name: 'Yehuda' },
    { name: 'Jen' },
    { name: 'Rob' }
  ];
}
```

```handlebars
<ul>
  {{#each this.queue as |person index|}}
    <li>Bonjour, {{person.name}} ! Vous avez le numéro {{index}} dans la file.</li>
  {{/each}}
</ul>
```

### Listes vides

Le _helper_ [`{{#each}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each?anchor=each) peut aussi avoir un `{{else}}` correspondant. Le contenu de ce bloc ne s'affiche que si le tableau passé à `{{#each}}` est vide&nbsp;:

```handlebars
{{#each this.people as |person|}}
  Bonjour, {{person.name}} !
{{else}}
  Désolé, il n'y a personne.
{{/each}}
```

## Boucler sur les objets

Il y a aussi des situations où on a besoin de boucler sur les clés et les valeurs d'un objet plutôt que sur les éléments d'un tableau, à la manière de la boucle `for...in` de JavaScript. Pour faire ça, on peut utiliser le _helper_ [`{{#each-in}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each-in?anchor=each-in)&nbsp;:

```javascript {data-filename=/app/components/store-categories.js}
import Component from '@glimmer/component';

export default class StoreCategoriesComponent extends Component {
  // On définit la propriété "categories" d'un objet JavaScript
  // avec le nom de la catégorie en tant que clé et une liste
  // de produit en tant que valeur.
  categories = {
    'Bourbons': ['Bulleit', 'Four Roses', 'Woodford Reserve'],
    'Ryes': ['WhistlePig', 'High West']
  };
}
```

```handlebars {data-filename=/app/components/store-categories.hbs}
<ul>
  {{#each-in this.categories as |category products|}}
    <li>{{category}}
      <ol>
        {{#each products as |product|}}
          <li>{{product}}</li>
        {{/each}}
      </ol>
    </li>
  {{/each-in}}
</ul>
```

Le _template_ à l'intérieur du bloc `{{#each-in}}` est répété une fois pour chaque clé dans l'objet passé. Le premier paramètre de bloc (`category` dans notre exemple) est la clé pour cette itération, tandis que le second paramètre (`products`) est la valeur de cette clé.

L'exemple ci-dessus afficherait la liste comme ceci&nbsp;:

```html
<ul>
  <li>Bourbons
    <ol>
      <li>Bulleit</li>
      <li>Four Roses</li>
      <li>Woodford Reserve</li>
    </ol>
  </li>
  <li>Ryes
    <ol>
      <li>WhistlePig</li>
      <li>High West</li>
    </ol>
  </li>
</ul>
```

### Ordre

Les clés d'un objet sont listées dans le même ordre que dans le tableau retourné par  `Object.keys` pour cet objet. Si vous voulez un ordre de tri différent, utilisez `Object.keys` pour obtenir un tableau de clés, ordonnez ce tableau avec les outils intégrés de JavaScript, puis passez-le au _helper_ [`{{#each}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each?anchor=each).

### Listes vides

Le _helper_ [`{{#each-in}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each-in?anchor=each-in) peut avoir un `{{else}}` correspondant. Le contenu de ce bloc s'affiche si l'objet est vide, `null` ou `undefined`&nbsp;:

```handlebars
{{#each-in this.people as |name person|}}
  Bonjour, {{name}}! Vous avez {{person.age}} ans.
{{else}}
  Désolé, il n'y a personne.
{{/each-in}}
```

<!-- eof - needed for pages that end in a code block  -->
