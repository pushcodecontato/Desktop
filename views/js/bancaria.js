var operacoes ={
  init:function(){

  },
  criar:function(id_conta, lista){
      contas.dao.selectById(id_conta).then(conta=>{

          let despesas = '';
          for(let despesa of lista){

            let data_compra = new Date(despesa.data_entrada);
            data_compra       = ((data_compra.getDate()<10)? '0' + data_compra.getDate():data_compra.getDate()+"/"+((data_compra.getMonth()<10)? '0' + data_compra.getMonth():data_compra.getMonth()))+"/"+data_compra.getFullYear();
            let tipo = '';
            if(despesa.tipo == "F"){
                tipo = '<i class="far fa-money-bill-alt"></i> Pagamento ';
            } else if(despesa.tipo == "P"){
                tipo = '<i class="fas fa-cart-plus"></i> Pedido ';
            }

            despesas+= `<tr data-id="${despesa.id_conta_pagar}" data-valor="${despesa.valor}">
                              <td data-id="${despesa.id_conta_pagar}" data-valor="${despesa.valor}">
                                <div onclick="conta_pagar.check(this)" data-id="${conta.id_conta_pagar}" class="checket"><i class="fas fa-check"></i></div>
                              </td>
                              <td>${tipo}</td>
                              <td>R$ ${despesa.valor}</td>
                              <td>${data_compra}</td>
                              <td>
                                  <a href="javascript:contas.deletar(${conta.id_conta_pagar},${conta.tipo})"><label><i class="fas fa-exclamation-circle"></i>INFO</label></a>
                              </td>
                          </tr>`;
          }

          let alerta = new Alert(`<form>
                                      <div class="row">
                                         <div class="cold6">
                                              <label class="row"> Conta: </label>
                                              <div class="content-icon-input cold10">
                                                  <input class="input-icone" value="${conta.numero_conta}" disabled>
                                                  <span aria-hidden="true" class="icon_wallet"></span>
                                              </div>
                                         </div>
                                         <div class="cold3">
                                              <label class="row"> Valor na conta: </label>
                                              <input value="${conta.saldo_conta_bancaria}" disabled>
                                         </div>
                                      </div>
                                      <div class="row">
                                         <div class="cold3" style=" width: 32%; ">
                                              <label class="row"> Valor Tranferido pela Conta: </label>
                                              <input  style="min-width:auto;" value="${conta.saldo_conta_bancaria}" disabled>
                                         </div>
                                         <div class="cold1" style=" width: 22%;">
                                              <label class="row"> Valor: </label>
                                              <input value="${0}" style="  min-width: 10px;    width: 92%; " disabled>
                                         </div>
                                         <div class="cold3" style="">
                                              <label class="row"> Total na conta depois: </label>
                                              <input value="${100000}" disabled>
                                         </div>
                                      </div>
                                      <div class="row">
                                         <table class="padrao">
                                             <thead>
                                                 <tr>
                                                     <th></th>
                                                     <th>Tipo</th>
                                                     <th>valor</th>
                                                     <th>Data</th>
                                                     <th></th>
                                                 </tr>
                                             </thead>
                                             <tbody>
                                                 ${despesas}
                                             </tbody>
                                         </table>
                                      </div>
                                      <div class="row"></div>
                                  </form>`);

          alerta.buttons.push({
              texto:' Fechar ',
              click:function(){
                  //funcionarios.efetuarPagamento(funcionario.id);
              }
          })
          alerta.show = function(){
            alerta.janela.find('tbody tr').each((acc,elm)=>{
                console.log("Elm : ",elm);
                linha = $(elm);
                console.log("tr : ",linha);
                console.log("td : ",linha.find('td[data-id]'));
                linha.find('td[data-id] div.checket').on('click',function(){
                    console.log("Hellow!!!!!")
                })
            })

            /*alerta.janela.find('button[type="button"]').click(function(){
                $(`<form title="Adicionar Pagamento">
                      <div class="row">
                         <div class="cold6">
                              <label class="row"> Valor Final: </label>
                              <input  style="min-width:auto;" name="valor" value="${salarios[0].salario}" >
                         </div>
                         <div class="cold3">
                              <label class="row"> Cod: </label>
                              <input name="cod" style="min-width:auto;" >
                         </div>
                      </div>
                      <div class="row" style="  margin-top: 12px;">
                          <div class="cold6" style=" float: left;">
                               <label class="row"> Agendamento: </label>
                               <div class="agendamento"></div>
                          </div>
                          <div class="cold4" style="width: 42%;">
                               <label class="row"> Descrição: </label>
                               <textarea name="desc" style="resize: none; height: 169px;"></textarea>
                          </div>
                      </div>
                  </form>`).dialog({
                    modal:true,
                    width:'600px',
                    open:function(){
                        $( this ).find('.agendamento').datepicker();
                    },
                    buttons: {
                      Salvar:function(){

                        $( this ).find('[name="cod"]').removeClass('required');
                        $( this ).find('[name="valor"]').removeClass('required');
                        $( this ).find('[name="desc"]').removeClass('required');

                        let cod = $( this ).find('[name="cod"]').val();
                        let valor_final = $( this ).find('[name="valor"]').val();
                        let descricao = $( this ).find('[name="desc"]').val();
                        let agendamento = $( this ).find('.agendamento').datepicker( "getDate" );

                        if(cod.toString().length < 1){
                            $( this ).find('[name="cod"]').addClass('required');
                        }else if(valor_final.toString().length < 1){
                            $( this ).find('[name="valor"]').addClass('required');
                        }else if(descricao.toString().length < 1){
                            $( this ).find('[name="desc"]').addClass('required');
                        }else{
                            let ctx = this;
                            db.insert(`tbl_folha_pagamento( valor_final, data_agendamento, descricao_pagamento, cod_pagamento_funcionario, id_funcionario, id_usuario_desktop)VALUES( ?, ?, ?, ?, ?, ?)`,
                            [valor_final,agendamento,descricao,cod,funcionario.id,window.user.id]).then(function(id_folha){
                                db.insert(`tbl_contas_pagar (descricao, data_entrada, valor, codigo_pagamento, confirmado) VALUES ('${descricao}', ?, ?, ?, ?)`,[agendamento,valor_final,cod,0])
                                .then(function(id_conta_pagar){
                                    db.insert(`tbl_folha_pagamento_contas_pagar ( id_folha_pagamento, id_conta_pagar) VALUES ( ?, ?)`,[id_folha,id_conta_pagar])
                                    .then(function(){
                                        $( ctx ).dialog( "close" );
                                        return db.selectAll('tbl_folha_pagamento WHERE id_funcionario = ? limit 5 ',[funcionario.id]).then(folhas_novas=>{
                                              let pagamentos_novos = '';
                                              for(let pagamento of folhas_novas){

                                                  let dt_pagamento = new Date(pagamento.data_agendamento);

                                                  let data_p = dt_pagamento.getDate()+"/"+dt_pagamento.getMonth()+"/"+dt_pagamento.getFullYear();

                                                  pagamentos_novos+= `<tr>
                                                                    <td>${pagamento.id_folha_pagamento}</td>
                                                                    <td>${data_p}</td>
                                                                    <td>${'R$' + pagamento.valor_final}</td>
                                                                    <td>${pagamento.cod_pagamento_funcionario}</td>
                                                                </tr>`;
                                              }
                                              alerta.janela.find('table tbody tr').remove();
                                              alerta.janela.find('table tbody').html(pagamentos_novos);
                                        })
                                    })
                                })
                                //INSERT INTO tbl_contas_pagar (id_conta_pagar, descricao, data_entrada, valor, titulos_baixados, data_baixa, codigo_pagamento, confirmado) VALUES (0, '', '', 0, '', '', '', );
                                //INSERT INTO tbl_folha_pagamento_contas_pagar (id_pedido_contas_pagar, id_folha_pagamento, id_conta_pagar) VALUES (0, 0, 0);

                            });
                        }
                      }
                    }
                  })
            })*/
          }
          alerta.view(' Conciliação ').then(html=>{}).catch(erro=>{});
      });
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
