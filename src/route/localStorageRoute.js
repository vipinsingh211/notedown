const { Router } = require('express');
const { body, param } = require('express-validator');
const { validate, version } = require('uuid');

const {
	writeNewNote,
	getAllNotesList,
	getNoteByID,
	updateNote,
} = require('../controller/localStorageController');

const validIdFormat = async (id) => {
	if (validate(id) && version(id) === 4) return true;
	return Promise.reject('Invalid "id"');
};

const router = new Router();
const MAX_TITLE_LEN = 500;
const MAX_NOTE_LEN = 50000;
router.post(
	'/note',
	body('title').isLength({ max: MAX_TITLE_LEN }),
	body('note').isLength({ max: MAX_NOTE_LEN }),
	writeNewNote
);

router.get('/note/:id', param('id').custom(validIdFormat), getNoteByID);

router.get('/note', getAllNotesList);

router.put(
	'/note',
	body('id').custom(validIdFormat),
	body('title').isLength({ max: MAX_TITLE_LEN }),
	body('note').isLength({ max: MAX_NOTE_LEN }),
	updateNote
);

// router.put('/note/changelog', toggleChangelog);

// router.delete('/note/:id/trash', trashNote);

// router.delete('/note/:id/archive', archiveNote);

// router.delete('/note/:id/delete', deleteNote);

exports.localStorage = router;
