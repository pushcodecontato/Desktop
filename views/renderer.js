window.ipcRenderer = require('electron').ipcRenderer;

/* Cria outra janela com a pagina escolhida */
window.getWindow = (pagina) => {
  console.log("Chamando mainProcesse ");
  ipcRenderer.send('openWindow',pagina);
}

/* Chama o proceseeo principal para gerar o pdf
  nome = caminnho pedidos.pdf
  html = <h1> Pedidos do ano </h1>
*/
window.genPDF = (nome,html)=>{
	console.log("CHamndo o mainProcess");
	console.log(ipcRenderer.send('genPDF',{html,nome}));
}
window.genCSV = (nome,csv)=>{

      var link = document.createElement('a');//Criando link de dowload

      link.href='data:text/csv;charset=utf-8,' + encodeURI(csv);//colocando o csv na url
      link.target='_blank';
      link.download = 'MobShare_' + new Date().getTime()  + '.csv';
      link.click();
}

/* Listener (escutas) para receber os dados do processo principal */

/* Recebe o evento genpdf (do processo main) quando for conpletado */
ipcRenderer.on('genPDF-complite',(event,pdf)=>{
	console.log("PDF gerado!!",pdf);

  var link = document.createElement('a');//Criando link de dowload

  link.href= pdf.filename;
  link.target='_blank';
  link.download = 'MobShare_' + new Date().getTime() + '.pdf';// mesclando o tempo para aleatoriedade
  link.click();
})


document.addEventListener('DOMContentLoaded', () => {
  // window.$ = window.jquery = require("jQuery");
  // window.Swal = require('sweetalert2')
   console.log("Estou na janela??")

});
