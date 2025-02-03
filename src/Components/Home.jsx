import React, { useState, useRef } from "react";
import "./Home.css";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { MdImage } from "react-icons/md";
import Display from "./Display";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [textList, setTextList] = useState([]);
  const [newText, setNewText] = useState("");
  const [newDescription, setNewDescription] = useState("");  // New state for description
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [image, setImage] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [editedDescription, setEditedDescription] = useState("");  // New state for editing description

  // Add Text
  const addText = () => {
    if (newText.trim() !== "" || audioURL || image) {
      const timestamp = new Date().toLocaleString(); // Get the current date and time
      const newEntry = { 
        text: newText, 
        description: newDescription,  // Include description
        audio: audioURL, 
        image, 
        timestamp
      };
      setTextList([...textList, newEntry]);
      setNewText("");
      setNewDescription("");  // Reset description
      setAudioURL(null);
      setImage(null);
    }
  };

  // Remove Text
  const removeText = (index) => {
    setTextList(textList.filter((_, i) => i !== index));
  };

  // Start Recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      setAudioURL(URL.createObjectURL(audioBlob));
      audioChunks.current = [];
      addText();
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  // Stop Recording
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Edit Functionality
  const handleEdit = (note) => {
    setCurrentNote(note);
    setEditedText(note.text);
    setEditedDescription(note.description);  // Set the description for editing
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (currentNote) {
      const updatedNotes = textList.map((n) =>
        n === currentNote ? { ...n, text: editedText, description: editedDescription } : n  // Save description
      );
      setTextList(updatedNotes);
      setIsEditing(false);
      setCurrentNote(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentNote(null);
  };

  const handleCopy = (note) => {
    navigator.clipboard.writeText(note.text);
    alert("Text copied to clipboard!");
  };

  return (
    <div className="container">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Display Component */}
      <Display
        textList={textList}
        searchTerm={searchTerm}
        handleEdit={handleEdit}
        handleSaveEdit={handleSaveEdit}
        handleCancelEdit={handleCancelEdit}
        handleCopy={handleCopy}
        removeText={removeText}
        currentNote={currentNote}
        isEditing={isEditing}
        editedText={editedText}
        setEditedText={setEditedText}
        editedDescription={editedDescription}  // Pass edited description
        setEditedDescription={setEditedDescription}  // Pass function to update edited description
      />

      {/* Add Text Section */}
      <div className="add-text-footer">
        <input
          type="text"
          placeholder="Enter text..."
          className="add-text-input"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />

        {/* Description Input */}
        <textarea
          placeholder="Enter description..."
          className="add-description-input"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}  // Handle new description
        />

        {/* Recording Button */}
        <button onClick={isRecording ? stopRecording : startRecording} className="record-btn">
          {isRecording ? <FaStop /> : <FaMicrophone />}
        </button>

        {/* Image Upload */}
        <label htmlFor="file-upload" className="image-upload-label">
          <MdImage />
        </label>
        <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} className="image-upload-input" />
        {image && <img src={image} alt="Preview" className="preview-image" />}
      </div>
    </div>
  );
};

export default Home;
