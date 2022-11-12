const {ImListeningASong, ChangeSong, AddSongToPlaylist} = require('../services/Spotify');
const { Getcalendar, GetYoutubeVideo, sendMail, ListEmails } = require("../services/google");
// const {} = require('../services/Linkedin');
const {} = require('../services/Github');
const Areas = require ('../model/Areas');
const Users = require('../model/Users');
const my_actions = require('../model/Actions');
const my_reactions = require('../model/Reactions');
const Services = require('../model/Services');
const cronJob = require('cron').CronJob;

const test = (caca) => {
  console.log(caca)
}

const actions = {
  // Spotify
  "636ba1c921531a915d2085d0": ImListeningASong,
  // Google
  "636bb8860ffcc9a4f64a70ca": Getcalendar,
  "636bb9780ffcc9a4f64a70d2": GetYoutubeVideo,
  "636bb8d40ffcc9a4f64a70ce": ListEmails
  //"636bb8d40ffcc9a4f64a70ce": 
  // Linkedin
  //"636fb585889fe63d93b631a0": 
  // Github
  //"636fbd1aee6166a4996beb69":
  //"636fbd6eee6166a4996beb7e":
};

const reactions = {
  // Spotify
  "636ba32f21531a915d2085d4": ChangeSong,
  "636ba45eec84f1ac23b7b424": AddSongToPlaylist,
  // Google
  "636b6a77e22023e504292651": sendMail
  //"636bbb470ffcc9a4f64a70e0": 
  // Linkedin
  //"636ccabcf7b6fd105f0880f4":
  // Github
  //"636fbeedee6166a4996bebd1":
  //"636fbfbbee6166a4996bec08":
  //"636fbfa6ee6166a4996bebff":
};

const getServiceActionToken = async (id) => {
  const tokens = []
  const area = await Areas.findOne({_id: id});
  const user = await Users.findOne({_id: area.user_id});
  const service = await Services.findOne({action_id: {$in: area.action._id}})
  for (let i = 0; i < user.services.length; i++) {
    if (user.services[i]._id.toString() == service._id.toString()) {
      tokens.push(user.services[i].access_token);
      tokens.push(user.services[i].refresh_token);
    }
  }
  return (tokens);
}

const getServiceReactionToken = async (id) => {
  const tokens = []
  const area = await Areas.findOne({_id: id});
  const user = await Users.findOne({_id: area.user_id});
  const service = await Services.findOne({reaction_id: {$in: area.reaction._id}})
  for (let i = 0; i < user.services.length; i++) {
    if (user.services[i]._id.toString() == service._id.toString()) {
      tokens.push(user.services[i].access_token);
      tokens.push(user.services[i].refresh_token);
    }
  }
  return (tokens);
}

const ExecuteAreas = async () => {
  const areas = await Areas.find();
  for (let i = 0; i < areas.length; i++) {
    if (areas[i].actif === true) {
      const action_token = await getServiceActionToken(areas[i]._id);
      const reaction_token = await getServiceReactionToken(areas[i]._id);
      const user = await Users.findOne({_id: areas[i].user_id});
      const service_action = await Services.findOne({action_id: {$in: areas[i].action._id}})
      const service_reaction = await Services.findOne({reaction_id: {$in: areas[i].reaction._id}})
      const return_action = await actions[areas[i].action._id.toString()](areas[i].action.args, action_token, user, service_action._id);
      if (return_action.status === "success")
        reactions[areas[i].reaction._id.toString()](areas[i].reaction.args, reaction_token, user, service_reaction._id);
    }
  }
};


const job = new cronJob('*/5 * * * * *', ExecuteAreas, null, true, 'Europe/Paris');

module.exports = {getServiceActionToken, getServiceReactionToken, job};