Ember vous donne **le pouvoir d'écrire des tests et d'être productif dès le premier jour**. Vous pouvez être sûr que votre application fonctionnera correctement aujourd'hui et dans des années. Une question demeure : Comment devriez-vous écrire des tests ?

Comme les tests sont un élément central du framework Ember et de votre cycle de développement, plusieurs sections sont consacrées à l'apprentissage de la rédaction de tests.

Dans cette section, nous aborderons les raisons pour lesquelles les tests sont importants et comment exécuter, déboguer et filtrer vos tests.

## Pourqoi ai-je besoin de tests ?

Écrire des tests est un ingrédient nécessaire si vous voulez garantir aux utilisateurs et aux parties prenantes que votre application, petite ou grande, fonctionnera comme prévu à tout moment. Plus votre application est volumineuse, plus les tests manuels deviennent coûteux et sujets aux erreurs.

Écrire des tests est également une activité amusante et un bon changement de rythme par rapport à la livraison quotidienne de fonctionnalités. C'est aussi un moyen de vous aider à refactorer du code et à vous améliorer. Enfin, les tests peuvent vous servir de documentation vivante, un élément clé pour intégrer de nouve·aux·lles devs à l'équipe.

## Comment exécuter des tests

Vous avez plusieurs options pour exécuter des tests.

Tout d'abord, vous pouvez exécuter la suite de tests avec la commande `ember test`, ou `ember t`, dans votre terminal. Ceci exécutera la suite de test une seule fois.

En lançant un serveur de développement local (avec `npm start`), vous pouvez visiter l'URI `/tests`. Ceci affichera le _template_ `tests/index.html`. Cette page se met à jour automatiquement quand vous changez des fichiers dans votre app.

```bash
# Exécute tous les tests une fois
ember test
ember t
```

### Comment filter les tests

Lorsque vous travaillez sur un seul composant ou une seule page, vous ne voulez exécuter qu'un petit sous-ensemble de tests après chaque modification de fichier. Pour spécifier les tests à exécuter, vous pouvez ajouter l'option `--module` ou `--filter` à votre commande.

L'option `--module` vous permet de sélectionner un **module**— un groupe de tests que vous avez spécifiés dans `module()` dans QUnit.

```bash
# Exemple de composant Button
ember test --module="Integration | Component | simple-button"

# Exécute des tests pour un service de localisation
ember t -m="Unit | Service | location"
```

L'option `--filter` est plus polyvalente. Vous pouvez fournir une phrase à comparer aux modules et aux descriptions des tests. Une description de test est ce qui apparaît dans `test()` dans QUnit.

```bash
# Exemple de composant Button
ember test --filter="devrait afficher l'icône et l'étiquette"

# Teste tout ce qui est lié à votre tableau de bord
ember t -f="Tableau de bord"

# Exécute des tests d'intégration
ember t -f="Intégration"
```

Dans QUnit, vous pouvez exclure des tests en ajoutant un point d'exclamation au début du filtre, par exemple `ember test --filter="!Acceptance"`.

Pour en savoir plus sur les options de test, vous pouvez consulter la [documentation d'Ember CLI](https://ember-cli.com/testing) ou taper `ember help test` en ligne de commande.

## Comment déboguer des tests

Lorsque vous écrivez des tests ou du code d'application, l'exécution de vos tests peut échouer.

Pour trouver le problème, vous pouvez ajouter [`debugger`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/debugger) à votre code pour vérifier l'état intermédiaire. Vous pouvez ajouter cette dans le code des tests et celui de l'application.

Grâce à la configuration d'Ember, vous pouvez également utiliser [`pauseTest()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#pausetest) et [`resumeTest()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#resumetest) pour déboguer vos tests. `pauseTest` vous permet d'inspecter facilement le DOM, mais ne peut être utilisé que dans le code de test.

Ajoutez simplement `await pauseTest();` pour tester votre code, et sauvegardez. Quand le test atteint cette ligne, il s'arrête, vous permettant d'inspecter l'état de votre application. Quand c'est fait, tapez `resumeTest()` dans le navigateur pour reprendre les tests.

## En résumé

Ember considère les tests comme un citoyen de première classe. De plus, il fournit diverses fonctionnalités intégrées pour exécuter, filtrer et déboguer les tests.

Dans la section suivante, nous verrons quels outils peuvent vous aider à tester et comment démarrer avec eux.
