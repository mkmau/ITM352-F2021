/* 
Author: Marcus  Mau
Description: This is the javascript file that contains the JSON objects for variables separated by brand. 
All product information, including the brand, price, and image location are contained in this file.
*/

var Seventies = [ 
    {
        "brand" : "Out of the Blue - Electric Light Orchaestra",
        "price" : 4.99,
        "image" : "./images/elo.jpg"
    },
    {
        "brand" : "Night Music - Cecelio and Kapono",
        "price" : 5.99,
        "image" : "./images/candk.jpg"
    },
    {
        "brand" : "Madman Across the Water - Elton John",
        "price" : 6.99,
        "image" : "./images/elton.jpg"
    }, 
    {
        "brand" : "The Stranger - Billy Joel",
        "price" : 7.99,
        "image" : "./images/joel.jpg"
    }
]
var Eighties = [
    {
        "brand" : "Play Deep - The Oufield",
        "price" : 4.95,
        "image" : "./images/outfield.jpg"
    },
    {
        "brand" : "Private Eyes - Hall and Oates",
        "price" : 5.95,
        "image" : "./images/hando.jpg"
    },
    {
        "brand" : "Toto IV - Toto",
        "price" : 6.95,
        "image" : "./images/toto.jpg"
    },
    {
        "brand" : "Whitesnake - Whitesnake",
        "price" : 7.95,
        "image" : "./images/whitesnake.jpg"
    }
]
var Nineties = [
    {
        "brand" : "The Predator - Ice Cube",
        "price" : 6.99,
        "image" : "./images/icecube.jpg"
    },
    {
        "brand" : "Poi dog with Crabs - Rap Replinger",
        "price" : 7.99,
        "image" : "./images/poidog.jpg"
    },
    {
        "brand" : "Dookie - Greenday",
        "price" : 7.99,
        "image" : "./images/greenday.jpg"
    },
    {
        "brand" : "The Fourth World - Kara's Flowers",
        "price" : 8.99,
        "image" : "./images/flowers.jpg"
    },
]   
var Two_Thousands = [
    {
        "brand" : "Last Stop Suburbia - Allister",
        "price" : 10.95,
        "image" : "./images/allister.jpg"
    },
    {
        "brand" : "Hot Fuss - The Killers",
        "price" : 10.95,
        "image" : "./images/hotfuss.jpg"
    },
    {
        "brand" : "No Pads, No Helmets - Simple Plan",
        "price" : 10.95,
        "image" : "./images/simpleplan.jpg"
    },
    {
        "brand" : "The All-American Rejects - The All American Rejects",
        "price" : 10.95,
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