[![Ce projet utilise GitHub Actions pour l'intégration continue.](https://github.com/DazzlingFugu/ember-fr-guides-source/workflows/CI/badge.svg)](https://github.com/DazzlingFugu/ember-fr-guides-source/actions?query=workflow%3ACI)

# Ember.js Guides en français

Ce répertoire contient la traduction française du guide officiel Ember.js :

- [Ember.js Guides, site web](https://github.com/ember-learn/ember-website),
- [Ember Guides Source](https://github.com/ember-learn/guides-source)

## Contribuer

Bienvenue et merci pour votre aide !

Les nouveaux contributeurs sont encouragés à consulter les problèmes étiquetés **help wanted** ou **good first issue**. Si vous avez des questions ou êtes intéressé par une session de pair, vous pouvez rejoindre [#lang-french](https://discord.com/channels/480462759797063690/486235962700201984) sur [le Discord de la communauté Ember](https://discordapp.com/invite/zT3asNS).

Veuillez consulter [CONTRIBUTING.md](CONTRIBUTING.md) pour des instructions supplémentaires sur la façon de formater votre travail et de soumettre une PR.

Le contenu du Guide Ember est écrit en Markdown. En général, votre PR ne devrait modifier que les fichiers du répertoire `/guides/release`, qui correspond à la dernière version d'Ember.

## Développement local

**NOTE:** Ce projet utilise [Volta](https://volta.sh/) pour s'assurer que la bonne version de Node.js et de npm est utilisée lors du développement local.

Pour exécuter l'app Guide Ember localement, saisissez ces commandes dans votre terminal :

```bash
git clone git://github.com/DazzlingFugu/ember-fr-guides-source.git

cd ember-fr-guides-source
npm install
ember serve
```

Ensuite, visitez [http://localhost:4200](http://localhost:4200) dans votre navigateur.

Remarque : sur Mac, si vous obtenez l'erreur `Error: EMFILE: too many open files, watch`, essayez d'installer Watchman. Installez [Homebrew](https://brew.sh/) si vous ne l'avez pas. Ensuite, dans votre terminal, lancez `brew install watchman`.

### Linting et correction orthographique

Les guides sont soumis à un contrôle orthographique et "lintés" pour la cohérence de Markdown. Vous pouvez vérifier vos modifications en exécutant :

```bash
npm run lint
```

Le linting et la vérification orthographique doivent passer, sinon ils échoueront en CI (intégration continue). Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour plus d'informations sur le linting et la vérification orthographique.

### Liens internes et externes

Le test des liens internes et externes peut être effectué à l'aide de trois commandes :

```bash
# Exécuter tous les scripts de test dans `/node-tests` sauf ceux situés
# dans `/node-tests/local`. En particulier, cette commande vérifie
# tous les liens internes à travers l'application.
npm run test:node

# Exécuter tous les scripts de test dans `/node-tests/local`. En particulier,
# cette commande vérifie tous les liens externes dans la version de release
# et dans toutes les versions du guide officiel.
npm run test:node-local

# Lors de la vérification des liens externes dans la version de release, ne pas
# vérifier les liens vers la documentation de l'API (https://api.emberjs.com).
npm run test:node-local-exclude-api-urls
```
