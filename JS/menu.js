let cart = [];
let menuData = {};
let DELIVERY_FEE = 3.00;


$(function() {
    loadMenuData();
    setupEventListeners();
});


function loadMenuData() {
    $.getJSON('data.json', function(data) {
        menuData = data;
        initializePage();
    }).fail(function() {
        console.error('Error loading menu data');
        alert('Failed to load menu. Please refresh the page.');
    });
}

function initializePage() {
    populateCategories();
    displayAllMenuItems();
    loadCartFromStorage();
    updateCartDisplay();
    setupOrderTypeListeners();
}

function populateCategories() {
    let categoryFilter = $('.category-filter');
    categoryFilter.empty();
    
    let allButton = $('<button>')
        .addClass('filter-btn active')
        .attr('data-category', 'all')
        .text('All Categories')
        .click(function() {
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');
            displayAllMenuItems();
        });
    
    categoryFilter.append(allButton);
    
    menuData.menuCategories.forEach(function(category) {
        let filterButton = $('<button>')
            .addClass('filter-btn')
            .attr('data-category', category.id)
            .text(category.name)
            .click(function() {
                $('.filter-btn').removeClass('active');
                $(this).addClass('active');
                displayMenuItems(category.id);
            });
        
        categoryFilter.append(filterButton);
    });
}

function displayAllMenuItems() {
    let menuItemsContainer = $('#menu-items');
    menuItemsContainer.empty();
    
    menuData.menuCategories.forEach(function(category) {
        displayCategoryItems(category, menuItemsContainer);
    });
}

function displayMenuItems(categoryId) {
    let menuItemsContainer = $('#menu-items');
    menuItemsContainer.empty();
    
    if (categoryId === 'all') {
        displayAllMenuItems();
        return;
    }
    
    let category = menuData.menuCategories.find(cat => cat.id === categoryId);
    if (category) {
        displayCategoryItems(category, menuItemsContainer);
    }
}

function displayCategoryItems(category, container) {
    if (!category.items || category.items.length === 0) return;
    
    let categorySection = $('<div>')
        .addClass('category-section')
        .attr('data-category', category.id);
    
    let categoryHeader = $('<div>').addClass('category-header');
    let categoryTitle = $('<h3>').text(category.name);
    categoryHeader.append(categoryTitle);
    
    let itemsGrid = $('<div>').addClass('items-grid');
    
    category.items.forEach(function(item) {
        let menuItem = createMenuItem(item);
        itemsGrid.append(menuItem);
    });
    
    categorySection.append(categoryHeader, itemsGrid);
    container.append(categorySection);
}

function createMenuItem(item) {
    let menuItem = $('<div>').addClass('menu-item');
    
    if (item.image) {
        let itemImage = $('<div>').addClass('item-image');
        let img = $('<img>')
            .attr('src', item.image)
            .attr('alt', item.name);
        itemImage.append(img);
        menuItem.append(itemImage);
    }
    
    let itemContent = $('<div>').addClass('item-content');
    
    let itemHeader = $('<div>').addClass('item-header');
    let itemName = $('<h4>').addClass('item-name').text(item.name);
    let itemPrice = $('<div>').addClass('item-price').text('$' + parseFloat(item.price).toFixed(2));
    itemHeader.append(itemName, itemPrice);
    
    let itemDescription = $('<p>').addClass('item-description').text(item.description);
    
    let itemActions = $('<div>').addClass('item-actions');
    
    let quantityControls = $('<div>').addClass('quantity-controls');
    let minusBtn = $('<button>').addClass('quantity-btn minus').text('-');
    let quantity = $('<span>').addClass('quantity').text('1');
    let plusBtn = $('<button>').addClass('quantity-btn plus').text('+');
    
    minusBtn.click(function() {
        let currentQuantity = parseInt(quantity.text());
        if (currentQuantity > 1) {
            quantity.text(currentQuantity - 1);
        }
    });
    
    plusBtn.click(function() {
        let currentQuantity = parseInt(quantity.text());
        quantity.text(currentQuantity + 1);
    });
    
    quantityControls.append(minusBtn, quantity, plusBtn);
    
    let addToCartBtn = $('<button>')
        .addClass('add-to-cart-btn')
        .html('<i class="fas fa-shopping-cart"></i> Add to Cart')
        .click(function() {
            let quantity = parseInt($(this).siblings('.quantity-controls').find('.quantity').text());
            addToCart(item.id, item.name, item.price, quantity);
            showCartNotification(quantity + 'x ' + item.name + ' added to cart!');
        });
    
    itemActions.append(quantityControls, addToCartBtn);
    itemContent.append(itemHeader, itemDescription, itemActions);
    menuItem.append(itemContent);
    
    return menuItem;
}


function addToCart(itemId, itemName, itemPrice, quantity) {
    let price = parseFloat(itemPrice);
    
    let existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: itemId,
            name: itemName,
            price: price,
            quantity: quantity
        });
    }
    
    updateCartDisplay();
    saveCartToStorage();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
    saveCartToStorage();
}

function updateCartQuantity(itemId, newQuantity) {
    let item = cart.find(item => item.id === itemId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = newQuantity;
        }
    }
    updateCartDisplay();
    saveCartToStorage();
}

function updateCartDisplay() {
    let cartCount = $('.cart-count');
    let cartItems = $('#cart-items');
    let subtotalElement = $('.subtotal');
    let deliveryFeeElement = $('.delivery-fee');
    let totalElement = $('.total');
    
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.text(totalItems);
    
    cartItems.empty();
    
    if (cart.length === 0) {
        let emptyCart = $('<p>').addClass('empty-cart').text('Your cart is empty');
        cartItems.append(emptyCart);
        subtotalElement.text('$0.00');
        deliveryFeeElement.text('$0.00');
        totalElement.text('$0.00');
        return;
    }
    
    let subtotal = 0;
    
    cart.forEach(function(item) {
        let price = parseFloat(item.price);
        let itemTotal = price * item.quantity;
        subtotal += itemTotal;
        
        let cartItem = $('<div>').addClass('cart-item');
        
        let cartItemInfo = $('<div>').addClass('cart-item-info');
        let cartItemName = $('<div>').addClass('cart-item-name').text(item.name);
        let cartItemPrice = $('<div>').addClass('cart-item-price').text('$' + price.toFixed(2));
        cartItemInfo.append(cartItemName, cartItemPrice);
        
        let cartItemControls = $('<div>').addClass('cart-item-controls');
        let minusBtn = $('<button>')
            .addClass('cart-quantity-btn minus')
            .attr('data-id', item.id)
            .html('&minus;');
        let quantity = $('<span>').addClass('cart-quantity').text(item.quantity);
        let plusBtn = $('<button>')
            .addClass('cart-quantity-btn plus')
            .attr('data-id', item.id)
            .html('&plus;');
        let removeBtn = $('<button>')
            .addClass('remove-item')
            .attr('data-id', item.id)
            .html('<i class="fas fa-trash"></i>');
        
        cartItemControls.append(minusBtn, quantity, plusBtn, removeBtn);
        cartItem.append(cartItemInfo, cartItemControls);
        cartItems.append(cartItem);
    });
    
    let orderType = $('input[name="orderType"]:checked').val();
    let deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0;
    let total = subtotal + deliveryFee;
    
    subtotalElement.text('$' + subtotal.toFixed(2));
    deliveryFeeElement.text('$' + deliveryFee.toFixed(2));
    totalElement.text('$' + total.toFixed(2));
}

function setupEventListeners() {
    $('.cart-button').click(openCart);
    $('.close-cart').click(closeCart);
    $('.cart-overlay').click(closeCart);
    $('.checkout-btn').click(proceedToCheckout);
    
    $(document).on('click', '.cart-quantity-btn', function() {
        let itemId = $(this).attr('data-id');
        let item = cart.find(item => item.id === itemId);
        
        if (item) {
            if ($(this).hasClass('plus')) {
                updateCartQuantity(itemId, item.quantity + 1);
            } else if ($(this).hasClass('minus')) {
                updateCartQuantity(itemId, item.quantity - 1);
            }
        }
    });
    
    $(document).on('click', '.remove-item', function() {
        let itemId = $(this).attr('data-id');
        removeFromCart(itemId);
    });
    
    $('.hamburger').click(function() {
        $('.nav-links').toggleClass('active');
    });
}

function setupOrderTypeListeners() {
    $('input[name="orderType"]').change(function() {
        let orderType = $(this).val();
        let deliverySection = $('#delivery-section');
        let takeawaySection = $('#takeaway-section');
        
        if (orderType === 'delivery') {
            
            deliverySection.removeClass('hidden');
            takeawaySection.addClass('hidden');
        } else {
            
            deliverySection.addClass('hidden');
            takeawaySection.removeClass('hidden');
        }
        
        updateCartDisplay();
    });
}

function openCart() {
    $('.cart-sidebar').addClass('active');
    $('.cart-overlay').addClass('active');
    $('body').css('overflow', 'hidden');
}

function closeCart() {
    $('.cart-sidebar').removeClass('active');
    $('.cart-overlay').removeClass('active');
    $('body').css('overflow', 'auto');
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    let orderType = $('input[name="orderType"]:checked').val();
    
    
    let deliveryPhone = $('#delivery-phone').val().trim();
    let deliveryAddress = $('#delivery-address').val().trim();
    let takeawayPhone = $('#takeaway-phone').val().trim();
    let takeawayBranch = $('#takeaway-branch').val();
    

    if (orderType === 'delivery') {
        if (!deliveryPhone) {
            alert('Please enter your phone number for delivery.');
            return;
        }
        if (!deliveryAddress) {
            alert('Please enter your delivery address.');
            return;
        }
    } else {
        if (!takeawayPhone) {
            alert('Please enter your phone number for pickup.');
            return;
        }
        if (!takeawayBranch) {
            alert('Please select a pickup branch.');
            return;
        }
    }
    
    
    let subtotal = cart.reduce((sum, item) => {
        let price = parseFloat(item.price);
        return sum + (price * item.quantity);
    }, 0);
    
    let deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0;
    let total = subtotal + deliveryFee;
    

    let orderConfirmation = $('<div>').addClass('order-confirmation');
    

    let confirmationHeader = $('<div>').addClass('confirmation-header');
    let checkIcon = $('<i>').addClass('fas fa-check-circle');
    let headerText = $('<h3>').text('Order Confirmed!');
    confirmationHeader.append(checkIcon, headerText);
    
    
    let orderDetails = $('<div>').addClass('order-details');
    let detailsHeader = $('<h4>').text('Order Summary:');
    let orderItems = $('<div>').addClass('order-items');
    
    cart.forEach(function(item) {
        let price = parseFloat(item.price);
        let itemTotal = price * item.quantity;
        
        let orderItem = $('<div>').addClass('order-item');
        let itemQuantity = $('<span>').addClass('item-quantity').text(item.quantity + 'x');
        let itemName = $('<span>').addClass('item-name').text(item.name);
        let itemTotalSpan = $('<span>').addClass('item-total').text('$' + itemTotal.toFixed(2));
        
        orderItem.append(itemQuantity, itemName, itemTotalSpan);
        orderItems.append(orderItem);
    });
    
    
    let orderTotals = $('<div>').addClass('order-totals');
    let subtotalLine = $('<div>').addClass('total-line');
    subtotalLine.append($('<span>').text('Subtotal:'), $('<span>').text('$' + subtotal.toFixed(2)));
    
    let deliveryLine = $('<div>').addClass('total-line');
    deliveryLine.append($('<span>').text('Delivery Fee:'), $('<span>').text('$' + deliveryFee.toFixed(2)));
    
    let totalLine = $('<div>').addClass('total-line grand-total');
    totalLine.append($('<span>').text('Total:'), $('<span>').text('$' + total.toFixed(2)));
    
    orderTotals.append(subtotalLine, deliveryLine, totalLine);
    orderDetails.append(detailsHeader, orderItems, orderTotals);
    
    
    let infoSection;
    if (orderType === 'delivery') {
        infoSection = $('<div>').addClass('delivery-info');
        
        let typeLine = $('<p>');
        typeLine.append($('<strong>').text('Order Type:'));
        typeLine.append(' Delivery ');
        typeLine.append($('<span>').addClass('order-type-badge').text('🚚 Delivery'));
        
        let phoneLine = $('<p>');
        phoneLine.append($('<strong>').text('Phone:'));
        phoneLine.append(' ' + deliveryPhone);
        
        let addressLine = $('<p>');
        addressLine.append($('<strong>').text('Delivery Address:'));
        addressLine.append(' ' + deliveryAddress);
        
        let timeLine = $('<p>');
        timeLine.append($('<i>').addClass('fas fa-clock'));
        timeLine.append(' Estimated delivery: ');
        timeLine.append($('<strong>').text('30-45 minutes'));
        
        let contactLine = $('<p>');
        contactLine.append($('<i>').addClass('fas fa-phone'));
        contactLine.append(' Need help? Call: ');
        contactLine.append($('<strong>').text('+961 71 489 924'));
        
        infoSection.append(typeLine, phoneLine, addressLine, timeLine, contactLine);
    } else {
        let locationName = getLocationName(takeawayBranch);
        infoSection = $('<div>').addClass('takeaway-info');
        
        let typeLine = $('<p>');
        typeLine.append($('<strong>').text('Order Type:'));
        typeLine.append(' Takeaway ');
        typeLine.append($('<span>').addClass('order-type-badge').text('🍽️ Takeaway'));
        
        let phoneLine = $('<p>');
        phoneLine.append($('<strong>').text('Phone:'));
        phoneLine.append(' ' + takeawayPhone);
        
        let locationLine = $('<p>');
        locationLine.append($('<strong>').text('Pickup Branch:'));
        locationLine.append(' ' + locationName);
        
        let timeLine = $('<p>');
        timeLine.append($('<i>').addClass('fas fa-clock'));
        timeLine.append(' Estimated preparation: ');
        timeLine.append($('<strong>').text('20-30 minutes'));
        
        let contactLine = $('<p>');
        contactLine.append($('<i>').addClass('fas fa-phone'));
        contactLine.append(' Need help? Call: ');
        contactLine.append($('<strong>').text('+961 71 489 924'));
        
        infoSection.append(typeLine, phoneLine, locationLine, timeLine, contactLine);
    }
    
    
    let confirmationActions = $('<div>').addClass('confirmation-actions');
    let closeButton = $('<button>')
        .addClass('btn btn-secondary')
        .html('<i class="fas fa-times"></i> Close')
        .click(function() {
            closeCart();
        });
    
    confirmationActions.append(closeButton);
    

    orderConfirmation.append(confirmationHeader, orderDetails, infoSection, confirmationActions);
    
    
    $('#cart-items').empty().append(orderConfirmation);
    
    
    let successMessage = $('<div>').addClass('order-success-message');
    successMessage.append($('<p>').text('Your order has been placed successfully!'));
    $('.cart-total').empty().append(successMessage);
    
    
    cart = [];
    saveCartToStorage();
    
    
    if (orderType === 'delivery') {
        $('#delivery-phone').val('');
        $('#delivery-address').val('');
    } else {
        $('#takeaway-phone').val('');
        $('#takeaway-branch').val('');
    }
    
    
    $('.cart-count').text('0');
}

function getLocationName(locationValue) {
    const locations = {
        'baakline': 'Baakline Branch',
        'hamra': 'Hamra Branch', 
        'aley': 'Aley Branch'
    };
    return locations[locationValue] || 'Selected Branch';
}

function showCartNotification(message) {
    let notification = $('<div>').addClass('cart-notification');
    let notificationContent = $('<div>').addClass('notification-content');
    let icon = $('<i>').addClass('fas fa-check-circle');
    let text = $('<span>').text(message);
    
    notificationContent.append(icon, text);
    notification.append(notificationContent);
    
    $('body').append(notification);
    
    setTimeout(() => notification.addClass('show'), 100);
    setTimeout(() => {
        notification.removeClass('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function saveCartToStorage() {
    localStorage.setItem('sushiBellCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    let savedCart = localStorage.getItem('sushiBellCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            cart.forEach(item => {
                item.price = parseFloat(item.price);
            });
            updateCartDisplay();
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            cart = [];
        }
    }
}