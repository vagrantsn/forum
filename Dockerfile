FROM 'node:8-alpine'
COPY . /src
WORKDIR /src

RUN npm install -g nodemon
RUN npm install
CMD nodemon index.js
EXPOSE 3000
