FROM node:18-alpine AS BUILDER

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm cache clean --force
RUN yarn 
COPY . .

EXPOSE ${PORT_EXPOSE}
CMD ["node","index.js"]