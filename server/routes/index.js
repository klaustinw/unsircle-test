const router = require('express').Router();
const Controller = require('../controllers');

router.get('/users', Controller.get_users);
router.post('/users', Controller.add_user);
router.delete('/users', Controller.del_user);
router.get('/policies', Controller.get_policies);
router.post('/login', Controller.login);

module.exports = router;