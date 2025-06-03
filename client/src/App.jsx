import { useState } from "react";
import "./App.css";
function App() {
    const [message, setMessage] = useState("");
    const [singleFile, setSingleFile] = useState(null);
    const [displaySingleFile, setDisplaySingleFile] = useState(null);

    const fetchSingleFile = async () => {
        try {
            const response = await fetch(`http://localhost:8000/fetch/single`);

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setDisplaySingleFile(imageUrl);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSingleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", singleFile);

        try {
            const response = await fetch(`http://localhost:8000/save/single`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            setMessage(data.message || "Upload successful");
        } catch (error) {
            console.log(error);
            setMessage("Upload failed");
        }
    };

    return (
        <>
            <div>
                <h2>Single File Uploader</h2>
                <form onSubmit={handleSingleUpload}>
                    <input
                        type="file"
                        onChange={(e) => {
                            setSingleFile(e.target.files[0]);
                        }}
                        required
                    />
                    <br></br>
                    <button type="submit">Upload</button>
                </form>
                <button type="button" onClick={fetchSingleFile}>
                    Fetch Random Image
                </button>
                {displaySingleFile && (
                    <div>
                        <h4>Fetched Image:</h4>
                        <img
                            src={displaySingleFile}
                            alt="Fetched from server"
                            style={{
                                maxWidth: "300px",
                            }}
                        />
                    </div>
                )}
                <br></br>
                {message && <p>{message}</p>}
            </div>
        </>
    );
}

export default App;
