var operacoes ={
  init:function(){

  },
  criar:function(){

  },
  editar:function(){},
  deletar:function(){},
  dao:{
    selectAll:function(){},
    insert:function(){},
    update:function(){},
    delete:function(){}
  },
  view:{
    addViewAll:function(){}
  }
}
var contas    ={
  tabela:{},
  init:function(){
      contas.tabela = $('#fragment-2 tbody');
      contas.dao.selectAll().then(lista=>{
        contas.view.addViewAll(lista);
      })
  },
  criar:function(){


    bancos.dao.selectAll().then(listaB=>{

          let options = '';
          for(let banco of listaB){
            options += `<option value="${banco.id_banco}">${ banco.nome_banco }</option>`;
          }

          let alerta = new Alert(`<form>
                                          <div class="row">
                                             <div class="cold6">
                                                  <label class="row"> Numero da Conta *: </label>
                                                  <div class="content-icon-input cold10">
                                                      <input class="input-icone"  placeholder="5248575" name='numero_conta'  required>
                                                      <span aria-hidden="true" class="icon_wallet"></span>
                                                  </div>
                                             </div>
                                             <div class="cold3">
                                                  <label class="row"> Saldo R$ *: </label>
                                                  <input name='saldo_conta_bancaria' name="saldo"  placeholder="1025.24" required>
                                             </div>
                                          </div>
                                          <div class="row">
                                             <div class="cold6">
                                                  <label class="row"> Banco *: </label>
                                                  <select name="id_banco" required>
                                                      ${options}
                                                  </select>
                                             </div>
                                             <div class="cold3" style="opacity:0;">
                                                  <label class="row"> UF *: </label>
                                                  <input name='uf'  maxlength="2" >
                                             </div>
                                          </div>
                                </form>`);

           alerta.buttons.push({
                texto:'Salvar',
                click:function(){
                  let formulario = alerta.janela.find('form');
                  if(!formulario[0].checkValidity()){

                    console.log('Formulario invalido!!');
                    $(`<div title="Prencha todos os campos">
                          <p> E necessario preencher todos os campos * </p>
                      </div>`).dialog();

                    return;
                  }else{

                    let numero_conta          = formulario.find('[name="numero_conta"]').val();
                    let saldo_conta_bancaria  = formulario.find('[name="saldo_conta_bancaria"]').val();
                    let id_banco              = formulario.find('[name="id_banco"]').val();

                    contas.dao.insert({numero_conta,saldo_conta_bancaria,id_banco}).then(()=>{
                      contas.init();
                      alerta.close();
                    })
                  }
                }
          });
          alerta.show = function(){

            alerta.janela.find("[name='id_banco']").multiselect({
               multiple: false,
               header: "Selecione",
               noneSelectedText: "Bancos",
               selectedList: 1
            });

          };
          alerta.view('cadastro de Conta ').then(html=>{}).catch(erro=>{});


    })


  },
  editar:function(id){

    contas.dao.selectById(id).then(conta=>{

          bancos.dao.selectAll().then(listaB=>{

                let options = '';
                for(let banco of listaB){
                  if(banco.id_banco == conta.id_banco)options += `<option value="${banco.id_banco}" selected>${ banco.nome_banco }</option>`
                  else options += `<option value="${banco.id_banco}">${ banco.nome_banco }</option>`;
                }

                let alerta = new Alert(`<form>
                                                <div class="row">
                                                   <div class="cold6">
                                                        <label class="row"> Numero da Conta *: </label>
                                                        <div class="content-icon-input cold10">
                                                            <input class="input-icone"  placeholder="5248575" value="${conta.numero_conta}" name='numero_conta'  required>
                                                            <span aria-hidden="true" class="icon_wallet"></span>
                                                        </div>
                                                   </div>
                                                   <div class="cold3">
                                                        <label class="row"> Saldo R$ *: </label>
                                                        <input name='saldo_conta_bancaria' name="saldo" value="${conta.saldo_conta_bancaria}"  placeholder="1025.24" required>
                                                   </div>
                                                </div>
                                                <div class="row">
                                                   <div class="cold6">
                                                        <label class="row"> Banco *: </label>
                                                        <select name="id_banco" required>
                                                            ${options}
                                                        </select>
                                                   </div>
                                                   <div class="cold3" style="opacity:0;">
                                                        <label class="row"> UF *: </label>
                                                        <input name='uf'  maxlength="2" >
                                                   </div>
                                                </div>
                                      </form>`);

                 alerta.buttons.push({
                      texto:'Salvar',
                      click:function(){
                        let formulario = alerta.janela.find('form');
                        if(!formulario[0].checkValidity()){

                          console.log('Formulario invalido!!');
                          $(`<div title="Prencha todos os campos">
                                <p> E necessario preencher todos os campos * </p>
                            </div>`).dialog();

                          return;
                        }else{

                          let numero_conta          = formulario.find('[name="numero_conta"]').val();
                          let saldo_conta_bancaria  = formulario.find('[name="saldo_conta_bancaria"]').val();
                          let id_banco              = formulario.find('[name="id_banco"]').val();

                          contas.dao.update(id,{numero_conta,saldo_conta_bancaria,id_banco}).then(()=>{
                            contas.init();
                            alerta.close();
                          })
                        }
                      }
                });
                alerta.show = function(){

                  alerta.janela.find("[name='id_banco']").multiselect({
                     multiple: false,
                     header: "Selecione",
                     noneSelectedText: "Bancos",
                     selectedList: 1
                  });

                };
                alerta.view('Editando Conta ').then(html=>{}).catch(erro=>{});


          })

    })


  },
  deletar:function(){},
  dao:{
    selectAll:function(){
      return db.selectAll(`tbl_conta inner join tbl_bancos on tbl_conta.id_banco = tbl_bancos.id_banco`);
    },
    selectById:function(id){
      return db.selectById(`tbl_conta inner join tbl_bancos on tbl_conta.id_banco = tbl_bancos.id_banco WHERE tbl_conta.id_conta = ? `,[id]);
    },
    insert:function(dados){
      return db.insert(`tbl_conta(saldo_conta_bancaria,numero_conta,id_banco)VALUES( ?, ?, ? )`,
                        [dados.saldo_conta_bancaria,dados.numero_conta,dados.id_banco]);
    },
    update:function(id,dados){
      return db.update(`tbl_conta SET saldo_conta_bancaria = ?, numero_conta = ?, id_banco = ? WHERE id_conta = ? `
                        ,[dados.saldo_conta_bancaria,dados.numero_conta,dados.id_banco,id]);
    },
    delete:function(id){
      return db.update(`tbl_conta SET excluido = 1 WHERE id_conta = ? `,[id]);
    }
  },
  view:{
    addViewAll:function(lista){


        contas.tabela.html('');
        if(lista.length < 1){

            contas.tabela.append("<tr class='mascara'>\
                                        <td colspan='5' class='lupa'>\
                                            <img  alt='Nada encontrado' src='img/magnify.gif'>\
                                            <p> Nenhum Registro encontado! </p>\
                                        </td>\
                                    </tr>");

        }else{

                for(let conta of lista){
                      let view = $(`
                          <tr data-id="${conta.id_conta}">
                              <td>${conta.id_conta}</td>
                              <td>${conta.numero_conta}</td>
                              <td>${conta.nome_banco}</td>
                              <td>R$${conta.saldo_conta_bancaria}</td>
                              <td>
                                  <a href="javascript:contas.deletar(${conta.id_conta})"><label><i class="far fa-trash-alt"></i>Deletar</label></a>
                                  <a href="javascript:contas.editar(${conta.id_conta})"><label><i class="fas fa-edit"></i>Editar</label></a>
                              </td>
                          </tr>
                      `);
                      contas.tabela.append(view);
                }
        }


    }
  }
}
var bancos    = {
  tabela:{},
  init:function(){
    bancos.tabela = $('#fragment-3 tbody');
    bancos.dao.selectAll().then(lista=>{

        bancos.view.addViewAll(lista);

    })
  },
  criar:function(){

    let alerta = new Alert(`<form>
                                    <div class="row">
                                       <div class="cold6">
                                            <label class="row"> Nome *: </label>
                                            <div class="content-icon-input cold10">
                                                <input class="input-icone"  placeholder="Mesa Verde" name='nome_banco'  required>
                                                <span aria-hidden="true" class="icon_wallet"></span>
                                            </div>
                                       </div>
                                       <div class="cold3">
                                            <label class="row"> Agencia*: </label>
                                            <input name='agencia_numero'   placeholder="63152483000160" required>
                                       </div>
                                    </div>
                                    <div class="row">
                                       <div class="cold6">
                                            <label class="row"> Cidade *: </label>
                                            <input name='cidade' style=" width: 303px; " required>
                                       </div>
                                       <div class="cold3">
                                            <label class="row"> UF *: </label>
                                            <input name='uf'  maxlength="2" required>
                                       </div>
                                    </div>
                          </form>`);

     alerta.buttons.push({
          texto:'Salvar',
          click:function(){
            let formulario = alerta.janela.find('form');
            if(!formulario[0].checkValidity()){

              console.log('Formulario invalido!!');
              $(`<div title="Prencha todos os campos">
                    <p> E necessario preencher todos os campos * </p>
                </div>`).dialog();

              return;
            }else{
              let nome_banco        = formulario.find('[name="nome_banco"]').val();
              let agencia_numero    = formulario.find('[name="agencia_numero"]').val();
              let cidade            = formulario.find('[name="cidade"]').val();
              let uf                = formulario.find('[name="uf"]').val();
              bancos.dao.insert({nome_banco,agencia_numero,cidade,uf}).then(()=>{
                bancos.init();
                alerta.close();
              })
            }
          }
    });

    alerta.view('cadastro de Banco ').then(html=>{}).catch(erro=>{});
  },
  editar:function(id){
    return bancos.dao.selectById(id).then(banco=>{

          let alerta = new Alert(`<form>
                                          <div class="row">
                                             <div class="cold6">
                                                  <label class="row"> Nome *: </label>
                                                  <div class="content-icon-input cold10">
                                                      <input class="input-icone"  placeholder="Mesa Verde" value="${banco.nome_banco}" name='nome_banco'  required>
                                                      <span aria-hidden="true" class="icon_wallet"></span>
                                                  </div>
                                             </div>
                                             <div class="cold3">
                                                  <label class="row"> Agencia*: </label>
                                                  <input name='agencia_numero'   placeholder="63152483000160" value="${banco.agencia_numero}" required>
                                             </div>
                                          </div>
                                          <div class="row">
                                             <div class="cold6">
                                                  <label class="row"> Cidade *: </label>
                                                  <input name='cidade' style=" width: 303px; " value="${banco.cidade}" required>
                                             </div>
                                             <div class="cold3">
                                                  <label class="row"> UF *: </label>
                                                  <input name='uf'  maxlength="2"  value="${banco.uf}"  required>
                                             </div>
                                          </div>
                                </form>`);

           alerta.buttons.push({
                texto:'Salvar',
                click:function(){
                  let formulario = alerta.janela.find('form');
                  if(!formulario[0].checkValidity()){

                    console.log('Formulario invalido!!');
                    $(`<div title="Prencha todos os campos">
                          <p> E necessario preencher todos os campos * </p>
                      </div>`).dialog();

                    return;
                  }else{
                    let nome_banco        = formulario.find('[name="nome_banco"]').val();
                    let agencia_numero    = formulario.find('[name="agencia_numero"]').val();
                    let cidade            = formulario.find('[name="cidade"]').val();
                    let uf                = formulario.find('[name="uf"]').val();
                    bancos.dao.update(id,{nome_banco,agencia_numero,cidade,uf}).then(()=>{
                      bancos.init();
                      alerta.close();
                    })
                  }
                }
          });

          alerta.view('Editando Banco '+banco.nome_banco).then(html=>{}).catch(erro=>{});

    })

  },
  deletar:function(){

      bancos.dao.selectById(id).then(banco=>{
            $( `<div title="Remover Banco ${banco.nome_banco} ! ">
                 <strong> Remover Banco ${banco.id_banco}</strong>?</h1>
                 <p>
                   <span class="ui-icon  ui-icon-trash" style="float:left; margin:0 7px 50px 0;"></span>
                 </p>
                 <p>Desejá mesmo deletar o banco ${banco.nome_banco}</p>
               </div>` ).dialog({
               modal: true,
               buttons: {
                 Remover: function() {

                        $( this ).dialog( "close" );

                       bancos.dao.delete(id).then(function(){

                           bancos.init();

                       })

                 },
                 Cancelar:function(){
                   $( this ).dialog( "close" );
                 }
               }
             });
      });

  },
  dao:{
    selectAll:function(){
      return db.selectAll('tbl_bancos WHERE excluido = 0 ');
    },
    selectById:function(id){
      return db.selectById(`tbl_bancos WHERE id_banco = ?`,[id]);
    },
    insert:function(dados){
      return db.insert(`tbl_bancos(nome_banco,agencia_numero,cidade,uf)VALUES(?,?,?,?)`,[dados.nome_banco,dados.agencia_numero,dados.cidade,dados.uf]);
    },
    update:function(id,dados){
      return db.update(`tbl_bancos SET nome_banco = ?,agencia_numero = ?,cidade = ?,uf = ? WHERE id_banco = ?`,[dados.nome_banco,dados.agencia_numero,dados.cidade,dados.uf,id]);
    },
    delete:function(id){
      return db.update(`tbl_bancos SET excluido = 1 WHERE id_banco = ?`,[id]);
    }
  },
  view:{
    addViewAll:function(lista){

      bancos.tabela.html('');
      if(lista.length < 1){

          pedidos.tabela.append("<tr class='mascara'>\
                                      <td colspan='5' class='lupa'>\
                                          <img  alt='Nada encontrado' src='img/magnify.gif'>\
                                          <p> Nenhum Registro encontado! </p>\
                                      </td>\
                                  </tr>");

      }else{

              for(let banco of lista){
                    let view = $(`
                        <tr data-id="${banco.id_banco}">
                            <td>${banco.id_banco}</td>
                            <td>${banco.nome_banco}</td>
                            <td>${banco.agencia_numero}</td>
                            <td>${banco.cidade}</td>
                            <td>${banco.uf}</td>
                            <td>
                                <a href="javascript:bancos.deletar(${banco.id_banco})"><label><i class="far fa-trash-alt"></i>Deletar</label></a>
                                <a href="javascript:bancos.editar(${banco.id_banco})"><label><i class="fas fa-edit"></i>Editar</label></a>
                            </td>
                        </tr>
                    `);
                    bancos.tabela.append(view);
              }
      }
    }
  }
}
