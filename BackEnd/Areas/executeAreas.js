const {ImListeningASong, ChangeSong, AddSongToPlaylist} = require('../services/Spotify');
const Areas = require ('../model/Areas');
const Users = require('../model/Users');
const my_actions = require('../model/Actions');
const my_reactions = require('../model/Reactions');
const Services = require('../model/Services');
const { Getcalendar, GetYoutubeVideo } = require("../services/google");
const cronJob = require('cron').CronJob;

const test = (caca) => {
  console.log(caca)
}

const actions = {
  "636ba1c921531a915d2085d0": ImListeningASong,
  "636bb8860ffcc9a4f64a70ca": Getcalendar,
  "636bb9780ffcc9a4f64a70d2": GetYoutubeVideo,
};
  

const reactions = {
  "636ba32f21531a915d2085d4": ChangeSong,
  "636ba45eec84f1ac23b7b424": AddSongToPlaylist
};

const getServiceActionToken = async (id) => {
  const area = await Areas.findOne({_id: id});
  const user = await Users.findOne({_id: area.user_id});
  const service = await Services.findOne({action_id: {$in: area.action._id}})
  for (let i = 0; i < user.services.length; i++) {
    if (user.services[i]._id.toString() == service._id.toString()) {
      return (user.services[i].access_token);
    }
  }
  return (null);
}

const getServiceReactionToken = async (id) => {
  const area = await Areas.findOne({_id: id});
  const user = await Users.findOne({_id: area.user_id});
  const service = await Services.findOne({reaction_id: {$in: area.reaction._id}})
  for (let i = 0; i < user.services.length; i++) {
    if (user.services[i]._id.toString() == service._id.toString()) {
      return (user.services[i].access_token);
    }
  }
  return (null);
}

const ExecuteAreas = async () => {
  const areas = await Areas.find();
  for (let i = 0; i < areas.length; i++) {
    if (areas[i].actif === true) {
      const action_token = await getServiceActionToken(areas[i]._id);
      const reaction_token = await getServiceReactionToken(areas[i]._id);
      const return_action = await actions[areas[i].action._id.toString()](areas[i].action.args, action_token);
      if (return_action.status === "success")
        reactions[areas[i].reaction._id.toString()](areas[i].reaction.args, reaction_token);
    }
  }
};

const job = new cronJob('*/5 * * * * *', ExecuteAreas, null, true, 'Europe/Paris');

module.exports = {getServiceActionToken, getServiceReactionToken, job};