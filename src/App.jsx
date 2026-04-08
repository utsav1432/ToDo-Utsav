import { useEffect, useState } from 'react'
import axios from "axios";

const App = () => {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const [editId, setEditId] = useState(null);
  const [editItem, setEditItem] = useState("");
  const [search, setSearch] = useState("");

  const fetchItems = async () => {
    try {
      const response = await axios.get(`https://todo-backend-1-qwqv.onrender.com/api/tasks`);
      setItems(response.data.data);
    }
    catch (err) {
      alert("Unable to fetch tasks from the server");
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async () => {
    if (!item) return alert("Enter task");
    try {
      await axios.post(`https://todo-backend-1-qwqv.onrender.com/api/tasks`, { data: { title: item}});
      setItem('');
      fetchItems();
    } catch (err) {
      alert("Error adding task");
    }
  }

  const handleDelete = async (id) => {
    await axios.delete(`https://todo-backend-1-qwqv.onrender.com/api/tasks/${id}`);
    fetchItems();
  }

  const handleToggle = async (id) => {
    await axios.put(`https://todo-backend-1-qwqv.onrender.com/api/tasks/${id}/toggle`);
    fetchItems();
  }

  const handleUpdate = async (id) => {
    await axios.put(`https://todo-backend-1-qwqv.onrender.com/api/tasks/${id}`, { data: { title: editItem }});
    setEditId(null);
    fetchItems();
  }

  const searchItems = items.filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">To-Do App</h1>

        <div className="flex gap-2 mb-4">
          <input className="flex-1 border p-2 rounded-lg" placeholder="Enter task" value={item} onChange={(e) => setItem(e.target.value)} />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={handleAdd}>Add</button>
        </div>

        <div className="flex gap-2 mb-4">
          <input type="text" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 border p-2 rounded-lg"/>
        </div>

        <div>
          {searchItems.length === 0 ? (
            <p className="text-center text-gray-500">No tasks found</p>
          ) : ( 
            searchItems.map((task) => (
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