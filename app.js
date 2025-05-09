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


// Скрыть кнопку "Купить" при загрузке страницы, если корзина пуста
checkoutBtn.style.display = "none";

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

    // Показывать или скрывать кнопку "Купить" в зависимости от общей суммы
    checkoutBtn.style.display = total > 0 ? "block" : "none";

    // Обработчики на ❌
    cartItems.querySelectorAll("span[data-index]").forEach(span => {
        span.addEventListener("click", (e) => {
            const i = parseInt(e.target.getAttribute("data-index"));
            cart.splice(i, 1);
            updateCartDisplay();
        });
    });
}

// Показываем корзину
cartIcon.addEventListener("click", () => {
    cartModal.classList.toggle("show");

    // После открытия корзины нужно обновить состояние кнопки
    updateCartDisplay();
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

        // Вибрация при добавлении товара
        Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        
        // Анимация корзинки
        cartIcon.classList.add("shake");
        setTimeout(() => cartIcon.classList.remove("shake"), 600);
        
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const topBar = document.querySelector('.top-bar');
    const container = document.querySelector('.container');

    if (topBar && container) {
        container.style.paddingTop = topBar.offsetHeight + 'px';
    }
});


// Обработка кнопки "Купить"
checkoutBtn.addEventListener("click", () => {
    tg.sendData(JSON.stringify({
        items: cart,
        totalPrice: cart.reduce((sum, item) => sum + item.price, 0)
    }));
});

/* СОРТИРОВАЛКА */
const sortToggle = document.getElementById("sortToggle");
const sortLabel = document.getElementById("sortLabel");

sortToggle.addEventListener("change", () => {
	const container = document.querySelector(".inner");
	const items = Array.from(container.querySelectorAll(".item"));

	items.sort((a, b) => {
		const priceA = parseInt(a.querySelector(".btn").dataset.price);
		const priceB = parseInt(b.querySelector(".btn").dataset.price);
		return sortToggle.checked ? priceB - priceA : priceA - priceB;
	});

	// Обновляем DOM
	items.forEach(item => container.appendChild(item));

	sortLabel.textContent = sortToggle.checked
		? "Price: ⬇️"
		: "Price: ⬆️";
});
// сортировки по data-id
const idSortToggle = document.getElementById("idSortToggle");
const idSortLabel = document.getElementById("idSortLabel");

idSortToggle.addEventListener("change", () => {
    const container = document.querySelector(".inner");
    const items = Array.from(container.querySelectorAll(".item"));

    items.sort((a, b) => {
        const idA = parseInt(a.querySelector(".btn").dataset.id);
        const idB = parseInt(b.querySelector(".btn").dataset.id);
        return idSortToggle.checked ? idB - idA : idA - idB;
    });

    // Обновляем DOM
    items.forEach(item => container.appendChild(item));

    idSortLabel.textContent = idSortToggle.checked
        ? "Newest first"
        : "Oldest first";
});

/* Обработчик случайной сортировки*/
const randomSortBtn = document.getElementById('randomSortBtn');

randomSortBtn.addEventListener('click', () => {
    // Добавляем класс анимации
    randomSortBtn.classList.add('pressed');

    // Убираем класс через 300 мс (подходит под длительность анимации)
    setTimeout(() => {
        randomSortBtn.classList.remove('pressed');
    }, 300);

    // Перемешиваем элементы
    const container = document.querySelector('.inner');
    const items = Array.from(container.querySelectorAll('.item'));

    // Фишер-Йейтс
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }

    // Обновляем DOM
    items.forEach(item => container.appendChild(item));
});

/* Кнопка для скрытия фильтров */
document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('toggleFiltersBtn');
    const bottomRow = document.querySelector('.bottom-row');

    toggleBtn.addEventListener('click', function () {
        bottomRow.classList.toggle('hidden');
    });
});