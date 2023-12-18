Dans ce chapitre, vous allez ajouter l'interactivité à la page pour permettre à l'utilisateur de cliquer sur une image pour l'agrandir ou la rétrécir&nbsp;:

<!-- TODO: make this a gif instead -->

<img src="/images/tutorial/part-1/interactive-components/rental-image-default@2x.png" alt="L'app Super Rentals à la fin du chapitre (taille de l'image par défaut)" width="1024" height="1129" />

<img src="/images/tutorial/part-1/interactive-components/rental-image-large@2x.png" alt="L'app Super Rentals à la fin du chapitre (grande taille d'image)" width="1024" height="1500" />

En faisant ça, vous apprendrez à&nbsp;:

- Ajouter un comportement aux composants à l'aide de classes
- Accéder aux états de l'instance à partir des <span lang="en">_templates_</span>
- Gérer l'état avec les _tracked properties_
- Utiliser des syntaxes conditionnelles dans les <span lang="en">_templates_</span>
- Répondre à l'interaction de l'utilisateur avec des actions
- Invoquer des modificateurs d'élément (_modifiers_)
- Tester les interactions utilisateur

## Ajouter un comportement aux composants à l'aide de classes

Jusqu'à présent, tous les composants que nous avons écrits sont purement "présentationnels"&nbsp;: ce sont simplement des extraits de balisage réutilisables. C'est plutôt chouette&nbsp;! Mais avec Ember, les composants peuvent faire tellement plus.

<!-- spell ignore -->
Parfois, vous voulez associer un "comportement" à vos composants pour leur faire faire des choses plus intéressantes. Par exemple, `<LinkTo>` peut répondre aux clics en changeant l'URL et en nous faisant naviguer vers une autre page.

C'est exactement ce que nous allons faire&nbsp;! Nous allons implémenter la fonctionnalité "Agrandir / Réduire", qui permettra à nos utilisateurs de cliquer sur l'image d'une propriété pour voir une version plus grande, et cliquer à nouveau dessus pour revenir à la version plus petite.

En d'autres termes, nous voulons un moyen de faire passer l'image d'un état à l'autre. Pour cela, le composant doit être capable de stocker deux états possibles, et de savoir dans quel état l'image se trouve actuellement.

Pour répondre précisément à ce problème, Ember nous permet, si besoin, d'associer du code JavaScript à un composant. Ajoutons un fichier JavaScript pour notre composant `<Rental::Image>` en exécutant le générateur de classe de composant (`component-class`)&nbsp;:

```shell
$ ember generate component-class rental/image
installing component-class
  create app/components/rental/image.js
```

Ceci a généré un fichier JavaScript `app/components/rental/image.js` avec le même nom que le <span lang="en">_template_</span> de notre composant. Il contient une classe JavaScript héritant de `@glimmer/component`.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p><code>@glimmer/component</code>, ou <em><a href="../../../upgrading/current-edition/glimmer-components/">Glimmer component</a></em>, est l'une des classes de composant qu'il est possible d'utiliser. C'est un excellent point de départ pour ajouter des comportements à vos composants. Dans ce tutoriel, nous utiliserons exclusivement <em>Glimmer component</em>.</p>
        <p>De manière générale, les <em>Glimmer components</em> devraient être utilisés dès que possible. Cependant, vous pourriez aussi voir des <code>@ember/components</code>, ou des <em><a href="https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/">classic components</a></em> dans des apps plus anciennes. Vous pouvez les distinguer en regardant leur chemin d'import (qui est utile pour rechercher la documentation correspondante, étant donné qu'ils ont des APIs différentes et incompatibles).</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Ember va créer une "instance" de la classe à chaque fois que le composant est invoqué. On peut utiliser cette instance pour stocker l'état&nbsp;:

```js { data-filename="app/components/rental/image.js" data-diff="-3,+4,+5,+6,+7,+8,+9" }
import Component from '@glimmer/component';

export default class RentalImageComponent extends Component {}
export default class RentalImageComponent extends Component {
  constructor(...args) {
    super(...args);
    this.isLarge = false;
  }
}
```

Ici dans le "constructeur du composant" (_constructor_), nous "initialisons" une "variable d'instance" `this.isLarge` avec la valeur `false`, car c'est l'état par défaut que nous voulons pour notre composant.

## Accéder aux états de l'instance à partir des <span lang="en">_templates_</span>

Mettons à jour notre <span lang="en">_template_</span> pour utiliser l'état que nous venons d'ajouter&nbsp;:

```handlebars { data-filename="app/components/rental/image.hbs" data-diff="-1,-2,-3,+4,+5,+6,+7,+8,+9,+10,+11,+12,+13,+14" }
<div class="image">
  <img ...attributes>
</div>
{{#if this.isLarge}}
  <div class="image large">
    <img ...attributes>
    <small>Réduire</small>
  </div>
{{else}}
  <div class="image">
    <img ...attributes>
    <small>Agrandir</small>
  </div>
{{/if}}
```

Dans le template, nous avons accès aux variables d'instance du composant. Les syntaxes [conditionnelles](../../../components/conditional-content/) `{{#if ...}}...{{else}}...{{/if}}` nous permettent d'afficher un contenu différent en fonction d'une condition (dans le cas présent, la valeur de la variable d'instance `this.isLarge`). En combinant ces deux fonctionnalités, nous pouvons afficher la version réduite ou agrandie de l'image.

Nous pouvons vérifier que ça fonctionne en changeant temporairement la valeur initiale dans notre fichier JavaScript `app/components/rental/image.js`. En écrivant `this.isLarge = true;` dans le constructeur, nous devrions voir la version agrandie de l'image dans le navigateur. Cool&nbsp;!

<img src="/images/tutorial/part-1/interactive-components/is-large-true@2x.png" alt="&lt;Rental::Image&gt; avec this.isLarge initialisé à true" width="1024" height="1500" />

Une fois que nous avons testé ça, nous pouvons remettre `this.isLarge` à `false`.

Comme l'initialisation d'une variable d'instance dans le constructeur est une conception très commune, il existe une syntaxe bien plus concise pour l'écrire&nbsp;:

```js { data-filename="app/components/rental/image.js" data-diff="-4,-5,-6,-7,+8" }
import Component from '@glimmer/component';

export default class RentalImageComponent extends Component {
  constructor(...args) {
    super(...args);
    this.isLarge = false;
  }
  isLarge = false;
}
```

Ce code fait exactement la même chose qu'avant, mais c'est bien plus court à taper&nbsp;!

Bien sûr, nos utilisateurs ne peuvent pas éditer le code source, alors il faut leur fournir un moyen de changer la taille de l'image depuis le navigateur. Plus précisément, nous voulons changer la valeur de `this.isLarge` chaque fois que l'utilisateur clique sur le composant.

## Gérer l'état avec les _tracked properties_

Modifions notre classe pour ajouter une [méthode](../../../in-depth-topics/native-classes-in-depth/#toc_methods) permettant de changer la taille&nbsp;:

```js { data-filename="app/components/rental/image.js" data-diff="+2,+3,-6,+7,+8,+9,+10,+11" }
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RentalImageComponent extends Component {
  isLarge = false;
  @tracked isLarge = false;

  @action toggleSize() {
    this.isLarge = !this.isLarge;
  }
}
```

Là, nous avons fait une paire de changements, alors détaillons-les un par un.

D'abord, nous avons ajouté le [décorateur](../../../in-depth-topics/native-classes-in-depth/#toc_decorators) `@tracked` à la variable d'instance `isLarge`. Cette annotation indique à Ember de monitorer cette variable pour la mettre à jour. À chaque fois que la valeur de la variable change, Ember va automatiquement réafficher tous les <span lang="en">_templates_</span> qui dépendent de cette valeur.

Dans notre cas, à chaque fois que nous assignons une nouvelle valeur à `this.isLarge`, l'annotation `@tracked` déclenche la réévaluation de la conditionnelle `{{#if this.isLarge}}` par Ember, et l'affichage alterne entre les deux [blocs](../../../components/conditional-content/#toc_block-if) en fonction du résultat.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p>Ne vous inquiétez pas&nbsp;! Si vous référencez une variable dans le <em>template</em> mais que vous oubliez d'ajouter le décorateur <code>@tracked</code>, alors vous obtenez, en mode développement, une erreur utile quand vous changez sa valeur&nbsp;!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Répondre à l'interaction de l'utilisateur avec des actions

Ensuite nous avons ajouté une méthode _`toggleSize`_ (alterner entre les deux tailles) à notre classe, qui change `this.isLarge` à l'opposé de son état courant (`false` devient `true` et `true` devient `false`). 

Enfin, nous avons ajouté le décorateur `@action` à notre méthode. Il indique à Ember que nous avons l'intention d'appeler cette méthode depuis le <span lang="en">_template_</span>. Sans ça, la méthode ne fonctionnera pas correctement en tant que fonction de _callback_ (dans le cas présent, un _click handler_ pour gérer le clic).

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p>Si vous oubliez d'ajouter le décorateur <code>@action</code>, vous obtiendrez aussi, en mode développement, une erreur utile quand vous cliquez sur le bouton&nbsp;!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Avec ça, il est temps de câbler notre <span lang="en">_template_</span>:

```handlebars { data-filename="app/components/rental/image.hbs" data-diff="-2,+3,-6,+7,-9,+10,-13,+14" }
{{#if this.isLarge}}
  <div class="image large">
  <button type="button" class="image large" {{on "click" this.toggleSize}}>
    <img ...attributes>
    <small>Réduire</small>
  </div>
  </button>
{{else}}
  <div class="image">
  <button type="button" class="image" {{on "click" this.toggleSize}}>
    <img ...attributes>
    <small>Agrandir</small>
  </div>
  </button>
{{/if}}
```

Ici, nous avons changé deux choses.

D'abord, puisque nous voulions rendre notre composant interactif, nous avons remplacé la balise `<div>` qui le contient par `<button>` (c'est important pour des questions d'accessibilité). En utilisant ainsi la balise sémantique correcte, nous obtenons du même coup la fonctionnalité de focus et l'interaction clavier.

Ensuite, nous utilisons le [_modifier_](../../../components/template-lifecycle-dom-and-modifiers/#toc_event-handlers) `{{on}}` pour attacher `this.toggleSize` en tant que _click handler_ (gestionnaire de clic) sur le bouton.

En faisant ça, nous avons créé notre premier composant "interactif". Allez-y, essayez-le dans le navigateur&nbsp;!

<!-- TODO: make this a gif instead -->

<img src="/images/tutorial/part-1/interactive-components/rental-image-default@2x.png" alt="&lt;Rental::Image&gt; (taille par défaut)" width="1024" height="1129" />

<img src="/images/tutorial/part-1/interactive-components/rental-image-large@2x.png" alt="&lt;Rental::Image&gt; (grande taille)" width="1024" height="1500" />

## Tester les interactions utilisateur

Enfin, écrivons un test pour ce nouveau comportement&nbsp;:

```js { data-filename="tests/integration/components/rental/image-test.js" data-diff="-3,+4,+24,+25,+26,+27,+28,+29,+30,+31,+32,+33,+34,+35,+36,+37,+38,+39,+40,+41,+42,+43,+44,+45,+46,+47" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental/image', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the given image', async function (assert) {
    await render(hbs`
      <Rental::Image
        src="/assets/images/teaching-tomster.png"
        alt="Teaching Tomster"
      />
    `);

    assert
      .dom('.image img')
      .exists()
      .hasAttribute('src', '/assets/images/teaching-tomster.png')
      .hasAttribute('alt', 'Teaching Tomster');
  });

  test('clicking on the component toggles its size', async function (assert) {
    await render(hbs`
      <Rental::Image
        src="/assets/images/teaching-tomster.png"
        alt="Teaching Tomster"
      />
    `);

    assert.dom('button.image').exists();

    assert.dom('.image').doesNotHaveClass('large');
    assert.dom('.image small').hasText('Agrandir');

    await click('button.image');

    assert.dom('.image').hasClass('large');
    assert.dom('.image small').hasText('Réduire');

    await click('button.image');

    assert.dom('.image').doesNotHaveClass('large');
    assert.dom('.image small').hasText('Agrandir');
  });
});
```

<img src="/images/tutorial/part-1/interactive-components/pass@2x.png" alt="Les tests passent avec le nouveau test &lt;Rental::Image&gt;" width="1024" height="512" />

Nettoyons notre <span lang="en">_template_</span> avant de continuer. Nous y avons introduit beaucoup de duplication quand nous avons ajouté la conditionnelle. Si on regarde de près, les seules différences entre les deux blocs sont&nbsp;:

1. La présence de la classe CSS `"large"` sur la balise `<button>`.
2. Les textes "Agrandir" et "Réduire".

Ces changements sont profondément enfouis dans la grande quantité de code dupliqué. Nous pouvons réduire la duplication en utilisant plutôt l'[expression `{{if}}`](../../../components/conditional-content/#toc_inline-if)&nbsp;:

```handlebars { data-filename="app/components/rental/image.hbs" data-diff="-1,-2,-3,+4,+5,+6,-8,-9,-10,-11,+12,-14,-15,+16,+17" }
{{#if this.isLarge}}
  <button type="button" class="image large" {{on "click" this.toggleSize}}>
    <img ...attributes>
<button type="button" class="image {{if this.isLarge "large"}}" {{on "click" this.toggleSize}}>
  <img ...attributes>
  {{#if this.isLarge}}
    <small>Réduire</small>
  </button>
{{else}}
  <button type="button" class="image" {{on "click" this.toggleSize}}>
    <img ...attributes>
  {{else}}
    <small>Agrandir</small>
  </button>
{{/if}}
  {{/if}}
</button>
```

En tant qu'expression, `{{if}}` prend deux arguments. Le premier argument est la condition. Le second argument est l'expression qui doit être évaluée quand la condition est vraie.

De manière optionnelle, `{{if}}` peut prendre un troisième argument indiquant l'expression qui doit être évaluée  quand la condition est fausse. Ça signifie que nous pourrions réécrire le <span lang="en">_label_</span> du bouton comme suit&nbsp;:

```handlebars { data-filename="app/components/rental/image.hbs" data-diff="-3,-4,-5,-6,-7,+8" }
<button type="button" class="image {{if this.isLarge "large"}}" {{on "click" this.toggleSize}}>
  <img ...attributes>
  {{#if this.isLarge}}
    <small>Réduire</small>
  {{else}}
    <small>Agrandir</small>
  {{/if}}
  <small>{{if this.isLarge "Réduire" "Agrandir"}}</small>
</button>
```

Trouver cette version du code plus claire est en grande partie une question de goût. En tout cas, nous avons significativement réduit la duplication de code, et fait ressortir les éléments de logique importants du reste.

Lancez la suite de test une dernière fois pour confirmer que notre refactorisation n'a rien cassé accidentellement, et nous serons prêt pour le prochain défi&nbsp;!

<img src="/images/tutorial/part-1/interactive-components/pass-2@2x.png" alt="Les tests passent toujours après la refactorisation" width="1024" height="512" />
