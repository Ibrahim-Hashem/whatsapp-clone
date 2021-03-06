import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from 'pusher-js';
import React, { useEffect, useState } from 'react';
import axios from "./axios";


function App() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    axios.get('/messages/sync').then(response=>{
      setMessages(response.data);
      })
  }, [])

  useEffect(() => {
    const pusher = new Pusher('c21624dc31efdb828d12', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('messages');
    channel.bind("inserted", function(data) {
      setMessages([...messages,data]);
    });
    return ()=>{
      channel.unbind_all();
      channel.unsubscribe();
    }
    }, [messages])

  console.log(messages);


  return (
    <div className="app">
      <div className="app__body">
        <Sidebar/>
        <Chat messages={messages}/>
      </div>
    </div>
  );
}

export default App;
