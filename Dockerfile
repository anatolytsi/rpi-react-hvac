FROM node:alpine


RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY src/ .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
