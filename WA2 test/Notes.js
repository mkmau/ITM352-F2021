require("./whatever products page is being used");

var num_products = 5; // 

var count = 1; 
while(count <= num_products) {
    console.log(`${count}. ${eval('name' + count)}`); //pulls information from the products_data.js page and can put it on the server page
    count++;
}
// 32.04 in Lab 8 video - *idea* if I do var num_products = quantity then that should pull the quantity of products from the products_data.js page

//Dynamic code that allows for the removal of products
require("./products_data.js")

for (var count = 1; eval("typeof name"+count) != 'undefined'; count++) {
    console.log(`${count}. ${eval('name' + count)}`);
}
// USE ARRAYS TO AVOID HAVING TO START AT COUNT 1 -48.47 Lab 8 video

// how to use an arrya
var product1 = {
    "attribute": "name",
}

// 3 different ways to print an array

for (i=0; i<4; i++) {
    document.write("<BR>" + fruits[i]);
} // REQUIRES HARDCODING SO IT'S NOT AS FLEXIBLE

for (i in fruits) {
    document.write("<BR>" + fruits[i]);
}

for (i=0; i<fruits.length; i++) {
    document.write("<BR>" + fruits[i])
}

// add new element to an array (I don't think I'll use this for the assignments)
fruits [4] = "raspberries";