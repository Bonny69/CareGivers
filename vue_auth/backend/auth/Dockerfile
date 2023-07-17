FROM node:16-alpine
WORKDIR  backend/auth
COPY package*.json ./
RUN npm install -ci
COPY . .
EXPOSE 5000
CMD ["node", "auth"]