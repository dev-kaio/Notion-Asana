const calendarGrid = document.getElementById("calendar-grid");
const currentMonth = document.getElementById("current-month");

let date = new Date();

function renderCalendar() {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0 (Dom) a 6 (Sáb)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarGrid.innerHTML = "";
  currentMonth.textContent = date.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const startPadding = (firstDay + 6) % 7; // ajusta pra começar na segunda

  for (let i = 0; i < startPadding + daysInMonth; i++) {
    const cell = document.createElement("div");
    cell.classList.add("calendar-cell");

    if (i >= startPadding) {
      const day = i - startPadding + 1;
      const number = document.createElement("div");
      number.classList.add("day-number");
      number.textContent = day;
      cell.appendChild(number);
    }

    calendarGrid.appendChild(cell);
  }
}

document.getElementById("prev-month").onclick = () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
};

document.getElementById("next-month").onclick = () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
};

renderCalendar();
