let tg = window.Telegram.WebApp;
tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#31B545';

// Pagination settings
// let currentCategory = 'all';
// let currentAnime = 'all';
const ITEMS_PER_PAGE = 20;
let currentPage = 1;
let totalItems = 0;
let allItems = [];

let filteredItems = [];

// Заменим старые переменные на этот объект
let filters = {
    type: 'all',
    anime: 'all',
    search: ''
};


// Initialize pagination
function initializePagination() {
    const container = document.querySelector(".inner");
    allItems = Array.from(container.querySelectorAll(".item"));
    
    // Добавляем атрибуты по умолчанию
    allItems.forEach(item => {
        const btn = item.querySelector(".btn");
        if (!btn.hasAttribute('data-tags')) {
            btn.setAttribute('data-tags', 'default');
        }
        if (!btn.hasAttribute('data-anime')) {
            btn.setAttribute('data-anime', 'all');
        }
    });
    
    filteredItems = [...allItems];
    totalItems = filteredItems.length;
    
    allItems.forEach(item => item.style.display = "none");
    showPage(currentPage);
    addPaginationControls();
}


function showPage(page) {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    allItems.forEach(item => item.style.display = "none"); // скрываем всё
    filteredItems.slice(start, end).forEach(item => item.style.display = ""); // показываем нужные

    currentPage = page;
    totalItems = filteredItems.length;
    updatePaginationControls();
}


function addPaginationControls() {
    const paginationDiv = document.querySelector(".pagination");
    if (!paginationDiv) return;

    paginationDiv.innerHTML = `
        <div class="pagination-content">
            <button id="prevPage" class="pagination-btn">⬅️</button>
            <div class="page-numbers"></div>
            <button id="nextPage" class="pagination-btn">➡️</button>
        </div>
    `;

    document.getElementById("prevPage").addEventListener("click", () => {
        if (currentPage > 1) showPage(currentPage - 1);
    });

    document.getElementById("nextPage").addEventListener("click", () => {
        if (currentPage < Math.ceil(totalItems / ITEMS_PER_PAGE)) showPage(currentPage + 1);
    });

    updatePageNumbers();
}

function updatePaginationControls() {
    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    updatePageNumbers();
}

function updatePageNumbers() {
    const pageNumbers = document.querySelector(".page-numbers");
    if (!pageNumbers) return;
    
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    pageNumbers.innerHTML = "";
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    if (startPage > 1) {
        addPageButton(1, pageNumbers);
        if (startPage > 2) {
            pageNumbers.appendChild(createEllipsis());
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        addPageButton(i, pageNumbers);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageNumbers.appendChild(createEllipsis());
        }
        addPageButton(totalPages, pageNumbers);
    }
}

function createEllipsis() {
    const ellipsis = document.createElement("span");
    ellipsis.className = "page-ellipsis";
    ellipsis.textContent = "...";
    return ellipsis;
}

function addPageButton(pageNum, container) {
    const button = document.createElement("button");
    button.className = "page-number-btn";
    if (pageNum === currentPage) button.classList.add("active");
    button.textContent = pageNum;
    button.addEventListener("click", () => showPage(pageNum));
    container.appendChild(button);
}

// Search functionality
const searchInput = document.getElementById("searchInput");
searchInput?.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();

    filteredItems = allItems.filter(itemElement => {
        const captionElement = itemElement.querySelector(".caption");
        if (!captionElement) return false;
        const caption = captionElement.textContent.trim().toLowerCase();
        return caption.includes(searchText);
    });

    currentPage = 1;
    showPage(currentPage); // обновляем страницу с учётом фильтра
});


// Cart functionality
let cart = [];
const cartIcon = document.getElementById("cartIcon");
const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const cartItems = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");

checkoutBtn.style.display = "none";

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
    checkoutBtn.style.display = total > 0 ? "block" : "none";

    cartItems.querySelectorAll("span[data-index]").forEach(span => {
        span.addEventListener("click", (e) => {
            cart.splice(parseInt(e.target.getAttribute("data-index")), 1);
            updateCartDisplay();
        });
    });
}

cartIcon?.addEventListener("click", () => {
    cartModal.classList.toggle("show");
    updateCartDisplay();
});

document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const label = btn.getAttribute("data-label");
        const price = parseInt(btn.getAttribute("data-price"));
        const id = btn.getAttribute("data-id");

        if (!label || isNaN(price) || !id) return;

        cart.push({ id, label, price });
        updateCartDisplay();

        Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        cartIcon.classList.add("shake");
        setTimeout(() => cartIcon.classList.remove("shake"), 600);
    });
});

// Sort functionality
function sortItems(comparator) {
    const container = document.querySelector(".inner");
    allItems.sort(comparator);
    allItems.forEach(item => container.appendChild(item));
    showPage(currentPage);
}

function setupSorting() {
    const sortToggle = document.getElementById("sortToggle");
    const sortLabel = document.getElementById("sortLabel");
    const idSortToggle = document.getElementById("idSortToggle");
    const idSortLabel = document.getElementById("idSortLabel");
    const randomSortBtn = document.getElementById('randomSortBtn');

    sortToggle?.addEventListener("change", () => {
        sortItems((a, b) => {
            const priceA = parseInt(a.querySelector(".btn").dataset.price);
            const priceB = parseInt(b.querySelector(".btn").dataset.price);
            return sortToggle.checked ? priceB - priceA : priceA - priceB;
        });
        sortLabel.textContent = sortToggle.checked ? "Price: ⬇️" : "Price: ⬆️";
    });

    idSortToggle?.addEventListener("change", () => {
        sortItems((a, b) => {
            const idA = parseInt(a.querySelector(".btn").dataset.id);
            const idB = parseInt(b.querySelector(".btn").dataset.id);
            return idSortToggle.checked ? idB - idA : idA - idB;
        });
        idSortLabel.textContent = idSortToggle.checked ? "Newest first" : "Oldest first";
    });

    randomSortBtn?.addEventListener("click", () => {
        randomSortBtn.classList.add("pressed");
        setTimeout(() => randomSortBtn.classList.remove("pressed"), 300);
        
        for (let i = allItems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
        }
        showPage(currentPage);
    });
}

// Layout adjustments
function adjustLayout() {
    const topBar = document.querySelector('.top-bar');
    const container = document.querySelector('.container');
    const toggleBtn = document.getElementById('toggleFiltersBtn');
    const bottomRow = document.querySelector('.bottom-row');

    if (topBar && container) {
        container.style.paddingTop = topBar.offsetHeight + 'px';
    }

    toggleBtn?.addEventListener('click', function() {
        bottomRow.classList.toggle('hidden');
    });
}

// Initialize everything
document.addEventListener("DOMContentLoaded", function() {
    initializePagination();
    setupSorting();
    adjustLayout();
    initTypeFilter();
    initAnimeFilter();
    
    document.getElementById("closeCartModal")?.addEventListener("click", () => {
        cartModal.classList.remove("show");
    });

    checkoutBtn?.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Корзина пуста!");
            return;
        }
        
        // Добавляем информацию о пользователе
        const user = tg.initDataUnsafe?.user;
        const payload = {
            items: cart,
            totalPrice: cart.reduce((sum, item) => sum + item.price, 0),
            user_id: user?.id,
            username: user?.username
        };
        
        console.log("Отправляемые данные:", payload); // Для отладки
        
        tg.sendData(JSON.stringify(payload));
        tg.close(); // Закрываем веб-приложение после отправки
    });
});




/////////////////////////////////////////////////////////////////
// Функция для фильтрации по категории
function filterByCategory(category) {
    currentCategory = category;
    
    // Обновляем текст кнопки
    const toggleBtn = document.getElementById('categoryToggleBtn');
    if (toggleBtn) {
        const categoryText = category === 'all' ? 'All Items' : 
                        //    category === 'default' ? 'Default' :
                           category === 'legs' ? 'Legs' :
                           category === 'milf' ? 'Milf' :
                           category === 'asian' ? 'Asian' : category;
        toggleBtn.textContent = `Category: ${categoryText} ▼`;
    }
    
    // Применяем фильтр
    filteredItems = allItems.filter(itemElement => {
        if (category === 'all') return true;
        const btn = itemElement.querySelector(".btn");
        const tags = btn.getAttribute("data-tags");
        return tags && tags.includes(category);
    });
    
    currentPage = 1;
    showPage(currentPage);
    hideCategoryDropdown();
}

// Функции для показа/скрытия dropdown
function toggleCategoryDropdown() {
    const dropdown = document.getElementById('categoryDropdown');
    dropdown.classList.toggle('show');
}

function hideCategoryDropdown() {
    const dropdown = document.getElementById('categoryDropdown');
    dropdown.classList.remove('show');
}

// Инициализация категорий
function initCategorySelector() {
    // Обработчик для основной кнопки
    document.getElementById('categoryToggleBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCategoryDropdown();
    });
    
    // Обработчики для вариантов выбора
    document.querySelectorAll('.category-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const category = e.target.getAttribute('data-category');
            filterByCategory(category);
        });
    });
    
    // Закрытие dropdown при клике вне его
    document.addEventListener('click', hideCategoryDropdown);
}

// Обновим функцию initializePagination
function initializePagination() {
    const container = document.querySelector(".inner");
    allItems = Array.from(container.querySelectorAll(".item"));
    
    // Добавляем теги по умолчанию, если их нет
    allItems.forEach(item => {
        const btn = item.querySelector(".btn");
        if (!btn.hasAttribute('data-tags')) {
            btn.setAttribute('data-tags', 'default');
        }
    });
    
    filteredItems = [...allItems];
    totalItems = filteredItems.length;
    
    allItems.forEach(item => item.style.display = "none");
    showPage(currentPage);
    addPaginationControls();
}

// Обновим функцию searchInput
searchInput?.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();

    filteredItems = allItems.filter(itemElement => {
        // Проверяем фильтр по категории
        if (currentCategory !== 'all') {
            const btn = itemElement.querySelector(".btn");
            const tags = btn.getAttribute("data-tags");
            if (!tags || !tags.includes(currentCategory)) return false;
        }
        
        // Проверяем поисковый запрос
        const captionElement = itemElement.querySelector(".caption");
        if (!captionElement) return false;
        const caption = captionElement.textContent.trim().toLowerCase();
        return caption.includes(searchText);
    });

    currentPage = 1;
    showPage(currentPage);
});









// Функция для применения всех фильтров
function applyAllFilters() {
    const searchText = searchInput.value.toLowerCase();
    filters.search = searchText;

    filteredItems = allItems.filter(itemElement => {
        const btn = itemElement.querySelector(".btn");
        if (!btn) return false;
        
        // Проверяем фильтр по типу
        if (filters.type !== 'all') {
            const tags = btn.getAttribute("data-tags");
            if (!tags || !tags.includes(filters.type)) return false;
        }
        
        // Проверяем фильтр по аниме
        if (filters.anime !== 'all') {
            const animeTag = btn.getAttribute("data-anime");
            if (!animeTag || animeTag !== filters.anime) return false;
        }
        
        // Проверяем поисковый запрос
        if (filters.search) {
            const captionElement = itemElement.querySelector(".caption");
            if (!captionElement) return false;
            const caption = captionElement.textContent.trim().toLowerCase();
            if (!caption.includes(filters.search)) return false;
        }
        
        return true;
    });
    
    currentPage = 1;
    showPage(currentPage);
}


// Инициализация фильтра по типу
function initTypeFilter() {
    const typeToggleBtn = document.getElementById('typeToggleBtn');
    const typeDropdown = document.getElementById('typeDropdown');
    
    typeToggleBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        typeDropdown.classList.toggle('show');
    });
    
    document.querySelectorAll('#typeDropdown .filter-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            filters.type = e.target.getAttribute('data-type');
            typeToggleBtn.textContent = `Type: ${e.target.textContent} ▼`;
            applyAllFilters();
            typeDropdown.classList.remove('show');
        });
    });
}

// Инициализация фильтра по аниме
function initAnimeFilter() {
    const animeToggleBtn = document.getElementById('animeToggleBtn');
    const animeDropdown = document.getElementById('animeDropdown');
    
    animeToggleBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        animeDropdown.classList.toggle('show');
    });
    
    document.querySelectorAll('#animeDropdown .filter-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            filters.anime = e.target.getAttribute('data-anime');
            animeToggleBtn.textContent = `Anime: ${e.target.textContent} ▼`;
            applyAllFilters();
            animeDropdown.classList.remove('show');
        });
    });
}

// Обновленный поиск
searchInput?.addEventListener("input", () => {
    filters.search = searchInput.value.toLowerCase();
    applyAllFilters();
});


