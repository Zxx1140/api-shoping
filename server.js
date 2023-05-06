var express = require('express')
var cors = require('cors')
var app = express()

// get the client
const mysql = require('mysql2');
const bodyParser = require('body-parser');
// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'shopdb'
});


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'shopdb'
});





app.use(cors())
app.use(express.json({
    reviver: (key, value) => {
      if (Array.isArray(value)) {
        const newObj = {};
        value.forEach((v, i) => {
          newObj[i] = v;
        });
        return newObj;
      }
      return value;
    }
  }));

app.get('/stores', function (req, res, next) {
    connection.query(
        'SELECT * FROM `store`',
        function(err, results, fields) {
            res.json(results);
        //   console.log(results); // results contains rows returned by server
         
        }
      );
      
})
app.get('/store/:id', function (req, res) {
    const id = req.params.id;
    connection.query(
        `SELECT s.store_id, s.store_name, s.store_detail, s.store_address, s.store_profile , 
        p.product_id, p.store_id , p.product_name, p.product_detail, p.product_price, p.product_total, p.product_img 
        FROM store s JOIN product p 
        ON s.store_id = p.store_id 
        WHERE s.store_id = ?;`,
        [id],
        function(err, results, fields) {
            res.json(results);
          
         
        }
      );
      
})


app.post('/store/create', function (req, res, next) {
    connection.query(
        'INSERT INTO `store`(`store_name`, `store_detail`, `store_address`, `store_profile`) VALUES (?,?,?,?)',
        [   
            req.body.store_name,
            req.body.store_detail,
            req.body.store_address,
            req.body.store_profile
        ],
        function(err, results, fields) {
            res.json(results);
         
         
        }
      );
      
})
app.put('/store/update', function (req, res, next) {
    connection.query(
        'UPDATE `store` SET `store_name`=? ,`store_detail`=?, `store_address`=? , `store_profile`=? WHERE `store_id` = ?',
        [   
            req.body.store_name,
            req.body.store_deteil,
            req.body.store_address,
            req.body.store_profile,
            req.body.store_id
        ],
        function(err, results, fields) {
            res.json(results);
         
         
        }
      );
      
})
app.delete('/store/delete', function (req, res, next) {
    connection.query(
        'DELETE FROM `store` WHERE `store_id` = ?',
        [   
            req.body.store_id
        ],
        function(err, results, fields) {
            res.json(results);
         
         
        }
      );
      
})

app.post('/product/create', function (req, res, next) {
  try {
      connection.query(
          'INSERT INTO `product`(`store_id`, `product_name`, `product_detail`, `product_price`, `product_total`, `product_img`) VALUES (?, ?, ?, ?, ?, ?)',
          [   
              req.body.store_id,
              req.body.product_name,
              req.body.product_detail,
              req.body.product_price,
              req.body.product_total,
              req.body.product_img
             
          ],
          function(err, results, fields) {
              if (err) throw err;
              res.json(results);
          }
      );
  } catch (error) {
      console.error(error);
      res.status(500).send("ERR");
  }
})




app.get('/search', function (req, res, next) {
  const searchQuery = req.query.q;
  const storeId = req.query.store_id;

  // ตรวจสอบว่า searchQuery และ storeId มีค่าหรือไม่
  if (!searchQuery || !storeId) {
    return res.status(400).json({ message: 'โปรดกรอกข้อมูลคำค้นหาและรหัสร้านค้าก่อนค้นหา' });
  }

  connection.query(
    `SELECT * FROM products WHERE product_name LIKE ? AND store_id = ?`, [`%${searchQuery}%`, storeId],
      function(err, results, fields) {
          res.json(results);
      }
    );
});

app.get('/product/:id', function (req, res) {
  const id = req.params.id;
  try {
      connection.query(
          'SELECT * FROM `product` WHERE product_id = ?',
          [id],
          function(err, results, fields) {
              if (err) throw err;
              res.json(results);
          }
      );
  } catch (error) {
      console.error(error);
      res.status(500).send("ERR");
  }
})

app.listen(5000, function () {
  console.log('CORS-enabled web server listening on port 5000')
})