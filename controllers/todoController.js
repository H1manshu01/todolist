var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connect to the database

mongoose.connect('mongodb://test:test@ds125914.mlab.com:25914/todolist');

//create schema
var todoSchema = new mongoose.Schema({
  item: String
});

var Todo = mongoose.model('Todo',todoSchema);

//Test connection
/*var itemOne = Todo({item:'Learn Angularjs'}).save(function(err){
  if(err) throw err;
  console.log('Item saved');
});*/

//var data = [{item: 'get milk'},{item: 'walk dog'},{item: 'kick some coding ass'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){
  app.get('/todo', function(req,res){
    //get data from mongodb and pass to the view
    Todo.find({},function(err,data){
      if(err) throw err;
      res.render('todo',{todos: data});
    });
  });

  app.post('/todo', urlencodedParser, function(req,res){
    //get data from the view and add it to mongodb
    var newTodo = Todo(req.body).save(function(err,data){
      if(err) throw err;
      res.render('todo',{todos: data});
    });
  });

  app.delete('/todo/:item', function(req,res){
    //delete requested item from mongodb
    Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err,data){
      if(err) throw err;
      res.render('todo',{todos: data});
    });
    //test using dummy data
    /*data = data.filter(function(todo){
      return todo.item.replace(/ /g, "-") !== req.params.item;
    });
    res.render('todo',{todos: data});*/
  });
};
