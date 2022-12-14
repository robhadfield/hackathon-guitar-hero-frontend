import {useState} from 'react';
import './App.css';
import { useForm } from 'react-hook-form';

function App() {
  
  // https://github.com/react-hook-form/react-hook-form
  const {
    register,
    handleSubmit,
  } = useForm();

  const [status, setStatus] = useState('idle');

   const sendFile = async (formData) => {
      console.log(formData.music[0]);
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

  return (
    <div className="App">
      <p>{status}</p>
      <form onSubmit={handleSubmit((data) => sendFile(data))}>
        <input type="file" {...register('music')} />
        <input type="submit" />
      </form>
    </div>
  );
}

export default App;
