import React, { useState, useEffect } from "react";
import "./App.css";
import "./components/Sidebar.css";
import "./components/NoteMain.css";
import Sidebar from "./components/Sidebar";
import NoteMain from "./components/NoteMain";
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} from "./api/notesApi";

/**
 * Root App: Handles layout and top-level logic for sidebar + main area, CRUD operations, and theme.
 */
// PUBLIC_INTERFACE
function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [theme, setTheme] = useState("light");
  const [working, setWorking] = useState(false);

  // Apply light theme (project requires light, but allow toggle for demo)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Initial load of all notes
  useEffect(() => {
    async function loadList() {
      setLoading(true);
      try {
        const _notes = await getNotes();
        setNotes(_notes);
        // If no note selected or deleted, pick first
        if (_notes.length && (!_notes.find(n => n.id === selectedNoteId) || selectedNoteId === null)) {
          setSelectedNoteId(_notes[0].id);
        } else if (_notes.length === 0) {
          setSelectedNoteId(null);
        }
      } catch (err) {
        setApiError(err.message || "Unable to load notes");
      }
      setLoading(false);
    }
    loadList();
    // reload on selectedNoteId? no - handled separately
    // eslint-disable-next-line
  }, []);

  // Load selected note details whenever selectedNoteId changes
  useEffect(() => {
    async function loadNote() {
      if (!selectedNoteId) {
        setSelectedNote(null);
        return;
      }
      try {
        setWorking(true);
        const note = await getNote(selectedNoteId);
        setSelectedNote(note);
      } catch (err) {
        setApiError(err.message || "Unable to load note");
        setSelectedNote(null);
      }
      setWorking(false);
    }
    loadNote();
  }, [selectedNoteId]);

  // PUBLIC_INTERFACE
  async function handleCreateNote() {
    try {
      setWorking(true);
      const newNote = await createNote({ title: "Untitled", body: "" });
      // Refresh notes list and select newest note
      const _notes = await getNotes();
      setNotes(_notes);
      setSelectedNoteId(newNote.id);
      setApiError("");
    } catch (err) {
      setApiError("Failed to create note: " + (err.message || ""));
    }
    setWorking(false);
  }

  // PUBLIC_INTERFACE
  function handleSelectNote(noteId) {
    setSelectedNoteId(noteId);
    setApiError("");
  }

  // PUBLIC_INTERFACE
  async function handleUpdateNote(note) {
    try {
      setWorking(true);
      await updateNote(note.id, { title: note.title, body: note.body });
      // Reload note and list
      const [updatedNote, updatedNotes] = await Promise.all([
        getNote(note.id),
        getNotes()
      ]);
      setNotes(updatedNotes);
      setSelectedNote(updatedNote);
      setApiError("");
    } catch (err) {
      setApiError("Failed to update note: " + (err.message || ""));
    }
    setWorking(false);
  }

  // PUBLIC_INTERFACE
  async function handleDeleteNote(noteId) {
    try {
      setWorking(true);
      await deleteNote(noteId);
      const _notes = await getNotes();
      setNotes(_notes);
      // Select next (or first) note after delete, or null if none left
      if (_notes.length > 0) {
        setSelectedNoteId(_notes[0].id);
      } else {
        setSelectedNoteId(null);
      }
      setApiError("");
    } catch (err) {
      setApiError("Failed to delete note: " + (err.message || ""));
    }
    setWorking(false);
  }

  // PUBLIC_INTERFACE
  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <div className="App" style={{ display: "flex", height: "100vh", background: "var(--bg-primary)" }}>
      {/* Sidebar */}
      <Sidebar
        notes={notes}
        selectedNoteId={selectedNoteId}
        onSelect={handleSelectNote}
        onCreate={handleCreateNote}
      />
      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header className="App-header" style={{ background: "var(--bg-secondary)", minHeight: 0, padding: "1.6rem 2.3rem 0 2.5rem", borderBottom: "1px solid var(--border-color)", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "1.4rem", fontWeight: "bold", color: "var(--primary, #1976d2)" }}>
            Minimal Notes
          </span>
          <button
            className="theme-toggle"
            style={{ marginRight: 0, marginLeft: "auto" }}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </header>
        {loading ? (
          <div className="main-empty" style={{ fontSize: "1.09rem", color: "#8f8f94" }}>
            Loading notes...
          </div>
        ) : (
          <>
            {apiError && (
              <div className="main-empty" style={{ color: "#e53935", fontWeight: 500, fontSize: "1.1rem" }}>
                {apiError}
              </div>
            )}
            <NoteMain
              note={selectedNote}
              onSave={handleUpdateNote}
              onDelete={handleDeleteNote}
              working={working}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
