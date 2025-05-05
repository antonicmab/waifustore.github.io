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
// Обработчик выбора товара
document.querySelectorAll(".btn").forEach(btn => {
	btn.addEventListener("click", () => {
		const id = btn.getAttribute("data-id");
		if (!id) return;

		item = id;
		tg.MainButton.setText(`Вы выбрали товар ${id}!`);
		tg.MainButton.show();
	});
});

// Отправка данных в бот при нажатии главной кнопки
Telegram.WebApp.onEvent("mainButtonClicked", function() {
	tg.sendData(item);
});

// Отображаем имя пользователя
let usercard = document.getElementById("usercard");
let p = document.createElement("p");
p.innerText = `${tg.initDataUnsafe.user.first_name ?? ''} ${tg.initDataUnsafe.user.last_name ?? ''}`;
usercard.appendChild(p);


