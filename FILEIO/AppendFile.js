var fs = require('fs');

data = "\nThis is my NEW attempt at storing some data";
filename = "info.dat";

fs.appendFileSync(filename, data, "utf-8");

