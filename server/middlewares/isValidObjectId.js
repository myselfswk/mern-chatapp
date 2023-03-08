const mongoose = require('mongoose');

const isValidObjectId = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).send("Invalid ID")
    }
    next();
}

module.exports = {
    isValidObjectId
}