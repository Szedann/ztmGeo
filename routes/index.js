const express = require('express');
const router = express.Router();
const { catchAsync } = require('../utils');
const btoa = require('btoa')
const fetch = require('node-fetch')

const applicationsController = require('../controllers/applicationsController');
const umController = require('../controllers/umController');

router.get('/', (req, res) => res.render('index'));

router.get('/geo', umController.busesGeo)

router.get('/busDetails', umController.getBusDetails)

router.get('/busPicture', umController.getBusPhoto)

module.exports = router;