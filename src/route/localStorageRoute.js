import Router from 'express'
import { body, param } from 'express-validator'
import { validate, version } from 'uuid'

import { LocalStorageController } from '../controller/localStorageController'

const validIdFormat = async (id) => {
	if (validate(id) && version(id) === 4) return true;
	return Promise.reject('Invalid "id"');
};

const MAX_TITLE_LEN = 500;
const MAX_NOTE_LEN = 50000;

const localStorageController = new LocalStorageController();

let router = new Router();
router.post(
	'/note',
	body('title').isLength({ max: MAX_TITLE_LEN }),
	body('note').isLength({ max: MAX_NOTE_LEN }),
	localStorageController.writeNewNote
);

router.get(
	'/note/:id',
	param('id').custom(validIdFormat),
	localStorageController.getNoteByID
);

router.get('/note', localStorageController.getAllNotesList);

router.put(
	'/note',
	body('id').custom(validIdFormat),
	body('title').isLength({ max: MAX_TITLE_LEN }),
	body('note').isLength({ max: MAX_NOTE_LEN }),
	localStorageController.updateNote
);

router.delete(
	'/note/:id',
	param('id').custom(validIdFormat),
	localStorageController.deleteNote
);

export const local_storage_router = router;