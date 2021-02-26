const express = require('express');

const router = express.Router();
const { verifyAccessToken } = require('../modules/utils/jwt');
const GeneralController = require('../modules/controllers/generalController');
const ProfileController = require('../modules/controllers/profileController');

router.get('/users', GeneralController.getUsers)
router.get('/user', verifyAccessToken, GeneralController.getUser)

router.get('/profile', verifyAccessToken, ProfileController.getProfile)
router.post('/profile/upload/picture', verifyAccessToken, ProfileController.uploadUserPicture)
router.post('/profile/setOnline', verifyAccessToken, ProfileController.setOnline)

module.exports = router
