const express = require('express');
const router = express.Router();

const auth = require('./auth/main.js');
const accountRouter = require('./account/main.js');
const cosmicRouter = require('./cosmic/main.js');
const userRouter = require('./user/main.js');

const profileRouter = require('./user/profile/main.js');

const unitsRouter = require('./units/main.js');
const imgRouter = require('./img/main.js');

const shareRouter = require('./share/main.js');
const inspireRouter = require('./inspire/main.js');
const nounsRouter = require('./nouns/main.js');
const generalRouter = require('./general/main.js');

//routes do not protect by token, to fix this, we would have to tranmit img totally by axios api
router.use('/img', imgRouter)

//veirfy user status
router.use('/', auth)

//only approach after verified
router.use('/cosmic', cosmicRouter)

router.use('/user', userRouter)
router.use('/profile', profileRouter) //prepare to replace part of the "/user"


// shift to "units"
router.use('/units', unitsRouter)

router.use('/account', accountRouter)

router.use('/share', shareRouter)
router.use('/inspire', inspireRouter)
router.use('/nouns', nounsRouter)
router.use('/general', generalRouter)

module.exports = router;
