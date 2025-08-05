document.addEventListener('DOMContentLoaded', () => {


    const foodData = [
        { name: 'Margherita Pizza', price: 250, rating: '4.7 [30-35 min]', emoji: '🍕' },
        { name: 'Paneer Butter Masala', price: 310, rating: '4.8 [25-30 min]', emoji: '🍲' },
        { name: 'Chicken Biryani', price: 350, rating: '4.9 [40-45 min]', emoji: '🍛' },
        { name: 'Masala Dosa', price: 150, rating: '4.6 [20-25 min]', emoji: '🥞' },
        { name: 'Veg Hakka Noodles', price: 180, rating: '4.7 [20-25 min]', emoji: '🍜' },
        { name: 'Tandoori Chicken', price: 280, rating: '4.8 [30-35 min]', emoji: '🍗' },
        { name: 'Chilli Paneer', price: 220, rating: '4.7 [25-30 min]', emoji: '🌶️' },
        { name: 'Special Thali', price: 400, rating: '4.9 [35-40 min]', emoji: '🍽️' },
        { name: 'Classic Burger', price: 190, rating: '4.5 [15-20 min]', emoji: '🍔' }
    ];

    const foodCards = document.querySelectorAll('.food-card');
    foodCards.forEach((card, index) => {
        const data = foodData[index % foodData.length]; 
        card.querySelector('.food-name').textContent = data.name;
        card.querySelector('.food-price').textContent = `₹${data.price}`;
        card.querySelector('.food-rating span:last-child').textContent = data.rating;
        card.querySelector('.food-image').textContent = data.emoji;


        const addToCartBtn = card.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            handleAddToCart(data.name, data.price);
        });
    });

    const body = document.body;
    function openModal(modal) { modal.classList.add('visible'); body.classList.add('no-scroll'); }
    function closeModal(modal) { modal.classList.remove('visible'); body.classList.remove('no-scroll'); }

    const cartModal = document.getElementById('cartModal');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    let cart = [];

    document.querySelector('.icon[onclick="toggleCart()"]').addEventListener('click', (e) => { e.preventDefault(); openModal(cartModal); });
    cartModal.querySelector('.close-cart').addEventListener('click', (e) => { e.preventDefault(); closeModal(cartModal); });
    
    function handleAddToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) existingItem.quantity++; else cart.push({ name, price, quantity: 1 });
        updateCartUI();
        alert(`${name} was added to your cart!`);
    }

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        else cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item-div';
            itemEl.innerHTML = `<span>${item.name} (x${item.quantity})</span><span>₹${item.price * item.quantity}</span>`;
            cartItemsContainer.appendChild(itemEl);
        });
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalEl.textContent = `Total: ₹${total}`;
    }

    document.querySelector('.request-btn').addEventListener('click', (e) => {
        e.preventDefault();
        createRequestModal();
    });

    function createRequestModal() {
        if (document.querySelector('.request-modal-backdrop')) return; 

        const modalHTML = `
            <div class="request-modal-content">
                <div class="request-modal-header">
                    <h3>Request a Dish</h3>
                    <button class="close-request-modal">×</button>
                </div>
                <div class="request-modal-body">
                    <form id="dynamic-request-form">
                        <div class="form-group"><label for="dish-name">Dish Name</label><input type="text" id="dish-name" placeholder="e.g., Hyderabadi Biryani" required></div>
                        <div class="form-group"><label for="dish-notes">Any specific notes? (optional)</label><textarea id="dish-notes" rows="3" placeholder="e.g., Make it extra spicy"></textarea></div>
                    </form>
                </div>
                <div class="request-modal-footer">
                    <button class="btn-secondary cancel-request">Cancel</button>
                    <button type="submit" form="dynamic-request-form" class="btn-primary">Submit Request</button>
                </div>
            </div>`;

        const modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'request-modal-backdrop';
        modalBackdrop.innerHTML = modalHTML;
        body.appendChild(modalBackdrop);
        openModal(modalBackdrop);

        const closeModalAndRemove = () => { closeModal(modalBackdrop); setTimeout(() => modalBackdrop.remove(), 300); };
        modalBackdrop.querySelector('.close-request-modal').addEventListener('click', closeModalAndRemove);
        modalBackdrop.querySelector('.cancel-request').addEventListener('click', closeModalAndRemove);
        modalBackdrop.querySelector('#dynamic-request-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Request submitted! Thank you.');
            closeModalAndRemove();
        });
    }

    const carousel = document.querySelector('.carousel');
    document.querySelector('.carousel-nav.prev').addEventListener('click', (e) => {
        e.preventDefault();
        const cardWidth = carousel.querySelector('.food-card').offsetWidth;
        carousel.scrollBy({ left: -(cardWidth + 30), behavior: 'smooth' });
    });
    document.querySelector('.carousel-nav.next').addEventListener('click', (e) => {
        e.preventDefault();
        const cardWidth = carousel.querySelector('.food-card').offsetWidth;
        carousel.scrollBy({ left: cardWidth + 30, behavior: 'smooth' });
    });

    const videoPlayer = document.querySelector('.video-player');
    let player;
    let playerReady = false;

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => { playerReady = true; };
    
    videoPlayer.addEventListener('click', (e) => {
        e.preventDefault();
        const overlay = videoPlayer.querySelector('.play-button');
        if (!player && playerReady) {
            overlay.textContent = '...'; 
            const playerContainer = document.createElement('div');
            playerContainer.id = 'youtube-player-container';
            videoPlayer.appendChild(playerContainer);

            player = new YT.Player('youtube-player-container', {
                height: '100%', width: '100%', videoId: '0s_a_I22c1M',
                playerVars: { 'playsinline': 1, 'autoplay': 1, 'controls': 1, 'rel': 0 },
                events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange }
            });
        } else if (player) {
            player.playVideo();
        }
    });

    function onPlayerReady(event) {
        videoPlayer.querySelector('.play-button').style.display = 'none'; 
        event.target.playVideo();
    }
    
    function onPlayerStateChange(event) {
        const overlay = videoPlayer.querySelector('.play-button');
        if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        }
    }
});