import React, { useEffect, useState } from 'react'
import { CreateTask, DeleteTask, GetTasks, UpdateTask } from '../lib/actions';
import Button from '../components/Button';
import List from '../components/List';
import { TaskModal } from '../components/modal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import Toast from '../components/Toast';
import useUserStore from '../store/useUserStore';

function Task() {
    const user = useUserStore((s) => s.user);

    const [tasks, setTasks] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalTask, setModalTask] = useState(null);
    const [toastMessage, setToastMessage] = useState({});
    const [viewTask, setViewTask] = useState(null);

    const fetchTasks = async () => {
        setLoading(true);
        const { tasks, message, error } = await GetTasks();
        if (error) setToastMessage({ type: "error", text: message });
        setTasks(tasks || []);
        setLoading(false);
    };

    useEffect(() => {
        if (user) fetchTasks();
    }, [user]);

    const handleDeleteTask = (task) => {
        setModalTask(task);
        setShowDeleteModal(true);
    };

    const confirmDeleteTask = async (task) => {
        setLoading(true);
        const { message, error } = await DeleteTask(task.$id);
        setToastMessage({ type: error ? "error" : "success", text: message });
        await fetchTasks();
        setLoading(false);
        setShowDeleteModal(false);
    };

    const handleEditTask = (task) => {
        setModalTask(task);
        setModalOpen(true);
    };

    const handleSave = async (task) => {
        setLoading(true);
        let result;
        const taskId = task.$id || task.id;
        if (taskId) {
            const { title, description, completed } = task;
            result = await UpdateTask(taskId, { title, description, completed });
        } else {
            result = await CreateTask(task, user.$id);
        }
        if (result) {
            const { message, error } = result;
            setToastMessage({ type: error ? "error" : "success", text: message });
        }
        setModalOpen(false);
        setModalTask(null);
        await fetchTasks();
        setLoading(false);
    };

    const totalPendingTasks = tasks ? tasks.filter((task) => !task.completed).length : 0;

    return (
        <div>
            {loading && (
                <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50">
                    <div className="bg-white flex flex-col items-center gap-3 p-6 rounded-md shadow-md">
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                        <span>Loading...</span>
                    </div>
                </div>
            )}

            <Toast message={toastMessage} />

            <div className="mt-10 w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl text-center font-bold text-blue-600 mb-4">Task manager application</h3>
                <div className="mb-4 shadow-md p-4 rounded-md">
                    <div className=" flex justify-between mb-2">
                        <span className=" text-sm">{totalPendingTasks} pending task{totalPendingTasks !== 1 ? 's' : ''}</span>
                        <Button variant="primary" onClick={() => { setModalOpen(true); setModalTask(null); }}>
                            Add
                        </Button>
                    </div>
                    <List items={tasks || []} onEdit={handleEditTask} onDelete={handleDeleteTask} onView={setViewTask} />
                </div>
            </div>

            {modalOpen && (
                <TaskModal
                    onClose={() => { setModalOpen(false); setModalTask(null); }}
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

            {viewTask && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50"
                    onClick={() => setViewTask(null)}
                >
                    <div
                        className="w-11/12 max-w-sm rounded-lg bg-white p-6 shadow-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="mb-2 text-xl font-bold text-blue-600">{viewTask.title}</h3>
                        <p className="mb-3 text-sm text-slate-700">
                            {viewTask.description || "No description"}
                        </p>
                        <p className="mb-4 text-sm font-semibold">
                            Status: {viewTask.completed ? "Completed ✅" : "Pending ⏳"}
                        </p>
                        <button
                            onClick={() => setViewTask(null)}
                            className="w-full rounded-full bg-blue-500 px-4 py-2 font-bold text-white"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Task