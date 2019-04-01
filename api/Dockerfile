FROM keymetrics/pm2:10-alpine

RUN mkdir -p /opt/app
COPY dist /opt/app
COPY node_modules /opt/app/node_modules

EXPOSE 8080

WORKDIR /opt/app

ENTRYPOINT ["pm2-runtime", "server.js"]
