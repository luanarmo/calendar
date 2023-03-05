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
let clickCounter = 0;  // Initialize a counter for click events

// Array of month names
const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Array of day names
const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

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
}
// Events of the year
const events = new Map<string, Event>([
  ['0-5', { message :"Mi cumpleaños" , easter: false }],
  ['1-20', { message: "✨¡Feliz aniversario nubesita 🎉!✨", easter : true }],
  ['2-18', { message: "LA MOLE :v", easter : false }],
  ['7-7', { message: " ¡Feliz cumpleaños nubesita! 🎉", easter : false }],
  ['11-12', { message: "✨¡Feliz aniversario de promesa! 🎉✨", easter : false }],
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
  renderCalendar(year, month);
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
  renderCalendar(year, month);
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
    cell.innerText = i.toString();

    // Set the class of the cell to make it responsive and add a hover effect
    cell.className = ' bg-gray-500 border hover:bg-gray-400';

    if(i === 1 && startDayOfWeek !== 0){
      //Add empty cells for the days before the first day of the month
      for(let j = 0; j < startDayOfWeek; j++){
        const emptyCell = document.createElement('td');
        emptyCell.className = 'bg-gray-500 border';
        row.appendChild(emptyCell);
      }
    }

    // Check if there are any events for this day and add them to the cell
    cell = checkEvents(i, currentMonth, cell);

    // Add the cell to the current row
    row.appendChild(cell);

    // If this is the last cell of the week, add the row to the table body and create a new row
    if((i + startDayOfWeek) % 7 === 0 || i === daysInMonth){
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

// Listen to the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
  // Draw the calendar with the current month and year
  renderCalendar(year, month);
})

/**
  * Check if there is an event for the current day and month and add a click event listener to the cell
  * @param currentDay The current day being rendered in the calendar
  * @param currentMonth The current month being rendered in the calendar
  * @param cell The HTML table cell element to add the event listener to
  * @returns The modified HTML table cell element with the event listener added if there is an event for the current day and month
*/
function checkEvents(currentDay: number, currentMonth: number, cell: HTMLTableCellElement){
  // Generate the key to look up the event in the events map
  const key = `${currentMonth}-${currentDay}`;
  // Get the event object for the current day and month from the events map
  const event = events.get(key);
  // Extract the message and easter properties from the event object
  const msg = event?.message;
  const easter = event?.easter;

  // If there is an event for the current day and month, add a click event listener to the cell
  if (msg) {
    // Add the appropriate CSS classes to the cell to indicate that there is an event
    cell.className = 'bg-green-500 border hover:bg-green-400';
    // Add a click event listener to the cell that displays a toast notification with the event 
    cell.addEventListener('click', () => {
      Toastify({
        text: msg,
        position: 'center',
        style: {
          background: 'linear-gradient(to right, #00b09b, #96c93d)',
        },
      }).showToast();
      // If the event have an Easter egg, call the easterEgg() function
      if(easter == true){
        easterEgg();
      }

    });
  }
  // Return the modified HTML table cell element with the event listener added if there is an event for the current day and month
  return cell;
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
  if(clickCounter == 10){
    window.location.href = "/calendar/secreto/" + "./easter.html";
    clickCounter = 0;
  }
}