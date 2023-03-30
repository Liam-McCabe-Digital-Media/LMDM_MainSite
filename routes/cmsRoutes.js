const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');

router.get('/:id/dashboard', catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('users/dashboard', {user});
}));

module.exports = router;