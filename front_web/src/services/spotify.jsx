import '../App.css';
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import { CardContent, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

const TriggerType = {
  track: "track",
  artist: "artist",
  album: "album"
}

const MyCheckList = (props) => {
  const [artistValue, setArtistValue] = useState(true);
  const [songValue, setSongValue] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSong, setIsSong] = useState(false);
  const [isArtist, setIsArtist] = useState("");

  const handleChange = (event) => {
    setInputValue(event.target.value)
    props.setInput(event.target.value);
  }

  const handleArtistChange = (event) => {
    setIsArtist(event.target.value);
    props.artist(event.target.value);
  }

  const SetTriggersBoxs = (e) => {
    if (e === "artist") {
      setArtistValue(true);
      setSongValue(false);
      setIsSong(false);
      props.value(TriggerType.artist);
    } else if (e === "song") {
      setArtistValue(false);
      setSongValue(true);
      setIsSong(true);
      props.value(TriggerType.track);
    }
  }

  return (
    <div>
      <h2>{props.title}</h2>
      <div>
        <input type="text" value={inputValue} onChange={(e) => handleChange(e)} />
      </div>
      {isSong === true
        ? <div><input type="text" value={isArtist} onChange={(oui) => handleArtistChange(oui)} /> </div>
        : <div></div>
      }
      <FormGroup>
        <FormControlLabel onChange={() => SetTriggersBoxs("song")} control={<Checkbox defaultValue={false} checked={songValue} />} label="Song" />
        <FormControlLabel onChange={() => SetTriggersBoxs("artist")} control={<Checkbox defaultValue={false} checked={artistValue} />} label="Artist" />
      </FormGroup>
    </div>
  );
}

const SpotifyLoginSuccess = () => {
  const [actualsong, setActualSong] = useState("No song");
  const [actualArtist, setActualArtist] = useState("No artist");
  let [triggerInput, setTriggerInput] = useState("");
  let [reactionInput, setReactionInput] = useState("");
  let [triggerType, setTriggerType] = useState(TriggerType.artist);
  let [reactionType, setReactionType] = useState(TriggerType.artist);
  let [artistTrigger, setArtistTrigger] = useState("");
  let [artistReaction, setArtistReaction] = useState("");

  const get_current_song = async () => {
    const data = await fetch('http://localhost:3000/spotify/get_current_song');
    const song = await data.json();
    console.log(song);
    setActualSong(song.name);
    setActualArtist(song.artist);
  }

  const change_song = async () => {
    const data = await fetch('http://localhost:3000/spotify/change_song');
    const song = await data.json();
    console.log(song);
    await get_current_song();
  }

  const set_workflow = async () => {
    console.log(JSON.stringify({ triggerInput, triggerType, artistTrigger, reactionInput, reactionType, artistReaction }));
    const data = await fetch('http://localhost:3000/spotify/set_workflow', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ triggerInput, triggerType, artistTrigger, reactionInput, reactionType, artistReaction })
    });
  }

  return (
    <div className='login-form'>
      <h1>Spotify</h1>

      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <h2>Current song: {actualsong}</h2>
          <h2>Current artist: {actualArtist}</h2>
          <button onClick={() => get_current_song()}>Get current song</button>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <MyCheckList title={"Def trigger artist :"} setInput={(value) => triggerInput = value} value={(value) => triggerType = value} artist={(value) => artistTrigger = value}/>
          <div>
            <ChangeCircleIcon fontSize="large" sx={{fontSizeLarge: 4000}}/>
          </div>
          <MyCheckList title={"Def new song :"} setInput={(value) => reactionInput = value} value={(value) => reactionType = value} artist={(value) => artistReaction = value}/>
          <button onClick={() => set_workflow()}>Set Workflow</button>
        </CardContent>
      </Card>
    </div>
  );
}
    
export default SpotifyLoginSuccess;

//<div>You are connected to Spotify</div>
//<div className='label'> {"You are listenning \"" + actual_song + "\""} </div>
//<div className='label'> {"The artist is :" + actual_artist} </div>
//<div className='button-container'>
//    <button className='button-register' onClick={() => get_current_song()}>get current playing song</button>
//</div>
//<div className='button-container'>
//    <button className='button-register' onClick={() => change_song()}>change Song if the current artist is Jul</button>
//</div>