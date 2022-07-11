// import modules
const http = require("http");
const fs = require("fs");
const colour = require("colour");
const markdown = require("markdown").markdown;
const mustache = require("mustache");
// import settings
const settings = require("./settings.json")

var server = http.createServer((req, res) => {
	let file;
	if (req.url[req.url.length - 1] === "/"){
		file = `./${settings.siteDir}${req.url}${settings.indexFileName}`;
	}
	else {
		file = `./${settings.sitDir}${req.url}`
	}
	fs.readFile(file, settings.encoding, (err, data) => {
		if (err) {
			res.writeHead(404, {"Content-Type": "text/html"});
			res.end("whoopsie daisy");
		}
		else {
			res.writeHead(200, {"Content-Type": "text/html"});
			res.end(markdown.toHTML(data));
		}
	})
})

server.listen(settings.port, () => {
	console.log(`Server is running at ${settings.port}\n`);
})