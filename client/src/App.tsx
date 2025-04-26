import "./App.css";

import { useEffect, useState } from "react";

function MyButton() {
    return (
        <button style={{ backgroundColor: "blue", color: "white", padding: "0.5rem 1rem", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Click Me!
        </button>
    );
}

function App() {
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        fetch("http://localhost:3000/") // Call backend's Hello World route
            .then((response) => response.text())
            .then((data) => setMessage(data))
            .catch((error) => console.error("Error fetching message:", error));
    }, []);

    return (
        <div>
            <h1>Message from Backend:</h1>
            <p>{message}</p>
            <MyButton />
        </div>
    );
}

export default App;
