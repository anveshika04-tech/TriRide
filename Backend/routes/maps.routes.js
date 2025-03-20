const express = require('express');
const router = express.Router();
const mapsController = require('../controllers/maps.controller');
// Remove the optional authentication since we'll make these endpoints public
const { authenticateUser } = require('../middlewares/auth.middleware');

// Make these endpoints completely public without any authentication
router.get('/get-coordinates', mapsController.getCoordinates);
router.get('/get-distance-time', mapsController.getDistanceTime);
router.get('/get-suggestions', mapsController.getSuggestions);

module.exports = router;