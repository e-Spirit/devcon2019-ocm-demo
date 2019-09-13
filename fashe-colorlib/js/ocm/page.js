import SectionRenderer from "./section-renderer.js";

export default class Page {
    constructor(pageRootElement, caas, snap, languageSelector) {
        this.pageRootElement = pageRootElement;
        this.caas = caas;
        this.snap = snap;
        this.languageSelector = languageSelector;
        this.languageSelector.addLanguageSelectionChangedListener(() => this.applyCaasContent());
    }

    async applyCaasContent() {
        return this.caas
            .fetchDocument("content", this.pageRootElement.dataset.caasDocumentId, this.languageSelector.getLanguageAbbreviation())
            .then(caasDocument => this.applyPage(caasDocument));
    }

    async applyPage(caasDocument) {
        this.setPreviewElementIfConnected(caasDocument, await this.snap.isConnected);
        if (Array.isArray(caasDocument.children) && caasDocument.children.length > 0) {
            caasDocument.children.forEach(this.applyBody);
        } else {
            document.querySelectorAll("[data-fs-body]").forEach(
                bodyElement => bodyElement.firstElementChild.dataset.previewId = "custom:noCaasDocument");
        }
    }

    setPreviewElementIfConnected({previewId}, isTppConnected) {
        if (isTppConnected) {
            this.snap.setPreviewElement(previewId || null);
            window.addEventListener("beforeunload", () => this.snap.setPreviewElement(null));
        }
    }

    applyBody(body) {
        const bodyElement = document.querySelector(`[data-fs-body="${body.name}"`);
        if (bodyElement) {
            if (Array.isArray(body.children) && body.children.length > 0) {
                while (bodyElement.lastChild) {
                    bodyElement.lastChild.remove();
                }

                body.children
                    .map(section => SectionRenderer[section.template].render(section))
                    .forEach(sectionElement => bodyElement.appendChild(sectionElement));
            } else {
                bodyElement.firstElementChild.dataset.previewId = "custom:noSections";
            }
        }
    }

    updateSection(section, updatedContent) {
        const updatedSection = SectionRenderer[updatedContent.template].render(updatedContent);
        section.parentElement.replaceChild(updatedSection, section);
    }

    deleteSection(section) {
        const defaultSection = SectionRenderer[section.dataset.fsTemplateUid].renderDefault();
        section.parentElement.replaceChild(defaultSection, section);
    }
}
