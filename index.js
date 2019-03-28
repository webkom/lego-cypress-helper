const express = require('express');
const app = express();
const port = 3030;
const { exec } = require('child_process');

const pg_host = process.env.PG_HOST;
const pg_database = process.env.PG_DATABASE;
const pg_username = process.env.PG_USERNAME;

console.log(`Starting lego-cypress-helper with PG_HOST=${pg_host}, PG_DATABASE=${pg_database}, PG_USERNAME=${pg_username}`);

const backup = () => {
    const cmd = `pg_dump -h ${pg_host} -U ${pg_username} --clean ${pg_database} | grep -v idle_in_transaction_session_timeout > dump`;
    console.log(`Running: ${cmd}`)
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error('Error while running pg_dump');
        console.error(err.toString());
        return;
      }

      console.log('pg_dump was generated');
    });
};

app.get('/', (req, res) => res.send('OK'));
app.post('/', (req, res) => {
    console.log('post to lego-cypress-helper');

    // const cmd = `pg_restore -h ${pg_host} -U ${pg_username} --clean --dbname=${pg_database} dump`;
    const cmd = `psql -h ${pg_host} -U ${pg_username} -d ${pg_database} < dump`;

    console.log(`Running: ${cmd}`)
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error('Error while running pg_restore');
        console.error(err.toString());
        res.status(500).send('ERROR');
        return;
      }

      console.log('Successfully restored');
      res.send('OK');
    });
})

backup();
app.listen(port, () => console.log(`lego-cypress-helper listening on port ${port}!`))

