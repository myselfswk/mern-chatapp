const router = require('express').Router();

const { userRegister, authUser, allUsers, updateUser } = require('../controllers/userControllers');
const { protect } = require('../middlewares/authMiddleware');

// Register User Route
router.post('/', userRegister);

// Login User Route
router.post('/login', authUser);

// Get All User Route
// you can also write route.get as
// router.route('/').get(), we can use multiple methods with router.route like router.route('/').post().get()
router.get('/', protect, allUsers);

// Update User By ID Route
router.put('/:id', updateUser);

module.exports = router;