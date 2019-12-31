var express = require('express');
var router = express.Router();
//var mysql = require('mysql');
var md5 = require('md5');
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
// var serviceAccount = require("./dbKey.json");

// firebase.initializeApp({
//   credential: firebase.credential.cert(serviceAccount),
//   databaseURL: "https://minimartpos.firebaseio.com"
// });

var dbf = firebase.database();
var ref = dbf.ref("datas");

router.get('/', function (req, res, next) {
    const token = req.body.token
    console.log('recv token is:', token);
    res.render('backShop', {
        authMsg: '',
        token: token
    });
});
router.post('/saveProduct', function (req, res) {
    var bar = req.body.barcode;
    console.log('post recv =', req.body);
    var bundle = {
        cost : req.body.cost,
        date : req.body.lastEdit,
        price: req.body.price,
        product_NAME : req.body.name,
        product_NUMBER : req.body.barcode,
        quantity : req.body.quantity,
        description : req.body.description,
        promotion : req.body.promotion
    }
    try {
        ref.child(bar).update(bundle).then(function(){
            res.json({updateStatus:'OK'});
        });
        // let sql = 'UPDATE productList SET productDescription=\'' + req.body.description + '\',productQuantity=' + req.body.quantity + ',productName=\'' + req.body.name + '\', productCost=' + req.body.cost + ',productPrice=' + req.body.price + ',productPromotion=\'' + req.body.promotion + '\',productLatsEditDate=\'' + req.body.lastEdit + '\' WHERE productBarcode=\'' + req.body.barcode + '\';';
        // let query = db.query(sql, (err, results) => { // สั่ง Query คำสั่ง sql
        //     if (err) throw err // ดัก error
        //     console.log(results) // แสดงผล บน Console 
        //     res.send(results);
        // });
    } catch (err) {
        console.log("ERROR")
        console.log(err)
    }

});
router.get('/delProduct', function (req, res) {
    const barr = req.query.bar.trim();
    console.log('recv =', barr);
    try {
        // let sql = 'DELETE FROM productList WHERE TRIM(productBarcode) LIKE \'' + barr.trim() + '\';';
        // let query = db.query(sql, (err, results) => { // สั่ง Query คำสั่ง sql
        //     if (err) throw err // ดัก error
        //     console.log(results) // แสดงผล บน Console 
        //     res.send(results);
        // });
        if(barr !== undefined && barr !== null){
            ref.child(barr).remove().then(function(){
                res.json({deleteStatus:'OK'});
            });
        }else{
            res.json({deleteStatus:'NG'});
        }
        
    } catch (err) {
        console.log("ERROR")
        console.log(err)
    }

});
router.post('/saveNewProduct', function (req, res) {
    var bar = req.body.barcode;
    console.log('post recv =', req.body);
    console.log('barcode len =>',req.body.barcode.length);
    if (req.body.barcode.length === 0) {
        
    } else {
        try {
            ref.child(bar).once("value", async function(snapshot) {
                var data = await snapshot.val();   //Data is in JSON format.
                if(data !== null){
                    res.json({
                        result: 'match'
                    });
                }else{
                    const barcode = req.body.barcode;
                    var bundle = {[barcode]:{
                        cost : req.body.cost,
                        date : req.body.lastEdit,
                        price: req.body.price,
                        product_NAME : req.body.name,
                        product_NUMBER : req.body.barcode,
                        quantity : req.body.quantity,
                        description : req.body.description,
                        promotion : req.body.promotion
                    }}
                    console.log('bundle = ',bundle)
                    ref.update(bundle).then(function(){
                        res.json({
                            affectedRows: 1
                        });
                    });
                }
                console.log(data);
            });
        } catch (err) {
            console.log("ERROR")
            console.log(err)
        }
    }

});
router.get('/findbybarcode', function (req, res, next) {
    const bar = req.query.bar
    console.log('bar recv ===', bar);
    if (bar !== undefined) {
        ref.child(bar).once("value", async function(snapshot) {
            var data = await snapshot.val();   //Data is in JSON format.
            res.json(data);
            //console.log(data);
        });
    } else {
        res.json({
            status: 0
        })
    }
});
router.get('/intervalTest', function (req, res, next) {
    res.json({status:"HELLO FROM INTERVAL TASK"});
});

router.get('/findbyname', function (req, res, next) {
    const pname = req.query.pname
    if (pname !== undefined) {
        try {
            // let sql = 'SELECT `id`,`productQuantity`,`productName`,`productBarcode`,`productCost`,`productPrice`,`productPromotion`,`productLatsEditDate` FROM productList WHERE TRIM(productName) LIKE \'%' + pname + '%\';';
            // let query = db.query(sql, (err, results) => { // สั่ง Query คำสั่ง sql
            //     if (err) throw err // ดัก error
            //     //console.log(results) // แสดงผล บน Console 
            //     res.json(results) // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser
            // })
            ref.once("value", function(snapshot) {
                var arr = [];
                snapshot.forEach((child) => {
                    //console.log(child.val());
                    var itemName = child.val().product_NAME;
                    if(itemName !== undefined){
                    var n = itemName.search(pname);
                    //console.log('item name =',itemName,'n=',n);
                    if(n >=0){
                        arr.push(child.val());
                    }}
                });
                //console.log(arr);
                res.json(arr)
            });
        } catch (err) {
            console.log("ERROR")
            console.log(err)
        }
    } else {
        res.json({
            status: 0
        })
    }
});
router.get('/findall', function (req, res, next) {
    try {
        // let sql = 'SELECT `id`,`productQuantity`,`productName`,`productBarcode`,`productCost`,`productPrice`,`productPromotion`,`productLatsEditDate` FROM productList;';
        // let query = db.query(sql, (err, results) => { // สั่ง Query คำสั่ง sql
        //     if (err) throw err // ดัก error
        //     //console.log(results) // แสดงผล บน Console 
        //     res.json(results) // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser

        // });
        ref.once("value", function(snapshot) {
            var arr = [];
            snapshot.forEach((child) => {
                //console.log(child.val());
                arr.push(child.val());
            });
            //console.log(arr);
            res.json(arr)
        });

    } catch (err) {
        console.log("ERROR")
        console.log(err)
    }
});
module.exports = router;