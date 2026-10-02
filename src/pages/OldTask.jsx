import { useState, useRef, useEffect, useCallback, use } from "react";

import { client } from "./lib/appwrite";
import { db } from "./appwriteConfig";
import Button from "./components/Button";
import Input, { Textarea } from "./components/Input";
import List from "./components/List";
import Modal from "./components/modal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

function OldTask() {

  const [todoItems, setTodoItems] = useState([]);
  useEffect(() => {
    getItems()
  }, [])
  const getItems = async () => {
    try {
    
      
    } catch(error) {
      console.log(error);
      
    }
  }
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [
      {id: 1, title: "Sample Todo Item", completed: false },
    ];
  });
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  const [showModal, setShowModal] = useState(false);

  const [taskToDelete, setTaskToDelete] = useState(null);
  const handleDelete = (id) =>{
    setTaskToDelete(id);
  };
  const confirmDelete = () => {
    setTasks(tasks.filter((t) => t.id !== taskToDelete));
    setTaskToDelete(null);
  }
  const [editingTask, setEditingTask] = useState(null);
  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };
  const [message, setMessage] = useState("");
  const handleSave = (task) => {
    const isCompleted = task.completed;
    if(editingTask) {
      setTasks(tasks.map((t) => t.id === task.id ? task : t));
      setEditingTask(null);
      setMessage(isCompleted ? "Task updated successfully!" : "Task pending!");
    } else {
      const newTask = { ...task, id: Date.now() };
      setTasks([ ...tasks, newTask]);
      setMessage(isCompleted ? "Task added successfully!" : "Task pending!");
    }
    setShowModal(false);
    setTimeout(() => {
      setMessage("");
    }, 1000);
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;
  console.log("tasks:", tasks);
  
  return (
    <>
      {showModal && (
        <Modal
        key={editingTask ? editingTask.id : "new"}
          onClose={() => {setShowModal(false); setEditingTask(null)}}
          onSave={handleSave}
          task ={editingTask}
        />)}
      {taskToDelete && (
        <ConfirmDeleteModal
          onClose={() => setTaskToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
      <div className="mt-10 w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl text-center font-bold text-blue-600 mb-4">Task manager application</h3>
        
        <div className="mb-4 shadow-md p-4 rounded-md">
<div className=" flex justify-between mb-2">
  <span className=" text-sm">{pendingCount} pending task{pendingCount !== 1 ? 's' : ''}</span>
    <Button variant="primary" onClick={() => setShowModal(true)}>
      Add
    </Button>
</div>
     { message && (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative mb-4" role="alert">
        <span className="block sm:inline">{message}</span>
      </div>
     )}
        <List items={tasks} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
        
      </div>
    </>
  )
}

export default OldTask;
