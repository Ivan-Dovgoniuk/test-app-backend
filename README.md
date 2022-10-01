
This application includes an API for registering, logging in, editing a user by using JWT tokens

How to set developer environment:

 -create file .env in main directory of this app.
 
 -open file .env_example.txt and copy all variables in .env file.
 
 -edit the value of variables:
 
    - PORT = port on which to run the app
    - DB_URL = MongoDB connection code to your data base 
    - JWT_ACCESS_SECRET = create your uwn secret key for JWT tokens
    - SMTP_HOST = SMTP server of your email
    - SMTP_PORT = SMTP port of your email
    - SMTP_USER = your email
    - SMTP_PASSWORD = IMAP password for your app (you must generate on post servise)
    - DEV_API_URL = http://localhost:5000 (where 5000 is your own port)
    - DEV_CLIENT_URL = http://localhost:3000 (React default localhost)
 	
 - save .env file and enter next comands in terminal:
 
          - npm install
          - npm run dev
 
 How to deploy app on Heroku:
 
 -edit the value of variables:
 
        - PRO_API_URL = url of your heroku domen (must create on www.heroku.com)
        - PRO_CLIENT_URL = url of your client side app
        
 -enter next comands in terminal:
 
	- heroku login
	- heroku git:remote -a *your own domen on heroku*
	- git add .
	- git commit -m "name of your commit"
	- git push heroku master
	
	
