import React, { useRef, useEffect, useState } from "react";
import { FaEdit, FaRegCopy, FaTrash, FaPlay, FaStop, FaDownload, FaExpandAlt } from "react-icons/fa";
import './display.css';

const Display = ({
  textList,
  searchTerm,
  handleEdit,
  handleSaveEdit,
  handleCancelEdit,
  handleCopy,
  removeText,
  currentNote,
  isEditing,
  editedText,
  setEditedText,
  editedDescription,   // Add this prop to handle the edited description
  setEditedDescription // Add this prop to set the edited description
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedText, setExpandedText] = useState(null);
  const [headerText, setHeaderText] = useState("Your Notes");
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentNote && currentNote.audio && audioRef.current) {
      audioRef.current.src = currentNote.audio;
    }
  }, [currentNote]);

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div className="text-box">
      <h2 className="main-header">
        {isEditingHeader ? (
          <input
            type="text"
            value={headerText}
            onChange={(e) => setHeaderText(e.target.value)}
            onBlur={() => setIsEditingHeader(false)}
            autoFocus
            className="header-input"
          />
        ) : (
          <span onClick={() => setIsEditingHeader(true)}>{headerText}</span>
        )}
      </h2>

      {textList && textList.length === 0 ? (
        <p className="placeholder-text">No notes added yet...</p>
      ) : (
        <div className="text-grid">
          {textList &&
            textList
              .filter((entry) =>
                entry.text.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((entry, index) => (
                <div key={index} className="text-item">
                  <div className="text-content">
                    {/* Display Date & Time */}
                    <p className="note-date">
                      Created on: {entry.timestamp ? entry.timestamp : "Unknown Date"}
                    </p>

                    {/* Title */}
                    {isEditing && entry === currentNote ? (
                      <input
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="edit-textarea"
                      />
                    ) : (
                      <h3 className="added-text">{entry.text || "No Title"}</h3>
                    )}

                    {/* Description */}
                    {isEditing && entry === currentNote ? (
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}  // Handle edited description
                        className="edit-description-textarea"
                      />
                    ) : (
                      <p className="note-content">
                        {entry.description && entry.description.length > 100
                          ? `${entry.description.substring(0, 100)}...`
                          : entry.description || "No description"}
                      </p>
                    )}

                    {entry.description && entry.description.length > 100 && (
                      <button
                        className="expand-btn"
                        onClick={() => setExpandedText(entry.description)}
                      >
                        <FaExpandAlt /> Read More
                      </button>
                    )}

                    {/* Audio Player */}
                    {entry.audio && (
                      <div className="recording-container">
                        <audio controls>
                          <source src={entry.audio} type="audio/wav" />
                          Your browser does not support the audio element.
                        </audio>
                        <div className="recording-controls">
                          <audio ref={audioRef} controls style={{ display: "none" }} />
                          <button className="play-btn" onClick={handlePlay} disabled={!entry.audio}>
                            <FaPlay />
                          </button>
                          <button className="stop-btn" onClick={handleStop} disabled={!entry.audio}>
                            <FaStop />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Image Display */}
                    {entry.image && (
                      <div className="image-container">
                        <img src={entry.image} alt="Uploaded" className="uploaded-image" />
                        <a href={entry.image} download="image.jpg" className="download-icon">
                          <FaDownload />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="note-buttons">
                    {/* Edit Button */}
                    {!isEditing || entry !== currentNote ? (
                      <button onClick={() => handleEdit(entry)} className="edit-btn">
                        <FaEdit />
                      </button>
                    ) : (
                      <>
                        <button onClick={handleSaveEdit} className="save-btn">Save</button>
                        <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
                      </>
                    )}
                    <button onClick={() => handleCopy(entry)} className="copy-btn">
                      <FaRegCopy />
                    </button>
                    <button onClick={() => removeText(index)} className="delete-btn">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
        </div>
      )}

      {expandedText && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setExpandedText(null)}>&times;</span>
            <p>{expandedText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Display;
