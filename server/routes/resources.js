import express from 'express';
import { getResources, getNearbyCenters, updateResourceStatus } from '../controllers/resourceController.js';
import { auth, authorize } from './alerts.js';

const router = express.Router();

router.get('/',        getResources);
router.get('/nearby',  getNearbyCenters);           // ?lat=&lng=&radius=&type=
router.patch('/:id',   auth, authorize(['admin', 'responder']), updateResourceStatus);

export default router;
