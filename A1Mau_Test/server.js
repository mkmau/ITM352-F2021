/* 
Copied from Assignment 1 example video and info_server_Ex4.js from Lab13
Mau Assignment 1 Server
*/
var data = require('./public/products.js'); //load products.js file and set to variable 'data'
//Check below code (line 8)
var products_array = data.products; //set variable 'products_array' to the products array in the products.js file
const queryString = require('querystring'); //read variable 'queryString' as the loaded query-string module
var express = require('express'); //load and cache express module
var app = express(); //set module to variable 'app'

// remove later//  //Alyssa Mencel's code
var myParser = require("body-parser"); //load and cache body parser module
// const { getUnpackedSettings } = require('http2'); - COMMENTED OUT

app.all('*', function (request, response, next) { //for all request methods...
    console.log(request.method + ' to ' + request.path); //write in the console the request method and its path
    next(); //move on
});

//fix later myParser, added express instead
app.use(express.urlencoded({ extended: true })); //get data in the body

/* app.post("/completed_purchase.html", function (request, response) {*/
    app.post("/invoice.html", function (request, response) {
    let POST = request.body; // data would be packaged in the body

    //taken from Alyssa Mencel
    //ATTEMPT at taking quantity_available values from products.js and making a for loop to subtract quantity ordered from available
    if (typeof POST['submitPurchase'] != 'undefined') { 
        var hasvalidquantities=true; // this is to make sure quantity is valid
        var hasquantities=false; 
        var total_sold = 1
        for (i = 0; i < products.length; i++) { //for loop to go through the products and check which one was bought
            var quantityremaining = products_array[i].quantity_available - products_array[i].total_sold; // Deduct quantity from inventory
                qty=POST[`quantity${i}`];
                hasquantities=hasquantities || qty>0; // If it has a value bigger than 0 then it is good
                hasvalidquantities=hasvalidquantities && isNonNegInt(qty);    // if it is both a quantity over 0 and is valid    
} 

        //copied from Alyssa Mencel
        // if all quantities are valid, generate the invoice
        //redirect if correct values inputted to the invoice page
        //redirect if the no correct value to the products_display page
        const stringified = queryString.stringify(POST);
        if (hasvalidquantities && hasquantities) {
            response.redirect("./invoice.html?" + stringified); // using the invoice.html and all the data that is input
        }  

        else { 
            response.redirect("./products_display.html?" + stringified) 
        }
    }
});

app.post("/products_display.html", function (request, response) { //lab 13 code
    let POST = request.body;
    
    if (typeof POST['quantity_textbox'] != 'undefined')
    {
         let quantity = POST['quantity_textbox'];
         if (isNonNegInt(quantity)) {
             //response.send(`<H1>Thank you for ordering ${quantity} things!</H1>`);
             console.log("success") //test code
         } else {
             //response.send(`<I>${quantity} is not a valid quantity!</I>`);
            console.log("failure") // terst code
         }
    }
 });

function isNonNegInt(q, return_errors = false) { //this function checks if values are postitive, integer, whole values 
    errors = []; // assume no errors at first
    if (q == '') q = 0; //sets blank inputs to the quantitiy of 0 
    if (Number(q) != q) errors.push('<font color="red">Not a number!</font>'); // Check if string is a number value
    else if (q <= 0) errors.push('<font color="red">Please enter a positive value</font>'); // Check if the string is non-negative
    else if (parseInt(q) != q) errors.push('<font color="red">Not a full value!</font>'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0); // no errors means that errors.length has 0 length - passes to checkQuantity textbox
}
function checkQuantityTextbox(theTextbox) {
    errs = isNonNegInt(theTextbox.value, true);
    if (errors.length == 0) errs = ['You want:']; //changes it to say you want ___ -> errs.length
    if (theTextbox.value.trim() == '') errs = ['Quantity'];
    document.getElementById(theTextbox.name + '_label').innerHTML = errs.join(", "); // looks at what was put in textbox and turns the corresponding message into a string
}     
 

//repeats the isNonNegInt function from the products_display.html file 
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume that quantity data is valid 
    if (q == "") { q = 0; }
    if (Number(q) != q) errors.push('Not a number!'); //check if the string is a number
    if (q < 0) errors.push('Negative value!'); //check if value is a positive
    if (parseInt(q) != q) errors.push('Not an integer!'); //check if value is an integer
    return returnErrors ? errors : (errors.length == 0);
}

// taken from assignment 1 examples
app.use(express.static('./public')); // root in the 'public' directory so that express will serve up files from here
app.listen(8080, () => console.log(`listening on port 8080`)); //run the server on port 8080 and show it in the console

           