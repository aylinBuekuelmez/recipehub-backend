const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/profile', authMiddleware.verifyToken, (req, res) => {
    res.status(200);
    res.send(req.user);
});
router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    userController.getAllUsers
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    userController.deleteUser
);
module.exports = router;