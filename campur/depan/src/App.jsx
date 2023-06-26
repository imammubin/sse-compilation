import { useEffect, useState } from "react";
import "./App.css";


function App() {
  const [messages, setMessage] = useState([]);

  useEffect(() => {
    const evtSource = new EventSource("http://localhost:3030/stream");
    evtSource.addEventListener("pesan", function (event) {
      // Logic to handle status updates
      setMessage((messages) => [...messages, event.data]);
      alert("pesan baru::: ")
    });
    
    evtSource.addEventListener("newlogin", function (event) {
      // Logic to handle status updates
      setMessage((messages) => [...messages, event.data]);
      alert("new LOGIN::: "+event.data)
    });

    evtSource.addEventListener("end_event", function (event) {
      setMessage((messages) => [...messages, event.data]);
      evtSource.close();
    });

    evtSource.onmessage=e=>{
      alert("onmessage::: type "+JSON.stringify(e.type))
      setMessage((messages) => [...messages, e.data])
    };
    evtSource.onpesan=e=>{
      alert("on PESAN::: type "+JSON.stringify(e.type))
      setMessage((messages) => [...messages, e.data])
    };

    return () => {
      evtSource.close();
    };
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        Hallo 
        {messages.map((el,idx) => (
          <p key={idx}>{el}</p>
        ))}
      </header>
    </div>
  );
}

export default App;