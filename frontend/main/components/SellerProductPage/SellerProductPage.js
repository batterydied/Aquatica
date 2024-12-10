/**
 * The Seller Product Page provides functionality to edit products and upload product images.
 */

import { BaseComponent } from "../../app/BaseComponent.js";

export class SellerProductPage extends BaseComponent {
    constructor() {
        super();
        // TODO: initialize needed fields
        this.curSeller = "1234-5678";
        this.loadCSS("SellerProductPage");
    }

    async render(prodid) {
        // fetch product data from backend
        const response = await fetch(`/api/product/${prodid}`, {
            method: "GET",
        });

        if (!response.ok) {
            this.container.innerHTML = "Product not found.";
            return this.container;
        }

        this.product = await response.json();

        if (this.product.sellerid != this.curSeller) {
            this.container.innerHTML = "Access denied: you are not the owner of this product.";
            return this.container;
        }

        // empty container
        this.container.innerHTML = "";

        // display images if there are any
        if (this.product.Images && this.product.Images.length > 0) {
            const imageGallery = this.createImageGallery(product.Images);
            this.container.appendChild(imageGallery);
        }

        // upload new image
        const uploadInput = document.createElement("input");
        uploadInput.type = "file";
        uploadInput.classList.add("upload-input");
        uploadInput.accept = "image/*";

        // form to change product information

        // save button

        return this.container;
    }

    createImageGallery(images) {
        const imageGallery = document.createElement("div");
        imageGallery.classList.add("image-gallery");

        for (let i = 0; i < images.length; i++) {
            const curImageContainer = document.createElement("div");

            const curImage = document.createElement("img");
            curImage.src = images[i].url;
            curImage.classList.add("product-image");
            curImageContainer.appendChild(curImage);

            const deleteButton = document.createElement("img");
            deleteButton.src = "/frontend/assets/edit-icon.svg"; // TODO: change to delete icon
            deleteButton.classList.add("delete-image-button");
            deleteButton.addEventListener("click", () => this.deleteImage(images[i].url));
            curImageContainer.appendChild(deleteButton);

            imageGallery.appendChild(curImageContainer);
        }
        return imageGallery;
    }

    uploadImage() {
        // TODO: implement
    }

    deleteImage(url) {
        this.product.Images = this.product.Images.filter((img) => img.url !== url);
    }

    saveProduct() {
        // TODO: implement
    }
}