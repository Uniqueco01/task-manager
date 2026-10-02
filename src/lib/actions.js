import { ID } from "appwrite";
import { client, databaseId, databases, tableId } from "./appwrite";

async function CreateTask(taskData) {
  try {
    const response = await databases.createDocument(
      databaseId,
      tableId,
      ID.unique(),
      taskData,
    );
    return {
      message: "Task created successfully",
      task: response,
      error: null,
    };
  } catch (error) {
    console.error("Error creating task:", error);
    return { message: "Error creating task", task: null, error };
    // throw error;
  }
}

async function UpdateTask(taskId, taskData) {
  try {
    const response = await databases.updateDocument(
      databaseId,
      tableId,
      taskId,
      taskData,
    );
    return {
      message: "Task updated successfully",
      task: response,
      error: null,
    };
  } catch (error) {
    console.error("Error updating task:", error);
    return { message: "Error updating task", task: null, error };
    // throw error;
  }
}

async function DeleteTask(taskId) {
  try {
    const response = await databases.deleteDocument(
      databaseId,
      tableId,
      taskId,
    );
    return {
      message: "Task deleted successfully",
      task: response,
      error: null,
    };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { message: "Error deleting task", task: null, error };
    // throw error;
  }
}

async function GetTasks() {
  try {
    const response = await databases.listDocuments(databaseId, tableId);
    return {
      message: "Tasks retrieved successfully",
      tasks: [...response.documents],
      error: null,
    };
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    return { message: "Error retrieving tasks", tasks: null, error };
    // throw error;
  }
}

async function GetTask(taskId) {
  try {
    const response = await databases.getDocument(databaseId, tableId, taskId);
    return {
      message: "Task retrieved successfully",
      task: response,
      error: null,
    };
  } catch (error) {
    console.error("Error retrieving task:", error);
    return { message: "Error retrieving task", task: null, error };
    // throw error;
  }
}

export { CreateTask, UpdateTask, DeleteTask, GetTasks, GetTask };
