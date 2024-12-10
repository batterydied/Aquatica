/**
 * The Seller Product Page provides functionality to edit products and upload product images.
 */

import { BaseComponent } from "../../app/BaseComponent.js";
import { Category } from "../shared/Category.js";

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
        const productInfo = this.createProductInfo();
        this.container.appendChild(productInfo);

        // create category dropdown
        const categorySelector = document.createElement("select");
        categorySelector.id = "category-selector";
        for (let category in Category) {
            const option = document.createElement("option");
            option.innerText = Category[category];
            option.value = Category[category];
            categorySelector.appendChild(option);
        }
        this.container.appendChild(categorySelector);

        // save button
        const saveButton = document.createElement("img");
        saveButton.src = "/frontend/assets/edit-icon.svg"; // TODO: change to save icon
        saveButton.classList.add("save-button");
        saveButton.addEventListener("click", () => {
            const valid = this.validateFields();

            if (valid) {
                this.saveProduct();
            }
        });
        this.container.appendChild(saveButton);

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

    createProductInfo() {
        const productInfo = document.createElement("form");

        // create input fields
        const textFields = [{name: "Name", id: "name", kind: "text", required: true}, {name: "Secondary Name", id: "secondaryname", kind: "text", required: false}, {name: "Description", id: "description", kind: "text", required: false}, {name: "Price", id: "price", kind: "number", required: true}, {name: "Quantity", id: "quantity", kind: "number", required: true}];
        
        for (let i = 0; i < textFields.length; i++) {
            const curField = textFields[i];

            const container = document.createElement("div");
            container.classList.add("text-field");
            
            const label = document.createElement("label");
            label.htmlFor = curField.id;
            label.textContent = curField.name;
            container.appendChild(label);

            const input = document.createElement("input");
            input.type = curField.kind;
            input.id = curField.id;
            input.placeholder = this.product[curField.id];
            input.required = curField.required;
            container.appendChild(input);

            productInfo.appendChild(container);
        }

        return productInfo;
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

    validateFields() {
        const fields = document.querySelectorAll("text-field");
        fields.forEach((field) => {
            // TODO: validate input
            this.product[field.id] = field.value;
        });
        const categorySelector = document.getElementById("category-selector");
        this.product.category = categorySelector.value;

        return true;
    }
}