const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12629207',
  password: 'PZI5xTdjmg',
  database: 'sql12629207'
})
app.get('/', (req, res) => {
  res.send("App is Running");
});
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});
app.get('/admin', (req, res) => {
  // res.sendFile(__dirname + '/admin.html');

  connection.query(`SELECT * FROM customer`,
    (err, result, fields) => {
      data = JSON.parse(JSON.stringify(result));
      let qtyC1 = 0;
      let wtC1 = 0;
      let bcC1 = 0;

      let qtyC2 = 0;
      let wtC2 = 0;
      let bcC2 = 0;

      
      console.log(data);
      data.forEach(element => {
        if (element.Owner == "customer1"){
          qtyC1 = qtyC1 + element.Quantity;
          wtC1  = wtC1 + element.Weight;
          bcC1 = bcC1 + element.BoxCount;
        }
        else if (element.Owner == "customer2"){
          qtyC2 = qtyC2 + element.Quantity;
          wtC2  = wtC2 + element.Weight;
          bcC2 = bcC2 + element.BoxCount;
        }
      });

      let qtyTotal = qtyC1 + qtyC2;
      let wtTotal = wtC1 + wtC2;
      let bcTotal = bcC1 + bcC2;

      res.render('admin',
        {
          qtyC1: qtyC1, qtyC2:qtyC2, qtyTotal:qtyTotal,
          wtC1: wtC1, wtC2: wtC2, wtTotal: wtTotal,
          bcC1: bcC1, bcC2: bcC2, bcTotal: bcTotal
        });
    })


});
app.get('/customer', (req, res) => {
  res.sendFile(__dirname + '/customer.html');
});


app.post('/login', (req, res) => {
  let input_id = req.body.id;
  let input_password = req.body.password;

  connection.query('SELECT * FROM auth', (err, rows, fields) => {
    if (err) throw err
    users = JSON.parse(JSON.stringify(rows));
    // console.log(users);
    var isInvalidUser = true;
    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      console.log(user.id);
      if (user.id == input_id && user.password == input_password && input_id == 'admin') {
        console.log(input_id + " authenticated");
        res.redirect('/admin');
        isInvalidUser = false;
        break;
      }
      else if (user.id == input_id && user.password == input_password) {
        console.log(input_id + " authenticated");
        res.redirect('/customer');
        isInvalidUser = false;
        break;
      }
    }
    if (isInvalidUser) {
      res.send('<a href="/login">Invalid User Please Login</a>');
    }

  })
});

app.post('/customer', function (req, res) {
  let orderDate = req.body.orderDate;
  let company = req.body.company;
  let owner = req.body.owner;
  let item = req.body.item;
  let quantity = req.body.quantity;
  let weight = req.body.weight;
  let shipment = req.body.shipment;
  let trackingId = req.body.trackingId;
  let size = req.body.size;
  let count = req.body.count;
  let specification = req.body.specification;
  let checklistQuantity = req.body.checklistQuantity;

  connection.query(`INSERT INTO customer VALUES("${orderDate}",
                                                "${company}",
                                                "${owner}",
                                                "${item}",
                                                "${quantity}",
                                                "${weight}",
                                                "${shipment}",
                                                "${trackingId}",
                                                "${size}",
                                                "${count}",
                                                "${specification}",
                                                "${checklistQuantity}")`,
    (err, result, fields) => {
      if (err) throw err;
      console.log(result);
    })
  res.send('<a href="/customer">Success! Back to Customer Page</a>');
});

app.listen(3000, () => {
  console.log("App is running");
});
