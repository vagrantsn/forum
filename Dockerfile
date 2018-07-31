FROM 'node:8-alpine'
COPY . /src
WORKDIR /src

RUN npm install -g yarn
RUN yarn add global nodemon
RUN yarn install
CMD yarn dev
EXPOSE 3000
