import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import './style.css'


// Listen to the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    Toastify({
        text: "Secretiño",
        position: 'center',
        style: {
          background: 'linear-gradient(to right, #00b09b, #96c93d)',
        },
      }).showToast();
    
})
