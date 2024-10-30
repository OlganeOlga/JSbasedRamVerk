import React, { useState } from 'react';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [comment, setComment] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(comment);
    setComment("");
  };

  const handleClose = () => {
    onClose();
    setComment("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Comment</h2>
        <textarea
          value={comment}
          className="modal-comment-area"
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          placeholder="Type your comment here..."
        />
        <div className="modal-buttons">
          <button onClick={handleClose} className="modal-button modal-button-cancel">
            Cancel
          </button>
          <button onClick={handleSubmit} className="modal-button modal-button-submit">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

interface AddCommentProps {
  caretPosition: { x: number; y: number };
  socket: any; // Change from `socketRef` to `socket` directly
  newComment: (commentData: { comment: string; caretPosition: { x: number; y: number } }) => void;
}

const AddComment: React.FC<AddCommentProps> = ({ caretPosition, socket, newComment }) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleModalSubmit = (comment: string) => {
    console.log("Submitted comment:", comment);
    console.log("Cursor's position was:", caretPosition);
    setModalOpen(false);

    // Emit comment and caret position
    if (socket) {
      socket.emit("comment", { comment, caretPosition });
      newComment({ comment, caretPosition });
    } else {
      console.error("Socket connection may not be initialized.");
    }
  };

  return (
    <div className="modal-container">
      <button className="modal-comment-button" onClick={handleModalOpen}>
        Comments
      </button>
      <CommentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default AddComment;
