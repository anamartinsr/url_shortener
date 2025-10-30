FROM node:20-bullseye

WORKDIR /usr/src/url_shortener

COPY package*.json ./

RUN npm ci 

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
