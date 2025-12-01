exports.isLogin = function(req, res, next){
	if(req.session != null){
		if(req.session.userId){
			console.log("Sees on kasutaja: " + req.session.userId);
			next();
		} else {
			console.log("Sisselogimist pole tuvastatud!");
			return res.redirect("/signin");
		}
	} else {
		console.log("Sisselogimist pole tuvastatud!");
		return res.redirect("/signin");
	}
}