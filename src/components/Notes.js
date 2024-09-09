import React, { useContext, useEffect, useRef, useState } from "react";
import NoteContext from "../context/notes/NoteContext";
import NoteItem from "./NoteItem";
import { useNavigate } from "react-router-dom";

const Notes = (props) => {
  const context = useContext(NoteContext);
  const { notes, fetchNote, updateNote } = context;
  const ref = useRef(null);
  const refClose = useRef(null);
  const navigate = useNavigate();
  const [note, setNote] = useState({
    _id: "",
    title: "",
    description: "",
    tag: "default",
  });

  useEffect(() => {
    if(localStorage.getItem("token")){
      fetchNote();
    }else{
      navigate("/login");
      props.showAlert("Please Login to use iNotebook", "warning")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatenote = (currentNote) => {
    ref.current.click();
    setNote(currentNote);
  };

  const onchange = (event) => {
    setNote({ ...note, [event.target.name]: event.target.value });
  };

  const handleClick = () => {
    updateNote(note._id, note.title, note.description, note.tag);
    refClose.current.click();
    props.showAlert("Updated Note Successfully", "success");
  };

  return (
    <>
      <p
        className="d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        ref={ref}
      ></p>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Note
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
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
                    value={note.title}
                    onChange={onchange}
                    minLength={2}
                    required
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
                    value={note.description}
                    onChange={onchange}
                    minLength={5}
                    required
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
                    value={note.tag}
                    onChange={onchange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={refClose}
              >
                Close
              </button>
              <button
                onClick={handleClick}
                type="button"
                className="btn btn-primary"
                disabled={note.title.length < 2 || note.description.length < 5}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row my-4 container">
        <h3>Your Notes</h3>
        {notes.length === 0 && (
          <p className="container mx-1">No Notes to Display !!</p>
        )}
        {notes.map((note) => {
          return (
            <NoteItem key={note._id} updatenote={updatenote} note={note} showAlert={props.showAlert} />
          );
        })}
      </div>
    </>
  );
};

export default Notes;
