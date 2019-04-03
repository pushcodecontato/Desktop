window.ipcRenderer = require('electron').ipcRenderer;


window.getWindow = (pagina) => {
  console.log("Chamando mainProcesse ");
  ipcRenderer.send('openWindow',pagina);
}
window.genPdf = (nome,html)=>{
	console.log("CHamndo o mainProcess");
	console.log(ipcRenderer.send('genPDF',{html,nome}));
}

/* Recebe o evento genpdf (do processo main) quando for conpletado */
ipcRenderer.on('genPdf-complite',(event,arg)=>{
	console.log("PDF gerado!!",arg);

})


document.addEventListener('DOMContentLoaded', () => {
  // window.$ = window.jquery = require("jQuery");
  // window.Swal = require('sweetalert2')
   console.log("Estou na janela??")

});
