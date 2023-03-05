import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import './style.css'

// Get the current date and time
let date = new Date();
// Get the time difference between the current time zone and UTC
let timeDifference = date.getTimezoneOffset();
// Convert the time difference from minutes to milliseconds
timeDifference = timeDifference * 60 * 1000;
// Subtract the time difference to get the date and time in Mexico City time zone
date = new Date(date.getTime() - timeDifference);

//
let year = date.getFullYear();

//
let month = date.getMonth();
//
let clickCounter = 0;
// Array of month names
const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
// Array of days names
const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
// Events of the year
const events = new Map<string, string>([
  ['0-5', "Mi cumpleaños"],
  ['1-20', "✨¡Feliz aniversario nubesita 🎉!✨"],
  ['2-18', "LA MOLE :v"],
  ['7-7', "¡Feliz cumpleaños nubesita! 🎉"],
  ['11-12', "✨¡Feliz aniversario de promesa! 🎉✨"],
]);

 //backward
document.getElementById("backward")?.addEventListener("click", () => {
  
  if(month == 0){
    month = 11;
    year = year - 1;
  }else {
    month = month - 1;
  }
  
  renderCalendar(year, month);
});

//forward
document.getElementById("forward")?.addEventListener("click", () => {
  
  if(month == 11){
    month = 0;
    year = year + 1;
  }else{
    month = month + 1;
  }

  renderCalendar(year, month);
});


function renderCalendar(currentYear: number, plusMonth: number){
  const container = document.querySelector<HTMLDivElement>('#month');
  container!.innerHTML = '';

  // Get the number of days in the current month
  const daysInMonth = new Date(currentYear, plusMonth + 1, 0).getDate();
  // Get the current month as a string
  const currentMonth = months[plusMonth];
  //
  
  document.getElementById('yearName')!.innerText =  year as unknown as string;
  // Update month name
  document.getElementById('monthName')!.innerText = currentMonth;
  //
  const  myDate = document.querySelector<HTMLImageElement>('#myDate');
  //
  myDate!.src = `./images/${plusMonth}.jpg` 
  // Create a table element
  const table = document.createElement('table');
  // table.className = "table-auto w-64 h-64 text-center"
  table.className = "table-auto table-sm w-full h-auto text-center"
  // Create a table body
  const tbody = document.createElement('tbody');
  // Create the rows with 7 columns
  let row = document.createElement('tr');
  // Get the starting day of the week for the first day of the month (Sunday = 0, Monday = 1, etc.)
  // const startDayOfWeek = new Date(date.getFullYear(), date.getMonth() + (plusMonth - 1), 1).getDay();
  const startDayOfWeek = new Date(currentYear,  plusMonth, 1).getDay();

  // Create a header row for the days of the week
  const headerRow = document.createElement('tr');
  // 
  for (let i = 0; i < daysOfWeek.length; i++) {
    const headerCell = document.createElement('th');
    headerCell.textContent = daysOfWeek[i];
    headerCell.className = 'bg-blue-400 border';
    headerRow.appendChild(headerCell);
  }
  // Add the header row to the table body
  tbody.appendChild(headerRow)

  for (let i = 1; i <= daysInMonth; i++) {
    let cell = document.createElement('td');
    cell.innerText = i.toString();
    // cell.className = 'px-6 py-4 bg-gray-500 border hover:bg-gray-400'
    cell.className = ' bg-gray-500 border hover:bg-gray-400'
    // Chechk if this is the first cell of week and it's not Sunday
    if(i === 1 && startDayOfWeek !== 0){
      //Add empty cells for the days before the first day of the month
      for(let j = 0; j < startDayOfWeek; j++){
        const emptyCell = document.createElement('td');
        emptyCell.className = 'bg-gray-500 border';
        row.appendChild(emptyCell);
      }
    }
    //
    cell = checkEvents(i,plusMonth,cell);
    //
    row.appendChild(cell);
    // If this is the last cell of the week, add the row to the table body and create new row
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
  // 
  renderCalendar(year, month);
})


function checkEvents(currentDay: number, currentMonth: number, cell: HTMLTableCellElement){

  const key = `${currentMonth}-${currentDay}`;
  const title = events.get(key);
  if (title && key != "1-20") {
    cell.className = 'bg-green-500 border hover:bg-green-400';
    cell.addEventListener('click', () => {
      Toastify({
        text: title,
        position: 'center',
        style: {
          background: 'linear-gradient(to right, #00b09b, #96c93d)',
        },
      }).showToast();
    });
  }

  if(key == "1-20"){
    cell.className = 'bg-green-500 border hover:bg-green-400';
    cell.addEventListener('click', () => {
      Toastify({
        text: title,
        position: 'center',
        style: {
          background: 'linear-gradient(to right, #00b09b, #96c93d)',
        },
      }).showToast();
      easterEgg();
    });
  }

  return cell;
}


function easterEgg() {
  clickCounter = clickCounter + 1;
  if(clickCounter == 10){
    window.location.href = "/calendar/secreto/" + "./easter.html";
    clickCounter = 0;
  }
}