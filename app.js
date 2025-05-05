// Modified app.js with fixed search functionality
let tg = window.Telegram.WebApp;
tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#31B545';

let item = "";

// Универсальный обработчик для всех кнопок с классом "item-btn"
document.querySelectorAll(".btn").forEach(btn => {
	btn.addEventListener("click", () => {
		const id = btn.getAttribute("data-id");
		if (!id) return;

		item = id;
		tg.MainButton.setText(`Вы выбрали товар ${id}!`);
		tg.MainButton.show();
	});
});


// Отправляем выбранный товар в бота
Telegram.WebApp.onEvent("mainButtonClicked", function(){
	tg.sendData(item);
});

// Отображаем имя пользователя
let usercard = document.getElementById("usercard");
let p = document.createElement("p");

p.innerText = `${tg.initDataUnsafe.user.first_name ?? ''} ${tg.initDataUnsafe.user.last_name ?? ''}`;
usercard.appendChild(p);

// POISK - Enhanced search functionality
const searchInput = document.getElementById("searchInput");

// Function to perform search
function performSearch() {
    console.log("Performing search...");
    const searchText = searchInput.value.toLowerCase();
    const items = document.querySelectorAll(".item");
    
    console.log(`Search text: "${searchText}", Found ${items.length} items`);
    
    items.forEach(item => {
        const caption = item.querySelector(".caption").textContent.toLowerCase();
        console.log(`Checking item: "${caption}"`);
        
        if (caption.includes(searchText)) {
            console.log(`Match found - showing: "${caption}"`);
            item.style.display = "block";
        } else {
            console.log(`No match - hiding: "${caption}"`);
            item.style.display = "none";
        }
    });
}

// Listen for input changes
searchInput.addEventListener("input", performSearch);

// Listen for Enter key press
searchInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission if inside a form
        performSearch();
    }
});

// Add submit event listener to the form if it exists
const searchForm = document.getElementById("searchForm");
if (searchForm) {
    searchForm.addEventListener("submit", function(event) {
        event.preventDefault();
        performSearch();
    });
}