import React, { useState, useRef } from 'react';
import { useAppSelector } from '../../app/hooks';
import './AddPost.module.css'; // Assuming you have this CSS file.



const sendData = async (postData : any, token : any) => {
    console.log(token)
    try {
        const response = await fetch('http://localhost:3000/threats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Add this line for the Authorization header
            },
            body: JSON.stringify(postData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to post threat');
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log("here")
        console.error('Error:', error);
    }
}

const AddPost: React.FC = () => {
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const token = useAppSelector((state) => state.user);

    const handlePaste = (e: React.ClipboardEvent) => {
        if (textareaRef.current) {
            setTimeout(() => {
                if (textareaRef.current) {
                    const pastedText = textareaRef.current.value;
                    const lines = pastedText.split('\n');
                    setText(lines.join('\n'));
                    textareaRef.current.style.height = 'inherit';
                    const scrollHeight = textareaRef.current.scrollHeight;
                    textareaRef.current.style.height = scrollHeight + 'px';
                }
            }, 0);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {

        e.preventDefault(); // Prevent the page from reloading
        if (!text.trim()) {
            alert("Please fill out all fields properly!"); // Alert the user
            return; // Exit the function early
        }
        if (text) {
            const now = new Date()
            const n = now.toLocaleDateString()
            if (!name.trim())
                setName(n)
            const entries = text.split('\n')
            console.log(n)
            const transformedEntries = entries.map(item => ({ description: item }));
            const sendInfo = {
                name: name || n,
                entries: transformedEntries
            }
            console.log("not working?")
            console.log(sendInfo)
            sendData(sendInfo, token.token)

        }

        // Here, you can send the data to the server or perform other actions.
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <textarea
                ref={textareaRef}
                value={text}
                onPaste={handlePaste}
                onChange={(e) => setText(e.target.value)}
            />
            <button type="submit">Submit</button>
        </form>
    );
}

export default AddPost;
