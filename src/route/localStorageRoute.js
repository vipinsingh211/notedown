import Router from 'express';
import { body, param } from 'express-validator';
import { validate, version } from 'uuid';

import {
	writeNewNote,
	getNote,
	updateNote,
	deleteNote,
	getNotes,
} from '../controller/localStorageController';
import { requestValidation } from '../middleware/requestValidationMiddleware';

const validIdFormat = async (id) => {
	if (validate(id) && version(id) === 4) return true;
	return Promise.reject('Invalid "id"');
};

const MAX_TITLE_LEN = 500;
const MAX_NOTE_LEN = 50000;

let router = new Router();
router.post(
	'/note',
	body('title').isLength({ max: MAX_TITLE_LEN }),
	body('note').isLength({ max: MAX_NOTE_LEN }),
	requestValidation,
	writeNewNote
);

router.get(
	'/note/:id',
	param('id').custom(validIdFormat),
	requestValidation,
	getNote
);

router.get('/note', getNotes);

router.put(
	'/note',
	body('id').custom(validIdFormat),
	body('title').isLength({ max: MAX_TITLE_LEN }),
	body('note').isLength({ max: MAX_NOTE_LEN }),
	requestValidation,
	updateNote
);

router.delete(
	'/note/:id',
	param('id').custom(validIdFormat),
	requestValidation,
	deleteNote
);

export const local_storage_router = router;
