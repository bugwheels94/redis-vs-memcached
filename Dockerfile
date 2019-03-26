FROM keymetrics/pm2:10-alpine


# RUN apt update
# RUN apt install -y poppler-utils libreoffice pdf2svg
WORKDIR /home/
COPY package*.json ./
RUN npm i