import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatPage = () => {
    const [chats, setChats] = useState([]);

    const fetchData = async () => {
        const { data } = await axios.get('/api/data');
        setChats(data);
        console.log(data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            {chats.map((chat, i) => (
                <div key={i}>{chat.chatName}</div>
            ))}
        </div>
    )
}

export default ChatPage;