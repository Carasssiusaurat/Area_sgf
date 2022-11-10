const Users = require("../model/Users");
const Services = require("../model/Services");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const newuser = (req, res) => {
  Users.findOne({ username: req.body.username }, (err, data) => {
    if (!data) {
      if (req.body.username == null || req.body.password == null)
        return res.status(500).json({ message: "internal server error" });
      bcrypt.hash(req.body.password, 10, function (err, crypted) {
        const new_user = new Users({
          username: req.body.username,
          password: crypted,
          service: [],
          role: req.body.username == "admin" ? "admin" : "user",
        });
        new_user.save((err, data) => {
          if (err) return res.json({ Error: err });
          return res.json(data);
        });
      });
    } else {
      if (err) return res.json(`Something went wrong, please try again.${err}`);
      return res.json({ message: "user already exists" });
    }
  });
};

const getusers = (req, res) => {
  Users.find({}, (err, data) => {
    if (err) return res.json({ Error: err });
    return res.json(data);
  });
};

const getuser = (req, res) => {
  Users.findOne({ _id: req.params.id }, (err, data) => {
    if (err) return res.json({ Error: err });
    if (!data) return res.json({ message: "User doesn't exist !" });
    return res.json(data);
  });
};

const getservices = async (req, res) => {
  if (!req.params.id)
    return res.status(400).send("missing field : cannot get user area");
  const user_to_get = await Users.findById(req.params.id);
  if (!user_to_get) return res.status(404).json({ Error: "User not found" });
  const services = await Services.find({
    _id: { $in: user_to_get.services.map((service) => service._id) },
  });
  return res.status(200).json(services);
};

const moduser = async (req, res) => {
  try {
    const user_to_update = await Users.findOne({ _id: req.params.id });
    user_to_update.username = req.body.username;
    user_to_update.save();
    return res.status(200).json({ message: "User updated" });
  } catch (err) {
    console.log("moduser", err);
    return res.status(500).json({ error: "internal error" });
  }
};

const delAlluser = (req, res) => {
  Users.deleteMany({}, (err) => {
    if (err) return res.json({ message: "Complete delete failed" });
    return res.json({ message: "Complete delete successful" });
  });
};

const delOneuser = (req, res) => {
  Users.deleteOne({ _id: req.params.id }, (err, data) => {
    if (data.deleteCount == 0)
      return res.json({ message: "User doesn't exist !" });
    else if (err) return res.json({ message: "something went wrong !" });
    return res.json(data);
  });
};

const login = asyncHandler(async (req, res) => {
  Users.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "username doesnt exist" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: "password incorrect" });
          }
          res
            .status(200)
            .json({ userId: user._id, token: generateToken(user._id) });
        })
        .catch((err) => res.status(500).json({ err }));
    })
    .catch((err) => res.status(500).json({ err }));
});

const addservice = async (req, res) => {
  if (!req.params.id)
    return res.status(400).send("missing field : cannot get service reactions");
  const user_to_update = await Users.findOne({ _id: req.params.id });
  const service_to_add = await Services.findOne({ name: req.body.name });
  if (!user_to_update || !service_to_add)
    return res.status(404).json({ Error: "not found" });
  try {
    if (
      user_to_update.services.filter(
        (service) => service.id === service_to_add._id.toString()
      ).length > 0
    )
      return res.status(200).json({ message: "Service already used" });
    console.log(service_to_add._id);
    user_to_update.services.push({
      _id: service_to_add._id,
      actif: true,
      _token: "TOKEN",
    });
    user_to_update.save();
    return res.status(200).json({ message: "Service added" });
  } catch (err) {
    console.log("addservice", err);
    return res.status(500).json({ error: "internal error" });
  }
};

const addservice_copy = async (usr_id, service_id, token) => {
  var response = "";
  const user_to_update = await Users.findOne({ _id: usr_id });
  const service_to_add = await Services.findOne({ _id: service_id });
  if (!user_to_update) return { status: 404, message: "User not found" };
  if (!service_to_add) return { status: 404, message: "Service not found" };
  try {
    if (
      user_to_update.services.filter(
        (service) => service.id === service_to_add._id.toString()
      ).length > 0
    ) {
      response = { status: 300, message: "Service already used" };
      return response;
    }
    user_to_update.services.push({
      _id: service_to_add._id,
      actif: true,
      token: token,
    });
    user_to_update.save();
    response = { status: 200, message: "Service added" };
  } catch (err) {
    console.log("addservice", err);
    response = { status: 500, message: "Internal error" };
  }
  return response;
};

//nique sa mere ca crash ici
// const modservice = (req, res) => {
//     Users.findOne({_id: req.params.uid}, (err, data) => {
//         if (err)
//             return res.json({Error: err});
//         if (!data)
//             return res.json({message: "User doesn't exist !"});
//         data.service[req.params.sid].actif = req.body.actif;
//         data.save()
//         return res.json(data);
//     });
// }

const delOneservice = async (req, res) => {
  const user_to_update = await Users.findOne({ _id: req.params.uid });
  if (!user_to_update) return res.status(404).json({ Error: "not found" });
  try {
    user_to_update.services = user_to_update.services.filter(
      (service) => service.id !== req.params.sid
    );
    user_to_update.save();
    return res.status(200).json({ message: "Service deleted" });
  } catch (err) {
    console.log("delOneservice", err);
    return res.status(500).json({ error: "internal error" });
  }
};

const delAllservice = async (req, res) => {
  try {
    const user_to_update = await Users.findOne({ _id: req.params.uid });
    user_to_update.services = [];
    user_to_update.save();
    return res.status(200).json({ message: "User updated" });
  } catch (err) {
    console.log("delAllservice", err);
  }
};

const updatestate = async (req, res) => {
  if (!req.params.uid || !req.params.sid)
    return res.status(400).send("missing fields");
  const user_to_update = await Users.findOne({ _id: req.params.uid });
  try {
    if (
      user_to_update.services.filter((service) => service._id == req.params.sid)
    ) {
      console.log();
      user_to_update.services.filter(
        (service) => service._id == req.params.sid
      )[0].actif = !user_to_update.services.filter(
        (service) => service._id == req.params.sid
      )[0].actif;
      user_to_update.save();
      return res.status(200).json({ message: "User updated" });
    }
    return res.status(404).json({ message: "Service not found" });
  } catch (err) {
    return res.status(500).json({ error: "internal error" });
  }
};

module.exports = {
  newuser,
  getuser,
  getusers,
  moduser,
  delAlluser,
  delOneuser,
  addservice,
  delOneservice,
  delAllservice,
  login,
  updatestate,
  addservice_copy,
  getservices,
};
