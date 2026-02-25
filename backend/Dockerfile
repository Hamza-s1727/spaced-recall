FROM node:22

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $PORT

ENV NUXT_HOST=0.0.0.0

ENV NUXT_PORT=$PORT

CMD ["npm", "run", "dev"]

