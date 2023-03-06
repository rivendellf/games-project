# Northcoders House of Games API

This project is the back-end of the games-project; creating endpoints for a website showing reviews for different board games. 

Here is a link for the hosted version : https://weary-lingerie-clam.cyclic.app/api/users

In order to run the project locally:

1. Clone this repository

2. Run ```npm install``` to install all the dependencies 

3. You will need to create two files in the root of the folder, titled:

```.env.development``` - in this file insert ```PGDATABASE=nc_games```

```.env.test``` - in this file insert ```PGDATABASE=nc_games_test```

This will allow you to connect to the databases locally. 

4. Setup your database by running ```npm run setup-dbs``` and ```npm run seed```

5. Test using ```npm test```

Minimum requirements: 

Node.js version 16.17.1 or above 

Postgres version 8.7.3 or above
