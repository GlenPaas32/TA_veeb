const fs = require("fs");
const textRef = "./txt/vanasonad.txt";

function pickOne(rawText){
	let oldWisdomList = rawText.split(";");
	let MOTD = oldWisdomList[Math.round(Math.random() * (oldWisdomList.length - 1))];
	console.log(MOTD)
	return MOTD;
}

function readTextFile(){
	fs.readFile(textRef, "utf8", (err, data)=>{
		if(err){
			console.log(err);
		} else {
			pickOne(data);
		}
	});
}

//console.log("Täna on " + dateET.fullDate());
//console.log("Kell on " + dateET.fullTime());
//console.log("Praegu on " + dateET.partOfDay() + ".")
readTextFile();

module.exports = {vanasona: MOTD};