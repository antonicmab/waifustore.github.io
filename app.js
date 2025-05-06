let tg = window.Telegram.WebApp;
tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#31B545';

// Поиск товаров
const searchInput = document.getElementById("searchInput");

function performSearch() {
	const searchText = searchInput.value.toLowerCase();
	const items = document.querySelectorAll(".item");

	items.forEach(itemElement => {
		const captionElement = itemElement.querySelector(".caption");
		if (!captionElement) return;

		const caption = captionElement.textContent.trim().toLowerCase();

		if (caption.includes(searchText)) {
			itemElement.style.display = "";
		} else {
			itemElement.style.display = "none";
		}
	});
}
searchInput.addEventListener("input", performSearch);


let item = "";
let itemPrice = 0;  // для хранения цены товара
// Обработчик выбора товара
// document.querySelectorAll(".btn").forEach(btn => {
//     btn.addEventListener("click", () => {
//         const label = btn.getAttribute("data-label");  // <-- исправлено
//         const price = btn.getAttribute("data-price");
//         const id = btn.getAttribute("data-id");

//         if (!label || !price || !id) return;

//         item = label;
//         itemPrice = parseInt(price);

//         tg.MainButton.setText(`Buy set of ${label}!`);
//         tg.MainButton.show();
//     });
// });


// Отправка данных в бот при нажатии главной кнопки
Telegram.WebApp.onEvent("mainButtonClicked", function() {
    // Здесь уже данные отправлены ранее при клике на кнопку товара
    tg.sendData(JSON.stringify({
        label: item,
        price: itemPrice
    }));
});

// Отображаем имя пользователя
// let usercard = document.getElementById("usercard");
// let p = document.createElement("p");
// p.innerText = `${tg.initDataUnsafe.user.first_name ?? ''} ${tg.initDataUnsafe.user.last_name ?? ''}`;
// usercard.appendChild(p);

let cart = []; // массив товаров

const cartIcon = document.getElementById("cartIcon");
const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const cartItems = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");

function updateCartDisplay() {
    cartCount.textContent = cart.length;
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.label} - ${item.price} ⭐️`;
        cartItems.appendChild(li);
        total += item.price;
    });

    totalPriceEl.textContent = total;
}

// Показываем/скрываем корзину
cartIcon.addEventListener("click", () => {
    cartModal.classList.toggle("show");
});

// Добавляем товары в корзину
document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const label = btn.getAttribute("data-label");
        const price = parseInt(btn.getAttribute("data-price"));
        const id = btn.getAttribute("data-id");

        if (!label || isNaN(price) || !id) return;

        cart.push({ id, label, price });
        updateCartDisplay();
    });
});

// Обработка кнопки "Купить"
checkoutBtn.addEventListener("click", () => {
    tg.sendData(JSON.stringify({
        items: cart,
        totalPrice: cart.reduce((sum, item) => sum + item.price, 0)
    }));
});

