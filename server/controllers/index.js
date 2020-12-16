const { user: User, policy: Policy } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function decode_jwt(access_token) {
  const profile = jwt.verify(access_token, process.env.SECRET);
  return profile;
}

module.exports = class Controller {
  static async get_policies(_, res) {
    try {
      const policies = await Policy.findAll();

      res.status(200).json(policies);      
    } catch (error) {
      res.status(500).json({
        error: "Unable to get users"
      });

     console.log(error); 
    }
  }

  static async get_users(_, res) {
    try {
      const users = await User.findAll();

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        error: "Unable to get users"
      });

      console.log(error);
    }
  }

  static async add_user(req, res) {
    try {
      const { id } = decode_jwt(req.headers.access_token);
      const current_user = await User.findOne({
        where: {
          id
        },
        include: [Policy]
      });
      const privilege = current_user.dataValues.policy;

      if (privilege.add_permit) {
        const user_already_exist = await User.findOne({
          where: {
            username: req.body.username
          }
        });

        if (user_already_exist) {
          res.status(409).json({ error: 'User with that username exist' });
        } else {
          await User.create({
            username: req.body.username,
            password: req.body.password,
            privilege: req.body.privilege
          });

          res.status(201).json({ msg: "OK" });
        }
      } else {
        res.status(403).json({ error: "Access denied" });
      }
    } catch (error) {
      res.status(500).json({
        error: "Unable to add user"
      });

      console.log(error);
    }
  }

  static async del_user(req, res) {
    try {
      const { id } = decode_jwt(req.headers.access_token);
      const current_user = await User.findOne({
        where: {
          id
        },
        include: [Policy]
      });
      const privilege = current_user.dataValues.policy;
  
      if (privilege.del_permit) {
        await User.destroy({
          where: {
            id: +req.params.id
          }
        });
  
        res.status(200).json({ msg: "OK" });
      } else {
        res.status(403).json({ error: "Access denied" });
      }
    } catch (error) {
      res.status(500).json({
        error: "Unable to add user"
      });
      
      console.log(error);
    }
  }

  static async login(req, res) {
    try {
      const user = await User.findOne({
        where: {
          username: req.body.username
        }
      });

      if (user) {
        const password_check = await bcrypt.compare(req.body.password, user.password);

        if (password_check) {
          const token = jwt.sign({
            id: user.id
          }, process.env.SECRET);

          res.status(200).json({ access_token: token });
        } else {
          res.status(401).json({ msg: 'Wrong username/password' });
        }
      } else {
        res.status(401).json({ msg: 'Wrong username/password' });
      }
    } catch (error) {
      res.status(500).json({
        error: "Unable to proceed"
      });

      console.log(error);
    }
  }
}