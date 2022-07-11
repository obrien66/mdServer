// import modules
const http = require("http");
const fs = require("fs");
const colour = require("colour");
const markdown = require("markdown").markdown;
const mustache = require("mustache");
// import settings
const settings = require("./settings.json");

var bookend = [settings.headfile, settings.footfile];
var endTags = settings.endTags

// function for adding html tags + header and footer
var buildSite = (tags, ends, md) => {
	return tags[0] + ends[0] + md + tags[1] + ends[1]
}

var endFileData = [];
// iterate over the array and read each file
for (var i = 0; i < bookend.length; i++) {
	// make a usable file path using settings and items from the array
	let bookendFile = `./${settings.siteDir}/${bookend[i]}`;
	// read file
	fs.readFile(bookendFile, settings.encoding, (err, data) => {
		if (err) {
			throw err
		}
		else {
			// read it and add that part to the array
			endFileData.push(data);
		}
	});
}

var server = http.createServer((req, res) => {
	// var endFileData = [];
	// // iterate over the array and read each file
	// for (var i = 0; i < bookend.length; i++) {
	// 	// make a usable file path using settings and items from the array
	// 	let bookendFile = `./${settings.siteDir}/${bookend[i]}`;
	// 	fs.readFile(bookendFile, settings.encoding, (err, data) => {
	// 		if (err) {
	// 			throw err
	// 		}
	// 		else {
	// 			// read it and add that part to the array
	// 			endFileData.push(data);
	// 		}
	// 	});
	// }

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
		// console.log(endTags);
		// console.log(endFileData);
		if (err) {
			// what are you looking for????
			// console.log(endTags, endFileData)
			res.writeHead(404, {"Content-Type": "text/html"});
			res.end(buildSite(endTags, endFileData, `Sorry boss, ${file} machine broke`));
			console.log(colour.red("404 " ) + file);
		}
		else {
			// I'm so proud of him for putting himself out there
			res.writeHead(200, {"Content-Type": "text/html"});
			res.end(buildSite(endTags, endFileData, markdown.toHTML(data)));
			console.log(colour.green("200 " ) + file);
		}
	})
})
// no one knows what it means but it's provacative. GETS THE PEOPLE GOIN!
server.listen(settings.port, () => {
	console.log(`Server is running at ${settings.port}\n`);
})