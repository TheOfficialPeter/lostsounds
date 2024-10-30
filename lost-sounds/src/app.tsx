import ReactPlayer from 'react-player'
import { useState } from 'preact/hooks';
import { FaPlay, FaPause, FaFastForward, FaFastBackward } from "react-icons/fa";
import './app.css'

export function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  const startPlaying = () => {
    setIsPlaying(!isPlaying);
  }

  return (
    <>
      <div className="button-group">
        <button>
          <FaFastBackward></FaFastBackward>
        </button>
        <button onClick={startPlaying}>
          {isPlaying ? <FaPause></FaPause> : <FaPlay></FaPlay>}
        </button>
        <button>
          <FaFastForward></FaFastForward>
        </button>
      </div>
      <div class="background" style={'background-image: url(https://img.youtube.com/vi/' + 'nqiC_D5U-LE' + '/maxresdefault.jpg' }></div>
      <ReactPlayer playing={isPlaying} url='https://www.youtube.com/watch?v=nqiC_D5U-LE' controls={false} height={0} width={0}/>
    </>
  )
}
