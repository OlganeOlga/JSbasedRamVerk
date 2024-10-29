// Import necessary React hooks
import React, { useState } from 'react';

// Define the props interface for the CommentModal component
interface CommentModalProps {
  isOpen: boolean; // Flag to control the modal visibility
  onClose: () => void; // Function to call when the modal is closed
  onSubmit: (comment: string) => void; // Function to call when a comment is submitted
}

// Create a functional component named CommentModal
const CommentModal: React.FC<CommentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [comment, setComment] = useState<string>(""); // State to hold the comment text

  // If the modal is not open, return null to avoid rendering
  if (!isOpen) return null;

  // Handle comment submission
  const handleSubmit = () => {
    onSubmit(comment); // Call the onSubmit function passed from parent
    setComment(""); // Clear the comment state after submission
  };

  // Handle closing the modal
  const handleClose = () => {
    onClose(); // Call the onClose function passed from parent
    setComment(""); // Clear the comment state on modal close
  };

  return (
    <div className="modal-overlay"> {/* Modal overlay for backdrop effect */}
      <div className="modal-content"> {/* Main content area of the modal */}
        <h2 className="modal-title">Write a Comment</h2> {/* Modal title */}
        <textarea
          value={comment} // Controlled input for the comment
          className="modal-comment-area"
          onChange={(e) => setComment(e.target.value)} // Update comment state on change
          rows={5} // Number of rows for the textarea
          placeholder="Type your comment here..." // Placeholder text
        />
        <div className="modal-buttons"> {/* Container for buttons */}
          <button onClick={handleClose} className="modal-button modal-button-cancel"> {/* Cancel button */}
            Cancel
          </button>
          <button onClick={handleSubmit} className="modal-button modal-button-submit"> {/* Submit button */}
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

// Define the props interface for the AddComment component
interface AddCommentProps {
  caretPosition: { x: number; y: number }; // Position of the caret (cursor) when adding a comment
  socketRef: React.RefObject<any>; // Reference to the socket object (should replace `any` with the specific socket type if known)
  newComment: (commentData: { comment: string; caretPosition: { x: number; y: number } }) => void; // Function to handle new comments
}

// Create a functional component named AddComment
const AddComment: React.FC<AddCommentProps> = ({ caretPosition, socketRef, newComment }) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false); // State to control modal visibility

  // Handle opening the modal
  const handleModalOpen = () => {
    setModalOpen(true); // Set modal open state to true
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setModalOpen(false); // Set modal open state to false
  };

  // Handle submission of the comment from the modal
  const handleModalSubmit = (comment: string) => {
    console.log("Submitted comment:", comment); // Log the submitted comment
    console.log("Cursor's position was:", caretPosition); // Log the cursor position
    setModalOpen(false); // Close the modal

    // Check if socketRef.current is defined before attempting to emit a socket event
    if (socketRef.current) {
      socketRef.current.emit("comment", { comment, caretPosition }); // Emit the comment via socket
      newComment({ comment, caretPosition }); // Call the newComment function passed from parent
    } else {
      console.error("socketRef.current is undefined - socket connection may not be initialized."); // Log error if socket is not connected
    }
  };

  return (
    <div className="modal-container"> {/* Container for the comment button and modal */}
      <button className="modal-comment-button" onClick={handleModalOpen}> {/* Button to open the modal */}
        Lägg till kommentar {/* Button text to add a comment */}
      </button>
      <CommentModal
        isOpen={isModalOpen} // Pass the open state to the CommentModal
        onClose={handleCloseModal} // Pass the close handler to the CommentModal
        onSubmit={handleModalSubmit} // Pass the submit handler to the CommentModal
      />
    </div>
  );
};

// Export the AddComment component as the default export of this module
export default AddComment;
