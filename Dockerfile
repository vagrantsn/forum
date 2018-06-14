FROM 'node:8-alpine'
COPY . /src
WORKDIR /src

RUN npm install -g yarn
RUN yarn install
CMD yarn start
EXPOSE 3000
