Les applications Ember sont compilées grâce à Ember CLI, responsable d'une succession d'étapes de 
compilation. Comme pour le code de votre application, Ember CLI embarque un ensemble de réglages par 
défaut afin de compiler et regrouper les ressources destinées à être déployées en production. En 
pratique, ceci est réalisé via plusieurs plugins Broccoli, chacun pouvant être configuré dans le 
fichier `ember-cli-build.js` se trouvant à la racine de votre projet.

Ember CLI utilise [Babel.js](https://babeljs.io) pour l'étape de compilation. Si vous avez déjà 
utilisé Babel auparavant, vous savez sûrement qu'un grand nombre de réglages est proposé, comme la 
possibilité de configurer des _targets_&nbsp;: environnements dans lesquels votre application sera
amenée à s'exécuter. Par exemple, si votre application est intégrée au sein d'une application
[Electron](https://www.electronjs.org), il est possible que vous ne vouliez la compiler que pour la
dernière version de Chromium. Ou alors, si votre application est destinée à des utilisateurs en
entreprise, vous aurez peut-être besoin de compiler votre code JavaScript vers une syntaxe plus 
ancienne qui fonctionne sur IE11.

Pour chacun de ces cas, vous pouvez configurer la commande `ember build` pour que le nécessaire soit
fait. Pour en savoir plus, consultez le [Guide Ember CLI](https://cli.emberjs.com/release/advanced-use/build-targets/)
(en anglais).
