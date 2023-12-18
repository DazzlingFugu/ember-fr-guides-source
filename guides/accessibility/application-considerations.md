Dans cette partie, vous allez en apprendre plus sur les différentes configurations et librairies ayant un effet sur l'accessibilité globale d'une application.

## L'attribut `lang`

Déclarer la langue d'une page HTML permet aux utilisateurs de mieux comprendre son contenu.

> Les outils d'accessibilités ainsi que les navigateurs Web sont capables d'avoir un rendu plus précis quand la langue d'une page est définie. Les lecteurs d'écrans peuvent ainsi affiner leurs prononciations. Les navigateurs Web peuvent correctement afficher les caractères et les scripts. Les lecteurs vidéos peuvent afficher les bons sous-titres. Tout ceci permet aux utilisateurs ayant un handicap, de mieux comprendre le contenu d'une page Web.
> <!-- spell ignore --><span lang="en">[WCAG Success Criterion 3.1.1: Intent](https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html#intent)</span>

La langue principale doit être définie au niveau de l'attribut `lang` de l'élément `<html>`. Lors de la création d'une nouvelle application, vous pouvez utiliser l'option `--lang` de la commande `ember new` afin d'en définir sa langue principale.

```bash
ember new mon-app --lang fr
```

Cette commande va créer une application ayant le français définit comme langue principale, sur l'attribut `lang` de l'élément `<html>`.

Pour une application existante, on peut éditer le fichier `index.html` ou installer l'addon [ember-intl](https://github.com/ember-intl/ember-intl).

L'attribut `lang` de l'élément `html` ne peut pas contenir plusieurs valeurs. Si un élément de la page contient du texte dans une langue différente que la langue principale, vous pouvez lui définir son propre attribut `lang`.

![Par exemple, l'élément HTML peut définir "es" en tant que langue principale et un paragraphe peut quant à lui avoir "en" en tant que langue définie](/images/accessibility/application-considerations/lang.png)

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
        <p>
        Pour en apprendre plus l'attribut lang et comment l'utiliser: <a href="https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/lang">https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/lang</a>. Vous ne savez pas quelle valeur utiliser pour l'attribut lang ? Jetez un coup d'œil à cet <a href="https://r12a.github.io/app-subtags/">outil de recherche</a>.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Les addons d'accessibilité

Tout addon fournissant des composants visuels à une application devrait être évalué en termes d'accessibilité avant d'être utilisé.

Il existe déjà des addons Ember pouvant vous aider à rendre une application plus accessible.
Chaque addon doit être choisi en fonction des bénéfices qu'il apporte et de son utilité. Il est possible que dans certains cas, il soit préférable de réimplémenter vous-même une partie des fonctionnalités d'un addon, directement dans votre application.

Voici quelques exemples d'addons axés sur l'accessibilité créés par des membres de la communauté Ember&nbsp;:

- [ember-a11y-landmarks](https://github.com/ember-a11y/ember-a11y-landmarks) - Addon facilitant l'utilisation des rôles sémantiques HTML afin d'améliorer l'accessibilité.
- [ember-component-focus](https://github.com/ember-a11y/ember-component-focus) - Une <span lang="en">_mixin_</span> pour ajouter des méthodes à vos composants Ember afin de vous aider à gérer l'élément ayant le focus.
- [ember-steps](https://github.com/rwjblue/ember-steps) - Addon de création de <span lang="en">_wizard_</span>, de navigation avec onglets, et plus...
- [ember-page-title](https://github.com/tim-evans/ember-page-title) - Addon de gestion des titres de page pour applications Ember.js
- [ember-self-focused](https://github.com/linkedin/self-focused/tree/master/packages/ember-self-focused) - Bouge le focus sur le corps d'une page au changement de route.
- [ember-keyboard](https://github.com/patience-tema-baron/ember-keyboard) - Addon pour simplifier la gestion des événements clavier.
- [ember-a11y-testing](https://github.com/ember-a11y/ember-a11y-testing) - Pour ajouter facilement des tests d'accessibilité dans une suite de tests Ember.
- [a11y-announcer](https://github.com/ember-a11y/a11y-announcer) - Addon permettant d'annoncer les changements de route côté lecteur d'écran.
- [ember-template-lint](https://github.com/ember-template-lint/ember-template-lint) - <span lang="en">_Linter_</span> pour les <span lang="en">_templates_</span> Ember.
  ![Aperçu d'un compte rendu de <span lang="en">_lint_</span> d'un <span lang="en">_template_</span>](/images/accessibility/application-considerations/template-lint.png)

<!-- spell ignore -->
Bien qu'il y ait beaucoup de notions à prendre en compte et à connaître, voici un aide-mémoire pour vous aider à commencer&nbsp;: <span lang="en">[Accessibility Cheat Sheet](https://moritzgiessmann.de/accessibility-cheatsheet/)</span>
