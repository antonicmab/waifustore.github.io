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
document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const caption = btn.getAttribute("caption");
        const price = btn.getAttribute("data-price");  // Получаем цену из атрибута
        const id = btn.getAttribute("data-id");  // Получаем id товара

        if (!caption || !price || !id) return;

        // Сохраняем выбранные данные
        item = caption;
        itemPrice = parseInt(price);  // Сохраняем цену как число

        tg.MainButton.setText(`Buy set of ${caption}!`);
        tg.MainButton.show();
    });
});

// // Универсальный обработчик для всех кнопок с классом "item-btn"
// document.querySelectorAll(".btn").forEach(btn => {
// 	btn.addEventListener("click", () => {
// 		const id = btn.getAttribute("data-id");
// 		if (!id) return;

// 		item = id;
// 		tg.MainButton.setText(Вы выбрали товар ${id}!);
// 		tg.MainButton.show();
// 	});
// });


// // Отправляем выбранный товар в бота
// Telegram.WebApp.onEvent("mainButtonClicked", function(){
// 	tg.sendData(item);
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
let usercard = document.getElementById("usercard");
let p = document.createElement("p");
p.innerText = `${tg.initDataUnsafe.user.first_name ?? ''} ${tg.initDataUnsafe.user.last_name ?? ''}`;
usercard.appendChild(p);


