FROM node:8

WORKDIR /usr/src/app


COPY ./ ./


RUN yarn

CMD cd /app

RUN yarn

RUN cd ..

CMD ["npm", "run", "build"]


EXPOSE 8080
EXPOSE 6379
EXPOSE 5432

CMD ["npm", "run", "start"]
