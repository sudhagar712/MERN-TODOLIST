// Using express

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")

// create an instance  of express

const app = express();
app.use(express.json());
app.use(cors())

// sample memory storage for todoitems
// let todos = [];

// connecting mongodb

mongoose
  .connect("mongodb://localhost:27017/mern-app")
  .then(() => {
    console.log("DB is Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// creating schema

const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: String,
});

// Creating Model

const todoModel = mongoose.model("Todo", todoSchema);

// create a new Todo items

app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

// get all items
app.get("/todos", async(req, res) => {
 
  try{
    const todos = await todoModel.find();
     res.json(todos);
  }catch(error){
    console.log(error);
    res.status(500).json({ message: error.message });

  }
});


// Update the items

app.put('/todos/:id' , async(req, res) => {
try{
    const id = req.params.id;
    const {title, description} = req.body;
     const updateToDo = await todoModel.findByIdAndUpdate(
        id,
        {title , description},
        {new : true}
      )

      if(!updateToDo){
        return res.status(404).json({message : "Not found" })
      }
      res.json(updateToDo);

}catch(error){
    console.log(error);
    res.status(500).json({message : error.message})
}
})


// delete items 

app.delete('/todos/:id', async(req,res)=>{
    try{
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch{
        console.log(error);
        res.status(500).json({message : error.message})
    }
})









const port = 4000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
