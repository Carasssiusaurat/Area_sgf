const {ImListeningASong, ChangeSong, AddSongToPlaylist} = require('../services/Spotify');
const Areas = require ('../model/Areas');
const Users = require('../model/Users');
const my_actions = require('../model/Actions');
const my_reactions = require('../model/Reactions');
const Services = require('../model/Services');

const actions = [
  {"636ba1c921531a915d2085d0": ImListeningASong},
];
  
const reactions = [
  {"636ba32f21531a915d2085d4": ChangeSong},
  {"636ba45eec84f1ac23b7b424": AddSongToPlaylist}
];

const getServiceActionToken = async (req, res) => {
  const area = await Areas.findOne({_id: req.params.id});
  const user = await Users.findOne({_id: area.user_id});
  const service = await Services.findOne({action_id: {$in: area.action._id}})
  for (let i = 0; i < user.services.length; i++) {
    if (user.services[i]._id.toString() == service._id.toString()) {
      return res.json(user.services[i]._token);
    }
  }
  return res.json("no token found");
}

const getServiceReactionToken = async (req, res) => {
  const area = await Areas.findOne({_id: req.params.id});
  const user = await Users.findOne({_id: area.user_id});
  const service = await Services.findOne({reaction_id: {$in: area.reaction._id}})
  for (let i = 0; i < user.services.length; i++) {
    if (user.services[i]._id.toString() == service._id.toString()) {
      return res.json(user.services[i]._token);
    }
  }
  return res.json("no token found");
}

const ExecuteAreas = async () => {
  const areas = await Areas.find();

  for (var i = 0; i != areas.length; i++) {
    // recup services id dans ta table d'actions avec l'action._id de l'area et comp avec services._service_id de la table de user avec user_id de l'area
  }
};

module.exports = {getServiceActionToken, getServiceReactionToken};