const express = require('express');
const { createAlerts } = require('../controllers/alertsController');

const router = express.Router();

//POST /alerts: create alerts for a specific type
// router.get('/alerts', getAlerts);
router.post('/alerts', createAlerts);

// router.post('/alerts/search', searchAlerts);


module.exports = router;