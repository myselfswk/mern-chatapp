const router = require('express').Router();

const { userRegister, authUser, allUsers, updateUser, getAllUsers } = require('../controllers/userControllers');
const { protect } = require('../middlewares/authMiddleware');

// Register User Route
router.post('/', userRegister);

// Login User Route
router.post('/login', authUser);

// Get All User Route (For Searching User)
// you can also write route.get as
// router.route('/').get(), we can use multiple methods with router.route like router.route('/').post().get()
router.get('/', protect, allUsers);

// Get All Users
router.get('/allusers', protect, getAllUsers);

// Update User By ID Route
router.put('/:id', updateUser);

module.exports = router;