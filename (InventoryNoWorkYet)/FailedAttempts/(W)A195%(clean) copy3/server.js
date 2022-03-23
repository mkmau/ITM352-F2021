/* 
Copied from Assignment 1 example video and info_server_Ex4.js from Lab13
Mau Assignment 1 Server
*/
var data = require('./public/products.js'); //load products.js file and set to variable 'data'
var products = data.products; //set variable 'products_array' to the products array in the products.js file
var querystring = require('querystring'); //read variable 'queryString' as the loaded query-string module
var express = require('express'); //load and cache express module
var app = express(); //set module to variable 'app'
var myParser = require("body-parser"); //load and cache body parser module - Lab13

app.all('*', function (request, response, next) { //for all request methods...
    console.log(request.method + ' to ' + request.path); //write in the console the request method and its path
    next(); //move on
});

//from lab 13 GET request to products page
app.get('/products.js', function (request, response, next) {
    response.type('.js');
    var products_string = `var products = ${JSON.stringify(products)};`;
    response.send(products_string);
});

function isNonNegativeInteger(q, return_errors = false) {
    errors = []; // Assume no errors at first.
    if (q == '') q = 0; // Blank quantities = 0.
    if (Number(q) != q) errors.push('<font color="red">Not a number!</font>'); // Check if string is a number value
    if (q < 0) errors.push('<font color="red">Negative value!</font>'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('<font color="red">Not an integer!</font>'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}

app.use(myParser.urlencoded({ extended: true })); //get data in the body

//processing the form using a post request
app.post("/process_form", function (request, response, next) {
    let POST = request.body; // data would be packaged in the body
    var errors = {}; // no errors initially
    errors['no_quantities'] = 'Please enter a valid quantity!';

    for (i = 0; i < products.length; i++) {
        quantity = POST['quantity' + i];
        // Error alert if invalid quantities inputted into textboxes.
        if (isNonNegativeInteger(quantity) == false) {
            errors['quantity' + i] = `Please enter valid quantities for ${products[i].name}`;
        }
        if (quantity > 0) {
            delete errors['no_quantities']; // Delete errors if valid quantities.
            // Validate quantities by checking available amount in inventories.
            if (quantity > products[i].quantity_available) { // Error alert if quantity submitted is more than available in inventories.
                errors['quantity' + i] = `${quantity} of ${products[i].name} not available. Only ${products[i].quantity_available} available.`;
            }
        }
    }

        // Querystring based on POST request.
        QString = querystring.stringify(POST);
        if (JSON.stringify(errors) === '{}') {
            // Remove quantity for amount of products i purchased.
            for (i = 0; i < products.length; i++) {
                products[i].quantity_available -= Number(POST['quantity' + i]); 
            }
            // Redirect customer to invoice.html if valid quantities entered.
            response.redirect("./invoice.html?" + QString);
        } else { // Else, give the errors.
            let errObj = { 'error': JSON.stringify(errors) };
            QString += '&' + querystring.stringify(errObj);
            response.redirect("./products_display.html?" + QString); // Redirect to store.html if errors.
        }
    });

// taken from assignment 1 examples
app.use(express.static('./public')); // root in the 'public' directory so that express will serve up files from here

app.listen(8080, () => console.log(`listening on port 8080`)); //run the server on port 8080 and show it in the console

           