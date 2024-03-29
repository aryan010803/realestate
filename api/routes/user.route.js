import { deleteUser, getUser, getUserListing, test, updateUserInfo } from '../controller/user.controller.js';
import express, { Router } from 'express';
import { verifyToken } from '../utils/verifyUser.js';


const router  = express.Router();
router.get('/test',test)
router.post('/update/:id' , verifyToken ,updateUserInfo);
router.delete('/delete/:id' , verifyToken ,deleteUser);
router.get('/listing/:id',verifyToken,getUserListing);
router.get('/:id',verifyToken,getUser);
export default router