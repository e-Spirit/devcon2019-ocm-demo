const sectionRenderer = {
    "banner_image": {
        "render": function ({previewId, formData: { st_caption1, st_caption2, st_image, st_ctaButton: { value: [ ctaButton ]} }}) {
            const html = `
                <div class="slick1" data-preview-id="${previewId}" data-fs-template-uid="banner_image">
                    <div
                        class="item-slick1 item1-slick1"
                        style="background-image: url('${st_image.value.url}');"
                        data-preview-id="${st_image.previewId}"
                        data-fs-image-resolution="Banner">
                        <div class="wrap-content-slide1 sizefull flex-col-c-m p-l-15 p-r-15 p-t-150 p-b-170">
                            <span class="caption1-slide1 m-text1 t-center animated visible-false m-b-15 visible-true" data-appear="fadeInDown">
                                ${st_caption1.value}
                            </span>
                        
                            <h2 class="caption2-slide1 xl-text1 t-center animated visible-false m-b-37 visible-true" data-appear="fadeInUp">
                                ${st_caption2.value}
                            </h2>
                        
                            <div class="wrap-btn-slide1 w-size1 animated visible-false visible-true" data-appear="zoomIn">
                                <!-- Button -->
                                <a href="${ctaButton.formData.lt_url.value}" class="flex-c-m size2 bo-rad-23 s-text2 bgwhite hov1 trans-0-4">
                                    ${ctaButton.formData.lt_linkText.value}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>`;

            const bannerSection = document.createRange().createContextualFragment(html);
            bannerSection.firstElementChild.firstElementChild.addEventListener("imageUpdated", ({ detail, target }) => {
                target.style.backgroundImage = `url(${detail})`;
            });
            return bannerSection;
        },
        "renderDefault": function () {
            return this.render({
                            "previewId": "custom:noSections",
                            "formData": {
                                "st_caption1": { "value": "Women Collection 2018" },
                                "st_caption2": { "value": "New arrivals" },
                                "st_image": {
                                    "value": {
                                        "url": "images/master-slide-02.jpg"
                                    },
                                    "previewId": "custom:noImage"
                                },
                                "st_ctaButton": {
                                    "value": [{
                                        "formData": {
                                            "lt_url": { "value": "product.html" },
                                            "lt_linkText": { "value": "Shop Now" }
                                        }
                                    }]
                                }
                            }
                          });
        }
    }
};

export default sectionRenderer;
