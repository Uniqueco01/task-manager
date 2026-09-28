import { Client, Account, Databases } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const databaseId = import.meta.env.VITE_APPWRITE_DB_ID;
const tableId = import.meta.env.VITE_APPWRITE_TABLE_ID;

export { client, account, databases, databaseId, tableId };
