const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name:           { type: String, required: true},
    members:        { type: [String], required: true},
    genre:          { type: String, required: true},
    costToPerform:  { type: Number, required: true},
    originCity:     String,
    activeSince:    Date,
    website:        String,
    albumsReleased:{ type: Number, default: 0 }
},      { timestamp: true });

module.exports = mongoose.model('Group', GroupSchema);