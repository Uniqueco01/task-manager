import React, { useEffect, useState } from 'react'
import { CreateTask, DeleteTask, GetTasks, UpdateTask } from '../lib/actions';
import Button from '../components/Button';
import List from '../components/List';
import {TaskModal} from '../components/modal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import Toast from '../components/Toast';

function Task() {

    const [tasks, setTasks] = useState(null)
    const [modalOpen, setModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalTask, setModalTask] = useState(null);
    const [toastMessages, setToastMessages] = useState([]);

    const fetchTasks = async () => {
        setLoading(true);
        const {tasks, message, error} = await GetTasks();
        setTasks(tasks);
        console.log(tasks);
        setLoading(false);
    };
    
    useEffect(() => {
        fetchTasks();
    }, []);


    const handleSaveTask = async (task) => {
        setLoading(true);
        await CreateTask(task);
        fetchTasks();
        setLoading(false);
    }

    const handleUpdateTask = async (task) => {
        setLoading(true);
        await UpdateTask(task.id, task);
        fetchTasks();
        setLoading(false);
    }

    const handleDeleteTask = async (task) => {
        setModalTask(task);
        console.log(task);
        setShowDeleteModal(true);
    }

    const confirmDeleteTask = async (task) => {
        setLoading(true);
        console.log(task);
        const {message, error} = await DeleteTask(task.$id);
        setToastMessages([...toastMessages, {type: error ? "error" : "success", text: message}]);
        fetchTasks();
        setLoading(false);
        setShowDeleteModal(false)
    }

    const handleEditTask = async (task) => {
        setModalTask(task);
        setModalOpen(true);
    }

    const handleSave = async (task) => {
        setLoading(true);
        let result;
        if(task.id) {
            const {id, title, description, completed} = task;
            result = await UpdateTask(id, {title, description, completed});
        } else {
        result = await CreateTask(task);
        }
        if (result) {
            const {message, error} = result;
            setToastMessages([...toastMessages, {type: error ? "error" : "success", text: message}]);
        }
        setModalOpen(false);
        setModalTask(null);
        setLoading(false);
        fetchTasks();
    }

    const totalPendingTasks = tasks ? tasks.filter((task) => !task.completed).length : 0;

    return (
        <div>
            <div className="hidden">
                <Button variant='success' onClick={() => handleSaveTask({title: "New Task", description: "This is a new task"})}>
                    Add Task
                </Button>
                {tasks && tasks.length > 0 && (
                    <Button className='ml-6' onClick={() => handleUpdateTask(tasks[0].$id, {title: "Updated Task", description: "This task has been updated", completed: true})}>
                        Update First Task
                    </Button>
                )}
                {tasks && tasks.map((task) => (
                    <div key={task.$id}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Completed: {task.completed ? 'Yes' : 'No'}</p>
                        <Button variant='danger' onClick={() => handleDeleteTask(task.$id)}>
                            Delete Task
                        </Button>
                    </div>
                ))}
            </div>
            {loading && (
                <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50">
                    <div className="bg-white flex flex-col items-center gap-3 p-6 rounded-md shadow-md">
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                        <span>Loading...</span>
                    </div>    
                </div>
            )}

            <Toast messages={toastMessages} />
            
            <div className="mt-10 w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl text-center font-bold text-blue-600 mb-4">Task manager application</h3>
                <div className="mb-4 shadow-md p-4 rounded-md">
                    <div className=" flex justify-between mb-2">
                        <span className=" text-sm">{totalPendingTasks} pending task{totalPendingTasks !== 1 ? 's' : ''}</span>
                        <Button variant="primary" onClick={() => {setModalOpen(true), setModalTask(null)}}>
                            Add
                        </Button>
                    </div>
                    <List items={tasks|| []} onEdit={handleEditTask} onDelete={handleDeleteTask} />
                </div>
            </div>

            {modalOpen && (
                <TaskModal
                    onClose={() => {setModalOpen(false); setModalTask(null)}}
                    onSave={handleSave}
                    task={modalTask}
                />
            )}

            {showDeleteModal && (
                <ConfirmDeleteModal
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={() => confirmDeleteTask(modalTask)}
                />
            )}
        </div>
    )
}

export default Task
