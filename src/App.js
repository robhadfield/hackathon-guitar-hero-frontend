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

   const sendFile = async (formData) => {
      console.log(formData);
      setStatus('fetching');

      const reqBody = new FormData();
      reqBody.append("music", formData.music[0], formData.music[0].name);

      const requestOptions = {
        method: 'POST',
        body: reqBody,
        redirect: 'follow'
      };

      fetch("http://localhost:3001/upload-music", requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(result);
          setStatus('fetched')}
        ).catch(error => console.log('error', error));
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
    </div>
  );
}

export default App;
