#Node image
FROM node:20

# Declaring env
ENV NODE_ENV production

# Setting up the work directory
WORKDIR /express-docker

# Copy only package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Installing dependencies
RUN npm install

# Copying the rest of the application
COPY . .

# Exposing server port
EXPOSE 8080

# Running the server
CMD ["npm", "start"]
