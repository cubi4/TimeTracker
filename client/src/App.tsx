import "./App.css";

import { useEffect, useState } from "react";
function MyButton() {
    return (
        <button className="bg-red-500 text-white hover:bg-sky-700 rounded ">
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
        <div className="flex justify-center items-center flex-col">
            <h1 className="text-4xl">Message from Backend:</h1>
            <p className="text-white">{message}</p>
            <MyButton />
        </div>
    );
}

export default App;
