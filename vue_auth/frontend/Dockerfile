# Use the official Node.js LTS (Long Term Support) image as the base image
FROM node:lts

# Set the working directory inside the container
WORKDIR /frontend

# Copy package.json and package-lock.json files to the container's working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files from the Vue.js project to the container's working directory
COPY . .

# Expose port 8080 for the Vue.js application
EXPOSE 8080

# Start the Vue.js application using the production build
CMD ["npm", "run", "frontend"]
