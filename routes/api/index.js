const router = require('express').Router();
const userroutes = require('./user-routes.js');
const thoughtroutes = require('./thought-routes.js');

router.use('/users', userroutes);
router.use('/thoughts', thoughtroutes);

module.exports = router;