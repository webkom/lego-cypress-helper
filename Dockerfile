FROM node:16-slim

RUN apt-get update && \
    apt-get install wget gnupg2 -y

RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -

# Why buster-pgdg? => docker run node:16-slim cat /etc/os-release
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ buster-pgdg main" | tee  /etc/apt/sources.list.d/pgdg.list

RUN apt-get update -qq && \
     mkdir -p /usr/share/man/man1 && \
     mkdir -p /usr/share/man/man7 && \
     apt-get install -y --no-install-recommends postgresql-client-12.3 && \
     rm -rf /var/lib/apt/lists/* && \
     apt-get clean

RUN mkdir /app
WORKDIR /app

COPY . /app
RUN yarn

EXPOSE 3000

CMD ["node", "index.js"]
