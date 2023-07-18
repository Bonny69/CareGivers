FROM node:18

WORKDIR /backend/charts

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5001

CMD [ "node", "charts.js" ]