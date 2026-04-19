import { useEffect, useState } from 'react'
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

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
      const response = await axios.get(`${API_URL}/tasks`);
      setItems(response.data.data);
    }catch (err) {
      console.log(err);
      setError("Failed to get all tasks");
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async () => {
    if (item.trim().length < 3) {
      return alert("Task must have atleast 3 characters");
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/tasks`, { 
        data: { 
          title: item 
        }
      });
      setItem('');
      fetchItems();
    } catch (err) {
      console.log(err);
      setError("Failde to add task");
    }

    setLoading(false);
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchItems();
    } catch (err) {
      console.log(err);
      setError("Couldn't delete task");
    }
  }

  const handleToggle = async (id) => {
    try {
      await axios.put(`${API_URL}/tasks/${id}/toggle`);
      fetchItems();
    } catch (err) {
      console.log(err);
      setError("Couldn't Complete task");
    }
  }

  const handleUpdate = async (id) => {
    if (editItem.trim().length < 3) {
      return alert("Task must be at least 3 characters");
    }
    
    try {
      await axios.put(`${API_URL}/tasks/${id}`, { data: { title: editItem }});
      setEditId(null);
      fetchItems();
    } catch (err) {
      console.log(err);
      setError("Couldn't update task");
    }
  }

  const handleSearch = async (value) => {
    setSearch(value);

    if (!value) {
      return fetchItems();
    }

    try {
      const response = await axios.get(`${API_URL}/tasks/search?term=${value}`);
      setItems(response.data.data);
    } catch (err) {
      console.log(err);
      setError("Search failed");
    }
  }  

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 bg-[#172842] text-white">
        <h1 className="text-2xl font-bold text-center mb-8 mt-2">Manage Your Todos</h1>

        <div className="flex gap-2 mb-4">
          <input type='text' className="w-full border-black/10 rounded-l-lg px-3 outline-none bg-white/20 py-1.5" placeholder="Write Todo.." value={item} onChange={(e) => setItem(e.target.value)} />
          <button className="rounded-r-lg px-3 py-1 bg-green-600 text-white shrink-0" onClick={handleAdd}>Add</button>
        </div>

        <div className="mb-4">
          <input type="text" placeholder="Search tasks..." value={search} onChange={(e) => handleSearch(e.target.value)} className="w-full border-black/10 rounded-lg px-3 outline-none duration-150 bg-white/20 py-1.5"/>
        </div>

        {loading && (
          <p className="text-center text-white p-3">Loading...</p>
        )}

        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        <div className="flex flex-wrap gap-y-3">
          {!loading && (!items || items.length === 0) ? (
            <p className="text-center text-white">No tasks found</p>
          ) : ( 
            items.map((task) => (
              <div key={task._id} className="w-full">
                <div className="flex border border-black/10 rounded-lg px-3 py-1.5 gap-x-3 shadow-sm shadow-white/50 duration-300">
                  <input className='cursor-pointer' type="checkbox" checked={task.completed} onChange={() => handleToggle(task._id)} />
                  {editId === task._id ? (
                    <input className="border outline-none w-full bg-transparent rounded-lg" value={editItem} onChange={(e) => setEditItem(e.target.value)} />
                  ) : (
                    <span className={`text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</span>
                  )}

                  <span className="flex gap-2 ml-auto justify-end">
                    {editId === task._id ? (
                      <button className="bg-green-500 text-white px-2 py-1 rounded-lg" onClick={() => handleUpdate(task._id)}>Save</button>
                    ) : (
                      <button className="bg-yellow-500 text-white px-2 py-1 rounded-lg" onClick={() => { setEditId(task._id); setEditItem(task.title); }}>Edit</button>
                    )}
                    <button className="bg-red-500 text-white px-2 py-1 rounded-lg" onClick={() => handleDelete(task._id)}>Delete</button>
                  </span>
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