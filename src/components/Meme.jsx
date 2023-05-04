import React, { useState } from "react";
import Meme from "./memes";
import axios from "axios";

import "../components/meme.css";

const MemeGeneratorComponent = () => {
  const [currentMeme, setCurrentMeme] = useState(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");

  const generateMeme = async () => {
    try {
      const response = await axios.get("https://api.imgflip.com/get_memes");
      console.log(response);
      const memes = response.data.data.memes;
      const randomMemeIndex = Math.floor(Math.random() * memes.length);
      const randomMemeUrl = memes[randomMemeIndex].url;
      setCurrentMeme(randomMemeUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTopTextChange = (event) => {
    setTopText(event.target.value);
  };

  const handleBottomTextChange = (event) => {
    setBottomText(event.target.value);
  };

  const handleDownloadClick = () => {
    if (!currentMeme) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 700;
    canvas.height = 700;

    const context = canvas.getContext("2d");

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = currentMeme;

    image.onload = () => {
      context.drawImage(image, 0, 0, 700, 700);

      context.font = "bold 48px sans-serif";
      context.fillStyle = "	#ffffff";
      context.textAlign = "center";
      context.fillText(topText.toUpperCase(), 350, 75);

      context.fillText(bottomText.toUpperCase(), 350, 675);

      const link = document.createElement("a");
      link.download = "meme.png";
      link.href = canvas.toDataURL();
      link.click();
    };
  };

  return (
    <div className="meme-generator">
      <h2>Random Meme Generator</h2>
      {currentMeme ? <Meme url={currentMeme} /> : null}
      <input
        type="text"
        placeholder="Top Text"
        value={topText}
        onChange={handleTopTextChange}
      />
      <input
        type="text"
        placeholder="Bottom Text"
        value={bottomText}
        onChange={handleBottomTextChange}
      />
      <button className="btn-1" onClick={generateMeme}>
        Generate Meme
      </button>
      <button className="btn-1" onClick={handleDownloadClick}>
        Download Meme
      </button>
    </div>
  );
};

export default MemeGeneratorComponent;




