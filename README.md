# Steps:
1. Downloaded the application and ran it in my laptop and then dockerised it and once added it to my Dockerhub account
```
# Use an official Node.js runtime as a parent image
FROM node:23-alpine3.19

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json /app/

# Install any needed dependencies specified in package.json
RUN npm install 

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 6041

# Define the command to run the app
CMD ["npm", "start"]

```
