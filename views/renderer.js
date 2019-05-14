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
ipcRenderer.on('init',(event,dados)=>{
  console.log("Evento init ocorreu!!");
  window.init = dados;
})

document.addEventListener('DOMContentLoaded', () => {
  // window.$ = window.jquery = require("jQuery");
  // window.Swal = require('sweetalert2')
   console.log("Estou na janela??")

});

try{
function connect(config){

    var mysql = require("mysql");
    var con = {};
    if(typeof config == "undefined"){
      con = mysql.createConnection({
        host:'mob-share.mysql.uhserver.com',
        user:'mob_share1',
        password:'Pushcode1@',
        database:'mob_share'
      });
    } else {
      con = mysql.createConnection(config);
    }

    con.connect(erro=>{
     if(erro){

       $('[role="dialog"] form').dialog('destroy');

       console.log("Falha na coneção !!",erro);

       //if(typeof window.frmUser != "undefined")window.frmUser.dialog('destroy');

       $( `<div title=" Falha na conexão! ">
            <p>
              <span class="ui-icon  ui-icon-mail-closed" style="float:left; margin:0 7px 50px 0;"></span>
            </p>
            <p>
              Ocorreu um erro ao conectar!!
              ${erro.toString()}
            </p>
          </div>` ).dialog({
                modal: true,
                width:'425px',
                open: function(event, ui) {
                  console.log("OI!!!");
                   $(this).parents(".ui-dialog:first").find(".ui-dialog-titlebar-close").remove();
                   //if(typeof window.frmUser != "undefined")window.frmUser.dialog('destroy');
                   setTimeout(function(){
                     if(typeof window.frmUser != "undefined")window.frmUser.dialog('destroy');
                   },500);
                },
                buttons: {
                  'Tentar Novamente': function() {
                    $( this ).dialog( "close" );
                    connect();
                  },
                  'Reconfigurar':function(){

                    $( this ).dialog( "close" );
                    $('[role="dialog"] form').dialog('destroy')

                    let alerta = new Alert(`<form>\
                                                <div class="row">
                                                   <div class="cold6">
                                                        <label class="row"> Usuario: </label>
                                                        <div class="content-icon-input cold10">
                                                            <input name="user" class="input-icone"  placeholder="root" required>
                                                            <span aria-hidden="true" class="icon_profile"></span>
                                                        </div>
                                                   </div>
                                                   <div class="cold3">
                                                        <label class="row"> Banco: </label>
                                                        <input  name="database" placeholder="mob_share"  required>
                                                   </div>
                                                </div>
                                                <div class="row">
                                                   <div class="cold6">
                                                        <label class="row"> Servidor: </label>
                                                        <div class="content-icon-input cold10">
                                                            <input name="host" class="input-icone" placeholder="mob-share.mysql.uhserver.com" required>
                                                            <span aria-hidden="true" class="icon_drive"></span>
                                                        </div>
                                                   </div>
                                                   <div class="cold3">
                                                        <label class="row"> Porta: </label>
                                                        <input name="telefone" placeholder="3306"  required>
                                                   </div>
                                                </div>
                                                <div class="row">
                                                   <div class="cold8" style="width:81%;">
                                                        <label class="row"> Senha: </label>
                                                        <div class="content-icon-input cold10">
                                                            <input name="password" type="password" class="input-icone" required>
                                                            <span aria-hidden="true" class="icon_key_alt"></span>
                                                        </div>
                                                   </div>
                                                </div>
                                            </form>`);
                      alerta.buttons.push({
                        texto:'Conectar',
                        click:function(){
                          alerta.close();

                          let host      = alerta.janela.find('input[name="host"]').val() || 'localhost';
                          let user      = alerta.janela.find('input[name="user"]').val() || 'root';
                          let password  = alerta.janela.find('input[name="password"]').val() || '';
                          let database  = alerta.janela.find('input[name="database"]').val() || 'mob_share';

                          connect({ host, user, password, database});
                          setTimeout(function(){
                            frmLogar()
                          },400)
                        }
                      },{
                        texto:'Tentar',
                        click:function(){

                          let host      = alerta.janela.find('input[name="host"]').val();
                          let user      = alerta.janela.find('input[name="user"]').val();
                          let password  = alerta.janela.find('input[name="password"]').val();
                          let database  = alerta.janela.find('input[name="database"]').val();

                          let contmp = mysql.createConnection({
                            host,
                            user,
                            password,
                            database
                          });
                          contmp.connect(erro=>{
                            if(erro){
                              alert('Erro ao conectar! ')
                            }else{
                              alert('Conexão bem sucedida!')
                            }
                            console.log(erro);
                          })

                        }
                      })
                      alerta.view(' Configurar Banco de dados ').then(html=>{}).catch(erro=>{
                        connect();
                      });
                  }
                }
              });
     }
     else console.log(" \033[01;37m Conexão \033[04;32m bem sucedida \033[00;37m ");
    });

    /* Mantém a Conexão ativa! Pingando a cada 14s */
    setInterval(()=>{
     con.query("SELECT 1");
    },14000);


    // Retorna o Id do dado inserido
    /*
      db.selectAll('INSERT INTO tbl_permissoes (nome, titulo) VALUES ('sadasda', 'asdasd')
      db.selectAll('tbl_permissoes (nome, titulo) VALUES ('sadasda', 'asdasd')
    */
    con.insert = function(sql, prepared, callback){

        return new Promise((resolve, reject) => {

              if(sql.toString().toLowerCase().search('insert') < 0)sql = 'INSERT INTO '+ sql;

              con.query(sql, prepared, (err, resposta) => {
                    if(err) reject(err);
                    // Devolvendo o id inserido
                    else resolve(resposta.insertId);

              });

         });
    };
    // Retorna a lista de rows Afetadas
    /*
      db.selectAll('UPDATE tbl_permissoes SET id_permissoes = 0, nome = '' WHERE id = 27')
      db.selectAll('tbl_permissoes SET id_permissoes = 0, nome = '' WHERE id = 27')
    */
    con.update = function(sql, prepared, callback){

        return new Promise((resolve, reject) => {

              if(sql.toString().toLowerCase().search('where') < 0)console.warn(" \033[05;31 Atenção Update SEM WHERE !! \033[00;37m ");

              if(sql.toString().toLowerCase().search('update') < 0)sql = 'UPDATE '+ sql;


              con.query(sql, prepared, (err, resposta) => {
                    if(err) reject(err);
                    // devolvendo o numero de linhas afetadas
                    else resolve(resposta.affectedRows);

              });

         });
    };

    // Retorna as linhas
    /*
      db.selectAll('SELECT * FROM tbl_permissoes ')
      db.selectAll('tbl_usuario_desktop')
    */
    con.select = function(sql, prepared, callback){

        return new Promise((resolve, reject) => {

              //if(sql.toString().toLowerCase().search('limit') < 0 )console.log(" Query sem limit!! Cuidado com a paginação companheiro! ");

              if(sql.toString().toLowerCase().search('select') < 0)sql = 'SELECT * FROM '+ sql;

              con.query(sql, prepared, (err, resposta) => {
                    if(err) reject(err);
                    else resolve(resposta);

              });

         });
    };

    // Retorna a lista de rows Afetadas pelo delete
    /*
      db.selectAll('DELETE FROM tbl_permissoes WHERE id = 27 ')
      db.selectAll(' tbl_usuario_desktop where id = 27 ')
    */
    con.delete = function(sql, prepared, callback){

        return new Promise((resolve, reject) => {

              if(sql.toString().toLowerCase().search('where') < 0)console.warn(" \033[05;31 Atenção Delete SEM WHERE !! \033[00;37m ");

              if(sql.toString().toLowerCase().search('delete from') < 0)sql = ' DELETE FROM '+ sql;

              con.query(sql, prepared, (err, resposta) => {
                    if(err) reject(err);
                    //Devolvendo o numero de linhas afetadas
                    else resolve(resposta.affectedRows);

              });

         });
    };

    // Rotorna apenas uma Linha !! sem necessidade de colocar limit 1
    /*
      db.selectAll('SELECT * FROM tbl_usuario_desktop where id = 27 ')
      db.selectAll('SELECT * FROM tbl_usuario_desktop where id = 27 limit 1')
      db.selectAll('SELECT * FROM tbl_usuario_desktop where id = 27 ')
      db.selectAll(' tbl_usuario_desktop where id = 27 ')
    */
    con.selectById = (sql, prepared) => {
        return new Promise(function(resolve, reject){

          // Caso seja db.selectAll('SELECT * FROM tbl_usuario_desktop where id = 27 ')
          if(sql.toString().toLowerCase().search('limit') < 0)sql = sql + ' limit 1 ';

          // Caso seja db.selectAll(' tbl_usuario_desktop where id = 27 ')
          if(sql.toString().toLowerCase().search('select') < 0)sql = 'SELECT * FROM '+ sql;

           // Executa a query
           con.query(sql, prepared, (err, resposta) => {
                  if(err) reject(err);
                  else(resolve(resposta[0]));

           });

       });

    };
    // Rotorna O REULTADO DE SELECT * FROM <tabela_do_sql>
    /*
      db.selectAll('tbl_usuario_desktop')
      db.selectAll('SELECT * FROM tbl_usuario_desktop')
    */
    con.selectAll = (sql, prepared) => {
        return new Promise(function(resolve, reject){

             // Mostra um aviso, caso a query não tenha limit
             //if(sql.toString().toLowerCase().search('limit') < 0 )console.log(" Query sem limit!! Cuidado com a paginação companheiro! ");

             if(sql.toString().toLowerCase().search('select') < 0)sql = 'SELECT * FROM '+ sql;

             // Executa a query
             con.query(sql, prepared, (err, resposta) => {
                    if(err) reject(err);
                    else(resolve(resposta));

             });

       });

    };
    /* Metodo aberto Retorna oque o query fez! Para fazer insert,uptade,delete,select e etc */
    con.execute = function(sql, prepared, callback){

        return new Promise((resolve, reject) => {

              con.query(sql, prepared, (err, resposta) => {
                    if(err) reject(err);
                    else resolve(resposta);

              });

         });
    };
    window.db = con;
}
connect();
}catch(erro){
  console.log("Erro : ",erro.toString());
}
