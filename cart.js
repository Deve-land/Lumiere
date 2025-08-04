// Cart Page JavaScript

// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart page loaded');
    
    // Load cart items
    loadCartItems();
});

// Load cart items from localStorage
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsList = document.querySelector('.cart-items-list');
    const emptyCart = document.querySelector('.empty-cart');
    const cartItems = document.querySelector('.cart-items');
    
    if (cart.length === 0) {
        // Show empty cart message
        cartItems.style.display = 'none';
        emptyCart.style.display = 'block';
        updateCartSummary(0, 0);
        return;
    }
    
    // Show cart items
    cartItems.style.display = 'block';
    emptyCart.style.display = 'none';
    
    // Clear existing items
    cartItemsList.innerHTML = '';
    
    // Render each cart item
    cart.forEach((item, index) => {
        const cartItem = createCartItemElement(item, index);
        cartItemsList.appendChild(cartItem);
    });
    
    // Update summary
    updateCartSummary();
}

// Create cart item element
function createCartItemElement(item, index) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.index = index;
    
    // Create unique key for item identification
    const itemKey = `${item.id}-${item.fragrance || 'default'}-${item.size || 'default'}`;
    
    cartItem.innerHTML = `
        <div class="cart-item-image">
            <div>${item.emoji || '🕯️'}</div>
        </div>
        <div class="cart-item-info">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-details">
                ${item.fragrance ? `رایحه: ${getFragranceName(item.fragrance)}` : ''}
                ${item.size ? ` | سایز: ${getSizeName(item.size)}` : ''}
            </div>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
        </div>
        <div class="cart-item-actions">
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="decreaseQuantity(${index})">-</button>
                <input type="number" value="${item.quantity}" min="1" max="10" 
                       class="quantity-input" onchange="updateQuantity(${index}, this.value)">
                <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i>
                حذف
            </button>
        </div>
    `;
    
    return cartItem;
}

// Get fragrance name in Persian
function getFragranceName(fragrance) {
    const fragranceNames = {
        'vanilla': 'وانیل',
        'lavender': 'اسطوخودوس',
        'cinnamon': 'دارچین'
    };
    return fragranceNames[fragrance] || fragrance;
}

// Get size name in Persian
function getSizeName(size) {
    const sizeNames = {
        'small': 'کوچک',
        'medium': 'متوسط',
        'large': 'بزرگ'
    };
    return sizeNames[size] || size;
}

// Decrease quantity
function decreaseQuantity(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index] && cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartIcon();
    }
}

// Increase quantity
function increaseQuantity(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index] && cart[index].quantity < 10) {
        cart[index].quantity++;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartIcon();
    }
}

// Update quantity from input
function updateQuantity(index, newQuantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const quantity = parseInt(newQuantity);
    
    if (cart[index] && quantity >= 1 && quantity <= 10) {
        cart[index].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartIcon();
    } else {
        // Reset to previous value if invalid
        loadCartItems();
    }
}

// Remove item from cart
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart[index]) {
        const itemName = cart[index].name;
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Show notification
        showNotification(`${itemName} از سبد خرید حذف شد`, 'info');
        
        // Reload cart
        loadCartItems();
        updateCartIcon();
    }
}

// Update cart summary
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Update item count
    const itemCountElement = document.querySelector('.item-count');
    if (itemCountElement) {
        itemCountElement.textContent = `${totalItems} محصول`;
    }
    
    // Update summary items
    const totalItemsElement = document.querySelector('.total-items');
    const subtotalElement = document.querySelector('.subtotal');
    const totalAmountElement = document.querySelector('.total-amount');
    
    if (totalItemsElement) {
        totalItemsElement.textContent = totalItems;
    }
    
    if (subtotalElement) {
        subtotalElement.textContent = formatPrice(subtotal);
    }
    
    // Calculate shipping cost
    const shippingCost = subtotal >= 500000 ? 0 : 50000;
    const totalAmount = subtotal + shippingCost;
    
    const shippingCostElement = document.querySelector('.shipping-cost');
    if (shippingCostElement) {
        shippingCostElement.textContent = shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost);
    }
    
    if (totalAmountElement) {
        totalAmountElement.textContent = formatPrice(totalAmount);
    }
    
    // Update checkout button state
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = totalItems === 0;
    }
}

// Update cart icon
function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        if (totalItems > 0) {
            cartIcon.innerHTML = `<i class="fas fa-shopping-cart"></i><span class="cart-count">${totalItems}</span>`;
        } else {
            cartIcon.innerHTML = '<i class="fas fa-shopping-cart"></i>';
        }
    }
}

// Continue shopping
function continueShopping() {
    window.location.href = 'products.html';
}

// Proceed to checkout
function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        showNotification('سبد خرید شما خالی است', 'error');
        return;
    }
    
    // In a real application, this would redirect to a checkout page
    // For now, we'll show a success message
    showNotification('در حال انتقال به صفحه پرداخت...', 'success');
    
    // Simulate checkout process
    setTimeout(() => {
        showNotification('سفارش شما با موفقیت ثبت شد!', 'success');
        // Clear cart after successful checkout
        localStorage.removeItem('cart');
        loadCartItems();
        updateCartIcon();
    }, 2000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: 'Vazirmatn', sans-serif;
        font-weight: 500;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Format price with Persian numbers
function formatPrice(price) {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const priceString = price.toString();
    let formattedPrice = '';
    
    for (let i = 0; i < priceString.length; i++) {
        formattedPrice += persianNumbers[parseInt(priceString[i])];
    }
    
    // Add thousand separators
    const parts = formattedPrice.split('');
    for (let i = parts.length - 3; i > 0; i -= 3) {
        parts.splice(i, 0, ',');
    }
    
    return parts.join('') + ' تومان';
} 