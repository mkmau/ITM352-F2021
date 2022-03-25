/* 
Author: Marcus  Mau
Description: This is the javascript file that contains the JSON objects for variables separated by brand. 
All product information, including the brand, price, and image location are contained in this file.
*/

var Seventies = [ 
    {
        "brand" : "BLEU DE CHANEL Eau de Toilette",
        "price" : 135.00,
        "image" : "./images/harvest.jpg"
    },
    {
        "brand" : "CHANCE BY CHANEL Eau de Parfum",
        "price" : 138.00,
        "image" : "./images/candk.jpg"
    },
    {
        "brand" : "COCO MADEMOISELLE Eau de Parfum",
        "price" : 138.00,
        "image" : "./images/elton.jpg"
    }, 
    {
        "brand" : "GABRIELLE CHANEL Eau de Parfum",
        "price" : 138.00,
        "image" : "./images/joel.jpg"
    }
]
var Eighties = [
    {
        "brand" : "Hypnotic Poison",
        "price" : 115.00,
        "image" : "./images/outfield.jpg"
    },
    {
        "brand" : "J'adore Eau de Parfum",
        "price" : 170.00,
        "image" : "./images/hando.jpg"
    },
    {
        "brand" : "Miss Dior Eau de Parfum",
        "price" : 138.00,
        "image" : "./images/toto.jpg"
    },
    {
        "brand" : "Sauvage Eau de Toilette",
        "price" : 199.00,
        "image" : "./images/earthwindfire.jpg"
    }
]
var Nineties = [
    {
        "brand" : "The Predator - Ice Cube",
        "price" : 138.00,
        "image" : "./images/icecube.jpg"
    },
    {
        "brand" : "Poi dog with crabs - Rap Replinger",
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
var Two_thousands = [
    {
        "brand" : "Black Opium Eau de Parfum",
        "price" : 162.00,
        "image" : "./images/allister.jpg"
    },
    {
        "brand" : "L'Homme Cologne Bleu",
        "price" : 140.00,
        "image" : "./images/hotfuss.jpg"
    },
    {
        "brand" : "Libre Eau de Parfum",
        "price" : 170.00,
        "image" : "./images/simpleplan.jpg"
    },
    {
        "brand" : "Mon Paris Eau de Parfum",
        "price" : 128.00,
        "image" : "./images/taar.jpg"
    }
]

// Products object that contains each brand for easy access in productsdisplay file
var products = {
    "Seventies":Seventies,
    "Eighties":Eighties,
    "Nineties":Nineties,
    "Two_thousands":Two_thousands
};

// Export the products to server.js
if(typeof module != 'undefined') {
        module.exports.products = products;
}