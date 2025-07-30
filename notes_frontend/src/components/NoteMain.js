import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./NoteMain.css";

// PUBLIC_INTERFACE
function NoteMain({ note, onSave, onDelete }) {
  /**
   * Main area to display and edit a note.
   * @param {object|null} note The note object.
   * @param {function} onSave Function called with updated note ({id, title, body}) on save.
   * @param {function} onDelete Function called with note id on delete.
   */
  const [editTitle, setEditTitle] = useState(note ? note.title : "");
  const [editBody, setEditBody] = useState(note ? note.body : "");
  const [editing, setEditing] = useState(false);

  const bodyRef = useRef(null);

  useEffect(() => {
    setEditTitle(note ? note.title : "");
    setEditBody(note ? note.body : "");
    setEditing(false);
  }, [note]);

  if (!note) {
    return (
      <main className="main-empty">
        <div className="empty-hint">No note selected.<br />Choose or create a note.</div>
      </main>
    );
  }

  const handleSave = () => {
    if (!editTitle.trim() && !editBody.trim()) return;
    onSave({
      ...note,
      title: editTitle,
      body: editBody,
    });
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <main className="note-main" aria-label="Note editor and details">
      <div className="note-header">
        {editing ? (
          <input
            className="note-title-input"
            value={editTitle}
            placeholder="Title"
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
          />
        ) : (
          <h2 className="note-title" onClick={() => setEditing(true)} tabIndex={0} aria-label="Edit note title">
            {note.title || <em>Untitled</em>}
          </h2>
        )}
        <div className="note-toolbar">
          {!editing && (
            <button className="btn-edit" onClick={() => setEditing(true)} aria-label="Edit note">Edit</button>
          )}
          <button className="btn-delete" onClick={() => { if (window.confirm("Delete this note?")) onDelete(note.id); }} aria-label="Delete note">Delete</button>
        </div>
      </div>
      <div>
        {editing ? (
          <textarea
            ref={bodyRef}
            className="note-body-input"
            value={editBody}
            placeholder="Write your note..."
            rows={10}
            onChange={(e) => setEditBody(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <pre className="note-body" onClick={() => setEditing(true)} tabIndex={0} aria-label="Edit note body">{note.body || <em>No content</em>}</pre>
        )}
      </div>
      {editing && (
        <div className="note-footer">
          <button className="btn-primary" onClick={handleSave} aria-label="Save note">Save</button>
          <button className="btn-secondary" onClick={() => { setEditTitle(note.title); setEditBody(note.body); setEditing(false); }} aria-label="Cancel editing">Cancel</button>
        </div>
      )}
      <div className="note-updated">
        {note.updatedAt ? `Last updated: ${new Date(note.updatedAt).toLocaleString()}` : ""}
      </div>
    </main>
  );
}

NoteMain.propTypes = {
  note: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default NoteMain;
