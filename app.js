const express = require("express");
const mongoose = require("mongoose");
const shortUrl = require("./models/short");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));

mongoose.connect("mongodb://127.0.0.1:27017/urlDB");

app.get("/", async(req, res) => {
    const shortUrls = await shortUrl.find();
    res.render("index.ejs", {shortUrls: shortUrls});
});

app.post("/short", async(req, res) => {
    await shortUrl.create({full: req.body.fullUrl})
    res.redirect("/");
});

app.get("/:short", async(req, res) => {
    const short = await shortUrl.findOne({short: req.params.short});
    if(short == null){
        return res.sendStatus(404);
    };
    short.clicks++;
    short.save();
    res.redirect(short.full);
});

app.listen(process.env.PORT || 3000);