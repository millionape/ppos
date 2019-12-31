var firebase = require("firebase-admin");
var serviceAccount = require("./dbKey.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://minimartpos.firebaseio.com"
});

var db = firebase.database();

var ref = db.ref("datas");
ref.once("value", function(snapshot) {
    snapshot.forEach((child) => {
      console.log(child.val()); 
    });
});
// ref.update({
//   "guntest1":{
//     "cost" : "1222",
//     "product_NAME" : "ygygyg"
//   }
// }).then(function(){
//   console.log("success");
// })