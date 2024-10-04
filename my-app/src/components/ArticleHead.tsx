import { useEffect } from 'react';
import Document from '../functions/interfase';

// element properties
interface ArticleHeadProps {
    documents: Document[];
    selectedIndex: number | null; // Selected document index from parent
}

function ArticleHead ({documents, selectedIndex}: ArticleHeadProps) {
    const artTitle = selectedIndex !== null ? documents[selectedIndex]?.title : "Documents";
    return (
        <div className="headers"> 
                <h2>{artTitle}</h2>
        </div>
    );
}

export default ArticleHead;
