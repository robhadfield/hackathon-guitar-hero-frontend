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

    const reqBody = new FormData();
    reqBody.append("music", formData.music[0], formData.music[0].name);
    const requestOptions = {
      method: 'POST',
      redirect: 'follow',
      body: reqBody
    };

    const response = await fetch(uploadUrl, requestOptions).then(response => response.json());
    setStatus('uploaded file');
    console.log(response);
    const result = await fetch(compareUrl + response.data.name).then(response => response.json());
    setComparisonData(result.data.files);
    setStatus('comparison complete');
    console.log(result);

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
          <label className="file-input">Upload your version of "Smells like Teen Spirit" by Nirvana.
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
        <h2>Scores:</h2>
          {comparisonData.map((d, i) => (<div className="resultBlock" key={i+1}><h3>Track title</h3><p>{d.match}</p></div>))}
        </div>}
    </div>
  );
}

export default App;
