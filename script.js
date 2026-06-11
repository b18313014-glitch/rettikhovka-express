// НАСТРОЙКА SUPABASE — НАША НОВАЯ ЕДИНАЯ БАЗА ДАННЫХ
const SUPABASE_URL = "https://gnzjxjgwawgfoemunpjt.supabase.co";
const SUPABASE_ANON_KEY = "ТВОЙ_ПУБЛИЧНЫЙ_КЛЮЧ_ИЗ_SUPABASE"; // Вставь сюда свой ANON-ключ
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Элементы навигации слайдера
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('#dots span');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
let currentSlide = 0;

function updateSlider() {
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });

    dots.forEach((dot, index) => {
        dot.className = index === currentSlide 
            ? "h-2 w-2 rounded-full bg-blue-600 transition-all duration-300" 
            : "h-2 w-2 rounded-full bg-gray-300 transition-all duration-300";
    });

    if (currentSlide === 0) {
        prevBtn.disabled = true;
        prevBtn.className = "px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed";
    } else {
        prevBtn.disabled = false;
        prevBtn.className = "px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800";
    }

    // Запускаем синхронизацию текущего слайда с таблицами Supabase
    syncSlideWithSupabase(currentSlide);
}

nextBtn.addEventListener('click', () => {
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        updateSlider();
    } else {
        switchToAuthCard();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
    }
});


// 🔄 ЖИВАЯ СИНХРОНИЗАЦИЯ С ТАБЛИЦАМИ SUPABASE

async function syncSlideWithSupabase(slideIdx) {
    
    // СЛАЙД 2: Переносим логику статусов. Берём статус последнего заказа из таблицы 'orders'
    if (slideIdx === 1) {
        const statusBox = document.getElementById('status-box');
        statusBox.innerText = "Синхронизация с Supabase...";
        statusBox.className = "bg-gray-400 text-white p-3 rounded-lg text-center font-medium text-sm";

        try {
            // Запрашиваем из Supabase самый свежий заказ
            const { data: orders, error } = await supabase
                .from('orders') 
                .select('status')
                .order('created_at', { ascending: false })
                .limit(1);

            if (error) throw error;

            if (orders && orders.length > 0) {
                const currentStatus = orders[0].status;
                // Показываем реальный статус из базы данных Supabase!
                statusBox.innerText = `Статус заказа в Supabase: ${currentStatus}`;
                statusBox.className = "bg-green-600 text-white p-3 rounded-lg text-center font-medium text-sm transition-all";
            } else {
                statusBox.innerText = "Сейчас активных заказов в Supabase нет";
                statusBox.className = "bg-orange-500 text-white p-3 rounded-lg text-center font-medium text-sm transition-all";
            }
        } catch (err) {
            console.error("Ошибка Supabase при чтении статуса:", err.message);
            statusBox.innerText = "Ошибка загрузки статуса из Supabase";
            statusBox.className = "bg-red-500 text-white p-3 rounded-lg text-center font-medium text-sm";
        }
    }

    // СЛАЙД 3: Переносим товары. Подгружаем Хлеб из таблицы 'products'
    if (slideIdx === 2) {
        const catalogBox = document.getElementById('catalog-box');
        
        try {
            // Вытаскиваем Хлеб, его цену и ссылку на картинку из Storage
            const { data: products, error } = await supabase
                .from('products') 
                .select('title, image_url, price')
                .eq('title', 'Хлеб')
                .single();

            if (!error && products) {
                // Обновляем данные на экране прямо из Supabase
                catalogBox.querySelector('.font-bold').innerText = products.title;
                catalogBox.querySelector('.text-gray-500').innerText = `${products.price} ₽`;
                
                if (products.image_url) {
                    catalogBox.querySelector('.text-2xl').innerHTML = `<img src="${products.image_url}" class="w-8 h-8 object-cover rounded" />`;
                }
            }
        } catch (err) {
            console.log("Товар берётся из локального макета, пока таблица пуста:", err.message);
        }
    }
}


// Логика кнопок Слайда 3 (Выбор магазина)
const orderFoodBtn = document.getElementById('order-food-btn');
const shopsList = document.getElementById('shops-list');
const shopDezhurny = document.getElementById('shop-dezhurny');
const catalogBox = document.getElementById('catalog-box');
const addToCartMock = document.getElementById('add-to-cart-mock');
const headerCartIcon = document.getElementById('header-cart-icon');

orderFoodBtn.addEventListener('click', () => {
    shopsList.classList.toggle('hidden');
});

shopDezhurny.addEventListener('click', () => {
    shopsList.classList.add('hidden');
    catalogBox.classList.remove('hidden');
});

addToCartMock.addEventListener('click', () => {
    headerCartIcon.classList.remove('opacity-30');
    headerCartIcon.classList.add('opacity-100', 'scale-125', 'text-green-600');
    addToCartMock.innerText = "✓ В корзине";
    addToCartMock.disabled = true;
    setTimeout(() => headerCartIcon.classList.remove('scale-125'), 300);
});


// Логика Слайда 4: Телефон и открытие UnitPay
const mockPhone = document.getElementById('mock-phone');
const mockPayBtn = document.getElementById('mock-pay-btn');
const unitpayModal = document.getElementById('unitpay-modal');
const closeUnitpay = document.getElementById('close-unitpay');

mockPhone.addEventListener('input', () => {
    if (mockPhone.value.trim().length >= 10) {
        mockPayBtn.disabled = false;
        mockPayBtn.className = "w-full bg-green-600 text-white py-2 rounded-lg text-sm font-bold shadow hover:bg-green-700 cursor-pointer";
    } else {
        mockPayBtn.disabled = true;
        mockPayBtn.className = "w-full bg-green-600 text-white py-2 rounded-lg text-sm font-bold opacity-50 cursor-not-allowed";
    }
});

mockPayBtn.addEventListener('click', () => {
    unitpayModal.classList.remove('hidden');
});

closeUnitpay.addEventListener('click', () => {
    unitpayModal.classList.add('hidden');
    currentSlide++;
    updateSlider();
});


// ПЕРЕХОД ИЗ ОНБОРДИНГА В ОКНО АВТОРИЗАЦИИ (С проверкой системной темы)
function switchToAuthCard() {
    const onboardingCard = document.getElementById('onboarding-card');
    const authCard = document.getElementById('auth-card');

    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDarkMode) {
        authCard.classList.add('bg-slate-900'); 
    } else {
        authCard.classList.add('bg-orange-600'); 
    }

    onboardingCard.classList.add('fade-out');
    
    setTimeout(() => {
        onboardingCard.classList.add('hidden');
        authCard.classList.remove('hidden');
        setTimeout(() => {
            authCard.classList.remove('opacity-0', 'translate-y-4');
            authCard.classList.add('opacity-100', 'translate-y-0');
        }, 50);
    }, 500);
}


// ВАЛИДАЦИЯ ФОРМЫ РЕГИСТРАЦИИ
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const yandexAuthBtn = document.getElementById('yandex-auth-btn');

function validateAuthForm() {
    const emailVal = authEmail.value.trim();
    const passwordVal = authPassword.value.trim();

    if (emailVal.includes('@') && passwordVal.length >= 6) {
        authSubmitBtn.disabled = false;
        authSubmitBtn.className = "w-full bg-green-600 text-white py-3 rounded-lg font-bold text-sm shadow-md transition-colors duration-300 hover:bg-green-700 cursor-pointer";
    } else {
        authSubmitBtn.disabled = true;
        authSubmitBtn.className = "w-full bg-red-600 text-white py-3 rounded-lg font-bold text-sm shadow-md transition-colors duration-300 cursor-not-allowed";
    }
}

authEmail.addEventListener('input', validateAuthForm);
authPassword.addEventListener('input', validateAuthForm);


// РЕГИСТРАЦИЯ ПО EMAIL В SUPABASE AUTH
authSubmitBtn.addEventListener('click', async () => {
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        alert("Ошибка: " + error.message);
    } else {
        alert("Успешно! Проверьте вашу почту для подтверждения аккаунта.");
    }
});


// АВТЕНТИФИКАЦИЯ ЧЕРЕЗ ЯНДЕКС ID (Внутренний провайдер Supabase, который мы включили)
yandexAuthBtn.addEventListener('click', async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'yandex',
        options: {
            redirectTo: window.location.origin // Возвращает пользователя на твой Vercel-домен
        }
    });

    if (error) {
        console.error("Ошибка OAuth Яндекс:", error.message);
    }
});

// Запускаем первый слайд
updateSlider();
