FROM node:18

WORKDIR /backend/mqtt

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 1234
CMD [ "node", "mqttService.js" ]