/* 
Author: Marcus Mau
References: Assignment 3 Code Examples (https://dport96.github.io/ITM352/morea/180.Assignment3/reading-code-examples.html), Lab 15, & Nicholas Samson's code
Description: This is the Javascript file that runs the server for my store and contains instructions for specific requests.
*/
//require a file which is used to get our product data
var data = require('./public/products.js'); 
var products = data.products; 

//require express which is the basis for our sever
var express = require('express');
var app = express();

//require body parser which is necessary for data to be read by js
var myParser = require("body-parser");

// taken from cookies lab and assignment 2 on how to use FS to read and edit files
var fs = require('fs');
var filename = './user_data.json';

// requiring query-string which will be used to turn products into an array when completing purchase
var queryString = require('query-string');
const qs = require('qs');

// requiring cookie parser which will be called later
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// requiring express session which allows for sessions
var session = require('express-session');

// requiring nodemailer which will be called later to email invoice
var nodemailer = require('nodemailer');
const { exit } = require('process');

// Monitor all requests
app.all('*', function (request, response, next) { //method for all paths
    console.log(request.method + ' to ' + request.path); //write in the console the request method and its path
    next(); //move on
});



// From lab 15 on cookies - setting cookie
app.get('/set_cookie', function (request, response, next) {
    let my_name = 'Marcus Mau';
    response.clearCookie('my_name');
    response.send(`Cookie for ${my_name} sent!`);
    next();
});



// From lab 15 on cookies - setting cookie
app.get('/use_cookie', function (request, response, next) {
    if (typeof request.cookies['username'] != 'undefined') { // If cookie associated with username isn't undefined,
        response.send(`Hello ${request.cookies['username']}!`) // Send response greeting customer by username
    } else {
        response.send(`Wait a minute, who are you?`) // Else send this response
    }
    next();
});



// Help from Josh Lorica, Justin Sakamoto to complete encryption
app.use(session({
    secret: "TXkgZmF2b3JpdGUgZnJhZ3JhbmNlIGlzIE9jZWFuIGJ5IEdpb3JnaW8gQXJtYW5pIQ==", // Encrypt the session for security (read https://stackoverflow.com/questions/18565512/importance-of-session-secret-key-in-express-web-framework)
    resave: true, // Enabled so that when a session wasn't changed during a request, it is still updated in the store (thereby marking it active) (read https://stackoverflow.com/questions/40381401/when-to-use-saveuninitialized-and-resave-in-express-session)
    saveUninitialized: false, // Useful for implementing login sessions, reducing server storage usage, or complying with laws that require permission before setting a cookie (https://github.com/expressjs/session#saveuninitialized)
    httpOnly: false, // Protocol setting
    secure: true, // Recommended setting for security https://expressjs.com/en/resources/middleware/session.html
}));



// Assignment 2 where user_data was looked for, then the information was read and parsed
if (fs.existsSync(filename)) {
    var stats = fs.statSync(filename);
    var data = fs.readFileSync(filename, 'utf-8');
    var user_data = JSON.parse(data);
} else {
    console.log(filename + 'does not exist!'); // If file doesn't exist, show in console
}



// Checking to make sure user_data exists
if (fs.existsSync(filename)) {
    var data = fs.statSync(filename);
    data = fs.readFileSync(filename, 'utf-8'); // If it exists, read the file user_data.json storedin filename
    var user_data = JSON.parse(data); // Parse user data
} else {
    console.log(`${user_data} does not exist!`) // If it doesn't exist, send a message to console
    exit();
}



function isNonNegativeInteger(q, return_errors = false) { //Is non negative integer function defined
    errors = []; // Assume no errors at first.
    if (q == '') q = 0; // Blank quantities = 0.
    if (Number(q) != q) errors.push('<font color="red">Not a number!</font>'); // Check if string is a number value
    if (q < 0) errors.push('<font color="red">Negative value!</font>'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('<font color="red">Not an integer!</font>'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0); 
}


// Taken from Assignment 1 to use myParser
app.use(myParser.urlencoded({ extended: true }));
app.use(myParser.json());// Use JSON parser to parse data

// Process_form from index/home page
app.post("/process_form", function (request, response) { 
    params = request.body; // Set the body of our form that we previously set in our home page to the params

    // Quantity validation
    if (typeof params['purchase_submit'] != 'undefined') { 
        has_errors = false; // Assume valid quantities at start
        total_qty = 0; // Assume no quantities at start in the total_qty variable
        for (i = 0; i < products.length; i++) {
            if (typeof params[`quantity${i}`] != 'undefined') { // If quantities are valid, run the following code
                a_qty = params[`quantity${i}`]; // Puts quantities in the quantity property of params
                total_qty += a_qty; // Adds quantities to total quantity variable
                if (!isNonNegativeInteger(a_qty)) {
                    has_errors = true; // If isNonNegativeInteger function returns true for errors, there are invalid quantities
                }
            }
        }

        // Process purchase to and from shopping cart page
        if (typeof params["purchase_submit"]) {
            // Instructions for redirecting to invoice if no quantity errors
            if (has_errors) { // If there are errors:
                response.redirect(`./index.html?${qs.stringify(params)}`); // Redirect to index.html
            } else if (total_qty == 0) { // If there are no quantities selected:
                response.redirect(`./index.html?${qs.stringify(params)}`); // Redirect to index.html
            } else { // But, if all good to go:
                request.session[cartfile] = `${qs.stringify(params)}`; // Request the session from the shopping cart
                if (typeof request.cookies["username"] != 'undefined') { // If the cookie assigned to the username is not undefined:
                    response.redirect(`./products_display.html?${qs.stringify(params)}`); // Redirect to products_display.html page
                } else { // If undefined user:
                    response.redirect(`./login.html?${qs.stringify(params)}`); // Redirect to login.html page so customer can do a proper login (or registration)
                }
            }
        }
    }
});

// Add to shopping cart - help from Josh Lorica, Justin Sakamoto and example code taken from Alyssa Mencel
app.post("/addtocart", function (request, response) {
    console.log(request.body); // Shows request body in console
    itemdata = request.body;// Sets the itemdata variable to the request body
    // If quantities are valid, add the items to cart. If not, return the errors according to isNonNegativeInteger function
    if (isNonNegativeInteger(itemdata.quantity)) {
        if (typeof request.session.cart == "undefined") { // If there is no shopping cart in the session, make a cart
            request.session.cart = {}; // Assume cart is empty at first. Items will be added to this object for the user's session
        }
        if (typeof request.session.cart[itemdata.producttype] == "undefined") { // If the product type is undefined, create a product array for it
            request.session.cart[itemdata.producttype] = []; // Empty array where product type will be added
        }
        if (typeof request.session.cart[itemdata.producttype][itemdata.productindex] == "undefined") { // If the product type doesn't exist in the cart, make space to add the product
            request.session.cart[itemdata.producttype][itemdata.productindex] = 0; // Index of 0 where product will be added
        }
        request.session.cart[itemdata.producttype][itemdata.productindex] += parseInt(itemdata.quantity); // Parse quantity to an integer instead of a string!
        response.send(`Added ${itemdata.quantity} of ${itemdata.producttype} 's CD's to cart`);// Alert message that _ quantity of _ item was added to cart
        console.log(request.session.cart); // Show request of shopping cart from session in the console
    } else {
        response.send(`Invalid quantity!`); // Send a response stating the quantities are invalid. Nothing added to cart
    }
});

// Load the shopping cart to server
app.post("/loadcart", function (request, response) { // If we have not previously requested the cart data, create an object for it
    if (typeof request.session.cart == "undefined") {
        request.session.cart = {}; // Cart object
    }
    response.json(request.session.cart) // Cart data will be in JSON format

});

// Log out function
app.get("/logout", function (request, response) {
    response.clearCookie('username'); // Cleat the cookie associated with the username of the customer logged in
    // Save the script that logs the user out into the str variable and redirect to the home page.
    str = `<script>alert("${request.cookies['username']} is logged out"); location.href="./index.html";</script>`; 
    response.send(str); // Send the str variable
    request.session.destroy(); // Destroy the session containing the cart info and cookies
});

// Process login 
//help from Josh Lorica and Justin Sakamoto with code examples from Justin Sakamoto
app.post("/process_login", function (request, response) {
    var loginError = []; // Assume no login errors at first. Add all errors into this array
    var ClientUsername = request.body.username.toLowerCase(); // Put the username in lowercase and check against user_data.json file 
    if (typeof user_data[ClientUsername] != 'undefined') {// If username has a match in database, return the object
        // Match the password next
        if (user_data[ClientUsername].password == request.body.password) { // Check password against user password from database
            request.query.username = ClientUsername;
            request.query.name = user_data[request.query.username].name
            response.cookie('username', ClientUsername); // Send cookie associated with username to session
            response.redirect('./products_display.html?productkey=Seventies');// If successful login, edirect to store
            return;
        } else { // If username or password is wrong, display a message containing the specific errors
            request.query.username = ClientUsername; // Sets the username to the username inputted by customer
            request.query.name = user_data[ClientUsername].name; // Confirms the userername input is the same 
            request.query.loginError = loginError.join(' '); // Join errors with a space
        }
    } else { // If the username is invalid or doesn't exist in database, push the error
        loginError.push = ('Invalid username!'); // Error message
        request.query.loginError = loginError.join(' '); // Join errors with a space
    }
    response.redirect('./login.html?' + queryString.stringify(request.query));// Redirect to login page if there are errors so customer can try again
});

// Process registration
app.post("/process_register", function (request, response) {
    let POST = request.body; 
    var errors = []; // Assume no errors at first. Add registration errors in this array

    // Registration validation (each validation adopted from https://www.w3resource.com/javascript/form/javascript-sample-registration-form-validation.php)
    
    // email validation
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(POST['email'])) { // Check if the email is in the correct format
    } else {
        errors.push("Invalid email."); // Error message for email that doesn't match format of name@website.domain
    }

    // name validation
    if (/^[A-Za-z, ]+$/.test(POST['fullname'])) { // Name must contain only letters
    } else {
        errors.push('Enter a name with alphabet characters only.'); // Error message if name contains numbers or invalid characters/symbols
    }
    if (POST['fullname'].length > 30 && POST['fullname'].length < 1) { // Name must be 30 characters or less
        errors.push("Name must be less than 30 characters."); // Error message if name exceeds 30 characters or nothing in there
    }

    // username validation
    // Alphanumeric check taken from https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
    if (/^[0-9a-z]+$/.test(POST['username'])) { // Username must contain only letters and/or numbers
    } else {
        errors.push('Enter a username with alphanumeric characters only.');  // Error message if username contains invalid characeters/symbols
    }
    if (POST['fullname'].length > 10 || POST['fullname'].length < 4) { // Username must be 4-10 characters
        errors.push('Username must be 4-10 characters.'); // Error message if username is under 4 characters or over 10 characters
    }
    var reguser = POST['username'].toLowerCase(); // Username must be unique
    if (typeof user_data[reguser] != 'undefined') { // Check against all usernames existing in database
        errors.push('This username is already taken.'); // Error message if username is non-unique
    }

    // password validation
    if (POST['password'].length < 6) { // Password must be at least 6 characters
        errors.push('Password must be more than 6 characters.'); // Error message if password doesn't exceed 6 characters
    }

    //passsword confirmation
    if (POST['password'] == POST['confirmpassword']) { // Password must match what is entered in Confirm Password box
    } else {
        errors.push('Passwords do not match.'); // Error message if passwords don't match
    }

    // Save registration data to user_data.json file and send to store if registration successful. Adopted from Lab 14, Excercise 14
    if (errors.length == 0) {
        var username = POST["username"];
        user_data[username] = {};
        // Information entered is added to user_data.json
        user_data[username].name = POST['username']; // Post username = usernamedata_username
        user_data[username].password = POST['password']; // Post password = userdata_password
        user_data[username].email = POST['email']; // Post email = usernamedata_email
        data = JSON.stringify(user_data);// Converts user data into JSON to store into user_data.json
        fs.writeFileSync(filename, data, "utf-8");// Write data to user_data.json file
        ClientUsername = user_data[username]['name'];
        ClientEmail = user_data[username]['email'];
        response.cookie("username", ClientUsername).send; // Send cookie associated with username to server
        response.redirect('./products_display.html?productkey=Seventies'); // Redirect to Seventies page so customer can start shopping
    }
    else {
        request.query.errors = errors.join(' '); // Join the errors in registration with a space
        response.redirect('./register.html?' + qs.stringify(request.query));// Then redirect back to registration page so customer can fix errors
    }
});

// Completing the and processing the purchase and sending invoice
// Taken from Professor ports's code examples: https://dport96.github.io/ITM352/morea/180.Assignment3/reading-code-examples.html
app.post("/checkout", function (request, response) {
    var invoice_str = `Thank you for your order!<table>`; // Creates invoice that will be sent to email
    var shopping_cart = request.session.cart; // Set shopping cart as the cart requested from the session
    for (productkey in products) {
        for (i = 0; i < products[productkey].length; i++) {
            if (typeof shopping_cart[productkey] == 'undefined') continue;
            qty = shopping_cart[productkey][i];
            if (qty > 0) {
                invoice_str += `<tr><td>${qty}</td><td>${products[productkey][i].brand}</td><tr>`;
            }
        }
    }
    invoice_str += '</table>';

    // Decodes the invoice that was encoded
    invoice_str = decodeURI(request.body.invoicestring);
    var transporter = nodemailer.createTransport({
        host: "mail.hawaii.edu",
        port: 25,
        secure: false,
        tls: {
            rejectUnauthorized: false
        }
    });

    // Info of sender
    var store_email = 'noreply@SkyCD.com';
    var mailOptions = {
        from: 'SkyCD@store.com',
        to: store_email,
        subject: 'Your Order from SkyCD!',
        html: invoice_str
    };

    // using the mailOptions to send invoice
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) { // If there are errors then this message will be sent
            invoice_str += '<p>There was an error and your invoice could not be emailed</p> <p>Return to <a href="/index.html">homepage</p>';
        } else { // If there are no errors then this message will be sent
            invoice_str += '<p>The invoice was sent to your email. Your CDs will be at your doorstep in one week!</p> <p>Return to <a href="/index.html">homepage</p>';
        }
        request.session.destroy(); // Destroys session after checkout
        response.send(invoice_str);
    });
});

// Route all other GET requests to files in local directory
app.use(express.static('./public'));

// Start server
app.listen(8080, () => console.log(`listening on port 8080`));