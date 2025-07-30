const API_BASE = process.env.REACT_APP_NOTES_API_URL || "/api";

/**
 * Helper for HTTP requests to the backend notes API.
 * 
 * All functions return a Promise and throw errors on HTTP failures.
 */

// PUBLIC_INTERFACE
export async function getNotes() {
  /** Fetch all notes. Returns array of notes. */
  const response = await fetch(`${API_BASE}/notes`);
  if (!response.ok) throw new Error("Failed to load notes");
  return await response.json();
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Fetch a single note by id. Returns note object. */
  const response = await fetch(`${API_BASE}/notes/${id}`);
  if (!response.ok) throw new Error("Note not found");
  return await response.json();
}

// PUBLIC_INTERFACE
export async function createNote(note) {
  /** Create a new note. Returns created note object. */
  const response = await fetch(`${API_BASE}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note)
  });
  if (!response.ok) throw new Error("Failed to create note");
  return await response.json();
}

// PUBLIC_INTERFACE
export async function updateNote(id, updates) {
  /** Update a note by id. Returns updated note object. */
  const response = await fetch(`${API_BASE}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  });
  if (!response.ok) throw new Error("Failed to update note");
  return await response.json();
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id. Returns deleted note id or confirmation. */
  const response = await fetch(`${API_BASE}/notes/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete note");
  return true;
}
