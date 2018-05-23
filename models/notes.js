var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Note schema
var NoteSchema = new Schema ({
	title: {
		type: String
	},
	body: {
		type: String
	}
});

var Note = mongoose.model('Note', NoteSchema);

module.exports = Note;