var conta_pagar = {
  tabela:{},
  listaExport:{},
  init:function(){
    conta_pagar.tabela = $('#tbl_conta_pagar tbody');
    conta_pagar.dao.selectAll().then(lista=>{
      conta_pagar.view.addViewAll(lista);
    });
  },
  exportar:function(){
    if(Object.values(conta_pagar.listaExport).length<1){
        $( `<div title="Seleceione ao menos 1 pedido ! ">
             <strong> Exportar </strong>?</h1>
             <p>
               <span class="ui-icon ui-icon-transferthick-e-w" style="float:left; margin:0 7px 50px 0;"></span>
             </p>
             <p>Selecione ao menos 1 pedido</p>
           </div>` ).dialog({
           modal: true,
           width:'500px',
           buttons: {
             'Cancelar':function(){
               $( this ).dialog( "close" );
             }
           }
         });
    }else{

      $( `<div title="Seleceione a exportação ! ">
           <strong> Exportar CSV/PDF </strong>?</h1>
           <p>
             <span class="ui-icon ui-icon-transferthick-e-w" style="float:left; margin:0 7px 50px 0;"></span>
           </p>
           <p>Desejá exportar para CSV ou PDF</p>
         </div>` ).dialog({
         modal: true,
         width:'500px',
         buttons: {
           'CSV':function(){
             conta_pagar.exportarCSV(conta_pagar.listaExport);
             $( this ).dialog( "close" );
           },
           'PDF':function(){
             conta_pagar.exportarPDF(conta_pagar.listaExport);
             $( this ).dialog( "close" );
           },
           'Cancelar':function(){
             $( this ).dialog( "close" );
           }
         }
       });
    }
  },
  exportarPDF:function(lista){
      conta_pagar.dao.selectInArray(lista).then(contas=>{
        console.log(contas);
        let meses = [ 'Janeiro','Fevereiro', 'Março',  'Abril',  'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        //let coluna = {ID,  Usuario,  Cod,  Fornecedor,  Total,   Status,   Tipo,  Desc};
        let data = new Date();
        let mes = meses[data.getMonth()];
        let ano = data.getFullYear();
        let tipo = "";
        let accPedidos    = 0;
        let accPagamentos = 0;

        for(let conta of contas ){
          if(conta.tipo == "F")accPagamentos++;
          if(conta.tipo == "P")accPedidos++;
        }
        //pedido
        if(accPedidos>=1)tipo+= "Pedidos ";
        if(accPagamentos>=1)tipo+= "Pagamentos ";
        let numero_relatorio =  data.getTime();
        let codigo_data = tipo + data + "N°"+ numero_relatorio;

        let linhas = '';
        let paginas =  Math.ceil(contas.length/40)+1;

        $.get('pdf.html').then(html=>{
          html = html.toString();

          html = html.replace('{{mes}}',mes);
          html = html.replace('{{ano}}',ano);
          html = html.replace('{{tipo}}',tipo);
          html = html.replace('{{paginas}}',paginas);
          html = html.replace('{{codigo_data}}',codigo_data);
          html = html.replace('{{codigo}}',numero_relatorio);

          let pagina = 0;
          let htmlPDF = $(html);
          let modelo_pagina = `<div class="page">
                                    <!--<div class="legend">
                                        <div class="conteudo">
                                          --{{codigo_data}}
                                          --{{codigo_data}}
                                          --{{codigo_data}}
                                          --{{codigo_data}}
                                        </div>
                                    </div>-->
                                    <div class="table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Usuario</th>
                                                    <th>Cod</th>
                                                    <th>Fornecedor</th>
                                                    <th>Total</th>
                                                    <th>Status</th>
                                                    <th>Tipo</th>
                                                    <th>Desc</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                              {{linhas}}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="rodape">
                                        <div class="separador">
                                            N°{{codigo}}
                                        </div>
                                        <div class="paginas">
                                            {{pagina}} de {{paginas}}
                                        </div>
                                    </div>
                                </div>`;

          do{
            let pagina_atual = modelo_pagina;
            pagina_atual = pagina_atual.replace('{{pagina}}',pagina+1);
            pagina_atual = pagina_atual.replace('{{codigo}}',numero_relatorio);
            pagina_atual = pagina_atual.replace(/{{codigo_data}}/g,codigo_data);
            pagina_atual = pagina_atual.replace('{{paginas}}',paginas);
            let contas_pagina = [];
            contas_pagina = contas.splice(pagina * 40, (pagina * 40) + 40);
            console.log("contas_pagina : ",contas_pagina);
            console.log("Pagina : ",pagina);
            console.log("Pagina registros: ",pagina*40);
            let linhas = '';
            for(let conta of contas_pagina){
              linhas+= `<tr>
                            <td>${conta.id_conta_pagar}</td>
                            <td>${conta.usuario}</td>
                            <td>${conta.codigo_pagamento}</td>
                            <td>${conta.fornecedor}</td>
                            <td>R$ ${conta.valor}</td>
                            <td> andamento </td>
                            <td> ${((conta.tipo == "F")?'Pagamento':'Pedido')} </td>
                            <td> ${conta.descricao} </td>
                        </tr>`;
            }
            console.log("Linha : ",linhas);
            pagina_atual = pagina_atual.replace('{{linhas}}',linhas);
            console.log("Pagina : ",pagina_atual);
            htmlPDF.append(pagina_atual);
            pagina++;
//Parei aqui
          }while(pagina < paginas - 1);
          console.log("html : ",htmlPDF.html());
          genPDF('relatorio_contas_pagar.pdf',htmlPDF.html());

        })
      })
  },
  exportarCSV:function(lista){
    conta_pagar.dao.selectInArray(lista).then(contas=>{
      csv =" id;usuario;cod;fornecedor;valor;tipo;descricao\n ";
      for(let conta of contas){
        csv += conta.id_conta_pagar+";"+conta.usuario+";"+conta.codigo_pagamento+";"+conta.fornecedor+";"+conta.valor+";"+((conta.tipo == "F")?'Pagamento':'Pedido')+";"+conta.descricao+"\n";
      }
      genCSV(csv);
    })
  },
  conciliar:function(){
    if(Object.values(conta_pagar.listaExport).length<1){
        $( `<div title="Seleceione ao menos 1 pedido ! ">
             <strong> Exportar </strong>?</h1>
             <p>
               <span class="ui-icon ui-icon-transferthick-e-w" style="float:left; margin:0 7px 50px 0;"></span>
             </p>
             <p>Selecione ao menos 1 pedido</p>
           </div>` ).dialog({
           modal: true,
           width:'500px',
           buttons: {
             'Cancelar':function(){
               $( this ).dialog( "close" );
             }
           }
         });
    }else{
          conta_pagar.dao.selectInArray(conta_pagar.listaExport).then(listaD=>{
          contas.dao.selectAll().then(listaC=>{
              let options = '';
              for(let conta of listaC){
                options+= `<option value="${conta.id_conta}">${conta.numero_conta+' '+conta.nome_banco}</option>`;
              }
              let valor_total = 0;
              for(let despesa of listaD){
                console.log("Despesa: ",despesa);
                valor_total += despesa.valor * 1;
              }
              console.log("valor_total",valor_total);
              $( `<form title="Selecione a Conta ! ">
                    <div class="row">
                       <div class="cold6">
                            <label class="row"> Conta*: </label>
                            <select name="contas" required>
                              ${options}
                            </select>
                       </div>
                       <div class="cold3" style="opacity:0;">
                            <label class="row"> *: </label>
                            <input name="quantidade" style="min-width:auto;">
                       </div>
                    </div>
                    <div class="row" style="  margin-top: 12px;">
                        <div class="cold6" style=" float: left;">
                            <label class="row"> Valor Total*: </label>
                            <input name="valor" value="${valor_total}" style="min-width:auto;" disabled>
                        </div>
                        <div class="cold4" style="width: 42%; opacity: 0.0; ">
                             <label class="row"> Valor unitario: </label>
                             <input name="cod" style="min-width:auto;">
                        </div>
                    </div>
                </form>` ).dialog({
                 modal: true,
                 width:'600px',
                 buttons: {
                   'Avançar':function(){
                     $( this ).dialog( "close" );
                     console.log($(this).find('select[name="contas"]')[0]);
                     console.log($(this).find('select[name="contas"]').val());
                     let id_conta = $(this).find('select[name="contas"]')[0].value;
                     operacoes.criar(id_conta,listaD);
                   },
                   'Cancelar':function(){
                     $( this ).dialog( "close" );
                   }
                 }
               });
        }) })
    }
  },
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
      return db.selectAll(`SELECT contas_pedidos.*, contas_pagamentos.*,if(tbl_folha_pagamento_contas_pagar.id_conta_pagar is null,'P','F') as tipo FROM tbl_contas_pagar AS contas_pagamentos LEFT JOIN tbl_folha_pagamento_contas_pagar ON tbl_folha_pagamento_contas_pagar.id_conta_pagar = contas_pagamentos.id_conta_pagar,  tbl_contas_pagar AS contas_pedidos  LEFT JOIN tbl_pedido_contas_pagar ON tbl_pedido_contas_pagar.id_conta_pagar = contas_pedidos.id_conta_pagar  WHERE contas_pedidos.id_conta_pagar = contas_pagamentos.id_conta_pagar`);
    },
    selectInArray:function(lista){
      if(typeof lista != "Object")lista = Object.keys(lista);
      let vetor = "("+lista.join(',')+")";
      console.log(vetor);
      return db.selectAll(`SELECT contas_pedidos.*, contas_pagamentos.*,if(tbl_folha_pagamento_contas_pagar.id_conta_pagar is null,'P','F') as tipo ,
                            if(tbl_folha_pagamento_contas_pagar.id_conta_pagar is null,tbl_usuario_desktop_pedidos.nome,tbl_usuario_desktop.nome) as usuario,
                            if(tbl_folha_pagamento_contas_pagar.id_conta_pagar is null, tbl_fornecedor.nome_fornecedor , tbl_funcionario.nome ) as fornecedor
                            FROM
                          	tbl_contas_pagar AS contas_pagamentos
                          	LEFT JOIN tbl_folha_pagamento_contas_pagar
                          	ON tbl_folha_pagamento_contas_pagar.id_conta_pagar = contas_pagamentos.id_conta_pagar
                          	LEFT JOIN tbl_folha_pagamento
                          	  ON tbl_folha_pagamento.id_folha_pagamento = tbl_folha_pagamento_contas_pagar.id_folha_pagamento
                          	LEFT JOIN tbl_usuario_desktop
                          	ON tbl_folha_pagamento.id_usuario_desktop = tbl_usuario_desktop.id_usuario_desktop
                          	LEFT JOIN tbl_funcionario
                          	ON tbl_funcionario.id_funcionario = tbl_folha_pagamento.id_funcionario,
                          	tbl_contas_pagar AS contas_pedidos
                          	LEFT JOIN tbl_pedido_contas_pagar
                          	ON tbl_pedido_contas_pagar.id_conta_pagar = contas_pedidos.id_conta_pagar
                          	LEFT JOIN tbl_pedido
                          	  ON tbl_pedido.id_pedido = tbl_pedido_contas_pagar.id_pedido
                          	LEFT JOIN  tbl_usuario_desktop as tbl_usuario_desktop_pedidos
                          	ON tbl_pedido.id_usuario_desktop = tbl_usuario_desktop_pedidos.id_usuario_desktop
                          	LEFT JOIN tbl_fornecedor
                          	ON tbl_fornecedor.id_fornecedor = tbl_pedido.id_fornecedor
                            WHERE contas_pedidos.id_conta_pagar = contas_pagamentos.id_conta_pagar and contas_pedidos.id_conta_pagar in ${vetor}`);
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

                      let data_compra = new Date(conta.data_entrada);
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
