import React from "react";
import PropTypes from "prop-types";
import "./Sidebar.css";

// PUBLIC_INTERFACE
function Sidebar({ notes, selectedNoteId, onSelect, onCreate }) {
  /**
   * Sidebar for listing all notes and providing an option to create a new note.
   *
   * @param {Object[]} notes Array of note objects.
   * @param {string} selectedNoteId Currently-selected note's id.
   * @param {function} onSelect Callback when a note is selected.
   * @param {function} onCreate Callback to create a new note.
   */

  return (
    <nav className="sidebar" aria-label="Notes List">
      <div className="sidebar-header">
        <span className="sidebar-title">Notes</span>
        <button className="sidebar-create" aria-label="Add New Note" onClick={onCreate}>＋</button>
      </div>
      <ul className="sidebar-list">
        {notes.length === 0 ? (
          <li className="sidebar-empty">No notes</li>
        ) : (
          notes.map((note) => (
            <li
              key={note.id}
              className={
                note.id === selectedNoteId
                  ? "sidebar-item selected"
                  : "sidebar-item"
              }
            >
              <button
                onClick={() => onSelect(note.id)}
                className="sidebar-link"
                aria-current={note.id === selectedNoteId ? "page" : undefined}
              >
                <span className="sidebar-note-title">{note.title || <em>Untitled</em>}</span>
                <span className="sidebar-timestamp">
                  {note.updatedAt
                    ? new Date(note.updatedAt).toLocaleDateString()
                    : ""}
                </span>
              </button>
            </li>
          ))
        )}
      </ul>
    </nav>
  );
}

Sidebar.propTypes = {
  notes: PropTypes.array.isRequired,
  selectedNoteId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default Sidebar;
