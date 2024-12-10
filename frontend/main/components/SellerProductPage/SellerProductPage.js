/**
 * The Seller Product Page provides functionality to edit products and upload product images.
 */

import { BaseComponent } from "../../app/BaseComponent.js";
import { Category } from "../shared/Category.js";
import { AppController } from "../../app/AppController.js";

export class SellerProductPage extends BaseComponent {
    constructor() {
        super();
        // TODO: initialize needed fields
        this.curSeller = "1234-5678";
        this.loadCSS("SellerProductPage");
        this.container.classList.add("seller-product-page");
    }

    async render(prodid) {
        // fetch product data from backend
        const response = await fetch(`/api/products/${prodid}`, {
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

        this.previewImage = false;

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
        this.container.appendChild(uploadInput);

        // back button
        const backButton = document.createElement("button");
        backButton.classList.add("back-button");
        backButton.textContent = "Back to Dashboard";
        backButton.addEventListener("click", () => this.goBackToDashboard());
        this.container.appendChild(backButton);

        // form to change product information
        const productInfo = this.createProductInfo();
        this.container.appendChild(productInfo);

        // create category dropdown
        const categorySelector = document.createElement("select");
        categorySelector.id = "category-selector";
        for (let curCategory in Category) {
            const option = document.createElement("option");
            option.innerText = Category[curCategory];
            option.value = Category[curCategory];
            if (this.product.category === curCategory) {
                option.selected = "selected";
            }
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

        const previewImage = document.createElement("img");
        previewImage.src = "";
        previewImage.classList.add("product-image");
        previewImage.id = "preview-image";
        previewImage.style.display = "none";
        imageGallery.appendChild(previewImage);

        return imageGallery;
    }

    createProductInfo() {
        const productInfo = document.createElement("div");

        // create input fields
        const textFields = [{name: "Name", id: "name", kind: "text", required: true}, {name: "Secondary Name", id: "secondaryname", kind: "text", required: false}, {name: "Description", id: "description", kind: "text", required: false}, {name: "Price", id: "price", kind: "number", required: true}/*, {name: "Quantity", id: "quantity", kind: "number", required: true}*/];
        
        for (let i = 0; i < textFields.length; i++) {
            const curField = textFields[i];

            const container = document.createElement("div");
            container.classList.add("text-field");
            
            const label = document.createElement("label");
            label.htmlFor = curField.id;
            label.textContent = curField.name;
            container.appendChild(label);

            const input = document.createElement("input");
            input.classList.add("field-input");
            input.type = curField.kind;
            input.id = curField.id;
            input.value = this.product[curField.id];
            input.required = curField.required;
            container.appendChild(input);

            productInfo.appendChild(container);
        }

        return productInfo;
    }

    updatePreviewImages(files) {
        const curFile = files[0];
        if (curFile) {
            const previewImage = document.getElementById("preview-image");
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewImage.style.display = "block";
            };
            reader.readAsDataURL(curFile);
            this.previewImage = true;
        }
    }

    async uploadImage() {
        // TODO: implement
    }

    deleteImage(url) {
        this.product.Images = this.product.Images.filter((img) => img.url !== url);
    }

    async saveProduct() {
        // upload images if any
        if (this.previewImages) {
            try {
                const image = await this.uploadImage();
                if (!image) {
                    throw new Error("Failed to upload image(s).");
                }
                this.product.Images = this.product.Images.concat(image);
            } catch (error) {
                console.log("Error uploading image(s)." + error);
            }
        }

        // save product data to the server
        try {
            const response = await fetch(`/api/products/${this.product.prodid}`, {
                method: "PUT",
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
        const fields = document.querySelectorAll(".text-field");
        let errors = [];
        let sawError = false;
        fields.forEach((field) => {
            const input = field.childNodes[1];
            const label = field.childNodes[0];
            if (input.required && input.value.trim() === "") {
                errors.push(`${label.textContent} is required.`);
                sawError = true;
            }
            if (!sawError) {
                this.product[input.id] = input.value;
            }
        });

        if (sawError) {
            const alertText = errors.join("\n");
            alert(alertText);
            return false;
        }

        const categorySelector = document.getElementById("category-selector");
        this.product.category = categorySelector.value;

        return true;
    }

    goBackToDashboard() {
        console.log(`going to sell products page`);
        const appController = AppController.getInstance();
        appController.navigate("sellProductsPage");
    }
}