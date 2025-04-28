import React, { useState } from 'react';

function FormSecretNote({ secretNotes = [], setSecretNotes, disableEditingFields={notes:false}  }) {
  // ===== NOTES STATE =====
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (newNote.trim() !== '') {
      setSecretNotes([
        ...secretNotes,
        { id: Date.now(), text: newNote, editing: false } // ⬅️ assigning ID here
      ]);
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
            placeholder="ADD A NOTE"
            onChange={(e) => setNewNote(e.target.value)}
            disabled={disableEditingFields.notes}
          />
          <br />
          <div className="button-groupV3">
          <button className="NoteButton" onClick={addNote} disabled={disableEditingFields.notes}>ADD</button>
          </div>
        </div>

        <div className="notes">
        {secretNotes.map((note, index) => (
        <div key={note.id || note.text + index} className="note">
              {note.editing ? (
                <textarea
                  rows="3"
                  value={note.text}
                  onChange={(e) => updateNote(note.id, e.target.value)}
                  disabled={disableEditingFields.notes}
                />
              ) : (
                <p>{note.text}</p>
              )}
              <div className="button-groupV3"> 
              <button className="NoteSE" onClick={() => toggleEditNote(note.id)} disabled={disableEditingFields.notes}>
                {note.editing ? 'SAVE' : 'EDIT'}
              </button>
              <button className="NoteD" onClick={() => deleteNote(note.id)} disabled={disableEditingFields.notes}>DELETE</button>
            </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FormSecretNote;
