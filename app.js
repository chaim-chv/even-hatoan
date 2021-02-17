const express = require('express')
const bodyParser = require('body-parser')
const dburl = process.env.JAWSDB_URL

const mysql = require('mysql')

const db = mysql.createConnection(dburl);

db.connect();

const app = express()
const port = process.env.PORT || 5000;
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(express.static('views'))

app.get('/', async function (req, res) {
    res.status(200).render('main')
})

app.get('/account', async function (req, res) {
  res.status(200).render('account')
})

app.get('/lost', async function (req, res) {
    res.status(200).render('lost')
})

app.get('/found', async function (req, res) {
    res.status(200).render('found')
})

app.post('/data/lost', async function (req, res) {
    let { id, city, item, category } = req.body
    if ((id == '') || (!id)) { id = '%' }
    if ((city == '') || (!city)) { city = '%' }
    if ((item == '') || (!item)) { item = '%' }
    if ((category == '') || (!category)) { category = '%' }
    console.log(`got request. city is ${city} item is ${item} category is ${category}`)
    db.query(`SELECT * FROM founds WHERE id LIKE '${id}' category LIKE '${category}' AND item LIKE '%${item}%' AND city LIKE '${city}' AND status = 1`, function (error, results, fields) {
      if (error) console.log(error);
      console.log(results)
      if (!results[0]) {
        console.log('zero results')
        res.status(204)
      } else {
        res.status(200).json(results)
      }
    })
})

app.post('/data/found', async function (req, res) {
  let { city, item, category } = req.body
  let now = new Date(Date.now())
  let status = 1
  let description = 'no desc'
  let created_at = new Date(Date.now())
  console.log(`got founded item! city is ${city} name is ${item} category is ${category}`)
  db.query(`INSERT INTO founds (item, city, category, found_date, status, description, created_at) VALUES ('${item}', '${city}', '${category}', '${now}', '${status}', '${description}', '${created_at}')`, function (error, results, fields) {
    if (error) console.log(error);
    console.log(results.affectedRows)
    if (results.affectedRows !== 1) {
      console.log('not approved')
      res.status(401).json({ result: 'not added to DB' })
    } else {
      res.status(201).json(results)
    }
  })
})

app.listen(port, () => console.log(`app 🚀 started!! in port ${port}`))



//---------------- DB check ----------------//

// check if the tables existed:
// we have 3 tables - founds, losts and users.
// if table not found we create it now:

db.query(`SHOW TABLES LIKE 'founds'`, function (error, results) {
  if (results.length == 0) {
    console.log("DB check: founds table not found, create it now...");
    db.query(
      `CREATE TABLE founds (id INT AUTO_INCREMENT PRIMARY KEY, found_date DATE, status TINYINT NOT NULL DEFAULT 1, description TEXT, category VARCHAR(255), city VARCHAR(255) NOT NULL, user-id INT, email VARCHAR(255), phone VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
      function (error, results) {
        console.log(results, error);
      }
    );
  } else {
    console.log("DB check: find founds table");
  }
});

db.query(`SHOW TABLES LIKE 'losts'`, function (error, results) {
  if (results.length == 0) {
    console.log("DB check: losts table not found, create it now...");
    db.query(
      `CREATE TABLE losts (id INT AUTO_INCREMENT PRIMARY KEY, found_date DATE, status TINYINT NOT NULL DEFAULT 1, description TEXT, category VARCHAR(255), city VARCHAR(255) NOT NULL, user-id INT, email VARCHAR(255), phone VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
      function (error, results) {
        console.log(results, error);
      }
    );
  } else {
    console.log("DB check: find losts table");
  }
});

db.query(`SHOW TABLES LIKE 'users'`, function (error, results) {
  if (results.length == 0) {
    console.log("DB check: users table not found, create it now...");
    db.query(
      `CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, nickname VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, hash VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
      function (error, results) {
        console.log(results, error);
      }
    );
  } else {
    console.log("DB check: find users table");
  }
});
