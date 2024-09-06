Les interfaces utilisateur (ou _UI_ pour _User Interfaces_) d'Ember sont basées sur le HTML, c'est-à-dire que chaque partie de l'UI montrée à l'utilisateur est définie dans un _template_ HTML, quelque part dans votre app. Les _templates_ sont, pour cette raison, une brique centrale d'Ember, et l'une des parties les plus importantes du _framework_.

Dans les chapitres suivants, nous discuterons les capacités et les principaux concepts autour des _templates_&nbsp;; mais avant ça, commençons par les bases. Le moyen le plus simple de commencer un _template_ Ember, c'est avec du HTML&nbsp;!

## Le _template_ de l'application

Le _template_ principal dans une application Ember est le fichier `app/templates/application.hbs`. On peut copier du HTML dans ce fichier, il fonctionnera tel quel. Par exemple, copiez le HTML de l'exemple suivant pour une app de messagerie très simple&nbsp;:

```html {data-filename=app/templates/application.hbs}
<div class="messages">
  <aside>
    <div class="avatar is-active" title="Avatar de Tomster">T</div>
  </aside>
  <section>
    <h4 class="username">
      Tomster
      <span class="local-time">heure locale : 16:56</span>
    </h4>

    <p>
      Hey Zoey, as-tu eu l'occasion de regarder le document
      de brainstorming pour l'EmberConf que je t'ai envoyé ?
    </p>
  </section>

  <aside class="current-user">
    <div class="avatar" title="Avatar de Zoey">Z</div>
  </aside>
  <section>
    <h4 class="username">Zoey</h4>

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
  </section>

  <form>
    <label for="message">Message</label>
    <input id="message" />
    <button type="submit">
      Envoyer
    </button>
  </form>
</div>
```

Vous pouvez "servir" l'app en exécutant `ember s` dans votre terminal, ce qui rendra la copie locale de votre app disponible pour votre navigateur web.

Si vous servez l'app et allez sur `localhost:4200` dans votre navigateur, vous verrez le HTML affiché. Pour l'instant, il n'aura aucun style.

Pour ajouter du style à l'application, copiez le CSS suivant dans `app/styles/app.css`&nbsp;:

```css {data-filename=styles/app.css}
body {
  max-width: 800px;
  margin: auto;
  padding: 2em;
  font-family: sans-serif;
  background-color: #fdfdfd;
}

.messages {
  display: grid;
  grid-template-columns: 80px 1fr;
  padding: 2em;
  border-radius: 0.5em;
  box-shadow: 0 0.25em 1.5em 0.25em rgba(0, 0, 0, 0.1);
}

.messages > section {
  margin-bottom: 1.5em;
  line-height: 1.5em;
}

.messages p,
.messages ul,
.username {
  margin: 0.5em 0;
}

.local-time {
  font-size: 0.8em;
  color: #da6c4d;
  font-weight: normal;
  margin-left: 10px;
}

.avatar {
  position: relative;
  border-radius: 50%;
  width: 60px;
  height: 60px;

  text-align: center;
  line-height: 60px;

  color: white;
  font-weight: bold;
  background-color: #ff907b;
}

.avatar.is-active:after {
  content: " ";
  height: 14px;
  width: 14px;
  border: solid 3px white;
  border-radius: 50%;
  background-color: #8bc34a;
  position: absolute;
  bottom: 0;
  right: 0;
}

.current-user .avatar {
  background-color: #30aba5;
}

form {
  display: grid;
  grid-template-columns: 1fr 6em;
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  grid-column: span 2;
}

form > label {
  grid-area: 1 / 1 / 2 / 2;
}

form > input {
  border: 1px solid #cccccc;
  border-right: none;
  font-size: 1em;
  grid-area: 2 / 1 / 3 / 2;
}

form > button {
  border-bottom-right-radius: 0.5em;
  border: 1px solid #cccccc;
  font-size: 1em;
  grid-area: 2 / 2 / 3 / 3;
}
```

![capture d'écran de l'app de messagerie avec le style](/images/ember-core-concepts/messaging-app-1.png)

La construction d'une application Ember commence par l'utilisation de HTML, donc si vous connaissez déjà le HTML et le CSS, alors vous savez déjà construire une application Ember basique&nbsp;!

Vous pouvez même utiliser des SVG ou des _web components_ tels quels. Tant que votre HTML est valide, Ember l'affiche.

# Balises auto-fermantes

En plus de la syntaxe HTML classique, Ember permet l'utilisation d'une syntaxe auto-fermante (`<div />`) comme raccourci pour les balises ouvrantes et fermantes (`<div></div>`).

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        Vous n'avez pas <strong>besoin</strong> d'utiliser cette syntaxe pour les <a href="https://html.spec.whatwg.org/multipage/syntax.html#void-elements">balises HTML dites "vides"</a> comme <code>img</code> ou <code>br</code>, car elles sont déjà définies comme auto-fermantes par les spécifications HTML. En revanche, vous pouvez utiliser cette syntaxe comme raccourci pour les balises qui ne sont pas auto-fermantes par définition.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

# Fonctionnalités supportées

Toutes les fonctionnalités suivantes de HTML fonctionnent telles quelles&nbsp;:

- _Web components_
- SVG
- Commentaires HTML
- Espaces (les espaces suivent les mêmes règles que dans du HTML classique)
- Éléments HTML spéciaux comme `<table>` ou `<select>`

# Restrictions

Il existe une poignée de restrictions sur le HTML pouvant être écrit dans un _template_ Ember&nbsp;:

- Seuls des éléments HTML valides dans une balise `<body>` peuvent être utilisés
- Pas de balises `<script>`

En dehors de ça, faites tout ce que vous voulez&nbsp;!
