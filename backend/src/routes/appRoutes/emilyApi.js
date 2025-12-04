const express = require('express');
const router = express.Router();
const emilyController = require('@/controllers/emilyController');
const { catchErrors } = require('@/handlers/errorHandlers');

router.route('/emily/chat').post(catchErrors(emilyController.chat));
router.route('/emily/upload').post(catchErrors(emilyController.upload));

module.exports = router;
