import { ID, Permission, Role, Functions, Query } from "appwrite";
import {
  account,
  client,
  databaseId,
  databases,
  tableId,
  usersTableId,
} from "./appwrite";

const functions = new Functions(client);

async function callRecovery(payload) {
  const execution = await functions.createExecution({
    functionId: import.meta.env.VITE_RECOVERY_FUNCTION_ID,
    body: JSON.stringify(payload),
    async: false,
  });
  try {
    return JSON.parse(execution.responseBody);
  } catch {
    return { ok: false, message: "Unexpected response from the server." };
  }
}

async function clearSession() {
  try {
    await account.deleteSession({ sessionId: "current" });
  } catch (error) {
    // no active session, nothing to clear
  }
}

async function CreateUser1(userData) {
  try {
    await clearSession();
    const { email, password, securityQuestion, securityAnswer, ...rest } =
      userData;
    const userId = ID.unique();

    const user = await account.create({
      userId,
      name: userData.username,
      email,
      password,
    });

    // log in briefly so this user can own the profile row
    await account.createEmailPasswordSession({ email, password });

    const profile = await databases.createDocument(
      databaseId,
      usersTableId,
      userId,
      { username: userData.username, email, securityQuestion, securityAnswer }, // no security answer saved here
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ],
    );

    // the function hashes the answer and saves it
    const saved = await callRecovery({
      action: "setSecurity",
      question: securityQuestion,
      answer: securityAnswer,
    });
    if (!saved.ok) {
      throw new Error(saved.message || "Could not save the security question.");
    }

    await clearSession(); // so they still go to /login after signup

    return {
      message: "Account created successfully! Redirecting to login...",
      user: { ...user, ...profile },
      error: null,
    };
  } catch (error) {
    console.error("Error creating account: FROM CU FUCT", error);
    return {
      message: "Error creating account: " + error.message,
      user: null,
      error,
    };
  }
}

async function CreateUser(userData) {
  try {
    await clearSession();
    const { email, password, ...rest } = userData;
    const userId = ID.unique();

    const user = await account.create({
      userId,
      name: userData.username,
      email,
      password,
    });

    const profile = await databases.createDocument(
      databaseId,
      usersTableId,
      userId,
      { username: userData.username, email }, // no security answer saved here
    );

    return {
      message: "Account created successfully! Redirecting to login...",
      user: { ...user, ...profile },
      error: null,
    };
  } catch (error) {
    console.error("Error creating account: FROM CU FUCT", error);
    return {
      message: "Error creating account: " + error.message,
      user: null,
      error,
    };
  }
}

async function LogUserIn(email, password) {
  try {
    await clearSession();
    await account.createEmailPasswordSession({ email, password });
    const user = await GetProfile();
    return {
      message: "Login successful! Redirecting to Task...",
      user,
      error: null,
    };
  } catch (error) {
    console.error("Error logging in:", error);
    return {
      message:
        error.code === 401
          ? "Invalid email or password."
          : "Something went wrong. Please try again.",
      user: null,
      error,
    };
  }
}

async function GetProfile() {
  try {
    const user = await account.get();
    try {
      const profile = await databases.getDocument(
        databaseId,
        usersTableId,
        user.$id,
      );
      return { ...user, ...profile };
    } catch (error) {
      return user;
    }
  } catch (error) {
    return null;
  }
}

async function GetUserByEmail(email) {
  try {
    const res = (
      await databases.listDocuments(databaseId, usersTableId, [
        Query.equal("email", email),
      ])
    ).documents;
    if (!res?.length) {
      throw new Error("This email is  not found");
    }
    return { user: res?.[0], error: null };
  } catch (error) {
    console.log(error);
    return { user: null, error };
  }
}

async function ResetPasswordWithAnswer(email, answer, newPassword) {
  try {
    const res = account.createRecovery();
    // return await callRecovery({ action: "reset", email, answer, newPassword });
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Could not reach the server. Try again." };
  }
}

async function CreateTask(taskData, userId) {
  try {
    const response = await databases.createDocument(
      databaseId,
      tableId,
      ID.unique(),
      { ...taskData, userId },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ],
    );
    return {
      message: "Task created successfully",
      task: response,
      error: null,
    };
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      message: "Error creating task: " + error.message,
      task: null,
      error,
    };
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
  }
}

export {
  CreateUser,
  GetProfile,
  LogUserIn,
  ResetPasswordWithAnswer,
  CreateTask,
  UpdateTask,
  DeleteTask,
  GetTasks,
  GetTask,
  GetUserByEmail,
};
