const router = require('express').Router();

const { userRegister, authUser } = require('../controllers/userControllers');

// Register User Route
router.post('/', userRegister);

// Login User Route
router.post('/login', authUser);

module.exports = router;