const dateElement = document.querySelector("#date");
const dayElement = document.querySelector("#day");
const timeElement = document.querySelector("#time");
const confirmation = document.querySelector("#confirmation");
const moodCards = document.querySelectorAll(".mood-card");

function updateDateTime() {
  const now = new Date();
  dateElement.textContent = new Intl.DateTimeFormat(undefined, { month: "long", day: "numeric", year: "numeric" }).format(now);
  dayElement.textContent = new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(now);
  timeElement.textContent = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit" }).format(now);
  timeElement.dateTime = now.toISOString();
}

function selectMood(selectedCard) {
  moodCards.forEach((card) => {
    const selected = card === selectedCard;
    card.classList.toggle("selected", selected);
    card.setAttribute("aria-pressed", String(selected));
  });
  confirmation.textContent = `Today you’re feeling ${selectedCard.dataset.mood} ${selectedCard.dataset.emoji}`;
}

moodCards.forEach((card) => card.addEventListener("click", () => selectMood(card)));
updateDateTime();
setInterval(updateDateTime, 1000);
