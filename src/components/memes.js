
import React from "react";
import "./meme.css";

const Meme = ({ url }) => {
  return <img className="meme-image" src={url} alt="meme" />;
};

export default Meme;