const md = markdownit({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: function (str, _) {
        return '<pre class="code-snippet"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
    },
})

class Notedown {
    activeNoteDetails = {
        uuid: null,
        title: null,
    }

    constructor(editorSpace, renderSpace, notesListId) {
        this.editorSpace = editorSpace
        this.renderSpace = renderSpace
        this.notesListId = notesListId

        this.displayNotesList()
        this.displayActiveNote()

        this.listenerMarkdownToHTMLRender()
        this.listenerNewNote()
        this.listenerListItems()
        this.listenerEditTitle()
        this.listenerDeleteNote()
    }

    unsetEditor() {
        this.editorSpace.value = ""
        this.renderSpace.innerHTML = ""
    }

    unsetActiveNote() {
        this.activeNoteDetails.uuid = null
        this.activeNoteDetails.title = null
    }

    notesListItem(uuid, title, timestamp, isActive = false) {
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

    displayNotesList() {
        const notesList = window.api.listNotes()
        const notesListElem = $(`#${this.notesListId}`)
        notesListElem.empty()
        notesList.forEach((note, index) => {
            if (this.activeNoteDetails.uuid) {
                if (this.activeNoteDetails.uuid === note.note_id) {
                    notesListElem.append(this.notesListItem(note.note_id, note.title, note.updated_at, true))
                    return
                }
            } else if (index === 0) {
                notesListElem.append(this.notesListItem(note.note_id, note.title, note.updated_at, true))
                this.activeNoteDetails.uuid = note.note_id
                this.activeNoteDetails.title = note.title
                return
            }
            notesListElem.append(this.notesListItem(note.note_id, note.title, note.updated_at))
        })
    }

    displayActiveNote() {
        if (this.activeNoteDetails.uuid) {
            const note = window.api.getNote(this.activeNoteDetails.uuid)
            this.editorSpace.value = note.note
            this.renderSpace.innerHTML = DOMPurify.sanitize(md.render(note.note))
        }
    }

    listenerMarkdownToHTMLRender() {
        this.editorSpace.addEventListener('input', () => {
            this.renderSpace.innerHTML = DOMPurify.sanitize(md.render(this.editorSpace.value))
            const curTime = new Date()
            window.api.storeNote(
                this.activeNoteDetails.title,
                this.activeNoteDetails.uuid,
                curTime.getTime(),
                this.editorSpace.value
            )
        })
    }

    listenerNewNote() {
        const newNoteForm = document.getElementById("create-note-form")
        const newNoteModal = document.getElementById("newNoteModal")
        const newNoteModalBootstrap = new bootstrap.Modal(newNoteModal)
        const noteTitleId = "note-title"

        newNoteForm?.addEventListener("submit", (e) => {
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

            this.unsetEditor()
            this.unsetActiveNote()

            const curTime = new Date()
            const uuid = crypto.randomUUID()
            window.api.storeNote(noteTitle, uuid, curTime.getTime(), "")
            this.displayNotesList()
            this.listenerListItems()
        })
    }

    listenerEditTitle() {
        const editNoteTitleForm = document.getElementById("edit-note-title-form")
        const editNoteTitleModal = document.getElementById("editNoteTitleModal")
        const editNoteTitleModalBootstrap = new bootstrap.Modal(editNoteTitleModal)
        const noteTitleId = "edit-note-title"

        editNoteTitleForm?.addEventListener("submit", (e) => {
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

            if (this.activeNoteDetails.title !== noteTitle) {
                window.api.editTitle(this.activeNoteDetails.uuid, noteTitle)
                this.displayNotesList()
                this.listenerListItems()
            }
        })
    }

    listenerDeleteNote() {
        const delteNoteForm = document.getElementById("delete-note-form")
        const deleteNoteModal = document.getElementById("deleteNoteModal")
        const deleteNoteModalBootstrap = new bootstrap.Modal(deleteNoteModal)

        delteNoteForm?.addEventListener("submit", (e) => {
            window.api.deleteNote(this.activeNoteDetails.uuid)
            if (this.activeNoteDetails.uuid) {
                this.unsetActiveNote()
                this.unsetEditor()
            }
            this.displayNotesList()
            this.displayActiveNote()
            this.listenerListItems()
            deleteNoteModalBootstrap.hide()
        })
    }

    listenerListItems() {
        const listElements = document.querySelectorAll('[id$="-list-item"]')

        listElements.forEach((element) => {
            element.addEventListener("click", () => {
                const listItemId = element.getAttribute("id")
                console.log(`clicked: ${listItemId}`);
                this.switchActiveNote(listItemId)
            })
        })
    }

    switchActiveNote(listItemId) {
        const uuidRegex = /(.*)-list-item/
        const uuid = listItemId.match(uuidRegex)[1]
        const title = document.getElementById(`${uuid}-list-title`)?.innerText

        this.activeNoteDetails.uuid = uuid
        this.activeNoteDetails.title = title
        this.displayNotesList()
        this.displayActiveNote()
        this.listenerListItems()
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const editorSpace = document.getElementById("editor-space")
    const renderSpace = document.getElementById("render-space")
    const notesListId = "notes-list"

    const notedown = new Notedown(editorSpace, renderSpace, notesListId)
})
