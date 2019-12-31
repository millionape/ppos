var express = require('express');
var router = express.Router();
// var mysql = require('mysql');
// // var db = mysql.createConnection({
// //     host: "localhost",
// //     user: "root",
// //     password: "gun11092544",
// //     database: 'inventory'
// // });
// var db = mysql.createPool({
//     connectionLimit: 5,
//     host: 'remotemysql.com',
//     user: 'D7WOCTNgf1',
//     password: 'SGnzsMyHVe',
//     database: 'D7WOCTNgf1',
//     dateStrings: [
//         'DATE',
//         'DATETIME'
//     ]
// })

// db.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
// });
// db.getConnection((err, connection) => {
//     if (err) {
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//             console.error('Database connection was closed.')
//         }
//         if (err.code === 'ER_CON_COUNT_ERROR') {
//             console.error('Database has too many connections.')
//         }
//         if (err.code === 'ECONNREFUSED') {
//             console.error('Database connection was refused.')
//         }
//     }
//     if (connection) connection.release()
//     return
// })
var firebase = require("firebase-admin");
var serviceAccount = require("./dbKey.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://minimartpos.firebaseio.com"
});
var db = firebase.database();
var ref = db.ref("datas");

// function dataInit(){
//     return new Promise(){

//     }
// }

router.get('/', function (req, res, next) {
    const token = req.body.token
    console.log('recv token is:', token);
    res.render('pos', {
        authMsg: '',
        token: token
    });
});
// router.get('/getProductByBarcode', function (req, res, next) {
//     var bar = req.query.bar;
//     if (bar !== undefined) {
//         try {
//             let sql = 'SELECT `id`,`productQuantity`,`productName`,`productBarcode`,`productCost`,`productPrice`,`productPromotion`,`productLatsEditDate` FROM productList WHERE TRIM(productBarcode) LIKE TRIM(\''+bar+'\');';
//             let query = db.query(sql, (err, results) => { // สั่ง Query คำสั่ง sql
//                 if (err) throw err // ดัก error
//                 //console.log(results) // แสดงผล บน Console 
//                 res.json(results) // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser
//             })
//         } catch (err) {
//             console.log("ERROR")
//             console.log(err)
//         }
//     } else {
//         res.json({
//             status: 0
//         })
//     }
// });
router.get('/getProductByBarcode', function (req, res, next) {
    var bar = req.query.bar;
    if (bar !== undefined) {
        ref.child(bar).once("value", async function (snapshot) {
            var data = await snapshot.val(); //Data is in JSON format.
            res.json(data);
            console.log(data);
        });
    } else {
        res.json({
            status: 0
        })
    }
});
router.post('/changeQuantity', function (req, res, next) {
    let data = (req.body);
    //console.log("quantity body is :",data);
    try {
        for (item of data) {
            console.log('item=', item)
            ref.child(item.productBarcode).once("value", async function (snapshot) {
                var data = await snapshot.val(); //Data is in JSON format.
                // res.json(data);
                var dbQuantity = Number(data.quantity);
                var userItemQuantity = Number(item.quantity);
                var diff = dbQuantity - userItemQuantity;
                await ref.child(item.productBarcode).update({
                    quantity: diff.toString()
                }).then(function () {
                    res.json({
                        updateStatus: 'OK'
                    });
                    return;
                });
                //console.log("dbq=",dbQuantity,);
            });
        }
    } catch (err) {
        res.json({
            updateStatus: 'NG'
        });
    }


});




module.exports = router;