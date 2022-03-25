/* Copied from Assignment 1 example video and info_server_Ex4.js from Lab13 Mau Assignment 1 Server */
var data = require('./public/products.js'); //requiring the products page from the public folder and assigning the action to 'data'
var products = data.products; //taking the data from the products page and assigning it to products

var querystring = require('querystring'); //read variable 'queryString' as the loaded query-string module

var express = require('express'); //requiring express package 
var app = express(); //set module to variable 'app'

var myParser = require("body-parser"); //load and cache body parser module - Lab13

var fs = require('fs');
var filename = './user_data.json';

var login_info = {}; 

app.all('*', function (request, response, next) { //method for all paths
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


//help from Lydia Jun, Alyssa Mencel, Josh Lorica
if (fs.existsSync(filename)) { 
    var data = fs.readFileSync(filename, 'utf-8'); // If the file exists then read the data in the file
    var user_data = JSON.parse(data); // parse user data
  } 

  app.post("/process_login", function (request, response) {
    var the_username = request.body.username.toLowerCase();
    if (typeof user_data[the_username] != 'undefined') {
        if (user_data[the_username].password == request.body.password) { // Check if password matches username.
            // if there are no errors, store user info in login_info and send to invoice.  
            login_info['username'] = the_username;
            login_info['email'] = user_data[the_username].email;       
            let params = new URLSearchParams(login_info);
            response.redirect('./invoice.html?' + params.toString()); // Send to invoice page if login successful.
            return; // end process
        } else { // else (the_username password does not match the password entered), then there's an error
            request.query.username = the_username;
            request.query.LoginError = 'Invalid password!'; // Error message for wrong password.
        }
    } else { // else (the _username is undefined), there's an error
        request.query.LoginError  = 'Invalid username!'; // Error message for user that doesn't exist.
    } 
    // otherwise back to login with errors.    
    params = new URLSearchParams(request.query);
    response.redirect("./login.html?" + params.toString()); // Redirect to login.html if errors
});

//help from Josh Lorica and used stackoverflow for validation
app.post("/process_register", function (request, response) {
    var reg_errors = {};  // assume no errors at start
    var reg_username = request.body.username.toLowerCase();

    // email validation
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(request.body.email)) { //check if the fullname is correct
    } else {
        reg_errors['email'] = "Invalid email."; // error message for email that doesn't match format of name@website.domain
    } 

    // user's name validation
    if (/^[A-Za-z, ]+$/.test(request.body.fullname)) { // name must contain only letters
    } else {
        reg_errors['fullname'] = "Enter a name with alphabet characters only."; // error message if name contains numbers or invalid characters/symbols
    }
    
    if (request.body.fullname.length > 30 && request.body.fullname.length < 1) { // 30 characters or less
        reg_errors['fullname'] = "Name must be less than 30 characters."; // error message if name exceeds 30 characters or nothing in there
    }

    // username validation
    // alphanumeric check taken from https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
    if (/^[0-9a-z]+$/.test(request.body.username)) { // Letters and numbers only
    } else {
        reg_errors['username'] = "Enter a username with alphanumeric characters only.";  // error message if username contains invalid characeters/symbols
    }

    if (request.body.username.length > 10 || request.body.username.length < 4) { // 4-10 characters
        reg_errors['username'] = "Username must be 4-10 characters."; // error message if username is under 4 characters or over 10 characters
    }
    
    if (typeof user_data[reg_username] != 'undefined') { // Username must be unique
        reg_errors['username'] = 'This username is already taken!'; // error message if username is already in user_data.json file
    }

    // password validation
    if (request.body.password.length < 6) {
        reg_errors['password'] = "Password must be more than 6 characters."; // error message if password doesn't exceed 6 characters
    }

    // password reentry validation
    if (request.body.password !== request.body.confirmpassword) {
        reg_errors['confirmpassword'] = "Passwords do not match." // error message if passwords don't match
    }

    // Save registration data to json file and send to invoice page if registration successful. 
    // Taken from Lab 14 Exercise 4.
    if (Object.keys(reg_errors).length == 0) {
        var username = request.body['username'].toLowerCase();
        user_data[username] = {};
        // information entered is added to user_data
        user_data[username]['name'] = request.body['fullname']; 
        user_data[username]['password'] = request.body['password'];
        user_data[username]['email'] = request.body['email'];

        // stored data of purchase info goes into login_info
        fs.writeFileSync(filename, JSON.stringify(user_data), "utf-8");
        // username and email from login_info variable added into file as username and email
        login_info['username'] = username;
        login_info['email'] = user_data[username]["email"];
        let params = new URLSearchParams(login_info);
        response.redirect('./login.html?' + params.toString()); // go to invoice at the end of a successful registration process
    }  else { // send user back to registration page if there are any errors
        request.body['reg_errors'] = JSON.stringify(reg_errors);
        let params = new URLSearchParams(request.body);
        response.redirect('register.html?' + params.toString()); // redirect to register page after errors popup 
      }
});



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
            // Redirect customer to login.html if valid quantities entered.
            login_info = request.body;
            response.redirect("./login.html?" + QString);
        } else { //if there are errors, notify the user
            let errObj = { 'error': JSON.stringify(errors) };
            QString += '&' + querystring.stringify(errObj);
            response.redirect("./products_display.html?" + QString); // Redirect to products_display.html
        }
});    
    
// taken from assignment 1 examples
app.use(express.static('./public')); // root in the 'public' directory so that express will serve up files from here

app.listen(8080, () => console.log(`listening on port 8080`)); //run the server on port 8080 and show it in the console

           