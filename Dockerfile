FROM node:8

WORKDIR /usr/src/app

COPY ./ ./

RUN yarn

RUN cd ./app && yarn

RUN npm run build

RUN npm install -g forever

EXPOSE 8080
EXPOSE 6379
EXPOSE 5432

CMD log_file_name="`date +%Y_%m_%d_%H_%M`.log" && forever start -l $log_file_name -c "npm run start" .
