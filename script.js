// --- ЛОГИКА ПРОФИЛЯ ---
function updateProfile(user) {
    if (user) {
        document.getElementById('userName').innerText = user.displayName;
        document.getElementById('userEmail').innerText = user.email;
        document.getElementById('userAvatar').src = user.photoURL;
        console.log("Профиль обновлен для:", user.displayName);
    }
}

// --- ЛОГИКА КОРЗИНЫ ---
let cart = [];
let deliveryFee = 0;

function addToCart(itemName, price) {
    cart.push({ name: itemName, price: price });
    renderCart();
}

function renderCart() {
    const cartContainer = document.getElementById('cartItems');
    let total = 0;
    cartContainer.innerHTML = ''; // Очищаем старое

    cart.forEach((item, index) => {
        total += item.price;
        cartContainer.innerHTML += `<div>${item.name} - ${item.price}₽ <button onclick="removeFromCart(${index})">❌</button></div>`;
    });

    // Добавляем стоимость доставки, если есть Озон
    const finalTotal = total + deliveryFee;
    document.getElementById('totalPrice').innerText = finalTotal + " ₽";
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

// --- СИНХРОНИЗАЦИЯ С ОЗОНОМ ---
async function uploadOzonBarcode(file) {
    deliveryFee = 100; // Сразу ставим 100 руб за габарит
    renderCart(); // Обновляем сумму в корзине
    
    // Тут идет твой код загрузки в Dropbox, который мы делали
    alert("Штрих-код принят! В корзину добавлена доставка 100₽");
}
