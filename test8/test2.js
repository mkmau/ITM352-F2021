app.post("/checkout", function (req, res) {
    var invoice_str = `Thank you for your order!<table>`; // Creates invoice that will be sent to email
    var shopping_cart = req.session.cart; // Set shopping cart as the cart requested from the session
    for (pkey in products) {
        for (i = 0; i < products[pkey].length; i++) {
            if (typeof shopping_cart[pkey] == 'undefined') continue;
            qty = shopping_cart[pkey][i];
            if (qty > 0) {
                invoice_str += `<tr><td>${qty}</td><td>${products[pkey][i].brand}</td><tr>`;
            }
        }
    }
    invoice_str += '</table>';

    // Decodes the invoice that was encoded
    invoice_str = decodeURI(req.body.invoicestring);
    var transporter = nodemailer.createTransport({
        // Because we are using UH as the host, we must be using their network for the email to work
        host: "mail.hawaii.edu",
        port: 25,
        secure: false,
        tls: {
            rejectUnauthorized: false
        }
    });

    // Info of sender
    var user_email = 'noreply@heavenscent.com';
    var mailOptions = {
        from: 'HEAVENSCENT',
        to: user_email,
        subject: 'Your Order from HEAVENSCENT!',
        html: invoice_str
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) { // If there are errors in sending invoice (e.g., due to network issue), display error message below invoice
            invoice_str += `<p>There was an error and your invoice was not sent!</p> <p>Return to <a href="/index.html">HEAVENSCENT</p>`;
        } else { // Otherwise, show that the email was sent successfully
            invoice_str += '<p>The invoice was sent to your email. Enjoy your heaven scent!</p> <p>Return to <a href="/index.html">HEAVENSCENT</p>';
        }
        req.session.destroy(); // Destroys session after checkout
        res.send(invoice_str);
    });
});