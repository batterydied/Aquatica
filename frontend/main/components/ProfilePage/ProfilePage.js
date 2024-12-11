import { BaseComponent } from "../../app/BaseComponent.js"

export class ProfilePage extends BaseComponent {
    constructor() {
        super();
        this.addresses = [];
        this.paymentMethods = [];
        this.orders = [];

        // Add a flag to track if forms are currently visible or not
        this.showAddressForm = false;
        this.showPaymentMethodForm = false;

        // Main container initialization
        this.container.classList.add('profile-page');
        this.loadCSS('ProfilePage'); // Load the associated CSS file

        // Profile main container
        this.profileContainer = document.createElement('div');
        this.profileContainer.classList.add('container', 'mx-auto', 'py-10', 'px-4', 'sm:px-6', 'lg:px-8');

        // Page header

        // Grid layout for left and right columns
        this.grid = document.createElement('div');
        this.grid.classList.add('grid', 'gap-8', 'md:grid-cols-2');

        this.leftSide = document.createElement('div');
        this.leftSide.classList.add('space-y-8');

        this.rightSide = document.createElement('div');
        this.rightSide.classList.add('space-y-8');
    }

    /**
     * Render the ProfilePage UI.
     * @returns {HTMLElement} The container element for the ProfilePage.
     */
    async render() {
        // Clear existing children to avoid duplicates if render is called multiple times
        this.leftSide.innerHTML = '';
        this.rightSide.innerHTML = '';
        this.profileContainer.innerHTML = '';

        // Assemble main structure
        this.profileContainer.appendChild(this.grid);
        this.grid.appendChild(this.leftSide);
        this.grid.appendChild(this.rightSide);

        // Render sub-sections
        this.renderProfileInfo();
        this.renderAddressBook();
        this.renderPaymentMethods();
        this.renderOrderHistory();

        // Ensure the container is appended only once
        if (!this.container.contains(this.profileContainer)) {
            this.container.appendChild(this.profileContainer);
        }

        return this.container;
    }

    /**
     * Render the "Edit Profile" section with Profile Picture, Email, Phone, and Save button.
     */
    renderProfileInfo() {
        const profileInfoDiv = document.createElement('div');
        profileInfoDiv.classList.add(
            'flex', 'flex-col', 'p-8', 'rounded-md', 'border', 'border-2', 'border-gray-200'
        );

        const profileInfoHeader = document.createElement('p');
        profileInfoHeader.innerText = 'Edit Profile';
        profileInfoHeader.classList.add('text-xl', 'font-bold');

        // Profile picture
        const profilePictureDiv = document.createElement('div');
        profilePictureDiv.classList.add('flex-initial', 'flex-row', 'my-4');

        const profilePicture = document.createElement('input');
        profilePicture.classList.add('bg-gray-200', 'rounded-full', 'w-24', 'h-24');

        const profilePictureButton = document.createElement('button');
        profilePictureButton.innerText = 'Change Picture';
        profilePictureButton.classList.add(
            'rounded', 'border', 'border-2', 'border-gray-200', 'm-4', 'px-6', 'py-2', 'font-semibold', 'text-gray-700'
        );

        profilePictureDiv.appendChild(profilePicture);
        profilePictureDiv.appendChild(profilePictureButton);

        // Email and Phone fields
        const emailDiv = this.createInputField('Email', 'UserEmail', 'bob@gmail.com', 'email');
        const phoneDiv = this.createInputField('Phone', 'UserPhone', '333-3333-3333', 'text');

        // Save button (not currently functional beyond UI)
        const profileInfoSaveButton = document.createElement('button');
        profileInfoSaveButton.innerHTML = 'Save';
        profileInfoSaveButton.classList.add(
            'rounded', 'bg-[#5B91C8]', 'text-white', 'my-4', 'py-2'
        );

        // Append all elements
        profileInfoDiv.appendChild(profileInfoHeader);
        profileInfoDiv.appendChild(profilePictureDiv);
        profileInfoDiv.appendChild(emailDiv);
        profileInfoDiv.appendChild(phoneDiv);
        profileInfoDiv.appendChild(profileInfoSaveButton);

        this.leftSide.appendChild(profileInfoDiv);
    }

    /**
     * Render the address book section.
     * Allows adding a new address and displays a list of saved addresses.
     */
    renderAddressBook() {
        const addressBookDiv = document.createElement('div');
        addressBookDiv.classList.add(
            'flex', 'flex-col', 'p-8', 'rounded-md', 'border', 'border-2', 'border-gray-200'
        );

        const addressBookHeader = document.createElement('p');
        addressBookHeader.innerText = 'Address Book';
        addressBookHeader.classList.add('text-xl', 'font-bold');
        addressBookDiv.appendChild(addressBookHeader);

        const grid = document.createElement('div');
        grid.classList.add('grid', 'gap-8', 'md:grid-cols-3');

        // Address input form
        const addressDiv = document.createElement('div');
        addressDiv.classList.add('my-4', 'col-span-2');

        const addressLabel = document.createElement('label');
        addressLabel.classList.add('block', 'text-sm', 'font-bold', 'text-gray-700', 'mb-2');
        addressLabel.innerText = 'New Address';
        addressLabel.htmlFor = 'Address';

        const addressInput = document.createElement('input');
        addressInput.type = 'text';
        addressInput.id = 'Address';
        addressInput.placeholder = 'Enter a new address';
        addressInput.classList.add(
            'appearance-none', 'border', 'border-2', 'border-gray-200', 'rounded', 'w-full',
            'py-2', 'px-3', 'text-gray-700', 'leading-tight', 'focus:outline-none'
        );

        addressDiv.appendChild(addressLabel);
        addressDiv.appendChild(addressInput);

        // "+" button to add new address to the list
        const addressSaveButton = document.createElement('button');
        addressSaveButton.innerHTML = '+';
        addressSaveButton.classList.add('rounded', 'bg-[#5B91C8]', 'text-white', 'm-8', 'px-4');

        // Event listener for adding new address
        addressSaveButton.addEventListener('click', () => {
            const newAddress = addressInput.value.trim();
            if (newAddress) {
                // For simplicity, split the address into parts (street, city, state, zip)
                // Here we'll just store the entire input as "streetAddress" and leave others blank
                this.addresses.push({
                    streetAddress: newAddress,
                    city: '',
                    state: '',
                    zipCode: ''
                });
                addressInput.value = '';
                // Re-render to show the updated address list
                this.render();
            }
        });

        grid.appendChild(addressDiv);
        grid.appendChild(addressSaveButton);
        addressBookDiv.appendChild(grid);

        // Display existing addresses
        this.addresses.forEach(addr => {
            const address = document.createElement('p');
            address.innerText = addr.streetAddress
                ? `${addr.streetAddress}, ${addr.city} ${addr.state} ${addr.zipCode}`
                : 'Unknown Address';
            address.classList.add('bg-blue-100', 'rounded-md', 'p-4', 'my-2');
            addressBookDiv.appendChild(address);
        });

        this.leftSide.appendChild(addressBookDiv);
    }

    /**
     * Render the payment methods section.
     * Allows adding a new payment method and lists existing methods.
     */
    renderPaymentMethods() {
        const paymentMethodsBox = document.createElement('div');
        paymentMethodsBox.classList.add(
            'flex', 'flex-col', 'p-8', 'rounded-md', 'border', 'border-2', 'border-gray-200'
        );

        const paymentMethodsHeaderBox = document.createElement('div');
        const paymentMethodsHeader = document.createElement('p');
        paymentMethodsHeader.innerText = 'Payment Methods';
        paymentMethodsHeader.classList.add('text-xl', 'font-bold');

        const addNewPaymentMethodButton = document.createElement('button');
        addNewPaymentMethodButton.innerText = 'Add New';
        addNewPaymentMethodButton.classList.add('rounded', 'bg-[#5B91C8]', 'text-white', 'px-4', 'ml-4');

        paymentMethodsHeaderBox.appendChild(paymentMethodsHeader);
        paymentMethodsHeaderBox.appendChild(addNewPaymentMethodButton);
        paymentMethodsBox.appendChild(paymentMethodsHeaderBox);

        // On clicking Add New, show the form if it's not already visible
        addNewPaymentMethodButton.addEventListener('click', () => {
            this.showPaymentMethodForm = !this.showPaymentMethodForm;
            this.render(); // re-render to show/hide form
        });

        // List existing payment methods
        this.paymentMethods.forEach((method, index) => {
            const methodBox = document.createElement('div');
            methodBox.classList.add('bg-slate-100', 'rounded-md', 'p-4', 'mt-4', 'flex', 'flex-col');

            const cardInfo = document.createElement('p');
            cardInfo.innerText = `${method.cardNumber} (Expires ${method.expiryMonth}/${method.expiryYear})`;

            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.classList.add('rounded', 'bg-red-500', 'text-white', 'px-2', 'mt-2', 'w-20');
            deleteButton.addEventListener('click', () => {
                this.paymentMethods.splice(index, 1);
                this.render();
            });

            methodBox.appendChild(cardInfo);
            methodBox.appendChild(deleteButton);

            paymentMethodsBox.appendChild(methodBox);
        });

        // Payment method input form (only visible if showPaymentMethodForm is true)
        if (this.showPaymentMethodForm) {
            const paymentMethodInputBox = document.createElement('div');
            paymentMethodInputBox.classList.add(
                'appearance-none', 'border', 'border-2', 'border-gray-100', 'rounded', 'w-full',
                'py-2', 'px-6', 'text-gray-700', 'leading-tight', 'focus:outline-none', 'mt-8'
            );

            // Create inputs for new card
            const cardNumberInput = this.standardInputBox('Card Number', 'XXXX-XXXX-XXXX-XXXX');
            const expiryMonthInput = this.standardInputBox('Expiry Month', 'MM');
            const expiryYearInput = this.standardInputBox('Expiry Year', 'YY');
            const cvvInput = this.standardInputBox('CVV', '123');
            const cardNameInput = this.standardInputBox('Name on Card', 'Enter name as shown on card');

            // We'll need to get their input fields:
            const cardNumberField = cardNumberInput.querySelector('input');
            const expiryMonthField = expiryMonthInput.querySelector('input');
            const expiryYearField = expiryYearInput.querySelector('input');
            const cvvField = cvvInput.querySelector('input');
            const cardNameField = cardNameInput.querySelector('input');

            const monthYearCvvInputBox = document.createElement('div');
            monthYearCvvInputBox.classList.add('grid', 'grid-cols-3', 'gap-4');
            monthYearCvvInputBox.append(expiryMonthInput, expiryYearInput, cvvInput);

            const addCardButton = document.createElement('button');
            addCardButton.innerText = 'Add Card';
            addCardButton.classList.add('rounded', 'bg-[#5B91C8]', 'text-white', 'my-4', 'py-2', 'px-4');

            // On clicking Add Card, push new card details into this.paymentMethods
            addCardButton.addEventListener('click', () => {
                const cardNumberVal = cardNumberField.value.trim();
                const expiryMonthVal = expiryMonthField.value.trim();
                const expiryYearVal = expiryYearField.value.trim();
                const cvvVal = cvvField.value.trim();
                const cardNameVal = cardNameField.value.trim();

                if (cardNumberVal && expiryMonthVal && expiryYearVal && cvvVal && cardNameVal) {
                    this.paymentMethods.push({
                        cardNumber: cardNumberVal,
                        expiryMonth: expiryMonthVal,
                        expiryYear: expiryYearVal,
                        cvv: cvvVal,
                        cardName: cardNameVal
                    });
                    // Clear the fields
                    cardNumberField.value = '';
                    expiryMonthField.value = '';
                    expiryYearField.value = '';
                    cvvField.value = '';
                    cardNameField.value = '';

                    // Hide the form and re-render to show the updated list
                    this.showPaymentMethodForm = false;
                    this.render();
                }
            });

            paymentMethodInputBox.append(cardNumberInput, monthYearCvvInputBox, cardNameInput, addCardButton);
            paymentMethodsBox.appendChild(paymentMethodInputBox);
        }

        this.rightSide.appendChild(paymentMethodsBox);
    }

    /**
     * Render the order history section.
     * Displays a list of previously made orders.
     */
    renderOrderHistory() {
        const orderHistoryDiv = document.createElement('div');
        orderHistoryDiv.classList.add(
            'flex', 'flex-col', 'p-8', 'rounded-md', 'border', 'border-2', 'border-gray-200'
        );

        const orderHistoryHeader = document.createElement('p');
        orderHistoryHeader.innerText = 'Order History';
        orderHistoryHeader.classList.add('text-xl', 'font-bold');
        orderHistoryDiv.appendChild(orderHistoryHeader);

        // Display orders
        this.orders.forEach((order) => {
            const orderDetailsDiv = document.createElement('div');
            orderDetailsDiv.classList.add('bg-slate-100', 'rounded-md', 'p-4', 'mt-4');

            const orderLabel = document.createElement('p');
            orderLabel.classList.add('block', 'text-sm', 'font-bold', 'text-gray-700', 'mb-2');
            orderLabel.innerText = `Order ID: ${order.id}`;

            const orderDate = document.createElement('p');
            orderDate.innerText = `Order Date: ${order.date}`;

            const orderTotal = document.createElement('p');
            orderTotal.innerText = `Order Total: $${order.total}`;

            const orderItems = document.createElement('p');
            orderItems.innerText = `Items: ${order.items.join(', ')}`;

            orderDetailsDiv.appendChild(orderLabel);
            orderDetailsDiv.appendChild(orderDate);
            orderDetailsDiv.appendChild(orderTotal);
            orderDetailsDiv.appendChild(orderItems);

            orderHistoryDiv.appendChild(orderDetailsDiv);
        });

        this.rightSide.appendChild(orderHistoryDiv);
    }

    /**
     * Create a labeled input field.
     * @param {string} labelText
     * @param {string} inputId
     * @param {string} placeholder
     * @param {string} type
     * @returns {HTMLDivElement} A div containing label and input.
     */
    createInputField(labelText, inputId, placeholder, type) {
        const div = document.createElement('div');
        div.classList.add('my-4');

        const label = document.createElement('label');
        label.classList.add('block', 'text-sm', 'font-bold', 'text-gray-700', 'mb-2');
        label.innerText = labelText;
        label.htmlFor = inputId;

        const input = document.createElement('input');
        input.type = type;
        input.id = inputId;
        input.placeholder = placeholder;
        input.classList.add(
            'appearance-none', 'border', 'border-2', 'border-gray-200', 'rounded',
            'w-full', 'py-2', 'px-3', 'text-gray-700', 'leading-tight', 'focus:outline-none'
        );

        div.appendChild(label);
        div.appendChild(input);
        return div;
    }

    /**
     * Create a standard input box with a top label.
     * @param {string} topLabelText
     * @param {string} inputPlaceholder
     * @returns {HTMLDivElement} A div containing label and input.
     */
    standardInputBox(topLabelText, inputPlaceholder) {
        const inputDiv = document.createElement('div');
        inputDiv.classList.add('mt-4');

        const inputLabel = document.createElement('label');
        inputLabel.classList.add('block', 'text-sm', 'font-bold', 'text-gray-700', 'mb-2');
        inputLabel.innerText = topLabelText;

        const inputBox = document.createElement('input');
        inputBox.type = 'text';
        inputBox.placeholder = inputPlaceholder;
        inputBox.classList.add(
            'appearance-none', 'border', 'border-2', 'border-gray-200', 'rounded',
            'w-full', 'py-2', 'px-3', 'text-gray-700', 'leading-tight', 'focus:outline-none'
        );

        inputDiv.appendChild(inputLabel);
        inputDiv.appendChild(inputBox);
        return inputDiv;
    }
}
