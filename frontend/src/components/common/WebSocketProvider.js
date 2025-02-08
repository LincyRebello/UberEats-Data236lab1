import React, { useEffect, useState } from 'react';
import { websocketBaseUrl } from '../../services/api-services';

const WebSocketProvider = ({ callback }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Connect to WebSocket server
        var token = '';
        var socket = null;
        if (localStorage.getItem('access_token')) {
            token = localStorage.getItem('access_token');
            socket = new WebSocket(`${websocketBaseUrl}/updates/${token}/`);
            // Handle incoming messages
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('Received message:', data.message);
                setMessages((prevMessages) => [...prevMessages, data.message]);
                if (callback) {
                    callback(data.message)
                }
            };
        }




        // Cleanup on component unmount
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

    return (
        <></>
    );
};

export default WebSocketProvider;
