app.get("/checkout", function (request, response) {
    // Generate HTML invoice string
      var invoice_str = `Thank you for your order!<table border><th>Quantity</th><th>Item</th>`;
      var shopping_cart = request.session.cart;
      for(product_key in products_data) {
        for(i=0; i<products_data[product_key].length; i++) {
            if(typeof shopping_cart[product_key] == 'undefined') continue;
            qty = shopping_cart[product_key][i];
            if(qty > 0) {
              invoice_str += `<tr><td>${qty}</td><td>${products_data[product_key][i].name}</td><tr>`;
            }
        }
    }
      invoice_str += '</table>';
    // Set up mail server. Only will work on UH Network due to security restrictions
      var transporter = nodemailer.createTransport({
        host: "mail.hawaii.edu",
        port: 25,
        secure: false, // use TLS
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
        }
      });
    
      var user_email = 'phoney@mt2015.com';
      var mailOptions = {
        from: 'phoney_store@bogus.com',
        to: user_email,
        subject: 'Your phoney invoice',
        html: invoice_str
      };
    
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          invoice_str += '<br>There was an error and your invoice could not be emailed :( <p>Return to <a href="/index.html">homepage</p>';
        } else {
          invoice_str += `<br>Your invoice was mailed to ${user_email} <p>Return to <a href="/index.html">homepage</p>`;
        }
        response.send(invoice_str);
      });
     
    });