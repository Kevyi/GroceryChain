import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0)

  //On input with argument (), activate arrow function.
    //async means asynchronously, so will do it in the meantime despite other processes.

 
  const fetchAPI = async () => {
      //Gets data from /api which is found in server backend
      const response = await axios.get("http://localhost:8080/api");

      //Prints out received response. Can make a try/except to make sure response is heard?
      console.log(response.data.random);
  };

  //Call function on intial render of webpage
    useEffect(() => {
      fetchAPI()
    }, []);

    //Something to note, is that React has a specialized router that routes to different webpages.
      



  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
