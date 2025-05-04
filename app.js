let tg = window.Telegram.WebApp;
tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#31B545';

let item = "";

// Универсальный обработчик для всех кнопок с классом "item-btn"
document.querySelectorAll(".item-btn").forEach(btn => {
	btn.addEventListener("click", () => {
		const id = btn.dataset.id; // получаем data-id
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
