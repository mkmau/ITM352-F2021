var express = require('express');
var app = express();
var myParser = require("body-parser");

var products = require('./product_data.json');
products.forEach( (prod,i) => {prod.total_sold = 0});

app.get("/product_data.js", function (request, response, next) {
    response.type('.js');
    var products_str = `var products = ${JSON.stringify(products)};`;
    response.send(products_str);
 });

function isNonNegativeInteger(inputString, returnErrors = false) {
    // Validate that an input value is a non-negative integer
    // inputString is the input string; returnErrors indicates how the function returns: true means return the
    // array and false means return a boolean.

    errors = []; // assume no errors at first
    if (Number(inputString) != inputString) {
        errors.push('Not a number!'); // Check if string is a number value
    }
    else {
        if (inputString < 0) errors.push('Negative value!'); // Check if it is non-negative
        if (parseInt(inputString) != inputString) errors.push('Not an integer!'); // Check that it is an integer
        if (inputString = 0) errors.push('Please enter a value greater than zero!')
    }
    return returnErrors ? errors : (errors.length == 0);
}


app.all('*', function (request, response, next) {
    console.log(request.method + ' to path: ' + request.path);
    next();
});

app.get('/test', function (request, response, next) {
    response.send('Got a GET request to path: test');
});

// why do you need multiple paths? - to execute multiple rules?
// 56 min of lab 13 3rd video how do you update the file itself? Thats the key to A1

app.use(myParser.urlencoded({ extended: true}));

app.post("/process_form", function (request, response) {
    let POST = request.body; 
    let brand = products[0]['brand'];
    let brand_price = products[0]['price'];

    if (typeof POST ['quantity_textbox'] != 'undefined')
    {
        let quantity = POST ['quantity_textbox'];
        if (isNonNegativeInteger(quantity)) {
            products[0]['total_sold'] += Number(quantity);
            response.send(`<h2>Thank you for purchasing ${quantity} ${brand}. Your total is \$${quantity * brand_price}!</h2>`);
        } else {
            response.send (`${quantity} is not a valid quantity`);
        }
    }
 });

app.use(express.static('./public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback 33141448