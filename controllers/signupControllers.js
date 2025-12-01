const mysql = require("mysql2/promise");
const argon2 = require("argon2");
const validator = require("validator")
const dbInfo = require("../../../vp2025config.js");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc home page for signup
//@route GET /signup
//@access public

const signupPage = (req, res)=>{
	res.render("signup", {notice: "Ootan andmeid"});
};

//@desc page for creating use account, signup
//@route POST /signup
//@access public

const signupPagePost = async (req, res)=>{
	let conn;
	let notice = "";
	console.log(req.body);
	//andmete valideerimine
	const firstName = validator.escape(req.body.firstNameInput.trim());
	const lastName = validator.escape(req.body.lastNameInput.trim());
	const birthDate = req.body.birthDateInput;
	const gender = req.body.genderinput;
	const email = req.body.emailInput.trim();
	const password = req.body.passwordInput;
	const confirmPassword = req.body.confirmPasswordInput;

	if(!firstName || !lastName || !birthDate || !gender || !email || !password || !confirmPassword){
		console.log(notice);
		return res.render("signup", {notice : notice});
	}
	//kas email on korras
	if (!validator.isEmail(email)){
		notice ="E-Mail on vigane!";
		console.log(notice);
		return res.render("signup", {notice : notice});
	}
	  //kas parool on piisavlt tugev
	  const passwordOption = {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0};
	  if(validator.isStrongpassword(password, passwordOption)){
		notice = "Parool on nõrk!"
		console.log(notice);
		return res.render("signup", {notice : notice});
	}
	
	if(password !== confirmPassword){
		notice = "Parool on vale!"
		console.log(notice);
		return res.render("signup", {notice : notice});

	}

	//kas sünnikuupäev on õige
	if(!validator.isDate(birthDate) || validator.isAfter(birthDate)){
		notice = "Sünnikuupäev ei klapi"
		console.log(notice);
		return res.render("signup", {notice : notice});
	}


	  //krأ¼pteerime parooli
	  const pwdHash = await argon2.hash(req.body.passwordInput);
	  //console.log(pwdHash);
	  //console.log(pwdHash.length);
	  
try {
	  conn = await mysql.createConnection(dbConf);
	  //kontrollin, ega sellist juba pole
	  let sqlReq = "SELECT id from users_ta WHERE email = ?";
	  const [users] = await conn.execute(sqlReq, [req.body.emailInput]);
	  if (users.length > 0){
		  notice = "Selline kasutaja on juba olemas!";
		  //console.log(notice);
		  return res.render("signup", {notice: notice});
	  }
	  
	  //krأ¼pteerime parooli
	  const pwdHash = await argon2.hash(req.body.passwordInput);
	  //console.log(pwdHash);
	  //console.log(pwdHash.length);
	  
	  sqlReq = "INSERT INTO users_ta (first_name, last_name, birth_date, gender, email, password) VALUES (?,?,?,?,?,?)";
	  const [result] = await conn.execute(sqlReq, [
	    req.body.firstNameInput,
		req.body.lastNameInput,
		req.body.birthDateInput,
		req.body.genderInput,
		req.body.emailInput,
		pwdHash
	  ]);
	  //console.log("Salvestati kasutaja: " + result.insertId);
	  res.render("signup", {notice: "Kأµik on hأ¤sti!"});
	}
	catch(err) {
	  console.log(err);
	  res.render("signup", {notice: "Tehniline viga"});
	}
	finally {
	  if(conn){
	  await conn.end();
	    //console.log("Andmebaasiأ¼hendus on suletud!");
	  }
	}
};

module.exports = {
	signupPage,
	signupPagePost
};