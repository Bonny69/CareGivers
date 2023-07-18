FROM node:18

WORKDIR /backend/otp

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5001

CMD [ "node", "otpService.js" ]