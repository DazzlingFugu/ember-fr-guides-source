Avant de se lancer dans du code Ember, il peut être utile de se faire une idée de la manière dont une application Ember fonctionne.

![Concepts fondamentaux d'Ember](/images/ember-core-concepts/ember-core-concepts.svg)

## Routeur et Gestionnaires de Route

Imaginons que nous écrivons une web app permettant aux utilisateurs de lister leurs biens à louer. À tout instant, nous devrions être en mesure de répondre à des questions telles que : "De quelle location l'utilisateur est-il en train de regarder le détail ?" ou "Est-il en train de l'éditer ?" En Ember, la réponse à ces questions est déterminée par l'URL.

Il existe plusieurs manières de modifier l'URL courante :

- L'utilisateur charge l'application pour la première fois.
- L'utilisateur change l'URL manuellement, en clicquant sur le bouton "Précédent" ou en éditant la barre d'adresse du navigateur.
- L'utilisateur clique sur un lien à l'intérieur de l'app.
- D'autres événements se produisant dans l'app sont susceptibles de modifier l'URL.

Peu importe la manière dont l'URL a été changée, la première action qui en découle est que le routeur d'Ember associe l'URL à un gestionnaire de route.

Le gestionnaire de route fait alors, entre autres, deux choses :

- Il charge un modèle.
- Il affiche un template qui a accès au modèle.

## Modèles

Un modèle représente un état persistant.

Par exemple, notre application de gestion de locations devrait pouvoir enregistrer les détails d'un bien à louer quand l'utilisateur les publie, et donc à chaque bien serait associé un modèle définissant ses détails. Nous pourrions appeler ce modèle _rental_ (location). Nous aurions aussi besoin d'un modèle _user_ (utilisateur) pour conserver l'identité de l'utilisateur connecté.

En général, on persiste les informations d'un modèle en les envoyant à un serveur web, bien qu'en réalité il soit possible de les sauvegarder n'importe où ailleurs, comme par exemple dans le "Local Storage" du navigateur.

Par défaut, une nouvelle app Ember inclut [Ember Data](../../models/), une librairie de gestion de données distincte du framework, mais très conventionnelle. Ember Data s'intègre avec Ember et fournit une strate solide pour gérer les modèles.

Vous pouvez cependant manipuler vos modèles à l'aide de n'importe quelle autre librairie de gestion de données, comme [Redux](https://github.com/ember-redux/ember-redux) ou
[Apollo](https://github.com/ember-graphql/ember-apollo-client), ou même créer votre propre système en vous appuyant sur les outils fournis par Ember pour gérer les états, comme [autotracking](../../components/component-state-and-actions/). Nous en apprendrons plus sur ces outils dans d'autres parties du guide.

## Templates

Ember utilise des "templates" pour construire l'interface utilisateur de l'application.

Si vous êtes familier avec HTML, alors vous savez déjà écrire un template Ember basique. Par exemple :

```handlebars {data-filename="app/templates/welcome.hbs"}
<div>Bonjour, ceci est un template Ember valide!</div>
```

En plus du contenu HTML statique, Ember utilise la syntaxe [Handlebars](http://handlebarsjs.com) pour décrire les éléments dynamiques de l'interface utilisateur.

Par exemple, comme mentionné précédemment, le gestionnaire de route rend le modèle qu'il charge accessible à son template :

```handlebars {data-filename="app/templates/welcome.hbs"}
{{! Le modèle de cette route est l'utilisateur courant }}

<div>
  Bonjour
  <img
    src="image de profile de {{@model.profileImage}}"
    alt="{{@model.name}}"
  />
  {{@model.name}}, ceci est un template Ember valide !
</div>

{{#if @model.isAdmin}}
  <div>Rappelez-vous, un grand pouvoir implique de grandes responsabilités!</div>
{{/if}}
```

Cet exemple combine plusieurs fonctionnalités d'Handlebars pour créer une expérience utilisateur personnalisée, on ne pourrait pas faire ça avec simplement du HTML statique.
Ici, nous utilisons la syntaxe de commentaire (`{{!-- ... --}}`) pour laisser des notes aux futurs développeurs, la double-accolade (`{{...}}`) pour inclure des valeurs dynamiques, et la syntaxe `{{#if}}...{{/if}}` pour afficher un contenu seulement si une condition est respectée.

Nous verrons plus en détail chacune de ces fonctionnalités des templates plus tard dans le guide.

## Composants

Les composants permettent de "découper" les templates et de les organiser en sections plus petites, indépendantes et réutilisables.

Dans sa forme la plus basique, un composant est juste un morceau de template identifié par son nom. On peut assimiler les composants aux fonctions des langages de programmation, car ils peuvent aussi prendre des paramètres d'entrée (_arguments_), ce qui les rend adaptables au contexte spécifique dans lequel ils sont affichés.

Reprenons l'exemple de la partie précédente, qui commence à contenir un peu de complexité. Nous pouvons "extraire" le code qui affiche le nom de l'utilisateur et sa photo de profil dans un composant dédié :

```handlebars {data-filename="app/components/user-profile.hbs"}
<img src="{{@user.profileImage}}" alt="image de profile de {{@user.name}}" />
{{@user.name}}
```

Maintenant, nous pouvons simplifier le template initial comme ceci :

```handlebars {data-filename="app/templates/welcome.hbs"}
{{! Le modèle de cette route est l'utilisateur courant }}

<div>
  Bonjour
  <UserProfile @user={{@model}} />, ceci est un template Ember valide !
</div>

{{#if @model.isAdmin}}
  <div>Rappelez-vous, un grand pouvoir implique de grandes responsabilités!</div>
{{/if}}
```

Non seulement nous avons rendu le template initial plus lisible, mais désormais, nous avons aussi un composant `<UserProfile>` que nous pouvons réutiliser n'importe où dans l'application pour afficher les informations sur l'utilisateur courant.

On peut voir les composants Ember comme une façon de créer ses propres balises HTML. Non seulement les composants affichent du contenu, mais on peut aussi leur associer du code JavaScript, afin de leur ajouter des comportements, comme répondre au clic d'un utilisateur.

Nous couvrirons les fonctionnalités avancées des composants dans un chapitre ultérieur. Pour l'instant, voyons ces concepts fondamentaux en action en construisant, dans la leçon suivante, une application de gestion de locations.
