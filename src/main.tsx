import { render } from 'preact';
import ReactPlayer from 'react-player'
import { useState, useRef, useEffect } from 'preact/hooks';
import { PlayIcon, PauseIcon, FastForwardIcon, RewindIcon } from '@heroicons/react/solid'

import './style.css';

export const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLink, setVideoLink] = useState('https://www.youtube.com/watch?v=KySOP1wtF7o');
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const playerRef = useRef<ReactPlayer | null>(null);
  const videoCode = videoLink.split('v=')[1];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleProgress = (state: { played: number }) => {
    setProgress(state.played);
  }

  const startPlaying = () => {
    setIsPlaying(prev => !prev);
  }

  const handleProgressBarClick = (e: any) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const relativePos = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    
    if (playerRef.current) {
      playerRef.current.seekTo(relativePos);
    }
  }

  const handleForward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + 10, 'seconds');
    }
  }

  const handleBackward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime - 10, 'seconds');
    }
  }

  const padStart = (str: string, targetLength: number, padString: string = '0') => {
    while (str.length < targetLength) {
      str = padString + str;
    }
    return str;
  }

  const formatTime = (date: Date) => {
    const hours = padStart(date.getHours().toString(), 2, '0');
    const minutes = padStart(date.getMinutes().toString(), 2, '0');
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const day = dayNames[date.getDay()];
    return { time: `${hours}:${minutes}`, day };
  }

  const { time, day } = formatTime(currentTime);

  const getBackgroundImageUrl = (videoCode: string) => {
    return `url(https://img.youtube.com/vi/${videoCode}/maxresdefault.jpg)`;
  }

  return (
    <>
      <div className="time-display">
        <div className="time">{time}</div>
        <div className="day">{day}</div>
      </div>
      <div className="button-group">
        <button 
          onClick={handleBackward}
          className="modern-button"
        >
          <RewindIcon className="h-6 w-6 text-white" />
        </button>
        <button 
          onClick={startPlaying}
          className="modern-button"
        >
          {isPlaying ? 
            <PauseIcon className="h-6 w-6 text-white" /> : 
            <PlayIcon className="h-6 w-6 text-white" />
          }
        </button>
        <button 
          onClick={handleForward}
          className="modern-button"
        >
          <FastForwardIcon className="h-6 w-6 text-white" />
        </button>
        <div className="progress-container" onClick={handleProgressBarClick}>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
      <div className="background vignette" style={{ backgroundImage: getBackgroundImageUrl(videoCode) }}></div>
      <ReactPlayer 
        ref={playerRef}
        playing={isPlaying} 
        url={videoLink} 
        controls={false} 
        volume={1} 
        height={0} 
        width={0} 
        onProgress={handleProgress}
        progressInterval={100}
      />
    </>
  )
}

render(<App />, document.getElementById('app'));
