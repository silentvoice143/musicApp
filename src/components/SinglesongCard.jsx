import React from "react";
import musicImg from "../assets/img/music.png";

function SinglesongCard({ song, songIdx, handleSongClick }) {
  return (
    <div
      onClick={() => {
        handleSongClick(song, songIdx);
      }}
      className="songelement bg-[#444444] p-4 flex items-center text-white h-fit w-full cursor-pointer hover:bg-[#444444ad]"
    >
      <img src={musicImg} alt="" className="w-10 h-10 " />
      <h2 className="ml-4 text-sm font-semibold">{song.name}</h2>
    </div>
  );
}

export default SinglesongCard;
