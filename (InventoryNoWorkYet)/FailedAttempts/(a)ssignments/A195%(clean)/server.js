/* 
Copied from Assignment 1 example video and info_server_Ex4.js from Lab13
Mau Assignment 1 Server
*/
var data = require('./public/products.js'); //requiring the products page from the public folder and assigning the action to 'data'
var products = data.products; //taking the data from the products page and assigning it to products
var querystring = require('querystring'); //requiring query-string package and assigning action to 'querystring'
var express = require('express'); //requiring express package 
var app = express(); //set module to variable 'app'
var myParser = require("body-parser"); //load and cache body parser module - Lab13

app.all('*', function (request, response, next) { //for all request methods...
    console.log(request.method + ' to ' + request.path); //write in the console the request method and its path
    next(); //move on
});

//This is from Lab 13 on how to do a get request to the products page
app.get('/products.js', function (request, response, next) {
    response.type('.js'); // respond to get request with js
    var products_string = `var products = ${JSON.stringify(products)};`; // turn var products (defined in the products page) into a string
    response.send(products_string);
});

function isNonNegativeInteger(q, return_errors = false) { //Is non negative integer function defined
    errors = []; // Assume no errors at first.
    if (q == '') q = 0; // Blank quantities = 0.
    if (Number(q) != q) errors.push('<font color="red">Not a number!</font>'); // Check if string is a number value
    if (q < 0) errors.push('<font color="red">Negative value!</font>'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('<font color="red">Not an integer!</font>'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0); 
}

app.use(myParser.urlencoded({ extended: true })); //get data in the body

//Processing the form using a post request
app.post("/process_form", function (request, response, next) {
    let POST = request.body; // Data packaged into the request.body
    var errors = {}; // Assume no errors initially
    errors['no_quantities'] = 'Please enter a valid quantity!'; //error message if there are errors

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
        } else { //if there are errors, notify the user
            let errObj = { 'error': JSON.stringify(errors) };
            QString += '&' + querystring.stringify(errObj);
            response.redirect("./products_display.html?" + QString); // Redirect to products_display.html
        }
});

// taken from assignment 1 examples
app.use(express.static('./public')); // root in the 'public' directory so that express will serve up files from here

app.listen(8080, () => console.log(`listening on port 8080`)); //run the server on port 8080 and show it in the console

           