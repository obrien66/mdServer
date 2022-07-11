// import modules
const http = require("http");
const fs = require("fs");
const colour = require("colour");
const markdown = require("markdown").markdown;
const mustache = require("mustache");
// import settings
const settings = require("./settings.json")

var server = http.createServer((req, res) => {
	// use the data we get from settings at the requested url to make a filename we can use
	let file;
	if (req.url[req.url.length - 1] === "/"){
		// if its the root directory or another directory we can get a useful filename 
		// by adding the settings' index file name
		file = `./${settings.siteDir}${req.url}${settings.indexFileName}`;
	}
	else {
		// otherwise we just tack the requested url onto the site directory setting
		file = `./${settings.siteDir}${req.url}`
	}
	// now we just grab the bugger and send him out into the world
	fs.readFile(file, settings.encoding, (err, data) => {
		if (err) {
			// what are you looking for????
			res.writeHead(404, {"Content-Type": "text/html"});
			res.end(`Sorry boss, ${file} machine broke`);
			console.log(colour.red("404 " )+ file);
		}
		else {
			// I'm so proud of him for putting himself out there
			res.writeHead(200, {"Content-Type": "text/html"});
			res.end(markdown.toHTML(data));
			console.log(colour.green("200 " )+ file);
		}
	})
})

server.listen(settings.port, () => {
	console.log(`Server is running at ${settings.port}\n`);
})