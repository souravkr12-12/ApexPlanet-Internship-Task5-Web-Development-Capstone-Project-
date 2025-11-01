let cartCount = 0;
let cartItems = [];

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

function addToCart(productName, price, button) {
    const card = button.closest('.card');
    let stock = parseInt(card.getAttribute('data-stock'));
    if (stock > 0) {
        cartCount++;
        cartItems.push({ name: productName, price: price });
        document.getElementById('cart-count').textContent = cartCount;
        stock--;
        card.setAttribute('data-stock', stock);
        updateStockStatus(card, stock);
        updateCart();
        alert(`${productName} has been added to your cart! Total items: ${cartCount}`);
    } else {
        alert('Sorry, this item is out of stock!');
    }
}

function updateStockStatus(card, stock) {
    const stockStatus = card.querySelector('.stock-status');
    if (stock > 0) {
        stockStatus.textContent = `In Stock: ${stock}`;
        stockStatus.classList.remove('out-of-stock');
        stockStatus.classList.add('available');
        card.querySelector('.btn-primary').disabled = false;
    } else {
        stockStatus.textContent = 'Out of Stock';
        stockStatus.classList.remove('available');
        stockStatus.classList.add('out-of-stock');
        card.querySelector('.btn-primary').disabled = true;
    }
}

function updateCart() {
    const cartItemsList = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const checkoutButton = document.getElementById('proceed-to-checkout');
    cartItemsList.innerHTML = '';
    if (cartItems.length === 0) {
        cartEmpty.style.display = 'block';
        checkoutButton.style.display = 'none';
    } else {
        cartEmpty.style.display = 'none';
        checkoutButton.style.display = 'block';
        cartItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ₹${item.price}`;
            cartItemsList.appendChild(li);
        });
    }
}

function showShippingForm() {
    if (cartItems.length > 0) {
        showSection('shipping');
    } else {
        alert('Your cart is empty!');
    }
}

function validateContactForm(event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    if (!/^[A-Za-z\s]+$/.test(name)) {
        alert('Please enter a valid name (letters and spaces only).');
        return false;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
        alert('Please enter a valid 10-digit phone number.');
        return false;
    }
    alert('Thank you for contacting us! We will get back to you soon.');
    document.getElementById('contact-form').reset();
    return false;
}

function processOrder(event) {
    event.preventDefault();

    const name = document.getElementById('shipping-name').value.trim();
    const phone = document.getElementById('shipping-phone').value.trim();
    const paymentMethod = document.getElementById('payment-method').value;

    if (!/^[A-Za-z\s]+$/.test(name)) {
        alert('Please enter a valid name (letters and spaces only).');
        return false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        alert('Please enter a valid 10-digit phone number.');
        return false;
    }

    if (!paymentMethod) {
        alert('Please select a payment method.');
        return false;
    }

    alert(`Order placed successfully with ${paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}!`);

    cartItems = [];
    cartCount = 0;
    document.getElementById('cart-count').textContent = cartCount;
    updateCart();
    document.getElementById('shipping-form').reset();
    showSection('success');
    return false;
}


function redirectToProduct(productName) {
    const allProducts = document.querySelectorAll('#products .card, #categories .card');
    const productCard = Array.from(allProducts).find(card => 
        card.querySelector('.card-title')?.textContent === productName
    );
    
    if (productCard) {
        const isInCategories = productCard.closest('#categories') !== null;
        showSection(isInCategories ? 'categories' : 'products');
        productCard.scrollIntoView({ behavior: 'smooth' });
    }
}

function showSuggestions(input) {
    const suggestionBox = document.createElement('div');
    suggestionBox.id = 'suggestion-box';
    suggestionBox.style.position = 'absolute';
    suggestionBox.style.background = 'white';
    suggestionBox.style.border = '1px solid #ccc';
    suggestionBox.style.borderRadius = '5px';
    suggestionBox.style.width = '200px';
    suggestionBox.style.maxHeight = '200px';
    suggestionBox.style.overflowY = 'auto';
    suggestionBox.style.zIndex = '1000';
    
    const searchInput = document.getElementById('searchInput');
    suggestionBox.style.top = `${searchInput.offsetTop + searchInput.offsetHeight}px`;
    suggestionBox.style.left = `${searchInput.offsetLeft}px`;

    const allProducts = document.querySelectorAll('#products .card, #categories .card');
    const suggestions = new Set();
    
    allProducts.forEach(product => {
        const title = product.querySelector('.card-title')?.textContent.toLowerCase();
        if (title && title.includes(input.toLowerCase())) {
            suggestions.add(product.querySelector('.card-title').textContent);
        }
    });

    if (suggestions.size > 0) {
        suggestions.forEach(suggestion => {
            const div = document.createElement('div');
            div.textContent = suggestion;
            div.style.padding = '5px';
            div.style.cursor = 'pointer';
            div.onmouseover = () => div.style.backgroundColor = '#f0f0f0';
            div.onmouseout = () => div.style.backgroundColor = 'white';
            div.onclick = () => {
                searchInput.value = suggestion;
                redirectToProduct(suggestion);
                removeSuggestions();
            };
            suggestionBox.appendChild(div);
        });
        document.body.appendChild(suggestionBox);
    }
}

function removeSuggestions() {
    const suggestionBox = document.getElementById('suggestion-box');
    if (suggestionBox) {
        suggestionBox.remove();
    }
}

function searchProduct() {
    const input = document.getElementById("searchInput").value.trim();
    if (!input) return;
    
    const allProducts = document.querySelectorAll('#products .card, #categories .card');
    let found = false;
    let firstMatch = null;

    allProducts.forEach(product => {
        product.style.display = "block";
    });

    allProducts.forEach(product => {
        const title = product.querySelector(".card-title")?.textContent.toLowerCase();
        if (title && title.includes(input.toLowerCase())) {
            if (!found) {
                firstMatch = product;
                found = true;
            }
        } else {
            product.style.display = "none";
        }
    });

    if (found && firstMatch) {
        const isInCategories = firstMatch.closest('#categories') !== null;
        showSection(isInCategories ? 'categories' : 'products');
        firstMatch.scrollIntoView({ behavior: 'smooth' });
    } else {
        alert("Item not found!");
    }
    removeSuggestions();
}

document.addEventListener('DOMContentLoaded', () => {
    showSection('home');
    const carousel = new bootstrap.Carousel(document.getElementById('carouselExampleCaptions'), {
        interval: 2000,
        ride: 'carousel'
    });
    document.querySelectorAll('.card').forEach(card => {
        const stock = parseInt(card.getAttribute('data-stock'));
        updateStockStatus(card, stock);
    });

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        removeSuggestions();
        const value = e.target.value.trim();
        if (value.length >= 1) {
            showSuggestions(value);
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#searchInput') && !e.target.closest('#suggestion-box')) {
            removeSuggestions();
        }
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchProduct();
        }
    });
});