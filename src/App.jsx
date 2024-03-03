import { useEffect, useMemo, useRef, useState } from "react";
import { Howl, Howler } from "howler";

import "./App.css";

import { Icon } from "@iconify/react";

import SinglesongCard from "./components/SinglesongCard";
function App() {
  const songs = [
    { id: 1, name: "Akhiyaan gulaab", track: "./music/Akhiyaan.mp3" },
    { id: 2, name: "Husn", track: "./music/Husn.mp3" },
    { id: 3, name: "Jeena haram kar diya", track: "./music/Jeena.mp3" },
    { id: 4, name: "Teri baaton mein", track: "./music/Teri.mp3" },
  ];

  //make hooks for handling state
  const [currentSong, setCurrentSong] = useState(null);
  const [soundPlayed, setSoundPlayed] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (currentSong) {
      const sound = new Howl({ src: [currentSong.track] });
      sound.play();
      setSoundPlayed(sound);
      setIsPlaying(true);
    }
  }, [currentSong]);

  //lets add some song function

  useEffect(() => {
    if (soundPlayed) {
      soundPlayed.on("play", () => {
        setIsPlaying(true);
        requestAnimationFrame(updateCurrentTime);
      });
      soundPlayed.on("load", () => {
        setDuration(soundPlayed.duration());
      });
      soundPlayed.on("end", () => {
        setIsPlaying(false);
      });
    }
  });

  const updateCurrentTime = () => {
    setCurrentTime(soundPlayed.seek());
    if (soundPlayed.playing()) {
      requestAnimationFrame(updateCurrentTime);
    }
  };

  const handleSongClick = (choosenSong, index) => {
    console.log(choosenSong, index);
    if (choosenSong) {
      if (soundPlayed) {
        soundPlayed.stop();
      }
      setCurrentSong(choosenSong);
      setCurrentSongIndex(index);
    }
  };

  const nextSong = () => {
    if (currentSongIndex < songs.length - 1) {
      let index = currentSongIndex + 1;
      handleSongClick(songs[index], index);
    } else {
      handleSongClick(songs[0], 0);
    }
  };

  const prevSong = () => {
    if (currentSongIndex > 0) {
      let index = currentSongIndex - 1;
      handleSongClick(songs[index], index);
    } else {
      handleSongClick(songs[songs.length - 1], songs.length - 1);
    }
  };

  //lets make play and pause toggle function

  const togglePlay = () => {
    if (soundPlayed) {
      if (isPlaying) {
        soundPlayed.pause();
      } else {
        soundPlayed.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let second = Math.floor(time % 60);

    return `${minutes}:${second < 10 ? 0 : ""}${second}`;
  };

  //for calculating progress of the song
  const calculateProgress = () => {
    let n = (currentTime / duration) * 100;
    return n;
  };

  //progress bag click handler

  const handleProgressBarClick = (e) => {
    const clickedPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBarRef.current.clientWidth;
    const clickedTime = (clickedPosition / progressBarWidth) * duration;
    soundPlayed.seek(clickedTime);
    setCurrentTime(clickedTime);
  };

  const icons = useMemo(() => {
    return {
      playpause: isPlaying ? (
        <Icon
          className="w-10 h-10 hover:scale-[1.1]"
          icon="zondicons:pause-solid"
        />
      ) : (
        <Icon
          className="w-10 h-10 hover:scale-[1.1]"
          icon="icon-park-solid:play"
        />
      ),
      next: <Icon icon="fluent:next-16-filled" className="w-6 h-6" />,
      prev: <Icon icon="fluent:previous-20-filled" className="w-6 h-6" />,
    };
  }, [isPlaying]);
  return (
    <>
      <div className="container h-[550px] w-[800px] bg-black rounded-md flex overflow-hidden">
        <div className="left-container flex-1 bg-[#CDE0F6] p-4 relative">
          <div className="flex flex-col flex-1 h-full overflow-auto song-list">
            {/* //lets add song  */}
            {songs.map((song, index) => (
              <SinglesongCard
                songIdx={index}
                key={song.id}
                song={song}
                handleSongClick={handleSongClick}
              />
            ))}
          </div>
        </div>
        <div className="right-container relative flex flex-col justify-center items-center flex-1 bg-[#47BE52] p-4">
          <div className="w-full h-[60%] bg-white flex flex-col justify-center items-center">
            <h1 className="font-bold text-[3rem]">Music</h1>
            {currentSong && <p>{currentSong.name}</p>}
          </div>
          <div className="flex items-center justify-center gap-4 my-4 controls">
            <button className="" onClick={prevSong}>
              {icons.prev}
            </button>
            <button className="" onClick={togglePlay}>
              {icons.playpause}
            </button>
            <button className="" onClick={nextSong}>
              {icons.next}
            </button>
          </div>
          <div
            ref={progressBarRef}
            onClick={handleProgressBarClick}
            className="songprogressbar w-[90%] relative bg-white h-1 cursor-pointer my-2"
          >
            <p className="absolute left-0 bottom-2">
              {formatTime(currentTime)}
            </p>
            <p className="absolute right-0 bottom-2">{formatTime(duration)}</p>
            <div
              className="w-0 h-1 bg-black bar"
              style={{ width: calculateProgress() + "%" }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
