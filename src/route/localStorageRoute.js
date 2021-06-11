const { Router } = require('express');
const { body, param } = require('express-validator');
const { validate, version } = require('uuid');

const { writeNewNote, getAllNotesList, getNoteByID } = require('../controller/localStorageController');

const validIdFormat = async (id) => {
    if (validate(id) && version(id) === 4)
        return true;
    return Promise.reject('Invalid "id"');
}

const router = new Router();

router.post('/note',
    body('title').isLength({ max: 500 }),
    body('note').isLength({ max: 50000 }),
    writeNewNote);

router.get('/note/:id',
    param('id').custom(validIdFormat),
    getNoteByID);

router.get('/note', getAllNotesList);

// router.put('/note/:id', updateNote);

// router.put('/note/changelog', toggleChangelog);

// router.delete('/note/:id/trash', trashNote);

// router.delete('/note/:id/archive', archiveNote);

// router.delete('/note/:id/delete', deleteNote);

exports.localStorage = router;