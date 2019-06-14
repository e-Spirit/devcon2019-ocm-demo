export default class CaaS {
    constructor(caasUrl, project, apiKey) {
        this.projectBaseUrl = new URL(`${project}/`, caasUrl);
        this.headers = {
            "Authorization": `apikey="${apiKey}"`
        };
    }

    async fetchDocument(collection, documentId, language) {
        const documentUrl = new URL(`${collection}/${documentId}_${language}`, this.projectBaseUrl);
        return fetch(documentUrl.toString(), { "headers": this.headers })
            .then(response => {
                if (response.ok || response.status === 404) {
                    return response.json();
                } else {
                    throw new Error(`CaaS item could not be fetched. HTTP response status=${response.status}, statusText="${response.statusText}"`);
                }
            });
    }
}
