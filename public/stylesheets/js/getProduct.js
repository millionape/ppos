var tmpArray = [];
var tableStructure = {
    id: '',
    productBarcode: '',
    productName: '',
    quantity: '',
    price: '',
    promotion: ''
}
var total = 0.0;
var recieveMoney = 0.0;

function removeItemFromtable(index) {
    tmpArray.splice(index, 1);
    drawTable(tmpArray);

}

function printJson(dateStr) {

    moment.locale('th');
    var dt = moment().format('LLLL');
    var htmlForm = '<h3>***Thank you***</h3> <h4>.ใบรายการสินค้า</h4><h5>' + dt.toString() + '</h5><h5>ราคารวม=   ' + total.toString() + '   บาท</h5> <h5>รับเงินมา=   ' + recieveMoney.toString() + '   บาท</h5> <h5>เงินทอน=   ' + (recieveMoney - total).toString() + '   บาท</h5><h5>"ขอบคุณที่ใช้บริการครับ"</h5><h5>----------------------</h5>';
    printJS({
        printable: tmpArray,
        properties: [{
                field: 'productName',
                displayName: 'รายการ'
            },
            {
                field: 'quantity',
                displayName: 'จำนวน'
            },
            {
                field: 'price',
                displayName: 'ราคาต่อหน่วย'
            }
        ],
        header: htmlForm,
        type: 'json'
    });

}

function checkOutFunc() {
    $('#recvMoney').unbind('keyup');
    $('#modalSaveBtn2').unbind('click');
    $('#checkOutModal').modal('show');
    $('#checkOutTotal').text($('#totalPriceCard').text());
    $('#recvMoney').focus();
    $('#recvMoney').val('');
    $('#recvMoney').keyup(function () {
        var dInput = this.value;
        console.log(dInput);
        var change = parseFloat(dInput) - parseFloat($('#checkOutTotal').text());
        $("#moneyChange").text(change);
        if (change < 0) {
            $('#changeCard').attr('class', 'card-header bg-danger text-light mt-3');
        } else if (change >= 0) {
            $('#changeCard').attr('class', 'card-header bg-success text-light mt-3');
        } else {
            $('#changeCard').attr('class', 'card-header bg-danger text-light mt-3');
        }
    });
    $('#recvMoney').on('keypress', function (e) {
        if (e.which == 13) {
            recieveMoney = parseFloat($('#recvMoney').val());
            if (recieveMoney > 0) {
                var jdat = JSON.stringify(tmpArray);
                console.log('json data = ', jdat);
                $.ajax({
                    type: 'POST',
                    url: '/pos/changeQuantity',
                    contentType: "application/json",
                    dataType: "json",
                    data: jdat,
                    success: function (res) {
                        console.log('response--->', res);
                    }
                });
                $('#checkOutModal').modal('hide');
                $('#finishModal').modal('show');
                $("#finishTable > tbody").empty();

                for (var dat of tmpArray) {
                    var row = "<tr><td>" + dat.productBarcode.toString() + "</td> <td>" + dat.productName.toString() + "</td> <td>" + dat.quantity.toString() + "</td> <td>" + parseFloat(dat.price).toString() + "</td> <td>" + (parseFloat(dat.quantity) * parseFloat(dat.price)).toString() + "</td> </tr>";
                    $("#finishTable > tbody").append(row);
                    console.log('finished modal quantity:', Number(dat.quantity), 'price:', Number(dat.price));
                }
                $('#finishTotalPrice').text(total);
                $('#finishRecv').text(recieveMoney);
                $('#finishChange').text(recieveMoney - total);
            } else {
                alert('กรุณาใส่จำนวนเงินที่รับมา');
            }
        }
    });
    $('#modalSaveBtn2').click(function () {
        recieveMoney = parseFloat($('#recvMoney').val());
        if (recieveMoney > 0) {
            var jdat = JSON.stringify(tmpArray);
            console.log('json data = ', jdat);
            $.ajax({
                type: 'POST',
                url: '/pos/changeQuantity',
                contentType: "application/json",
                dataType: "json",
                data: jdat,
                success: function (res) {
                    console.log('response--->', res);
                }
            });
            $('#checkOutModal').modal('hide');
            $('#finishModal').modal('show');
            $("#finishTable > tbody").empty();
            for (var dat of tmpArray) {
                var row = "<tr><td>" + dat.productBarcode.toString() + "</td> <td>" + dat.productName.toString() + "</td> <td>" + dat.quantity.toString() + "</td> <td>" + parseFloat(dat.price).toString() + "</td> <td>" + (parseFloat(dat.quantity) * parseFloat(dat.price)).toString() + "</td> </tr>";
                $("#finishTable > tbody").append(row);
                console.log('finished modal quantity:', Number(dat.quantity), 'price:', Number(dat.price));
            }
            $('#finishTotalPrice').text(total);
            $('#finishRecv').text(recieveMoney);
            $('#finishChange').text(recieveMoney - total);
        } else {
            alert('กรุณาใส่จำนวนเงินที่รับมา');
        }
        // //////////////  
    });
    // $('#modalSaveBtn').click(function(){
    //     $("#moneyChange").text($('#recvMoney').val());
    // });

}

function showEditModal(index) {
    $('#exampleModal').modal('show');
    var obj = {
        name: tmpArray[index].productName,
        barcode: tmpArray[index].productBarcode,
        price: tmpArray[index].price,
        quantity: tmpArray[index].quantity
    }
    $("#pNameInput").val(obj.name);
    $("#pBarcodeInput").val(obj.barcode);
    $("#pPrice").val(obj.price);
    $('#pQuantity').val(obj.quantity);
    //////////////////////////////////////////////////////
    $("#pNameInput").prop('disabled', true);
    $("#pBarcodeInput").prop('disabled', true);
    $("#pPrice").prop('disabled', true);

    $('#modalSaveBtn').click(function () {
        tmpArray[index].quantity = parseFloat($('#pQuantity').val());
        console.log('quantity of this : ', tmpArray[index].quantity);
        console.log('all of items:', tmpArray);
        $('#exampleModal').modal('hide');
        drawTable(tmpArray);
        total = 0.0;
        for (let i of tmpArray) {
            const price = parseFloat(i.price);
            const quantity = parseFloat(i.quantity);
            //console.log(i.productName + " / " + price + ' / ' + quantity);
            total += (price * quantity);
            //console.log(total);
        }
        $('#totalPriceCard').text(total.toFixed(2));
        $('#modalSaveBtn').unbind('click');
        // $('#exampleModal').modal('hide');
    });
    $('#listRemove').click(function () {
        tmpArray.splice(index, 1)
        drawTable(tmpArray);
        $('#exampleModal').modal('hide');
        total = 0.0;
        for (let i of tmpArray) {
            const price = parseFloat(i.price);
            const quantity = parseFloat(i.quantity);
            //console.log(i.productName + " / " + price + ' / ' + quantity);
            total += (price * quantity);
            //console.log(total);
        }
        $('#totalPriceCard').text(total.toFixed(2));
        $('#listRemove').unbind('click');
        $('#barcodeInput').focus();
    })

}

function addCustomProduct() {
    var tmpStructure = {
        id: 'xxx',
        productBarcode: 'xxxxxxxx',
        productName: $('#customPname').val(),
        quantity: Number($('#customQuantity').val()),
        price: Number($('#customPrice').val()),
        promotion: '--'
    }
    tmpArray.push(tmpStructure);
    drawTable(tmpArray);
    total = 0.0;
    for (let i of tmpArray) {
        const price = parseFloat(i.price);
        const quantity = parseFloat(i.quantity);
        console.log(i.productName + " / " + price + ' / ' + quantity);
        total += (price * quantity);
        console.log(total);
    }
    $('#totalPriceCard').text(total.toFixed(2));
    $('#customPname').val('');
    $('#customPrice').val('');
    $('#barcodeInput').focus();
}

function displayTotalPrice() {
    total = 0.0;
    for (let i of tmpArray) {
        const price = parseFloat(i.price);
        const quantity = parseFloat(i.quantity);
        console.log(i.productName + " / " + price + ' / ' + quantity);
        total += (price * quantity);
        console.log(total);
    }
    $('#totalPriceCard').text(total.toFixed(2));
    $('#barcodeInput').focus();
}

function getProduct(bar) {
    //console.log(bar)
    $.ajax({
        url: "/pos/getProductByBarcode?bar=" + bar.trim(),
        type: "GET",
        dataType: 'json',
        success: function (res) {
            //console.log + ("get item" + bar + ' res=')

            console.log(res);
            if (res === null) {
                // alert('ไม่พบสินค้านี้ในฐานข้อมูล');
                $('#modalNotfound').modal('show');
                return;
            }
            if (res.status === 0) {
                alert('error from DB connector');
            } else if (res.length < 1) {
                alert('no data matching in DB');
            } else {
                var tmpStructure = {
                    id: '-',
                    productBarcode: res.product_NUMBER.trim(),
                    productName: res.product_NAME,
                    quantity: Number($('#quantityInput').val()),
                    price: Number(res.price),
                    promotion: '--',
                    dateTime: moment().format().toString()

                }
                for (let i of tmpArray) {
                    if (i.productBarcode === tmpStructure.productBarcode) {
                        i.quantity += Number($('#quantityInput').val());
                        console.log(tmpArray);
                        drawTable(tmpArray);
                        total = 0.0;
                        for (let i of tmpArray) {
                            const price = parseFloat(i.price);
                            const quantity = parseFloat(i.quantity);
                            console.log(i.productName + " / " + price + ' / ' + quantity);
                            total += (price * quantity);
                            console.log(total);
                        }
                        $('#totalPriceCard').text(total.toFixed(2));
                        $('#barcodeInput').focus();
                        $('#quantityInput').val('1');
                        return;
                    }
                }
                tmpArray.push(tmpStructure);
                tmpArray = tmpArray.sort(function (obj1, obj2) {
                    var dateA = new Date(obj1.dateTime),
                        dateB = new Date(obj2.dateTime);
                    return dateB-dateA;
                });
                drawTable(tmpArray);
                console.log(tmpArray)

            }
            total = 0.0;
            for (let i of tmpArray) {
                const price = parseFloat(i.price);
                const quantity = parseFloat(i.quantity);
                console.log(i.productName + " / " + price + ' / ' + quantity);
                total += (price * quantity);
                console.log(total);
            }
            $('#totalPriceCard').text(total.toFixed(2));
            $('#quantityInput').val('1');
            $('#barcodeInput').focus();
        }
    });

}

function drawTable(arr) {
    var t = $('#example').DataTable();
    t.rows().remove().draw();
    for (var raw of arr) {
        t.row.add([
            raw.id,
            raw.productBarcode,
            raw.productName,
            raw.quantity,
            raw.price,
            raw.promotion,
            raw.quantity * raw.price
        ]).draw(false);
    }
    $('#barcodeInput').focus();
}