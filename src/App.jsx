import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Chatpage from "./components/Chatpage";
import "./App.css"

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<Chatpage />} />
      </Routes>
    </div>
  );
};

export default App;
