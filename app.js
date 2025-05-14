let tg = window.Telegram.WebApp;
tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#31B545';

// Pagination settings
const ITEMS_PER_PAGE = 12;
let currentPage = 1;
let totalItems = 0;
let allItems = [];

// Initialize pagination
function initializePagination() {
	const container = document.querySelector(".inner");
	allItems = Array.from(container.querySelectorAll(".item"));
	totalItems = allItems.length;
	
	// Hide all items initially
	allItems.forEach(item => item.style.display = "none");
	
	// Show first page
	showPage(currentPage);
	
	// Add pagination controls
	addPaginationControls();
}

// Show items for specific page
function showPage(page) {
	const start = (page - 1) * ITEMS_PER_PAGE;
	const end = start + ITEMS_PER_PAGE;
	
	// Hide all items
	allItems.forEach(item => item.style.display = "none");
	
	// Show items for current page
	allItems.slice(start, end).forEach(item => item.style.display = "");
	
	// Update current page
	currentPage = page;
	updatePaginationControls();
}

// Add pagination controls to the page
function addPaginationControls() {
	const paginationDiv = document.querySelector(".pagination");
	if (!paginationDiv) return;

	// Очистка перед добавлением
	paginationDiv.innerHTML = "";

	const paginationContent = document.createElement("div");
	paginationContent.className = "pagination-content";

	const prevButton = document.createElement("button");
	prevButton.id = "prevPage";
	prevButton.className = "pagination-btn";
	prevButton.innerHTML = "⬅️";
	paginationContent.appendChild(prevButton);

	const pageNumbers = document.createElement("div");
	pageNumbers.className = "page-numbers";
	paginationContent.appendChild(pageNumbers);

	const nextButton = document.createElement("button");
	nextButton.id = "nextPage";
	nextButton.className = "pagination-btn";
	nextButton.innerHTML = "➡️";
	paginationContent.appendChild(nextButton);

	paginationDiv.appendChild(paginationContent);

	prevButton.addEventListener("click", () => {
		if (currentPage > 1) {
			showPage(currentPage - 1);
		}
	});

	nextButton.addEventListener("click", () => {
		if (currentPage < Math.ceil(totalItems / ITEMS_PER_PAGE)) {
			showPage(currentPage + 1);
		}
	});

	updatePageNumbers();
}


// Update pagination controls state
function updatePaginationControls() {
	const prevBtn = document.getElementById("prevPage");
	const nextBtn = document.getElementById("nextPage");
	
	prevBtn.disabled = currentPage === 1;
	nextBtn.disabled = currentPage === Math.ceil(totalItems / ITEMS_PER_PAGE);
	
	updatePageNumbers();
}

// Update page numbers display
function updatePageNumbers() {
	const pageNumbers = document.querySelector(".page-numbers");
	const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
	
	// Clear existing page numbers
	pageNumbers.innerHTML = "";
	
	// Calculate which page numbers to show
	let startPage = Math.max(1, currentPage - 2);
	let endPage = Math.min(totalPages, startPage + 4);
	
	// Adjust start page if we're near the end
	if (endPage - startPage < 4) {
		startPage = Math.max(1, endPage - 4);
	}
	
	// Add first page and ellipsis if needed
	if (startPage > 1) {
		addPageButton(1, pageNumbers);
		if (startPage > 2) {
			const ellipsis = document.createElement("span");
			ellipsis.className = "page-ellipsis";
			ellipsis.textContent = "...";
			pageNumbers.appendChild(ellipsis);
		}
	}
	
	// Add page numbers
	for (let i = startPage; i <= endPage; i++) {
		addPageButton(i, pageNumbers);
	}
	
	// Add last page and ellipsis if needed
	if (endPage < totalPages) {
		if (endPage < totalPages - 1) {
			const ellipsis = document.createElement("span");
			ellipsis.className = "page-ellipsis";
			ellipsis.textContent = "...";
			pageNumbers.appendChild(ellipsis);
		}
		addPageButton(totalPages, pageNumbers);
	}
}

// Helper function to add a page button
function addPageButton(pageNum, container) {
	const button = document.createElement("button");
	button.className = "page-number-btn";
	if (pageNum === currentPage) {
		button.classList.add("active");
	}
	button.textContent = pageNum;
	button.addEventListener("click", () => showPage(pageNum));
	container.appendChild(button);
}

// Поиск товаров
const searchInput = document.getElementById("searchInput");

function performSearch() {
	const searchText = searchInput.value.toLowerCase();
	
	// Filter items based on search
	allItems.forEach(itemElement => {
		const captionElement = itemElement.querySelector(".caption");
		if (!captionElement) return;
		
		const caption = captionElement.textContent.trim().toLowerCase();
		itemElement.style.display = caption.includes(searchText) ? "" : "none";
	});
	
	// Reset to first page after search
	currentPage = 1;
	updatePaginationControls();
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

function sortItems(comparator) {
	const container = document.querySelector(".inner");
	
	// Sort all items
	allItems.sort(comparator);
	
	// Re-append all items to maintain order
	allItems.forEach(item => container.appendChild(item));
	
	// Show current page
	showPage(currentPage);
}

// сортировки по data-id
const idSortToggle = document.getElementById("idSortToggle");
const idSortLabel = document.getElementById("idSortLabel");

idSortToggle.addEventListener("change", () => {
	sortItems((a, b) => {
		const idA = parseInt(a.querySelector(".btn").dataset.id);
		const idB = parseInt(b.querySelector(".btn").dataset.id);
		return idSortToggle.checked ? idB - idA : idA - idB;
	});
	
	idSortLabel.textContent = idSortToggle.checked ? "Newest first" : "Oldest first";
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

// Закрытие корзины по клику на крестик
document.getElementById("closeCartModal").addEventListener("click", () => {
	cartModal.classList.remove("show");
});

// Initialize pagination when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
	initializePagination();
	
	// Modified sort toggle event listener
	sortToggle.addEventListener("change", () => {
		sortItems((a, b) => {
			const priceA = parseInt(a.querySelector(".btn").dataset.price);
			const priceB = parseInt(b.querySelector(".btn").dataset.price);
			return sortToggle.checked ? priceB - priceA : priceA - priceB;
		});
		
		sortLabel.textContent = sortToggle.checked ? "Price: ⬇️" : "Price: ⬆️";
	});
	
	// Modified ID sort toggle event listener
	idSortToggle.addEventListener("change", () => {
		sortItems((a, b) => {
			const idA = parseInt(a.querySelector(".btn").dataset.id);
			const idB = parseInt(b.querySelector(".btn").dataset.id);
			return idSortToggle.checked ? idB - idA : idA - idB;
		});
		
		idSortLabel.textContent = idSortToggle.checked ? "Newest first" : "Oldest first";
	});
	
	// Modified random sort button event listener
	randomSortBtn.addEventListener("click", () => {
		randomSortBtn.classList.add("pressed");
		setTimeout(() => randomSortBtn.classList.remove("pressed"), 300);
		
		// Fisher-Yates shuffle
		for (let i = allItems.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[allItems[i], allItems[j]] = [allItems[j], allItems[i]];
		}
		
		// Show current page
		showPage(currentPage);
	});
});

// Initialize pagination
initializePagination();

 