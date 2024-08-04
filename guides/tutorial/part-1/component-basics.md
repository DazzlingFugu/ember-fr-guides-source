<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-1/04-component-basics.md -->

Dans ce chapitre, vous ferez une [refactorisation](../../../components/introducing-components/#toc_breaking-it-into-pieces) de vos <span lang="en">_templates_</span> existants pour y utiliser des composants. Vous ajouterez aussi une barre de navigation à l'échelle du site:

<img src="/images/tutorial/part-1/component-basics/index-with-nav@2x.png" alt="L'app Super Rentals à la fin du chapitre" width="1024" height="314">

En faisant ça, vous apprendrez à&nbsp;:
- Invoquer des composants
- Passer du contenu aux composants
- Retourner du contenu avec le mot-clé `{{yield}}`
- Écrire des tests de composant
- Utiliser le <span lang="en">_template_</span> de l'application et son `{{outlet}}`

## Extraire du balisage dans des composants

Dans un [chapitre précédent](../building-pages/), une courte introduction aux [composants (Components)](../../../components/introducing-components/) accompagnait l'usage de `<LinkTo>` pour connecter nos pages entre elles. Pour résumer, nous avons dit que les composants sont une manière, avec Ember, de créer des "balises personnalisées" en supplément des balises HTML natives du navigateur. À présent, nous allons créer nos propres composants&nbsp;!

Pendant le développement d'une app, il est très courant de réutiliser les mêmes éléments d'_UI_ à travers les différentes parties de l'app. Par exemple, jusqu'ici, nous avons écrit la même entête "jumbo" dans chacune de nos trois pages. Sur chaque page, nous avons travaillé à réécrire la même structure de base&nbsp;:

```html
<div class="jumbo">
  <div class="right tomster"></div>
  <!-- page specific content -->
</div>
```

Étant donné que ce code est très court, dupliquer cette structure n'apparaît pas nécessairement comme un problème. Cependant, si nos _designers_ nous demandaient de modifier l'entête, nous aurions à retrouver et mettre à jour chaque copie de ce code. À mesure que notre app prendra de l'ampleur, le problème en prendra aussi. 

Les composants sont la solution parfaite. Dans sa forme la plus basique, un composant est juste un morceau de <span lang="en">_template_</span> auquel on peut faire référence par nom. Commençons par créer un nouveau fichier `app/components/jumbo.hbs` avec le balisage de l'entête "jumbo"&nbsp;:

```handlebars { data-filename="app/components/jumbo.hbs" }
<div class="jumbo">
  <div class="right tomster"></div>
  {{yield}}
</div>
```

Voilà, nous avons créé notre premier composant&nbsp;! Nous pouvons maintenant "l'invoquer" dans notre app, en utilisant `<Jumbo>` comme nom de balise.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p>Rappelez-vous, quand on invoque des composants, il faut mettre une majuscule à leur nom pour qu'Ember sache que ce ne sont pas des éléments HTML classiques. Le <em>template</em> <code>jumbo.hbs</code> correspond à la balise <code>&#x3C;Jumbo></code>, tout comme <code>super-awesome.hbs</code> correspondrait à <code>&#x3C;SuperAwesome></code>.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Passer du contenu à des composants avec `{{yield}}`

Quand un composant est invoqué, Ember va remplacer la balise du composant avec le contenu trouvé dans le <span lang="en">_template_</span> du composant. Tout comme avec les balises HTML classiques, il est courant de passer du [contenu](../../../components/block-content/) aux composants, par exemple `<Jumbo>some content</Jumbo>`. On s'accorde cette possibilité en utilisant le mot-clé `{{yield}}`, qui sera remplacé par le contenu passé au composant.

Essayons ça en éditant le <span lang="en">_template_</span> d'index&nbsp;:

```js { data-filename="app/templates/index.hbs" data-diff="-1,-2,+3,-7,+8" }
<div class="jumbo">
  <div class="right tomster"></div>
<Jumbo>
  <h2>Bienvenue sur "Super Rentals" !</h2>
  <p>Nous espérons que vous trouverez l'endroit parfait où séjourner.</p>
  <LinkTo @route="about" class="button">À propos de nous</LinkTo>
</div>
</Jumbo>
```

## Refactorer du code existant

Après avoir enregistré les changements, votre page devrait se rafraîchir automatiquement et, voilà... rien n'a changé&nbsp;? Eh bien c'est exactement ce que nous voulions cette fois&nbsp;! Nous avons bien [refactoré](../../../components/introducing-components/#toc_breaking-components-down-further) notre <span lang="en">_template_</span> d'index pour qu'il utilise le composant `<Jumbo>`, et tout continue à fonctionner comme prévu. Et les tests passent toujours&nbsp;!

<img src="/images/tutorial/part-1/component-basics/index@2x.png" alt="Page d'index – rien n'a changé" width="1024" height="250">

<img src="/images/tutorial/part-1/component-basics/pass@2x.png" alt="Les tests passent toujours après la refactorisation" width="1024" height="512">

Faisons la même chose pour les deux autre pages&nbsp;:

```js { data-filename="app/templates/about.hbs" data-diff="-1,-2,+3,-11,+12" }
<div class="jumbo">
  <div class="right tomster"></div>
<Jumbo>
  <h2>À propos de "Super Rentals"</h2>
  <p>
    Le site web "Super Rentals" est un projet très sympa créé pour explorer Ember.
    En réalisant un site de location de propriétés, nous pouvons imaginer voyager
    ET apprendre à construire des applications Ember en même temps.
  </p>
  <LinkTo @route="contact" class="button">Contactez-nous</LinkTo>
</div>
</Jumbo>
```

```js { data-filename="app/templates/contact.hbs" data-diff="-1,-2,+3,-19,+20" }
<div class="jumbo">
  <div class="right tomster"></div>
<Jumbo>
  <h2>Contactez-nous</h2>
  <p>
    Les représentants de "Super Rentals" aimeraient vous aider à<br>
    choisir une destination ou répondre à toutes vos questions.
  </p>
  <address>
    Siège social de Super Rentals
    <p>
      1212 Test Address Avenue<br>
      Testington, OR 97233
    </p>
    <a href="tel:503.555.1212">+1 (503) 555-1212</a><br>
    <a href="mailto:superrentalsrep@emberjs.com">superrentalsrep@emberjs.com</a>
  </address>
  <LinkTo @route="about" class="button">À propos</LinkTo>
</div>
</Jumbo>
```

Après avoir enregistré, tout devrait rester exactement comme avant, et tous les tests devraient continuer à passer. Chouette&nbsp;!

<img src="/images/tutorial/part-1/component-basics/about@2x.png" alt="Page d'à propos – rien n'a changé" width="1024" height="274">

<img src="/images/tutorial/part-1/component-basics/contact@2x.png" alt="Page de contact – rien n'a changé" width="1024" height="444">

<img src="/images/tutorial/part-1/component-basics/pass-2@2x.png" alt="Une nouvelle fois, les tests passent toujours après la refactorisation" width="1024" height="512">

Bien que dans le cas présent, ça n'ait pas tant raccourci le code, [encapsuler](../../../components/component-arguments-and-html-attributes/) l'implémentation de l'entête "jumbo" dans son propre composant rend le <span lang="en">_template_</span> légèrement plus facile à lire, ça permet au lecteur de ce concentrer sur les éléments uniques à une page donnée. De plus, si nous avons besoin de faire un changement dans l'entête, nous n'aurons à le faire qu'à un seul endroit. 

## Écrire des tests de composant

Avant de passer au composant suivant, écrivons un test automatisé pour notre composant `<Jumbo>`. Exécutez la commande suivante dans votre terminal&nbsp;:

```shell
$ ember generate component-test jumbo
installing component-test
  create tests/integration/components/jumbo-test.js
```

Ici, nous utilisons le générateur pour générer un [test de composant](../../../testing/testing-components/), ou _rendering test_ (test d'affichage). Ceux-ci permettent d'afficher et tester un seul composant à la fois. En cela, ils diffèrent des tests d'acceptance que nous avons écrits plus tôt, et qui eux permettent d'afficher et naviguer dans des pages entières de contenu.

Remplaçons le code par défaut qui a été généré pour nous avec notre propre test&nbsp;:

```js { data-filename="tests/integration/components/jumbo-test.js" data-diff="-9,-10,-11,+12,+13,-15,-16,-17,-18,-19,-20,-21,-22,-23,-24,-25,-26,+27,+28,+29" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | jumbo', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
  test('it renders the content inside a jumbo header with a tomster', async function (assert) {
    await render(hbs`<Jumbo>Bonjour tout le monde</Jumbo>`);

    await render(hbs`<Jumbo />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <Jumbo>
        template block text
      </Jumbo>
    `);

    assert.dom(this.element).hasText('template block text');
    assert.dom('.jumbo').exists();
    assert.dom('.jumbo').hasText('Bonjour tout le monde');
    assert.dom('.jumbo .tomster').exists();
  });
});
```

Au début du test, plutôt que de naviguer vers une URL, on commence par afficher notre composant `<Jumbo>` sur la page de test. Pouvoir faire ça est très utile, car autrement, de nombreuses configurations et interactions seraient nécessaires juste pour atteindre la page où le composant est utilisé. Les tests de composant permettent de sauter toutes ces étapes et de se concentrer exclusivement sur le test du composant isolé.

Tout comme `visit` et `click`, que nous avons utilisés plus tôt, `render` est aussi une instruction asynchrone, qui va de paire avec le mot-clé `await`. En dehors de ça, le reste du test est très similaire aux tests d'acceptance écrits dans le chapitre précédent. Assurez-vous que le test passe en vérifiant l'_UI_ des tests dans votre navigateur.

<img src="/images/tutorial/part-1/component-basics/pass-3@2x.png" alt="Les tests passent toujours avec notre test de composant" width="1024" height="512">

Voilà un moment que nous refactorons le code existant, changeons un peu de sujet et implémentons une nouvelle fonctionnalité&nbsp;: la barre de navigation du site.

Créons un composant `<NavBar>` dans `app/components/nav-bar.hbs`&nbsp;:

```handlebars { data-filename="app/components/nav-bar.hbs" }
<nav class="menu">
  <LinkTo @route="index" class="menu-index">
    <h1>SuperRentals</h1>
  </LinkTo>
  <div class="links">
    <LinkTo @route="about" class="menu-about">
      À propos
    </LinkTo>
    <LinkTo @route="contact" class="menu-contact">
      Contact
    </LinkTo>
  </div>
</nav>
```

Ensuite, ajoutons notre composant `<NavBar>` en haut de chaque page&nbsp;:

```js { data-filename="app/templates/about.hbs" data-diff="+1" }
<NavBar />
<Jumbo>
  <h2>À propos de "Super Rentals"</h2>
  <p>
    Le site web "Super Rentals" est un projet très sympa créé pour explorer Ember.
    En réalisant un site de location de propriétés, nous pouvons imaginer voyager
    ET apprendre à construire des applications Ember en même temps.
  </p>
  <LinkTo @route="contact" class="button">Contactez-nous</LinkTo>
</Jumbo>
```

```js { data-filename="app/templates/contact.hbs" data-diff="+1" }
<NavBar />
<Jumbo>
  <h2>Contactez-nous</h2>
  <p>
    Les représentants de "Super Rentals" aimeraient vous aider à<br>
    choisir une destination ou répondre à toutes vos questions.
  </p>
  <address>
    Siège social de Super Rentals
    <p>
      1212 Test Address Avenue<br>
      Testington, OR 97233
    </p>
    <a href="tel:503.555.1212">+1 (503) 555-1212</a><br>
    <a href="mailto:superrentalsrep@emberjs.com">superrentalsrep@emberjs.com</a>
  </address>
  <LinkTo @route="about" class="button">À propos</LinkTo>
</Jumbo>
```

```js { data-filename="app/templates/index.hbs" data-diff="+1" }
<NavBar />
<Jumbo>
  <h2>Bienvenue sur "Super Rentals"&nbsp;!</h2>
  <p>Nous espérons que vous trouverez l'endroit parfait où séjourner.</p>
  <LinkTo @route="about" class="button">À propos de nous</LinkTo>
</Jumbo>
```

Voilà, nous avons créé un autre composant!

<img src="/images/tutorial/part-1/component-basics/index-with-nav@2x.png" alt="Page d'indew avec la navigation" width="1024" height="314">

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p><code>&#x3C;NavBar /></code> est un raccourci pour <code>&#x3C;NavBar>&#x3C;/NavBar></code>. Les balises de composant doivent être explicitement fermées, même quand vous ne leur passez aucun contenu. Puisque c'est un cas très commun, Ember fournit un raccourci de fermeture automatique (<em>self-closing</em>) pour vous épargner quelques caractères&nbsp;!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Tout semble bon dans le navigateur, mais comme chacun sait, on n'est jamais trop prudent. Alors écrivons quelques tests&nbsp;!

Mais quel genre de test&nbsp;? Nous pourrions écrire un test de composant pour la `<NavBar>` en elle-même, comme nous l'avons fait pour le composant `<Jumbo>`. Cela dit, puisque la fonction de la `<NavBar>` est de "naviguer" dans l'app, il ne ferait pas sens de tester ce composant spécifique en isolation. Alors, retournons plutôt écrire quelques tests d'acceptance&nbsp;!

```js { data-filename="tests/acceptance/super-rentals-test.js" data-diff="+12,+13,+26,+27,+40,+41,+49,+50,+51,+52,+53,+54,+55,+56,+57,+58,+59,+60,+61,+62,+63,+64,+65,+66" }
import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'super-rentals/tests/helpers';

module('Acceptance | super rentals', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('Bienvenue sur "Super Rentals" !');

    assert.dom('.jumbo a.button').hasText('À propos de nous');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });

  test('visiting /about', async function (assert) {
    await visit('/about');

    assert.strictEqual(currentURL(), '/about');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('À propos de "Super Rentals"');

    assert.dom('.jumbo a.button').hasText('Contactez-nous');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/getting-in-touch');
  });

  test('visiting /getting-in-touch', async function (assert) {
    await visit('/getting-in-touch');

    assert.strictEqual(currentURL(), '/getting-in-touch');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('Contactez-nous');

    assert.dom('.jumbo a.button').hasText('À propos');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });

  test('navigating using the nav-bar', async function (assert) {
    await visit('/');

    assert.dom('nav').exists();
    assert.dom('nav a.menu-index').hasText('SuperRentals');
    assert.dom('nav a.menu-about').hasText('À propos');
    assert.dom('nav a.menu-contact').hasText('Contact');

    await click('nav a.menu-about');
    assert.strictEqual(currentURL(), '/about');

    await click('nav a.menu-contact');
    assert.strictEqual(currentURL(), '/getting-in-touch');

    await click('nav a.menu-index');
    assert.strictEqual(currentURL(), '/');
  });
});
```

Nous avons mis à jour les tests existants pour nous assurer que l'élément `<nav>` existe sur chaque page. C'est important pour l'accessibilité, car les lecteurs d'écran vont utiliser cet élément pour fournir la navigation. Ensuite, nous avons ajouté un nouveau test qui vérifie le comportement des liens de la `<NavBar>`.

À ce stade, tous les tests devraient passer&nbsp;!

<img src="/images/tutorial/part-1/component-basics/pass-4@2x.png" alt="Les tests passent toujours avec nos tests de &lt;NavBar&gt;" width="1024" height="512">

## Utiliser le <span lang="en">_template_</span> de l'application et son `{{outlet}}`

Avant de passer à la fonctionnalité suivante, il y a encore une chose que nous pourrions "nettoyer". Puisque la `<NavBar>` sert la navigation à l'échelle du site, il est nécessaire de l'afficher sur _toutes_ les pages de l'app. Jusqu'ici, nous avons ajouté le composant manuellement sur chaque page. Cette approche est sujette aux erreurs, nous pourrions facilement oublier de l'ajouter la prochaine fois que nous créons une nouvelle page.

<!-- spell ignore -->
Nous pouvons résoudre ce problème en déplaçant la `<NavBar>` dans un <span lang="en">_template_</span> particulier appelé `application.hbs`. Vous vous rappelez peut-être qu'il a été généré pour nous lors de la création de l'app, mais nous l'avions supprimé. À présent, il est temps de le ramener à la vie&nbsp;!

Ce <span lang="en">_template_</span> est spécial car il n'a pas sa propre URL et on ne peut pas y naviguer directement. Il sert plutôt à définir une mise en page commune, partagée par toutes les pages de votre app. C'est l'endroit idéal pour placer les éléments d'_UI_ à l'échelle du site, comme une barre de navigation ou un pied de page (_footer_).

Pendant que nous y sommes, ajoutons aussi un élément _container_ (conteneur) qui encapsule toute la page, c'est une requête de notre _designer_ pour des questions de style.

```handlebars { data-filename="app/templates/application.hbs" }
<div class="container">
  <NavBar />
  <div class="body">
    {{outlet}}
  </div>
</div>
```

```js { data-filename="app/templates/index.hbs" data-diff="-1" }
<NavBar />
<Jumbo>
  <h2>Bienvenue sur "Super Rentals" !</h2>
  <p>Nous espérons que vous trouverez l'endroit parfait où séjourner.</p>
  <LinkTo @route="about" class="button">À propos de nous</LinkTo>
</Jumbo>
```

```js { data-filename="app/templates/contact.hbs" data-diff="-1" }
<NavBar />
<Jumbo>
  <h2>Contactez-nous</h2>
  <p>
    Les représentants de "Super Rentals" aimeraient vous aider à<br>
    choisir une destination ou répondre à toutes vos questions.
  </p>
  <address>
    Siège social de Super Rentals
    <p>
      1212 Test Address Avenue<br>
      Testington, OR 97233
    </p>
    <a href="tel:503.555.1212">+1 (503) 555-1212</a><br>
    <a href="mailto:superrentalsrep@emberjs.com">superrentalsrep@emberjs.com</a>
  </address>
  <LinkTo @route="about" class="button">À propos</LinkTo>
</Jumbo>
```

```js { data-filename="app/templates/about.hbs" data-diff="-1" }
<NavBar />
<Jumbo>
  <h2>À propos de "Super Rentals"</h2>
  <p>
    Le site web "Super Rentals" est un projet très sympa créé pour explorer Ember.
    En réalisant un site de location de propriétés, nous pouvons imaginer voyager
    ET apprendre à construire des applications Ember en même temps.
  </p>
  <LinkTo @route="contact" class="button">Contactez-nous</LinkTo>
</Jumbo>
```

Le mot-clé `{{outlet}}` désigne l'endroit où les pages de notre site doivent s'afficher, un peu comme le mot-clé `{{yield}}` que nous avons vu [plus tôt](#toc_passing-content-to-components-with-yield).

Voilà qui est mieux&nbsp;! Nous pouvons exécuter notre suite de test, qui confirme que tout continue à fonctionner après notre refactorisation. Nous sommes prêts à passer à la fonctionnalité suivante&nbsp;!

<img src="/images/tutorial/part-1/component-basics/pass-5@2x.png" alt="Les tests passent toujours avec {{outlet}}" width="1024" height="512">
