import React, { useContext, useState } from "react";
import NoteContext from "../context/notes/NoteContext";

const AddNote = (props) => {
  const context = useContext(NoteContext);
  const { addNote } = context;
  const [note, setNote] = useState({ title: "", description: "", tag: "" });

  const handleClick = (event) => {
    event.preventDefault();
    addNote(note.title, note.description, note.tag);
    props.showAlert("Note Added successfully", "success");
    setNote({
      _id: "",
      title: "",
      description: "",
      tag: "",
    });
  };
  const onchange = (event) => {
    setNote({ ...note, [event.target.name]: event.target.value });
  };

  return (
    <div className="my-2 container mt-4">
      <h3>Add Notes</h3>
      <form className="my-1">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            onChange={onchange}
            minLength={2} required
            value={note.title}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            onChange={onchange}
            minLength={5} required
            value={note.description}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">
            Tag
          </label>
          <input
            type="text"
            className="form-control"
            id="tag"
            name="tag"
            onChange={onchange}
            value={note.tag}
          />
        </div>
        <button type="submit" className="btn btn-primary" onClick={handleClick} disabled={note.title.length < 2 || note.description.length < 5}>
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddNote;
