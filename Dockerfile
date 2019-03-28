FROM node:11-slim

RUN apt-get update && \
     mkdir -p /usr/share/man/man1 && \
     mkdir -p /usr/share/man/man7 && \
     apt-get install -y --no-install-recommends postgresql-client-9.6 && \
     rm -rf /var/lib/apt/lists/* && \
     apt-get clean

RUN mkdir /app
WORKDIR /app

COPY . /app
RUN yarn

EXPOSE 3000

CMD ["node", "index.js"]
