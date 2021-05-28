const express = require('express');
const router = express.Router();
const { catchAsync } = require('../utils');
const btoa = require('btoa')
const fetch = require('node-fetch')

const applicationsController = require('../controllers/applicationsController');
const umController = require('../controllers/umController');

router.get('/', (req, res) => res.render('index'));

router.get('/buses', (req, res)=> res.render('buses'))

router.get('/qr', (req, res)=> res.render('qr'))

router.get('/geo', umController.busesGeo)

router.get('/busDetails', umController.getBusDetails)

router.get('/busPicture', umController.getBusPhoto)

router.get('/qrCode', umController.getQRCode)

module.exports = router;