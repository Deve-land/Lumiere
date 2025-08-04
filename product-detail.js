// Product Detail Page JavaScript

// Tab functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Product detail page loaded');
    
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Tab button clicked:', button.getAttribute('data-tab'));
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // Thumbnail image switching
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.candle-emoji-large');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            console.log('Thumbnail clicked');
            // Remove active class from all thumbnails
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            thumbnail.classList.add('active');
            
            // Update main image (in a real app, this would change the actual image)
            // For now, we'll just add a subtle animation
            if (mainImage) {
                mainImage.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    mainImage.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });

    // Option button functionality
    const optionButtons = document.querySelectorAll('.option-btn');
    console.log('Found option buttons:', optionButtons.length);
    
    optionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Option button clicked:', button.getAttribute('data-value'));
            
            // Add visual feedback
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            const optionGroup = button.closest('.option-group');
            const buttonsInGroup = optionGroup.querySelectorAll('.option-btn');
            
            // Remove active class from all buttons in the same group
            buttonsInGroup.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update product price based on selection
            updatePrice();
        });
    });

    // Quantity input validation
    const quantityInput = document.querySelector('.quantity-input');
    if (quantityInput) {
        quantityInput.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (value < 1) this.value = 1;
            if (value > 10) this.value = 10;
        });
    }

    // Add event listeners for quantity buttons
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    console.log('Found quantity buttons:', quantityBtns.length);
    
    quantityBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Quantity button clicked:', index === 0 ? 'decrease' : 'increase');
            
            // Add visual feedback
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
            
            if (index === 0) {
                decreaseQuantity();
            } else {
                increaseQuantity();
            }
        });
    });

    // Initialize wishlist state and add event listeners
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    
    console.log('Found wishlist button:', !!wishlistBtn);
    console.log('Found add to cart button:', !!addToCartBtn);
    
    // Add event listeners for action buttons
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Wishlist button clicked');
            
            // Add visual feedback
            wishlistBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                wishlistBtn.style.transform = '';
            }, 150);
            
            toggleWishlist();
        });
    }
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Add to cart button clicked');
            
            // Add visual feedback
            addToCartBtn.style.transform = 'scale(0.98)';
            setTimeout(() => {
                addToCartBtn.style.transform = '';
            }, 150);
            
            addToCart();
        });
    }
    
    const isInWishlist = localStorage.getItem('wishlist') ? 
        JSON.parse(localStorage.getItem('wishlist')).includes('vanilla-candle') : false;
    
    if (isInWishlist && wishlistBtn) {
        wishlistBtn.classList.add('active');
        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
    }

    // Initialize page
    updateCartIcon();
    updatePrice();

    // Make related products clickable
    const relatedProducts = document.querySelectorAll('.related-product');
    relatedProducts.forEach(product => {
        product.addEventListener('click', () => {
            // In a real app, this would navigate to the specific product detail page
            // For now, we'll just show a notification
            const productName = product.querySelector('h4').textContent;
            showNotification(`در حال بارگذاری ${productName}...`, 'info');
        });
    });
});

// Quantity controls
function decreaseQuantity() {
    const quantityInput = document.querySelector('.quantity-input');
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
}

function increaseQuantity() {
    const quantityInput = document.querySelector('.quantity-input');
    let currentValue = parseInt(quantityInput.value);
    if (currentValue < 10) {
        quantityInput.value = currentValue + 1;
    }
}

// Update price based on selected options
function updatePrice() {
    const fragranceBtn = document.querySelector('.option-group:first-child .option-btn.active');
    const sizeBtn = document.querySelector('.option-group:last-child .option-btn.active');
    
    let basePrice = 250000; // Base price for vanilla medium size
    
    // Adjust price based on fragrance
    if (fragranceBtn && fragranceBtn.getAttribute('data-value') === 'lavender') {
        basePrice += 30000;
    } else if (fragranceBtn && fragranceBtn.getAttribute('data-value') === 'cinnamon') {
        basePrice += 50000;
    }
    
    // Adjust price based on size
    if (sizeBtn && sizeBtn.getAttribute('data-value') === 'small') {
        basePrice -= 50000;
    } else if (sizeBtn && sizeBtn.getAttribute('data-value') === 'large') {
        basePrice += 80000;
    }
    
    // Update displayed price
    const currentPriceElement = document.querySelector('.current-price');
    if (currentPriceElement) {
        currentPriceElement.textContent = formatPrice(basePrice);
    }
}

// Add to cart functionality
function addToCart() {
    const productName = document.querySelector('.product-title').textContent;
    const quantity = parseInt(document.querySelector('.quantity-input').value);
    const fragrance = document.querySelector('.option-group:first-child .option-btn.active').getAttribute('data-value');
    const size = document.querySelector('.option-group:last-child .option-btn.active').getAttribute('data-value');
    
    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Create cart item
    const cartItem = {
        id: 'vanilla-candle',
        name: productName,
        price: 250000,
        quantity: quantity,
        fragrance: fragrance,
        size: size,
        emoji: '🕯️'
    };
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => 
        item.id === cartItem.id && 
        item.fragrance === cartItem.fragrance && 
        item.size === cartItem.size
    );
    
    if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.push(cartItem);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart icon
    updateCartIcon();
    
    // Show success notification
    showNotification('محصول به سبد خرید اضافه شد!', 'success');
}

// Toggle wishlist functionality
function toggleWishlist() {
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const productId = 'vanilla-candle';
    
    // Get current wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (wishlistBtn.classList.contains('active')) {
        // Remove from wishlist
        wishlist = wishlist.filter(id => id !== productId);
        wishlistBtn.classList.remove('active');
        wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
        showNotification('از علاقه‌مندی‌ها حذف شد', 'info');
    } else {
        // Add to wishlist
        wishlist.push(productId);
        wishlistBtn.classList.add('active');
        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
        showNotification('به علاقه‌مندی‌ها اضافه شد!', 'success');
    }
    
    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Update cart icon with item count
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

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateCartIcon();
    updatePrice();
}); 