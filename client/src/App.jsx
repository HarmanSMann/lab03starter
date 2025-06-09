import { useState } from "react";
import "./App.css";
function App() {
    const [message, setMessage] = useState("");
    const [singleFile, setSingleFile] = useState(null);
    const [displaySingleFile, setDisplaySingleFile] = useState(null);
    const [multipleFiles, setMultipleFiles] = useState(null);
    const [displayMultipleFiles, setDisplayMultipleFiles] = useState(null);
    const [displayDogImage, setDisplayDogImage] = useState("");

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

    const handleMultipleUpload = async (e) => {
        e.preventDefault();
        if (multipleFiles.length === 0) {
            setMessage("Please select files before uploading.");
            return;
        }

        try {
            const formData = new FormData();

            multipleFiles.forEach((file) => {
                formData.append("files", file);
            });

            const response = await fetch(
                `http://localhost:8000/save/multiple`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Images upload failed");
            }

            setMessage("Files have been uploaded");
        } catch (error) {
            console.log("Error", error);
        }
    };

    const fetchMultipleFiles = async () => {
        try {
            const response = await fetch(
                "http://localhost:8000/fetch/multiple"
            );
            const data = await response.json();
            const filePromises = data.map(async (filename) => {
                const fileResponse = await fetch(
                    `http://localhost:8000/fetch/file/${filename}`
                );

                const fileBlob = await fileResponse.blob();
                const imageUrl = URL.createObjectURL(fileBlob);
                return imageUrl;
            });

            const imageUrls = await Promise.all(filePromises);
            setDisplayMultipleFiles(imageUrls);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDogImage = async () => {
        try {
            const response = await fetch(
                "https://dog.ceo/api/breeds/image/random"
            );
            const data = await response.json();
            setDisplayDogImage(data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const saveDogImage = async () => {
        try {
            const fileResponse = await fetch(displayDogImage);
            const blob = await fileResponse.blob();

            const formData = new FormData();
            formData.append("file", blob, "dog-image.jpg");

            const response = await fetch(`http://localhost:8000/save/single`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
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
            <div>
                <h2>Multiple Files Uploader</h2>
                <form onSubmit={handleMultipleUpload}>
                    <input
                        type="file"
                        onChange={(e) => {
                            setMultipleFiles(Array.from(e.target.files));
                        }}
                        multiple
                        required
                    />
                    <br></br>
                    <button type="submit">Upload</button>
                </form>
                <button type="button" onClick={fetchMultipleFiles}>
                    Fetch Random Image
                </button>
                {displayMultipleFiles && (
                    <div>
                        <h4>Fetched Images:</h4>
                        {displayMultipleFiles.map((imageUrl, index) => (
                            <div key={index}>
                                <img
                                    src={imageUrl}
                                    style={{
                                        width: "200px",
                                        marginTop: "10px",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
                <br></br>
                {message && <p>{message}</p>}
            </div>
            <div>
                <h2>Fetch Dog Image</h2>
                <button onClick={fetchDogImage}>Fetch Dog Image</button>
                {displayDogImage && (
                    <div>
                        <img
                            src={displayDogImage}
                            style={{ width: "200px", marginTop: "10px" }}
                        />
                        <br></br>
                        <button onClick={saveDogImage}> Save it </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default App;
