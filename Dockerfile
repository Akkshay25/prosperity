FROM node:13.3.0 AS compile-image

RUN npm install -g yarn

WORKDIR /opt/ng
COPY package.json yarn.lock ./
RUN yarn install

ENV PATH="./node_modules/.bin:$PATH" 

COPY . ./
RUN ng build

FROM nginx

COPY --from=compile-image /opt/ng/dist/prosperity /usr/share/nginx/html
