const express = require("express");
require("dotenv").config();
const dateTimeET = require("./src/dateTimeET");
const fs = require("fs");
//päringu lahtiharutaja POST jaoks
const bodyparser = require("body-parser");
const session = require ("express-session")
//SQL andmebaasi moodul
const mysql = require("mysql2/promise");
const dbInfo = require("../../vp2025config.js");
const loginCheck = require ("./src/checkLogin.js");
const pool = require("./src/dbPool.js");
const textRef = "./public/txt/vanasonad.txt";
const textRef2 = "./public/txt/visitlog.txt";

const app = express();
app.use(session({secret: dbInfo.configData.sessionSecret, saveUninitialized: true, resave: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
//kui tuleb vormist ainult text, siis false, muidu true
app.use(bodyparser.urlencoded({extended: true}));

console.log("Andmebaasiserver: " + process.env.DB_HOST);

//loon andmebaasi ühenduse
const conn = mysql.createConnection({
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
});
const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
}

app.get("/", (req, res)=>{
	//res.send("Express.js käivitus ja serveerib veebi");
	res.render("index");
});
app.get("/", async (req, res)=>{
	//let conn;
	try {
		//conn = await mysql.createConnection(dbConf);
		let sqlReq = "SELECT filename, alttext FROM galleryphotos_ta WHERE id=(SELECT MAX(id) FROM galleryphotos_ta WHERE privacy=? AND deleted IS NULL)";
		const privacy = 3;
		//const [rows, fields] = await conn.execute(sqlReq, [privacy]);
		const [rows, fields] = await pool.execute(sqlReq, [privacy]);
		//console.log(rows);
		let imgAlt = "Avalik foto";
		if(rows[0].alttext != ""){
			imgAlt = rows[0].alttext;
		}
		res.render("index", {imgFile: "gallery/normal/" + rows[0].filename, imgAlt: imgAlt});
	}
	catch(err){
		//console.log(err);
		//res.render("index");
		res.render("index", {imgFile: "images/otsin_pilte.jpg", imgAlt: "Tunnen end, kui pilti otsiv lammas ..."});
	}
	finally {
		/* if(conn){
			await conn.end();
			//console.log("Andmebaasiأ¼hendus suletud!");
		} */
	}
});
app.get("/timenow", (req, res)=>{
	const weekDayNow = dateTimeET.weekDay();
	const dateTimeNow = dateTimeET.fullDate();
	res.render("timenow", {weekDayNow: weekDayNow, dateTimeNow: dateTimeNow});
});

app.get("/vanasonad", (req, res)=>{
	let folkWisdom = [];
	fs.readFile(textRef, "utf8", (err, data)=>{
			if(err){
				//kui tuleb viga, siis ikka väljastame veebilehe ilma vanasönadeta
				res.render("genlist", {heading: "Valik Eesti vanasõnu", listData: ["Ei leidnud ühtegi vanasõna!"]});
			} else {
				folkWisdom = data.split(";");
				res.render("genlist", {heading: "Valik Eesti vanasõnu", listData: folkWisdom});
			}
	});
});

app.get("/visitlog", (req, res)=>{
	let visitlog = [];
	fs.readFile(textRef2, "utf8", (err, data)=>{
			if(err){
				res.render("visitlog", {heading: "Registreeritud kasutajad", listData: ["Ei leidnud ühtegi kasutajat"]});
			} else {
				visitlog = data.split("\n");
				let correctListData = [];
				for(let i = 0; i < visitlog.length - 1; i ++){
					correctListData.push(visitlog[i]);
				}
				res.render("visitlog", {heading: "Registreeritud kasutajad", listData: correctListData});
			}
	});
});

app.get("/regvisit", (req, res)=>{
	res.render("regvisit");
});

app.post("/regvisit", (req, res)=>{
	res.render("regvisit");
});
//Sisseloginud kasutajate avaleht
app.get("/home", loginCheck.isLogin, (req,res)=>{
	console.log("Sisse logis kasutaja: " + req.session.userId);
	res.render("home", {user: req.session.firstName + " " + req.session.lastName});
});
//Väljalogimine

app.get("/logout", (req, res)=>{
	req.session.destroy();
	console.log("Välja logitud");
	res.redirect("/)")
});
//eestifilmi marsruudid
const eestifilmRouter = require ("./routes/eestifilmRoutes");
app.use("/Eestifilm", eestifilmRouter)
//Galerii marsruudid
const galleryRouter = require("./routes/galleryRoutes");
app.use("/photogallery", galleryRouter);

//konto loomise marsruudid
const signupRouter = require("./routes/signupRoutes");
app.use("/signup", signupRouter);
//sisselogimise marsruudid
const signinRouter = require("./routes/signinRoutes");
app.use("/signin", signinRouter);

app.listen(5134, () => {
    console.log("Server töötab pordil 5134");
});
