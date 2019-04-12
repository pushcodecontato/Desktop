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

try{

var mysql = require("mysql");

var con = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'12345ola',
  database:'mob_share'
});

con.connect(erro=>{
 if(erro)console.log("Erro:",erro)
 else console.log("Conexão bem sucedida");
});

setInterval(()=>{
 con.query("SELECT 1");
},14000);

// Retorna apenas a primeira ROW
con.readQuery = (sql, prepared) => {
    return new Promise(function(resolve, reject){

         // Mostra um aviso, caso a query não tenha limit 1 no final
         if(sql.substr(-7).toLowerCase()!='limit 1'){
               console.warn("Database.js: read Query sem limit 1");
         }

         // Executa a query
         con.query(sql, prepared, (err, answer) => {
                if(err) reject(err);
                else(resolve(answer[0]));

         });

   });

};

// Retorna apenas a primeira ROW
con.updateQuery = (sql, prepared) => {

    prepared = prepared || [];

    return new Promise(function(resolve, reject){

        // Executa a query
        con.query(sql, prepared, (err,result) => {

            if(err) return reject(err);
            
            result.id = result.insertedId;
            resolve(result);
	});
   });

};

// Retorna a lista de rows
con.fetch = function(sql, prepared, callback){

    return new Promise((resolve, reject) => {

          con.query(sql, prepared, (err, answer) => {
                if(err) reject(err);
                else resolve(answer);

          });

     });
};

window.db = con;

}catch(erro){
  console.log("Erro : ",erro.toString());
}
