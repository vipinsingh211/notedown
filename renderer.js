let activeNoteId = ""

document.addEventListener('DOMContentLoaded', async () => {
    const editorSpace = document.getElementById("editor-space")
    const renderSpace = document.getElementById("render-space")

    markdownToHTMLRender(editorSpace, renderSpace)
    newNote(editorSpace, renderSpace)
});

function markdownToHTMLRender(editorSpace, renderSpace) {
    editorSpace.addEventListener('input', function () {
        const md = markdownit({
            html: true,
            linkify: true,
            typographer: true,
            breaks: true,
            highlight: function (str, _) {
                return '<pre class="code-snippet"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
            },
        });
        renderSpace.innerHTML = DOMPurify.sanitize(md.render(this.value))
    });
}

function newNote(editorSpace, renderSpace) {
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

        const curTime = new Date();
        const uuid = crypto.randomUUID()
        $("#notes-list").prepend(`
        <a href="#" class="list-group-item list-group-item-action active" id="${uuid}-list">
            <b id="${uuid}-list-title">${noteTitle}</b><br>
            <i class="note-timestamp" id="${uuid}-list-timestamp">
            ${curTime.toDateString()}
            ${curTime.getHours().toString().padStart(2, "0")}:${curTime.getMinutes().toString().padStart(2, "0")}
            </i>
        </a>
        `)
        editorSpace.value = ""
        renderSpace.innerHTML = ""
        activeNoteId = uuid
        window.api.storeNote(noteTitle, uuid, curTime.getTime(), "")
    })
}
