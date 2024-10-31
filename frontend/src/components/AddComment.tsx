import React, { useState } from 'react';
import {Comment} from './../functions/interface'

interface CommentModalProps {
	user: string | null;
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (comment: Comment) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ isOpen, user, onClose, onSubmit }) => {
	const [comment, setComment] = useState<Comment | null>(null);

	if (!isOpen) return null;

	const handleSubmit = () => {
		if (comment) {
			onSubmit(comment);
			setComment(null); // Reset state to null after submission
		}
	};

	const handleClose = () => {
		onClose();
		setComment(null);
	};

	return (
		<>
		<div className="modal-overlay">
		<div className="modal-content">
			<h2 className="modal-title">Comment</h2>
			<textarea
			value={comment?.content}
			className="modal-comment-area"
			onChange={(e) => setComment({author: user, content:e.target.value})}
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
		</>
	);
	};

	interface AddCommentProps {
	caretPosition: { x: number; y: number };
	socket: any; // Change from `socketRef` to `socket` directly
	user: string | null;
	newComment: (commentData: { comment: Comment; caretPosition: { x: number; y: number } }) => void;
	}

	const AddComment: React.FC<AddCommentProps> = ({ caretPosition, socket, user, newComment }) => {
	const [isModalOpen, setModalOpen] = useState<boolean>(false);

	const handleModalOpen = () => {
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
	};

	const handleModalSubmit = (comment: Comment) => {

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
			user={user}
			isOpen={isModalOpen}
			onClose={handleCloseModal}
			onSubmit={handleModalSubmit}
		/>
		</div>
	);
};

export default AddComment;
