/* Alyssa's Assignment 1 array of products */
products = [
    {
    "name": "Beeswax Wraps",
    "price": 7.99,
    "description": "These beeswax wraps work like saranwrap and are reusable. Better for the environment and will save you money in the long run",
    "image": "./images/beeswax.jpg"
    },
    {
    "name": "Metal Straws",
    "price": 9.99,
    "description": "Save the sea turtles and use metal straws instead of plastic.",
    "image": "./images/metalstraws.jpg"
    },
    {
    "name": "Reef Safe Sunscreen",
    "price": 14.99,
    "description": "Coral is dying from harmful chemicals in your sunscreen, do your part and wear reef safe",
    "image": "./images/reefsafe.jpg"
    },
    {
    "name": "Reusable Mesh Bag",
    "price": 5.99,
    "description": "These bags are great for anything on the go and perfect for the beach where sand just slips through.",
    "image": "./images/reusablebag.jpg"
    },
    {
    "name": "Sunglasses",
    "price": 21.99,
    "description": "Did you know even sunglasses have a carbon footprint? By these all natural wood ones and leave a zero carbon footprint",
    "image": "./images/sunglasses.jpg"
    }
]
if (typeof module != 'undefined') {
    module.exports.products = products;
  }