import React, { useState, useEffect } from "react";
import axios from "axios";

const Todos = () => {
  const [newTodo, setNewToDo] = useState({
    title: "",
    description: "",
  });
  const [todos, setTodos] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);

  // Fetch Todos when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/todos");
        setTodos(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("Something went wrong:", error);
      }
    };
    fetchData();
  }, []);

  // Add a new todo
  const addPost = () => {
    axios
      .post("http://localhost:4000/todos", newTodo)
      .then((res) => {
        setTodos([...todos, res.data]);
        setNewToDo({ title: "", description: "" });
      })
      .catch((err) => {
        console.log("Something went wrong:", err);
      });
  };

 

  // Handle input changes for title and description
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewToDo({
      ...newTodo,
      [name]: value,
    });
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/todos/${id}`);
      setTodos(todos.filter((todos) => todos._id !== id));
    } catch (err) {
      console.error("Something went wrong:", err);
    }
  };

  // Update post function
  const updatePost = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/todos/${currentPostId}`,
        newTodo
      );
      setTodos(
        todos.map((todo) => (todo._id === currentPostId ? response.data : todo))
      ); // Update the state with the new todo
      setNewToDo({ title: "", description: "" }); // Clear the input fields after updating
      setIsUpdating(false); // Reset the updating state
      setCurrentPostId(null); // Reset the current post ID
    } catch (err) {
      console.log("Something went wrong:", err);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (isUpdating) {
      updatePost(); // Call the update function if in updating mode
    } else {
      addPost(); // Otherwise, call the add function
    }
  };

  const handleUpdate = (todo) => {
    setNewToDo({ title: todo.title, description: todo.description });
    setIsUpdating(true);
    setCurrentPostId(todo._id);
  };

  return (
    <>
      <div className="px-5 p-2 bg-success text-white">
        <h1>TodoList project using MERN Stack</h1>
      </div>
      <div className="container mt-4">
        <div className="row">
          <h2>Add items</h2>
          {/* Form for adding a new Todo */}
          <div className="form-group d-flex gap-3">
            {/* Title */}
            <input
              name="title" // Add name for identifying input field
              onChange={handleInputChange}
              type="text"
              placeholder="Title"
              value={newTodo.title}
              className="form-control"
            />
            {/* Description */}
            <input
              name="description" // Add name for identifying input field
              onChange={handleInputChange}
              type="text"
              placeholder="Description"
              value={newTodo.description}
              className="form-control"
            />
            {isUpdating ? (
              <button
                onClick={handleSubmit}
                type="submit"
                className="btn btn-warning  text-white px-5"
              >
                Update
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                type="submit"
                className="btn btn-success px-5"
              >
                Post
              </button>
            )}
          </div>

          {/* Display Todos */}
          <ul className="list-group mb-4 mt-5">
            {todos.length === 0 ? (
              <p className="text-center">No items</p>
            ) : (
              todos.map((todo) => (
                <li key={todo._id} className="list-group-item">
                  <h2>{todo.title}</h2>
                  <p>{todo.description}</p>
                  <div className="d-flex gap-3">
                    <button
                      onClick={() => handleUpdate(todo)}
                      className="btn btn-warning"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deletePost(todo._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Todos;
