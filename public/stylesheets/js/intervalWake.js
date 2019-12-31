function set_interval() {
    setInterval(function () {
        $.ajax({
            url: '/iv/intervalTest',
            type: 'GET',
            contentType: 'application/json',
            success: function (res) {
                console.log('success', res);
            }
        });
    }, 8000);
}