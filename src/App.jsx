import React, { useState } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import { CircularProgressWithLabel } from "./components/ProgressCircular";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const App = () => {
  const [video, setVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const handleFileChange = (event) => {
    setVideo((prev) => event.target.files[0]);
  };
  const cloudinaryName = process.env.CLOUDINARY_NAME;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cloudinaryName) {
      setError("Please add your cloudinary name.");
    }
    if (!video) {
      setError("Please select video to upload.");
    }

    const formData = new FormData();
    formData.append("file", video);
    formData.append("upload_preset", "video_preset");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinaryName}/video/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );
      const { secure_url } = response.data;

      await axios.post(`${process.env.BACKEND_BASEURL}/api/video`, {
        videoUrl: secure_url,
      });

      setVideo(null);
      setUploadProgress(0);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Enter to upload your video</h1>
      <form onSubmit={handleSubmit} className="form">
        <Stack direction="row" spacing={2}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload Video
            <VisuallyHiddenInput
              type="file"
              accept="video/*"
              name="video"
              id="video"
              onChange={handleFileChange}
            />
          </Button>

          <Button type="submit" variant="contained" endIcon={<SendIcon />}>
            Send
          </Button>
        </Stack>
      </form>

      {error && (
        <Alert key={"danger"} variant={"danger"}>
          {error}
        </Alert>
      )}

      {uploadProgress > 0 && (
        <div className="space">
          <CircularProgressWithLabel value={uploadProgress} />
        </div>
      )}
    </>
  );
};

export default App;
