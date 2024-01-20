# TAD Sharecount

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Justification of Technology Choices](#justification-of-technology-choices)
3. [Architecture Explanation](#architecture-explanation)
4. [Key Architecture Details](#key-architecture-details)
5. [Challenges and Key Points](#challenges-and-key-points)
6. [Post-Mortem](#post-mortem)
   - [Human Aspect](#human-aspect)
   - [Technological Aspect](#technological-aspect)
7. [Conclusion](#conclusion)

## Technologies Used

### Front-end:
- HTML
- JavaScript
- CSS
- Bootstrap

### Back-end:
- NodeJS
- Express
- bcrypt
- uuid

### Database:
- PostgreSQL

I also use docker to containerize the database and the Node server with the html pages.

## Justification of Technology Choices

### Front-end:

For the front-end I needed simplicity and a well-known foundation. It led to the selection of HTML, JavaScript, and CSS as well as Bootstrap. Starting with a known stack made the learning curve easier for the rest of the app. 

### Back-end:
I selected NodeJS for the backend because of its scalability and user-friendliness. Express is a stable option for constructing the server. Because bcrypt has a track record of security, I use it for the password encryption. Tokens are generated using uuid, which securely provides unique identifiers for the groups. 

### Database:
Because of my experience and our classes, I chose PostgreSQL over MySQL. The database was containerized using Docker, which improved deployment and scalability.


## Architecture Explanation

### Front-end:
The front-end architecture consists of several HTML pages with CSS and JavaScript inline. User and group images are not used in the app, but they are implemented in the database.

### Back-end:
Backend tasks are managed by the NodeJS server using Express. Secure password storage is guaranteed by bcrypt, and token generation is made easier by uuid. For containerized deployment, Docker is utilized.

### Database:
The app uses PostgreSQL as the database, deployed within a Docker image. The server, responsible for file paths, includes HTML and CSS pages in its image.

## Key Architecture Details

- **Session Management:** Implemented for user authentication using the method learned in class.
- **Encryption Choice:** Use of bcrypt for password storage due to its security advantages over sha256, the method I was envisaging at first.
- **Deployment Strategy:** Use of Docker for both the database and NodeJS server for an easy deployment and scalability.

## Challenges and Key Points

- **Storage of Images:** Difficulty in managing storage of user and group images in the database. It is an area for future implementation.
- **Learning Curve:** Acquiring proficiency in Docker images building and NodeJS was challenging but essential for project success.

## Post-Mortem

### Human Aspect:

#### Personal Reflection:

- **Individual Learning:** I gained knowledge into various technologies but faced limitations due to the absence of collaborative input, especially when choosing the stack at the beginning of the project. 
- **Deployment Issues:** Difficulties in deploying due to non optimal technology choices, preventing the project's accessibility.


### Technological Aspect:

#### Achievements:
- **Successful Learning Curve:** Acquired new skills in Docker and NodeJS during the project.
- **Secure Authentication:** Implementation of robust password encryption using bcrypt.

#### Areas for Improvement:
- **Image Storage Optimization:** Explore better methods for handling image storage.
- **Technology Choices:** Reevaluate technology choices for potential optimization. Express and sessions are not compatible with a deployement in Kubernetes as it is a security breach. JWT seams like a great alternative to it in the future.
The docker images are also deployed in docker hub but due to this security breach it is impossible to use them in the current state.

## Conclusion

I managed to implement all the features I wanted in this application, starting to consider deployment towards the end. For these reasons, I am very satisfied with this project, as it pushed me to push my limits, never having undertaken a project of this magnitude before.