FROM node:20-bookworm-slim

RUN npm install -g npm@11.21.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
