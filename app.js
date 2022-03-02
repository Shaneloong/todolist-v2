const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();


app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static('public'));

app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin-shane:sarangjiajing@cluster0.gwrin.mongodb.net/todolistDB");

const itemsSchema = mongoose.Schema({
    name: String
});


const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
    name: 'Assignment'
});

const item2 = new Item({
    name: 'Tutorial'
});

const item3 = new Item({
    name: 'Lecture Class'
});

const defaultItems = [item1, item2, item3]; 

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model('List', listSchema);
 

app.get("/", function(req, res){

    Item.find({}, function(err, foundItems){
        if (foundItems.length === 0){
                
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Data Added Successfully");
                }
            });
            res.redirect('/');
        } else{
            res.render('list', {listTitle: "Today", newListItem: foundItems});
        }
    })
    
    
});

app.get('/:listName', function(req,res){
    const customListName = _.capitalize(req.params.listName);
    
    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if (!foundList){
                // Creating a New Custom List
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect('/'+ customListName);
            }
            else{
                // Showing an Existing List
                res.render('list', {listTitle: foundList.name, newListItem:foundList.items})
            }
        }
        
    })
})

app.get('/about', function(req, res){
    res.render('about');
})


app.post("/", function(req, res){

    const itemName = req.body.newItem;
    const listName = req.body.list;
    const itemDoc = new Item({
        name: itemName
    });
    
    if (listName === 'Today'){
        itemDoc.save();
        res.redirect('/');
    }
    else{
        List.findOne({name: listName}, function(err, foundList){
            if(!err){
                foundList.items.push(itemDoc);
                foundList.save();
                res.redirect('/'+listName);
            } 
        });
    }
});

app.post('/delete', function(req, res){
    const itemID = req.body.checkbox;
    const listTitle = req.body.listName;
    if(listTitle === 'Today'){
        Item.findByIdAndRemove(itemID, (err)=>{
            if (!err){
                res.redirect("/");
            }
        });
    }else{
        List.findOneAndUpdate({name: listTitle}, {$pull: {items: { _id: itemID}}}, function(err, foundList){
            if(!err){
                res.redirect('/' + listTitle);
            } 
        });
    }

        
    
    
});


app.get('/about', function(req, res){
    res.render('about');
});



app.listen(process.env.PORT || 3000, function(){
    console.log("Server is started successfully on port 3000");
});
