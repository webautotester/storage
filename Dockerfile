FROM ubuntu
MAINTAINER Xavier Blanc <blancxav@gmail.com>

# Install node
RUN apt-get update -y \
	&& apt-get install curl -y
RUN curl -o /usr/local/bin/n https://raw.githubusercontent.com/visionmedia/n/master/bin/n
RUN chmod +x /usr/local/bin/n
RUN n latest

RUN adduser --quiet --disabled-password --shell /bin/bash --home /home/runner --gecos "User" storage

USER storage
RUN mkdir /tmp/storage
WORKDIR /tmp/storage
RUN mkdir routes
COPY routes/*.js routes/
COPY index.js .
COPY package.json .
RUN npm install

CMD ["node","index.js","mongo"]


