import React, { useState, useEffect } from 'react';
import { socket } from "../socket.mjs"; // Socket instance for real-time communication
import utils from '../utils.mjs'; // Utility functions for API calls

interface ContentEvent {
    title: string;
    content: string;
}

interface OneDocumentProps {
    username: string | null;
    docOwner: string | null;
    id: string;
    title: string;
    content: string;
    handleClose: () => void;
}

const OneDocument: React.FC<OneDocumentProps> = ({ 
    username, 
    docOwner, 
    id, 
    title: initialTitle, 
    content: initialContent, 
    handleClose 
}) => {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        socket.connect();
        console.log('Socket connected:', socket.id);

        const handleContentUpdate = (data: ContentEvent) => {
            console.log("Received content update:", data);
            setTitle(data.title);
            setContent(data.content);
        };
        
        socket.on("content", handleContentUpdate);

        return () => {
            socket.off('content', handleContentUpdate);
            socket.disconnect();
        };
    }, []);

    const handleSubmitAndClose = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        const body = {
            username: docOwner,
            id,
            title,
            content
        };

        try {
            // Emit the update event to the server via Socket.io
            socket.emit('update', body);
            
            // Make the API call to update the document
            const result = await utils.processRoute('PUT', `/data/update`, body);

            // Check the result for success and handle accordingly
            if (result.ok) {
                console.log("Document updated successfully");
                handleClose(); // Close the document after successful submission
            } else {
                console.error('Update failed:', result.message); // Log any error messages
            }
        } catch (error) {
            console.error('Failed to update document:', error); // Log any errors
        } finally {
            setIsSubmitting(false); // Reset submitting state
        }
    };

    return (
        <>
            <form className='doc' onSubmit={handleSubmitAndClose}>
                <input type='hidden' name="id" value={id} />
                <input
                    className='title'
                    type="text"
                    name="newTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    className='content'
                    type="text"
                    name="newContent"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button type="submit" className='btn btn-primary change-collection' disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Save and close'}
                </button>
            </form>
            <h1>{title}</h1>
            <p>{content}</p>
        </>
    );
};

export default OneDocument;
