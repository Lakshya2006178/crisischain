import express from 'express';
import { createAlert, getAlerts, updateAlertStatus, getStats } from '../controllers/alertController.js';

const router = express.Router();

router.post('/', createAlert);
router.get('/', getAlerts);
router.patch('/:id/status', updateAlertStatus);
router.get('/stats', getStats);

export default router;
