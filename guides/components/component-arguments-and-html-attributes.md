Les composants deviennent des éléments utiles d'une application quand on les rend "réutilisables". Lorsqu'on réutilise efficacement les composants, on peut éviter d'avoir à recréer des parties de l'app encore et encore. Si vous voulez "réutiliser" un composant à plusieurs endroits, vous aurez besoin d'un moyen d'en abstraire certaines parties.

Commençons par deux composants d'avatar similaires mais non identiques, qui représentent deux utilisateurs différents&nbsp;:

```handlebars {data-filename="app/components/received-message/avatar.hbs"}
<aside>
  <div class="avatar" title="Avatar de Tomster">T</div>
</aside>
```

```handlebars {data-filename="app/components/sent-message/avatar.hbs"}
<aside class="current-user">
  <div class="avatar" title="Avatar de Zoey">Z</div>
</aside>
```

La "structure" de ces composants est identique, mais ils ont un contenu (l'initiale de l'utilisateur) et des attributs (`title` et `class`) différents.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-message">
        Vous avez peut-être noté la classe <code>is-active</code> sur l'avatar du message reçu, présente dans l'exemple des chapitres précédents, est absente dans celui-ci. Nous couvrirons ça dans le chapitre suivant, dans <a href="../conditional-content">Contenu Conditionnel</a>.
      </div>
    </div>
  </div>
</div>

## Arguments

Nous pouvons créer un composant utilisable dans les deux situations en factorisant sous forme de _template_ les parties du HTML qui sont différentes.

```handlebars {data-filename="app/components/avatar.hbs"}
<aside>
  <div class="avatar" title={{@title}}>{{@initial}}</div>
</aside>
```

La syntaxe `{{@initial}}` signifie que le contenu de la balise `<div>` est "dynamique" et sera spécifié par la balise `<Avatar>`. De même, la balise `{{@title}}` signifie que le contenu de l'attribut `title` est dynamique et sera spécifié de la même manière. Nous pouvons maintenant remplacer le message reçu en utilisant la balise `<Avatar>` et en lui passant quelques arguments.

```handlebars {data-filename="app/components/received-message/avatar.hbs"}
<Avatar @title="Avatar de Tomster" @initial="T" />
```

Ce code inclut le composant `<Avatar>`, qui attend deux "arguments_"&nbsp;: `@title` et `@initial`.

Vous êtes probablement familier avec les attributs HTML, qui indiquent au navigateur comment afficher un élément HTML. La syntaxe `@title=` est similaire, mais au lieu d'indiquer au navigateur ce qu'il doit faire, elle l'indique à votre balise personnalisée.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p>
          Vous vous demandez peut-être pourquoi Ember utilise la syntaxe `@` pour ses composants au lieu de la syntaxe normale des attributs HTML. Nous apprendrons pourquoi dans la section suivante.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Attributs HTML

Essayons d'invoquer notre composant `<Avatar>` pour l'avatar du message envoyé.

```handlebars {data-filename="app/components/sent-message/avatar.hbs"}
<Avatar @title="Avatar de Zoey" @initial="Z" />
```

Nous y sommes presque.

```handlebars {data-filename="output" data-diff="-1,+2"}
<aside class="current-user">
<aside>
  <div class="avatar" title="Avatar de Zoey">Z</div>
</aside>
```

Il nous manque juste la classe `current-user` sur l'élément HTML `<aside>`. Pour l'ajouter, nous allons spécifier l'attribut HTML `class` sur la balise `<Avatar>`.

```handlebars {data-filename="app/components/sent-message/avatar.hbs"}
<Avatar
  @title="Avatar de Zoey"
  @initial="Z"
  class="current-user"
/>
```

Le composant `avatar` doit également spécifier où placer les attributs qui ont été passés à la balise.

```handlebars {data-filename="app/components/avatar.hbs"}
<aside ...attributes>
  <div class="avatar" title={{@title}}>{{@initial}}</div>
</aside>
```

La syntaxe `...attributes` détermine où les attributs d'une balise doivent apparaître dans le _template_ du composant. N'importe quel nombre d'attributs peuvent désormais être spécifiés sur composant `avatar`, et ils se retrouveront tous sur l'élément qui a la syntaxe `...attributes`.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p>
          En général, vous devriez placer <code>...attributes</code> après tout attribut que vous spécifiez vous-mêmes afin de laisser à vos utilisateurs la possibilité de le surcharger. En effet, si <code>...attributes</code> apparaît "après" un attribut, alors il surchargera cet attribut&nbsp;; s'il apparaît "avant", ce ne sera pas le cas.
        </p>
        <p>
          Placez <code>...attributes</code> "avant" vos propres attributs seulement si vous ne souhaitez pas autoriser la balise à les surcharger. C'est plutôt inhabituel.
        </p>
        <p>
          De plus, l'attribut <code>class</code> est particulier en cela qu'il est "fusionné" avec toutes les classes existantes sur l'élément, plutôt que de les surcharger. Ça permet d'ajouter progressivement plus de classes CSS à vos composants et de les rendre globalement plus flexibles.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>
