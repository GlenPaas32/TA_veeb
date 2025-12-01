const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config");
const dbConf= {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc home page for Estonian Film section
//@route GET /Eestifilm
//@access public

//app.get("/Eestifilm", (req, res)=>{
const eestifilm = (req, res)=>{
	res.render("eestifilm");
};

//@desc page for list of people involved in Estonian Film industry
//@route GET /Eestifilm/inimesed
//@access public

//app.get("/Eestifilm/inimesed", async (req, res)=>{
const inimesed = async (req, res)=>{
	let conn;
	const sqlReq = "SELECT * FROM person";
	try {
		conn = await mysql.createConnection(dbConfInga);
		console.log("Andmebaasiأ¼hendus loodud!");
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("filmiinimesed", {personList: rows});
	}
	catch(err) {
		console.log("Viga: " + err);
		res.render("filmiinimesed", {personList: []});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus on suletud!");
		}
	}
};

//@desc page for adding people involved in Estonian Film industry
//@route GET /Eestifilm/inimesed_add
//@access public

//app.get("/Eestifilm/filmiinimesed_add", (req, res)=>{
const inimesedAdd = (req, res)=>{
	res.render("filmiinimesed_add", {notice: "Ootan sisestust"});
};

//@desc page for adding people involved in Estonian Film industry
//@route POST /Eestifilm/inimesed_add
//@access public

//app.post("/Eestifilm/filmiinimesed_add", async (req, res)=>{
const inimesedAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
	
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput >= new Date()){
	  res.render("filmiinimesed_add", {notice: "Osa andmeid oli puudu vأµi ebakorrektsed"});
	}
	
	else {
		try {
			conn = await mysql.createConnection(dbConfInga);
			console.log("Andmebaasiأ¼hendus loodud!");
			let deceasedDate = null;
			if(req.body.deceasedInput != ""){
				deceasedDate = req.body.deceasedInput;
			}
			const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
			console.log("Salvestati kirje: " + result.insertId);
			res.render("filmiinimesed_add", {notice: "Andmed salvestatud"});
		}
		catch(err) {
			console.log("Viga: " + err);
			res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaأµnnestus"});
		}
		finally {
			if(conn){
			await conn.end();
				console.log("Andmebaasiأ¼hendus on suletud!");
			}
		}
	}
};

module.exports = {
	eestifilm,
	inimesed,
	inimesedAdd,
	inimesedAddPost
};