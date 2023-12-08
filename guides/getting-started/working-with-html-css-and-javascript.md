<!-- spell ignore -->
Ember est un framework pour construire des applications qui tournent dans le navigateur, ce qui signifie qu'elles sont développées avec HTML, CSS et JavaScript. Il est donc très utile d'être à l'aise avec ces technologies. Si vous vous retrouvez bloqué ou rencontrez des incertitudes durant votre apprentissage de Ember, revenez à cette page et tentez de voir s'il y a, derrière vos questions, un sujet plus général que vous pourriez explorer.

## HTML

<!-- spell ignore -->
Hypertext Markup Language (HTML) est un langage permettant de spécifier la mise en forme des pages web. C'est un langage de mise en forme qui définit la structure de votre contenu de manière déclarative, ce qui le rend très puissant. Ember fournit un langage de _templating_ qui étend HTML avec des outils pour rendre la structure dynamique.

Si vous débutez en HTML, nous recommandons [Les bases du HTML](https://developer.mozilla.org/fr/docs/Learn/Getting_started_with_the_web/HTML_basics) qui est assez complet, d'ailleurs le site MDN est l'une des meilleures ressources pour apprendre les APIs web.

## CSS

<!-- spell ignore -->
Les Cascading Style Sheets (CSS) sont utilisées pour styliser le HTML. Tandis que HTML définit la structure de la page, CSS fournit les règles qui dictent la manière dont s'affiche cette structure dans le navigateur.

Si vous débutez en CSS, nous recommandons [le guide MDN pour l'apprendre](https://developer.mozilla.org/fr/docs/Learn/CSS/First_steps), étant donné qu'il est assez complet et à jour.

## JavaScript

JavaScript est le premier langage de script du web. La plupart des apps Ember contiennent une certaine quantité de code JavaScript.

Puisque Ember est un framework orienté template, tous les devs n'ont pas besoin d'utiliser JavaScript en travaillant sur des apps Ember. Certain(e)s préféreront se concentrer sur la structure des templates de l'app, ses styles, ou encore l'accessibilité. Cela dit, mieux vaut avoir quelques connaissances générales en JavaScript pour comprendre les endroits du code ou il est utilisé.

Si vous débutez en JavaScript, voici d'excellentes ressources d'introduction&nbsp;:

- [Le tutoriel JavaScript de Mozilla](https://developer.mozilla.org/fr/docs/Web/JavaScript/Language_overview) est plutôt complet, et la documentation MDN est une source incontournable pour apprendre JavaScript et les APIs web.
- [javascript.info](https://fr.javascript.info/) est un guide interactif détaillé qui vous emmènera des bases aux concepts avancés. Cette ressource est très bien pour les débutants qui ont peu d'expérience de la programmation, puisqu'il part de zéro et fait monter en compétence.
- <!-- spell ignore --><span lang="en">[ES6 for humans](https://github.com/metagrover/ES6-for-humans)</span> est une super ressource si vous êtes déjà familier avec JavaScript en général, mais que nous n'avez pas eu l'opportunité de découvrir ses dernières fonctionnalités, finalisées en 2015.

Nous vous recommandons de vous familiariser avec les concepts suivants, afin de tirer le maximum de ce guide et d'Ember&nbsp;: 

* **Classes** - les classes sont l'une des briques les plus fondamentales de JavaScript et sont fréquemment utilisées dans Ember. Voir la section suivante pour plus de détails.
* **Modules** - Vous comprendrez mieux la structure du projet [Ember CLI](https://ember-cli.com/) et ses chemins d'imports si vous êtes à l'aise avec les [modules JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules).
* **Événements** - (_events_) Le moyen natif de gérer les entrées utilisateur dans des applications pour navigateur. Les événements ne font pas partie du langage JavaScript en lui-même, ils font partie de l'environnement du navigateur dans lequel JavaScript s'exécute, et ils sont couramment utilisés dans Ember. Vous pouvez lire l'[introduction aux événements de MDN](https://developer.mozilla.org/fr/docs/Learn/JavaScript/Building_blocks/Events) pour en savoir plus.
* **Promesses** - (_promises_) Le moyen natif de gérer le code asynchrone en JavaScript. Référez-vous à cette [section du guide Mozilla](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise). La syntaxe de fonction [`async/await`](https://developer.mozilla.org/fr/docs/Learn/JavaScript/Asynchronous/Promises) est également utile à connaître.

## Classes JavaScript

Ember utilise des [classes JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Classes) pour beaucoup de ses briques, les composants, les routes, les services et autres&nbsp;:

```js
export default class PermissionController extends Controller {
  @tracked isAdmin = false;
  @tracked isManager = false;

  get canEdit() {
    return this.isAdmin || this.isManager;
  }
}
```

Certaines fonctionnalités sur lesquelles Ember s'appuie, comme les [déclarations de champs (_class fields_)](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Classes#d%C3%A9clarations_de_champs) ou les [décorateurs (_decorators_)](https://github.com/tc39/proposal-decorators), n'ont pas encore été complètement finalisées en JavaScript, donc nous les couvrirons ici en supposant que vous avez déjà eu l'opportunité de vous familiariser avec les classes. Si ce n'est pas le cas, jetez d'abord un œil à notre section sur les [classes natives](../../in-depth-topics/native-classes-in-depth/).

### Déclarations de champs

Les déclarations de champs vous permettent d'assigner des propriétés à une instance de classe lors de sa construction. Vous pouvez déclarer un champ de la façon suivante&nbsp;:

```js
class Permission {
  canEdit = false;
}
```

C'est très similaire à la définition d'un constructeur pour la classe `Permission`, comme ceci&nbsp;:

```js
class Permission {
  constructor() {
    this.canEdit = false;
  }
}
```

Les champs déclarés peuvent être des objets, mais il y a quelques différences clés. Ils sont créés et assignés à chaque instance de la classe, ce qui signifie que chaque instance obtient une version _unique_ de ce champ. Ce détail est sans importance si le champ est une primitive comme un string ou un nombre, mais il change tout si c'est un objet ou un tableau&nbsp;:

```js
class Permission {
  roles = [];
}

let tom = new Permission();
let yehuda = new Permission();

tom.roles === yehuda.roles;
// false, ce sont des tableaux différents
```

Les champs peuvent aussi accéder à l'instance de classe avec `this` lorsqu'ils sont assignés&nbsp;:

```js
class Child {
  constructor(parent) {
    this.parent = parent;
  }
}

class Parent {
  child = new Child(this);
}
```

Les champs sont assignés avant que le code dans le constructeur ne s'exécute, on peut donc s'appuyer sur le fait qu'ils sont déjà assignés quand on entre dans le constructeur. Les champs _n'existent pas_ dans la classe en elle-même, ni dans le prototype de la classe, ils existent seulement dans l'_instance_ de la classe. Ils peuvent être ajoutés à la classe à l'aide du mot clé `static`, comme les autres éléments de classe.

### Décorateurs

Les décorateurs (_decorators_) sont des _modifiers_ que vous définissez et qui peuvent s'appliquer à une classe ou un élément de classe, comme un champ ou un méthode, pour changer son comportement. Par exemple, vous pourriez créer un décorateur `@cache` qui retourne la valeur d'un accesseur la première fois qu'il est calculé&nbsp;:

```js
import { cache } from 'my-cache-decorator';

class Counter {
  _count = 0;

  @cache
  get count() {
    return this._count++;
  }
}

let counter = new Counter();

console.log(counter.count); // 0
console.log(counter.count); // 0
```

Les décorateurs sont des fonctions JavaScript comme les autres qui s'appliquent avec une syntaxe particulière, c'est pourquoi vous les importez comme n'importe quelle autre fonction, vous utilisez simplement le symbole `@` pour les appliquer. Les décorateurs prennent diverses formes, certains peuvent aussi s'appliquer directement sur des classes, comme ceci&nbsp;:

```js
@observable
class Permission {}
```

D'autre peuvent recevoir des arguments&nbsp;:

```js
class Permission {
  canEdit = false;

  @alias('canEdit') editable;
}

let current = new Permission();
console.log(current.editable); // false
```

Ember fournit un certain nombre de décorateurs, comme le décorateur `@tracked`, que nous décrirons en détail plus loin dans le Guide.

> _Note: en JavaScript, les décorateurs sont toujours en cours de développement actif, il pourrait donc y avoir de petits changements à l'avenir. Les décorateurs fournis par Ember devraient rester stables malgré ces changements, mais nous vous recommandons de faire preuve de prudence si vous importez des librairies de décorateurs externes qui pourraient ne pas garantir la même stabilité._s

### Classes dites "classiques"

Les classes "classiques" (_classic classes_) sont dépréciées, mais il est toujours utile de savoir les reconnaître en lisant un code ou des articles de blog anciens. Avant que les classes natives en JavaScript n'existent, Ember utilisait sa propre syntaxe pour les classes, elle ressemblait à ça&nbsp;:

```js
export default Controller.extend({
  isAdmin: tracked({ value: false }),
  isManager: tracked({ value: false }),

  canEdit: descriptor({
    get() {
      return this.isAdmin || this.isManager;
    },
  }),
});
```

Cette syntaxe est nommée _classic class_. Vous pouvez jeter un œil aux classes classiques dans [la version "pre-Octane" du Guide officiel](https://guides.emberjs.com/v3.12.0/object-model/) pour plus d'informations sur comment les convertir à des classes modernes.

## Support multi-navigateur

Tout comme le langage JavaScript, les navigateurs web aussi évoluent au fil du temps&nbsp;! Ember vous aide à écrire du code qui fonctionne sur de nombreux navigateurs et leurs versions.

Sous le capot, Ember utilise [Babel](https://babeljs.io/) pour compiler le JavaScript moderne en quelque chose qui fonctionne sur tous les navigateurs. Sans cette étape, vous pourriez accidentellement livrer du code qui fonctionne pour votre version de Chrome mais casse chez quelqu'un utilisant Edge. Ember couvre vos arrières et vous permet d'écrire des applications en JavaScript moderne sans aucune configuration additionnelle. &nbsp;!

> _Note: Certaines fonctionnalités nécessitent [d'activer les _polyfills_ de Babel](https://github.com/babel/ember-cli-babel#polyfill). Ils ajoutent un peu de poids à votre application mais assurent sa compatibilité avec toute nouvelle fonctionnalité ajoutée à JavaScript._
