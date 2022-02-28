const express = require("express");

const ejs = require("ejs");
const mongoose = require('mongoose');
const req = require("express/lib/request");

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}))

//TODO

mongoose.connect("mongodb://localhost/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);


app.get("/articles", function(req,res){
    Article.find({}, function(err, foundArticles){
        if(!err){
            console.log(foundArticles);
            res.send(foundArticles);
        }else{
            res.send(err);
        }
        
    })
})

app.post("/articles", function(req,res){
    
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("successfully added a new article")
        }else{
            res.send(err);
        }
    });
});



app.delete("/articles", function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted");
        }
        else{
            res.send(err);
        }
    });

});
    
//requests targeting a specific article
app.route("/articles/:articleTitle")


.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("no matching articles found");
        }
    });
})

.put(function(req,res){
    Article.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        function(err){
            res.send("successfully updated");
        }
        );
})

.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("successfully replaced")

            }else{
                res.send(err);            }
        }

        );
})

.delete(function(req,res){
    Article.deleteOne({title: req.params.articleTitle}, function(err){
        if(!err){
            res.send("successfully deleted specific one");
        }else{
            res.send(err)
        }
    })
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});