#Use official Node image as base
FROM node:18-alpine

#Set working directory inside container
WORKDIR /app

#Copy package files first (so Docker caches dependencies layer)
COPY package.json package-lock.json ./

#install dependencies
RUN npm install

#Copy the rest of the frontend code
COPY . .

#Start the react dev server
CMD ["npm", "start"]