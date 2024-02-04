import { test } from '../controller/user.controller.js';
import express, { Router } from 'express';

const router  = express.Router();
router.get('/test',test)
export default router