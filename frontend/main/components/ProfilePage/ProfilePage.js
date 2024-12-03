import { BaseComponent } from "../../app/BaseComponent.js";
import { userinfo } from "./userInfo.js";
import { ProfileService } from "../../services/ProfileService.js";
import { EventHub, hub } from "../../eventhub/EventHub.js";

export class ProfilePage extends BaseComponent {
    constructor() {
        super();
        this.container.classList.add('profile-page');
        
        this.currentUser = userinfo[0]; //only shows the first user now, but will change later

        this.profileContainer = document.createElement("div");
        this.profileContainer.classList.add("profile-container");

        this.privateInfoVisible = false; 
        this.loadCSS("ProfilePage");
        this.render();
    }

    async getProfileList() {
        const profileService = new ProfileService();
        const list = await profileService.retrieveProfileById();
    }

    render() {
        this.profileContainer.innerHTML = ""; 

        const publicInfo = this.renderPublicInfo();
        this.profileContainer.appendChild(publicInfo);

        const privateSections = this.renderPrivateSections();
        this.profileContainer.appendChild(privateSections);

        const orderHistory = this.renderOrderHistory();
        this.profileContainer.appendChild(orderHistory);

        this.container.appendChild(this.profileContainer);

        return this.container;
    }

    renderPublicInfo() {
        const publicInfo = document.createElement("div");
        publicInfo.classList.add("public-info");

        //avatar
        const avatar = document.createElement("img");
        avatar.src = this.currentUser.avatar;
        avatar.alt = `${this.currentUser.name}'s Avatar`;
        avatar.classList.add("profile-avatar");
        publicInfo.appendChild(avatar);

        //public info: name, phone number, email
        const userDetails = document.createElement("div");
        userDetails.classList.add("user-details");

        const name = document.createElement("h1");
        name.innerText = this.currentUser.name;
        name.classList.add("profile-name");
        //edit button for name
        const editIcon = document.createElement("span");
        editIcon.classList.add("edit-icon");
        editIcon.innerText = "✏️";

        editIcon.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = name.innerText; 
        input.classList.add("editable-input");
        editIcon.style.display = "none";

        const saveButton = document.createElement("button");
        saveButton.innerText = "Save";
        saveButton.classList.add("save-button");

        const parent = name.parentElement;
        parent.replaceChild(input, name);

        saveButton.addEventListener("click", () => {
            const newValue = input.value.trim(); 

            if (newValue === "") {
                alert("Name cannot be empty!");
                return;
            }

            name.innerText = newValue;

            parent.replaceChild(name, input);
            saveButton.remove(); 
            editIcon.style.display = "block";
        });

    
        parent.appendChild(saveButton);
    });

        const nameContainer = document.createElement("div");
        nameContainer.classList.add("name-container");
        nameContainer.appendChild(name);
        nameContainer.appendChild(editIcon);
        userDetails.appendChild(nameContainer);


        const phone = document.createElement("p");
        phone.innerText = `Phone: ${this.currentUser.phone}`;
        userDetails.appendChild(phone);

        const email = document.createElement("p");
        email.innerText = `Email: ${this.currentUser.email}`;
        userDetails.appendChild(email);

        publicInfo.appendChild(userDetails);

        return publicInfo;
    }

    renderPrivateSections() {
        const sectionsContainer = document.createElement("div");
        sectionsContainer.classList.add("private-sections");

        
        const addressSection = this.createPrivateSection("Address Book", "user-address", this.currentUser.address);
        sectionsContainer.appendChild(addressSection);

        const paymentSection = this.createPrivateSection("Payment Method", "user-payment", this.currentUser.payment);
        sectionsContainer.appendChild(paymentSection);

        return sectionsContainer;
    }

    createPrivateSection(title, id, content) {
        const section = document.createElement("div");
        section.classList.add("section");
    
        //title
        const sectionHeader = document.createElement("h2");
        sectionHeader.innerText = title;
        sectionHeader.classList.add("section-header");
        
        //hidden details for each title
        const sectionContent = document.createElement("p");
        sectionContent.id = id;
        sectionContent.innerText = content;
        sectionContent.style.display = "none";
    
        //when click the title, details display
        sectionHeader.addEventListener("click", () => {
            const isVisible = sectionContent.style.display === "block";
            sectionContent.style.display = isVisible ? "none" : "block";
        });
    
        section.appendChild(sectionHeader);
        section.appendChild(sectionContent);
    
        return section;
    }

    renderOrderHistory() {
        const orderHistoryContainer = document.createElement("div");
        orderHistoryContainer.classList.add("order-history");
    
        const header = document.createElement("h2");
        header.innerText = "Order History";
        orderHistoryContainer.appendChild(header);
    
        const orderList = document.createElement("div");
        orderList.classList.add("order-list");
    
        if (this.currentUser.order.length === 0) {
            //no order
            const noOrders = document.createElement("p");
            noOrders.innerText = "No orders found.";
            orderList.appendChild(noOrders);
        } else {
            this.currentUser.order.forEach(order => {
                const orderItem = document.createElement("div");
                orderItem.classList.add("order-item");
    
                //order id
                const orderId = document.createElement("p");
                orderId.innerText = `Order ID: ${order.id}`;
                orderItem.appendChild(orderId);
                //date of order
                const orderDate = document.createElement("p");
                orderDate.innerText = `Date: ${order.date}`;
                orderItem.appendChild(orderDate);
                //total amount
                const orderTotal = document.createElement("p");
                orderTotal.innerText = `Total: $${order.total}`;
                orderItem.appendChild(orderTotal);
                //products
                const orderItems = document.createElement("p");
                orderItems.innerText = `Items: ${order.items}`;
                orderItem.appendChild(orderItems);
    
                orderList.appendChild(orderItem);
            });
        }
    
        orderHistoryContainer.appendChild(orderList);
    
        return orderHistoryContainer;
    }
    
    
}
