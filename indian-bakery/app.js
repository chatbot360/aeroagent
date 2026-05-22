// --- 1. PRODUCT DATABASE & RENDER LOGIC ---
const products = [
    {
        id: 'cheesecake',
        name: 'New York Baked Cheesecake',
        description: 'Classic rich, creamy baked cheesecake topped with fresh strawberry compote or lotus biscoff spread.',
        baseImage: 'assets/cheesecake.png',
        pricingLogic: {
            "0.5 kg": 850,
            "1.0 kg": 1600,
            "1.5 kg": 2350,
            "2.0 kg": 3100
        }
    },
    {
        id: 'kunafa',
        name: 'Royal Turkish Kunafa',
        description: 'Authentic warm cheese pastry soaked in sweet sugar-based syrup, heavily garnished with pistachios.',
        baseImage: 'assets/kunafa.png',
        pricingLogic: {
            "0.5 kg": 900,
            "1.0 kg": 1750,
            "1.5 kg": 2600
        }
    },
    {
        id: 'cupcakes',
        name: 'Soft Frosted Cupcakes',
        description: 'Melt-in-your-mouth vanilla and strawberry butter cupcakes with premium Swiss meringue buttercream.',
        baseImage: 'assets/cupcakes.png',
        pricingLogic: {
            "Box of 4": 500,
            "Box of 6": 700,
            "Box of 12": 1350
        }
    },
    {
        id: 'tiramisu',
        name: 'Classic Italian Tiramisu',
        description: 'Elegant espresso-soaked ladyfingers layered with a light and airy mascarpone cream.',
        baseImage: 'assets/tiramisu.png',
        pricingLogic: {
            "500 ml": 950,
            "1 Liter": 1800
        }
    }
];

let cart = [];

function renderProducts() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    products.forEach(product => {
        const optionsHTML = Object.entries(product.pricingLogic).map(([qty, price]) => {
            return `<option value="${qty}" data-price="${price}">${qty}</option>`;
        }).join('');

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.baseImage}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="desc">${product.description}</p>
                
                <div class="price-control">
                    <select id="option-${product.id}" onchange="updateDisplayedPrice('${product.id}')">
                        ${optionsHTML}
                    </select>
                    <span class="price-display" id="price-${product.id}">₹${Object.values(product.pricingLogic)[0]}</span>
                </div>
                
                <button class="add-cart-btn" onclick="addToCart('${product.id}')">Add to Cart</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function updateDisplayedPrice(productId) {
    const select = document.getElementById(`option-${productId}`);
    const selectedOption = select.options[select.selectedIndex];
    const price = selectedOption.getAttribute('data-price');
    document.getElementById(`price-${productId}`).innerText = `₹${price}`;
}

// --- 2. CART LOGIC ---
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const select = document.getElementById(`option-${productId}`);
    const selectedOption = select.options[select.selectedIndex];
    
    const qtyLabel = selectedOption.value;
    const price = parseInt(selectedOption.getAttribute('data-price'));

    // Check if same item + qty exists
    const existing = cart.find(c => c.id === productId && c.qtyLabel === qtyLabel);
    if(existing) {
        existing.amount += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            qtyLabel: qtyLabel,
            price: price,
            amount: 1,
            image: product.baseImage
        });
    }
    
    updateCartSidebar();
    
    // Quick micro-animation & interaction notification
    const btn = event.target;
    btn.innerHTML = `<i class="fa-solid fa-check"></i> Added!`;
    setTimeout(() => { btn.innerHTML = `Add to Cart`; }, 1500);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartSidebar();
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function updateCartSidebar() {
    document.getElementById('cart-count').innerText = cart.reduce((sum, item) => sum + item.amount, 0);
    const cartItemsDiv = document.getElementById('cart-items');
    
    if(cart.length === 0) {
        cartItemsDiv.innerHTML = `<p style="color:#888; text-align:center; margin-top:2rem;">Your cart is empty.</p>`;
        document.getElementById('cart-total-price').innerText = "₹0";
        return;
    }

    let total = 0;
    cartItemsDiv.innerHTML = cart.map((item, index) => {
        const itemTotal = item.price * item.amount;
        total += itemTotal;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div style="flex:1;">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>${item.qtyLabel} x ${item.amount}</p>
                    </div>
                    <div class="item-logic">
                        <span>₹${itemTotal}</span>
                        <button onclick="removeFromCart(${index})">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('cart-total-price').innerText = `₹${total}`;
    document.getElementById('checkout-total-display').innerText = `₹${total}`;
}

// --- 3. CHECKOUT & N8N AUTOMATION (MOCK) ---
function openCheckoutModal() {
    if(cart.length === 0) return alert("Your cart is empty!");
    toggleCart(); // close sidebar
    document.getElementById('checkout-modal').classList.add('active');
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.remove('active');
}

document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('pay-btn');
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;
    btn.disabled = true;

    const custName = document.getElementById('cust-name').value;
    const custEmail = document.getElementById('cust-email').value;
    
    // Simulate n8n webhook delay
    setTimeout(() => {
        // Fire logic for PDF generation
        generateInvoicePDF(custName, custEmail);
        
        // Show success UI
        document.getElementById('checkout-form').style.display = 'none';
        document.getElementById('success-message').style.display = 'flex';
        
        // Push payload to dummy n8n endpoint (Conceptual fetch)
        console.log("n8n Webhook Triggered with Payload:", {
            customer: custName,
            email: custEmail,
            orderData: cart,
            total: document.getElementById('cart-total-price').innerText
        });
        
    }, 2000);
});

function clearAndClose() {
    cart = [];
    updateCartSidebar();
    closeCheckoutModal();
    setTimeout(() => {
        document.getElementById('checkout-form').style.display = 'block';
        document.getElementById('success-message').style.display = 'none';
        document.getElementById('checkout-form').reset();
        document.getElementById('pay-btn').innerHTML = `<span>Place Order & Download Bill</span><i class="fa-solid fa-arrow-right"></i>`;
        document.getElementById('pay-btn').disabled = false;
    }, 500);
}

// --- 4. PDF GENERATION (jsPDF) ---
function generateInvoicePDF(name, email) {
    window.jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF();
    
    // Styling
    doc.setTextColor(181, 141, 61); // Gold
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("ROSE & GOLD PATISSERIE", 20, 30);
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text("Premium Indian Bakery | Delhi NCR", 20, 38);
    doc.text("Official Invoice / E-Bill", 140, 30);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Customer Name: ${name}`, 20, 60);
    doc.text(`Email: ${email}`, 20, 68);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 76);
    
    // Line separator
    doc.setDrawColor(220, 220, 220);
    doc.line(20, 85, 190, 85);
    
    // Items
    let yPos = 100;
    doc.setFont("helvetica", "bold");
    doc.text("Item Details", 20, yPos);
    doc.text("Qty", 140, yPos);
    doc.text("Amount", 170, yPos);
    
    doc.setFont("helvetica", "normal");
    yPos += 10;
    
    let totalPaid = 0;
    cart.forEach(item => {
        const lineTotal = item.amount * item.price;
        totalPaid += lineTotal;
        doc.text(`${item.name} (${item.qtyLabel})`, 20, yPos);
        doc.text(`${item.amount}`, 145, yPos);
        doc.text(`Rs. ${lineTotal}`, 170, yPos);
        yPos += 12;
    });
    
    // Total line
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount Paid:", 120, yPos);
    doc.setTextColor(46, 204, 113);
    doc.text(`Rs. ${totalPaid}`, 170, yPos);
    
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Thank you for your order! It is actively tracked via our n8n Automation.", 20, 270);
    
    doc.save(`RoseGold_Invoice_${Date.now()}.pdf`);
}

// --- 5. Bakery.AI CHATBOT LOGIC ---
const aiConversations = {
    greetings: ["hi", "hello", "hey", "hola"],
    track: ["track", "status", "where is my order", "order status"],
    refund: ["refund", "cancel", "money back", "return", "complaint"],
    bestsellers: ["best", "popular", "recommendations", "bestsellers", "famous"]
};

function toggleAIChat() {
    document.getElementById('ai-chat-window').classList.toggle('active');
}

function handleAIPress(e) {
    if(e.key === 'Enter') sendAIMessage();
}

function aiPreFilledMsg(text) {
    document.getElementById('ai-chat-input').value = text;
    sendAIMessage();
}

function sendAIMessage() {
    const inputField = document.getElementById('ai-chat-input');
    const text = inputField.value.trim();
    if(text === '') return;

    addChatMessage(text, 'user-msg');
    inputField.value = '';

    // Simulate AI thinking and responding
    const aiWindow = document.getElementById('chat-body');
    const typingMsg = document.createElement('div');
    typingMsg.className = 'message ai-msg';
    typingMsg.innerHTML = `<div class="msg-content"><i class="fa-solid fa-spinner fa-spin"></i> Bakery.AI is thinking...</div>`;
    aiWindow.appendChild(typingMsg);
    aiWindow.scrollTop = aiWindow.scrollHeight;

    setTimeout(() => {
        aiWindow.removeChild(typingMsg);
        const response = generateAIResponse(text.toLowerCase());
        addChatMessage(response, 'ai-msg');
    }, 1200);
}

function addChatMessage(text, className) {
    const aiWindow = document.getElementById('chat-body');
    const msg = document.createElement('div');
    msg.className = `message ${className}`;
    msg.innerHTML = `<div class="msg-content">${text}</div>`;
    aiWindow.appendChild(msg);
    aiWindow.scrollTop = aiWindow.scrollHeight;
}

function generateAIResponse(input) {
    // Advanced Mock LLM Intent Classification
    if (aiConversations.refund.some(keyword => input.includes(keyword))) {
        return `We deeply apologize if you faced any issues. Since we value our customers immensely, our <b>n8n automated system</b> can process an instant refund for valid cases within 24 hours. Please click <a href="#" style="color:#b58d3d;">here to submit a refund ticket</a>.`;
    }
    else if (aiConversations.track.some(keyword => input.includes(keyword))) {
        return `I can help you track your order! If you just placed an order, our n8n kitchen automation has dispatched it to the head chef. You should have received an SMS. Could you provide your Order ID (found on the PDF bill)?`;
    }
    else if (aiConversations.bestsellers.some(keyword => input.includes(keyword))) {
        return `Our highest-rated delicacies are the <b>Royal Turkish Kunafa</b> and our <b>New York Baked Cheesecake</b>! We use 100% premium imported ingredients for these. Would you like me to add one to your cart?`;
    }
    else if (aiConversations.greetings.some(keyword => input.split(' ').includes(keyword))) {
        return `Hello again! It's so lovely and sweet to meet you. Feel free to browse through our menu. I'm here if you have any bespoke cake requirements! 🎂`;
    }
    else {
        return `That's an interesting question! As Bakery.AI, I specialize in navigating our menu, tracking your sweet deliveries, and handling instant resolutions. Please feel free to call our concierge at +91 98765 43210 for highly specific inquiries!`;
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Generate Product UI on load
    renderProducts();
});
