var captchapng = require('captchapng');
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.set('trust proxy', true);   //支持代理后面获取用户真实ip

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Content-Length, Authorization, Accept');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Content-Type', 'application/json;charset=utf-8');
    if (req.method == 'OPTIONS')
        res.sendStatus(200);
    else
        next();
});

app.get('/:code.img', function (req, res) {
    var p = new captchapng(80, 30, parseInt(req.params.code)); // width,height,numeric captcha
    p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

    var img = p.getBase64();
    var imgbase64 = new Buffer(img, 'base64');
    res.writeHead(200, {'Content-Type': 'image/png'});
    res.end(imgbase64);
});

app.get('/:code', function (req, res) {
    var p = new captchapng(80, 30, parseInt(req.params.code)); // width,height,numeric captcha
    p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

    var img = 'data:image/png;base64,' + p.getBase64();
    res.json({img: img});
});

var port = 80;
process.env['port'] && (port = process.env['port']);
http.createServer(app).listen(port, function () {
    console.info('Express server listening on port ' + port);
});

process.on('uncaughtException', function (err) {
    console.error('Caught exception: ' + err.stack);
});
