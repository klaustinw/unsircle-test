const router = require('express').Router();
const Controller = require('../controllers');

router.get('/users', Controller.get_users);

module.exports = router;