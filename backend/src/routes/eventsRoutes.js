const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getTicketTypes,
  addTicketType
} = require('../controllers/eventsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);
router.get('/:id/ticket-types', getTicketTypes);

// Protected routes (admin only)
router.post('/', protect, adminOnly, createEvent);
router.put('/:id', protect, adminOnly, updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);
router.post('/:id/ticket-types', protect, adminOnly, addTicketType);

module.exports = router; 
