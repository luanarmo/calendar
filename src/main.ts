import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import './style.css'


let clickCounter = 0;
//
let month = 0;
 // Array of month names
 const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
//backward
document.getElementById("backward")?.addEventListener("click", () => {

  if(month >= 1){
    month = month - 1;
  }

  if(month <= 0){
    Toastify({
      text: "Nomas programe para que jale con el presente año :v",
    }).showToast()
  }
  //
  renderCalendar(month);
});

//forward
document.getElementById("forward")?.addEventListener("click", () => {

  if(month < 11){
    month = month + 1;
  }

  if(month >= 11){
    Toastify({
      text: "Nomas programe para que jale con el presente año :v",
    }).showToast()
  }
  //
  renderCalendar(month);
});


function renderCalendar(plusMonth: number){
  const container = document.querySelector<HTMLDivElement>('#month');
  container!.innerHTML = '';
  // Get the current date and time
  let date = new Date();
  // Get the time difference between the current time zone and UTC
  let timeDifference = date.getTimezoneOffset();
  // Convert the time difference from minutes to milliseconds
  timeDifference = timeDifference * 60 * 1000;
  // Subtract the time difference to get the date and time in Mexico City time zone
  date = new Date(date.getTime() - timeDifference);
  // Get the number of days in the current month
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + plusMonth, 0).getDate();
  // Get the current month as a string
  const currentMonth = months[plusMonth];
  //
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
  for (let i = 1; i <= daysInMonth; i++) {
    let cell = document.createElement('td');
    cell.innerText = i.toString();
    // cell.className = 'px-6 py-4 bg-gray-500 border hover:bg-gray-400'
    cell.className = ' bg-gray-500 border hover:bg-gray-400'
    //
    cell = checkEvents(i,plusMonth,cell);
    //
    row.appendChild(cell);
    // If the current cell is the 7th cell, create a new row
    if (i % 7 === 0) {
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
  renderCalendar(month);
})


function checkEvents(currentDay: number, currentMonth: number, cell: HTMLTableCellElement){
  const events = new Map<string, string>([
    ['0-5', "Mi cumpleaños"],
    ['1-20', "✨¡Feliz aniversario nubesita 🎉!✨"],
    ['2-18', "LA MOLE :v"],
    ['7-7', "¡Feliz cumpleaños nubesita! 🎉"],
  ]);

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
    window.location.href = "./easter.html";
    clickCounter = 0;
  }
}