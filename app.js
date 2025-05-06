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

// Отправка данных в бот при нажатии главной кнопки
Telegram.WebApp.onEvent("mainButtonClicked", function() {
    // Здесь уже данные отправлены ранее при клике на кнопку товара
    tg.sendData(JSON.stringify({
        label: item,
        price: itemPrice
    }));
});

let cart = []; // массив товаров

const cartIcon = document.getElementById("cartIcon");
const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const cartItems = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");

// Удалять товар при клике по мусорке 🗑
function updateCartDisplay() {
    cartCount.textContent = cart.length;
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${item.label} - ${item.price} ⭐️ 
            <span style="cursor: pointer; color: red; margin-left: 10px;" data-index="${index}">❌</span>`;
        cartItems.appendChild(li);
        total += item.price;
    });

    totalPriceEl.textContent = total;

    // Добавляем обработчики на иконки удаления
    cartItems.querySelectorAll("span[data-index]").forEach(span => {
        span.addEventListener("click", (e) => {
            const i = parseInt(e.target.getAttribute("data-index"));
            cart.splice(i, 1); // Удаляем товар
            updateCartDisplay(); // Перерисовываем корзину
        });
    });
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
        
        // Анимация корзинки
        cartIcon.classList.add("shake");
        setTimeout(() => cartIcon.classList.remove("shake"), 300);
        
    });
});

// Обработка кнопки "Купить"
checkoutBtn.addEventListener("click", () => {
    tg.sendData(JSON.stringify({
        items: cart,
        totalPrice: cart.reduce((sum, item) => sum + item.price, 0)
    }));
});

