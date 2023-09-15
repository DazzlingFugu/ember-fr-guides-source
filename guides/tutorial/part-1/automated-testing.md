Dans ce chapitre, vous utiliserez le framework de test fournit par Ember pour écrire des tests automatisés. À la fin du chapitre, vous aurez écrit une suite de tests automatisés à lancer pour vérifier que l'app fonctionne correctement&nbsp;:

<img src="/images/tutorial/part-1/automated-testing/pass-2@2x.png" alt="La suite de tests Super Rentals à la fin du chapitre" width="1024" height="512">

En chemin, vous apprendrez&nbsp;:

- À quoi servent les tests automatisés
- À écrire des tests d'acceptance
- À utiliser les générateurs de Ember CLI
- À travailler avec les _test helpers_ de Ember
- La pratique des _workflow_ de test

## À quoi servent les tests automatisés

Nous avons accompli beaucoup de choses dans les chapitres précédents&nbsp;! Résumons. Nous sommes partis d'une page blanche, nous avons ajouté quelques pages de contenu, des styles pour que le site soit joli, une image de Tomster, des liens entre nos différentes pages et, jusqu'à maintenant, tout fonctionne ensemble sans faille&nbsp;!

Mais savons-nous avec certitude que tout fonctionne _vraiment_&nbsp;? Certes, nous avons cliqué un peu partout pour confirmer que tout se comporte comme ça devrait. Mais sommes-nous sûrs d'avoir revérifié _chaque_ page, même après les changements les plus récents que nous avons apportés&nbsp;?

Après tout, la plupart d'entre nous ont déjà expérimenté (ou connaissent d'effroyables histoires sur) le "petit réglage" dans un coin de l'app qui casse _tout le reste_ par inadvertance, là où nous ne regardions pas.

Peut-être pourrions nous écrire quelque part une liste de choses à vérifier après avoir fait des changements sur le site. Mais ça deviendra sûrement incontrôlable à mesure que nous ajouterons plus de fonctionnalités à notre application. Elle va également devenir très rapidement obsolète - les tâches répétitives comme celles-ci, il est préférable de les laisser aux robots.

Hmm, des robots. En voilà une idée. Et si nous pouvions écrire cette fameuse liste et laisser l'ordinateur la vérifier pour nous&nbsp;? Je pense que nous venons d'inventer le concept de _[tests automatisés](../../../testing/)_&nbsp;! Bon, nous ne sommes peut-être pas les premiers à avoir cette idée, mais nous y avons pensé par nous-mêmes, donc nous méritons bien un peu de crédit.

## Ajouter des tests d'acceptance avec des générateurs

Si nous avons fini de nous féliciter, lançons la commande suivante dans le terminal&nbsp;:

```shell
$ ember generate acceptance-test super-rentals
installing acceptance-test
  create tests/acceptance/super-rentals-test.js
```

Dans Ember CLI, on appelle ça un générateur (_[generator](https://cli.emberjs.com/release/basic-use/cli-commands/#generatemorefiles) command_). Les générateurs créent automatiquement des fichiers en se basant sur les conventions de Ember, puis ils y écrivent le contenu par défaut approprié, de la même manière que `ember new` a créé pour nous le squelette de l'app. Ils suivent typiquement la syntaxe `ember generate <type> <name>`, où `<type>` est le type de fichier que nous voulons générer, et `<name>` comment nous voulons l'appeler.

Dans le cas présent, nous générons un [test d'acceptance]((../../../testing/test-types/#toc_application-tests)) (_acceptance test_) dont le chemin est `tests/acceptance/super-rentals-test.js`.

Les générateurs ne sont pas requis&nbsp;; nous aurions pu créé le fichier nous-mêmes, et nous aurions obtenu le même résultat. Les générateurs nous épargnent simplement beaucoup de caractères à taper. Jetez un coup d'œil au fichier de test d'acceptance et voyez par vous-même.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p>Vous voulez encore moins de caractères à taper&nbsp;? <code>ember generate ...</code> peut être raccourci <code>ember g ...</code>. Et 7 caractères de moins&nbsp;!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Écrire des tests d'acceptance

Les tests d'acceptance, aussi appelés "tests d'application", sont un des quelques types de test automatisé qu'Ember met à votre disposition. Nous apprendrons plus tard quels sont les autres types de tests, mais ce qui rend les tests d'acceptance unique, c'est qu'ils testent votre app d'un point de vue utilisateurs. Ils sont comme une version automatisée du "cliquer partout et voir si ça marche" que nous avons fait plus tôt, ce qui est exactement ce dont nous avons besoin.

Ouvrons le fichier de test généré et remplaçons le contenu par défaut avec le celui-ci&nbsp;:

```js { data-filename="tests/acceptance/super-rentals-test.js" data-diff="-2,+3,-9,-10,+11,+12,-14,+15,+16,+17,+18,+19,+20,+21" }
import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'super-rentals/tests/helpers';

module('Acceptance | super rentals', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /super-rentals', async function (assert) {
    await visit('/super-rentals');
  test('visiting /', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/super-rentals');
    assert.strictEqual(currentURL(), '/');
    assert.dom('h2').hasText('Bienvenue sur "Super Rentals" !');

    assert.dom('.jumbo a.button').hasText('À propos de nous');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });
});
```

D'abord, nous demandons au robot de test de naviguer à l'URL `/` de notre app en utilisant le _test helper_ `visit` fournit par Ember. C'est comme si nous tapions `http://localhost:4200/` dans la barre d'URL et que nous appuyions sur la touche `Entrée`. 

Parce que cette page va mettre un certain temps à charger, cette étape est dite _[async](https://developer.mozilla.org/docs/Learn/JavaScript/Asynchronous/Concepts)_ (l'abréviation de asynchrone), alors nous devons dire au robot de test d'attendre en utilisant le mot clé JavaScript `await`. De cette manière, il attendra que la page soit complètement chargée avant de passer à l'étape suivante. 

Ce comportement sera presque toujours celui dont nous avons besoin, alors nous utiliserons presque toujours `await` et `visit` ensemble. Ça s'applique aussi aux autres types d'interactions simulées, comme cliquer sur un bouton ou un lien, étant donné qu'elles prennent un certain temps de complétion. Même si parfois ces actions peuvent nous sembler imperceptiblement rapides, nous devons nous rappeler que notre robot de test, lui, a des mains encore plus rapides, comme nous le verrons dans un instant.

Après avoir naviguer sur l'URL `/` et attendu que l'app soit prête, nous vérifions que l'URL courante est bien l'URL prévue (`/`). Ici, il est possible d'utiliser le _test helper_ `currentURL` aussi bien que l'_[assertion](https://github.com/emberjs/ember-test-helpers/blob/master/API.md)_ `equal`. Voilà comment nous codons notre "liste de choses à vérifier". En spécifiant et en "affirmant" (_asserting_) comment l'app _devrait_ se comporter, nous serons alertés si notre app ne se comporte `pas` comme attendu.

Ensuite, nous confirmons que la page contient une balise `<h2>` dont le texte est `'Bienvenue sur "Super Rentals"&nbsp;!'`. En sachant que cette affirmation est vraie, nous pouvons être à peu près certains que le bon _template_ a été rendu, et sans erreur.

Puis nous recherchons un lien dont le texte est `'À propos de nous'`, localisé via le [sélecteur CSS](https://developer.mozilla.org/fr/docs/Learn/CSS/Building_blocks/Selectors) `.jumbo a.button`. C'est la même syntaxe que celle dans notre feuille de style, elle signifie "cherche à l'intérieur de la balise avec la classe `jumbo` une balise `<a>` ayant la classe `button`". Ça correspond à la structure HTML de notre template.

Une fois que l'existence de cet élément sur la page est confirmée, on demande au robot de test de cliquer sur le lien. Comme mentionné ci-dessus, il s'agit d'une interaction utilisateur, donc il faut "attendre" qu'elle soit terminée avec `await`.

Enfin, nous "affirmons" que cliquer sur le lien nous amène sur l'URL `/about`.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p>Ici, nous écrivons les tests avec un framework appelé QUnit, c'est lui qui définit les fonctions <code>module</code>, <code>test</code> et <code>assert</code>. Nous avons aussi des <em>helpers</em> additionnels, comme <code>click</code>, <code>visit</code> et <code>currentURL</code>, fournis par l'addon <code>@ember/test-helpers</code>. Vous pouvez comprendre quelle fontion vient de quelle dépendence en regardant les chemins d'<code>import</code> tout en haut du fichier. Cette connaissance vous sera utile quand vous aurez besoin de chercher de la documentation sur Internet ou de demander de l'aide.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Mettons nos tests automatisés en action en exécutant le serveur de test à l'aide de la commande `ember test --server`, ou `ember t -s` pour faire plus court. Ce serveur ce comporte plus ou moins comme le serveur de développement, mais il est lancé explicitement pour nos tests. Il se peut qu'il ouvre automatiquement une fenêtre de navigateur et vous amène sur l'UI de test. Dans le cas contraire, vous pouvez ouvrir `http://localhost:7357/` vous-mêmes.

Si vous regardez très attentivement, vous pouvez voir notre robot de test traîner un peu partout dans notre app et cliquer sur les liens&nbsp;:

<!-- TODO: make this a gif instead -->

<img src="/images/tutorial/part-1/automated-testing/pass@2x.png" alt="Tous les tests passent" width="1024" height="512">

Mais ça va très vite, clignez des yeux et vous risquez de le manquer&nbsp;! En fait, j’ai dû ralentir cette animation cent fois pour que vous puissiez la voir en action. Je vous l'ai dit, le robot est vraiment un rapide&nbsp;!

Même si j'aime regarder ce robot travailler dur, le point important ici est que le test que nous avons écrit a _réussi_, ce qui signifie que tout fonctionne exactement comme prévu et que l'UI du test est toute verte et heureuse. Si vous le souhaitez, vous pouvez accéder à `index.hbs`, supprimer le composant `<LinkTo>` et voir à quoi elle ressemble quand _un test échoue_.

<img src="/images/tutorial/part-1/automated-testing/fail@2x.png" alt="Un test en échec" width="1024" height="768">

N'oubliez pas de remettre la ligne en place quand vous avez terminé&nbsp;!

## Pratique du _workflow_ (flux de travail) de test

Mettons en pratique ce que nous avons appris en ajoutant des tests pour les autres pages&nbsp;:

```js { data-filename="tests/acceptance/super-rentals-test.js" data-diff="+19,+20,+21,+22,+23,+24,+25,+26,+27,+28,+29,+30,+31,+32,+33,+34,+35,+36,+37,+38,+39,+40,+41,+42" }
import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'super-rentals/tests/helpers';

module('Acceptance | super rentals', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/');
    assert.dom('h2').hasText('Bienvenue sur "Super Rentals" !');

    assert.dom('.jumbo a.button').hasText('À propos de nous');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });

  test('visiting /about', async function (assert) {
    await visit('/about');

    assert.strictEqual(currentURL(), '/about');
    assert.dom('h2').hasText('À propos de "Super Rentals"');

    assert.dom('.jumbo a.button').hasText('Contactez-nous');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/getting-in-touch');
  });

  test('visiting /getting-in-touch', async function (assert) {
    await visit('/getting-in-touch');

    assert.strictEqual(currentURL(), '/getting-in-touch');
    assert.dom('h2').hasText('Contactez-nous');

    assert.dom('.jumbo a.button').hasText('À propos de nous');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });
});
```

Comme pour le serveur de développement, l'UI de test devrait se rafraîchir automatiquement et ré-exécuter toute la suite de tests quand vous enregistrez le fichier. Il est recommandé de garder cette page ouverte quand vous développez votre app. De cette façon, vous serez immédiatement alerté si vous cassez quelque chose accidentellement.

<img src="/images/tutorial/part-1/automated-testing/pass-2@2x.png" alt="Les tests passent toujours une fois les nouveaux ajoutés" width="1024" height="512">

Pour le reste du tutoriel, nous ajouterons de plus en plus de tests automatisés à mesure que nous développons de nouvelles fonctionnalités. Écrire des tests est optionnel mais fortement recommandé. Les tests n'impactent pas les fonctionnalités de votre app, ils la protègent simplement des "régressions", le terme d'usage pour parler d'une "fonctionnalité cassée accidentellement".

Si vous êtes pressé, vous pouvez sauter les sections sur les tests dans la suite du tutoriel, ça ne vous empêchera pas de suivre tout le reste. Mais ne trouvez-vous pas tellement satisfaisant - _étrangement satisfaisant_ - de regarder un robot cliquer sur des trucs super, super vite&nbsp;?
