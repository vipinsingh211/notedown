const { LocalStorageService } = require("../service/localStorageService");

exports.writeNewNote = (req, res) => {
    const note = req.body.note;
    const local_storage = new LocalStorageService();

    local_storage.insertNote(note)
        .then((response) => {
            console.log(response);
            return res.status(200).json({message: 'saved'});
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({message: 'try again'});
        });
};

exports.getAllNotesList = (req, res) => {
    const local_storage =  new LocalStorageService();

    local_storage.notesList()
        .then((response) => {
            console.log(response);
            return res.status(200).json({message: response});
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({message: 'try again'});
        })
};