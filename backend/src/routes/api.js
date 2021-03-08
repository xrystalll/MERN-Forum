const express = require('express');

const router = express.Router();
const { verifyAccessToken } = require('../modules/utils/jwt');
const GeneralController = require('../modules/controllers/generalController');
const ProfileController = require('../modules/controllers/profileController');
const ForumController = require('../modules/controllers/forumController');

router.get('/stats', GeneralController.getStats)
router.get('/users', GeneralController.getUsers)
router.get('/user', verifyAccessToken, GeneralController.getUser)
router.get('/bans', GeneralController.getBans)
router.get('/ban', GeneralController.getBan)
router.post('/ban/create', verifyAccessToken, GeneralController.createBan)
router.delete('/ban/delete', verifyAccessToken, GeneralController.unBan)

router.get('/profile', verifyAccessToken, ProfileController.getProfile)
router.put('/profile/upload/picture', verifyAccessToken, ProfileController.uploadUserPicture)
router.put('/profile/setOnline', verifyAccessToken, ProfileController.setOnline)

router.get('/notifications', verifyAccessToken, ProfileController.getNotifications)
router.delete('/notifications/delete', verifyAccessToken, ProfileController.deleteNotifications)

router.get('/boards', ForumController.getBoards)
router.get('/board', ForumController.getBoard)
router.post('/board/create', verifyAccessToken, ForumController.createBoard)
router.delete('/board/delete', verifyAccessToken, ForumController.deleteBoard)
router.put('/board/edit', verifyAccessToken, ForumController.editBoard)

router.get('/threads/recently', ForumController.getRecentlyThreads)
router.get('/threads', ForumController.getThreads)
router.get('/thread', ForumController.getThread)
router.post('/thread/create', verifyAccessToken, ForumController.createThread)
router.delete('/thread/delete', verifyAccessToken, ForumController.deleteThread)
router.put('/thread/edit', verifyAccessToken, ForumController.editThread)
router.put('/thread/adminedit', verifyAccessToken, ForumController.adminEditThread)
router.put('/thread/like', verifyAccessToken, ForumController.likeThread)

router.get('/answers', ForumController.getAnswers)
router.post('/answer/create', verifyAccessToken, ForumController.createAnswer)
router.delete('/answer/delete', verifyAccessToken, ForumController.deleteAnswer)
router.put('/answer/edit', verifyAccessToken, ForumController.editAnswer)
router.put('/answer/like', verifyAccessToken, ForumController.likeAnswer)

module.exports = router
