// UI Event Listeners and State Management
const cartBtn = document.getElementById('cartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartBadge = document.getElementById('cartBadge');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalValue = document.getElementById('cartTotalValue');

// Cart State
let cart = JSON.parse(localStorage.getItem('nexshop_cart')) || [];

// Initialize Cart UI on load
updateCartUI();

// Cart Overlay toggles
cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cartOverlay.classList.add('active');
});

closeCartBtn.addEventListener('click', () => {
    cartOverlay.classList.remove('active');
});

cartOverlay.addEventListener('click', (e) => {
    if(e.target === cartOverlay) {
        cartOverlay.classList.remove('active');
    }
});

// Render the grids from data.js (which must be loaded first)
function renderProducts() {
    const electronicsGrid = document.getElementById('electronicsGrid');
    const fashionGrid = document.getElementById('fashionGrid');
    
    if(!electronicsGrid || !window.productsData) return;
    
    // Sort products by category
    const electronicsProducts = productsData.filter(p => p.category === 'electronics');
    const fashionProducts = productsData.filter(p => p.category === 'fashion' || p.category === 'accessories'); // Assuming some categories
    
    electronicsGrid.innerHTML = electronicsProducts.map(product => createProductCardHTML(product)).join('');
    
    if(fashionGrid) {
        fashionGrid.innerHTML = fashionProducts.map(product => createProductCardHTML(product)).join('');
    }

    // Attach event listeners to Add to Cart buttons
    document.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            addToCart(id);
        });
    });
}

function createProductCardHTML(product) {
    // Formatting price
    const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price);
    const originalPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.originalPrice);
    
    let stars = '';
    for(let i=0; i<5; i++) {
        stars += `<i class='bx ${i < product.rating ? 'bxs-star' : 'bx-star'}' ></i>`;
    }

    return `
    <div class="product-card">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        <button class="wishlist-btn"><i class='bx bx-heart'></i></button>
        <div class="img-container">
            <img src="${product.image}" loading="lazy" alt="${product.title}" class="product-img">
        </div>
        <div class="product-info">
            <span class="product-brand">${product.brand}</span>
            <h3 class="product-title">${product.title}</h3>
            <div class="product-rating">
                <span class="stars">${stars}</span>
                <span class="reviews">(${product.reviews})</span>
            </div>
            <div class="product-price-row">
                <div class="price-box">
                    <span class="current-price">${formattedPrice}</span>
                    <span class="original-price">${originalPrice}</span>
                </div>
                <button class="add-cart-btn" data-id="${product.id}" aria-label="Add to cart">
                    <i class='bx bx-cart-add'></i>
                </button>
            </div>
        </div>
    </div>
    `;
}

// Cart Functions
function addToCart(productId) {
    const product = window.productsData.find(p => p.id === productId);
    if(!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if(existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    
    // Tiny animation for button
    const btn = document.querySelector(`.add-cart-btn[data-id="${productId}"]`);
    if(btn) {
        btn.innerHTML = "<i class='bx bx-check'></i>";
        btn.style.background = 'var(--violet)';
        setTimeout(() => {
            btn.innerHTML = "<i class='bx bx-cart-add'></i>";
            btn.style.background = '';
        }, 1000);
    }
    
    // Open cart automatically
    cartOverlay.classList.add('active');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if(item) {
        item.quantity += delta;
        if(item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart() {
    localStorage.setItem('nexshop_cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    // Render items
    if(cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty. Discover top products and add them to cart.</div>';
        cartTotalValue.textContent = '₹0';
        return;
    }
    
    let subtotal = 0;
    cartItemsContainer.innerHTML = cart.map(item => {
        subtotal += item.price * item.quantity;
        const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price);
        
        return `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${formattedPrice}</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)"><i class='bx bx-minus'></i></button>
                    <span class="item-qty">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)"><i class='bx bx-plus'></i></button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})"><i class='bx bx-trash'></i></button>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    cartTotalValue.textContent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(subtotal);
}

// Carousel Functions
function initCarousel() {
    const container = document.getElementById('heroCarousel');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    if(!container || !window.carouselData) return;
    
    // Inject slides
    container.innerHTML = window.carouselData.map(slide => `
        <div class="carousel-slide">
            <img src="${slide.image}" alt="Banner">
            <div class="carousel-content">
                <h1>${slide.title}</h1>
                <p>${slide.subtitle}</p>
                <a href="${slide.link}" class="shop-now-btn">
                    <span>${slide.btnText}</span>
                    <i class='bx bx-right-arrow-alt'></i>
                </a>
            </div>
        </div>
    `).join('');
    
    // Inject indicators
    indicatorsContainer.innerHTML = window.carouselData.map((_, index) => `
        <div class="indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
    `).join('');
    
    // Logic
    let currentIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    function showSlide(index) {
        if(index < 0) index = slides.length - 1;
        if(index >= slides.length) index = 0;
        
        container.style.transform = `translateX(-${index * 100}%)`;
        indicators.forEach(ind => ind.classList.remove('active'));
        indicators[index].classList.add('active');
        currentIndex = index;
    }
    
    document.getElementById('prevBtn')?.addEventListener('click', () => showSlide(currentIndex - 1));
    document.getElementById('nextBtn')?.addEventListener('click', () => showSlide(currentIndex + 1));
    
    indicators.forEach(ind => {
        ind.addEventListener('click', (e) => {
            showSlide(parseInt(e.target.dataset.index));
        });
    });
    
    // Auto-play
    setInterval(() => showSlide(currentIndex + 1), 5000);
}

// Global scope bindings for inline event handlers from HTML string
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    initCarousel();
});
