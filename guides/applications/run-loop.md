**Note:**
* <!-- spell ignore -->Pour les scénarios de développement d'apps Ember simples, vous n'avez pas besoin de comprendre la boucle d'exécution (_run loop_) ou de l'utiliser directement. Le chemin vers les usages communs est pavé pour vous et ne nécessite pas de travailler avec la boucle d'exécution.
* Cela dit, connaître la boucle d'exécution est utile pour comprendre la mécanique interne d'Ember et peut vous aider à personnaliser l'optimisation des performances en regroupant manuellement les tâches coûteuses.

La mécanique interne d'Ember et la plupart du code que vous écrivez dans vos apps se déroulent dans une boucle d'exécution. La boucle d'exécution est utilisée pour grouper et ordonner (ou réordonner) le travail de la manière la plus efficace.

Pour cela, les tâches sont planifiées sur des files d'attente (_queues_) spécifiques. Ces files d'attente ont une priorité et sont traitées par ordre de priorité.

Le cas le plus courant d'utilisation de la boucle d'exécution est l'intégration avec une API non Ember qui inclut un genre de _callback_ (rappel de fonction) asynchrone.

Par exemple&nbsp;:

- Mise à jour du DOM et _callbacks_ d'événements
- _callbacks_ de `setTimeout` et `setInterval`
- Gestionnaires d'événement `postMessage` et `messageChannel`
- _callbacks_ de `fetch` ou `ajax`
- _callbacks_ de _WebSocket_

## Quelle est l'utilité de la boucle d'exécution&nbsp;?

Très souvent, regrouper des tâches semblables présente des avantages. Les navigateurs Web utilisent plus ou moins cette approche en regroupant les modifications apportées au DOM.

Considérez l'extrait de code HTML suivant&nbsp;:

```html
<div id="foo"></div>
<div id="bar"></div>
<div id="baz"></div>
```

et exécutez le code suivant&nbsp;:

```javascript
foo.style.height = '500px' // écriture
foo.offsetHeight // lecture (recalcul du style et de la mise en page, coûteux !)

bar.style.height = '400px' // écriture
bar.offsetHeight // lecture (recalcul du style et de la mise en page, coûteux !)

baz.style.height = '200px' // écriture
baz.offsetHeight // lecture (recalcul du style et de la mise en page, coûteux !)
```

Dans cet exemple, la séquence de code force le navigateur à recalculer le style et remettre en page après chaque étape. Cependant, si on pouvait regrouper les tâches semblables ensemble, le navigateur n'aurait à recalculer le style et la mise en page qu'une seule fois&nbsp;:

```javascript
foo.style.height = '500px' // écriture
bar.style.height = '400px' // écriture
baz.style.height = '200px' // écriture

foo.offsetHeight // lecture (recalcul du style et de la mise en page, coûteux !)
bar.offsetHeight // lecture (rapide car le style et la mise en page sont déjà connus)
baz.offsetHeight // lecture (rapide car le style et la mise en page sont déjà connus)
```

Il est intéressant de noter que ce modèle de conception reste applicable à d'autres types de tâches&nbsp;; il permet essentiellement d'avoir de meilleures _pipelines_ (processus d'exécution), et des optimisations plus avancées.

Voyons un exemple similaire optimisé dans Ember, en commençant par une classe `Image`&nbsp;:

```javascript
import { tracked } from '@glimmer/tracking';

class Image {
  @tracked width;
  @tracked height;

  constructor({ width, height }) {
    this.width = width ?? null;
    this.height = height ?? null;
  }

  get aspectRatio() {
    return this.width / this.height;
  }
}
```

et un _template_ pour afficher ses attributs&nbsp;:

```handlebars
{{this.width}}
{{this.aspectRatio}}
```

Si on exécute le code suivant sans la boucle d'exécution&nbsp;:

```javascript
let profilePhoto = new Image({ width: 250, height: 500 });
profilePhoto.width = 300;
// profilePhoto.width et profilePhoto.aspectRatio sont mis à jour

profilePhoto.height = 300;
// profilePhoto.height et profilePhoto.aspectRatio sont mis à jour
```

On constate que le navigateur réaffiche le _template_ deux fois.

Maintenant, si nous avons la boucle d'exécution dans le code ci-dessus, le navigateur ne réaffiche le _template_ qu'une fois tous les attributs définis.

```javascript
let profilePhoto = new Image({ width: 250, height: 500 });
profilePhoto.width = 600;
profilePhoto.height = 600;
profilePhoto.width = 300;
profilePhoto.height = 300;
```

Dans l'exemple ci-dessus avec la boucle d'exécution, puisque les attributs de l'utilisateur ont les mêmes valeurs qu'avant l'exécution,
le modèle ne sera même pas réaffiché&nbsp;!

Il est bien sûr possible d'optimiser ces scénarios au cas par cas, mais les obtenir clé en main est bien plus appréciable.
En utilisant la boucle d'exécution, nous pouvons appliquer ce type d'optimisation non seulement pour chaque situation, mais aussi de manière holistique pour l'ensemble de l'app.

## Comment la boucle d'exécution fonctionne dans Ember&nbsp;?

Comme indiqué précédemment, on programme le travail (sous la forme d'invocations de fonctions) dans des files d'attente, et ces files d'attente sont traitées par ordre de priorité.

Quelles sont les différentes files d'attente, et quel est leur ordre de priorité&nbsp;?

1. `actions`
2. `routerTransitions` (transitions du routeur)
3. `render` (affichage)
4. `afterRender` (après l'affichage)
5. `destroy` (destruction)

Dans la liste ci-dessus, la file d'attente `actions` a une plus haute priorité que les files `render` ou `destroy`.

## Que se passe-t-il dans ces files d'attente&nbsp;?

* `actions` est la file d'attente générale et contient typiquement des tâches planifiées, par exemple des promesses.
* `routerTransitions` contient les tâches de transition dans le routeur.
* `render` contient les tâches destinées au rendu qui, typiquement, mettent à jour le DOM.
* `afterRender` contient les tâches destinées à être exécutées après que toutes les tâches de rendu précédemment programmées sont terminées. C'est souvent utile pour les bibliothèques de manipulation du DOM, qui ne doivent être exécutées qu'après qu'un arbre entier de DOM ait été mis à jour.
* `destroy` contient des tâches pour terminer de détruire des objets dont d'autres tâches ont planifié la destruction.

## Dans quel ordre les tâches sont-elles exécutées dans la file d'attente&nbsp;?

L'algorithme fonctionne de la manière suivante&nbsp;:

1. Soit `CURRENT_QUEUE` la file d'attente la plus prioritaire avec des tâches en attente. S'il n'y a plus de tâche en attente, la boucle d'exécution est terminée. Sinon...
2. Soit `WORK_QUEUE` une nouvelle file d'attente temporaire.
3. On déplace les tâches de `CURRENT_QUEUE` vers `WORK_QUEUE`.
4. On traite toutes les tâches séquentiellement dans `WORK_QUEUE`.
5. On retourne à l'étape 1.

## Un exemple de la mécanique interne

Plutôt que d'écrire le code de l'application de haut niveau, qui invoque en interne les diverses fonctions de planification de la boucle d'exécution, nous avons soulevé le capot et montré les interactions brutes de la boucle d'exécution.

Travailler directement avec cette API n'est pas courant dans la plupart des apps Ember, mais comprendre cet exemple vous aidera à comprendre aussi l'algorithme des boucles d'exécution, ce qui améliorera vos compétences en Ember.

<iframe src="https://s3.amazonaws.com/emberjs.com/run-loop-guide/index.html" width="678" height="410" style="border:1px solid rgb(170, 170, 170);margin-bottom:1.5em;"></iframe>

## Comment dire à Ember de démarrer une boucle d'exécution&nbsp;?

Vous devriez commencer une boucle d'exécution quand le _callback_ se déclenche.

La méthode `Ember.run` permet de créer une boucle d'exécution. Dans cet exemple, `Ember.run` est utilisé pour gérer un événement en ligne (le navigateur accède à Internet) et exécuter du code Ember.

```javascript
window.addEventListener('online', () => {
  Ember.run(() => {  // commencement de la boucle
    // Ici se trouve le code dont résultent des tâches planifiées
  }); // fin de la boucle, les tâches sont traitées et exécutées
});
```

## Que se passe-t-il si j'oublie de commencer une boucle d'exécution dans un _handler_ asynchrone&nbsp;?

Comme mentionné plus haut, vous devez imbriquer tous les _callbacks_ asynchrones non Ember dans `Ember.run`. Si vous ne le faites pas, Ember estimera approximativement un début et une fin pour vous. Considérons le _callback_ suivant&nbsp;:

```javascript
window.addEventListener('online', () => {
  console.log('Faire des trucs...');

  Ember.run.schedule('actions', () => {
    // Faire plus de trucs
  });
});
```

Les appels API de la boucle d'exécution qui "planifient" le travail, c'est-à-dire [`run.schedule`](https://api.emberjs.com/ember/release/classes/@ember%2Frunloop/methods/schedule?anchor=schedule), [`run.scheduleOnce`](https://api.emberjs.com/ember/release/classes/@ember%2Frunloop/methods/scheduleOnce?anchor=scheduleOnce), [`run.once`](https://api.emberjs.com/ember/release/classes/@ember%2Frunloop/methods/once?anchor=once), ont la propriété d'estimer approximativement une boucle d'exécution pour vous s'il n'en existe pas déjà une. Ces boucles d'exécution créées automatiquement sont appelées _autoruns_.

Voici du pseudo-code pour décrire ce qui se passe dans l'exemple ci-dessus&nbsp;:

```javascript
window.addEventListener('online', () => {
  // 1. Les autoruns ne modifient pas l'exécution d'un code arbitraire dans un callback.
  //    Ce code est toujours exécuté au moment où le callback se déclenche et ne sera pas
  //    programmé dans un autorun.
  console.log('Faire des trucs...');

  Ember.run.schedule('actions', () => {
    // 2. schedule note qu'il n'y a actuellement pas de boucle d'exécution disponible, donc
    //    il en crée une. Il la programme pour fermer et envoyer les files d'attentes au
    //    prochain tour de la boucle d'événements JS.
    if (! Ember.run.hasOpenRunLoop()) {
      Ember.run.begin();
      nextTick(() => {
        Ember.run.end()
      }, 0);
    }

    // 3. Il y a maintenant une boucle d'exécution disponible donc schedule y ajoute son item.
    Ember.run.schedule('actions', () => {
      // Faire plus de trucs
    });

  });

  // 4. Ce schedule voit l'autorun créé par le schedule du dessus comme une boucle d'exécution
  //    disponible et y ajoute son item.
  Ember.run.schedule('afterRender', () => {
    // Faire encore plus de trucs
  });
});
```

## Où puis-je trouver plus d'informations&nbsp;?

Jetez un œil à la documentation d'API de [Ember.run](https://api.emberjs.com/ember/release/classes/@ember%2Frunloop), ainsi qu'à la [librairie Backburner](https://github.com/ebryn/backburner.js/) qui alimente la boucle d'exécution.
