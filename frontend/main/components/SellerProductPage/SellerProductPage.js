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

        this.previewImages = [];

        return this.createMainPage();
    }

    createMainPage() {
        // empty container
        this.container.innerHTML = "";

        // display images if there are any
        if (this.product.Images && this.product.Images.length > 0) {
            const imageGallery = this.createImageGallery();
            this.container.appendChild(imageGallery);
        }

        // upload new image
        const uploadInput = document.createElement("input");
        uploadInput.type = "file";
        uploadInput.classList.add("upload-input");
        uploadInput.accept = "image/*";
        uploadInput.addEventListener("change", (event) => this.updatePreviewImages(event.target.files));

        // form to change product information

        // save button
        const saveButton = document.createElement("img");
        saveButton.src = "/frontend/assets/edit-icon.svg"; // TODO: change to save icon
        saveButton.classList.add("save-button");
        saveButton.addEventListener("click", () => this.saveProduct());

        return this.container;
    }

    createImageGallery() {
        const images = this.product.Images.filter(img => img); // create copy of images

        if (this.previewImages.length > 0) { // add in preview images
            images = images.concat(this.previewImages);
        }

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

    updatePreviewImages(files) {
        for (let i = 0; i < files.length; i++) {
            const curFile = files[i];
            if (curFile) {
                const previewImage = { url: "" };
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.url = e.target.result;
                };
                reader.readAsDataURL(curFile);
                this.previewImages.push(previewImage);
            }
        }
        this.createMainPage();
    }

    async uploadImages() {
        // TODO: implement
    }

    deleteImage(url) {
        this.product.Images = this.product.Images.filter((img) => img.url !== url);
    }

    async saveProduct() {
        // upload images if any
        if (this.previewImages.length > 0) {
            try {
                const images = await this.uploadImages();
                this.product.Images = this.product.Images.concat(images);
            } catch (error) {
                console.error("Error uploading image(s)." + error);
            }
        }

        // save product data to the server
        try {
            const response = await fetch(`/api/products/${this.product.prodid}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.product)
            });

            if (!response.ok) {
                throw new Error(`Failed to save product data: ${response.statusText}`);
            }

            // tell the user the product was saved
            alert("Successfully saved product!");

            // refresh page
            this.createMainPage();
        } catch (error) {
            console.error("Error saving product data:" + error);
            alert("Failed to save product data.");
        }
    }
}