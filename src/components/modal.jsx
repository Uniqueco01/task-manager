import {useEffect, useState} from 'react'
import React from 'react'
import Input, { Textarea } from './Input'
import Button from './Button'

function Modal({onClose, onSave, task}) {
    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");
    const [confirmChecked, setConfirmChecked] = useState(false);
    const handleSave = () => {
        // console.log("title:", title, "confirmChecked:", confirmChecked, "task:", task);
        if(!title.trim()) return;
        if(task && !confirmChecked) return;
        const isCompleted = title.trim() !== "" && description.trim() !== "";
        onSave({
            id: task?.id || Date.now(),
            title,
            description,
            completed: isCompleted,
        });
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4 text-center">
                    {task ? "Update Task" : "Add New Task"}
                </h2>
                <div className="mb-4">
                    <Input className="w-full" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="mb-4">
                    <Textarea className="w-full" placeholder="Task Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                {task && (
                    <div className="mb-4 flex items-center gap-2">
                        <input type="checkbox" id='confirm' checked={confirmChecked} onChange={(e) => setConfirmChecked(e.target.checked)} />
                        <label htmlFor="confirm">Confirm Update</label>
                    </div>
                )}
                <div className="flex justify-end gap-2">
                    <Button variant={'outlinedanger'} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant={'outlineprimary'} className="mr-2" onClick={handleSave}>
                        {task ? "Update Task" : "Add Task"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Modal


export function TaskModal({onClose, onSave, task}) {
    const [newTask, setNewTask] = useState(task || {title: "", description: ""});

    const handleSave = () => {
        if(!newTask.title.trim()) return;

        const taskToSave = {
            title: newTask.title.trim(),
            description: newTask.description.trim(),
            completed: newTask.completed || false,
        };
        console.log(task);

        if(task) {
            taskToSave.id = task.$id;
        }
        onSave(taskToSave);
    };

    useEffect(() => {
        if(task) {
            setNewTask(task);
        } else {
            setNewTask({title: "", description: ""});
        }
    }, [task]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4 text-center">
                    {task ? "Update Task" : "Add New Task"}
                </h2>
                <div className="mb-4">
                    <Input className="w-full" placeholder="Task Title" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
                </div>
                <div className="mb-4">
                    <Textarea className="w-full" placeholder="Task Description" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} />
                </div>
                {task && (
                    <div className="mb-4 flex items-center gap-2">
                        <input type="checkbox" id='confirm' checked={newTask.completed} onChange={(e) => setNewTask({...newTask, completed: e.target.checked})} />
                        <label htmlFor="confirm">Completed</label>
                    </div>
                )}
                <div className="flex justify-end gap-2">
                    <Button variant={'outlinedanger'} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant={'outlineprimary'} className="mr-2" onClick={handleSave}>
                        {task ? "Update Task" : "Add Task"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

