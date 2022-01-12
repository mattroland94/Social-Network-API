const router = require('express').Router();
const userroutes = require('./user-routes');
const thoughtroutes = require('./thought-routes');

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;