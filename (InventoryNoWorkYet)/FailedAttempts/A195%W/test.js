// POST request from signup.html. Received help from Professor Port
// Registration validation (each validation adopted from https://www.w3resource.com/javascript/form/javascript-sample-registration-form-validation.php)
app.post("/process_register", function (request, response) {
    var login_errors = {};  // assume no errors at start
    var login_username = request.body.username.toLowerCase();

    // EMAIL VALIDATION
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(request.body.email)) { //check if the fullname is correct
    } else {
        login_errors['email'] = "Invalid email."; // error message for email that doesn't match format of name@website.domain
    } 

    // NAME VALIDATION
    if (/^[A-Za-z, ]+$/.test(request.body.fullname)) { // name must contain only letters
    } else {
        login_errors['fullname'] = "Enter a name with alphabet characters only."; // error message if name contains numbers or invalid characters/symbols
    }
    
    if (request.body.fullname.length > 30 && request.body.fullname.length < 1) { // 30 characters or less
        login_errors['fullname'] = "Name must be less than 30 characters."; // error message if name exceeds 30 characters or nothing in there
    }

    // USERNAME VALIDATION
    // alphanumeric check taken from https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
    if (/^[0-9a-z]+$/.test(request.body.username)) { // Letters and numbers only
    } else {
        login_errors['username'] = "Enter a username with alphanumeric characters only.";  // error message if username contains invalid characeters/symbols
    }

    if (request.body.username.length > 10 || request.body.username.length < 4) { // 4-10 characters
        login_errors['username'] = "Username must be 4-10 characters."; // error message if username is under 4 characters or over 10 characters
    }
    
    if (typeof user_data[login_username] != 'undefined') { // Username must be unique
        login_errors['username'] = 'This username is already taken!'; // error message if username is already in user_data.json file
    }

    // PASSWORD VALIDATION
    if (request.body.password.length < 6) {
        login_errors['password'] = "Password must be more than 6 characters."; // error message if password doesn't exceed 6 characters
    }

    // CONFIRM PASSWORD VALIDATION
    if (request.body.password !== request.body.confirmpassword) {
        login_errors['confirmpassword'] = "Passwords do not match." // error message if passwords don't match
    }

    // Save registration data to json file and send to invoice page if registration successful. 
    // Taken from Lab 14 Exercise 4.
    if (Object.keys(login_errors).length == 0) {
        var username = request.body['username'].toLowerCase();
        user_data[username] = {};
        // information entered is added to user_data
        user_data[username]['name'] = request.body['fullname']; 
        user_data[username]['password'] = request.body['password'];
        user_data[username]['email'] = request.body['email'];

        // stored data of purchase info goes into login.data
        fs.writeFileSync(filename, JSON.stringify(user_data), "utf-8");
        // username and email from login.data variable added into file as username and email
        login.data['username'] = username;
        login.data['email'] = user_data[username]["email"];
        let params = new URLSearchParams(login.data);
        response.redirect('./invoice.html?' + params.toString()); // go to invoice at the end of a successful registration process
    }

    // Otherwise back to registration with the registration errors.    
    else {
        request.body['login_errors'] = JSON.stringify(login_errors);
        let params = new URLSearchParams(request.body);
        response.redirect('register.html?' + params.toString()); // redirect to signup page after errors popup
      }
});