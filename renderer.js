window.ipcRenderer = require('electron').ipcRenderer;


window.getWindow = (pagina) => {
  console.log("Chamando mainProcesse ");
  ipcRenderer.send('openWindow',pagina);
}


document.addEventListener('DOMContentLoaded', () => {
  // window.$ = window.jquery = require("jQuery");
  // window.Swal = require('sweetalert2')
   console.log("Estou na janela??")

});
