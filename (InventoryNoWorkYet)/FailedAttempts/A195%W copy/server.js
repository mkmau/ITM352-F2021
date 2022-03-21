/* 
Copied from Assignment 1 example video and info_server_Ex4.js from Lab13
Mau Assignment 1 Server
*/
var express = require('express'); //load and cache express module
var app = express(); //set module to variable 'app'
var myParser = require("body-parser"); //load and cache body parser module - Lab13
// const { getUnpackedSettings } = require('http2'); - COMMENTED OUT
var querystring = require('querystring'); //read variable 'queryString' as the loaded query-string module

var data = require('./public/products_data.js'); //load products.js file and set to variable 'data'
var products = data.products; //set variable 'products_array' to the products array in the products.js file

var fs = require('fs'); 
var filename = './user_data.json'; 

var login_data = {};

function isNonNegativeInteger(q, return_errors = false) {
    errors = []; // Assume no errors at first.
    if (q == '') q = 0; // Blank quantities = 0.
    if (Number(q) != q) errors.push('<font color="red">Not a number!</font>'); // Check if string is a number value
    if (q < 0) errors.push('<font color="red">Negative value!</font>'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('<font color="red">Not an integer!</font>'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}

app.all('*', function (request, response, next) { //for all request methods...
    console.log(request.method + ' to ' + request.path); //write in the console the request method and its path
    next(); //move on
});

//from lab 13 GET request to products page
app.get('/products_data.js', function (request, response, next) {
    response.type('.js');
    var products_string = `var products = ${JSON.stringify(products)};`;
    response.send(products_string);
});

//fix later myParser, added express instead -> changed back to myParser to use it 
app.use(myParser.urlencoded({ extended: true })); //get data in the body

if(fs.existsSync(filename)) { //check if the file exists using the fs package
    var data = fs.readFileSync(filename, 'utf-8'); //if the file exists, read the data on the file
    var user_data = JSON.parse(data); //parse the data in the file and assign the value of the data to user_dat
}

app.post("/process_login", function (request, response) {
    var username = requestAnimationFrame.body.username.toLowerCase();
    if (typeof user_data[username] != 'undefined') {
        if (user_data[username].password == request.body.password) { // Check if password matches username.
            // if there are no errors, store user info in login_data and send to invoice.  
            login_data['username'] = username;
            login_data['email'] = user_data[username].email;       
            let params = new URLSearchParams(login_data);
            response.redirect('/invoice.html?' + params.toString()); // Send to invoice page if login successful.
            return; // end process
        } else { // else (the_username password does not match the password entered), then there's an error
            request.query.username = username;
            request.query.LoginError = 'Invalid password!'; // Error message for wrong password.
        }
    } else { // else (the _username is undefined), there's an error
        request.query.LoginError  = 'Invalid username!'; // Error message for user that doesn't exist.
    } 
    // otherwise back to login with errors.    
    params = new URLSearchParams(req.query);
    response.redirect("./signin.html?" + params.toString()); // Redirect to signin.html if errors.
});



/* app.post("/completed_purchase.html", function (request, response) {*/
//processing the form using a post request
app.post("/process_form", function (request, response, next) {
    let POST = request.body; // data would be packaged in the body
    var errors = {};
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
                errors['inventory' + i] = `${quantity} of ${products[i].name} not available. Only ${products[i].quantity_available} available.`;
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

           