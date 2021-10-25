module.exports = class EditorMeta {
    constructor(virtualDom) {
        this.title = virtualDom.head.querySelector("title") || virtualDom.head.appendChild(virtualDom.createElement("title"));

        this.keywords = virtualDom.head.querySelector('meta[name="keywords"]');
        if (!this.keywords) {
            this.keywords = virtualDom.head.appendChild(virtualDom.createElement("meta"));
            this.keywords.setAttribure("name", "keywords");
        }

        this.description = virtualDom.head.querySelector('meta[name="keywords"]');
        if (!this.description) {
            this.description = virtualDom.head.appendChild(virtualDom.createElement("meta"));
            this.description.setAttribure("name", "keywords");
        }
    }

    getMeta() {
        return {
            title: this.title.innerHTML,
            keywords: this.keywords.getAttribute("content"),
            description: this.description.getAttribute("content"),

        }
    }

    setMeta(title, keywords, description) {
        this.title.innerHTML,
        this.keywords.setAttribute("content", keywords);
        this.description.setAttribute("content", description);
    }
}