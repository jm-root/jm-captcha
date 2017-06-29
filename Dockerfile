FROM node:6-alpine
MAINTAINER Jeff YU, jeff@jamma.cn
ENV NODE_ENV production
RUN mkdir -p /app
WORKDIR /app
CMD npm run cluster
COPY . .
RUN npm install --production && npm cache clean
