const activeNoteDetails = {
    uuid: null,
    title: null,
}
const notesListId = "notes-list"

const md = markdownit({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: function (str, _) {
        return '<pre class="code-snippet"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
    },
})

document.addEventListener('DOMContentLoaded', async () => {
    const editorSpace = document.getElementById("editor-space")
    const renderSpace = document.getElementById("render-space")

    listenerMarkdownToHTMLRender(editorSpace, renderSpace)
    listenerNewNote(editorSpace, renderSpace)

    displayNotesList()
    displayActiveNote(editorSpace, renderSpace)

    listenerListItems(editorSpace, renderSpace)
    listenerEditTitle(editorSpace, renderSpace)
    listenerDeleteNote(editorSpace, renderSpace)
})

function displayNotesList() {
    const notesList = window.api.listNotes()
    const notesListElem = $(`#${notesListId}`)
    notesListElem.empty()
    notesList.forEach((note, index) => {
        if (activeNoteDetails.uuid) {
            if (activeNoteDetails.uuid === note.note_id) {
                notesListElem.append(notesListItem(note.note_id, note.title, note.updated_at, true))
                return
            }
        } else if (index === 0) {
            notesListElem.append(notesListItem(note.note_id, note.title, note.updated_at, true))
            activeNoteDetails.uuid = note.note_id
            activeNoteDetails.title = note.title
            activeNoteDetails.timestamp = note.updated_at
            return
        }
        notesListElem.append(notesListItem(note.note_id, note.title, note.updated_at))
    })
}

/**
 * @param {HTMLElement} editorSpace The textarea element
 * @param {HTMLElement} renderSpace The markdown div element
 */
function displayActiveNote(editorSpace, renderSpace) {
    if (activeNoteDetails.uuid) {
        console.log(activeNoteDetails.title);
        const note = window.api.getNote(activeNoteDetails.uuid)
        editorSpace.value = note.note
        renderSpace.innerHTML = DOMPurify.sanitize(md.render(note.note))
    }
}

/**
 * @param {HTMLElement} editorSpace The textarea element
 * @param {HTMLElement} renderSpace The markdown div element
 */
function listenerMarkdownToHTMLRender(editorSpace, renderSpace) {
    editorSpace.addEventListener('input', function () {
        renderSpace.innerHTML = DOMPurify.sanitize(md.render(this.value))
        const curTime = new Date()
        window.api.storeNote(
            activeNoteDetails.title,
            activeNoteDetails.uuid,
            curTime.getTime(),
            this.value
        )
    })
}

/**
 * @param {HTMLElement} editorSpace The textarea element
 * @param {HTMLElement} renderSpace The markdown div element
 */
function listenerNewNote(editorSpace, renderSpace) {
    const newNoteForm = document.getElementById("create-note-form")
    const newNoteModal = document.getElementById("newNoteModal")
    const newNoteModalBootstrap = new bootstrap.Modal(newNoteModal)
    const noteTitleId = "note-title"

    newNoteForm?.addEventListener("submit", function (e) {
        e.preventDefault()
        const formData = new FormData(newNoteForm)
        let noteTitle = ""
        if (formData.has(noteTitleId)) {
            noteTitle = formData.get(noteTitleId)
            formData.set(noteTitleId, "")
            newNoteForm.reset()
        }
        if (noteTitle) {
            newNoteModalBootstrap.hide()
        }

        unsetEditor(editorSpace, renderSpace)
        unsetActiveNote()

        const curTime = new Date()
        const uuid = crypto.randomUUID()
        window.api.storeNote(noteTitle, uuid, curTime.getTime(), "")
        displayNotesList()
        listenerListItems(editorSpace, renderSpace)
    })
}

function unsetEditor(editorSpace, renderSpace) {
    editorSpace.value = ""
    renderSpace.innerHTML = ""
}

function unsetActiveNote() {
    activeNoteDetails.uuid = null
    activeNoteDetails.title = null
}

/**
 * @param {HTMLElement} editorSpace The textarea element
 * @param {HTMLElement} renderSpace The markdown div element
 */
function listenerEditTitle(editorSpace, renderSpace) {
    const editNoteTitleForm = document.getElementById("edit-note-title-form")
    const editNoteTitleModal = document.getElementById("editNoteTitleModal")
    const editNoteTitleModalBootstrap = new bootstrap.Modal(editNoteTitleModal)
    const noteTitleId = "edit-note-title"

    editNoteTitleForm?.addEventListener("submit", function (e) {
        e.preventDefault()
        const formData = new FormData(editNoteTitleForm)
        let noteTitle = ""
        if (formData.has(noteTitleId)) {
            noteTitle = formData.get(noteTitleId)
            formData.set(noteTitleId, "")
            editNoteTitleForm.reset()
        }
        if (noteTitle) {
            editNoteTitleModalBootstrap.hide()
        }

        if (activeNoteDetails.title !== noteTitle) {
            window.api.editTitle(activeNoteDetails.uuid, noteTitle)
            displayNotesList()
            listenerListItems(editorSpace, renderSpace)
        }
    })
}

/**
 * @param {HTMLElement} editorSpace The textarea element
 * @param {HTMLElement} renderSpace The markdown div element
 */
function listenerDeleteNote(editorSpace, renderSpace) {
    const delteNoteForm = document.getElementById("delete-note-form")
    const deleteNoteModal = document.getElementById("deleteNoteModal")
    const deleteNoteModalBootstrap = new bootstrap.Modal(deleteNoteModal)

    delteNoteForm?.addEventListener("submit", function (e) {
        window.api.deleteNote(activeNoteDetails.uuid)
        if (activeNoteDetails.uuid) {
            unsetActiveNote()
            unsetEditor(editorSpace, renderSpace)
        }
        displayNotesList()
        displayActiveNote(editorSpace, renderSpace)
        listenerListItems(editorSpace, renderSpace)
        deleteNoteModalBootstrap.hide()
    })
}

/**
 * @param {HTMLElement} editorSpace The textarea element
 * @param {HTMLElement} renderSpace The markdown div element
 */
function listenerListItems(editorSpace, renderSpace) {
    const listElements = document.querySelectorAll('[id$="-list-item"]')

    listElements.forEach((element) => {
        element.addEventListener("click", function () {
            const listItemId = element.getAttribute("id")
            console.log(`clicked: ${listItemId}`);
            switchActiveNote(listItemId, editorSpace, renderSpace)
        })
    })
}

/**
 * @param {string} listItemId The Id the selected note from the list
 * @param {HTMLElement} editorSpace The textarea element
 * @param {HTMLElement} renderSpace The markdown div element
 */
function switchActiveNote(listItemId, editorSpace, renderSpace) {
    const uuidRegex = /(.*)-list-item/
    const uuid = listItemId.match(uuidRegex)[1]
    const title = document.getElementById(`${uuid}-list-title`)?.innerText

    activeNoteDetails.uuid = uuid
    activeNoteDetails.title = title
    displayNotesList()
    displayActiveNote(editorSpace, renderSpace)
    listenerListItems(editorSpace, renderSpace)
}

/**
 * @param {UUID} uuid The uuid
 * @param {string} title The title
 * @param {EpochTimeStamp} timestamp The timestamp
 * @param {boolean=} isActive is the item active
 * @returns {string} Notes list item as HTML string 
 */
function notesListItem(uuid, title, timestamp, isActive = false) {
    const d = new Date(timestamp)
    let active = ""
    if (isActive) { active = "active" }
    return `
    <a href="#" class="list-group-item list-group-item-action ${active}" id="${uuid}-list-item">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1" id="${uuid}-list-title">${title}</h5>
        </div>
        <small id="${uuid}-list-timestamp">${d.toDateString()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}</small>
    </a>`
}
