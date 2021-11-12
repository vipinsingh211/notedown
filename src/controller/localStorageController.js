import {
	insertNote,
	notesList,
	noteById,
	updateNoteById,
	deleteNoteById,
} from '../service/localStorageService';

export const writeNewNote = (req, res) => {
	const title = req.body.title;
	const note = req.body.note;

	insertNote(title, note)
		.then((response) => {
			console.log(response);
			return res.status(200).json({ message: 'saved' });
		})
		.catch((error) => {
			console.error(error);
			return res.status(500).json({ message: 'try again' });
		});
};

export const getAllNotesList = (req, res) => {
	notesList()
		.then((response) => {
			return res.status(200).json({ message: response });
		})
		.catch((error) => {
			console.error(error);
			return res.status(500).json({ message: 'try again' });
		});
};

export const getNoteByID = (req, res) => {
	const id = req.params.id;

	noteById(id)
		.then((response) => {
			if (response.length === 0)
				return res.status(404).json({ message: 'not found' });
			return res.status(200).json({ message: response });
		})
		.catch((error) => {
			console.error(error);
			return res.status(500).json({ message: 'try again' });
		});
};

export const updateNote = (req, res) => {
	const id = req.body.id;
	const title = req.body.title;
	const note = req.body.note;

	updateNoteById(id, title, note)
		.then((response) => {
			console.log(response);
			return res.status(200).json({ message: 'saved' });
		})
		.catch((error) => {
			console.error(error);
			return res.status(500).json({ message: 'try again' });
		});
};

export const deleteNote = (req, res) => {
	const id = req.params.id;

	deleteNoteById(id)
		.then((response) => {
			console.log(response);
			return res.status(200).json({ message: 'deleted' });
		})
		.catch((error) => {
			console.error(error);
			return res.status(500).json({ message: 'try again' });
		});
};
