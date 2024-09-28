import React, { useState } from 'react';
import utils from '../utils.mjs';
import DeleteDocument from './DeleteDocument';

// interfase for element
interface OneDocumentProps {
    id: string;
    title: string;
    content: string;
    handleClose: () => void;
}

function OneDocument({ id:id, title: intialTitle, content: initialContent, handleClose }: OneDocumentProps) {
    // declare variabels and function to change them
    const [title, setTitle] = useState(intialTitle);
    const [content, setContent] = useState(initialContent);
    const [isSubmitting, setIsSubmitting] = useState(false); // For submit state (optional)

    // // Handle form submit
    // const handleSubmit = async (event: React.FormEvent) => {
    //     event.preventDefault(); // Prevent page refresh

    //     // Update the document by calling the backend API
    //     const updatedDoc = {id: id, title: title, content: content };
        
    //     try {
    //         await utils.processRoute('PUT', `/update`, updatedDoc);
    //     } catch (error) {
    //         console.error('Failed to update document:', error);
    //     }
    // };

    const handleSubmitAndClose = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent page refresh
        setIsSubmitting(true);  // Set the submitting state to true (optional)

        // Updated document object
        const updatedDoc = { id, title, content };

        try {
            // Submit the document update to the backend
            await utils.processRoute('PUT', `/update`, updatedDoc);
            console.log('Document updated successfully');

            // After the submission, go back to the list
            handleClose();
        } catch (error) {
            console.error('Failed to update document:', error);
        } finally {
            setIsSubmitting(false);  // Reset submitting state (optional)
        }
    };
    // element
    return (
        <> {/* wrap all in the one eleemnt */}
            <form className='doc' onSubmit={handleSubmitAndClose}> {/* change when the form submitted */}
                <input type='hidden'name="id" value={id} />
                <input className='title'
                    type="text"
                    name="newTitle"
                    value={title}
                    onChange={(e) => {
                    setTitle(e.target.value)}}>
                </input>
                
                <input className='content'
                    type="text"
                    name="newContent"
                    value={content}
                    onChange={(e) => {setContent(e.target.value)}
                    }>
                </input>

                {/* Combined Submit and Back to List button */}
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Save and close'}
                </button>
            </form>
            
        </>
    );
}

// {/* Submit button for Enter key */}
// <button type="submit">Submit</button>
// <button onClick={handleClose}>Back to List</button> {/* Button that return to the list documents*/}

export default OneDocument;