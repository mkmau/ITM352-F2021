products = [
    { 
        "model":"Apple iPhone XS", 
        "price": 990.00 
    },
    { 
        "model":"Samsung Galaxy", 
        "price": 240.00 
    }
];
    if(typeof module != 'undefined') {
        module.exports.products = products; // makes it avaialbel to other files that require it
    }
    