var conta_pagar = {
  tabela:{},
  listaExport:{},
  init:function(){
    conta_pagar.tabela = $('#tbl_conta_pagar tbody');
    conta_pagar.dao.selectAll().then(lista=>{
      conta_pagar.view.addViewAll(lista);
    });
  },
  exportar:function(){},
  conciliar:function(){},
  criar:function(){
    var alerta = new Alert(`<form>
                                <div class="row">
                                    <div class="cold5">
                                        <label> Data Entrada : </label>
                                        <div class="data_entrada"></div>
                                    </div>
                                    <div class="cold4">
                                      <div class="row">
                                          <label> Valor </label>
                                          <input>
                                      </div>
                                      <div class="row">
                                          <label> Descrição </label>
                                          <input>
                                      </div>
                                    </div>
                                <div>
                            </form>`);
    alerta.buttons.push({
          texto:'Salvar',
          click:function(){

          }
    })
    alerta.show = ()=>{
      alerta.janela.find('.data_entrada').datepicker();
    }
    alerta.view('Adicionar Despesas')
  },
  editar:function(id,tipo){},
  check:function(elemento){
    $(elemento).toggleClass("action")
    if($(elemento).hasClass('action')){
      conta_pagar.listaExport[$(elemento).attr('data-id')] = true;
    }else{
      delete conta_pagar.listaExport[$(elemento).attr('data-id')]
    }
  },
  dao:{
    selectAll:function(){
      return db.selectAll(`SELECT contas_pagamentos.*,if(tbl_folha_pagamento_contas_pagar.id_conta_pagar is null,'P','F') as tipo FROM tbl_contas_pagar AS contas_pagamentos LEFT JOIN tbl_folha_pagamento_contas_pagar ON tbl_folha_pagamento_contas_pagar.id_conta_pagar = contas_pagamentos.id_conta_pagar,  tbl_contas_pagar AS contas_pedidos  LEFT JOIN tbl_pedido_contas_pagar ON tbl_pedido_contas_pagar.id_conta_pagar = contas_pedidos.id_conta_pagar  WHERE contas_pedidos.id_conta_pagar = contas_pagamentos.id_conta_pagar`);
    }
  },
  view:{
    addViewAll:function(lista){
        conta_pagar.tabela.html('');
        if(lista.length < 1){

            conta_pagar.tabela.append("<tr class='mascara'>\
                                        <td colspan='5' class='lupa'>\
                                            <img  alt='Nada encontrado' src='img/magnify.gif'>\
                                            <p> Nenhum Registro encontado! </p>\
                                        </td>\
                                    </tr>");

        }else{

                for(let conta of lista){

                      let data_compra = new Date(conta.data_baixa);
                      data_compra       = ((data_compra.getDate()<10)? '0' + data_compra.getDate():data_compra.getDate()+"/"+((data_compra.getMonth()<10)? '0' + data_compra.getMonth():data_compra.getMonth()))+"/"+data_compra.getFullYear();

                      let tipo = '';
                      if(conta.tipo == "F"){
                          tipo = '<i class="far fa-money-bill-alt"></i> Pagamento ';
                      } else if(conta.tipo == "P"){
                          tipo = '<i class="fas fa-cart-plus"></i> Pedido ';
                      }
                      console.log("Conta:",conta);

                      let marcado = '';
                      if(conta.id_conta_pagar in Object.keys(conta_pagar.listaExport))marcado = 'action';

                      let view = $(`
                          <tr data-id="${conta.id_conta_pagar}">
                              <td><div onclick="conta_pagar.check(this)" data-id="${conta.id_conta_pagar}" class="checket ${marcado}"><i class="fas fa-check"></i></div></td>
                              <td>${conta.id_conta_pagar}</td>
                              <td>${tipo}</td>
                              <td>R$ ${conta.valor}</td>
                              <td>R$${data_compra || '00/00/0000'}</td>
                              <td>
                                  <a href="javascript:contas.deletar(${conta.id_conta_pagar},${conta.tipo})"><label><i class="fas fa-exclamation-circle"></i>INFO</label></a>
                                  <a href="javascript:contas.editar(${conta.id_conta_pagar})"><label><i class="fas fa-edit"></i>Editar</label></a>
                              </td>
                          </tr>
                      `);

                      conta_pagar.tabela.append(view);
                }
        }
    }
  }
}
