import React, { useState } from "react";
import documents from "../remoteDocs.mjs";

    
export default function AppMain(){
    const items = [
        {
            id: 1,
            title: "title1"
        },
        {
            id: 2,
            title: "title2"
        }
    ]
    
    //Hook (StateHook)
    const [selectedIndex, setSelectedIndex] = useState(-1);
    
    const getMessage = () => {
        return items.map.length === 0 && <p>No items found</p>;
    }
    return <main>
                <div className="headers">
                    <h2>Documents</h2>
                    <h3 className="create-new-doc">
                        <a href="/sql/doc" className="button">Create a new document</a>
                    </h3>
                </div> 
                <article className="article">
                    
                </article>   
            </main>

}