var fs = require('fs');

data = "This is my NEW attempt at storing some data";
filename = "info.dat";

fs.writeFileSync(filename, data, "utf-8");

