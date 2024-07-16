Quand des devs disent qu'ils "mettent à jour" leur app Ember, ça peut vouloir dire plusieurs choses, en particulier s'ils parlent de "passer à Octane". Cette page du Guide vous aidera à remplir les blancs sur ce qui concerne la mise à jour la version de votre app, l'accès aux dernières et meilleures fonctionnalités, et à définir une stratégie pour utiliser les fonctionnalités d'Octane dans vos apps existantes.

## Détail des _releases_ récentes

Vous apprendrez ce qui a changé dans chaque _release_ (version livrée) en lisant [le blog officiel d'Ember](https://blog.emberjs.com).

## Mises à jour de routine pour maintenir les versions mineures

Mettons que vous voulez mettre à jour une app de `v3.4` à `v3.8`. Bien que vous ayez entendu parler de nouvelles fonctionnalités, votre objectif principal est de suivre les mises à jour de sécurité. Pour faire ce type de mise à jour, suivez les instructions [ici, dans les Guides CLI](https://cli.emberjs.com/release/basic-use/upgrading/). Ce processus vous assurera que toutes les dépendances de la base de code `ember.js` sont également mises à jour. Des outils automatisés vous aideront à faire les bons changements dans le `package.json` et d'autres fichiers. L'intérêt d'un saut de version mineure est que vous ne devriez pas avoir besoin de changer quoi que ce soit dans votre application lors de la mise à jour&nbsp;; tout devrait continuer à fonctionner, que vous choisissiez ou non d'adopter de nouvelles syntaxes et fonctionnalités.

## Utiliser de nouvelles fonctionnalités

Une fois que vous avez mis à jour la version d'une app, de nouvelles fonctionnalités peuvent parfois être disponibles d'emblée. En revanche, d'autres fonctionnalités nécessitent que vous les activiez spécifiquement dans la configuration de votre app, car elles peuvent modifier son comportement par défaut.

<!-- spell ignore -->
La meilleure manière de découvrir les nouvelles fonctionnalités est de lire les [articles de blog sur les _releases_](https://blog.emberjs.com/tags/releases.html). Une nouvelle fonctionnalité qui requiert que vous l'activiez est appelée fonctionnalité optionnelle (_optional feature_). Suivez [le guide des fonctionnalités optionnelles](../configuring-ember/optional-features/) pour savoir lesquelles sont disponibles dans la version d'Ember de votre app, et comment les activer. Dans de nombreux cas, des _codemods_ seront disponibles pour vous aider à faire des mises à jour liées à la syntaxe. Un _codemod_ est un outil qui réécrit votre code existant dans une nouvelle syntaxe. Lorsqu'ils sont disponibles, ils peuvent vous épargner beaucoup de temps passé à faire des modifications à la main.

## Gérer les dépréciations

Si une API que vous utiliser doit être supprimée dans la prochaine version majeure d'Ember, vous verrez un message de dépréciation (_deprecation warning_) dans la console de développement. Ces messages pourront parfois être causés par le code de votre app, et d'autres fois, par celui d'un addon.

Pour en savoir plus sur la manière dont gérer les dépréciations, lisez la page [Gérer les dépréciations](../configuring-ember/handling-deprecations/), jetez un œil [aux outils de gestion des dépréciations](../ember-inspector/deprecations/) de l'Ember Inspector, ou regardez les [_Deprecations Guides_](https://deprecations.emberjs.com/).


## Mettre à jour vers Octane

Octane a été un grand pas en avant dans la syntaxe, les fonctionnalités, et les modèles mentaux d'Ember&nbsp;! Si vous êtes dans le processus de mettre à jour une app existante vers Octane, jetez un œil à la page dédiée [Guide de Mise à Jour vers Octane](./current-edition/).
