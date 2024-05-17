La dernière fonctionnalité manquante au composant `<Rental>` est la carte pour montrer l'adresse de la location, c'est ce sur quoi nous allons travailler maintenant&nbsp;:

<img src="/images/tutorial/part-1/reusable-components/three-old-mansions@2x.png" alt="L'app Super Rentals à la fin du chapitre" width="1024" height="1129" />

En ajoutant la carte, vous apprendrez à&nbsp;:

- Gérer les configurations à l'échelle de l'app
- Paramétrer des composants avec des arguments
- Accéder aux arguments d'un composant
- Interpoler des valeurs dans les <span lang="en">_templates_</span>
- Surcharger des attributs HTML avec `...attributes`
- Refactorer avec des _getters_ et l'_auto-track_
- Récupérer des valeurs JavaScript dans le contexte d'un test

## Gérer les configurations à l'échelle de l'app

Nous utiliserons l'API de [Mapbox](https://www.mapbox.com) pour générer nos locations. Vous pouvez [vous inscrire](https://www.mapbox.com/signup/) gratuitement sans entrer de données bancaires.

Mapbox fournit une [API d'images de carte statiques](https://docs.mapbox.com/api/maps/#static-images), qui sert des images représentant une carte au format PNG. Ça signifie qu'on peut générer l'URL appropriée pour les paramètres de notre choix et afficher la carte à l'aide d'une balise `<img>` standard. Voilà qui est pratique&nbsp;!

Si vous êtes curieux, vous pouvez explorer les options disponibles sur Mapbox en utilisant [le bac à sable interactif](https://docs.mapbox.com/help/interactive-tools/static-api-playground/).

Une fois votre inscription sur le service effectuée, récupérez votre [_token_ public par défaut](https://account.mapbox.com/access-tokens/) et collez-le dans `config/environment.js`&nbsp;:

```js { data-filename="config/environment.js" data-diff="+47,+48" }
'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'super-rentals',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      RAISE_ON_DEPRECATION: true,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  ENV.MAPBOX_ACCESS_TOKEN = 'paste your Mapbox access token here';

  return ENV;
};
```

Comme son nom l'indique, `config/environment.js` est utilisé pour "configurer" notre app et stocker les clés d'API comme celle-ci. On peut ensuite accéder à ces valeurs depuis d'autres parties de l'app, et elles peuvent être différentes selon l'environnement courant (`development`, `test` ou `production`).

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p>Si vous préférez, vous pouvez <a href="https://account.mapbox.com/access-tokens/">créer différents <em>token</em> d'accès à Mapbox</a> pour les différents environnements. Au minimum, chaque <em>token</em> devra avoir le scope "styles:tiles" afin d'utiliser l'API des images statiques.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Après avoir sauvegardé les changements apportés à notre fichier de configuration, nous devons redémarrer le serveur de développement pour qu'ils soient appliqués. Au contraire des fichiers que nous avons édités jusqu'ici, `config/environment.js` n'est pas rechargé automatiquement.

<!-- TODO: https://github.com/ember-cli/ember-cli/issues/8782 -->

Vous pouvez arrêter le serveur en retrouvant la fenêtre de terminal où `ember server` est en cours d'exécution et en y tapant `Ctrl + C`, c'est-à-dire en tapant la touche `C` de votre clavier pendant que vous maintenez la touche `Ctrl` enfoncée. Une fois le serveur arrêté, démarrez-le à nouveau avec la même commande `ember server`.

```shell
$ ember server
building... 

Build successful (13286ms) – Serving on http://localhost:4200/
```

## Générer un composant avec une classe de composant

Avec la clé d'API de Mapbox en place, générons un nouveau composant pour notre carte.

```shell
$ ember generate component map --with-component-class
installing component
  create app/components/map.js
  create app/components/map.hbs
installing component-test
  create tests/integration/components/map-test.js
```

Puisque tous les composants n'ont pas nécessairement de comportement associé, le générateur de composant ne génère pas de fichier JavaScript par défaut. Comme nous l'avons vu précédemment, nous pouvons toujours utiliser le générateur `component-class` pour générer le fichier JavaScript plus tard.

Cela dit, dans le cas du composant `<Map>`, nous sommes sûrs et certains d'avoir besoin d'un fichier JavaScript pour le comportement que nous avons à définir&nbsp;! Pour gagner du temps, nous passons l'option `--with-component-class` au générateur de composant pour générer tous ce dont nous avons besoin dès le départ.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p>Trop de caractère à taper&nbsp;? Utilisez <code>ember g component map -gc</code> à la place. L'option <code>-gc</code> signifie <em><strong>G</strong>limmer <strong>c</strong>omponent</em>, mais vous pouvez aussi la retenir en tant que <em><strong>g</strong>enerate <strong>c</strong>lass.</em></p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Paramétrer des composants avec des arguments

Commençons par notre fichier JavaScript&nbsp;:

```js { data-filename="app/components/map.js" data-diff="+2,-4,+5,+6,+7,+8,+9" }
import Component from '@glimmer/component';
import ENV from 'super-rentals/config/environment';

export default class MapComponent extends Component {}
export default class MapComponent extends Component {
  get token() {
    return encodeURIComponent(ENV.MAPBOX_ACCESS_TOKEN);
  }
}
```

Ici, nous importons le _token_ d'accès du fichier de configuration et nous le retournons à l'aide d'un  _[getter](https://javascript.info/property-accessors)_ (accesseur) `token`. Celui-ci nous permet "d'accéder" à notre _token_ avec `this.token` non seulement dans le corps de la classe `MapComponent`, mais aussi dans le <span lang="en">_template_</span> du composant. Il est aussi important [d'encoder l'URL](https://javascript.info/url#encoding-strings) du _token_, au cas où elle contiendrait des caractères spéciaux non sécurisés pour les URL.

## Interpoler des valeurs dans les <span lang="en">_templates_</span>

Maintenant, passons du fichier JavaScript au <span lang="en">_template_</span>&nbsp;:

```handlebars { data-filename="app/components/map.hbs" data-diff="-1,+2,+3,+4,+5,+6,+7,+8,+9" }
{{yield}}
<div class="map">
  <img
    alt="Image de la carte aux coordonnées {{@lat}},{{@lng}}"
    ...attributes
    src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/{{@lng}},{{@lat}},{{@zoom}}/{{@width}}x{{@height}}@2x?access_token={{this.token}}"
    width={{@width}} height={{@height}}
  >
</div>
```

D'abord, nous avons un élément conteneur pour des questions de style.

Ensuite, nous avons une balise `<img>` pour demander à Mapbox et afficher l'image de carte statique.

Notre <span lang="en">_template_</span> contient plusieurs valeurs qui n'existent pas encore&nbsp;: `@lat`, `@lng`, `@zoom`, `@width` (largeur) et `@height` (hauteur). Ce sont des [arguments](../../../components/component-arguments-and-html-attributes/#toc_arguments) à passer au composant `<Map>` que nous fournirons quand nous l'invoquerons.

En "paramètrant" notre composant à l'aide d'arguments, nous en faisons un composant réutilisable qui peut être invoqué depuis différentes partie de l'app et personnalisé en fonctions des besoins spécifiques du contexte. Nous avons déjà vu ce principe en action quand nous avons utilisé le composant `<LinkTo>` [plus tôt](../building-pages/)&nbsp;; nous avions spécifié un argument `@route` pour que le `<LinkTo>` sache sur quelle page naviguer.

Nous avons fourni une valeur par défaut raisonnable à l'attribut `alt`, qui se base sur les arguments `@lat` et `@lng`. Vous noterez que nous "interpolons" directement les valeurs dans celle de l'attribut `alt`. Ember va concaténer automatiquement ces valeurs interpolées dans une chaîne de caractère finale, incluant l'échappement du HTML si nécessaire.

## Surcharger des attributs HTML avec `...attributes`

Ensuite, nous utilisons `...attributes` pour permettre à l'invocateur de personnaliser la balise `<img>`, en lui passant des attributs supplémentaires comme `class`, ou encore en surchargeant le `alt` par défaut avec un autre plus spécifique et intelligible.

**Ici, l'ordre est important&nbsp;** Ember applique les attributs dans l'ordre dans lequel ils apparaissent. En assignant l'attribut `alt` par défaut en premier (c'est-à-dire avant que `...attributes` ne soit appliqué), nous donnons consciemment à l'invocateur la possibilité de fournir un `alt` plus adapté à son cas d'usage.

Puisque l'attribut `alt` passé (s'il existe) apparaîtra après celui par défaut, il surchargera sa valeur. D'un autre côté, il est important d'assigner `src`, `width` et `height` après `...attributes`, de manière à ce qu'ils ne soient pas surchargés accidentellement par l'invocateur.

L'attribut `src` interpole tous les paramètres requis dans une URL formatée pour l'[API d'images de carte statiques](https://docs.mapbox.com/api/maps/#static-images) de Mapbox, y compris le _token_ d'accès `this.token` échappé pour les URL.

Enfin, puisque nous utilisons l'image `@2x` "retina", nous devrions spécifier les attributs `width` et `height`. Sans ça, la balise `<img>` sera affichée en deux fois plus grand que prévu&nbsp;!

Nous venons d'ajouter beaucoup de comportements à un seul composant, alors écrivons quelques tests&nbsp;! En particulier, nous devrions nous assurer d'avoir une [couverture de test](../../../testing/) pour les attributs qui peuvent surcharger le HTML, ce dont nous avons discuté ci-dessus.

```js { data-filename="tests/integration/components/map-test.js" data-diff="-3,+4,+6,-11,-12,-13,+14,+15,+16,+17,+18,+19,+20,+21,-23,+24,+25,+26,+27,+28,+29,+30,-32,+33,+34,-36,-37,-38,-39,-40,-41,+42,+43,+44,+45,-47,+48,+49,+50,+51,+52,+53,+54,+55,+56,+57,+58,+59,+60,+61,+62,+63,+64,+65,+66,+67,+68,+69,+70,+71,+72,+73,+74,+75,+76,+77,+78,+79,+80,+81,+82,+83,+84,+85,+86,+87,+88,+89,+90,+91,+92,+93" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { render, find } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import ENV from 'super-rentals/config/environment';

module('Integration | Component | map', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
  test('it renders a map image for the specified parameters', async function (assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
    />`);

    await render(hbs`<Map />`);
    assert
      .dom('.map img')
      .exists()
      .hasAttribute('alt', 'Image de la carte aux coordonnées 37.7797,-122.4184')
      .hasAttribute('src')
      .hasAttribute('width', '150')
      .hasAttribute('height', '120');

    assert.dom(this.element).hasText('');
    let { src } = find('.map img');
    let token = encodeURIComponent(ENV.MAPBOX_ACCESS_TOKEN);

    // Template block usage:
    await render(hbs`
      <Map>
        template block text
      </Map>
    `);
    assert.ok(
      src.startsWith('https://api.mapbox.com/'),
      'the src starts with "https://api.mapbox.com/"'
    );

    assert.dom(this.element).hasText('template block text');
    assert.ok(
      src.includes('-122.4184,37.7797,10'),
      'the src should include the lng,lat,zoom parameter'
    );

    assert.ok(
      src.includes('150x120@2x'),
      'the src should include the width,height and @2x parameter'
    );

    assert.ok(
      src.includes(`access_token=${token}`),
      'the src should include the escaped access token'
    );
  });

  test('the default alt attribute can be overridden', async function (assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
      alt="A map of San Francisco"
    />`);

    assert.dom('.map img').hasAttribute('alt', 'A map of San Francisco');
  });

  test('the src, width and height attributes cannot be overridden', async function (assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
      src="/assets/images/teaching-tomster.png"
      width="200"
      height="300"
    />`);

    assert
      .dom('.map img')
      .hasAttribute('src', /^https:\/\/api\.mapbox\.com\//)
      .hasAttribute('width', '150')
      .hasAttribute('height', '120');
  });
});
```

Notez que le _test helper_ `hasAttribute` de [`qunit-dom`](https://github.com/simplabs/qunit-dom/blob/master/API.md) supporte les [expressions régulières](https://javascript.info/regexp-introduction). Nous en avons utilisé une pour vérifié que l'attribut `src` commence par `https://api.mapbox.com/` plutôt que de chercher une correspondance exacte avec une chaîne de caractère. Avec cette approche nous permet d'être raisonnablement confiant quant au fonctionnement du code, sans surcharger les tests de détails.

_Croisons les doigts..._ Lançons nos tests.

<img src="/images/tutorial/part-1/reusable-components/pass@2x.png" alt="Les tests passent avec le nouveau test de &lt;Map&gt;" width="1024" height="768" />

Hé, tous les tests sont passés&nbsp;! Est-ce que ça signifie pour autant que tout fonctionne en pratique&nbsp;? Vérifions en invoquant le composant `<Map>` depuis le <span lang="en">_template_</span> du composant `<Rental>`&nbsp;:

```handlebars { data-filename="app/components/rental.hbs" data-diff="+21,+22,+23,+24,+25,+26,+27,+28" }
<article class="rental">
  <Rental::Image
    src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg"
    alt="A picture of Le Manoir Ancien"
  />
  <div class="details">
    <h3>Le Manoir Ancien</h3>
    <div class="detail owner">
      <span>Propriétaire :</span> Veruca Salt
    </div>
    <div class="detail type">
      <span>Type:</span> Standalone
    </div>
    <div class="detail location">
      <span>Adresse :</span> San Francisco
    </div>
    <div class="detail bedrooms">
      <span>Nombre de chambres :</span> 15
    </div>
  </div>
  <Map
    @lat="37.7749"
    @lng="-122.4194"
    @zoom="9"
    @width="150"
    @height="150"
    alt="A map of Le Manoir Ancien"
  />
</article>
```

Hé&nbsp;! C'est une carte&nbsp;!

<img src="/images/tutorial/part-1/reusable-components/three-old-mansions@2x.png" alt="Trois Le Manoir Anciens" width="1024" height="1129" />

<!-- TODO: https://github.com/ember-cli/ember-cli/issues/8782 -->

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p>Si l'image de la carte ne charge pas, assurez-vous que vous avez le bon <code>MAPBOX_ACCESS_TOKEN</code> dans <code>config/environment.js</code>. N'oubliez pas de redémarrer les serveurs de développement et de test après avoir édité votre fichier de config &nbsp;!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Pour faire bonne mesure, ajoutons aussi une assertion dans les tests de `<Rental>` pour nous assurer que le composant `<Map>` s'affiche correctement.

```js { data-filename="tests/integration/components/rental-test.js" data-diff="+19" }
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
    assert.dom('article .map').exists();
  });
});
```

## Refactorer avec des _getters_ et l'_auto-track_

Jusqu'ici, la majeure partie de notre <span lang="en">_template_</span> `<Map>` est dévolue à l'attribut `src` de la balise `<img>`, qui est plutôt long. Une alternative serait de le calculer dans la classe JavaScript.

Depuis le corps de la classe JavaScript, nous avons accès aux arguments du composant vis l'API `this.args.*`. En utilisant ça, nous pouvons bouger la logique derrière l'URL du <span lang="en">_template_</span> à un nouveau _getter_.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p><code>this.args</code> est une API fournie par la super-classe <em>Glimmer component</em>. Vous pourriez croiser d'autres super-classes de composants, comme les composants "classic", dans les bases de codes plus anciennes. Celles-ci fournissent différentes API pour accéder aux arguments des composants depuis le code JavaScript.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

```js { data-filename="app/components/map.js" data-diff="+4,+5,+7,+8,+9,+10,+11,+12,+13,+14,+15,+16" }
import Component from '@glimmer/component';
import ENV from 'super-rentals/config/environment';

const MAPBOX_API = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static';

export default class MapComponent extends Component {
  get src() {
    let { lng, lat, width, height, zoom } = this.args;

    let coordinates = `${lng},${lat},${zoom}`;
    let dimensions = `${width}x${height}`;
    let accessToken = `access_token=${this.token}`;

    return `${MAPBOX_API}/${coordinates}/${dimensions}@2x?${accessToken}`;
  }

  get token() {
    return encodeURIComponent(ENV.MAPBOX_ACCESS_TOKEN);
  }
}
```

```handlebars { data-filename="app/components/map.hbs" data-diff="-5,+6" }
<div class="map">
  <img
    alt="Image de la carte aux coordonnées {{@lat}},{{@lng}}"
    ...attributes
    src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/{{@lng}},{{@lat}},{{@zoom}}/{{@width}}x{{@height}}@2x?access_token={{this.token}}"
    src={{this.src}}
    width={{@width}} height={{@height}}
  >
</div>
```

Voilà qui est mieux&nbsp;! Et nos tests passent toujours&nbsp;!

<img src="/images/tutorial/part-1/reusable-components/pass-2@2x.png" alt="Les tests passent après la refactorisation du getter src" width="1024" height="768" />

Notez que nous avons marqué notre _getter_ comme étant `@tracked` (suivi, tracé). Au contraire des variables d'instance, on ne peut pas "assigner" de nouvelle valeur aux _getters_ directement, donc ça ne fait pas sens pour Ember de les monitorer pour détecter des changements. 

Ceci dit, les valeurs "produites" par les _getters_, elles, peuvent changer. Dans notre cas, la valeur produite par le _getter_ `src` dépend des valeurs de `lat`, `lng`, `width`, `height` et `zoom` de `this.args`. Chaque fois que des "dépendances" sont mises à jour, on s'attend à ce que `{{this.src}}`, dans notre <span lang="en">_template_</span>, soit mis à jour aussi.

Ember fait ça automatiquement en "suivant" toute variable à laquelle il a accédé pendant le calcul d'une valeur de _getter_. Tant que les dépendances en elles-mêmes sont marquées comme `@tracked`, Ember sait exactement quand invalider et ré-afficher les <span lang="en">_templates_</span> qui peuvent contenir potentiellement des valeurs de _getter_ obsolètes ("_stale_"). Cette fonctionnalité est aussi appelées _[auto-track](../../../in-depth-topics/autotracking-in-depth/)_. Tous les arguments auxquels on peut accéder depuis `this.args.*` sont implicitement marqués comme `@tracked` par la super-classe _Glimmer component_. Puisque notre composant hérite de cette super-classe, tout fonctionne "comme par magie".

## Récupérer des valeurs JavaScript dans le contexte d'un test

Juste pour être sûrs, nous pouvons tester ce comportement&nbsp;:

```js { data-filename="tests/integration/components/map-test.js" data-diff="+51,+52,+53,+54,+55,+56,+57,+58,+59,+60,+61,+62,+63,+64,+65,+66,+67,+68,+69,+70,+71,+72,+73,+74,+75,+76,+77,+78,+79,+80,+81,+82,+83,+84,+85,+86,+87,+88,+89,+90,+91,+92,+93,+94,+95,+96,+97,+98,+99,+100,+101,+102,+103,+104,+105,+106,+107,+108,+109,+110,+111" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render, find } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import ENV from 'super-rentals/config/environment';

module('Integration | Component | map', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a map image for the specified parameters', async function (assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
    />`);

    assert
      .dom('.map img')
      .exists()
      .hasAttribute('alt', 'Image de la carte aux coordonnées 37.7797,-122.4184')
      .hasAttribute('src')
      .hasAttribute('width', '150')
      .hasAttribute('height', '120');

    let { src } = find('.map img');
    let token = encodeURIComponent(ENV.MAPBOX_ACCESS_TOKEN);

    assert.ok(
      src.startsWith('https://api.mapbox.com/'),
      'the src starts with "https://api.mapbox.com/"'
    );

    assert.ok(
      src.includes('-122.4184,37.7797,10'),
      'the src should include the lng,lat,zoom parameter'
    );

    assert.ok(
      src.includes('150x120@2x'),
      'the src should include the width,height and @2x parameter'
    );

    assert.ok(
      src.includes(`access_token=${token}`),
      'the src should include the escaped access token'
    );
  });

  test('it updates the `src` attribute when the arguments change', async function (assert) {
    this.setProperties({
      lat: 37.7749,
      lng: -122.4194,
      zoom: 10,
      width: 150,
      height: 120,
    });

    await render(hbs`<Map
      @lat={{this.lat}}
      @lng={{this.lng}}
      @zoom={{this.zoom}}
      @width={{this.width}}
      @height={{this.height}}
    />`);

    let img = find('.map img');

    assert.ok(
      img.src.includes('-122.4194,37.7749,10'),
      'the src should include the lng,lat,zoom parameter'
    );

    assert.ok(
      img.src.includes('150x120@2x'),
      'the src should include the width,height and @2x parameter'
    );

    this.setProperties({
      width: 300,
      height: 200,
      zoom: 12,
    });

    assert.ok(
      img.src.includes('-122.4194,37.7749,12'),
      'the src should include the lng,lat,zoom parameter'
    );

    assert.ok(
      img.src.includes('300x200@2x'),
      'the src should include the width,height and @2x parameter'
    );

    this.setProperties({
      lat: 47.6062,
      lng: -122.3321,
    });

    assert.ok(
      img.src.includes('-122.3321,47.6062,12'),
      'the src should include the lng,lat,zoom parameter'
    );

    assert.ok(
      img.src.includes('300x200@2x'),
      'the src should include the width,height and @2x parameter'
    );
  });

  test('the default alt attribute can be overridden', async function (assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
      alt="A map of San Francisco"
    />`);

    assert.dom('.map img').hasAttribute('alt', 'A map of San Francisco');
  });

  test('the src, width and height attributes cannot be overridden', async function (assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
      src="/assets/images/teaching-tomster.png"
      width="200"
      height="300"
    />`);

    assert
      .dom('.map img')
      .hasAttribute('src', /^https:\/\/api\.mapbox\.com\//)
      .hasAttribute('width', '150')
      .hasAttribute('height', '120');
  });
});
```

En utilisant l'API de test `this.setProperties`, nous pouvons passer des valeurs arbitraires à notre composant.

Notez qu'ici, la valeur de `this` ne réfère **pas** l'instance du composant. Nous ne lisons pas directement ni ne modifions les états internes (voilà qui serait très impoli&nbsp;!)

En fait, `this` réfère un objet particulier, le _test context_ (contexte du test), qui a accès au contenu du <span lang="en">_helper_</span> `render`. Il agit comme un "pont" qui nous permet de passer des valeurs dynamiques, sous forme d'arguments, dans l'invocation de notre composant. Ça nous permet de mettre à jour ces valeurs depuis la fonction de test selon nos besoins.

Avec tous nos tests qui passent, nous sommes prêts pour la suite&nbsp;!

<img src="/images/tutorial/part-1/reusable-components/pass-3@2x.png" alt="Tous nos tests passent" width="1024" height="768" />
