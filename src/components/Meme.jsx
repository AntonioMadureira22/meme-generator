import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import "../components/meme.css";

const MemeGeneratorComponent = () => {
  const [currentMeme, setCurrentMeme] = useState(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [draggingText, setDraggingText] = useState(null);
  const [textPosition, setTextPosition] = useState({
    topText: { x: 350, y: 75 },
    bottomText: { x: 350, y: 675 },
  });

  const canvasRef = useRef(null);

  const drawMeme = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = currentMeme;

    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, 700, 700);

      context.font = "bold 48px sans-serif";
      context.fillStyle = textColor;
      context.textAlign = "center";
      context.fillText(
        topText.toUpperCase(),
        textPosition.topText.x,
        textPosition.topText.y
      );
      context.fillText(
        bottomText.toUpperCase(),
        textPosition.bottomText.x,
        textPosition.bottomText.y
      );
    };
  }, [currentMeme, topText, bottomText, textPosition, textColor]);

  useEffect(() => {
    if (currentMeme) {
      drawMeme();
    }
  }, [currentMeme, topText, bottomText, textPosition, textColor, drawMeme]);

  const generateMeme = async () => {
    try {
      const response = await axios.get("https://api.imgflip.com/get_memes");
      const memes = response.data.data.memes;
      const randomMemeIndex = Math.floor(Math.random() * memes.length);
      const randomMemeUrl = memes[randomMemeIndex].url;
      setCurrentMeme(randomMemeUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTextChange = (event, type) => {
    if (type === "top") {
      setTopText(event.target.value);
    } else {
      setBottomText(event.target.value);
    }
  };

  const handleTextColorChange = (event) => {
    setTextColor(event.target.value);
  };

  const handleMouseDown = (event, type) => {
    setDraggingText(type);
  };

  const handleMouseMove = (event) => {
    if (draggingText) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setTextPosition((prev) => ({
        ...prev,
        [draggingText]: { x, y },
      }));
    }
  };

  const handleMouseUp = () => {
    setDraggingText(null);
  };

  const handleDownloadClick = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div
      className="meme-generator"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <h2>Random Meme Generator</h2>
      <canvas
        ref={canvasRef}
        width="700"
        height="700"
        onMouseDown={(e) => handleMouseDown(e, "topText")}
      />
      <input
        type="text"
        placeholder="Top Text"
        value={topText}
        onChange={(e) => handleTextChange(e, "top")}
      />
      <input
        type="text"
        placeholder="Bottom Text"
        value={bottomText}
        onChange={(e) => handleTextChange(e, "bottom")}
        onMouseDown={(e) => handleMouseDown(e, "bottomText")}
      />
      <input
        type="color"
        value={textColor}
        onChange={handleTextColorChange}
      />
      <button className="btn-1" onClick={generateMeme}>
        Generate Meme
      </button>
      <button className="btn-1" onClick={handleDownloadClick}>
        Download Meme
      </button>
      <footer>Made by Antonio Madureira</footer>
    </div>
  );
};

export default MemeGeneratorComponent;
