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

        const curTime = new Date()
        const uuid = crypto.randomUUID()
        editorSpace.value = ""
        renderSpace.innerHTML = ""
        window.api.storeNote(noteTitle, uuid, curTime.getTime(), "")
        displayNotesList()
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
            <span>
            <button class="btn btn-sm" id="${uuid}-edit">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                </svg>
            </button>
            <button class="btn btn-sm" id="${uuid}-delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                </svg>
            </button>
            </span>
        </div>
        <small id="${uuid}-list-timestamp">${d.toDateString()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}</small>
    </a>`
}
