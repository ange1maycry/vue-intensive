const axios = require("axios");

const DOMHelper = require("./dom-helper");

const EditorText = require("./editor-text");
const EditorImage = require("./editor-image");
const EditorMeta = require("./editor-meta");

require("./iframe-load");

module.exports = class Editor {
    constructor() {
        this.iframe = document.querySelector("iframe");
    }

    open(page, cb) {
        this.currentPage = page;

        axios
            .get("../" + page + "?rnd=" + Math.random())
            .then((res) => DOMHelper.parseStrToDom(res.data))
            .then(DOMHelper.wrapTextNodes)
            .then(DOMHelper.wrapImages)
            .then((dom) => {
                this.virtualDom = dom;
                return dom;
            })
            .then(DOMHelper.serializeDomToStr)
            .then((html) => axios.post("./api/saveTempPage.php", { html }))
            .then(() => this.iframe.load("../fghjfghjfghj.html"))
            .then((html) => axios.post("./api/deleteTempPage.php"))
            .then(() => this.enableEditing())
            .then(() => this.injectStyles())
            .then(cb)
    }

    enableEditing() {
        this.iframe.contentDocument.body.querySelectorAll("text-editor").forEach((element) => {
            const id = element.getAttribute("nodeid");
            const virtualElement = this.virtualDom.body.querySelector('[nodeid="${id}"]');
            new EditorText(element, virtualElement);
        });

        this.iframe.contentDocument.body.querySelectorAll("[editableimgid]").forEach((element) => {
            const id = element.getAttribute("[editableimgid]");
            const virtualElement = this.virtualDom.body.querySelector('[editableimgid="${id}"]');
            new EditorImage(element, virtualElement);
        });

        this.metaEditor = new EditorMeta(this.virtualDom);
    }

    injectStyles() {
        const style = this.iframe.contentDocument.createElement("style");
        style.innerHTML = `
            text-editor:hover {
                outline: 3px solid orange;
                outline-offset: 8px;
            }
            text-editor:focus {
                outline: 3px solid red;
                outline-offset: 8px;
            }
            [editableimgid]:hover {
                outline: 3px solid orange;
                outline-offset: 8px;
            }
        `;
        this.iframe.contentDocument.head.appendChild(style);
    }


    save(onSucces, onError) {
        const newDom = this.virtualDom.cloneNode(this.virtualDom);
        DOMHelper.unwrapTextNodes(newDom);
        DOMHelper.unwrapImages(newDom);
        const html = DOMHelper.serializeDomToStr(newDom);
        axios
            .post("./api/savePage.php", { pageName: this.currentPage, html })
            .then(onSucces)
            .catch(onError);
    }
}