FROM node:23-alpine

WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build

ENV NODE_ENV=production
EXPOSE 7623

RUN npm run db:migrate

CMD ["npm", "start"]
