const sectionRenderer = {
    "banner_image": {
        "render": function ({previewId, data: { st_caption1, st_caption2, st_image, st_ctaButton: [ ctaButton ] }}) {
            const html = `
                <div class="slick1" data-preview-id="${previewId}" data-fs-template-uid="banner_image">
                    <div
                        class="item-slick1 item1-slick1"
                        style="background-image: url('${st_image.url}');"
                        data-preview-id="${st_image.previewId}"
                        data-fs-image-resolution="Banner">
                        <div class="wrap-content-slide1 sizefull flex-col-c-m p-l-15 p-r-15 p-t-150 p-b-170">
                            <span class="caption1-slide1 m-text1 t-center animated visible-false m-b-15 visible-true" data-appear="fadeInDown">
                                ${st_caption1}
                            </span>
                        
                            <h2 class="caption2-slide1 xl-text1 t-center animated visible-false m-b-37 visible-true" data-appear="fadeInUp">
                                ${st_caption2}
                            </h2>
                        
                            <div class="wrap-btn-slide1 w-size1 animated visible-false visible-true" data-appear="zoomIn">
                                <!-- Button -->
                                <a href="${ctaButton.data.lt_url}" class="flex-c-m size2 bo-rad-23 s-text2 bgwhite hov1 trans-0-4">
                                    ${ctaButton.data.lt_linkText}
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
                            "data": {
                                "st_caption1": "Women Collection 2018",
                                "st_caption2": "New arrivals",
                                "st_image": {
                                    "url": "images/master-slide-02.jpg",
                                    "previewId": "custom:noImage"
                                },
                                "st_ctaButton": [{
                                    "data": { "lt_url": "product.html", "lt_linkText": "Shop Now" }
                                }]
                            }
                          });
        }
    }
};

export default sectionRenderer;
