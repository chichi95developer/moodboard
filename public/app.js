const dateElement = document.querySelector("#date");
const dayElement = document.querySelector("#day");
const timeElement = document.querySelector("#time");
const confirmation = document.querySelector("#confirmation");
const moodCards = document.querySelectorAll(".mood-card");
const historyList = document.querySelector("#history-list");
const historySummary = document.querySelector("#history-summary");
const chart = document.querySelector("#mood-chart");
const storageKey = "moodboard-history";

const moods = {
  Happy: { emoji: "😊", score: 6 }, Dull: { emoji: "😐", score: 5 },
  Bored: { emoji: "😑", score: 4 }, Confused: { emoji: "😕", score: 3 },
  Sad: { emoji: "😢", score: 2 }, Angry: { emoji: "😡", score: 1 }
};

function localDateKey(date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date - offset).toISOString().slice(0, 10);
}

function getHistory() {
  try {
    const history = JSON.parse(localStorage.getItem(storageKey) || "{}");
    return typeof history === "object" && history ? history : {};
  } catch { return {}; }
}

function saveHistory(history) { localStorage.setItem(storageKey, JSON.stringify(history)); }

function getLastThirtyDays() {
  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (29 - index));
    return { date, key: localDateKey(date) };
  });
}

function updateDateTime() {
  const now = new Date();
  dateElement.textContent = new Intl.DateTimeFormat(undefined, { month: "long", day: "numeric", year: "numeric" }).format(now);
  dayElement.textContent = new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(now);
  timeElement.textContent = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit" }).format(now);
  timeElement.dateTime = now.toISOString();
}

function moodNameWithEmoji(moodName) { return `${moodName} ${moods[moodName].emoji}`; }

function setSelectedMood(moodName) {
  moodCards.forEach((card) => {
    const selected = card.dataset.mood === moodName;
    card.classList.toggle("selected", selected);
    card.setAttribute("aria-pressed", String(selected));
  });
}

function renderChart(entries) {
  const plotted = entries.map((entry, index) => entry.mood ? { index, score: moods[entry.mood].score, mood: entry.mood } : null).filter(Boolean);
  const width = 600, height = 190, padding = 15;
  const x = (index) => padding + (index / 29) * (width - padding * 2);
  const y = (score) => padding + ((6 - score) / 5) * (height - padding * 2);
  const grid = [1, 3.5, 6].map((score) => `<line class="chart-grid-line" x1="${padding}" y1="${y(score)}" x2="${width - padding}" y2="${y(score)}"/>`).join("");

  if (!plotted.length) {
    chart.innerHTML = `${grid}<text class="chart-empty" x="300" y="98">Your mood trend will appear after your first check-in.</text>`;
    return;
  }
  const line = plotted.map((point, index) => `${index ? "L" : "M"}${x(point.index).toFixed(1)},${y(point.score).toFixed(1)}`).join(" ");
  const first = plotted[0], last = plotted[plotted.length - 1];
  const area = `${line} L${x(last.index).toFixed(1)},${height - padding} L${x(first.index).toFixed(1)},${height - padding} Z`;
  const dots = plotted.map((point) => `<circle class="chart-point" cx="${x(point.index).toFixed(1)}" cy="${y(point.score).toFixed(1)}" r="5"><title>${moodNameWithEmoji(point.mood)}</title></circle>`).join("");
  chart.innerHTML = `<defs><linearGradient id="area-gradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#d9c8f5" stop-opacity=".8"/><stop offset="100%" stop-color="#d9c8f5" stop-opacity=".06"/></linearGradient></defs>${grid}<path class="chart-area" d="${area}"/><path class="chart-line" d="${line}"/>${dots}`;
}

function renderHistory() {
  const history = getHistory();
  const entries = getLastThirtyDays().map((day) => ({ ...day, mood: history[day.key] }));
  const checkIns = entries.filter((entry) => entry.mood);
  historySummary.textContent = checkIns.length ? `${checkIns.length} day${checkIns.length === 1 ? "" : "s"} checked in` : "No check-ins yet";
  historyList.innerHTML = entries.map((entry) => {
    const label = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(entry.date);
    const mood = entry.mood && moods[entry.mood] ? moods[entry.mood] : null;
    const today = entry.key === localDateKey(new Date()) ? " today" : "";
    const content = mood ? `<span class="history-emoji">${mood.emoji}</span><span class="history-mood">${entry.mood}</span>` : '<span class="history-empty" aria-hidden="true">—</span><span class="history-mood">No entry</span>';
    return `<article class="history-day${today}" aria-label="${label}: ${mood ? moodNameWithEmoji(entry.mood) : "no mood selected"}"><span class="history-date">${label}</span>${content}</article>`;
  }).join("");
  renderChart(entries);
}

function selectMood(selectedCard) {
  const moodName = selectedCard.dataset.mood;
  const history = getHistory();
  history[localDateKey(new Date())] = moodName;
  saveHistory(history);
  setSelectedMood(moodName);
  confirmation.textContent = `Today you’re feeling ${moodNameWithEmoji(moodName)}`;
  renderHistory();
}

function restoreToday() {
  const moodName = getHistory()[localDateKey(new Date())];
  if (moodName && moods[moodName]) {
    setSelectedMood(moodName);
    confirmation.textContent = `Today you’re feeling ${moodNameWithEmoji(moodName)}`;
  }
}

moodCards.forEach((card) => card.addEventListener("click", () => selectMood(card)));
updateDateTime();
restoreToday();
renderHistory();
setInterval(updateDateTime, 1000);
