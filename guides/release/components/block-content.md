Les templates de composant peuvent avoir un ou plusieurs placeholders que les utilisateurs peuvent utiliser pour injecter leur propre code HTML.
Ces placeholders sont appelés des blocs (ou _block_).
Voici un exemple de composant appelé avec le bloc par défaut (qui est implicite).

```handlebars
<ExampleComponent>
  Ceci est le <b>contenu du bloc</b> par défaut qui 
  remplacera `{{yield}}` (ou `{{yield to="default"}}`)
  dans le template de `ExampleComponent`.
</ExampleComponent>
```

L'exemple ci-dessus est équivalent à appeler explicitement le bloc par défaut en utilisant la syntaxe "named block".

```handlebars
<ExampleComponent>
  <:default>
    Ceci est le <b>contenu du bloc</b> par défaut qui 
    remplacera `{{yield}}` (ou `{{yield to="default"}}`)
    dans le template de `ExampleComponent`.
  </:default>
</ExampleComponent>
```

Via l'utilisation des blocs, les utilisateurs du composant peuvent ajouter du style et des comportements supplémentaires en HTML, à l'aide de modifiers ou d'autres composants à l'intérieur du bloc.

Pour rendre ça plus concret, examinons deux composants similaires qui représentent les différents messages d'un utilisateur.

```handlebars {data-filename="app/components/received-message.hbs"}
<aside>
  <div class="avatar is-active" title="Tomster's avatar">T</div>
</aside>
<section>
  <h4 class="username">
    Tomster
    <span class="local-time">heure locale : 16h56</span>
  </h4>

  <p>
    Hey Zoey, as-tu eu l'occasion de regarder le document
    de brainstorming pour l'EmberConf que je t'ai envoyé ?
  </p>
</section>
```

```handlebars {data-filename="app/components/sent-message.hbs"}
<aside class="current-user">
  <div class="avatar" title="Zoey's avatar">Z</div>
</aside>
<section>
  <h4 class="username">Zoey</h4>

  <p>Hey!</p>

  <p>
    J'adore les idées ! Je suis vraiment enthousiaste de voir la 
    direction que prend l'EmberConf cette année, je suis sûre que ce 
    sera la meilleure à ce jour.
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
      mais je pense que c'est peut-être un peu hors de notre budget. On 
      pourrait peut-être louer des projecteurs à la place ?
    </li>
    <li>
      On aura absolument besoin de plus de roues de hamster, la file 
      d'attente l'an dernier était <em>beaucoup</em> trop longue. Je 
      vais m'y mettre maintenant avant la saison soit trop avancée pour 
      la location.
    </li>
  </ul>

  <p>Dis-moi quand tu auras fixé les dates !</p>
</section>
```

Au lieu d'avoir deux composants différents, un pour les messages envoyés et un pour les messages reçus, nous pourrions plutôt essayer de créer un composant de message unique.
À l'intérieur de ce composant, nous pourrions également substituer l'avatar et le nom d'utilisateur par d'autres composants génériques.

La structure des deux messages est assez simple et similaire, nous pouvons donc utiliser des arguments et des conditions pour gérer les différences de contenu entre eux (voir les chapitres précédents pour plus de détails sur la façon de procéder).

```handlebars {data-filename="app/components/message.hbs"}
<Message::Avatar
  @title={{@avatarTitle}}
  @initial={{@avatarInitial}}
  @isActive={{@userIsActive}}
  class="{{if @isCurrentUser "current-user"}}"
/>
<section>
  <Message::Username
    @name={{@username}}
    @localTime={{@userLocalTime}}
  />

  ...
</section>
```

Ça fonctionne plutôt bien, mais le cas du contenu du message est différent. Le message peut être long, donc pas facile de le passer en argument. En fait, ce que nous voulons, c'est laisser un placeholder afin de "capturer" tout contenu passé au composant `<Message>`.

La manière de faire ça avec Ember est d'utiliser la syntaxe `{{yield}}`.

```handlebars {data-filename="app/components/message.hbs"}
<Message::Avatar
  @title={{@avatarTitle}}
  @initial={{@avatarInitial}}
  @isActive={{@userIsActive}}
  class="{{if @isCurrentUser "current-user"}}"
/>
<section>
  <Message::Username
    @name={{@username}}
    @localTime={{@userLocalTime}}
  />

  {{yield}}
</section>
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <code>{{yield}}</code> est nommé d'après un concept similaire dans les languages de script,
        comme Ruby, JavaScript et Python. Pas besoin de comprendre le lien pour l'utiliser, mais si 
        vous êtes d'humeur à aller plus loin, jetez un oeil à 
        <a href="https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/yield">
          l'opérateur `yield` en JavaScript
        </a>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Vous pouvez penser à `{{yield}}` comme à un espace réservé au contenu de la balise `<Message>`.

```handlebars {data-filename="app/components/received-message.hbs"}
<Message
  @username="Tomster"
  @userIsActive={{true}}
  @userLocalTime="16h56"

  @avatarTitle="L'avatar de Tomster"
  @avatarInitial="T"
>
  <p>
    Hey Zoey, as-tu eu l'occasion de regarder le document
    de brainstorming pour l'EmberConf que je t'ai envoyé ?
  </p>
</Message>
```

```handlebars {data-filename="app/components/sent-message.hbs"}
<Message
  @username="Zoey"
  @isCurrentUser={{true}}

  @avatarTitle="L'avatar de Zoey"
  @avatarInitial="Z"
>
  <p>Hey!</p>

  <p>
    J'adore les idées ! Je suis vraiment enthousiaste de voir la 
    direction que prend l'EmberConf cette année, je suis sûre que ce 
    sera la meilleure à ce jour.
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
      mais je pense que c'est peut-être un peu hors de notre budget. On 
      pourrait peut-être louer des projecteurs à la place ?
    </li>
    <li>
      On aura absolument besoin de plus de roues de hamster, la file 
      d'attente l'an dernier était <em>beaucoup</em> trop longue. Je 
      vais m'y mettre maintenant avant la saison soit trop avancée pour 
      la location.
    </li>
  </ul>

  <p>Dis-moi quand tu auras fixé les dates !</p>
</Message>
```

Comme montré ici, nous pouvons passer différents contenus dans la balise. Le contenu de la balise est aussi appelé _block_. La syntaxe `{{yield}}` "cède sa place" au bloc une fois celui-ci passé au composant.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        Vous pouvez penser au composant <code>Message</code> comme à une fonction,
        et au bloc comme à un <a href="https://developer.mozilla.org/en-US/docs/Glossary/Callback_function"><em>callback</em></a>
        que vous passez au composant. De ce point de vue, la syntaxe <code>{{yield}}</code>
        appelle le callback.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### Blocs conditionnels

Parfois, nous pouvons vouloir fournir du contenu par défaut si l'utilisateur d'un composant n'a pas spécifié de bloc. Par exemple, prenons une boîte de dialogue de message d'erreur qui aurait un message par défaut dans les cas où nous ne savons pas quelle erreur s'est produite. Nous pourrions afficher le message par défaut en utilisant la syntaxe `(has-block)` dans un composant `ErrorDialog`.

```handlebars {data-filename=app/components/error-dialog.hbs}
<dialog>
  {{#if (has-block)}}
    {{yield}}
  {{else}}
    Une erreur s'est produite!
  {{/if}}
</dialog>
```

Maintenant, si nous utilisons notre composant `ErrorDialog` sans bloc, il affichera le message par défaut.

```handlebars
<ErrorDialog/>
```
```html
<!-- rendered -->
<dialog>
  Une erreur s'est produite!
</dialog>
```

Cependant, si nous voulons afficher un message plus détaillé, nous pouvons spécifier le bloc pour le passer à la boîte de dialogue.

```handlebars
<ErrorDialog>
  <Icon type="no-internet" />
  <p>Vous n'êtes pas connecté à Internet !</p>
</ErrorDialog>
```

## Paramètres des blocs

Les blocs peuvent aussi remonter des valeurs au template, à l'image des fonctions de callback en JavaScript. Prenons par exemple un simple composant `BlogPost`.

```handlebars {data-filename=app/components/blog-post.hbs}
<h1>{{@post.title}}</h1>
<h2>{{@post.author}}</h2>

{{@post.body}}
```

```handlebars
<!-- usage -->
<BlogPost @post={{@blogPost}} />
```

Nous pourrions vouloir laisser à l'utilisateur la possibilité d'ajouter du contenu supplémentaire avant ou après le post, comme une image ou un profil. Comme nous ne savons pas ce que veut faire l'utilisateur avec le corps du post (`body`), nous pouvons, à la place, lui retourner le `body`.

```handlebars {data-filename=app/components/blog-post.hbs}
<h1>{{@post.title}}</h1>
<h2>{{@post.author}}</h2>

{{yield @post.body}}
```

```handlebars
<!-- usage -->
<BlogPost @post={{@blogPost}} as |postBody|>
  <img alt="" role="presentation" src="./blog-logo.png">

  {{postBody}}

  <AuthorBio @author={{@blogPost.author}} />
</BlogPost>
```

Il est possible de retourner ainsi plusieurs valeurs, séparées par des espaces.

```handlebars {data-filename=app/components/blog-post.hbs}
{{yield @post.title @post.author @post.body }}
```

```handlebars
<!-- usage -->
<BlogPost @post={{@blogPost}} as |postTitle postAuthor postBody|>
  <img alt="" role="presentation" src="./blog-logo.png">

  {{postTitle}}

  {{postBody}}

  <AuthorBio @author={{postAuthor}} />
</BlogPost>
```

<!-- eof - needed for pages that end in a code block  -->
