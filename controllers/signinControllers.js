const mysql = require("mysql2/promise");
const argon2 = require("argon2");
const pool = require("../src/dbPool");
//const dbInfo = require("../../../../../vp2025config");

/* const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
}; */

//@desc home page for signin
//@route GET /signin
//@access public

const signinPage = (req, res)=>{
	res.render("signin", {notice: "Sisesta oma kasutajatunnus ning parool!"});
};

//@desc page for signin
//@route POST /signin
//@access public

const signinPagePost = async (req, res)=>{
	//let conn;
	//console.log(req.body);
	//andmete valideerimine
	if(
		!req.body.emailInput ||
		!req.body.passwordInput
	) {
		let notice = "Sisselogimise andmed on puudulikud!";
		//console.log(notice);
		return res.render("signin", {notice: notice});
	}
	
	try {
	  //conn = await mysql.createConnection(dbConf);
	  let sqlReq = "SELECT id, password FROM users_ta WHERE email = ?";
	  //const [users] = await conn.execute(sqlReq, [req.body.emailInput]);
	  const [users] = await pool.execute(sqlReq, [req.body.emailInput]);
	  //kas sellise emailiga kasutaja leiti
	  if(users.length === 0){
		  return res.render("signin", {notice: "Kasutajatunnus ja/vأµi parool on vale!"});
	  }
	  
	  const user = users[0];
	  
	  //parooli kontrollimine
	  const match = await argon2.verify(user.password, req.body.passwordInput);
	  if(match){
		  //logisime sisse
		  //return res.render("signin", {notice: "Oledki sees!"});
		  
		  //paneme sessiooni kأ¤ima ja mأ¤أ¤rame sessiooni أ¼he muutuja
		  req.session.userId = user.id;
		  sqlReq = "SELECT first_name, last_name FROM users_ta WHERE id = ?";
		  //const [users] = await conn.execute(sqlReq, [req.session.userId]);
		  const [users] = await pool.execute(sqlReq, [req.session.userId]);
		  req.session.firstName = users[0].first_name;
		  req.session.lastName = users[0].last_name;
		  return res.redirect("/home");
	  } else {
		  //parool oli vale
		  //console.log("Vale parool!");
		  return res.render("signin", {notice: "Kasutajatunnus ja/või parool on vale!"});
	  }
	  
		  res.render("signin", {notice: "Kأµik on hأ¤sti!"});
	}
	catch(err) {
	  console.log(err);
	  res.render("signin", {notice: "Tehniline viga"});
	}
	finally {
	  /* if(conn){
	  await conn.end();
	    //console.log("Andmebaasiأ¼hendus on suletud!");
	  } */
	}
};

module.exports = {
	signinPage,
	signinPagePost
};