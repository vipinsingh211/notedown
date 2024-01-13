document.addEventListener('DOMContentLoaded', () => {
    const editorSpace = document.getElementById("editor-space");
    const renderSpace = document.getElementById("render-space");

    editorSpace.addEventListener('input', function () {
        renderSpace.innerHTML = DOMPurify.sanitize(marked.parse(this.value));
    });
});