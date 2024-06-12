document.addEventListener('DOMContentLoaded', () => {
    const cartNotification = document.querySelector('.cart-notification');
    const cartContainer = document.querySelector('.cart-container');
    const productCards = document.querySelectorAll('.product-card');
    const closeIcons = document.querySelectorAll('.icon-close');
    const navCloseIcon = document.querySelector('.nav-icon-close');
    const imageContainers = document.querySelectorAll('.image-container');
    const productList = document.querySelector('.product-list');
    const totalPriceElement = document.getElementById('total-price');
    let cartCount = 0;
    let totalPrice = 0;
    let checkoutButton = null;

    productCards.forEach((card, index) => {
        const buyButton = card.querySelector('.product-button');
        const productName = card.getAttribute('data-name');
        const productPrice = card.getAttribute('data-price');
        const productImage = card.getAttribute('data-image');
        const sizeSelect = card.querySelector('.size-select');
        const iconNext = card.querySelector('.icon-next');
        const iconPrevious = card.querySelector('.icon-previous');
        const images = card.querySelectorAll('.image-container img');
        let currentImageIndex = 0;

        iconNext?.addEventListener('click', () => {
            images[currentImageIndex].style.display = 'none';
            currentImageIndex = (currentImageIndex + 1) % images.length;
            images[currentImageIndex].style.display = 'block';
        });

        iconPrevious?.addEventListener('click', () => {
            images[currentImageIndex].style.display = 'none';
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            images[currentImageIndex].style.display = 'block';
        });

        buyButton.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedSize = sizeSelect.value;
            addToCart(productName, productPrice, productImage, selectedSize);
        });
    });

    function addToCart(name, price, image, size) {
        cartCount++;
        cartNotification.textContent = cartCount;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <img class="cart-img" src="${image}" alt="${name}">
            <div>
                <h4>${name}</h4>
                <p>${price} </p>
                <p>Taille : ${size}</p>
            </div>
            <svg class="delete-icon" width="14" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z" id="a"/></defs><use fill-rule="nonzero" xlink:href="#a"/></svg>
        `;

        cartContainer.querySelector('.empty-message').style.display = 'none';
        cartContainer.appendChild(cartItem);

        addProductToSummary(name, price, size);

        const itemCount = cartContainer.querySelectorAll('.cart-item').length;
        cartNotification.textContent = itemCount;

        cartItem.querySelector('.delete-icon').addEventListener('click', () => {
            cartItem.remove();
            const remainingItems = cartContainer.querySelectorAll('.cart-item').length;
            cartNotification.textContent = remainingItems;
            removeProductFromSummary(name, price, size);
            if (remainingItems === 0) {
                cartContainer.querySelector('.empty-message').style.display = 'block';
                if (checkoutButton) {
                    checkoutButton.remove();
                    checkoutButton = null;
                }
            }
        });

        if (!checkoutButton && cartCount > 0) {
            checkoutButton = document.createElement('button');
            checkoutButton.textContent = 'Payer';
            cartContainer.appendChild(checkoutButton);
            checkoutButton.addEventListener('click', showCheckoutSection);
        }
        cartContainer.insertBefore(cartItem, checkoutButton);
    }

    function addProductToSummary(name, price, size) {
        const productItem = document.createElement('li');
        productItem.classList.add('summary-item');
        productItem.innerHTML = `${name} - Taille: ${size} - ${price} `;
        productList.appendChild(productItem);

        updateTotalPrice(parseFloat(price), true);
    }

    function removeProductFromSummary(name, price, size) {
        const summaryItems = document.querySelectorAll('.summary-item');
        summaryItems.forEach(item => {
            if (item.textContent.includes(name) && item.textContent.includes(size)) {
                item.remove();
            }
        });

        updateTotalPrice(parseFloat(price), false);
    }

    function updateTotalPrice(price, isAdding) {
        if (isAdding) {
            totalPrice += price;
        } else {
            totalPrice -= price;
        }
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }

    function showCheckoutSection() {
        const overlay = document.querySelector('.overlay');
        const checkoutSection = document.querySelector('.checkout-section');
        overlay.style.display = 'block';
        checkoutSection.style.display = 'block';
    }

    function hideCheckoutSection() {
        const overlay = document.querySelector('.overlay');
        const checkoutSection = document.querySelector('.checkout-section');
        overlay.style.display = 'none';
        checkoutSection.style.display = 'none';
    }

    closeIcons.forEach(icon => {
        icon.addEventListener('click', hideCheckoutSection);
    });

    const menuIcon = document.getElementById('icon-menu');
    const navigation = document.querySelector('.navigation');

    menuIcon.addEventListener('click', () => {
        navigation.style.display = "block";
    });

    navCloseIcon.addEventListener('click', () => {
        navigation.style.display = "none";
    });

    const cartIcon = document.querySelector('.header-image-cart-container');
    const cart = document.querySelector('.cart');

    cartIcon.addEventListener('click', () => {
        cart.classList.toggle('show');
    });

    const faqItems = document.querySelectorAll('.faq-item');
  
    faqItems.forEach((item) => {
      const question = item.querySelector('.question');
      const iconPlus = item.querySelector('.icon-plus');
      const iconMinus = item.querySelector('.icon-minus');
      const answer = item.querySelector('.answer');
  
      iconPlus.addEventListener('click', function () {
        // Afficher la réponse
        answer.style.display = 'block';
        // Changer les icônes
        iconPlus.style.display = 'none';
        iconMinus.style.display = 'inline-block';
      });
  
      iconMinus.addEventListener('click', function () {
        // Cacher la réponse
        answer.style.display = 'none';
        // Changer les icônes
        iconPlus.style.display = 'inline-block';
        iconMinus.style.display = 'none';
      });
    });

    const searchInput = document.querySelector('input[type="search"]');

    searchInput.addEventListener('input', () => {
        const searchTerm = capitalizeFirstLetterEachWord(searchInput.value.trim());
        filterShoes(searchTerm);
    });

    function filterShoes(searchTerm) {
        productCards.forEach(productCard => {
            const productName = productCard.getAttribute('data-name');
            const productPrice = productCard.getAttribute('data-price');
            const productColor = productCard.getAttribute('data-color');

            if (productName && productPrice && productColor) {
                const isMatch = productName.includes(searchTerm) || productPrice.includes(searchTerm) || productColor.includes(searchTerm);
                productCard.style.display = isMatch ? 'block' : 'none';
            } else {
                productCard.style.display = 'none';
            }
        });
    }

    function capitalizeFirstLetterEachWord(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }
});
