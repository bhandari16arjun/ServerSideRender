const express=require("express");
const path=require("path");
const {connectMongoDB}=require("./connection");
const URL=require("./models/url");

const urlRoute=require("./routes/url");
const staticRoute=require("./routes/staticRouter");




const app=express();
const port=8003;

connectMongoDB("mongodb://127.0.0.1:27017/url2")
.then(()=>console.log("mongodb connected"));


app.set("view engine","ejs");
app.set("views",path.resolve("./views"))



app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.use("/url",urlRoute);

app.use("/",staticRoute);





app.listen(port,()=>console.log(`Server started at port ${port}`));













/* app.get("/test",async (req,res)=>{
    const allUrls=await URL.find({});
    return res.render("home",{
        urls:allUrls,
    });
}) */


