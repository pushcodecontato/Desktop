var pedidos = {
  tabela:{},
  init:function(){
    pedidos.tabela = $('#fragment-1 tbody');
    return pedidos.dao.selectAll().then(listapedidos=>{
      pedidos.view.addViewAll(listapedidos);
    })
  },
  criar:function(){

    fornecedores.dao.selectAll().then(listaF=>{
//tbl_pedido(valor_total`,`forma_pagamento`,`previsao_entrega`,`cod_pedido`,`natureza_da_compra`,`desconto`,`data_compra`,`frete`,`id_fornecedor`,`id_usuario_desktop`)
        let options = "";
        for(let option of listaF){
          options += `<option value="${option.id_fornecedor}">${option.nome_fornecedor}</option>`;
        }

        var tabela        = {};
        var listaProdutos = [];
        let btnAdicionar  = {};
        var total_valor   = {};

        let alerta = new Alert(`<form>
                                        <div class="row">
                                           <div class="cold6">
                                                <label class="row"> Forma de Pagamento *: </label>
                                                <div class="content-icon-input cold10">
                                                    <input class="input-icone"  placeholder="Cartão/Especie/Boleto/Cheque " name='forma_pagamento'  required>
                                                    <span aria-hidden="true" class="icon_percent"></span>
                                                </div>
                                           </div>
                                           <div class="cold3">
                                                <label class="row"> Frete: </label>
                                                <div class="content-icon-input">
                                                    <input name="frete" class="input-icone" value="0" placeholder="29,22" required>
                                                    <span aria-hidden="true" class="icon_wallet"></span>
                                                </div>
                                           </div>
                                        </div>
                                        <div class="row">
                                           <div class="cold6" style=" float: left; margin-left: 58px; width: 46%;">
                                                <label class="row"> Fornecedor *: </label>
                                                <select name="fornecedor">
                                                  ${options}
                                                </select>
                                           </div>
                                           <div class="cold3">
                                                <label class="row"> Desconto *: </label>
                                                <input name='desconto' placeholder="10%" value="0" required>
                                           </div>
                                        </div>
                                        <div class="row">
                                           <div class="cold6">
                                                <label class="row"> Data Compra *: </label>
                                                <input type="date" name='data_compra' style=" width: 303px; " required>
                                           </div>
                                           <div class="cold3">
                                                <label class="row"> Data Entrega *: </label>
                                                <input type="date" name='data_entrega'  required>
                                           </div>
                                        </div>
                                        <div class="row">
                                            <button class="btnAdicionar" type='button' style=" float: right; margin-right: 16px; margin-bottom: 5px;"> Adicionar </button>
                                            <table class="padrao">
                                              <thead>
                                                <tr>
                                                  <th>Produto</th>
                                                  <th>Valor</th>
                                                  <th>Q.</th>
                                                  <th>
                                                      Total
                                                      R$<label class="valor">0.00</label>
                                                  </th>
                                                  <th>
                                                  </th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                              </tbody>
                                            </table>
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
                } else if(listaProdutos.length<1){
                  $(`<div title="Adicione Produtos">
                        <p> E necessario que o pedido tenha Produtos </p>
                    </div>`).dialog();
                } else {

                  let forma_pagamento = formulario.find('[name="forma_pagamento"]').val();
                  let frete           = formulario.find('[name="frete"]').val();
                  let fornecedor      = formulario.find('[name="fornecedor"]').val();
                  let desconto        = formulario.find('[name="desconto"]').val();
                  let data_compra     = formulario.find('[name="data_compra"]').val();
                  let data_entrega    = formulario.find('[name="data_entrega"]').val();
                  let valor_total     = ((total_valor.innerHTML*1) || 0);


                  $( `<div title="Natureza da Compra ! ">
                       <strong> Valor:R$${valor_total} </strong></h1>
                       <h5> Natureza da compra </h5>
                       <textarea name="desc" style=" float:left; width: 355px; height: 86px; resize: none; border: solid 1px #ccc;" required ></textarea>
                       <h5> Cod pedido *:</h5>
                       <input name="cod">
                     </div>` ).dialog({
                     modal: true,
                     width:'400px',
                     buttons: {
                       Ok:function(){
                          let cod = $(this).find('input[name="cod"]').val();
                          if(cod.toString().length < 1){
                            $(`<div title="Prencha todos os campos">
                                  <p> E necessario preencher todos os campos * </p>
                              </div>`).dialog();
                          }else{

                             let natureza = $(this).find('textarea[name="desc"]').val();
                             pedidos.dao.insert({valor_total,forma_pagamento,frete,fornecedor,desconto,data_compra,data_entrega,natureza,cod},listaProdutos).then(()=>{
                               pedidos.init();
                               alerta.close();
                               $(this).dialog('destroy');
                             })
                         }
                       }
                     }
                   })
                }
              }
        });
        alerta.show = function(){

          tabela        = alerta.janela.find('table tbody');
          listaProdutos = [];
          btnAdicionar  = alerta.janela.find('button.btnAdicionar')[0];
          total_valor   = alerta.janela.find('table thead th label.valor')[0];

          alerta.janela.find("[name='fornecedor']").multiselect({
             multiple: false,
             header: "Selecione",
             noneSelectedText: "Fornecedores",
             selectedList: 1
          });

          console.log(" BUTTON ",btnAdicionar);
          /* Funções */
          let addProduto = ()=>{
            produtos.dao.selectAll().then(listaP=>{
                    let options = '';
                    for(let produto of listaP){
                      options += `<option value="${produto.id_produto }">${ produto.nome }</option>`;
                    }
                    $(`<form title="Adicionar Produto ">
                          <div class="row">
                             <div class="cold6">
                                  <label class="row"> Produto*: </label>
                                  <select name="produtos" required>
                                    ${options}
                                  </select>
                             </div>
                             <div class="cold3">
                                  <label class="row"> Quantidade*: </label>
                                  <input name="quantidade" style="min-width:auto;" required>
                             </div>
                          </div>
                          <div class="row" style="  margin-top: 12px;">
                              <div class="cold6" style=" float: left;">
                                  <label class="row"> Valor unitario*: </label>
                                  <input name="valor" style="min-width:auto;" required>
                              </div>
                              <div class="cold4" style="width: 42%; opacity: 0.0; ">
                                   <label class="row"> Valor unitario: </label>
                                   <input name="cod" style="min-width:auto;">
                              </div>
                          </div>
                      </form>`).dialog({
                        modal:true,
                        width:'600px',
                        open:function(){
                          $(this).find("[name='produtos']").multiselect({
                             multiple: false,
                             header: "Selecione",
                             noneSelectedText: "cargos",
                             selectedList: 1
                          });
                        },
                        buttons: {
                           'Salvar': function() {

                              if(!this.checkValidity()){

                                    $(`<div title="Prencha todos os campos">
                                          <p> E necessario preencher todos os campos corretamente </p>
                                      </div>`).dialog();

                              }else{
                                console.log("OI ")
                                let id_produto  = $(this).find("[name='produtos']").val();
                                let quantidade  = $(this).find("[name='quantidade']").val();
                                let valor       = $(this).find("[name='valor']").val();


                                $(this).dialog('destroy');
                                let nome = '';
                                let produtoData = {};
                                for(let produto of listaP){
                                   if(id_produto == produto.id_produto){
                                      nome = produto.nome;
                                      produtoData = produto;
                                   }
                                }

                                listaProdutos.push({id_produto,quantidade,valor,nome,produtoData});

                                tabela.append(`<tr id="${listaProdutos.length-1}">
                                                  <td>${nome}</td>
                                                  <td>${valor}</td>
                                                  <td>${quantidade}</td>
                                                  <td>R$${valor*quantidade}</td>
                                                  <td class="deletar"> <label><i class="far fa-trash-alt"></i>Deletar</label> </td>
                                              <tr>`);
                                let valor_anterior = (total_valor.innerHTML*1);
                                total_valor.innerHTML = (valor_anterior+(valor*quantidade));
                                tabela.find(`tr[id="${listaProdutos.length-1}"] td.deletar label`)[0].addEventListener('click',function(){
                                  delProduto(listaProdutos.length-1);
                                })
                              }
                          }
                        }
                      });
            })
          }
          let delProduto = (id)=>{
            console.log("Hello2 Del ",id);
            let itemProduto = listaProdutos[id];
            $( `<div title="Remover Produto ${itemProduto.nome} ! ">
                 <strong> Remover ${itemProduto.nome}</strong>?</h1>
                 <p>
                   <span class="ui-icon  ui-icon-trash" style="float:left; margin:0 7px 50px 0;"></span>
                 </p>
                 <p>
                   Quantidade : <strong>${itemProduto.quantidade}</strong><br>
                   Valor  Unitario:     <strong>${itemProduto.valor}</strong>
                   <p>${itemProduto.produtoData.descricao}</p>
                 </p>
               </div>` ).dialog({
               modal: true,
               buttons: {
                 Remover: function() {

                      $( this ).dialog( "close" );

                      tabela.find(`tr[id="${id}"]`).remove();

                      listaProdutos = listaProdutos.filter((item,acc)=> acc != id );

                      console.log(listaProdutos);

                      let valor_anterior = (total_valor.innerHTML*1);
                      total_valor.innerHTML = (valor_anterior - (itemProduto.valor*itemProduto.quantidade)) || 0;

                 }
               }
             });
          }
          /*let editProduto = ()=>{

          }*/

          btnAdicionar.addEventListener("click",function(){
            addProduto();
          })
        };
        alerta.view('cadastro de fornecedor').then(html=>{}).catch(erro=>{});


    })

  },
  editar:function(id){
    pedidos.dao.selectById(id).then(pedido=>{
      fornecedores.dao.selectAll().then(listaF=>{
  //tbl_pedido(valor_total`,`forma_pagamento`,`previsao_entrega`,`cod_pedido`,`natureza_da_compra`,`desconto`,`data_compra`,`frete`,`id_fornecedor`,`id_usuario_desktop`)

          let data_compra = new Date(pedido.data_compra);
          data_compra       = data_compra.getFullYear()+"-"+((data_compra.getMonth()+1<10)? '0' + (data_compra.getMonth()+1):data_compra.getMonth()+1)+"-"+((data_compra.getDate()<10)? '0' + data_compra.getDate():data_compra.getDate())

          let previsao_entrega = new Date(pedido.previsao_entrega);
          previsao_entrega  = previsao_entrega.getFullYear()+"-"+((previsao_entrega.getMonth()+1<10)?'0'+(previsao_entrega.getMonth()+1):previsao_entrega.getMonth()+1)+"-"+((previsao_entrega.getDate()<10)?'0'+previsao_entrega.getDate():previsao_entrega.getDate());

          let options = "";
          for(let option of listaF){

                if(option.id_fornecedor == pedido.id_fornecedor)options += `<option value="${option.id_fornecedor}" selected>${option.nome_fornecedor}</option>`
                else options += `<option value="${option.id_fornecedor}">${option.nome_fornecedor}</option>`;

          }
          var tabela        = {};
          var listaProdutos = [];
          let btnAdicionar  = {};
          var total_valor   = {};

          let alerta = new Alert(`<form>
                                          <div class="row">
                                             <div class="cold6">
                                                  <label class="row"> Forma de Pagamento *: </label>
                                                  <div class="content-icon-input cold10">
                                                      <input class="input-icone"  placeholder="Cartão/Especie/Boleto/Cheque " value="${pedido.forma_pagamento}" name='forma_pagamento'  required>
                                                      <span aria-hidden="true" class="icon_percent"></span>
                                                  </div>
                                             </div>
                                             <div class="cold3">
                                                  <label class="row"> Frete: </label>
                                                  <div class="content-icon-input">
                                                      <input name="frete" class="input-icone" value="0" placeholder="29,22" ${pedido.frete} required>
                                                      <span aria-hidden="true" class="icon_wallet"></span>
                                                  </div>
                                             </div>
                                          </div>
                                          <div class="row">
                                             <div class="cold6" style=" float: left; margin-left: 58px; width: 46%;">
                                                  <label class="row"> Fornecedor *: </label>
                                                  <select name="fornecedor">
                                                    ${options}
                                                  </select>
                                             </div>
                                             <div class="cold3">
                                                  <label class="row"> Desconto *: </label>
                                                  <input name='desconto' placeholder="10%" value="${pedido.desconto}" required>
                                             </div>
                                          </div>
                                          <div class="row">
                                             <div class="cold6">
                                                  <label class="row"> Data Compra *: </label>
                                                  <input type="date" name='data_compra' value="${data_compra}" style=" width: 303px; " required>
                                             </div>
                                             <div class="cold3">
                                                  <label class="row"> Data Entrega *: </label>
                                                  <input type="date" name='data_entrega' value="${previsao_entrega}"  required>
                                             </div>
                                          </div>
                                          <div class="row">
                                              <button class="btnAdicionar" type='button' style=" float: right; margin-right: 16px; margin-bottom: 5px;"> Adicionar </button>
                                              <table class="padrao">
                                                <thead>
                                                  <tr>
                                                    <th>Produto</th>
                                                    <th>Valor</th>
                                                    <th>Q.</th>
                                                    <th>
                                                        Total
                                                        R$<label class="valor">0.00</label>
                                                    </th>
                                                    <th>
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                              </table>
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
                  } else if(listaProdutos.length<1){
                    $(`<div title="Adicione Produtos">
                          <p> E necessario que o pedido tenha Produtos </p>
                      </div>`).dialog();
                  } else {

                    let forma_pagamento = formulario.find('[name="forma_pagamento"]').val();
                    let frete           = formulario.find('[name="frete"]').val();
                    let fornecedor      = formulario.find('[name="fornecedor"]').val();
                    let desconto        = formulario.find('[name="desconto"]').val();
                    let data_compra     = formulario.find('[name="data_compra"]').val();
                    let data_entrega    = formulario.find('[name="data_entrega"]').val();
                    let valor_total     = ((total_valor.innerHTML*1) || 0);


                    $( `<div title="Natureza da Compra ! ">
                         <strong> Valor:R$${valor_total} </strong></h1>
                         <h5> Natureza da compra </h5>
                         <textarea name="desc" style=" float:left; width: 355px; height: 86px; resize: none; border: solid 1px #ccc;" required >${pedido.natureza_da_compra}</textarea>
                         <h5> Cod pedido *:</h5>
                         <input name="cod" value="${pedido.cod_pedido}">
                       </div>` ).dialog({
                       modal: true,
                       width:'400px',
                       buttons: {
                         Ok:function(){
                            let cod = $(this).find('input[name="cod"]').val();
                            if(cod.toString().length < 1){
                              $(`<div title="Prencha todos os campos">
                                    <p> E necessario preencher todos os campos * </p>
                                </div>`).dialog();
                            }else{

                               let natureza = $(this).find('textarea[name="desc"]').val();
                               pedidos.dao.update(id,{valor_total,forma_pagamento,frete,fornecedor,desconto,data_compra,data_entrega,natureza,cod},listaProdutos).then(()=>{
                                 pedidos.init();
                                 alerta.close();
                                 $(this).dialog('destroy');
                               })
                           }
                         }
                       }
                     })
                  }
                }
          });
          alerta.show = function(){

            tabela        = alerta.janela.find('table tbody');
            btnAdicionar  = alerta.janela.find('button.btnAdicionar')[0];
            total_valor   = alerta.janela.find('table thead th label.valor')[0];

            alerta.janela.find("[name='fornecedor']").multiselect({
               multiple: false,
               header: "Selecione",
               noneSelectedText: "Fornecedores",
               selectedList: 1
            });

            console.log(" BUTTON ",btnAdicionar);

            for(let item of pedido.listaProdutos ){
              listaProdutos.push({id_produto:item.id_produto,quantidade:item.quantidade,valor:item.valor,nome:item.nome,produtoData:item.produtoData});

              tabela.append(`<tr id="${listaProdutos.length-1}">
                                <td>${item.nome}</td>
                                <td>${item.valor}</td>
                                <td>${item.quantidade}</td>
                                <td>R$${item.valor*item.quantidade}</td>
                                <td class="deletar"> <label><i class="far fa-trash-alt"></i>Deletar</label> </td>
                            <tr>`);
              let valor_anterior = (total_valor.innerHTML*1);
              total_valor.innerHTML = (valor_anterior+(item.valor*item.quantidade));
              tabela.find(`tr[id="${listaProdutos.length-1}"] td.deletar label`)[0].addEventListener('click',function(){
                delProduto(listaProdutos.length-1);
              })
            }
            /* Funções */
            let addProduto = ()=>{
              produtos.dao.selectAll().then(listaP=>{
                      let options = '';
                      for(let produto of listaP){
                        options += `<option value="${produto.id_produto }">${ produto.nome }</option>`;
                      }
                      $(`<form title="Adicionar Produto ">
                            <div class="row">
                               <div class="cold6">
                                    <label class="row"> Produto*: </label>
                                    <select name="produtos" required>
                                      ${options}
                                    </select>
                               </div>
                               <div class="cold3">
                                    <label class="row"> Quantidade*: </label>
                                    <input name="quantidade" style="min-width:auto;" required>
                               </div>
                            </div>
                            <div class="row" style="  margin-top: 12px;">
                                <div class="cold6" style=" float: left;">
                                    <label class="row"> Valor unitario*: </label>
                                    <input name="valor" style="min-width:auto;" required>
                                </div>
                                <div class="cold4" style="width: 42%; opacity: 0.0; ">
                                     <label class="row"> Valor unitario: </label>
                                     <input name="cod" style="min-width:auto;">
                                </div>
                            </div>
                        </form>`).dialog({
                          modal:true,
                          width:'600px',
                          open:function(){
                            $(this).find("[name='produtos']").multiselect({
                               multiple: false,
                               header: "Selecione",
                               noneSelectedText: "cargos",
                               selectedList: 1
                            });
                          },
                          buttons: {
                             'Salvar': function() {

                                if(!this.checkValidity()){

                                      $(`<div title="Prencha todos os campos">
                                            <p> E necessario preencher todos os campos corretamente </p>
                                        </div>`).dialog();

                                }else{
                                  console.log("OI ")
                                  let id_produto  = $(this).find("[name='produtos']").val();
                                  let quantidade  = $(this).find("[name='quantidade']").val();
                                  let valor       = $(this).find("[name='valor']").val();


                                  $(this).dialog('destroy');
                                  let nome = '';
                                  let produtoData = {};
                                  for(let produto of listaP){
                                     if(id_produto == produto.id_produto){
                                        nome = produto.nome;
                                        produtoData = produto;
                                     }
                                  }

                                  listaProdutos.push({id_produto,quantidade,valor,nome,produtoData});

                                  tabela.append(`<tr id="${listaProdutos.length-1}">
                                                    <td>${nome}</td>
                                                    <td>${valor}</td>
                                                    <td>${quantidade}</td>
                                                    <td>R$${valor*quantidade}</td>
                                                    <td class="deletar"> <label><i class="far fa-trash-alt"></i>Deletar</label> </td>
                                                <tr>`);
                                  let valor_anterior = (total_valor.innerHTML*1);
                                  total_valor.innerHTML = (valor_anterior+(valor*quantidade));
                                  tabela.find(`tr[id="${listaProdutos.length-1}"] td.deletar label`)[0].addEventListener('click',function(){
                                    delProduto(listaProdutos.length-1);
                                  })
                                }
                            }
                          }
                        });
              })
            }
            let delProduto = (id)=>{
              console.log("Hello2 Del ",id);
              let itemProduto = listaProdutos[id];
              $( `<div title="Remover Produto ${itemProduto.nome} ! ">
                   <strong> Remover ${itemProduto.nome}</strong>?</h1>
                   <p>
                     <span class="ui-icon  ui-icon-trash" style="float:left; margin:0 7px 50px 0;"></span>
                   </p>
                   <p>
                     Quantidade : <strong>${itemProduto.quantidade}</strong><br>
                     Valor  Unitario:     <strong>${itemProduto.valor}</strong>
                     <p>${itemProduto.produtoData.descricao}</p>
                   </p>
                 </div>` ).dialog({
                 modal: true,
                 buttons: {
                   Remover: function() {

                        $( this ).dialog( "close" );

                        tabela.find(`tr[id="${id}"]`).remove();

                        listaProdutos = listaProdutos.filter((item,acc)=> acc != id );

                        console.log(listaProdutos);

                        let valor_anterior = (total_valor.innerHTML*1);
                        total_valor.innerHTML = (valor_anterior - (itemProduto.valor*itemProduto.quantidade)) || 0;

                   }
                 }
               });
            }
            /*let editProduto = ()=>{

            }*/

            btnAdicionar.addEventListener("click",function(){
              addProduto();
            })
          };
          alerta.view(' Editar de Pedido ').then(html=>{}).catch(erro=>{});


      })
    })
  },
  deletar:function(id){
    pedidos.dao.selectById(id).then(pedido=>{
          $( `<div title="Remover Pedido ${pedido.cod_pedido} ! ">
               <strong> Remover Pedido ${pedido.id_pedido}</strong>?</h1>
               <p>
                 <span class="ui-icon  ui-icon-trash" style="float:left; margin:0 7px 50px 0;"></span>
               </p>
               <p>${pedido.natureza_da_compra}</p>
             </div>` ).dialog({
             modal: true,
             buttons: {
               Remover: function() {

                      $( this ).dialog( "close" );

                     pedidos.dao.delete(id).then(function(){

                         pedidos.init();

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
      return db.selectAll('select tbl_pedido.*, tbl_usuario_desktop.nome, if(tbl_usuario_desktop.foto is null ,"img/user.png", tbl_usuario_desktop.foto ) as foto,tbl_usuario_desktop.excluido from  tbl_pedido inner join tbl_usuario_desktop on tbl_pedido.id_usuario_desktop = tbl_usuario_desktop.id_usuario_desktop WHERE tbl_pedido.excluido = 0 ');
    },
    selectById:function(id){
      return db.selectById('select tbl_pedido.*, tbl_usuario_desktop.nome, if(tbl_usuario_desktop.foto is null ,"img/user.png", tbl_usuario_desktop.foto ) as foto,tbl_usuario_desktop.excluido from  tbl_pedido inner join tbl_usuario_desktop on tbl_pedido.id_usuario_desktop = tbl_usuario_desktop.id_usuario_desktop WHERE tbl_pedido.id_pedido = ? ',[id])
      .then(pedido=>{
          let listProdutos = [];
          return db.selectAll('tbl_pedido_produto inner join tbl_produto on tbl_pedido_produto.id_produto = tbl_produto.id_produto WHERE tbl_pedido_produto.id_pedido = ? ',[id]).then(listaProdutos=>{
            //listaProdutos.push({id_produto,quantidade,valor,nome,produtoData});
            for(let produto of listaProdutos){
              console.log(produto);
              listProdutos.push({
                                  id_pedido_produto:produto.id_pedido_produto,
                                  quantidade:produto.quantidade,
                                  valor:produto.valor,
                                  id_produto:produto.id_produto,
                                  nome:produto.nome,
                                  confirmado:produto.confirmado,
                                  produtoData:{
                                    nome:produto.nome,
                                    descricao:produto.descricao,
                                    cod_produto:produto.descricao,
                                  }
                                })
            }
            pedido.listaProdutos = listProdutos;
            return pedido
          })
      })
    },
    insert:function(dados,listaProdutos){
      console.log("DADOS:>",dados);
      console.log("Lista:>",listaProdutos);
      return db.insert(`tbl_pedido(valor_total,forma_pagamento,previsao_entrega,cod_pedido,natureza_da_compra,desconto,data_compra,frete,id_fornecedor,id_usuario_desktop)VALUES(?,?,?,?,?,?,?,?,?,?)`,[dados.valor_total,dados.forma_pagamento,dados.data_entrega,dados.cod,dados.natureza,dados.desconto,dados.data_compra,dados.frete,dados.fornecedor,user.id])
      .then(id=>{
        console.log("Pedido inserido!!!",listaProdutos);
        let listaPromise = [];
        for(let produto of listaProdutos){
          listaPromise.push(db.insert(`tbl_pedido_produto(quantidade,valor,id_produto,id_pedido)VALUES(?,?,?,?)`,[produto.quantidade,produto.valor,produto.id_produto,id]));
              //listaProdutos.push({id_produto,quantidade,valor,nome,produtoData});
        }
        return Promise.all(listaPromise)

      })
    },
    update:function(id,dados,listaProdutos){
      console.log("DADOS:>",dados);
      console.log("Lista:>",listaProdutos);
      return db.update(`tbl_pedido
        SET valor_total = ?,forma_pagamento = ?,previsao_entrega = ?,cod_pedido = ?,natureza_da_compra = ?,desconto = ?,data_compra = ?,frete = ?,id_fornecedor = ?,id_usuario_desktop = ? WHERE id_pedido = ? `,
        [dados.valor_total,dados.forma_pagamento,dados.data_entrega,dados.cod,dados.natureza,dados.desconto,dados.data_compra,dados.frete,dados.fornecedor,user.id,id]).then(()=>{
          return db.delete('tbl_pedido_produto WHERE id_pedido = ?',[id]).then(()=>{

              let listaPromise = [];
              for(let produto of listaProdutos){
                listaPromise.push(db.insert(`tbl_pedido_produto(quantidade,valor,id_produto,id_pedido)VALUES(?,?,?,?)`,[produto.quantidade,produto.valor,produto.id_produto,id]));
                    //listaProdutos.push({id_produto,quantidade,valor,nome,produtoData});
              }
              return Promise.all(listaPromise)
          })
        })
    },
    delete:function(id){
      return db.update('tbl_pedido SET excluido = 1 WHERE id_pedido = ? ',[id]);
    }
  },
  view:{
    addViewAll:function(lista){

      if(typeof lista == "object")lista = Object.values(lista);

      pedidos.tabela.html('');
      if(lista.length < 1){
        console.log("Sem dados!!");
        pedidos.tabela.append("<tr class='mascara'>\
                                    <td colspan='5' class='lupa'>\
                                        <img  alt='Nada encontrado' src='img/magnify.gif'>\
                                        <p> Nenhum Registro encontado! </p>\
                                    </td>\
                                </tr>");
      }

      for(let pedido of lista){
            let dt = new Date(pedido.data_compra);

            let data = dt.getDate()+"/"+dt.getMonth()+"/"+dt.getFullYear();
            console.log(pedido);
            let style = (pedido.confirmado == 1)?'background-color: #bbf1bb;':'';
            let view = $(`
                <tr style="${style}" data-id="${pedido.id_pedido}">
                    <td>${pedido.id_pedido}</td>
                    <td>
                      <img style=" width: 23px; border-radius: 100px" src="${pedido.foto}">
                      <label>${pedido.nome}</label>
                    </td>
                    <td>R$${pedido.valor_total}</td>
                    <td>${data}</td>
                    <td>
                        <a href="javascript:pedidos.lancar(${pedido.id_pedido})"><label><i class="fas fa-barcode"></i>Nota</label></a>
                        <a href="javascript:pedidos.deletar(${pedido.id_pedido})"><label><i class="far fa-trash-alt"></i>Deletar</label></a>
                        <a href="javascript:pedidos.editar(${pedido.id_pedido})"><label><i class="fas fa-edit"></i>Editar</label></a>
                    </td>
                </tr>
            `);
            pedidos.tabela.append(view);
      }
    }
  },
  lancar:function(id){
    pedidos.dao.selectById(id).then(pedido=>{
      fornecedores.dao.selectAll().then(listaF=>{

          $( `<div title="Emitir Nota? ${pedido.cod_pedido} ! ">
               <strong> Enviar para contas a pagar</strong>?</h1>
               <p>
                 <span class="ui-icon ui-icon-transferthick-e-w" style="float:left; margin:0 7px 50px 0;"></span>
               </p>
               <p>${pedido.natureza_da_compra}</p>
             </div>` ).dialog({
             modal: true,
             width:'500px',
             buttons: {
               'Abrir Formulario': function() {

                      $( this ).dialog( "close" );

                      pedidos.formularioNota(pedido,listaF);

               },
               'Cancelar':function(){
                 $( this ).dialog( "close" );
               }
             }
           });



      })
    });
  },
  formularioNota:function(pedido,listaF){

            let data_compra = new Date(pedido.data_compra);
            data_compra       = data_compra.getFullYear()+"-"+(((data_compra.getMonth()+1)<10)? '0' + (data_compra.getMonth()+1):data_compra.getMonth()+1)+"-"+((data_compra.getDate()<10)? '0' + data_compra.getDate():data_compra.getDate())

            let previsao_entrega = new Date(pedido.previsao_entrega);
            previsao_entrega  = previsao_entrega.getFullYear()+"-"+(((previsao_entrega.getMonth()+1)<10)?'0'+(previsao_entrega.getMonth()+1):previsao_entrega.getMonth()+1)+"-"+((previsao_entrega.getDate()<10)?'0'+previsao_entrega.getDate():previsao_entrega.getDate());

            let fornecedor = "";
            for(let option of listaF){

                  if(option.id_fornecedor == pedido.id_fornecedor)fornecedor = option;

            }

            var tabela        = {};
            var listaProdutos = [];
            let btnAdicionar  = {};
            var total_valor   = {};
            let listaConfirmados = {};

            let alerta = new Alert(`<form>
                                            <div class="row">
                                               <div class="cold6">
                                                    <label class="row"> Forma de Pagamento *: </label>
                                                    <div class="content-icon-input cold10">
                                                        <input class="input-icone" disabled  placeholder="Cartão/Especie/Boleto/Cheque " value="${pedido.forma_pagamento}" name='forma_pagamento'  required>
                                                        <span aria-hidden="true" class="icon_percent"></span>
                                                    </div>
                                               </div>
                                               <div class="cold3">
                                                    <label class="row"> Frete: </label>
                                                    <div class="content-icon-input">
                                                        <input name="frete" class="input-icone" value="0" placeholder="29,22" ${pedido.frete} disabled required>
                                                        <span aria-hidden="true" class="icon_wallet"></span>
                                                    </div>
                                               </div>
                                            </div>
                                            <div class="row">
                                               <div class="cold6" style=" float: left; margin-left: 58px; width: 46%;">
                                                    <label class="row"> Fornecedor *: </label>
                                                    <input name="fornecedor" style="width: 303px;" value="${fornecedor.nome_fornecedor}" disabled >
                                               </div>
                                               <div class="cold3">
                                                    <label class="row"> Desconto *: </label>
                                                    <input name='desconto' placeholder="10%" value="${pedido.desconto}" disabled required>
                                               </div>
                                            </div>
                                            <div class="row">
                                               <div class="cold6">
                                                    <label class="row"> Data Compra *: </label>
                                                    <input type="date" name='data_compra' value="${data_compra}" style=" width: 303px; " disabled required>
                                               </div>
                                               <div class="cold3">
                                                    <label class="row"> Data Entrega *: </label>
                                                    <input type="date" name='data_entrega' value="${previsao_entrega}" disabled required>
                                               </div>
                                            </div>
                                            <div class="row">
                                                <!--<button class="btnAdicionar" type='button' style=" float: right; margin-right: 16px; margin-bottom: 5px;"> Adicionar </button>-->
                                                <table class="padrao">
                                                  <thead>
                                                    <tr>
                                                      <th></th>
                                                      <th>Produto</th>
                                                      <th>Valor</th>
                                                      <th>Q.</th>
                                                      <th>
                                                          Total
                                                          R$<label class="valor">0.00</label>
                                                      </th>
                                                      <th>
                                                      </th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                  </tbody>
                                                </table>
                                            </div>
                                  </form>`);

             alerta.buttons.push({
                  texto:'Continuar',
                  click:function(){
                    let formulario = alerta.janela.find('form');
                    if(!formulario[0].checkValidity()){

                      console.log('Formulario invalido!!');
                      $(`<div title="Prencha todos os campos">
                            <p> E necessario preencher todos os campos * </p>
                        </div>`).dialog();

                      return;
                    } else if(Object.keys(listaConfirmados).length<1){
                      $(`<div title="Adicione Produtos">
                            <p> E necessario pelo menos  1 produto selecionado </p>
                        </div>`).dialog();
                    } else {

                      let forma_pagamento = formulario.find('[name="forma_pagamento"]').val();
                      let frete           = formulario.find('[name="frete"]').val();
                      let fornecedor      = formulario.find('[name="fornecedor"]').val();
                      let desconto        = formulario.find('[name="desconto"]').val();
                      let data_compra     = formulario.find('[name="data_compra"]').val();
                      let data_entrega    = formulario.find('[name="data_entrega"]').val();
                      let valor_total     = ((total_valor.innerHTML*1) || 0);
                      valor_total = 0;
                      let quantidade = 0;
                      for(let item of Object.values(listaConfirmados)){
                          console.log(item)
                          valor_total += (item.quantidade * item.valor);
                          quantidade += item.quantidade;
                      }
                      valor_total -= frete;
                      $( `<div title="Natureza da Compra ! ">
                           <strong> Valor:R$${valor_total} </strong> P:${quantidade}</h1>
                           <h5> Natureza da compra </h5>
                           <textarea name="desc" disabled style=" float:left; width: 355px; height: 86px; resize: none; border: solid 1px #ccc;" required >${pedido.natureza_da_compra}</textarea>
                           <h5> Cod pedido *:</h5>
                           <input name="cod" disabled value="${pedido.cod_pedido}">
                         </div>` ).dialog({
                         modal: true,
                         width:'400px',
                         buttons: {
                           'Continuar':function(){
                              let cod = $(this).find('input[name="cod"]').val();
                              if(cod.toString().length < 1){
                                $(`<div title="Prencha todos os campos">
                                      <p> E necessario preencher todos os campos *<br>
                                       Volte no modo Editar </p>
                                  </div>`).dialog();
                              }else{

                                 let natureza = $(this).find('textarea[name="desc"]').val();

                                 $(this).dialog('destroy');
                                 $(`<form class="ui_mini" title="Dados da conta a pagar">
                                        <fieldset>
                                            <label for="name">Valor Final R$: </label>
                                            <input title="Valor da conta a pagar" type="text" name="valor" value="${valor_total}"  class="text ui-widget-content ui-corner-all" required>
                                            <label for="email">Data de Entrada </label>
                                            <input type="date" title="Data de entrada da conta a pagar" type="text" name="data"  class="text ui-widget-content ui-corner-all" required>
                                        </fieldset>
                                    </form>`).dialog({
                                      modal:true,
                                      open:function(){
                                        $(this).tooltip();
                                      },
                                       buttons: {
                                         'Enviar':function(){
                                           let ctx = this;
                                            let valor_final   = $(this).find('input[name="valor"]').val();
                                            let data_entrada  = $(this).find('input[name="data"]').val();

                                            if(valor_final.toString().length < 1)return;
                                            if(data_entrada.toString().length < 1)return;

                                            db.update(`tbl_pedido  SET confirmado = 1, id_usuario_desktop = ? WHERE id_pedido = ? `,[user.id,pedido.id_pedido]).then(()=>{

                                                let listaPromise = [];
                                                for(let produto of listaProdutos){
                                                  listaPromise.push(db.update(`tbl_pedido_produto SET confirmado = 1 WHERE id_pedido_produto = ?`,[pedido.id_pedido]));
                                                }
                                                return Promise.all(listaPromise).then(()=>{

                                                      db.insert(`tbl_contas_pagar(descricao,data_entrada,valor)VALUES(?,?,?);`,[pedido.natureza_da_compra,data_entrada,valor_final]).then(id_conta_pagar=>{
                                                        db.insert(`INSERT INTO tbl_pedido_contas_pagar(id_pedido,id_conta_pagar)VALUES(?,?)`,[pedido.id_pedido,id_conta_pagar]).then(()=>{
                                                          $(ctx).dialog('destroy');
                                                          alerta.close();
                                                          $('<div title="Sucesso"> Conta a pagar gerada com sucesso </div>').dialog();
                                                        })
                                                      })
                                                })

                                            })
                                         }
                                       }
                                    })

                             }
                           }
                         }
                       })
                    }
                  }
            });
            alerta.show = function(){

              tabela        = alerta.janela.find('table tbody');
              btnAdicionar  = alerta.janela.find('button.btnAdicionar')[0];
              total_valor   = alerta.janela.find('table thead th label.valor')[0];

              for(let item of pedido.listaProdutos ){
                listaProdutos.push({id_produto:item.id_produto,quantidade:item.quantidade,valor:item.valor,nome:item.nome,produtoData:item.produtoData});

                tabela.append(`<tr id="${listaProdutos.length-1}">
                                  <td class="adicionar-confirmacao"><div onclick=""  class="checket "><i class="fas fa-check"></i></div></td>
                                  <td>${item.nome}</td>
                                  <td>${item.valor}</td>
                                  <td>${item.quantidade}</td>
                                  <td>R$${item.valor*item.quantidade}</td>
                                  <td></td>
                              <tr>`);
                let valor_anterior = (total_valor.innerHTML*1);
                total_valor.innerHTML = (valor_anterior+(item.valor*item.quantidade));
                tabela.find(`tr[id="${listaProdutos.length-1}"] td.adicionar-confirmacao div`)[0].addEventListener('click',function(){
                    addConfirmado(this,item)
                })
              }

              let addConfirmado = (elemento,item)=>{
                $(elemento).toggleClass("action")
                if($(elemento).hasClass('action')){
                  listaConfirmados[item.id_pedido_produto] = item;
                }else{
                  delete listaConfirmados[item.id_pedido_produto];
                }
                console.log("Stato atual dos confirmados!",listaConfirmados);
              }
              /*let editProduto = ()=>{

              }*/

              /*btnAdicionar.addEventListener("click",function(){
                addProduto();
              })*/
            };

            alerta.view('Enviar Pedido ').then(html=>{}).catch(erro=>{});

  }
}
var fornecedores = {
  tabela:{},
  init:function(){
    fornecedores.tabela = $('#tbl_fornecedor tbody');
    return fornecedores.dao.selectAll().then(listapedidos=>{
      fornecedores.view.addViewAll(listapedidos);
    })
  },
  criar:function(){
    let alerta = new Alert(`<form>
                                    <div class="row">
                                       <div class="cold6">
                                            <label class="row"> Nome *: </label>
                                            <div class="content-icon-input cold10">
                                                <input class="input-icone"  placeholder="Guilherme Luiz Gomes" name='nome'  required>
                                                <span aria-hidden="true" class="icon_profile"></span>
                                            </div>
                                       </div>
                                       <div class="cold3">
                                            <label class="row"> CNPJ*: </label>
                                            <input name='cnpj'  placeholder="63.152.483/0001-60" required>
                                       </div>
                                    </div>
                                    <div class="row">
                                       <div class="cold6">
                                            <label class="row"> Razão social *: </label>
                                            <input name='razao' style=" width: 303px; " required>
                                       </div>
                                       <div class="cold3">
                                            <label class="row"> COD *: </label>
                                            <input name='cod'  required>
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
              let nome  = formulario.find('[name="nome"]').val();
              let cnpj  = formulario.find('[name="cnpj"]').val();
              let razao = formulario.find('[name="razao"]').val();
              let cod   = formulario.find('[name="cod"]').val();
              fornecedores.dao.insert({nome,cnpj,razao,cod}).then(()=>{
                fornecedores.init();
                alerta.close();
              })
            }
          }
    });

    alerta.view('cadastro de fornecedor').then(html=>{}).catch(erro=>{});

  },
  editar:function(id){

      fornecedores.dao.selectById(id).then(fornecedor=>{


            let alerta = new Alert(`<form>
                                            <div class="row">
                                               <div class="cold6">
                                                    <label class="row"> Nome *: </label>
                                                    <div class="content-icon-input cold10">
                                                        <input class="input-icone" value="${fornecedor.nome_fornecedor}"  placeholder="Guilherme Luiz Gomes" name='nome'  required>
                                                        <span aria-hidden="true" class="icon_profile"></span>
                                                    </div>
                                               </div>
                                               <div class="cold3">
                                                    <label class="row"> CNPJ*: </label>
                                                    <input name='cnpj'  placeholder="63.152.483/0001-60" value="${fornecedor.cnpj_fornecedor}" required>
                                               </div>
                                            </div>
                                            <div class="row">
                                               <div class="cold6">
                                                    <label class="row"> Razão social *: </label>
                                                    <input name='razao' style=" width: 303px; " value="${fornecedor.razao_social}" required>
                                               </div>
                                               <div class="cold3">
                                                    <label class="row"> COD *: </label>
                                                    <input name='cod' value="${fornecedor.cod_fornecedor}"  required>
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
                      let nome  = formulario.find('[name="nome"]').val();
                      let cnpj  = formulario.find('[name="cnpj"]').val();
                      let razao = formulario.find('[name="razao"]').val();
                      let cod   = formulario.find('[name="cod"]').val();
                      fornecedores.dao.update(id,{nome,cnpj,razao,cod}).then(()=>{
                        fornecedores.init();
                        alerta.close();
                      })
                    }
                  }
            });

            alerta.view('Editando : '+fornecedor.nome_fornecedor).then(html=>{}).catch(erro=>{});
      });
  },
  deletar:function(id){
    fornecedores.dao.selectById(id).then(fornecedor=>{
          $( `<div title="Remover  ${fornecedor.nome_fornecedor} ! ">
               <strong> Remover fornecedor ${fornecedor.nome_fornecedor}</strong>?</h1>
               <p>
                 <span class="ui-icon  ui-icon-trash" style="float:left; margin:0 7px 50px 0;"></span>
               </p>
               <p>Desejá mesmo remover esse fornecedor?</p>
             </div>` ).dialog({
             modal: true,
             buttons: {
               Remover: function() {

                      $( this ).dialog( "close" );

                     fornecedores.dao.delete(id).then(function(){

                         fornecedores.init();

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
      //`id_fornecedor`,`nome_fornecedor`,`cnpj_fornecedor`,`cod_fornecedor`,`razao_social`
        return db.selectAll('tbl_fornecedor WHERE excluido = 0');

    },
    selectById:function(id){
        return db.selectById('tbl_fornecedor WHERE id_fornecedor=?',[id]);
    },
    insert:function(dados){
      return new Promise((resolve,reject)=>{
          return db.insert(`tbl_fornecedor(nome_fornecedor,cnpj_fornecedor,cod_fornecedor,razao_social)VALUES(?,?,?,?)`,[dados.nome,dados.cnpj,dados.cod,dados.razao])
          .then(()=>{
              return resolve();
          })
      })
    },
    update:function(id,dados){

      return db.update(`tbl_fornecedor SET  nome_fornecedor = ?, cnpj_fornecedor = ?,  cod_fornecedor = ?,  razao_social = ? WHERE id_fornecedor = ?`,[dados.nome,dados.cnpj,dados.cod,dados.razao,id]);

    },
    delete:function(id){
      return db.update('tbl_fornecedor SET excluido = 1 WHERE id_fornecedor = ? ',[id]);
    }
  },
  view:{
    addViewAll:function(lista){

      if(typeof lista == "object")lista = Object.values(lista);

      fornecedores.tabela.html('');
      if(lista.length < 1){
        console.log("Sem dados!!");
        fornecedores.tabela.append("<tr class='mascara'>\
                                        <td colspan='5' class='lupa'>\
                                            <img  alt='Nada encontrado' src='img/magnify.gif'>\
                                            <p> Nenhum Registro encontado! </p>\
                                        </td>\
                                    </tr>");
      }

      for(let fornecedor of lista){

            let view = $(`
                <tr data-id="${fornecedor.id_fornecedor}">
                    <td>${fornecedor.id_fornecedor}</td>
                    <td>${fornecedor.nome_fornecedor}</td>
                    <td>${fornecedor.cnpj_fornecedor}</td>
                    <td>${fornecedor.cod_fornecedor}</td>
                    <td>
                        <a href="javascript:fornecedores.deletar(${fornecedor.id_fornecedor})"><label><i class="far fa-trash-alt"></i>Deletar</label></a>
                        <a href="javascript:fornecedores.editar(${fornecedor.id_fornecedor})"><label><i class="fas fa-edit"></i>Editar</label></a>
                    </td>
                </tr>
            `);
            fornecedores.tabela.append(view);
      }
    }
  }
}
var produtos = {
  tabela:{},
  init:function(){
    produtos.tabela = $('#tbl_produtos tbody');
    return produtos.dao.selectAll().then(lista=>{
      produtos.view.addViewAll(lista);
    })
  },
  criar:function(id_fornecedor){

        let alerta = new Alert(`<form>
                                        <div class="row">
                                           <div class="cold6">
                                                <label class="row"> Nome *: </label>
                                                <div class="content-icon-input cold10">
                                                    <input class="input-icone"  placeholder="Lapis" name='nome'  required>
                                                    <span aria-hidden="true" class=" icon_gift_alt"></span>
                                                </div>
                                           </div>
                                           <div class="cold3">
                                                <label class="row"> Valor *: </label>
                                                <input name='valor'  placeholder="0.2" required>
                                           </div>
                                        </div>
                                        <div class="row">
                                           <div class="cold6" style=" float: right; opacity:0;">
                                                <label class="row"> Fornecedor: </label>
                                                <!--<input name='razao' style=" width: 303px; " >-->
                                                <select name="fornecedor">
                                                </select>
                                           </div>
                                           <div class="cold3">
                                                <label class="row"> Cod *: </label>
                                                <input name='cod'  required>
                                           </div>
                                        </div>
                                        <div class="row">
                                           <div class="cold8">
                                                <label class="row"> Descricao *: </label>
                                                <textarea name="desc" style=" float:left; width: 355px; height: 86px; resize: none; border: solid 1px #ccc;" required ></textarea>
                                           </div>
                                           <div class="cold1" style="opacity:0;">
                                                <label class="row"> descricao: </label>
                                                <input  style=" display: none; "  >
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
                    //(`id_produto`,          `descricao`,          `valor_unitario`,          `cod_produto`,          `nome`)
                    let nome           = formulario.find('[name="nome"]').val();
                    let cod            = formulario.find('[name="cod"]').val();
                    let valor          = formulario.find('[name="valor"]').val();
                    let descricao      = formulario.find('[name="desc"]').val();
                    produtos.dao.insert({nome,cod,valor,descricao}).then(()=>{
                      produtos.init();
                      alerta.close();
                    })
                  }
            }
        });
        alerta.view('cadastro de produto').then(html=>{}).catch(erro=>{});
  },
  editar:function(id){
      produtos.dao.selectById(id).then(produto=>{
          //(`id_produto`,          `descricao`,          `valor_unitario`,          `cod_produto`,          `nome`)
            let alerta = new Alert(`<form>
                                            <div class="row">
                                               <div class="cold6">
                                                    <label class="row"> Nome *: </label>
                                                    <div class="content-icon-input cold10">
                                                        <input class="input-icone" value="${produto.nome}"  placeholder="Lapis" name='nome'  required>
                                                        <span aria-hidden="true" class=" icon_gift_alt"></span>
                                                    </div>
                                               </div>
                                               <div class="cold3">
                                                    <label class="row"> Valor *: </label>
                                                    <input name='valor'  placeholder="0.2" value="${produto.valor_unitario}" required>
                                               </div>
                                            </div>
                                            <div class="row">
                                               <div class="cold6" style=" float: right; opacity:0;">
                                                    <label class="row"> Fornecedor: </label>
                                                    <!--<input name='razao' style=" width: 303px; " >-->
                                                    <select name="fornecedor">
                                                    </select>
                                               </div>
                                               <div class="cold3">
                                                    <label class="row"> Cod *: </label>
                                                    <input name='cod' value="${produto.cod_produto}"   required>
                                               </div>
                                            </div>
                                            <div class="row">
                                               <div class="cold8">
                                                    <label class="row"> Descricao *: </label>
                                                    <textarea name="desc" style=" float:left; width: 355px; height: 86px; resize: none; border: solid 1px #ccc;" required >${produto.descricao}</textarea>
                                               </div>
                                               <div class="cold1" style="opacity:0;">
                                                    <label class="row"> descricao: </label>
                                                    <input  style=" display: none; "  >
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

                        let nome           = formulario.find('[name="nome"]').val();
                        let cod            = formulario.find('[name="cod"]').val();
                        let valor          = formulario.find('[name="valor"]').val();
                        let descricao      = formulario.find('[name="desc"]').val();
                        produtos.dao.update(id,{nome,cod,valor,descricao}).then(()=>{
                          produtos.init();
                          alerta.close();
                        })
                      }
                }
            });
            alerta.view('Editar produto').then(html=>{}).catch(erro=>{});

      });
  },
  deletar:function(id){
    produtos.dao.selectById(id).then(produto=>{
          $( `<div title="Remover Produto ${produto.nome} ! ">
               <strong> Remover Produto ${produto.cod_produto}</strong>?</h1>
               <p>
                 <span class="ui-icon  ui-icon-trash" style="float:left; margin:0 7px 50px 0;"></span>
               </p>
               <p>${produto.descricao}</p>
             </div>` ).dialog({
             modal: true,
             buttons: {
               Remover: function() {

                    $( this ).dialog( "close" );

                     produtos.dao.delete(id).then(function(){

                         produtos.init();

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
      return db.selectAll('tbl_produto WHERE excluido = 0 ');
    },
    selectById:function(id){
      return db.selectById('tbl_produto WHERE id_produto = ? ',[id]);
    },
    insert:function(dados){
      return db.insert(`tbl_produto(descricao,valor_unitario,cod_produto,nome)VALUES(?,?,?,?);`,[dados.descricao,dados.valor,dados.cod,dados.nome])
    },
    update:function(id,dados){
      return db.update(`tbl_produto SET descricao = ?,valor_unitario = ?,cod_produto = ?,nome = ? WHERE id_produto = ?`,[dados.descricao,dados.valor,dados.cod,dados.nome,id])
    },
    delete:function(id){
      return db.update('tbl_produto SET excluido = 1 WHERE id_produto = ? ',[id]);
    }
  },
  view:{
    addViewAll:function(lista){

      if(typeof lista == "object")lista = Object.values(lista);

      produtos.tabela.html('');
      if(lista.length < 1){
        console.log("Sem dados!!");
        `id_produto`,`descricao`,`valor_unitario`,`cod_produto`,`nome`
        produtos.tabela.append("<tr class='mascara'>\
                                        <td colspan='5' class='lupa'>\
                                            <img  alt='Nada encontrado' src='img/magnify.gif'>\
                                            <p> Nenhum Registro encontado! </p>\
                                        </td>\
                                    </tr>");
      }

      for(let produto of lista){

            let view = $(`
                <tr data-id="${produto.id_produto}">
                    <td>${produto.id_produto}</td>
                    <td>${produto.nome}</td>
                    <td>R$ ${produto.valor_unitario}</td>
                    <td>${produto.cod_produto}</td>
                    <td>
                        <a href="javascript:produtos.deletar(${produto.id_produto})"><label><i class="far fa-trash-alt"></i>Deletar</label></a>
                        <a href="javascript:produtos.editar(${produto.id_produto})"><label><i class="fas fa-edit"></i>Editar</label></a>
                    </td>
                </tr>
            `);
            produtos.tabela.append(view);
      }
    }
  }
}
