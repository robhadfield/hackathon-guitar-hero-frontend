import { useState } from 'react';
import './App.css';
import LogoSVG from './guitar_hero_logo.svg';
import { useForm } from 'react-hook-form';

function App() {
  
  // https://github.com/react-hook-form/react-hook-form
  const {
    register,
    handleSubmit,
  } = useForm();

  const [status, setStatus] = useState('idle');
  const [fileStatus, setFileStatus] = useState('');
  const [comparisonData, setComparisonData] = useState([]);

  const sendFile = async (formData) => {

    setStatus('working...');

    const uploadUrl = "http://localhost:3001/upload-music";
    const compareUrl = "http://localhost:3001/compare-files?file=";
    const voteUrl = "http://localhost:3001/vote?songid=";

    const reqBody = new FormData();
    reqBody.append("music", formData.music[0], formData.music[0].name);
    const requestOptions = {
      method: 'POST',
      redirect: 'follow',
      body: reqBody
    };

    // Save file
    const response = await fetch(uploadUrl, requestOptions).then(response => response.json());
    setStatus('uploaded file');
    console.log(response);

    // Compare files
    const result = await fetch(compareUrl + response.data.name).then(response => response.json());
    const max = result.data.files.reduce((prev, current) => (prev.match > current.match) ? prev : current)
    setComparisonData(max);
    setStatus('comparison complete');

    // Vote
    console.log(max);
    const vote = await fetch(voteUrl + max.uuid).then(response => response.json());
    console.log(vote);

  };

  const onInputChange = (ev) => {
    if (ev?.target?.value) {
      setFileStatus('fileReady');
    }
  }


  return (
    <div className="App">
      {<p className="alert">{status}</p>}
      <div className="logo">
        <img src={LogoSVG} alt="Guitar Hero!" />
      </div>
      {status !== 'comparison complete' ?
        <form onSubmit={handleSubmit((data) => sendFile(data))}>
          <label className="file-input"><h3><span>"With the lights out, it's less dangerous..."</span> is a lyric from which of these popular rock songs?</h3>
          <ol>
            <li>Smoke On The Water</li>
            <li>Smells Like Teen Spirit</li>
            <li>Killer Queen</li>
            <li>You Really Got Me</li>
          </ol>
          <p><strong>Record and upload a riff to vote!</strong></p>
            <div className="select-file">UPLOAD YOUR RIFF!</div>
            <input type="file" name="music" {...register('music')} onChange={(e) => onInputChange(e)} />
          </label>
          <input
            type="submit"
            disabled={fileStatus === 'fileReady' ? false : true}
            className={fileStatus === 'fileReady' ? "ready" : "disabled"}
            value={fileStatus === 'fileReady' ? "ENTERTAIN US!" : "UPLOAD YOUR RIFFAGE!"}
          />
        </form>
      : <div>
        <h2>We have a match!</h2>
        <h3>You voted for: <span>{comparisonData.title}</span></h3>
        <p>Your riff matched with our master riff - <strong>{comparisonData.match}%!</strong></p>
        </div>}
    </div>
  );
}

export default App;
