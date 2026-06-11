import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBD8BzKaEBxcD-e24ypRh1qZ-iCvZZY6nQ",
  authDomain: "deliverygov11.firebaseapp.com",
  databaseURL: "https://deliverygov11-default-rtdb.firebaseio.com",
  projectId: "deliverygov11",
  storageBucket: "deliverygov11.firebasestorage.app",
  messagingSenderId: "562994407235",
  appId: "1:562994407235:web:27765b2d4916e82ec871f6",
  measurementId: "G-BKX872N1M7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const slides = document.querySelectorAll('.slide');
const btnBack = document.getElementById('btn-back');
const btnNext = document.getElementById('btn-next');
const onboardingContainer = document.getElementById('onboarding-container');
const registerModal = document.getElementById('register-modal');

const emailInput = document.getElementById('reg-email');
const passwordInput = document.getElementById('reg-password');
const btnSubmitAuth = document.getElementById('btn-submit-auth');
const btnYandexAuth = document.getElementById('btn-yandex-auth');
const statusBar = document.getElementById('user-status-bar');
const shopListContainer = document.querySelector('.shop-list-demo');

let currentSlideIndex = 0;

function updateSlides() {
  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlideIndex);
  });
}

btnNext.addEventListener('click', () => {
  if (currentSlideIndex < slides.length - 1) {
    currentSlideIndex++;
    updateSlides();
  } else {
    onboardingContainer.style.display = 'none';
    registerModal.classList.remove('modal-hidden');
  }
});

btnBack.addEventListener('click', () => {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    updateSlides();
  }
});

function checkInputs() {
  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();

  btnSubmitAuth.classList.remove('btn-red', 'btn-green', 'btn-default');

  if (emailValue === "" && passwordValue === "") {
    btnSubmitAuth.classList.add('btn-default');
  } else if (emailValue !== "" && passwordValue !== "") {
    btnSubmitAuth.classList.add('btn-green');
  } else {
    btnSubmitAuth.classList.add('btn-red');
  }
}

emailInput.addEventListener('input', checkInputs);
passwordInput.addEventListener('input', checkInputs);

btnYandexAuth.addEventListener('click', () => {
  window.location.href = `https://oauth.yandex.ru/authorize?response_type=code&client_id=cd5ca70954e845b9b126e314460fdc9c`;
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userOrdersRef = ref(database, `orders/${user.uid}`);
    onValue(userOrdersRef, (snapshot) => {
      const activeOrders = snapshot.val();
      if (!activeOrders) {
        statusBar.innerHTML = `<span>Сейчас у вас нет активных заказов</span>`;
      } else {
        statusBar.innerHTML = '';
        for (let orderId in activeOrders) {
          statusBar.innerHTML += `<div>Заказ #${orderId.slice(0, 6)}: <strong>${activeOrders[orderId].status}</strong></div>`;
        }
      }
    });
  } else {
    statusBar.innerHTML = `<span>Войдите в аккаунт, чтобы отслеживать заказы</span>`;
  }
});

const shopsRef = ref(database, 'shops');
onValue(shopsRef, (snapshot) => {
  const shopsData = snapshot.val();
  shopListContainer.innerHTML = '';
  if (shopsData) {
    for (let shopId in shopsData) {
      const shopElement = document.createElement('div');
      shopElement.innerText = `🏪 Магазин «${shopsData[shopId].name}»`;
      shopListContainer.appendChild(shopElement);
    }
  }
});
