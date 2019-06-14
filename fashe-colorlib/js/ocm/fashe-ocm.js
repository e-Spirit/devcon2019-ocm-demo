"use strict";

import CaaS from "./caas.js";
import LanguageSelector from "./language-selector.js";
import Page from "./page.js";

(async () => {
    try {
        const caasUrl = window.location.port === "3000" ? "<URL TO THE RESET API OF YOUR PREVIEW CAAS>" : "<URL TO THE RESET API OF YOUR ONLINE CAAS>";
        const caas = new CaaS(caasUrl, "FashE", "<API KEY TO USE WITH YOUR CAAS>");
        const languageSelector = new LanguageSelector(document.querySelector(".select2-selection__rendered"));
        window.FASHE_OCM = { "page": new Page(document.body, caas, TPP_SNAP, languageSelector) };
        await FASHE_OCM.page.applyCaasContent();
    } catch (e) {
        console.error("Applying CaaS content failed: ", e);
        FASHE_OCM.page.setPreviewElementIfConnected({}, await TPP_SNAP.isConnected);
    }
})();

TPP_SNAP.onInit(async success => {
    if (success) {
        TPP_SNAP.onContentChange(async ($node, previewId, content) => {
            if (content === null) {
                FASHE_OCM.page.deleteSection($node);
            } else {
                FASHE_OCM.page.updateSection($node, content);
            }
            return true;
        });

        TPP_SNAP.overrideDefaultButton("crop", {
            execute: async ({ $node, previewId }) => {
                const updatedImageUrl = await TPP_SNAP.cropImage(previewId, $node.dataset.fsImageResolution, true);
                if (updatedImageUrl) {
                    $node.dispatchEvent(new CustomEvent("imageUpdated", { "detail": updatedImageUrl }));
                }
            }
        });

        TPP_SNAP.registerButton({
            "label": "Edit",
            "css": "tpp-icon-edit",
            "isVisible": async ({ status }) => Boolean(status && status.custom === "noSections"),
            "isEnabled": async ({ status }) => Boolean(status && status.custom === "noSections"),
            "execute": async scope => createInitialSection(scope)
        });

        const createInitialSection = async function({ $node }) {
            const body = $node.parentElement.dataset.fsBody;
            const pagePreviewId = await TPP_SNAP.getPreviewElement();
            const newSection = await TPP_SNAP.createSection(pagePreviewId, { "body": body, "result": true });

            if (newSection) {
                FASHE_OCM.page.updateSection($node, newSection);
            }
        };

        TPP_SNAP.registerButton({
            "label": "Edit",
            "css": "tpp-icon-edit",
            "isVisible": async ({ status }) => Boolean(status && status.custom === "noCaasDocument"),
            "isEnabled": async ({ status }) => Boolean(status && status.custom === "noCaasDocument"),
            "execute": async scope => {
                const { caasDocumentId, fsTemplateUid } = document.body.dataset;
                const result = await TPP_SNAP.createPage("content_pages", caasDocumentId, fsTemplateUid, {
                    "result": true,
                    "language": FASHE_OCM.page.languageSelector.getLanguageAbbreviation()
                });
                if (result) {
                    await FASHE_OCM.page.applyPage(result);
                    return createInitialSection(scope);
                }
            }
        });
    }
});
