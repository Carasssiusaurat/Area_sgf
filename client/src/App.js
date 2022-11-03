import React, { useState } from "react";

function App() {
  const [service, setService] = useState("");
  const [action, setAction] = useState("");
  const [trigger, setTrigger] = useState("");
  const [reaction, setReaction] = useState("");
  const [id, setId] = useState("");

  const createGoogleAuthLink = async () => {
    try {
      const request = await fetch(
        "http://localhost:8080/google/createAuthLink",
        {
          method: "POST",
        }
      );
      const response = await request.json();
      window.location.href = response.url;
    } catch (error) {
      console.log("App.js 19 | error", error);
      throw new Error("Issue with Login", error.message);
    }
  };

  const set_workflow = async () => {
    console.log(
      JSON.stringify({
        service,
        action,
        trigger,
        reaction,
        id,
      })
    );
    const data = await fetch("http://localhost:8080/google/set_workflow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service,
        action,
        trigger,
        reaction,
        id,
      }),
    });
  };

  return (
    <div className="App">
      <h1>Google</h1>
      <button onClick={createGoogleAuthLink}>Login</button>
      <>
        <input
          type="text"
          placeholder="Service"
          name="Service"
          onChange={(e) => setService(e.target.value)}
          required
        />
        <input
          type="text"
          name="Action"
          placeholder="Action"
          onChange={(e) => setAction(e.target.value)}
          required
        />
        <input
          type="text"
          name="Trigger"
          placeholder="Trigger"
          onChange={(e) => setTrigger(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Reaction"
          name="Reaction"
          onChange={(e) => setReaction(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="video id"
          name="id"
          onChange={(e) => setId(e.target.value)}
          required
        />
        <button onClick={set_workflow}>Set Calendar</button>
        <button onClick={set_workflow}>Set Youtube</button>
        {/* <button onClick={signOut}>Sign Out</button> */}
      </>
    </div>
  );
}

export default App;
