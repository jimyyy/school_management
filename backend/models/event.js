const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title: String,
    date: String,
    datefin: String
});

const event = mongoose.model('Event', eventSchema);

module.exports = event;