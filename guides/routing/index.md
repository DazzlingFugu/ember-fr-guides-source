Imaginons que l'on soit en train de créer une application web pour gérer un blog. À tout moment, on 
devrait être en mesure de répondre à des questions telles que "Quel article l'utilisateur est en
train de lire ?" et "Est-il en train de le modifier ?". Avec Ember.js, la réponse à ces questions
est déterminée par l'URL.

L'URL peut être définie de plusieurs façons&nbsp;:

- L'utilisateur charge l'application pour la première fois.
- L'utilisateur modifie l'URL manuellement, par exemple en cliquant sur le bouton "Retour" de son
  navigateur, ou bien en modifiant directement la barre d'adresse.
- L'utilisateur clique sur un des liens de l'application.
- Un autre évènement de l'application provoque une modification de l'URL.

Qu'importe la manière dont l'URL est définie, le _Router_ d'Ember.js fera un lien entre l'URL 
actuelle et un ou plusieurs gestionnaires de route. Un gestionnaire de route a plusieurs 
fonctions&nbsp;:

- Il peut afficher un _template_.
- Il peut charger un modèle, qui est ensuite accessible dans le _template_.
- Il peut rediriger vers une autre route, par exemple si l'utilisateur n'est pas autorisé à voir
  une certaine partie de l'application.
- Il peut gérer des actions qui impliquent de changer le modèle ou de naviguer vers une autre route.
