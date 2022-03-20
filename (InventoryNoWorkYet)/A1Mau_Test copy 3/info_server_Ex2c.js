var express = require('express');
var app = express();

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path: ' + request.path);
    next();
});

app.get('/test', function (request, response, next) {
    response.send('Got a GET request to path: test');
});

// why do you need multiple paths? - to execute multiple rules?

app.use(express.static('./public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback 33141448