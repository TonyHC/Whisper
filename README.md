# Whisper Web App
This is a simplized version of the Whisper mobile app. 

## Features
  - Anyone can view the secrets posted by anonymous logged in users
  - To post a new secret, a user must sign up either through entering a username and password or authenticating through Google
  - Authenticated user can post a maximum of one secret, reposting another secret updates the previous secret with the new secret posted

## How was it built
  - Designed the frontend using HTML, CSS, Bootstrap 5, jQuery
  - The backend relies on Express.js with Node.js and EJS
  - MongoDB Atlas is used to store the sign up and posted secret data
  - Use following packages to implement user authentication:
    - ```expression-session```
    - ```passport``` 
    - ```passport-local```
    - ```passport-local-mongoose```
    - ```passport-google-oauth20```
    - ```mongoose-findorcreate```

## Visit web application
Visit [Whisper](https://infinite-spire-84380.herokuapp.com/) to access the web app deployed by Heroku and data stored in MongoDB Atlas.