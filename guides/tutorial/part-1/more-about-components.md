Il est temps de travailler enfin sur la liste des locations&nbsp;:

<img src="/images/tutorial/part-1/more-about-components/rental-image@2x.png" alt="L'app Super Rentals à la fin du chapitre" width="1024" height="1129" />

Lors de la construction de cette liste de propriétés à louer, vous en apprendrez plus sur :

- Générer des composants
- Organiser le code avec des composants à espaces de noms (_namespaced components_)
- Transférer des attributs HTML avec `...attributes`
- Déterminer le niveau approprié de couverture de test

## Générer des composants

Commençons par créer le composant `<Rental>`. Cette fois, nous utiliserons le générateur de composant pour créer le <span lang="en">_template_</span> et le fichier de test pour nous&nbsp;:

```shell
$ ember generate component rental
installing component
  create app/components/rental.hbs
  skip app/components/rental.js
  tip to add a class, run `ember generate component-class rental`
installing component-test
  create tests/integration/components/rental-test.js
```

Le générateur crée deux nouveaux fichiers pour nous, un <span lang="en">_template_</span> de composant `app/components/rental.hbs`, et un fichier de test de composant `tests/integration/components/rental-test.js`.

Commençons par éditer le <span lang="en">_template_</span>. Dans un premier temps, écrivons en dur (_[hard-code](https://en.wikipedia.org/wiki/Hard_coding)_) les détails d'une propriété à louer, et nous les remplacerons plus tard par les vraies données venant du serveur.  

```handlebars { data-filename="app/components/rental.hbs" data-diff="-1,+2,+3,+4,+5,+6,+7,+8,+9,+10,+11,+12,+13,+14,+15,+16,+17,+18" }
{{yield}}
<article class="rental">
  <div class="details">
    <h3>Le Manoir Ancien</h3>
    <div class="detail owner">
      <span>Propriétaire :</span> Veruca Salt
    </div>
    <div class="detail type">
      <span>Type :</span> Propriété indépendante
    </div>
    <div class="detail location">
      <span>Adresse :</span> San Francisco
    </div>
    <div class="detail bedrooms">
      <span>Nombre de chambres :</span> 15
    </div>
  </div>
</article>
```

Ensuite, écrivons un test pour nous assurer que les détails sont présents. Remplaçons le contenu par défaut du test généré avec nos propres assertions, comme nous l'avons fait plus tôt pour le composant `<Jumbo>`&nbsp;:

```js { data-filename="tests/integration/components/rental-test.js" data-diff="-9,-10,-11,-12,+13,-16,-17,-18,-19,-20,-21,-22,-23,-24,-25,+26,+27,+28,+29,+30,+31" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

  test('it renders information about a rental property', async function (assert) {
    await render(hbs`<Rental />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <Rental>
        template block text
      </Rental>
    `);

    assert.dom(this.element).hasText('template block text');
    assert.dom('article').hasClass('rental');
    assert.dom('article h3').hasText('Le Manoir Ancien');
    assert.dom('article .detail.owner').includesText('Veruca Salt');
    assert.dom('article .detail.type').includesText('Propriété indépendante');
    assert.dom('article .detail.location').includesText('San Francisco');
    assert.dom('article .detail.bedrooms').includesText('15');
  });
});
```

Le test devrait passer.

<img src="/images/tutorial/part-1/more-about-components/pass@2x.png" alt="Les tests passent avec le nouveau test &lt;Rental&gt;" width="1024" height="512" />

Enfin, invoquons le composant une paire de fois dans notre <span lang="en">_template_</span> d'index pour alimenter la page.

```js { data-filename="app/templates/index.hbs" data-diff="+6,+7,+8,+9,+10,+11,+12,+13" }
<Jumbo>
  <h2>Bienvenue sur "Super Rentals" !</h2>
  <p>Nous espérons que vous trouverez l'endroit parfait où séjourner.</p>
  <LinkTo @route="about" class="button">À propos de nous</LinkTo>
</Jumbo>

<div class="rentals">
  <ul class="results">
    <li><Rental /></li>
    <li><Rental /></li>
    <li><Rental /></li>
  </ul>
</div>
```

Avec ça, nous devrions voir le composant `<Rental>` afficher notre Le Manoir Ancien trois fois sur la page&nbsp;:

<img src="/images/tutorial/part-1/more-about-components/three-old-mansions@2x.png" alt="Trois Le Manoir Anciens" width="1024" height="1129" />

Voilà qui est déjà plutôt convainquant&nbsp;; pas mal pour juste un tout petit peu de travail&nbsp;!

## Organiser le code avec des composants à espaces de noms (_namespaced components_)

Ensuite, ajoutons l'image pour la propriété à louer. Utilisons à nouveau le générateur de composant&nbsp;:

```shell
$ ember generate component rental/image
installing component
  create app/components/rental/image.hbs
  skip app/components/rental/image.js
  tip to add a class, run `ember generate component-class rental/image`
installing component-test
  create tests/integration/components/rental/image-test.js
```

Cette fois, nous avons un `/` dans le nom du composant. Par conséquent, le composant est créé au chemin `app/components/rental/image.hbs`, et peut être invoqué en tant que `<Rental::Image>`.

Les composants comme ceux-ci sont appelés composants à [espace de nom](https://fr.wikipedia.org/wiki/Espace_de_noms) (_namespaced components_). Les espaces de nom permettent d'organiser les composants par dossiers selon leur fonction. C'est complètement optionnel, les composants à espaces de noms n'ont aucune particularité.

## Transférer des attributs HTML avec `...attributes`

Éditons le template du composant&nbsp;:

```handlebars { data-filename="app/components/rental/image.hbs" data-diff="-1,+2,+3,+4" }
{{yield}}
<div class="image">
  <img ...attributes>
</div>
```

Plutôt que de coder en dur les valeurs pour les attributs `src` et `alt` sur la balise `<img>`, nous avons opté pour le mot-clé `...attributes`, parfois appelé la syntaxe _["splattributes"](../../../components/component-arguments-and-html-attributes/#toc_html-attributes)_. Cette syntaxe permet de passer des attributs HTML arbitraires quand lors de l'invocation du composant, comme ceci&nbsp;:

```handlebars { data-filename="app/components/rental.hbs" data-diff="+2,+3,+4,+5" }
<article class="rental">
  <Rental::Image
    src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg"
    alt="Photo de la propriété Le Manoir Ancien"
  />
  <div class="details">
    <h3>Le Manoir Ancien</h3>
    <div class="detail owner">
      <span>Propriétaire :</span> Veruca Salt
    </div>
    <div class="detail type">
      <span>Type :</span> Propriété indépendante
    </div>
    <div class="detail location">
      <span>Adresse :</span> San Francisco
    </div>
    <div class="detail bedrooms">
      <span>Nombre de chambres :</span> 15
    </div>
  </div>
</article>
```

Nous spécifions des attributs `src` et `alt` ici, qui seront passés au composant et attachés à l'élément sur lequel `...attributes` est appliqué dans le template. Vous pouvez voir cette fonctionnalité comme étant similaire à `{{yield}}`, mais spécifiquement pour les attributs HTML plutôt que pour afficher du contenu. En fait, nous l'avons déjà utilisés [plus tôt](../building-pages/) quand nous avons passé un attribut `class` à `<LinkTo>`.

<img src="/images/tutorial/part-1/more-about-components/rental-image@2x.png" alt="Le composant &lt;Rental::Image&gt; en action" width="1024" height="1129" />

<!-- spell ignore -->
Avec cette approche, notre composant `<Rental::Image>` n'est pas couplé à une location spécifique sur le site. Bien entendu, le code en dur existe toujours (nous l'avons simplement déplacé sur le composant `<Rental>`), mais nous nous occuperons de ce problème bientôt. Nous limiterons le code en dur au composant `<Rental>` afin de rendre plus facile le nettoyage du code quand nous récupéreront de vraies données.

De manière générale, c'est une bonne idée d'ajouter `...attributes` à l'élément principale de votre composant. Ça permettra un maximum de flexibilité, car l'élément qui invoque le composant pourrait avoir besoin de lui passer des classes de style ou des attributs ARIA pour améliorer l'accessibilité.

Écrivons un test pour notre nouveau composant&nbsp;!

```js { data-filename="tests/integration/components/rental/image-test.js" data-diff="-9,-10,-11,-12,-13,-14,-15,-16,-17,+18,-20,-21,-22,+23,+24,+25,+26,-29,+30,+31,+32,+33,+34" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental/image', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Rental::Image />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
  test('it renders the given image', async function (assert) {
    await render(hbs`
      <Rental::Image>
        bloc de texte
      </Rental::Image>
      <Rental::Image
        src="/assets/images/teaching-tomster.png"
        alt="Professeur Tomster"
      />
    `);

    assert.dom(this.element).hasText('bloc de texte');
    assert
      .dom('.image img')
      .exists()
      .hasAttribute('src', '/assets/images/teaching-tomster.png')
      .hasAttribute('alt', 'Professeur Tomster');
  });
});
```

## Déterminer le niveau approprié de couverture de test

Enfin, nous devrions aussi mettre à jour les tests du composant `<Rental>` pour confirmer que `<Rental::Image>` est invoqué avec succès.

```js { data-filename="tests/integration/components/rental-test.js" data-diff="+18" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders information about a rental property', async function (assert) {
    await render(hbs`<Rental />`);

    assert.dom('article').hasClass('rental');
    assert.dom('article h3').hasText('Le Manoir Ancien');
    assert.dom('article .detail.owner').includesText('Veruca Salt');
    assert.dom('article .detail.type').includesText('Propriété indépendante');
    assert.dom('article .detail.location').includesText('San Francisco');
    assert.dom('article .detail.bedrooms').includesText('15');
    assert.dom('article .image').exists();
  });
});
```

Comme nous avons déjà très bien testé le composant `<Rental::Image>` en lui-même, nous pouvons omettre les détails ici et écrire le minimum d'assertions. De cette façon, nous n'aurons pas à mettre _aussi_ à jour les tests de `<Rental>` si jamais nous faisons des changements dans `<Rental::Image>`.

<img src="/images/tutorial/part-1/more-about-components/pass-2@2x.png" alt="Les tests passent avec le nouveau test &lt;Rental::Image&gt;" width="1024" height="512" />
