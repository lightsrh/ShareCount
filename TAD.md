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

I also used docker to containerize the database in an image and the Node server with the html pages in an other on 

## Justification of Technology Choices

### Front-end:
The choice of HTML, JavaScript, and CSS for the front end was driven by the need for simplicity and a familiar foundation. As other technologies were new, starting with a known stack allowed for a smoother learning curve.

### Back-end:
NodeJS was chosen for the backend due to its ease of use and scalability. Express provided a robust framework for building the server. bcrypt was selected for password encryption based on its proven security. uuid was used for token generation, providing unique identifiers securely.

### Database:
PostgreSQL was preferred over MySQL due to the developer's proficiency and classroom exposure. Docker was chosen to containerize the database, enhancing deployment and scalability.

## Architecture Explanation

### Front-end:
The front-end architecture comprises multiple HTML pages, incorporating inline JavaScript and CSS. Images for users and groups are stored alongside pages in static and are not implemented in the app.

### Back-end:
The NodeJS server, powered by Express, handles backend operations. bcrypt ensures secure password storage, and uuid facilitates token generation. Docker is used for containerized deployment.

### Database:
PostgreSQL serves as the database, deployed within a Docker image. The server, responsible for file paths, includes HTML and CSS pages in its image.

## Key Architecture Details

- **Session Management:** Implemented for user authentication using the knowledge acquired in class.
- **Encryption Choice:** Selection of bcrypt for password storage due to its security advantages over sha256.
- **Deployment Strategy:** Use of Docker for both the database and NodeJS server for seamless deployment and scalability.

## Challenges and Key Points

- **Storage of Images:** Difficulty in managing storage of user and group images in the database. An area for future improvement and optimization.
- **Learning Curve:** Acquiring proficiency in Docker and NodeJS was challenging but essential for project success.

## Post-Mortem

### Human Aspect:

#### Personal Reflection:

- **Individual Learning:** Gained insights into various technologies but faced limitations due to the absence of collaborative input, especially when choosing the stack. 
- **Deployment Issues:** Difficulties in deploying due to suboptimal technology choices, hindering the project's accessibility.


### Technological Aspect:

#### Achievements:
- **Successful Learning Curve:** Acquired new skills in Docker and NodeJS during the project.
- **Secure Authentication:** Implementation of robust password encryption using bcrypt.

#### Areas for Improvement:
- **Image Storage Optimization:** Explore better methods for handling image storage.
- **Technology Choices:** Reevaluate technology choices for potential optimization. Express and session are not compatible with a deployement in Kubernetes as it is a security breach. JWT seams like a great alternative to it in the future.
The images are also deployed in docker hub but due to this security breach it is impossible to use them in the current state.

## Conclusion

I managed to implement all the features I wanted in this application, starting to consider deployment towards the end. For these reasons, I am very satisfied with this project, as it pushed me to push my limits, never having undertaken a project of this magnitude before.