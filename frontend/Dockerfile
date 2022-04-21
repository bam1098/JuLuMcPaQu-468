### STAGE 1: Build ###
FROM node:14-slim as build
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY ./package.json /usr/src/app/package.json
COPY ./yarn.lock /usr/src/app/yarn.lock
RUN yarn install --silent
RUN yarn global add react-scripts -g --silent
COPY . /usr/src/app
RUN yarn build

### STAGE 2: Production Environment ###
FROM nginx:1.16.1-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]