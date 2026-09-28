import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";
import { client } from "./lib/appwrite";
import { db } from "./appwriteConfig";
import Button from "./components/Button";
import Input, { Textarea } from "./components/Input";
import List from "./components/List";

function App() {

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

  return (
    <>
      
      <div className="mt-10 w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl text-center font-bold text-blue-600 mb-4">Task manager application</h3>
        
        <div>
<div>
  <span className="font-semibold">
    
  </span>
</div>
        <List items={[
          {id: 1, title: "Sample Todo Item", completed: false },
          {id: 2, title: "Another Todo Item", completed: true },
          {id: 3, title: "Yet Another Todo Item", completed: false }
        ]} />
        </div>
        
      </div>
    </>
  )
}

export default App;
