Installation : 

- Ouvrir un command prompt
- Se rendre dans le dossier de l'api (ici foodExpress-main)
- Lancer la commande : npm install (qui permet d'installer les modules nécessaires)

Run l'API : 

- lancer la commande : npm start (cela lance l'API)


Main end point : 

/auth : permet l'inscription et le login
 - /auth/register (inscription)
 - /auth/login (connexion)

/users : permet de voir son compte et de voir les users (pour un admin)
 - get users/ : récupérer tous les utilisateurs (admin)
 - get users/:id : récupérer un utilisateur, si son propre compte ok pour un user, si un autre compte, seulement pour admin
 - put users/:id : modifier un utilisateur (admin sauf si son propre compte)
 - delete users/:id : delete un utilisateur (admin sauf si son propre compte)

/restaurants : permet de voir les restaurants inscit (pour les users) ou de créer et modifier les restaurants (pour un admin)
 - get restaurants/ : récupérer les restaurants
 - post restaurants/ : créer un restaurant (admin)
 - put restaurants/:id : modifier un restaurant (admin)
 - delete restaurants/:id : supprimer un restaurant (admin)

/menus : permet de voir les menus (pour les users) ou de créer et modifier les menus (pour un admin)

 - get menus/ : récupérer les menus
 - post menus/ : créer un menu (admin)
 - put menus/:id : modifier un menu (admin)
 - delete menus/:id : supprimer un menu (admin)
