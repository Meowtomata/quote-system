import React, { useState } from 'react';

function FormSecretNote({secretNotes, setSecretNotes}) {
  // ===== NOTES STATE =====
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (newNote.trim() !== '') {
      setSecretNotes([...secretNotes, { text: newNote, editing: false }]);
      setNewNote('');
    }
  };

  const deleteNote = (id) => {
    setSecretNotes(secretNotes.filter(note => note.id !== id));
  };

  const toggleEditNote = (id) => {
    setSecretNotes(secretNotes.map(note =>
      note.id === id ? { ...note, editing: !note.editing } : note
    ));
  };

  const updateNote = (id, value) => {
    setSecretNotes(secretNotes.map(note =>
      note.id === id ? { ...note, text: value } : note
    ));
  };

  // ===== RETURN UI =====
  return (
    <>
    <div>
        <h3>NOTES</h3>
        <div className="add-note">
          <textarea
            rows="3"
            value={newNote}
            placeholder="ADD A NOTE..."
            onChange={(e) => setNewNote(e.target.value)}
          />
          <br />
          <button onClick={addNote}>ADD NOTE</button>
        </div>

        <div className="notes">
          {secretNotes.map((note) => (
            <div key={note.id} className="note">
              {note.editing ? (
                <textarea
                  rows="3"
                  value={note.text}
                  onChange={(e) => updateNote(note.id, e.target.value)}
                />
              ) : (
                <p>{note.text}</p>
              )}
              <button onClick={() => toggleEditNote(note.id)}>
                {note.editing ? 'SAVE' : 'EDIT'}
              </button>
              <button onClick={() => deleteNote(note.id)}>DELETE</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FormSecretNote;
