const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchUser = require("../middlewere/fetchUser");
const { body, validationResult } = require("express-validator");

//Route:1 get all notes of a specific user login required
router.get("/fetchnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

//Route:2 add the note of a specific user in db, login required
router.post(
  "/addnotes",
  fetchUser,
  [
    body("title", "Enter a title with atleast length 2").isLength({ min: 2 }),
    body("description", "Enter a description with atleast length 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, tag } = req.body;
      const note = new Notes({
        user: req.user.id,
        title,
        description,
        tag,
      });

      const savedNote = await note.save();
      res.send(savedNote);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

//Route:3 update a prexisting note of a user
router.put("/updatenotes/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;
  //create a newNode
  const newNode = {};
  if (title) { newNode.title = title; }
  if (description) { newNode.description = description; }
  if (tag) { newNode.tag = tag; }

  try {
    // find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    //Check if prescent and authorized
    if (!note) { return res.status(404).send("Not Found"); }
    if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Allowed"); }

    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNode }, { new: true });
    res.json({ note });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

//Route:4 delete a prexisting note of a user
router.delete("/deletenotes/:id", fetchUser, async (req, res) => {
  try {
    //find the note to be deleted and delete it
    let note = await Notes.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found"); }
    //Check if prescent and authorize
    if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Allowed"); }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
