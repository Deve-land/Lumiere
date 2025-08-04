// Products Data
const productsData = [
    {
        id: 1,
        name: "شمع وانیل",
        description: "رایحه گرم و دلپذیر وانیل",
        price: 250000,
        fragrance: "vanilla",
        color: "cream",
        rating: 4.8,
        isNew: true,
        isPopular: true,
        emoji: "🕯️"
    },
    {
        id: 2,
        name: "شمع اسطوخودوس",
        description: "آرامش بخش و تسکین دهنده",
        price: 280000,
        fragrance: "lavender",
        color: "purple",
        rating: 4.9,
        isNew: false,
        isPopular: true,
        emoji: "🕯️"
    },
    {
        id: 3,
        name: "شمع دارچین",
        description: "رایحه گرم و خوشایند دارچین",
        price: 220000,
        fragrance: "cinnamon",
        color: "cream",
        rating: 4.7,
        isNew: false,
        isPopular: false,
        emoji: "🕯️"
    },
    {
        id: 4,
        name: "شمع رمانتیک",
        description: "مناسب برای لحظات خاص",
        price: 320000,
        fragrance: "rose",
        color: "pink",
        rating: 4.9,
        isNew: true,
        isPopular: true,
        emoji: "🕯️"
    },
    {
        id: 5,
        name: "شمع مدیتیشن",
        description: "آرامش ذهن و روح",
        price: 290000,
        fragrance: "jasmine",
        color: "blue",
        rating: 4.6,
        isNew: false,
        isPopular: false,
        emoji: "🕯️"
    },
    {
        id: 6,
        name: "شمع تولد",
        description: "جشن و شادی در هر لحظه",
        price: 260000,
        fragrance: "vanilla",
        color: "pink",
        rating: 4.5,
        isNew: false,
        isPopular: false,
        emoji: "🕯️"
    },
    {
        id: 7,
        name: "شمع یاس",
        description: "رایحه ملایم و دلپذیر یاس",
        price: 270000,
        fragrance: "jasmine",
        color: "white",
        rating: 4.7,
        isNew: true,
        isPopular: false,
        emoji: "🕯️"
    },
    {
        id: 8,
        name: "شمع گل سرخ",
        description: "رایحه رمانتیک و احساسی",
        price: 300000,
        fragrance: "rose",
        color: "pink",
        rating: 4.8,
        isNew: false,
        isPopular: true,
        emoji: "🕯️"
    },
    {
        id: 9,
        name: "شمع آرامش",
        description: "برای لحظات آرام و مدیتیشن",
        price: 240000,
        fragrance: "lavender",
        color: "purple",
        rating: 4.6,
        isNew: false,
        isPopular: false,
        emoji: "🕯️"
    },
    {
        id: 10,
        name: "شمع گرم",
        description: "رایحه گرم و دلپذیر",
        price: 230000,
        fragrance: "cinnamon",
        color: "cream",
        rating: 4.5,
        isNew: false,
        isPopular: false,
        emoji: "🕯️"
    },
    {
        id: 11,
        name: "شمع ویژه",
        description: "محصول ویژه با کیفیت بالا",
        price: 350000,
        fragrance: "vanilla",
        color: "white",
        rating: 5.0,
        isNew: true,
        isPopular: true,
        emoji: "🕯️"
    },
    {
        id: 12,
        name: "شمع طبیعت",
        description: "رایحه طبیعی و تازه",
        price: 200000,
        fragrance: "jasmine",
        color: "green",
        rating: 4.4,
        isNew: false,
        isPopular: false,
        emoji: "🕯️"
    }
];

// Global variables
let filteredProducts = [...productsData];
let currentView = 'grid';
let displayedCount = 6;

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const resultsCount = document.getElementById('resultsCount');
const viewButtons = document.querySelectorAll('.view-btn');
const clearFiltersBtn = document.querySelector('.clear-filters');
const loadMoreBtn = document.querySelector('.load-more-btn');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    setupEventListeners();
    updateResultsCount();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', debounce(filterProducts, 300));
    
    // Sort functionality
    sortSelect.addEventListener('change', filterProducts);
    
    // Price range
    priceRange.addEventListener('input', function() {
        priceValue.textContent = formatPrice(this.value) + ' تومان';
        filterProducts();
    });
    
    // Checkbox filters
    document.querySelectorAll('.checkbox-item input').forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });
    
    // Color filters
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('active');
            filterProducts();
        });
    });
    
    // View toggle
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.dataset.view;
            updateView();
        });
    });
    
    // Clear filters
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    // Load more
    loadMoreBtn.addEventListener('click', loadMore);
}

// Filter products based on all criteria
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const maxPrice = parseInt(priceRange.value);
    const selectedFragrances = getSelectedCheckboxes('checkbox-item');
    const selectedColors = getSelectedColors();
    const sortBy = sortSelect.value;
    
    filteredProducts = productsData.filter(product => {
        // Search filter
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        
        // Price filter
        const matchesPrice = product.price <= maxPrice;
        
        // Fragrance filter
        const matchesFragrance = selectedFragrances.length === 0 || 
                                selectedFragrances.includes(product.fragrance);
        
        // Color filter
        const matchesColor = selectedColors.length === 0 || 
                           selectedColors.includes(product.color);
        
        return matchesSearch && matchesPrice && matchesFragrance && matchesColor;
    });
    
    // Sort products
    sortProducts(sortBy);
    
    // Reset display count
    displayedCount = 6;
    
    // Render products
    renderProducts();
    updateResultsCount();
}

// Get selected checkboxes
function getSelectedCheckboxes(className) {
    const checkboxes = document.querySelectorAll(`.${className} input:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

// Get selected colors
function getSelectedColors() {
    const activeColors = document.querySelectorAll('.color-option.active');
    return Array.from(activeColors).map(option => option.dataset.color);
}

// Sort products
function sortProducts(sortBy) {
    switch(sortBy) {
        case 'newest':
            filteredProducts.sort((a, b) => b.isNew - a.isNew);
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            filteredProducts.sort((a, b) => b.isPopular - a.isPopular);
            break;
    }
}

// Render products
function renderProducts() {
    const productsToShow = filteredProducts.slice(0, displayedCount);
    
    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-id="${product.id}" onclick="goToProductDetail(${product.id})">
            <div class="product-image">
                <div class="candle-emoji">${product.emoji}</div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <div class="product-price">${formatPrice(product.price)} تومان</div>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <span>${product.rating}</span>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                        افزودن به سبد
                    </button>
                    <button class="wishlist-btn" onclick="event.stopPropagation(); toggleWishlist(${product.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Show/hide load more button
    loadMoreBtn.style.display = displayedCount >= filteredProducts.length ? 'none' : 'block';
}

// Update view (grid/list)
function updateView() {
    productsGrid.className = `products-grid ${currentView}-view`;
}

// Update results count
function updateResultsCount() {
    const count = filteredProducts.length;
    resultsCount.textContent = `${count} محصول یافت شد`;
}

// Clear all filters
function clearFilters() {
    // Reset search
    searchInput.value = '';
    
    // Reset price range
    priceRange.value = 500000;
    priceValue.textContent = '۵۰۰,۰۰۰ تومان';
    
    // Reset checkboxes
    document.querySelectorAll('.checkbox-item input').forEach(checkbox => {
        checkbox.checked = true;
    });
    
    // Reset color options
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
    });
    
    // Reset sort
    sortSelect.value = 'newest';
    
    // Re-filter
    filterProducts();
}

// Load more products
function loadMore() {
    displayedCount += 6;
    renderProducts();
}

// Add to cart functionality
function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (product) {
        // Get current cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Create cart item
        const cartItem = {
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1,
            emoji: product.emoji
        };
        
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        
        if (existingItemIndex !== -1) {
            // Update quantity if item exists
            cart[existingItemIndex].quantity += 1;
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
}

// Navigate to product detail page
function goToProductDetail(productId) {
    // For now, we'll navigate to the vanilla candle detail page
    // In a real app, you would pass the product ID and load the specific product
    window.location.href = 'product-detail.html';
}

// Toggle wishlist
function toggleWishlist(productId) {
    const wishlistBtn = event.target.closest('.wishlist-btn');
    const icon = wishlistBtn.querySelector('i');
    
    if (icon.classList.contains('fas')) {
        icon.classList.remove('fas');
        icon.classList.add('far');
        showNotification('از لیست علاقه‌مندی‌ها حذف شد');
    } else {
        icon.classList.remove('far');
        icon.classList.add('fas');
        showNotification('به لیست علاقه‌مندی‌ها اضافه شد');
    }
}

// Update cart icon
function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    const cartIcon = document.querySelector('.cart-icon');
    
    // Remove existing badge
    const existingBadge = cartIcon.querySelector('.cart-count');
    if (existingBadge) {
        existingBadge.remove();
    }
    
    if (totalItems > 0) {
        const badge = document.createElement('span');
        badge.className = 'cart-count';
        badge.textContent = totalItems;
        badge.style.cssText = `
            position: absolute;
            top: -8px;
            right: -8px;
            background-color: #e74c3c;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        `;
        cartIcon.style.position = 'relative';
        cartIcon.appendChild(badge);
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

// Format price
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize cart icon on page load
updateCartIcon(); 