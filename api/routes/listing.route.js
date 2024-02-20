import express, { Router } from 'express';
import { verifyToken } from "../utils/verifyUser.js";
import { createListing, deleteLisiting, updateListing } from "../controller/listing.controller.js";
const router = express.Router();

router.post('/create',verifyToken,createListing);
export default router;
router.delete('/delete/:id' , verifyToken ,deleteLisiting )
router.post('/update/:id' , verifyToken ,updateListing);