const express = require('express');
// const multer=require('multer')
const userController = require('./../controllers/userController');
const authController=require('./../controllers/authController')

// const upload=multer({dest:'public/img/users'})

const router = express.Router();

router.post('/signup',authController.signup)
router.post('/login',authController.login)
router.get('/logout',authController.logout)
router.use(authController.protect)
router.post('/forgotPassword',authController.forgotPassword)
router.patch('/resetPassword/:token',authController.resetPassword)



router.patch('/updateMyPassword',
  authController.updatePassword
)


router.get('/me',userController.getMe,userController.getUser)
router.patch('/updateMe',userController.updateMe)
router.delete('/deleteMe',userController.deleteMe)

router.use(authController.restrictTo('admin'))


router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);



module.exports = router;








