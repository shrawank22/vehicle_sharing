FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install -g truffle@latest

RUN npm install

COPY . .

CMD truffle compile && truffle migrate --network sepolia

