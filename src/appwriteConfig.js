import { Client, TablesDB } from "appwrite";

const client = new Client();

client.setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT);
client.setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const db = new TablesDB(client);
const databaseId = import.meta.env.VITE_APPWRITE_DB_ID;
const tableId = import.meta.env.VITE_APPWRITE_TABLE_ID;

export { client, db, databaseId, tableId };
