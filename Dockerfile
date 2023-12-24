FROM node:alpine


RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY src/ .

EXPOSE 3000
CMD ["npm", "start"]
