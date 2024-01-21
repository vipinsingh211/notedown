document.addEventListener('DOMContentLoaded', async () => {
    markdownToHTMLRender();
});

function markdownToHTMLRender() {
    const editorSpace = document.getElementById("editor-space")
    const renderSpace = document.getElementById("render-space")

    editorSpace.addEventListener('input', function () {
        const md = markdownit({
            html: true,
            linkify: true,
            typographer: true,
            breaks: true,
            highlight: function (str, _) {
                return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>'
            },
        });
        renderSpace.innerHTML = DOMPurify.sanitize(md.render(this.value))
    });
}
