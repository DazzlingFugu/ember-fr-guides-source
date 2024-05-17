Lorsque que vous créez un composant accessible, la première chose et la plus importante de toutes est que le composant rende un HTML valide.

Les spécifications HTML et ARIA ont été rédigées de manière à fonctionner ensembles. La sémantique HTML propose le contexte _nécessaire_ pour les lecteurs d'écrans.

Les navigateurs ont implémenté les spécifications de manière à proposer cette fonctionnalité de façon transparente. Par exemple, dans cet échantillon de code&nbsp;:

```html
<button type="submit">Valider le formulaire</button>
```

Voici ce qui sera fourni par le navigateur, que nous aurions eu à fournir nous-mêmes le cas échéant&nbsp;:

- les interactions clavier sur des éléments interactifs (ex. utiliser la touche 'ENTRÉE' pour activer l'élément bouton `<button>`)
- un nom lisible par une machine
- un endroit dans l'ordre de l'onglet `TAB` de la page
- le rôle intrinsèque d'un bouton

Si l'élément interactif avait été écrit d'une autre manière, telle que&nbsp;:

```html
<div>Valider le formulaire</div>
```

Alors nous aurions dû écrire le code suivant&nbsp;:

- ajouter le rôle de bouton (`role="button"`)
- ajouter le bouton dans l'ordre de l'onglet (`tabindex="0"`)
- ajouter la fonctionnalité du clavier (une fonction JavaScript pour activer l'action associée quand la touche `ENTRÉE` est pressée)

<!-- spell ignore -->
Ceci n'est qu'un exemple d'utilisation des intégrations HTML pour améliorer l'accessibilité et réduire le besoin de personnaliser le code. Pour en savoir plus&nbsp;: <span lang="en">["Just use a button"](https://developer.paciellogroup.com/blog/2011/04/html5-accessibility-chops-just-use-a-button/)</span>.

## Gestion du focus dans les composants

Le focus est une manière parmi tant d'autres pour un composant de communiquer avec les lecteurs d'écrans.

Par exemple quand vous pressez l'onglet d'une page, ou cliquez dans un champ de formulaire, une bordure bleue va le plus souvent apparaître autour de l'élément. C'est en partie ce que l'on peut appeler le focus. Nous pouvons utiliser JavaScript pour contrôler le focus dans nos applications, permettant la navigation au clavier et l'utilisation des lecteurs d'écrans.

<!-- spell ignore -->
Cet article est une bonne introduction pour en apprendre plus sur le focus&nbsp;: <span lang="en">[Keyboard accessibility](https://webaim.org/techniques/keyboard/)</span>.

Voici quelques astuces pour bien commencer&nbsp;:

- <!-- spell ignore --> Il y a une différence entre le mode navigateur et le mode focus dans un lecteur d'écrans- En savoir plus: <span lang="en">["Focus Please"](https://codepen.io/melsumner/live/ZJeYoP)</span>.
- Le focus doit retourner d'où il provient, par exemple, si un élément bouton `<button>` ouvre une modale, le focus devrait ensuite retourner sur le même élément bouton quand cette modale est fermée.
- On notera que `role="presentation"` ou `aria-hidden="true"` ne devraient pas être utilisés sur un élément qui peut être ciblé.

## Nom accessible

Tous les éléments interactifs doivent avoir un nom accessible. Mais qu'est ce que ça signifie exactement&nbsp;?

<!-- spell ignore -->
Ça signifie que le code fourni doit être lisible par d'autres machines (par exemple, les technologies d'assistance comme les lecteurs d'écrans). Voici de la documentation pour comprendre comment ce nom accessible est déterminé: <span lang="en">[Accessible Name and Description Computation](https://www.w3.org/TR/accname-1.1/)</span>.


Cependant, les méthodes les plus communes pour fournir des noms accessibles peuvent être examinées dans la section suivante.

### Ajouter un label à une saisie d'élément

Chaque élément de saisie `<input>` doit être associé avec un élément `<label>`. Pour cela, l'élément `<input>` doit avoir un attribut `id` de la même valeur que l'attribut `for` de l'élément `<label>`, par exemple&nbsp;:

![Séparer les éléments input et label à l'aide d'une correspondance établie entre les attributs for et id](/images/accessibility/component-considerations/input-for-id.png)

```html
<label for="input-name">Nom :</label>
<input id="input-name" name="name" value="" type="text" />
```

Il est également possible d'envelopper l'élément `<label>` autour de l'élément `<input />`&nbsp;:

![Un sous-élément input imbriqué dans un élément parent label sans attribut for ni id](/images/accessibility/component-considerations/input-nested.png)

```html
<label>
  Nom :
  <input name="name" value="" type="text" />
</label>
```

En revanche, cette option peut rendre un peu plus difficile l'application des styles, de ce fait il est préférable de tester les deux approches avant de choisir la meilleure.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey dit...</div>
      <div class="cta-note-message">
Pour en savoir plus sur les configurations accessibles avec Ember&nbsp;: <a href="https://emberjs-1.gitbook.io/ember-component-patterns/form-components/input">ember-component-patterns article on Input Fields</a>.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>
