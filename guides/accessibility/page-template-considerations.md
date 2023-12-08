Quand on regarde la page d'une application, il y a quelques aspects fondamentaux auxquels il faut penser en amont&nbsp;:

- Le titre de page
- Les liens pour sauter la navigation (_skip navigation links_)
- La gestion du focus

## Titre de page

Chaque page (au sens "ce qui est rendu pour une URL unique") devrait avoir un titre. Ce titre devrait être unique à cette page et devrait refléter avec précision ce qu'elle fait.

Considérons le format suivant&nbsp;:

`Titre de page unique - Titre du site`

<img width="675px" title="Exemple de titre de page" alt="Une représentation visuelle du titre de page dans l'onglet du navigateur" src="/images/accessibility/page-template-considerations/page-title.png"/>

Notons que le titre de page unique est placé en premier. C'est parce qu'il s'agit de l'information la plus importante dans le contexte courant. Puisqu'un utilisateur utilisant un lecteur d'écran peut interrompre celui-ci comme il le souhaite, il est plus efficace d'avoir le titre de page unique en premier, tout en fournissant les informations additionnelles si besoin.

Un moyen simple d'ajouter des titres de page est d'utiliser le _helper_ `page-title` fournit par l'addon [ember-page-title](https://github.com/ember-cli/ember-page-title), installé par défaut dans les nouvelles applications. Ce _helper_ peut être utilisé pour définir le titre de page depuis n'importe quel _template_.

Par exemple, si nous avons une route "_posts_" (messages), le titre de page peut être défini comme suit&nbsp;:

```handlebars {data-filename=app/routes/posts.hbs}
{{page-title "Messages - Titre du site"}}

{{outlet}}
```

Maintenant, étendons cet exemple à une route "_post_" (message) qui est imbriquée dans la route "_posts_". Nous pourrions définir le titre de page comme ceci&nbsp;:

```handlebars {data-filename=app/routes/posts/post.hbs}
{{page-title (concat @model.title " - Titre du site")}}

<h1>{{@model.title}}</h1>
```

Quand vos besoins deviennent plus complexes, les addons suivants permettent une gestion plus dynamique et facile à maintenir des titres de page&nbsp;:

- [ember-cli-head](https://github.com/ronco/ember-cli-head)
- [ember-cli-document-title](https://github.com/kimroen/ember-cli-document-title)

<!-- spell ignore -->
Pour découvrir plus d'addons d'ajout / gestion de contenu dans le `<head>` d'une page, jetez un œil à la catégorie <span lang="en">[header-content](https://emberobserver.com/categories/header-content)</span> sur Ember Observer.

Vous pouvez vous assurer que les titres de page sont générés correctement en écrivant une assertion sur la valeur de `document.title` dans vos tests&nbsp;:

```javascript {data-filename=tests/acceptance/posts-test.js}
import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'my-app-name/tests/helpers';

module('Acceptance | posts', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /posts', async function(assert) {
    await visit('/posts');
    assert.equal(document.title, 'Messages - Titre du site');
  });
});
```

## Liens pour sauter la navigation

Un lien pour sauter la navigation (_skip navigation link_ ou _skip link_) est une fonctionnalité utile aux utilisateurs qui souhaitent passer le contenu répété sur plusieurs pages (par exemple, l'entête du site). C'est particulièrement bienvenu pour les utilisateurs qui s'aident de technologies d'assistance, qui naviguent dans le contenu du site de manière plus linéaire, mais c'est aussi utile pour les utilisateurs avancés qui préfèrent naviguer sur le site uniquement avec le clavier.

<img width="675px" title="Exemple où la navigation est sautée" alt="Une représentation visuelle de la manière dont le lien pour sauter la navigation fonctionne dans le navigateur" src="/images/accessibility/page-template-considerations/skip-main-content.png"/>

Pour implémenter un tel lien dans une application, il faut ajouter un élément d'ancrage le plus tôt possible après l'ouverture de l'élément `<body>`, et le lier au début de la zone de contenu principal de la page.

Pour lire davantage sur les _skip links_, visitez [la documentation MDN (non traduite)](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML#skip_links).

## Gestion du focus

Aucun framework d'application monopage (_single-page_) ne fournit par défaut une gestion des niveaux de routes appropriée pour les technologies d'assistance. Ceci est principalement dû à la manière dont `pushState` fonctionne, et au manque d'une gestion d'événement pour les frameworks JavaScript qui permettrait de notifier les technologies d'assistance que le contenu de la page a changé. Ça signifie _aussi_ que le focus reste inchangé lors de la navigation d'une route à l'autre, ce qui veut dire que, dans certains cas, il est entièrement perdu (si l'élément qui avait le focus n'est plus présent sur la nouvelle page).

La plupart des frameworks proposent des mécaniques pour ajouter les fonctionnalités manquantes à une application. Avec Ember.js, une tentative de remédier à ces deux lacunes existe via la [RFC 433](https://github.com/emberjs/rfcs/pull/433)&nbsp;; d'ici là, quelques addons fournissent une aide pour gérer le focus au niveau de la vue de l'application. À vous d'évaluer toutes les options pour déterminer la plus appropriée à votre cas d'usage&nbsp;:

- [ember-a11y](https://github.com/ember-a11y/ember-a11y)
- [ember-self-focused](https://github.com/linkedin/self-focused/tree/master/packages/ember-self-focused)
- [ember-a11y-refocus](https://github.com/MelSumner/ember-a11y-refocus)
