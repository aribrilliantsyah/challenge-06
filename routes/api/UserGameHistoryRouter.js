const express = require('express');
const router = express.Router()
const UserGameHistoryController = require('../../controllers/api/UserGameHistoryController');
const Middleware = require('../../middleware/Middleware');
const ctl = new UserGameHistoryController();

router.get(`/user-game-history/`, Middleware.verifyJwt, ctl.getAll)
router.get(`/user-game-history/:id`, Middleware.verifyJwt, ctl.findByID)
router.post(`/user-game-history`, Middleware.verifyJwt, ctl.create)
router.put(`/user-game-history/:id`, Middleware.verifyJwt, ctl.update)
router.delete(`/user-game-history/:id`, Middleware.verifyJwt, ctl.delete)

module.exports = router