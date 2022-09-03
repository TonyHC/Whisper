# Whisper Web App
This is a simplized version of the Whisper mobile app. 

## How to build and run the image using Docker
- Change to the directory containing the Dockerfile and .dockerignore
- Run the following Docker command to build the Docker image: 
  - `docker build -t whisper .`
- Enter this Docker command after the image is built to run the image in a Docker container:
  - `docker run --name whisper -d -p 3000:3000 whisper:latest`

## How to visit web application
Visit [Whisper](http://localhost:3000) to access the web app <br>

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