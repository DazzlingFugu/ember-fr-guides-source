Si vous pouvez accomplir beaucoup de choses en Ember simplement à l’aide de la mise en page HTML, vous aurez tout de même besoin de JavaScript pour rendre votre application interactive.

Commençons avec un exemple simple, un composant compteur. Quand l’utilisateur presse le bouton `+1`, le compteur augmente de 1. Quand l’utilisateur presse le bouton `-1`, le compteur descend de 1.

D’abord, écrivons le HTML.

```handlebars {data-filename="app/components/counter.hbs"}
<p>0</p>

<button type=“button”>+1</button>
<button type=“button”>-1</button>
```

## Propriétés _tracked_

Pour faire fonctionner ça, nous devrons cesser de coder le compteur en dur, et nous devrons brancher les boutons.

```js {data-filename="app/components/counter.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class CounterComponent extends Component {
  @tracked count = 0 ;
}
```

Plusieurs choses se passent ici, mais la partie la plus importante est `@tracked count = 0`. Cette ligne crée une valeur dynamique appelée `count`, que vous pouvez afficher dans le _template_ à la place de la valeur écrite en dur.

```handlebars {data-filename="app/components/counter.hbs » data-diff="-1,+2"}
<p>0</p>
<p>{{this.count}}</p>

<button type=“button”>+1</button>
<button type=“button”>-1</button>
```

Quand on utilise `{{this.count}}` dans le _template_ du composant, on réfère la propriété définie dans la classe JavaScript.

L’affichage qui en résulte reste le même, mais le `0` vient maintenant bien du JavaScript, et après un peu de travail, nous pourrons changer cette valeur à l’aide des boutons.

## Modifieurs HTML et actions

Ensuite, branchons les boutons. Nous voulons que `this.count` augmente de 1 quand l’utilisateur presse `+1`, et descende de 1 quand l’utilisateur presse `-1`.

Pour attacher un gestionnaire d’événement (_event handler_) à une balise HTML, on utilise le modifieur (_modifier_) HTML `on`. Les modifieurs HTML sont une syntaxe Ember permettant d’attacher de la logique à une balise.

```handlebars {data-filename="app/components/counter.hbs » data-diff="-3,+4,-5,+6"}
<p>{{this.count}}</p>

<button type=“button”>+1</button>
<button type=“button” {{on “click” this.increment}}>+1</button>
<button type=“button”>-1</button>
<button type=“button” {{on “click” this.decrement}}>-1</button>
```

Pour que ces gestionnaires d’événement puissent faire quoi que ce soit, nous devons définir des “actions” dans le composant JavaScript. Une action est une méthode JavaScript qui peut être appelée depuis un _template_.

```js {data-filename="app/components/counter.js » data-diff="+3,+8,+9,+10,+11,+13,+14,+15,+16"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CounterComponent extends Component {
  @tracked count = 0 ;

  @action
  increment() {
    this.count = this.count + 1 ;
  }

  @action
  decrement() {
    this.count = this.count – 1 ;
  }
}
```

Maintenant, quand on clique sur les boutons `+1` et `-1`, le compteur affiché change.

## Passer des arguments à une action

Notre compteur possède deux actions, `increment` (augmenter) et `decrement` (baisser). Ces deux actions font peu ou prou la même chose, la seule différence est que `increment` ajoute `+1` au compteur, tandis que `decrement` y ajoute `-1`.

D’abord, transformons nos méthodes `increment` et `decrement` en une unique méthode qui prend un paramètre le nombre à ajouter.

```js {data-filename="app/components/counter.js » data-diff="+8,+9,+10,+11,-12,-13,-14,-15,-17,-18,-19,-20"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CounterComponent extends Component {
  @tracked count = 0 ;

  @action
  change(amount) {
    this.count = this.count + amount ;
  }
  @action
  increment() {
    this.count = this.count + 1 ;
  }

  @action
  decrement() {
    this.count = this.count – 1 ;
  }
}
```

Ensuite, mettons à jour le _template_ pour faire du gestionnaire de clic une fonction passant un nombre (par exemple, 1 et -1) en argument. Pour ça, utilisons le _helper_ `fn`.

```handlebars {data-filename="app/components/counter.hbs » data-diff="-3,+4,-5,+6"}
<p>{{this.count}}</p>

<button type=“button” {{on “click” this.increment}}>+1</button>
<button type=“button” {{on “click” (fn this.change 1)}}>+1</button>
<button type=“button” {{on “click” this.decrement}}>-1</button>
<button type=“button” {{on “click” (fn this.change -1)}}>-1</button>
```

<div class=“cta”>
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit…</div>
      <div class="cta-note-message">
        Un gestionnaire d’événement prend comme second argument une fonction. Quand cette fonction ne prend aucun argument, alors on peut la passer directement, comme en JavaScript. En revanche, si elle doit prendre des arguments, vous pouvez construire une fonction en ligne en utilisant la syntaxe<code>fn</code>.
      </div>
    </div>
    <img src="/images/mascots/zoey.png » role=“presentation” alt="">
  </div>
</div>

## Valeurs calculées

Mettons que nous voulons ajouter à notre app un bouton qui double le compteur courant. Chaque fois qu’on presse le bouton, le facteur par lequel on multiplie le compteur est aussi doublé.

Considérant ce que nous avons déjà appris, nous aurons besoin&nbsp;:

— D’un `multiple`, un état qui représente le facteur par lequel multiplier `count`.
— D’une action pour doubler le `multiple`.
— D’un bouton dans le _template_ qui appelle cette action.
— D’un moyen de multiplier le `count` par `multiple` et d’afficher le résultat dans le _template_.

Commençons par ce que nous savons déjà. Ajoutons la _tracked property_ `multiple` et une action appelée `double` qui double le `multiple`.

```js {data-filename="app/components/counter.js » data-diff="+7,+9,+10,+11,+12"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CounterComponent extends Component {
  @tracked count = 0 ;
  @tracked multiple = 1 ;

  @action
  double() {
    this.multiple = this.multiple * 2 ;
  }

  @action
  change(amount) {
    this.count = this.count + amount ;
  }
}
```

Ensuite, modifions le _template_ pour appeler l’action `double`. Nous ajouterons également `this.multiple` aux résultats affichés pour confirmer que le bouton fonctionne.

```handlebars {data-filename="app/components/counter.hbs » data-diff="+2,+7"}
<p>{{this.count}}</p>
<p>× {{this.multiple}}</p>

<button type=“button” {{on “click” (fn this.change 1)}}>+1</button>
<button type=“button” {{on “click” (fn this.change -1)}}>-1</button>

<button type=“button” {{on “click” this.double}}>Doubler</button>
```

Pour afficher le compteur final dans le _template_, nous utiliserons un [_getter_ (accesseur) JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Functions/get)

```js {data-filename="app/components/counter.js » data-diff="+9,+10,+11"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CounterComponent extends Component {
  @tracked count = 0 ;
  @tracked multiple = 1 ;

  get total() {
    return this.count * this.multiple ;
  }

  @action
  double() {
    this.multiple = this.multiple * 2 ;
  }

  @action
  change(amount) {
    this.count = this.count + amount ;
  }
}
```

**Le _getter_ n’a pas besoin d’annotation particulière.** À compter du moment où vous avez marqué les propriétés susceptibles de changer avec `@tracked`, vous pouvez utilisez JavaScript pour calculer de nouvelles valeurs à partir de ces propriétés.

Nous pouvons maintenant mettre à jour le _template_ afin d’utiliser la propriété `total`&nbsp;:

```handlebars {data-filename="app/components/counter.hbs » data-diff="+3"}
<p>{{this.count}}</p>
<p>× {{this.multiple}}</p>
<p>= {{this.total}}</p>

<button type=“button” {{on “click” (fn this.change 1)}}>+1</button>
<button type=“button” {{on “click” (fn this.change -1)}}>-1</button>

<button type=“button” {{on “click” this.double}}>Doubler</button>
```

Et c’est terminé&nbsp;! Si nous cliquons sur les boutons +1, -1, ou Doubler dans n’importe quel ordre, nous verrons les trois compteurs se mettre parfaitement à jour.

<div class=“cta”>
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit…</div>
      <div class="cta-note-message">
        <p>
          Vous pourriez être tentés de faire de <code>total</code> d'une <em>tracked property</em> et de la mettre à jour dans le corps des actions <code>double</code> et <code>change</code>, mais ce type d’approche « assignation forcée » crée beaucoup de bugs. Que se passerait-il si vous implémentiez de nouveaux moyens de mettre à jour <code>multiple</code> ou <code>amount</code> mais que vous oubliiez de passer le <code>total</code>&nbsp;?
        </p>
        <p>
          Quand vous utilisez des _getters_ et des fonctions pour “dériver” l’état dont vous avez besoin, vous bénéficiez des avantages de la programmation “déclarative”. La programmation déclarative consiste à décrire de “quoi” vous avez besoin plutôt que “comment” l’obtenir, ce qui réduit le nombre d’emplacements où introduire des erreurs.
        </p>
        <p>
          Créer un _getter_ <code>total</code> qui calcule le total à partir des propriétés <code>amount</code> et <code>multiple</code> est plus “déclaratif” que d’assigner une valeur à <code>total</code> à tous les emplacements qui peuvent l’affecter. (Si vous aviez changé le <code>total</code> directement, vous auriez pris l’approche “impérative”.)
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png » role=“presentation” alt="">
  </div>
</div>

## Combiner arguments et états

Plutôt que de donner au composant lui-même la responsabilité du multiple, permettons qu’il soit passé en argument.

```handlebars {data-filename="app/components/double-it.hbs"}
<Counter @multiple={{this.multiple}} />

<button type=“button” {{on “click” this.double}}>Doubler</button>
```

```js {data-filename="app/components/double-it.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class DoubleItComponent extends Component {
  @tracked multiple = 1 ;

  @action
  double() {
    this.multiple = this.multiple * 2 ;
  }
}
```

Dans le composant `Counter`, plutôt que de traquer le `multiple` en interne, on le lit dans les arguments. Dans le _template_, on réfère l’argument avec `@multiple`.

```handlebars {data-filename="app/components/counter.hbs"}
<p>{{this.count}}</p>
<p>× {{@multiple}}</p>
<p>= {{this.total}}</p>

<button type=“button” {{on “click” (fn this.change 1)}}>+1</button>
<button type=“button” {{on “click” (fn this.change -1)}}>-1</button>
```

Dans les _templates_, on accède aux arguments en les préfixant du symbole `@` (dans le cas présent, `@multiple`). Pour calculer `this.total`, nous aurons besoin d’accéder à l’argument `multiple` dans le JavaScript.

Pour accéder aux arguments d’un composant depuis le JavaScript, on les préfixe avec `this.args.`.

Dans le JavaScript, on écrit donc `this.args.multiple`.

```js {data-filename="app/components/counter.js » data-diff="-7,-10,+11"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CounterComponent extends Component {
  @tracked count = 0 ;
  @tracked multiple = 1 ;

  get total() {
    return this.count * this.multiple ;
    return this.count * this.args.multiple ;
  }

  @action
  change(amount) {
    this.count = this.count + amount ;
  }
}
```

Le `total` est désormais calculé en multipliant un « état local » (`this.count`) avec un argument (`this.args.multiple`). Vous pouvez associer état locaux et arguments comme ça vous arrange, et ça permet de casser facilement un composant en morceaux plus petits.

## Combiner arguments et actions

Vous pouvez aussi passer des actions aux composants via leurs arguments, ce qui permet aux composants enfants de communiquer avec leur parent et de les notifier de leurs changements d’état. Par exemple, si nous voulions réajouter le bouton “Doubler” que nous avions précédemment, nous pourrions utiliser une action passée via les arguments.

```handlebars {data-filename="app/components/counter.hbs"}
<p>{{this.count}}</p>
<p>× {{@multiple}}</p>
<p>= {{this.total}}</p>

<button type=“button” {{on “click” (fn this.change 1)}}>+1</button>
<button type=“button” {{on “click” (fn this.change -1)}}>-1</button>

<button type=“button” {{on “click” this.double}}>Doubler</button>
```

```js {data-filename="app/components/counter.js » data-diff="+9,+17,+18,+19,+20"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CounterComponent extends Component {
  @tracked count = 0 ;

  get total() {
    return this.count * this.args.multiple ;
  }

  @action
  change(amount) {
    this.count = this.count + amount ;
  }

  @action
  double() {
    this.args.updateMultiple(this.args.multiple * 2) ;
  }
}
```

Maintenant, le compteur appelle l’argument `updateMultiple` (supposé être une fonction) avec la nouvelle valeur de `multiple`, et le composant parent peut mettre à jour le multiple.

```handlebars {data-filename="app/components/double-it.hbs"}
<Counter @multiple={{this.multiple}} @updateMultiple={{this.updateMultiple}} />
```

```js {data-filename="app/components/double-it.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class DoubleItComponent extends Component {
  @tracked multiple = 1 ;

  @action
  updateMultiple(newMultiple) {
    this.multiple = newMultiple ;
  }
}
```

## En savoir plus

Vous créerez très souvent des composants dans une app. Établir tôt des _patterns_ (« motifs d’implémentation ») peut vous aider à réduire le nombre de bugs ou de problèmes imprévus. Vous en apprendrez plus dans le chapitre [Patterns liés aux Composants](../../in-depth-topics/patterns-for-components/).

Une action est une méthode JavaScript que vous pouvez appeler depuis un _template_. Découvrez les patterns recommandés pour l’usage des actions dans le chapitre [Patterns liés aux Actions](../../in-depth-topics/patterns-for-actions/).

<!-- eof – needed for pages that end in a code block -->
