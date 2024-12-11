/**
 * The Seller Product Page provides functionality to edit products and upload product images.
 */

import { BaseComponent } from "../../app/BaseComponent.js";
import { Category } from "../shared/Category.js";
import { AppController } from "../../app/AppController.js";
import { authService, AuthService } from "../../services/AuthService.js";

export class SellerProductPage extends BaseComponent {
    constructor() {
        super();
        this.loadCSS("SellerProductPage");
        this.container.classList.add("seller-product-page");
    }

    async render(prodid) {
        // find seller
        this.curSeller = authService.getUserId();
        
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

        let imageGallery;
        // display images if there are any
        imageGallery = this.createImageGallery();
        this.container.appendChild(imageGallery);

        // upload new image
        const uploadInput = document.createElement("input");
        uploadInput.id = "upload";
        uploadInput.type = "file";
        // uploadInput.classList.add("upload-input");
        uploadInput.style.display = "none";
        uploadInput.accept = "image/*";
        uploadInput.addEventListener("change", (event) => this.updatePreviewImages(event.target.files));
        imageGallery.appendChild(uploadInput);

        const uploadLabel = document.createElement("label");
        uploadLabel.htmlFor = "upload";
        uploadLabel.textContent = "Upload new image...";
        uploadLabel.classList.add("upload-input");
        imageGallery.appendChild(uploadLabel);

        const productInfoContainer = document.createElement("div");
        productInfoContainer.classList.add("product-info-container");

        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("button-container");

        // back button
        const backButtonContainer = document.createElement("div");
        backButtonContainer.classList.add("back-button-container");

        const backButton = document.createElement("button");
        backButton.classList.add("back-button");
        backButton.textContent = "Back to Dashboard";
        backButton.addEventListener("click", () => this.goBackToDashboard());
        backButtonContainer.appendChild(backButton);

        if (this.product.Reviews && this.product.Reviews.length > 0) {
            const reviewsContainer = document.createElement("div");
            reviewsContainer.classList.add("star-container");
            reviewsContainer.addEventListener("click", () => this.goToReviews());

            const reviews = document.createElement("img");
            reviews.classList.add("star-img");
            reviews.src = this.getStarIMG(this.product.Reviews);
            reviewsContainer.appendChild(reviews);

            const reviewsText = document.createElement("span");
            reviewsText.classList.add("num-reviews");
            reviewsText.textContent = `${this.product.Reviews.length} Reviews`;
            reviewsContainer.appendChild(reviewsText);

            backButtonContainer.appendChild(reviewsContainer);
        }

        buttonsContainer.appendChild(backButtonContainer);

        // save button
        const saveButtonContainer = document.createElement("div");
        saveButtonContainer.classList.add("save-button-container");

        const saveButton = document.createElement("img");
        saveButton.src = "/assets/finish-icon.svg";
        saveButton.classList.add("button");
        saveButton.classList.add("save-button");
        saveButton.addEventListener("click", () => {
            const valid = this.validateFields();

            if (valid) {
                this.saveProduct();
            }
        });
        saveButtonContainer.appendChild(saveButton);
        buttonsContainer.appendChild(saveButtonContainer);

        productInfoContainer.appendChild(buttonsContainer);

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
        productInfoContainer.appendChild(categorySelector);

        // form to change product information
        const productInfo = this.createProductInfo();
        productInfoContainer.appendChild(productInfo);

        this.container.appendChild(productInfoContainer);

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
            deleteButton.src = "/assets/delete-icon.svg";
            deleteButton.classList.add("button");
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

        if (this.product.ProductTypes && this.product.ProductTypes.length > 0) {
            const productTypes = this.createProductTypes();
            productInfo.appendChild(productTypes);
        }

        const addTypeButton = document.createElement("button");
        addTypeButton.innerText = "Add new type";
        addTypeButton.classList.add("add-type-button");
        addTypeButton.addEventListener("click", () => this.addType());
        productInfo.appendChild(addTypeButton);

        return productInfo;
    }

    createProductTypes() {
        const productTypesContainer = document.createElement("div");

        this.product.ProductTypes.forEach((type, i) => {
            const container = document.createElement("div");
            container.id = `type-${type.id}`;

            const topContainer = document.createElement("div");
            topContainer.classList.add("type-top-container");

            const typeLabel = document.createElement("h1");
            typeLabel.classList.add("type-label");
            typeLabel.innerText = `Type ${i+1}`;
            topContainer.appendChild(typeLabel);

            const deleteButton = document.createElement("img");
            deleteButton.src = "/assets/delete-icon.svg";
            deleteButton.classList.add("button");
            deleteButton.classList.add("delete-type-button");
            deleteButton.addEventListener("click", () => this.deleteType(type.id));
            topContainer.appendChild(deleteButton);

            container.appendChild(topContainer);

            const nameLabel = document.createElement("label");
            nameLabel.htmlFor = `type-${type.id}-name`;
            nameLabel.textContent = "Name";
            container.appendChild(nameLabel);
            
            const nameInput = document.createElement("input");
            nameInput.classList.add("type-input");
            nameInput.type = "text";
            nameInput.id = `type-${type.id}-name`;
            nameInput.value = type.type;
            nameInput.required = true;
            container.appendChild(nameInput);

            const priceLabel = document.createElement("label");
            priceLabel.htmlFor = `type-${type.id}-price`;
            priceLabel.textContent = "Price";
            container.appendChild(priceLabel);
            
            const priceInput = document.createElement("input");
            priceInput.classList.add("type-input");
            priceInput.type = "number";
            priceInput.id = `type-${type.id}-price`;
            priceInput.value = type.price;
            priceInput.required = true;
            container.appendChild(priceInput);

            productTypesContainer.appendChild(container);
        });

        return productTypesContainer;
    }

    addType() {
        const newTypeId = (this.product.ProductTypes[this.product.ProductTypes.length-1].id) + 1;
        const newTypeName = "New Type";
        const newTypePrice = 1;
        const newType = {id: newTypeId, type: newTypeName, price: newTypePrice, productId: this.product.prodid};
        this.product.ProductTypes.push(newType);
        this.createMainPage();
    }

    deleteType(id) {
        this.product.ProductTypes = this.product.ProductTypes.filter((type) => type.id !== id);
        this.createMainPage();
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
        this.createMainPage();
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
        let errors = [];
        let sawError = false;

        for (let i = 0; i < this.product.ProductTypes.length; i++) {
            const type = this.product.ProductTypes[i];

            const newName = document.getElementById(`type-${type.id}-name`).value;
            const newPrice = document.getElementById(`type-${type.id}-price`).value;
            if (!newName) {
                sawError = true;
                errors.push(`Type ${type.id} name is required.`);
            }
            if (!newPrice || newPrice <= 0) {
                sawError = true;
                errors.push(`Type ${type.id} price must be greater than zero.`);
            }
            this.product.ProductTypes[i].type = newName;
            this.product.ProductTypes[i].price = newPrice;
        }

        this.product.producttypes = this.product.ProductTypes;

        const fields = document.querySelectorAll(".text-field");
        fields.forEach((field) => {
            const input = field.childNodes[1];
            const label = field.childNodes[0];
            if (input.required && input.value.trim() === "") {
                errors.push(`${label.textContent} is required.`);
                sawError = true;
            }
            if (input.id === "price" && input.value <= 0) {
                errors.push("Price musts be greater than zero.");
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

    getStarIMG(reviews) {
        const numReviews = reviews.length;
        let reviewsSum = 0;
        reviews.forEach((review) => {
            reviewsSum += review.rating;
        });

        const average = reviewsSum / numReviews;

        if (average < 1 || average > 5) {
            console.error("Invalid review average" + average);
            return "";
        }

        if (average < 1.4) {
            return "/assets/one-star.png";
        } else if (average < 1.9) {
            return "/assets/one-point-five-star.png";
        } else if (average < 2.4) {
            return "/assets/two-star.png";
        } else if (average < 2.9) {
            return "/assets/two-point-five-star.png";
        } else if (average < 3.4) {
            return "/assets/three-star.png";
        } else if (average < 3.9) {
            return "/assets/three-point-five-star.png";
        } else if (average < 4.4) {
            return "/assets/four-star.png";
        } else if (average < 4.9) {
            return "/assets/four-point-five-star.png";
        } else {
            return "/assets/five-star.png";
        }
    }

    goToReviews() {
        const prodid = this.product.prodid;
        console.log(`going to product page for product ${prodid}`);
        const appController = AppController.getInstance();
        appController.navigate("productPage", {prodid});
    }
}