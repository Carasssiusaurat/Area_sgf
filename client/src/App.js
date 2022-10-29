import React, { useState } from "react";

function App() {
  const [action, setAction] = useState("");
  const [trigger, setTrigger] = useState("");

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
      console.log("App.js 12 | error", error);
      throw new Error("Issue with Login", error.message);
    }
  };

  const set_workflow = async () => {
    console.log(
      JSON.stringify({
        trigger,
        action,
      })
    );
    const data = await fetch("http://localhost:8080/google/set_workflow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trigger,
        action,
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
          name="Action"
          onChange={(e) => setAction(e.target.value)}
          required
        />
        <input
          type="text"
          name="Trigger"
          onChange={(e) => setTrigger(e.target.value)}
          required
        />
        <button onClick={set_workflow}>Get Google Calendars</button>
        {/* <button onClick={signOut}>Sign Out</button> */}
      </>
    </div>
  );
}

export default App;
