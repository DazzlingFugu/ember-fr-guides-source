## Que sont les <span lang="en">_engines_</span> (moteurs)&nbsp;?

Les [<span lang="en">_Ember Engines_</span>](http://ember-engines.com/) (moteurs Ember) permettent de composer, à partir de multiples applications logiques, une application unique du point de vue de l'utilisateur, et offrent des fonctionnalités à leurs applications hôtes. Les <span lang="en">_engines_</span> sont des applications isolées et "composables", ils ont presque les mêmes fonctionnalités que les apps Ember classiques, si ce n'est qu'un [_Engine_](https://api.emberjs.com/ember/release/classes/Engine) (moteur) a besoin d'une application hôte pour démarrer et lui fournir une instance de _Router_ (routeur).

## Pourquoi utiliser les <span lang="en">_engines_</span>&nbsp;?

Les grandes organisations utilisent souvent `Ember.js` pour réaliser des apps Web sophistiquées. Ces apps peuvent nécessiter une collaboration entre plusieurs équipes, parfois réparties dans le monde entier. Généralement, la responsabilité est partagée en divisant l'app en une ou plusieurs "sections". La manière dont cette division est mise en œuvre varie d’une équipe à l’autre. 

Maintenir de lourdes applications monolithiques relève quelques défis&nbsp;:

* `Effets de bord` - si vous changez quelque chose, les impacts sur le reste de la plateforme peuvent être flous.
* `Coordination` - quand vous développez une nouvelle fonctionnalité ou faites des changements importants, un grand nombre d'équipes peuvent avoir besoin de se synchroniser pour les approuver.
* `Complexité` - avec un énorme arbre de dépendance et de nombreuses couches d'abstraction, les devs ne peuvent pas itérer rapidement, et les fonctionnalités en souffrent.
* `Mort de l'inovation` - Faire du test A/B sur une fonctionnalité de pointe sans perturber le reste de l'app et le travail des équipes est difficile.
* `Onboarding lent` - les nouveaux arrivants dans l'équipe se sentent dépassés.

Les <span lang="en">_engines_</span> sont un antidote à ces problèmes en permettant de distribuer tant le développement que les tests, et d'empaqueter par groupes logiques les parties d'une app.

Les <span lang="en">_engines_</span> sont utiles aux organisations avec de multiples équipes, où chaque équipe possède son propre domaine clairement distinct des autres. L'isolation est utile lorsqu'elle répond aux limites organisationnelles, mais ajoute une complexité qui n'est pas nécessaire dans le cas contraire.

Les <span lang="en">_engines_</span> sont utilisés par de nombreuses grandes organisations pour produire des sites aux millions d'utilisateurs.

Si vous envisagez de diviser votre app en <span lang="en">_engines_</span> simplement pour réduire la quantité de données à télécharger à l'initialisation et augmenter les performances, les <span lang="en">_engines_</span> ne sont pas la bonne solution. Regardez plutôt la section sur le _tree shaking_ (élimination du code mort) et la division du code dans les projets comme [Embroider](https://github.com/embroider-build/embroider).
