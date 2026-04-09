import { useEffect, useState } from 'react'
import axios from "axios";

const App = () => {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const [editId, setEditId] = useState(null);
  const [editItem, setEditItem] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`https://todo-backend-1-qwqv.onrender.com/api/tasks`);
      setItems(response.data.data);
    }catch (err) {
      console.log(err);
      setError("Failed to fetch tasks");
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async () => {
    if (item.trim().length < 3) {
      return alert("Task must be at least 3 characters");
    }

    setLoading(true);

    try {
      await axios.post(`https://todo-backend-1-qwqv.onrender.com/api/tasks`, { data: { title: item}});
      setItem('');
      fetchItems();
    } catch (err) {
      console.log(err);
      setError("Error adding task");
    }

    setLoading(false);
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://todo-backend-1-qwqv.onrender.com/api/tasks/${id}`);
      fetchItems();
    } catch (err) {
      console.log(err);
      setError("Error deleting task");
    }
  }

  const handleToggle = async (id) => {
    try {
      await axios.put(`https://todo-backend-1-qwqv.onrender.com/api/tasks/${id}/toggle`);
      fetchItems();
    } catch (err) {
      console.log(err);
      setError("Error updating task");
    }
  }

  const handleUpdate = async (id) => {
    if (editItem.trim().length < 3) {
      return alert("Task must be at least 3 characters");
    }
    
    try {
      await axios.put(`https://todo-backend-1-qwqv.onrender.com/api/tasks/${id}`, { data: { title: editItem }});
      setEditId(null);
      fetchItems();
    } catch (err) {
      console.log(err);
      setError("Error updating task");
    }
  }

  const handleSearch = async (value) => {
    setSearch(value);

    if (!value) {
      return fetchItems();
    }

    try {
      const response = await axios.get(`https://todo-backend-1-qwqv.onrender.com/api/tasks/search?term=${value}`);
      setItems(response.data.data);
    } catch (err) {
      console.log(err);
      setError("Search failed");
    }
  }  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">To-Do App</h1>

        <div className="flex gap-2 mb-4">
          <input className="flex-1 border p-2 rounded-lg" placeholder="Enter task" value={item} onChange={(e) => setItem(e.target.value)} />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={handleAdd}>Add</button>
        </div>

        <div className="mb-4">
          <input type="text" placeholder="Search tasks..." value={search} onChange={(e) => handleSearch(e.target.value)} className="w-full border p-2 rounded-lg"/>
        </div>

        {loading && (
          <p className="text-center text-gray-500">Loading...</p>
        )}

        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        <div>
          {!loading && items.length === 0 ? (
            <p className="text-center text-gray-500">No tasks found</p>
          ) : ( 
            items.map((task) => (
              <div key={task._id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={task.completed} onChange={() => handleToggle(task._id)} />
                  {editId === task._id ? (
                    <input className="border p-1 rounded-lg" value={editItem} onChange={(e) => setEditItem(e.target.value)} />
                  ) : (
                    <span className={`text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {editId === task._id ? (
                    <button className="bg-green-500 text-white px-2 py-1 rounded-lg" onClick={() => handleUpdate(task._id)}>Save</button>
                  ) : (
                    <button className="bg-yellow-500 text-white px-2 py-1 rounded-lg" onClick={() => { setEditId(task._id); setEditItem(task.title); }}>Edit</button>
                  )}
                  <button className="bg-red-500 text-white px-2 py-1 rounded-lg" onClick={() => handleDelete(task._id)}>Delete</button>
                </div>
              </div>
            ))  
          )}
        </div>
      </div>
    </div>
  )
}

export default App