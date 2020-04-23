FROM node:12-alpine

COPY ./storybook_build /var/www/storybook

ENTRYPOINT ["npx", "http-server", "/var/www/storybook", "-p", "80"]