import React from 'react'
import Button from './Button';

function List({ items, onEdit, onDelete, onView }) {
    return (
        <ul className="space-y-2">
            {items.map((item) => (
                <ListItem
                    key={item.$id}
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                />
            ))}
        </ul>
    )
}

export default List


function ListItem({ item, onEdit, onDelete, onView }) {
    const isCompleted = item.completed;
    return (
        <li
            onClick={() => onView(item)}
            className={`flex items-center gap-3 px-3 rounded shadow hover:bg-slate-200 cursor-pointer py-2 ${isCompleted ? 'bg-green-300' : 'bg-yellow-200'}`}
        >
            <span className="font-semibold mr-auto">{item.title}</span>

            <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                <Button variant={'outlineprimary'} onClick={() => onEdit(item)}>
                    Edit
                </Button>
                <Button variant={'outlinedanger'} onClick={() => onDelete(item)}>
                    Delete
                </Button>
            </div>
        </li>
    )
}