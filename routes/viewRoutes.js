const express = require('express');
const viewsController = require('../controllers/viewController');
const authController = require('../controllers/authController');



const router = express.Router();

router.use(authController.isLoggedIn)

router.get('/', viewsController.getOverview); 
router.get('/overview', viewsController.getOverview);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/tour/:slug', viewsController.getTour);

module.exports = router;
