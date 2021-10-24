import { LocalStorageService } from '../service/localStorageService'
import { validationResult } from 'express-validator'


export class LocalStorageController {
	
	constructor() {
		this.local_storage = new LocalStorageService();
	}

	writeNewNote = (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const title = req.body.title;
		const note = req.body.note;

		this.local_storage
			.insertNote(title, note)
			.then((response) => {
				console.log(response);
				return res.status(200).json({ message: 'saved' });
			})
			.catch((error) => {
				console.error(error);
				return res.status(500).json({ message: 'try again' });
			});
	}

	getAllNotesList = (req, res) => {
		this.local_storage
			.notesList()
			.then((response) => {
				return res.status(200).json({ message: response });
			})
			.catch((error) => {
				console.error(error);
				return res.status(500).json({ message: 'try again' });
			});
	}

	getNoteByID = (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const id = req.params.id;

		this.local_storage
			.noteById(id)
			.then((response) => {
				if (response.length === 0)
					return res.status(404).json({ message: 'not found' });
				return res.status(200).json({ message: response });
			})
			.catch((error) => {
				console.error(error);
				return res.status(500).json({ message: 'try again' });
			});
	}

	updateNote = (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const id = req.body.id;
		const title = req.body.title;
		const note = req.body.note;

		this.local_storage
			.updateNote(id, title, note)
			.then((response) => {
				console.log(response);
				return res.status(200).json({ message: 'saved' });
			})
			.catch((error) => {
				console.error(error);
				return res.status(500).json({ message: 'try again' });
			});
	}

	deleteNote = (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
	}
}
