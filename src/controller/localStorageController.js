const { LocalStorageService } = require('../service/localStorageService');
const { validationResult } = require('express-validator');

exports.writeNewNote = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

    const title = req.body.title;
	const note = req.body.note;
	const local_storage = new LocalStorageService();

	local_storage
		.insertNote(title, note)
		.then((response) => {
			console.log(response);
			return res.status(200).json({ message: 'saved' });
		})
		.catch((error) => {
			console.error(error);
			return res.status(500).json({ message: 'try again' });
		});
};

exports.getAllNotesList = (req, res) => {
	const local_storage = new LocalStorageService();

	local_storage
		.notesList()
		.then((response) => {
			console.log(response);
			return res.status(200).json({ message: response });
		})
		.catch((error) => {
			console.error(error);
			return res.status(500).json({ message: 'try again' });
		});
};

exports.getNoteByID = (req, res) => {
    const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const id = req.params.id;
	const local_storage = new LocalStorageService();

	local_storage
		.noteById(id)
		.then((response) => {
			console.log(response);
			if (response.length === 0)
				return res.status(404).json({ message: 'not found' });
			return res.status(200).json({ message: response });
		})
		.catch((error) => {
			console.error(error);
			return res.status(500).json({ message: 'try again' });
		});
};
