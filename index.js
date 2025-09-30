const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
const dateEt = require("./src/dateET2");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
//päringu url-i parsiminne, eraldame POST osa. False = ainult tekst, True = muu info ka
app.use(bodyparser.urlencoded({extended: false}));
app.get("/", (req, res)=>{
	//res.send("Express.js läks edukalt käima");
	res.render("index");
});

app.get("/timenow", (req, res)=>{

	res.render("timenow", {nowDate: dateEt.longDate(), nowWD: dateEt.weekDay()});
});
app.get("/vanasonad", (req, res)=>{
	fs.readFile("public/txt/vanasonad.txt", "utf8", (err, data)=>{
		if(err){
			res.render("genericlist", {heading: "Valik Eesti tuntud vanasأµnasid", listData: ["Kahjuks vanasأµnasid ei leidnud!"]});
		} else {
			let folkWisdom = data.split(";");
			res.render("genericlist", {heading: "Valik Eesti tuntud vanasأµnasid", listData: folkWisdom});
		}
	});
	
});

app.get("/regvisit", (req, res)=>{
	res.render("regvisit");
});

app.post("/regvisit", (req, res)=>{
	console.log(req.body);
	//avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
			fs.appendFile("public/txt/visitlog.txt", req.body.nameInput + ";", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("regvisit");
				}
			});
		}
	});
});

app.listen(5226);