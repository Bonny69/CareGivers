FROM node:18

WORKDIR /backend/scheduling

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5002

CMD [ "node", "scheduling.js" ]