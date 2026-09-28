import React from 'react'
import Button from './Button';

function List({items}) {
    return (
        <ul className="space-y-2">
            {items.map((item, index) => (
                <ListItem key={index} item={item} />
            ))}
        </ul>
    )
}

export default List


function ListItem({item}) {
    const isCompleted = item.completed;
    return (
        <li className={`flex items-center gap-3 px-3 rounded shadow hover:bg-slate-200 cursor-pointer py-2 ${isCompleted ? 'bg-green-300' : ''}`}>
            <span className="font-semibold mr-auto">{item.title}</span>
            <Button variant={'outlineprimary'}>
                Edit
            </Button>
            <Button variant={'outlinedanger'}>
                Delete
            </Button>
        </li>
    )
}
