FROM node:alpine


RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY src/package.json src/package.json
COPY src/package-lock.json src/package-lock.json
RUN npm install
COPY src/ .

EXPOSE 3000
CMD ["npm", "start"]
