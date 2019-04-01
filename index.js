const express = require('express');
const app = express();
const port = 3030;
const { exec } = require('child_process');

const pg_host = process.env.PG_HOST;
const pg_database = process.env.PG_DATABASE;
const pg_username = process.env.PG_USERNAME;

console.log(
  `Starting lego-cypress-helper with PG_HOST=${pg_host}, PG_DATABASE=${pg_database}, PG_USERNAME=${pg_username}`
);

const backup = () => {
  const pg_commands = `select pg_terminate_backend(pg_stat_activity.pid) from pg_stat_activity where pg_stat_activity.datname='${pg_database}_copy'; drop database if exists ${pg_database}_copy; create database ${pg_database}_copy with template ${pg_database};`;
  const cmd = `echo "${pg_commands}" | psql -h ${pg_host} -U ${pg_username} postgres`;
  console.log(`Running: ${cmd}`);
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error('Error while running db copy');
      console.error(err.toString());
      return;
    }

    console.log('db copy was generated');
  });
};

app.get('/', (req, res) => res.send('OK'));
app.post('/', (req, res) => {
  console.log('post to lego-cypress-helper');

  const pg_commands = `select pg_terminate_backend(pg_stat_activity.pid) from pg_stat_activity where pg_stat_activity.datname='${pg_database}'; drop database if exists ${pg_database}; create database ${pg_database} with template ${pg_database}_copy;`;
  const cmd = `echo "${pg_commands}" | psql -h ${pg_host} -U ${pg_username} postgres`;

  console.log(`Running: ${cmd}`);
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error('Error while restoring db');
      console.error(err.toString());
      res.status(500).send('ERROR');
      return;
    }

    console.log('Successfully restored');
    res.send('OK');
  });
});

backup();
app.listen(port, () =>
  console.log(`lego-cypress-helper listening on port ${port}!`)
);
