const express=require("express");
const path=require("path");
const app=express();

const {URL}=require("./models/url");

const port=8002;

const {connectMongoDB}=require("./connection")

connectMongoDB("mongodb://127.0.0.1:27017/url")
.then(()=>console.log("mongodb connected"));


app.set("view engine","ejs");
app.set("views",path.resolve("./views"))

const urlRoute=require("./routes/url");
const staticRoute=require("./routes/staticRouter");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use("/url",urlRoute);
app.use("/",staticRoute);

/* app.get("/test",async (req,res)=>{
    const allUrls=await URL.find({});
    return res.render("home",{
        urls:allUrls,
    });
}) */

app.get("/:shortId",async (req,res)=>{
    const shortId=req.params.shortId;
    const entry=await URL.findOneAndUpdate({shortId},{$push:{visitHistory:{timestamp:Date.now()}}});
    res.redirect(entry.redirectURL);
})

app.listen(port,()=>console.log(`Server started at port ${port}`));