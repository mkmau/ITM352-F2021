var fs = require('fs');

var filename = "info.dat"; // file is assigned to variable filename so that if there are multipl operations done on the file the name can be changed in a single place

if (fs.existsSync(filename)) { 
    data = fs.readFileSync(filename, 'utf-8');
    console.log(" Success! We got: " + data); // data is then logged into the console
} else { 
    console.log("Sorry " + filename + "doesn't exist"); // if the file doesn't exist
}
    
//var data = fs.readFileSync(filename, 'utf-8'); 

//console.log(" Success! We got: " + data); // data is then logged into the console

// using another function built into the fs packet (exists) we can check if the file exists
