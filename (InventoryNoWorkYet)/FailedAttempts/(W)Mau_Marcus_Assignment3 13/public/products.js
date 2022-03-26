/* 
Author: Marcus  Mau
Description: This is the javascript file that contains the JSON objects for variables separated by brand. 
All product information, including the brand, price, and image location are contained in this file.
*/

var Seventies = [ 
    {
        "brand" : "Out of the Blue - Electric Light Orchaestra",
        "price" : 135.00,
        "image" : "./images/elo.jpg"
    },
    {
        "brand" : "Night Music - Cecelio and Kapono",
        "price" : 138.00,
        "image" : "./images/candk.jpg"
    },
    {
        "brand" : "Madman Across the Water - Elton John",
        "price" : 138.00,
        "image" : "./images/elton.jpg"
    }, 
    {
        "brand" : "The Stranger - Billy Joel",
        "price" : 138.00,
        "image" : "./images/joel.jpg"
    }
]
var Eighties = [
    {
        "brand" : "Play Deep - The Oufield",
        "price" : 115.00,
        "image" : "./images/outfield.jpg"
    },
    {
        "brand" : "Private Eyes - Hall and Oates",
        "price" : 170.00,
        "image" : "./images/hando.jpg"
    },
    {
        "brand" : "Toto IV - Toto",
        "price" : 138.00,
        "image" : "./images/toto.jpg"
    },
    {
        "brand" : "Whitesnake - Whitesnake",
        "price" : 199.00,
        "image" : "./images/whitesnake.jpg"
    }
]
var Nineties = [
    {
        "brand" : "The Predator - Ice Cube",
        "price" : 138.00,
        "image" : "./images/icecube.jpg"
    },
    {
        "brand" : "Poi dog with Crabs - Rap Replinger",
        "price" : 138.00,
        "image" : "./images/poidog.jpg"
    },
    {
        "brand" : "Dookie - Greenday",
        "price" : 110.00,
        "image" : "./images/greenday.jpg"
    },
    {
        "brand" : "The Fourth World - Kara's Flowers",
        "price" : 135.00,
        "image" : "./images/flowers.jpg"
    },
]   
var Two_Thousands = [
    {
        "brand" : "Last Stop Suburbia - Allister",
        "price" : 162.00,
        "image" : "./images/allister.jpg"
    },
    {
        "brand" : "Hot Fuss - The Killers",
        "price" : 140.00,
        "image" : "./images/hotfuss.jpg"
    },
    {
        "brand" : "No Pads, No Helmets - Simple Plan",
        "price" : 170.00,
        "image" : "./images/simpleplan.jpg"
    },
    {
        "brand" : "The All-American Rejects - The All American Rejects",
        "price" : 128.00,
        "image" : "./images/taar.jpg"
    }
]

// Products object that contains each brand for easy access in productsdisplay file
var products = {
    "Seventies":Seventies,
    "Eighties":Eighties,
    "Nineties":Nineties,
    "Two_Thousands":Two_Thousands
};

// Export the products to server.js
if(typeof module != 'undefined') {
        module.exports.products = products;
}