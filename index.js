const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser")
const dateTimeEt = require("./src/dateTimeEt");
const textRef = "public/txt/vanasonad.txt";

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public")); 
app.use(bodyparser.urlencoded({extended: false}))

// Avaleht
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/timeNow", (req, res) => {
    res.render("timeNow", {
        heading: "Praegune aeg",
        fullDate: dateTimeEt.fullDate(),
        fullTime: dateTimeEt.fullTime(),
        weekday: dateTimeEt.weekDay(),
        partOfDay: dateTimeEt.partOfDay()
    });
});


// Vanasõnad
app.get("/vanasonad", (req, res) => { 
    fs.readFile(textRef, "utf8", (err, data) => {
        if (err) {
            res.render("genlist", {
                heading: "Valik Eesti vanasõnu",
                listData: ["Ei leidnud ühtegi vanasõna"]
            });
        } else {
            const folkwisdom = data.split(";").map(item => item.trim()).filter(item => item.length > 0);
            res.render("genlist", {
                heading: "Valik Eesti vanasõnu",
                listData: folkwisdom
            });
        }
    });
});
app.get("/reqvisit", (req,res)=>{
    res.render("reqvisit")
})
app.post("/reqvisit", (req, res) => {
    console.log(req.body);

    fs.appendFile("public/txt/visitlog.txt", req.body.nameInput + ";\n", (err) => {
        if (err) {
            console.error("Salvestamisel tekkis viga:", err);
            return res.status(500).send("Salvestamine ebaõnnestus");
        } else {
            console.log("Salvestatud!");
            res.render("reqvisit"); 
        }
    });

});

        

        
    
	res.render("reqvisit");

app.listen(5134, () => {
    console.log("Server töötab pordil 5134");
});
