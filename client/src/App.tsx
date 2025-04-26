import "./App.css";

import { useEffect, useState } from "react";
// TODO: Fix Tailwind CSS styles
function MyButton() {
    return (
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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
