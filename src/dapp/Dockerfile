FROM node:boron 

WORKDIR /usr/src/app
COPY package.json .
RUN npm install
RUN npm install forever -g
COPY . . 
EXPOSE 3000

CMD ["forever","bin/www"]

