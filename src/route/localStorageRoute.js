const { Router } = require('express');
const { body } = require('express-validator');

const { writeNewNote, getAllNotesList } = require('../controller/localStorageController');

const router = new Router();

router.post('/note',
    body('title').isLength({ max: 500 }),
    body('note').isLength({ max: 50000 }),
    writeNewNote);

// router.get('/note/:id', getNoteByID);

router.get('/note/list', getAllNotesList);

// router.put('/note/:id', updateNote);

// router.delete('/note/:id/trash', trashNote);

// router.delete('/note/:id/archive', archiveNote);

// router.delete('/note/:id/delete', deleteNote);

exports.localStorage = router;