import { render } from 'preact';
import ReactPlayer from 'react-player';
import { useState, useRef, useEffect } from 'preact/hooks';
import { PlayIcon, PauseIcon, FastForwardIcon, RewindIcon } from '@heroicons/react/solid';

import './style.css';

export const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLink, setVideoLink] = useState('https://www.youtube.com/watch?v=KySOP1wtF7o');
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [songName, setSongName] = useState('what it feels like to fade away (playlist)');
  const [newsItems, setNewsItems] = useState<{ title: string; author: string; date: string; url: string }[]>([]);
  
  const playerRef = useRef<ReactPlayer | null>(null);
  const videoCode = videoLink.split('v=')[1];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://dev.to/api/articles?tag=news&per_page=5');
        const data = await response.json();
        const formattedNews = data.map((item: any) => ({
          title: item.title,
          author: item.user.name,
          date: new Date(item.published_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          url: item.url,
        }));
        setNewsItems(formattedNews);
      } catch (error) {
        console.error('Error fetching news articles:', error);
      }
    };

    fetchNews();
  }, []);

  const handleProgress = ({ played }: { played: number }) => setProgress(played);
  const startPlaying = () => setIsPlaying(prev => !prev);
  const handleProgressBarClick = (e: any) => {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const relativePos = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    playerRef.current?.seekTo(relativePos);
  };
  const handleForward = () => {
    playerRef.current?.seekTo((playerRef.current.getCurrentTime() || 0) + 10, 'seconds');
  };
  const handleBackward = () => {
    playerRef.current?.seekTo((playerRef.current.getCurrentTime() || 0) - 10, 'seconds');
  };

  const padStart = (str: string, targetLength: number, padString: string = '0') => 
    str.padStart(targetLength, padString);

  const formatTime = (date: Date) => {
    const hours = padStart(date.getHours().toString(), 2);
    const minutes = padStart(date.getMinutes().toString(), 2);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return { time: `${hours}:${minutes}`, day: dayNames[date.getDay()] };
  };

  const { time, day } = formatTime(currentTime);

  const getBackgroundImageUrl = (videoCode: string) => {
    return `url(https://img.youtube.com/vi/${videoCode}/maxresdefault.jpg)`;
  };

  return (
    <>
      <div className="song-display">
        {songName}
      </div>
      <div className="time-display">
        <div className="time">{time}</div>
        <div className="day">{day}</div>
      </div>
      <div className="button-group">
        <button onClick={handleBackward} className="modern-button">
          <RewindIcon className="h-6 w-6 text-white" />
        </button>
        <button onClick={startPlaying} className="modern-button">
          {isPlaying ? 
            <PauseIcon className="h-6 w-6 text-white" /> : 
            <PlayIcon className="h-6 w-6 text-white" />
          }
        </button>
        <button onClick={handleForward} className="modern-button">
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
      
      <div className="news-display">
        <h3>Latest News</h3>
        <ul>
          {newsItems.map((item, index) => (
            <li key={index}>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <strong>{item.title}</strong>
              </a>
              <div className="article-info">
                by {item.author} on {item.date}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

render(<App />, document.getElementById('app'));
