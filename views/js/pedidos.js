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

        let alerta = new Alert(`<form>
                                        <div class="row">
                                           <div class="cold6">
                                                <label class="row"> Forma de Pagamento *: </label>
                                                <div class="content-icon-input cold10">
                                                    <input class="input-icone"  placeholder="Guilherme Luiz Gomes" name='nome'  required>
                                                    <span aria-hidden="true" class="icon_percent"></span>
                                                </div>
                                           </div>
                                           <div class="cold3">
                                                <label class="row"> Frete: </label>
                                                <div class="content-icon-input">
                                                    <input name="telefone" class="input-icone" placeholder="(11)4303-6889" required>
                                                    <span aria-hidden="true" class="icon_wallet"></span>
                                                </div>
                                           </div>
                                        </div>
                                        <div class="row">
                                           <div class="cold6">
                                                <label class="row"> Fornecedor *: </label>
                                                <input name='razao' style=" width: 303px; " required>
                                           </div>
                                           <div class="cold3">
                                                <label class="row"> Desconto *: </label>
                                                <input name='cod'  required>
                                           </div>
                                        </div>
                                        <div class="row">
                                           <div class="cold6">
                                                <label class="row"> Data Compra *: </label>
                                                <input name='razao' style=" width: 303px; " required>
                                           </div>
                                           <div class="cold3">
                                                <label class="row"> Data Entrega *: </label>
                                                <input name='cod'  required>
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
                                                      <label>R$10.00</label>
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
        alerta.show = function(){
          let tabela        = alerta.janela.find('table tbody');
          let listaProdutos = [];
          let btnAdicionar  = alerta.janela.find('button.btnAdicionar')[0];

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
                                  <label class="row"> Produto: </label>
                                  <select name="produtos">
                                    ${options}
                                  </select>
                             </div>
                             <div class="cold3">
                                  <label class="row"> Quantidade: </label>
                                  <input name="cod" style="min-width:auto;" >
                             </div>
                          </div>
                          <div class="row" style="  margin-top: 12px;">
                              <div class="cold6" style=" float: left;">
                                  <label class="row"> Valor: </label>
                                  <input name="cod" style="min-width:auto;" >
                              </div>
                              <div class="cold4" style="width: 42%; opacity: 0.0; ">
                                   <label class="row"> Valor: </label>
                                   <input name="cod" style="min-width:auto;" >
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

                            //$( this ).dialog( "close" );
                          }
                        }
                      });
            })
          }
          let delProduto = ()=>{

          }
          let editProduto = ()=>{

          }

          btnAdicionar.addEventListener("click",function(){
            addProduto();
          })
        };
        alerta.view('cadastro de fornecedor').then(html=>{}).catch(erro=>{});


    })

  },
  dao:{
    selectAll:function(){
      return db.selectAll('select tbl_pedido.*, tbl_usuario_desktop.nome, if(tbl_usuario_desktop.foto is null ,"img/user.png", tbl_usuario_desktop.foto ) as foto,tbl_usuario_desktop.excluido from  tbl_pedido inner join tbl_usuario_desktop on tbl_pedido.id_usuario_desktop = tbl_usuario_desktop.id_usuario_desktop');
    },
    selectById:function(){},
    insert:function(){},
    update:function(){},
    delete:function(){}
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
            let view = $(`
                <tr data-id="${pedido.id_pedido}">
                    <td>${pedido.id}</td>
                    <td>
                      <img src="${pedido.foto}">
                      <label>${pedido.nome}</label>
                    </td>
                    <td>${usuario.valor_total}</td>
                    <td>${usuario.data_compra}</td>
                </tr>
            `);
            pedidos.tabela.append(view);
      }
    }
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
  dao:{
    selectAll:function(){
      //`id_fornecedor`,`nome_fornecedor`,`cnpj_fornecedor`,`cod_fornecedor`,`razao_social`
        return db.selectAll('tbl_fornecedor');

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
    delete:function(){}
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
  dao:{
    selectAll:function(){
      return db.selectAll('tbl_produto');
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
    delete:function(){}
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
