const {ImListeningASong, ChangeSong, AddSongToPlaylist} = require('../services/Spotify');
const Areas = require ('../model/Areas');
const Users = require('../model/Users');
const my_actions = require('../model/Actions');
const my_reactions = require('../model/Reactions');
const Services = require('../model/Services');

const test = (caca) => {
  console.log(caca)
}

const actions = {
  "636ba1c921531a915d2085d0": ImListeningASong,
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
      return (user.services[i]._token);
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
      return (user.services[i]._token);
    }
  }
  return (null);
}

const ExecuteAreas = async () => {
  const areas = await Areas.find();
  // for (let i = 0; i < areas.length; i++) {
    const action_token = getServiceActionToken(areas[1]._id);
    const reaction_token = getServiceReactionToken(areas[1]._id);
    console.log(areas[1].action._id.toString())
    console.log(areas[1].reaction._id.toString())
    actions[areas[1].action._id.toString()](areas[1].action.args, action_token);
    reactions[areas[1].reaction._id.toString()](areas[1].reaction.args, reaction_token);
  // }
};

module.exports = {getServiceActionToken, getServiceReactionToken, ExecuteAreas};