var tmpResult = null;
/*
    $('#eBar').val(res[0].productBarcode);
    $('#eName').val(res[0].productName);
    $('#eCost').val(res[0].productCost);
    $('#ePrice').val(res[0].productPrice);
    $('#ePromotion').val(res[0].productPromotion);
    $('#eLastEdit').val(res[0].productLatsEditDate);
    $('#eDescription').val(res[0].productDescription);
*/
function delProduct(bar) {
    $.ajax({
        url: '/iv/delProduct?bar=' + bar.trim(),
        type: 'GET',
        contentType: 'application/json',
        success: function (res) {
            console.log('success', res);
            if (res.deleteStatus === 'OK') {
                console.log('delete complete!!!');
                $('#modalSaveLoad').modal('hide');
                location.reload();
                //$('#modalInsertSuccess').modal('show');
            } else {
                console.log('error durring insertion');
                $('#modalSaveLoad').modal('hide');
                $('#errorModal1').modal('show');
            }
        }
    });

}

function newProductSave() {
    var dt = moment().format('YYYY-MM-DD HH:mm:ss');
    var bundle = {
        barcode: $('#nBar').val(),
        name: $('#nName').val(),
        cost: $('#nCost').val(),
        price: $('#nPrice').val(),
        quantity: $('#nQuantity').val(),
        promotion: $('#nPromotion').val(),
        lastEdit: dt,
        description: $('#nDescription').val()
    }
    console.log(bundle);
    if (bundle.barcode.length <= 0 || bundle.name.length <= 0 || bundle.cost.length <= 0 || bundle.price.length <= 0 || bundle.quantity.length <= 0) {
        console.log("ERROR EMPTY INPUT");
        alert("กรุณาใส่ข้อมูลให้ถูกต้อง");
        // return;
    } else {
        $('#nBar').val('');
        $('#nName').val('');
        $('#nCost').val('');
        $('#nPrice').val('');
        $('#nQuantity').val('');
        $('#nPromotion').val('');
        $('#nDescription').val('');
        $('#newProductModal').modal('hide');
        $('#modalSaveLoad').modal('show');
        $.ajax({
            url: '/iv/saveNewProduct',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(bundle),
            success: function (res) {
                console.log('success', res);
                if (res.affectedRows > 0) {
                    console.log('insert complete!!!');
                    $('#modalSaveLoad').modal('hide');
                    $('#modalInsertSuccess').modal('show');
                } else {
                    console.log('error durring insertion');
                    $('#modalSaveLoad').modal('hide');
                    $('#errorModal1').modal('show');
                }
            }
        });
    }
}

function saveEditChange() {
    var dt = moment().format('YYYY-MM-DD HH:mm:ss');
    var bundle = {
        barcode: $('#eBar').val(),
        name: $('#eName').val(),
        cost: $('#eCost').val(),
        price: $('#ePrice').val(),
        quantity: $('#eQuantity').val(),
        promotion: $('#ePromotion').val(),
        lastEdit: dt,
        description: $('#eDescription').val()
    }
    var bar = $('#eBar').val();
    console.log('save bundle = ', bundle);
    $.ajax({
        url: '/iv/saveProduct',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(bundle),
        success: function (res) {
            console.log('save success', res);
            findbar(bar);
        }
    });
}

function openProductModal(bar) {
    $('#peditModal').modal('show');
    $("#eBar").prop('readonly', true);
    $("#eLastEdit").prop('readonly', true);

    $.ajax({
        url: "/iv/findbybarcode?bar=" + bar,
        type: "GET",
        dataType: 'json',
        success: function (res) {
            console.log('res len:' + res.length);
            console.log(res);
            if (res.status === undefined) {
                console.log('data is ok');
                // $('#eBar').val(res[0].productBarcode);
                // $('#eName').val(res[0].productName);
                // $('#eCost').val(res[0].productCost);
                // $('#ePrice').val(res[0].productPrice);
                // $('#eQuantity').val(res[0].productQuantity)
                // $('#ePromotion').val(res[0].productPromotion);
                // $('#eLastEdit').val(res[0].productLatsEditDate);
                // $('#eDescription').val(res[0].productDescription);
                // var bundle = {[barcode]:{
                //     cost : req.body.cost,
                //     date : req.body.lastEdit,
                //     price: req.body.price,
                //     product_NAME : req.body.name,
                //     product_NUMBER : req.body.barcode,
                //     quantity : req.body.quantity,
                //     description : req.body.description,
                //     promotion : req.body.promotion
                // }}
                $('#eBar').val(res.product_NUMBER);
                $('#eName').val(res.product_NAME);
                $('#eCost').val(res.cost);
                $('#ePrice').val(res.price);
                $('#eQuantity').val(res.quantity);
                $('#ePromotion').val(res.promotion);
                $('#eLastEdit').val(res.date);
                $('#eDescription').val(res.description);
                // var dt = moment().format('YYYY-MM-DD HH:mm:ss');
                // console.log('moment==',dt);
            } else {
                console.log('data is not ok')
            }
        }
    });

    ;
}

function findbar(bar) {
    $.ajax({
        url: "/iv/findbybarcode?bar=" + bar,
        type: "GET",
        dataType: 'json',
        success: function (res) {
            //console.log('res len:' + res.length);
            console.log(res);
            if (res !== null) {
                var arr = [res];
                drawTable(arr);
                $('#modalLoad').modal('hide');
                $("#ivBarInput").focus();
                $('#resultText').text('ผลลัพธ์การค้นหา : \"' + bar.toString() + '\"');

            } else {
                $('#modalLoad').modal('hide');
                $('#modalNotfound').modal('show');
            }
        }
    });
}

function findname(name) {
    $.ajax({
        url: "/iv/findbyname?pname=" + name,
        type: "GET",
        dataType: 'json',
        success: function (res) {
            console.log('res len:' + res.length);
            console.log(res);
            if (res.length > 0) {
                drawTable(res);
                $('#modalLoad').modal('hide');
                $('#resultText').text('ผลลัพธ์การค้นหา : \"' + name.toString() + '\"');
                $('#ivNameInput').val("")
            } else {
                $('#modalLoad').modal('hide');
                $('#modalNotfound').modal('show');
                $('#ivNameInput').val("")
            }


        }
    });
}

function findall() {
    $.ajax({
        url: "/iv/findall",
        type: "GET",
        dataType: 'json',
        success: function (res) {
            console.log('res len:' + res.length);
            console.log(res);
            if (res.length > 0) {
                drawTable(res);
                $('#modalLoad').modal('hide');
            } else {
                $('#modalLoad').modal('hide');
                $('#modalNotfound').modal('show');
            }


        }
    });
}

function drawTable(arr) {
    var counter = 0;
    var t = $('#example').DataTable();
    t.rows().remove().draw();
    for (var raw of arr) {
        console.log('counter = >:', counter, raw);
        // console.log(raw);
        counter += 1;
        // var bundle = {[barcode]:{
        //     cost : req.body.cost,
        //     date : req.body.lastEdit,
        //     price: req.body.price,
        //     product_NAME : req.body.name,
        //     product_NUMBER : req.body.barcode,
        //     quantity : req.body.quantity,
        //     description : req.body.description,
        //     promotion : req.body.promotion
        // }}
        t.row.add([
            // raw.productBarcode,
            // raw.productName,
            // raw.productQuantity,
            // raw.productCost,
            // raw.productPrice,
            // raw.productPromotion,
            // raw.productLatsEditDate
            raw.product_NUMBER,
            raw.product_NAME,
            raw.quantity,
            raw.cost,
            raw.price,
            raw.promotion,
            raw.date
        ]);
    }
    t.draw();

    // $('#ivBarInput').val('');
    // $('#ivBarInput').focus();

}