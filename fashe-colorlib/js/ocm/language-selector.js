export default class LanguageSelector {
    constructor(domElement) {
        this.domElement = domElement;
    }

    getLanguageAbbreviation() {
        return this.domElement.getAttribute("title").toLocaleLowerCase();
    }

    addLanguageSelectionChangedListener(listener) {
        const languageSelectorObserver = new MutationObserver(async (mutations) => {
            if (mutations[0].attributeName === "title") {
                listener();
            }
        });
        languageSelectorObserver.observe(this.domElement, {"attributes": true });
    }
}
