const express = require('express');

const router = express.Router();
const { verifyAccessToken } = require('../modules/utils/jwt');
const GeneralController = require('../modules/controllers/generalController');
const ProfileController = require('../modules/controllers/profileController');
const ForumController = require('../modules/controllers/forumController');
const UploadsController = require('../modules/controllers/uploadsController');

router.get('/search', GeneralController.search)
router.get('/stats', GeneralController.getStats)
router.get('/users', GeneralController.getUsers)
router.get('/admins', GeneralController.getAdmins)
router.get('/user', verifyAccessToken, GeneralController.getUser)
router.get('/bans', GeneralController.getBans)
router.get('/ban', GeneralController.getBan)
router.post('/ban/create', verifyAccessToken, GeneralController.createBan)
router.delete('/ban/delete', verifyAccessToken, GeneralController.unBan)

router.get('/reports', verifyAccessToken, GeneralController.getReports)
router.post('/report/create', verifyAccessToken, GeneralController.createReport)
router.delete('/reports/delete', verifyAccessToken, GeneralController.deleteReports)

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

router.get('/folders', UploadsController.getFolders)
router.get('/folder', UploadsController.getFolder)
router.post('/folder/create', verifyAccessToken, UploadsController.createFolder)
router.delete('/folder/delete', verifyAccessToken, UploadsController.deleteFolder)
router.put('/folder/edit', verifyAccessToken, UploadsController.editFolder)

router.get('/files/all/admin', verifyAccessToken, UploadsController.getAdminAllFiles)
router.get('/files/all', UploadsController.getAllFiles)
router.get('/files', UploadsController.getFiles)
router.get('/file', UploadsController.getFile)
router.post('/file/create', verifyAccessToken, UploadsController.createFile)
router.delete('/file/delete', verifyAccessToken, UploadsController.deleteFile)
router.put('/file/edit', verifyAccessToken, UploadsController.editFile)
router.put('/file/like', verifyAccessToken, UploadsController.likeFile)
router.put('/file/moderate', verifyAccessToken, UploadsController.moderateFile)
router.put('/file/download', UploadsController.download)

router.get('/file/comments', UploadsController.getComments)
router.post('/file/comment/create', verifyAccessToken, UploadsController.createComment)
router.delete('/file/comment/delete', verifyAccessToken, UploadsController.deleteComment)
router.put('/file/comment/like', verifyAccessToken, UploadsController.likeComment)

module.exports = router
