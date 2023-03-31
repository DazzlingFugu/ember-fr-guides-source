Une application Ember est toujours représentée par une classe qui étend [`Application`](https://api.emberjs.com/ember/release/classes/Application). Cette classe est utilisée pour déclarer et configurer les nombreux objets qui constituent l'app.

Quand l'application démarre, elle crée une [`ApplicationInstance`](https://api.emberjs.com/ember/release/classes/ApplicationInstance) qui est utilisée pour gérer tout ce qui à trait aux états. L'instance agit en tant que "_owner_" (propriétaire) des objets instanciés pour l'app.

Pour le formuler autrement, l'`Application` _définit votre application_ tandis que l'`ApplicationInstance` _gère son état_.

Cette séparation des responsabilités, en plus de clarifier l'architecture de votre app, peut aussi améliorer son efficacité. C'est particulièrement vrai quand votre app doit démarrer de manière répétée durant les tests et / ou le rendu serveur (par exemple via [FastBoot](https://github.com/tildeio/ember-cli-fastboot)).


La configuration d'une seule `Application` peut être écrite et partagée entre de multiples instances d'`ApplicationInstance` à états. Ces instances peuvent être supprimées dès qu'elles ne sont plus nécessaires (par exemple quand un test a fini de s'exécuter ou d'une requête FastBoot est terminée).
