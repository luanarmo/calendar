import Toastify from 'toastify-js'  // Import the Toastify library for showing notifications
import 'toastify-js/src/toastify.css'  // Import the Toastify library's CSS file
import './style.css'  // Import the CSS file for this calendar

// Get the current date and time
let date = new Date();
// Get the time difference between the current time zone and UTC
let timeDifference = date.getTimezoneOffset();
// Convert the time difference from minutes to milliseconds
timeDifference = timeDifference * 60 * 1000;
// Subtract the time difference to get the date and time in Mexico City time zone
date = new Date(date.getTime() - timeDifference);

let year = date.getFullYear();  // Get the current year
let month = date.getMonth();  // Get the current month (0-based)
const presentYear = date.getFullYear();  // Get the current year
const presentMonth = date.getMonth();  // Get the current month (0-based)
const presentDay = date.getDate(); // Get the day of month (0-31)

let clickCounter = 0;  // Initialize a counter for click events

// Array of month names
const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Array of day names
const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
// colors to event cell
const GREEN_CLASS = "bg-green-500 border hover:bg-green-400";
// color to easteregg event
const TOAST_TEXT_COLOR = "linear-gradient(to right, #00b09b, #96c93d)";

/**
 * An object representing an event in the calendar.
 *
 * @interface Event
 * @property {string} message - The message to be displayed for the event.
 * @property {boolean} easter - Indicates whether the event has an easter egg associated with it.
 */
interface Event {
  message: string;
  easter: boolean;
  fun?: () => void;
}
// Events of the year
const events = new Map<string, Event>([
  ['2023-0-5', { message: "Mi cumpleaños", easter: false }],
  ['2023-1-20', { message: "✨¡Feliz aniversario nubesita 🎉!✨", easter: false }],
  ['2023-2-18', { message: "LA MOLE :v", easter: false }],
  ['2023-7-7', { message: " ¡Feliz cumpleaños nubesita! 🎉", easter: false }],
  ['2023-11-12', { message: "✨¡Feliz aniversario de promesa! 🎉✨", easter: false }],
  ['2024-0-5', { message: "Mi cumpleaños 27 😁", easter: false }],
  ['2024-1-20', { message: "✨¡Feliz aniversario 2024 🏕️ 🎉!✨", easter: true, fun: easterEgg }],
  ['2025-0-5', { message: "Mi cumpleaños 😁", easter: false }],
  ['2025-1-20', { message: "✨¡Feliz aniversario 2025 🏕️ 🎉!✨", easter: true, fun: collage }],
  ['2025-7-7', { message: " ¡Feliz cumpleaños nubesita! 🎉", easter: false }],
  ['2025-3-5', { message: "Axe ceremonia 🎤🎉", easter: false }],
  ['2025-3-6', { message: "Axe ceremonia 🎤🎉", easter: false }],
]);

// Add a listener for the "backward" button
document.getElementById("backward")?.addEventListener("click", () => {
  // Decrement the month, wrapping around to December if necessary
  if (month == 0) {
    month = 11;
    year = year - 1;
  } else {
    month = month - 1;
  }
  // Redraw the calendar with the new month and year
  updateCalendar(year, month);
});

// Add a listener for the "forward" button
document.getElementById("forward")?.addEventListener("click", () => {
  // Increment the month, wrapping around to January if necessary
  if (month == 11) {
    month = 0;
    year = year + 1;
  } else {
    month = month + 1;
  }
  // Redraw the calendar with the new month and year
  updateCalendar(year, month);
});

/**
 * Render the calendar for the given year and month
 * @param currentYear Current Year in the calendar
 * @param currentMonth Current Month in the calendar
 */
function renderCalendar(currentYear: number, currentMonth: number) {
  const container = document.querySelector<HTMLDivElement>('#month');  // Get the container element for the calendar
  container!.innerHTML = '';  // Clear the container
  // Get the number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Get the current month as a string
  const monthName = months[currentMonth];
  // Update the year and month names in the UI
  document.getElementById('yearName')!.innerText = year as unknown as string;
  document.getElementById('monthName')!.innerText = monthName;
  // Get the 'myDate' image element
  const myDate = document.querySelector<HTMLImageElement>('#myDate');
  // Set the source of the 'myDate' image element to the image corresponding to the current month
  myDate!.src = `./images/${currentMonth}.jpg`;
  // Create a table element
  const table = document.createElement('table');
  // Set the class of the table element to make it responsive
  table.className = "table-auto table-sm w-full h-auto text-center";
  // Create a table body
  const tbody = document.createElement('tbody');
  // Create the rows with 7 columns
  let row = document.createElement('tr');
  // Get the starting day of the week for the first day of the month (Sunday = 0, Monday = 1, etc.)
  const startDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  // Create a header row for the days of the week
  const headerRow = document.createElement('tr');

  // Create the cells for each day of the week and add them to the header row
  for (let i = 0; i < daysOfWeek.length; i++) {
    const headerCell = document.createElement('th');
    headerCell.textContent = daysOfWeek[i];
    headerCell.className = 'bg-blue-400 border';
    headerRow.appendChild(headerCell);
  }

  // Add the header row to the table body
  tbody.appendChild(headerRow);

  for (let i = 1; i <= daysInMonth; i++) {
    let cell = document.createElement('td');
    // id of the td
    const id = `${currentYear}-${currentMonth}-${i}`;
    // text of the td
    cell.innerText = i.toString();
    // Set the class of the cell to make it responsive and add a hover effect
    cell.className = ' bg-gray-500 border hover:bg-gray-400';
    cell.id = id;
    if (i === 1 && startDayOfWeek !== 0) {
      //Add empty cells for the days before the first day of the month
      for (let j = 0; j < startDayOfWeek; j++) {
        const emptyCell = document.createElement('td');
        emptyCell.className = 'bg-gray-500 border';
        row.appendChild(emptyCell);
      }
    }
    // Add the cell to the current row
    row.appendChild(cell);
    // If this is the last cell of the week, add the row to the table body and create a new row
    if ((i + startDayOfWeek) % 7 === 0 || i === daysInMonth) {
      tbody.appendChild(row);
      row = document.createElement('tr');
    }
  }
  // Append the last row to the table body, even if it has less than 7 cells
  tbody.appendChild(row);
  // Append the table body to the table
  table.appendChild(tbody);
  // Append the table to the month div
  container?.appendChild(table);
}

/**
 * Listen to the DOMContentLoaded event
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
  // Draw the calendar with the current month and year
  updateCalendar(year, month);
})

/**
 * Returns the text and color of the toast for a given event.
 * @param event The event object that contains the message and the easter flag.
 * @returns An object with the text and color properties for the toast.
 */
function getToastData(event: Event): { text: string; color: string } {
  // Return an object with the message and the color of the event
  return {
    text: event.message,
    color: event.easter ? TOAST_TEXT_COLOR : "rgb(96, 165, 250)",
  };
}

/**
 * Adds a listener to a given cell to show the toast and call the easterEgg function if needed.
 * @param cell The HTML table cell element to add the listener to.
 * @param event The event object that contains the message and the easter flag.
 * @returns {void}
 */
function addCellListener(cell: HTMLTableCellElement, event: Event) {
  // Get the toast data from the event
  let { text, color } = getToastData(event);
  // Add a click listener to the cell
  cell.addEventListener("click", () => {
    // Show the toast with the text and color
    Toastify({
      text,
      position: "center",
      style: {
        background: color,
      },
    }).showToast();
    // If the event has an Easter egg, call the easterEgg function
    if (event.easter) {
      event.fun?.();
    }
  });
}

/**
  * Search for events on the calendar and assign them a class and a listener.
  * @global events A global variable that stores the events. 
  * @returns {void}
*/
function searchEvents() {
  let dayCell: HTMLTableCellElement | null;
  events.forEach((value: Event, key: string) => {
    dayCell = document.getElementById(key) as HTMLTableCellElement;

    if (dayCell) {
      dayCell.className = GREEN_CLASS;
      addCellListener(dayCell, value);
    }
  });
}
/**
 * Checks if the current day is on the calendar and assigns it a special class.
 * @returns {void}
 */
function checkCurrentDay() {
  let cell = document.getElementById(`${presentYear}-${presentMonth}-${presentDay}`);
  if (cell) {
    cell.className = ' bg-gray-500 border border-blue-400 border-2 hover:bg-blue-300';
    console.log(presentYear)
  }
}

/**
 * Redirect to an easter egg page after the function has been called 10 times.
 * This function increments a global counter every time it is called and checks if the counter equals 10.
 * If the counter equals 10, it redirects the user to an easter egg page.
 * @global clickCounter A global variable that stores the number of times the function has been called.
 * @returns {void}
 */
function easterEgg() {
  clickCounter = clickCounter + 1;
  if (clickCounter === 10) {
    window.location.href = "/calendar/secreto/" + "./easter.html";
    clickCounter = 0;
  }
}

function collage() {
  window.location.href = "/calendar/secreto/" + "./invitacion.html";
}

const updateCalendar = (year: number, month: number) => {
  renderCalendar(year, month);
  searchEvents();
  checkCurrentDay();
}