// src/services/appwrite.js
// Centralized Appwrite client setup and helpers for auth, database, and storage.
// Uses environment variables so secrets are not hardcoded in the repo.

import { Client, Account, Databases, ID, Storage } from "appwrite";

// Env variables, using the existing REACT_APP_* names from the user's .env.
// Vite is configured with envPrefix to expose both VITE_ and REACT_APP_.
const endpoint = import.meta.env.REACT_APP_APPWRITE_ENDPOINT;
const projectId = import.meta.env.REACT_APP_APPWRITE_PROJECT;
const databaseId = import.meta.env.REACT_APP_DATABASE_ID;
const productsCollectionId = import.meta.env.REACT_APP_PRODUCTS_COLLECTION_ID;
const categoriesCollectionId = import.meta.env.REACT_APP_CATEGORIES_COLLECTION_ID;
const imagesBucketId = import.meta.env.REACT_APP_IMAGES_BUCKET_ID;

// Initialize a single Appwrite client instance.
// Be defensive in case environment variables are missing so we don't
// throw at import time; instead, log a clear warning.
const client = new Client();

if (!endpoint || !projectId) {
  // eslint-disable-next-line no-console
  console.warn(
    "Appwrite endpoint or project ID is not configured. Check your .env file."
  );
} else {
  client.setEndpoint(endpoint).setProject(projectId);
}

// Export Appwrite SDK clients to reuse across the app.
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Helper IDs/config to avoid repeating env lookups.
export const DB_ID = databaseId;
export const PRODUCTS_COLLECTION_ID = productsCollectionId;
export const CATEGORIES_COLLECTION_ID = categoriesCollectionId;
export const IMAGES_BUCKET_ID = imagesBucketId;

// Generate unique IDs for documents/files.
export const generateId = () => ID.unique();

// Build a public file view URL for an image stored in Appwrite Storage.
// Assumes the bucket has public read permissions (read: role:all).
export const buildPublicFileUrl = (fileId) => {
  if (!endpoint || !imagesBucketId || !projectId) return "";
  const baseUrl = String(endpoint).replace("/v1", "");
  return `${baseUrl}/storage/buckets/${imagesBucketId}/files/${fileId}/view?project=${projectId}`;
};
