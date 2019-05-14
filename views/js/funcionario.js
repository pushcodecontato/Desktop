try{
/* Operações da tela de usuasario  */
var funcionarios = {

    tabela:{},
    lista:{},

    init:function(){
      /*let lista = [
                     {id:1,cod:'gfr534',nome:'Claudio',email:'ramos@mail.com',cpf:'482.268.587-14',rg:'52.782.502-8',
                      telefone:'4574-5575',setor:{id:1,nome:"Administração"},cargo:{id:1,nome:'Administrador'} },

                     {id:2,cod:'kjui6543',nome:'Sandra',email:'sandra@vivaldi.net',cpf:'759.837.120-20',rg:'52.792.552-7',
                      telefone:'5858-5875',setor:{id:2,nome:"RH"},cargo:{id:2,nome:'Diretor'} },

                     {id:3,cod:'hy57845',nome:'Rafael',email:'rafael@vivaldi.net',cpf:'990.772.050-04',rg:'52.782.502-8',
                      telefone:'5245-5872',setor:{id:1,nome:"Administração"},cargo:{id:4,nome:'Coordenador'} },

                     {id:4,cod:'khy5689',nome:'Alexandre',email:'alexandre@vivaldi.net',cpf:'028.371.370-49',rg:'52.782.502-8',
                      telefone:'3567-5846',setor:{id:3,nome:"TI"},cargo:{id:3,nome:'Gestor'} },
                  ];*/


      funcionarios.tabela = $('#tbl_funcionarios tbody');
      funcionarios.dao.selectAll().then(function(lista){

        for(let funcionario of lista){

             funcionarios.lista[funcionario.id] = funcionario;

        }

        funcionarios.addViewAll(lista);

      })
    },
    // Adiciona todos os funcionarios passados como paremetros a tabela
    addViewAll:function(lista){

        if(typeof lista == "object")lista = Object.values(lista);

        funcionarios.tabela.html('');

        for(let funcionario of lista){
            funcionarios.addView(funcionario);
        }

    },
    // Adiciona o funcionario passados como paremetros a tabela
    addView:function(funcionario){
        let view = $(`
            <tr data-id="${funcionario.id}">
                <td>${funcionario.id}</td>
                <td>${funcionario.nome}</td>
                <td>${funcionario.cpf}</td>
                <td>${funcionario.cargo.nome}</td>
                <td class="center">
                    <a href="javascript:funcionarios.ver(${funcionario.id})"><label><i class="far fa-eye"></i>Exibir</label></a>
                    <a href="javascript:funcionarios.deletar(${funcionario.id})"><label><i class="far fa-trash-alt"></i>Deletar</label></a>
                    <a href="javascript:funcionarios.editar(${funcionario.id})"><label><i class="fas fa-edit"></i>Editar</label></a></td>
                </td>
            </tr>
        `);
        funcionarios.tabela.append(view);
    },
    removeView:function(id){
        funcionarios.tabela.find(`tr[data-id="${id}"]`)
        .hide(200,function(){
            $(this).remove();
        });
    },
    updateView:function(id){

        let funcionario =  {};
        if(typeof id == "object")funcionario = id
        else funcionario = funcionarios.lista[id];

        funcionarios.tabela.find(`tr[data-id="${funcionario.id}"]`)
        .html(`
                <td>${funcionario.id}</td>
                <td>${funcionario.nome}</td>
                <td>${funcionario.cpf}</td>
                <td>${funcionario.cargo.nome}</td>
                <td class="center">
                    <a href="javascript:funcionarios.ver(${funcionario.id})"><label><i class="far fa-eye"></i>Exibir</label></a>
                    <a href="javascript:funcionarios.deletar(${funcionario.id})"><label><i class="far fa-trash-alt"></i>Deletar</label></a>
                    <a href="javascript:funcionarios.editar(${funcionario.id})"><label><i class="fas fa-edit"></i>Editar</label></a></td>
                </td>`);
    },
    editar:function(id){

        let funcionario = {};
        // Verificado se o funcionario já esta sendo psssado como parametro
        if(typeof id == "object")funcionario = id
        else funcionario = funcionarios.lista[id];

        let slcCargo = $('<select  class="input-icone" name="cargo" required></select>');
        let slcSetor = $('<select  class="input-icone" name="setor" required></select>');

        cargos.dao.selectAll().then(listaC=>{
          setores.dao.selectAll().then(listaS=>{
                /* Adicionando options nos slc */
               for(let cargo of listaC){
                 if(funcionario.cargo.id == cargo.id )slcCargo.append(`<option value="${cargo.id}" selected>${cargo.nome}</option>`);
                 else slcCargo.append(`<option value="${cargo.id}">${cargo.nome}</option>`);

               }

               for(let setor of listaS){

                   if(funcionario.setor.id == setor.id)slcSetor.append(`<option value="${setor.id}" selected>${setor.nome}</option>`)
                   else slcSetor.append(`<option value="${setor.id}">${setor.nome}</option>`);

               }

               let alerta = new Alert(`<form>
                                            <ul>
                                              <li><a href="#frm-tab-1">D. basicos</a></li>
                                              <li><a href="#frm-tab-2">D. Legais e local</a></li>
                                            </ul>
                                            <div id='frm-tab-1'>
                                               <div class="row">
                                                  <div class="cold6">
                                                       <label class="row"> Nome *: </label>
                                                       <div class="content-icon-input cold10">
                                                           <input class="input-icone" value="${funcionario.nome}" placeholder="Guilherme Luiz Gomes" name='nome'  required>
                                                           <span aria-hidden="true" class="icon_profile"></span>
                                                       </div>
                                                  </div>
                                                  <div class="cold3">
                                                       <label class="row"> Cod *: </label>
                                                       <input name='cod' value="${funcionario.cod}" placeholder="f3434" required>
                                                  </div>
                                               </div>
                                               <div class="row">
                                                  <div class="cold6">
                                                       <label class="row"> CPF *: </label>
                                                       <input name='cpf' style=" width: 303px; " value="${funcionario.cpf}"  placeholder="603.427.162-20" required>
                                                  </div>
                                                  <div class="cold3">
                                                       <label class="row"> RG *: </label>
                                                       <input name='rg' placeholder="35.948.004-4" value="${funcionario.rg}" required>
                                                  </div>
                                               </div>
                                               <div class="row">
                                                  <div class="cold6">
                                                       <label class="row"> E-mail *: </label>
                                                       <div class="content-icon-input cold10">
                                                           <input class="input-icone" value="${funcionario.email}" placeholder="gguilhermeluizgomes@ceviu.com.br" name='email' required>
                                                           <span aria-hidden="true" class="icon_mail_alt"></span>
                                                       </div>
                                                  </div>
                                                  <div class="cold3">
                                                       <label class="row"> Telefone *: </label>
                                                       <div class="content-icon-input">
                                                           <input class="input-icone" value="${funcionario.telefone}" placeholder="(15) 2834-3718" name="telefone" required>
                                                           <span aria-hidden="true" class="icon_phone"></span>
                                                       </div>
                                                  </div>
                                               </div>
                                               <div class="row">
                                                  <div class="cold8" style="width:81%;">
                                                       <label class="row"> Cargo *: </label>
                                                       <div class="content-icon-input cold10">
                                                         <span style="font-size: 1.9em;position: relative;margin-top: 0px;color: #F44336;display: inline-block;margin-right: 139px;line-height: 1;" aria-hidden="true" class="icon_minus_alt2"></span>
                                                         <span style="font-size: 1.9em;position: relative;margin-top: 0px;color: #2d2;display: inline-block;margin-right: auto;line-height: 1;" aria-hidden="true" class="icon_plus_alt"></span>
                                                         <select  class="input-icone" name="cargo" required>
                                                             ${slcCargo.html()}
                                                         </select>
                                                         <span aria-hidden="true" style="    float: left;    padding-left: 7px;" class="icon_toolbox"></span>
                                                       </div>
                                                  </div>
                                               </div>
                                               <div class="row">
                                                  <div class="cold8" style="width:81%;">
                                                       <label class="row"> Setor *: </label>
                                                       <div class="content-icon-input cold10">
                                                           <span style="font-size: 1.9em;position: relative;margin-top: 0px;color: #F44336;display: inline-block;margin-right: 139px;line-height: 1;" aria-hidden="true" class="icon_minus_alt2"></span>
                                                           <span style="font-size: 1.9em;position: relative;margin-top: 0px;color: #2d2;display: inline-block;margin-right: auto;line-height: 1;" aria-hidden="true" class="icon_plus_alt"></span>
                                                           <select  class="input-icone" name="setor" required>
                                                               ${slcSetor.html()}
                                                           </select>
                                                           <span aria-hidden="true" style="float: left;    padding-left: 7px;" class="icon_contacts"></span>
                                                       </div>
                                                  </div>
                                               </div>
                                           </div>
                                           <div id='frm-tab-2'>
                                           <div class="row">
                                              <div class="cold6">
                                                   <label class="row"> CEP: </label>
                                                   <input name='cep' style=" width: 303px; " value="${funcionario.cep}"  placeholder="41650-476" >
                                              </div>
                                              <div class="cold3">
                                                   <label class="row"> UF: </label>
                                                   <input name='uf' value="${funcionario.uf}" >
                                              </div>
                                              <div class="cold6">
                                                   <label class="row"> Logradouro: </label>
                                                   <input name='logradouro' style=" width: 303px; " value="${funcionario.logradouro}" >
                                              </div>
                                              <div class="cold3">
                                                   <label class="row"> N°: </label>
                                                   <input name='n'  value="${funcionario.n}">
                                              </div>
                                              <div class="cold6">
                                                   <label class="row"> Bairro: </label>
                                                   <input name='bairro' style=" width: 303px; " value="${funcionario.bairro}" >
                                              </div>
                                              <div class="cold3">
                                                   <label class="row"> Cidade: </label>
                                                   <input name='cidade'  value="${funcionario.cidade}" >
                                              </div>
                                              <div class="cold5">
                                                   <label class="row"> D. admiçao: </label>
                                                   <div class="admissao"></div>
                                              </div>
                                              <div class="cold4">
                                                   <label class="row"> D. nascimento: </label>
                                                   <div class="nascimento"></div>
                                              </div>
                                           </div>
                                           <button type="submit"></button>
                                       </form>`);


               alerta.buttons.push({
                   texto:'Salvar',
                   click:function(){

                        let formulario = alerta.janela.find('form');

                        let btnSubmit  = formulario.find('button[type="submit"]');

                        let listaDados = {};

                        formulario.off('submit');
                        if(!formulario[0].checkValidity()){

                          console.log('Formualrio invalido!!');
                          $(`<div title="Prencha todos os campos">
                                <p> E necessario preencher todos os campos * </p>
                            </div>`).dialog();

                          return;
                        }
                        formulario.submit(function(event){

                           event.preventDefault();

                           let dados = formulario.serializeArray();
                           let dtNascimento = alerta.janela.find('.nascimento').datepicker( "getDate" );
                           let nascimento = {
                             name:'nascimento',
                             value:dtNascimento
                           };
                           let dtAdmissao = alerta.janela.find('.admissao').datepicker( "getDate" );
                           let admissao   = {
                             name:'admissao',
                             value:dtAdmissao
                           };
                           dados.push(nascimento);
                           dados.push(admissao);

                           funcionarios.dao.update(id,dados).then(function(funcionarioC){
                               alerta.close();
                               console.log("MANDANDO UPDATEVIEW : ",funcionarioC)
                               funcionarios.updateView(funcionarioC);
                           })


                        })

                        btnSubmit.click();

                   }
               })

               alerta.show = ()=>{
                   // Usando o jquery ui para criar a combobox
                   //alerta.janela.find("[name='cargo']").combobox();
                   //alerta.janela.find("[name='setor']").combobox();
                   alerta.janela.find('form').tabs({
                      collapsible: true
                    });
                   alerta.janela.find("[name='cargo']").multiselect({
                      multiple: false,
                      header: "Selecione",
                      noneSelectedText: "cargos",
                      selectedList: 1
                   });
                   alerta.janela.find("[name='setor']").multiselect({
                      multiple: false,
                      header: "Selecione",
                      noneSelectedText: "cargos",
                      selectedList: 1
                   });
                   alerta.janela.find('.admissao').datepicker();
                   alerta.janela.find('.nascimento').datepicker();
                   console.log(funcionario);
                   alerta.janela.find('.admissao').datepicker( "setDate", funcionario.admissao );
                   alerta.janela.find('.nascimento').datepicker( "setDate", funcionario.nascimento );
               }

               alerta.view(funcionario.nome).then(html=>{}).catch(erro=>{});
          })
        })

    },
    ver:function(id){

        let funcionario = funcionarios.lista[id];

        let alerta = new Alert(`<form>
                                    <div class="row">
                                       <div class="cold6">
                                            <label class="row"> Nome: </label>
                                            <div class="content-icon-input cold10">
                                                <input class="input-icone" value="${funcionario.nome}" disabled>
                                                <span aria-hidden="true" class="icon_profile"></span>
                                            </div>
                                       </div>
                                       <div class="cold3">
                                            <label class="row"> CPF: </label>
                                            <input value="${funcionario.cpf}" disabled>
                                       </div>
                                    </div>
                                    <div class="row">
                                       <div class="cold3" style="margin-right: 26px;">
                                            <label class="row"> Cod: </label>
                                            <input  style="min-width:auto;" value="${funcionario.cod}" disabled>
                                       </div>
                                       <div class="cold3">
                                            <label class="row"> RG: </label>
                                            <input style="min-width: auto;  width: 89%;" value="${funcionario.rg}" disabled>
                                       </div>
                                       <div class="cold3">
                                            <label class="row"> Cargo: </label>
                                            <input value="${funcionario.cargo.nome}" disabled>
                                       </div>
                                    </div>
                                    <div class="row">
                                       <div class="cold6">
                                            <label class="row"> E-mail: </label>
                                            <div class="content-icon-input cold10">
                                                <input class="input-icone" value="${funcionario.email}" disabled>
                                                <span aria-hidden="true" class="icon_mail"></span>
                                            </div>
                                       </div>
                                       <div class="cold3">
                                            <label class="row"> Telefone: </label>
                                            <div class="content-icon-input">
                                                <input class="input-icone" value="${funcionario.telefone}" disabled>
                                                <span aria-hidden="true" class="icon_phone"></span>
                                            </div>
                                       </div>
                                    </div>
                                </form>`);

        alerta.buttons.push({
            texto:' Pagamento ',
            click:function(){
                alerta.close();
                funcionarios.efetuarPagamento(funcionario.id);
            }
        },{
            texto:'Editar',
            click:function(){
                alerta.close();
                funcionarios.editar(funcionario);
            }
        })

        alerta.view('funcionario: ' + funcionario.nome).then(html=>{

        }).catch(erro=>{

        })
    },
    deletar:function(id){

        let funcionario = funcionarios.lista[id];

        $( `<div title="Remover funcionario ${funcionario.nome} ! ">
             <strong> Remover ${funcionario.nome}</strong>?</h1>
             <p>
               <span class="ui-icon  ui-icon-trash" style="float:left; margin:0 7px 50px 0;"></span>
             </p>
             <p>
               Funcionario: <strong>${funcionario.nome}</strong><br>
               E-mail :     <strong>${funcionario.email}</strong>
             </p>
           </div>` ).dialog({
           modal: true,
           buttons: {
             Remover: function() {

                    $( this ).dialog( "close" );

                   funcionarios.dao.delete(id).then(function(){

                       funcionarios.removeView(id);

                   })

             },
             Cancelar:function(){
               $( this ).dialog( "close" );
             }
           }
         });
    },
    criar:function(){

        let slcCargo = $('<select  class="input-icone" name="cargo" required></select>');
        let slcSetor = $('<select  class="input-icone" name="setor" required></select>');

        cargos.dao.selectAll().then(listaC=>{
          setores.dao.selectAll().then(listaS=>{
                /* Adicionando options nos slc */
               for(let cargo of listaC){

                  slcCargo.append(`<option value="${cargo.id}">${cargo.nome}</option>`);

               }

               for(let setor of listaS){

                   slcSetor.append(`<option value="${setor.id}">${setor.nome}</option>`);

               }

               let alerta = new Alert(`<form>
                                            <ul>
                                              <li><a href="#frm-tab-1">D. basicos</a></li>
                                              <li><a href="#frm-tab-2">D. Legais e local</a></li>
                                            </ul>
                                            <div id='frm-tab-1'>
                                               <div class="row">
                                                  <div class="cold6">
                                                       <label class="row"> Nome *: </label>
                                                       <div class="content-icon-input cold10">
                                                           <input class="input-icone" placeholder="Guilherme Luiz Gomes" name='nome'  required>
                                                           <span aria-hidden="true" class="icon_profile"></span>
                                                       </div>
                                                  </div>
                                                  <div class="cold3">
                                                       <label class="row"> Cod *: </label>
                                                       <input name='cod' placeholder="f3434" required>
                                                  </div>
                                               </div>
                                               <div class="row">
                                                  <div class="cold6">
                                                       <label class="row"> CPF *: </label>
                                                       <input name='cpf' style=" width: 303px; "  placeholder="603.427.162-20" required>
                                                  </div>
                                                  <div class="cold3">
                                                       <label class="row"> RG *: </label>
                                                       <input name='rg' placeholder="35.948.004-4" required>
                                                  </div>
                                               </div>
                                               <div class="row">
                                                  <div class="cold6">
                                                       <label class="row"> E-mail *: </label>
                                                       <div class="content-icon-input cold10">
                                                           <input class="input-icone" placeholder="gguilhermeluizgomes@ceviu.com.br" name='email' required>
                                                           <span aria-hidden="true" class="icon_mail_alt"></span>
                                                       </div>
                                                  </div>
                                                  <div class="cold3">
                                                       <label class="row"> Telefone *: </label>
                                                       <div class="content-icon-input">
                                                           <input class="input-icone" placeholder="(15) 2834-3718" name="telefone" required>
                                                           <span aria-hidden="true" class="icon_phone"></span>
                                                       </div>
                                                  </div>
                                               </div>
                                               <div class="row">
                                                  <div class="cold8" style="width:81%;">
                                                       <label class="row"> Cargo *: </label>
                                                       <div class="content-icon-input cold10">
                                                         <span style="font-size: 1.9em;position: relative;margin-top: 0px;color: #F44336;display: inline-block;margin-right: 139px;line-height: 1;" aria-hidden="true" class="icon_minus_alt2"></span>
                                                         <span style="font-size: 1.9em;position: relative;margin-top: 0px;color: #2d2;display: inline-block;margin-right: auto;line-height: 1;" aria-hidden="true" class="icon_plus_alt"></span>
                                                         <select  class="input-icone" name="cargo" required>
                                                             ${slcCargo.html()}
                                                         </select>
                                                         <span aria-hidden="true" style="    float: left;    padding-left: 7px;" class="icon_toolbox"></span>
                                                       </div>
                                                  </div>
                                               </div>
                                               <div class="row">
                                                  <div class="cold8" style="width:81%;">
                                                       <label class="row"> Setor *: </label>
                                                       <div class="content-icon-input cold10">
                                                           <span style="font-size: 1.9em;position: relative;margin-top: 0px;color: #F44336;display: inline-block;margin-right: 139px;line-height: 1;" aria-hidden="true" class="icon_minus_alt2"></span>
                                                           <span style="font-size: 1.9em;position: relative;margin-top: 0px;color: #2d2;display: inline-block;margin-right: auto;line-height: 1;" aria-hidden="true" class="icon_plus_alt"></span>
                                                           <select  class="input-icone" name="setor" required>
                                                               ${slcSetor.html()}
                                                           </select>
                                                           <span aria-hidden="true" style="float: left;    padding-left: 7px;" class="icon_contacts"></span>
                                                       </div>
                                                  </div>
                                               </div>
                                           </div>
                                           <div id='frm-tab-2'>
                                           <div class="row">
                                              <div class="cold6">
                                                   <label class="row"> CEP: </label>
                                                   <input name='cep' style=" width: 303px; " value=""  placeholder="41650-476" >
                                              </div>
                                              <div class="cold3">
                                                   <label class="row"> UF: </label>
                                                   <input name='uf'  >
                                              </div>
                                              <div class="cold6">
                                                   <label class="row"> Logradouro: </label>
                                                   <input name='logradouro' style=" width: 303px; "  >
                                              </div>
                                              <div class="cold3">
                                                   <label class="row"> N°: </label>
                                                   <input name='n'  >
                                              </div>
                                              <div class="cold6">
                                                   <label class="row"> Bairro: </label>
                                                   <input name='bairro' style=" width: 303px; " >
                                              </div>
                                              <div class="cold3">
                                                   <label class="row"> Cidade: </label>
                                                   <input name='cidade'  >
                                              </div>
                                              <div class="cold5">
                                                   <label class="row"> D. admiçao: </label>
                                                   <div class="admissao"></div>
                                              </div>
                                              <div class="cold4">
                                                   <label class="row"> D. nascimento: </label>
                                                   <div class="nascimento"></div>
                                              </div>
                                           </div>
                                           <button type="submit"></button>
                                       </form>`);


               alerta.buttons.push({
                   texto:'Salvar',
                   click:function(){

                        let formulario = alerta.janela.find('form');

                        let btnSubmit  = formulario.find('button[type="submit"]');

                        let listaDados = {};

                        formulario.off('submit');
                        if(!formulario[0].checkValidity()){

                          console.log('Formualrio invalido!!');
                          $(`<div title="Prencha todos os campos">
                                <p> E necessario preencher todos os campos * </p>
                            </div>`).dialog();

                          return;
                        }
                        formulario.submit(function(event){

                           event.preventDefault();

                           let dados = formulario.serializeArray();
                           let dtNascimento = alerta.janela.find('.nascimento').datepicker( "getDate" );
                           let nascimento = {
                             name:'nascimento',
                             value:dtNascimento
                           };
                           let dtAdmissao = alerta.janela.find('.admissao').datepicker( "getDate" );
                           let admissao   = {
                             name:'admissao',
                             value:dtAdmissao
                           };
                           dados.push(nascimento);
                           dados.push(admissao);

                           console.log("::",dados);

                           funcionarios.dao.insert(dados).then(function(funcionario){
                               alerta.close();
                               funcionarios.addView(funcionario);
                           })


                        })

                        btnSubmit.click();

                   }
               })

               alerta.show = ()=>{
                   // Usando o jquery ui para criar a combobox
                   //alerta.janela.find("[name='cargo']").combobox();
                   //alerta.janela.find("[name='setor']").combobox();
                   alerta.janela.find('form').tabs({
                      collapsible: true
                    });
                   alerta.janela.find("[name='cargo']").multiselect({
                      multiple: false,
                      header: "Selecione",
                      noneSelectedText: "cargos",
                      selectedList: 1
                   });
                   alerta.janela.find("[name='setor']").multiselect({
                      multiple: false,
                      header: "Selecione",
                      noneSelectedText: "cargos",
                      selectedList: 1
                   });
                   alerta.janela.find('.admissao').datepicker();
                   alerta.janela.find('.nascimento').datepicker();
                   alerta.janela.find('.nascimento').datepicker( "setDate", "01/01/2000" );
               }

               alerta.view('Adicionar funcionario ').then(html=>{

               }).catch(erro=>{

               })
          })
        })

    },
    efetuarPagamento:function(id){
      let funcionario = {};
      // Verificado se o funcionario já esta sendo psssado como parametro
      if(typeof id == "object")funcionario = id
      else funcionario = funcionarios.lista[id];

      return db.selectAll('tbl_salario WHERE id_funcionario = ? order by id_salario desc',[funcionario.id]).then(salarios=>{
        if(salarios.length < 1 ){
          $( `<div title=" Sem Salario! ">
               <p>
                 <span class="ui-icon  ui-icon-mail-closed" style="float:left; margin:0 7px 50px 0;"> Sem Salario cadastrado</span>
               </p>
               <p>
                 Desejá cadastrar um Salario?
               </p>
             </div>` ).dialog({
                   modal: true,
                   buttons: {
                     Ok: function() {
                       $( this ).dialog( "close" );
                       $( `<div title="Cadastrar Salario ">
                             <div class="row">
                                <div class="cold8" style="width:98%;">
                                     <label class="row"> Salario: </label>
                                     <input value="900.00" placeholder="000.00" name="salario" style=" margin: 4px; width: 98%; text-align: right; ">
                                </div>
                                <div class="cold8" style="width:98%;">
                                     <div class="data"></div>
                                </div>
                             </div>
                          </div>` ).dialog({
                                modal: true,
                                width:'344px',
                                open:function(){

                                  $( this ).find('.data').datepicker();

                                },
                                buttons: {
                                  Ok: function() {
                                    $( this ).dialog( "close" );

                                    let salario = $( this ).find( "[name='salario']" ).val();
                                    let dt = $( this ).find('.data').datepicker( "getDate" );

                                    if((salario*1) <0 ){

                                        $( this ).find( "[name='salario']" ).addClass('required');

                                    } else {
                                      salario = (salario*1);

                                      db.insert(`tbl_salario (salario, data_cadastro, id_funcionario) VALUES ( ?, ?, ?)`,[salario, dt, funcionario.id])
                                      .then(id=>{
                                          funcionarios.efetuarPagamento(funcionario);
                                      })

                                    }

                                  }
                                }
                              });
                     }
                   }
                 });

          return;
        }
        console.log(" tbl_salario : ",salarios)
        return db.selectAll('tbl_folha_pagamento WHERE id_funcionario = ? limit 5 ',[funcionario.id]).then(folhas=>{

            let dt = new Date(salarios[0].data_cadastro);
            let data = dt.getDate()+"/"+dt.getMonth()+"/"+dt.getFullYear();

            let pagamentos = '';
            for(let pagamento of folhas){

                let dt_pagamento = new Date(pagamento.data_agendamento);

                let data_p = dt_pagamento.getDate()+"/"+dt_pagamento.getMonth()+"/"+dt_pagamento.getFullYear();

                pagamentos+= `<tr>
                                  <td>${pagamento.id_folha_pagamento}</td>
                                  <td>${data_p}</td>
                                  <td>${'R$' + pagamento.valor_final}</td>
                                  <td>${pagamento.cod_pagamento_funcionario}</td>
                              </tr>`;
            }

            let alerta = new Alert(`<form>
                                        <div class="row">
                                           <div class="cold6">
                                                <label class="row"> Nome: </label>
                                                <div class="content-icon-input cold10">
                                                    <input class="input-icone" value="${funcionario.nome}" disabled>
                                                    <span aria-hidden="true" class="icon_profile"></span>
                                                </div>
                                           </div>
                                           <div class="cold3">
                                                <label class="row"> CPF: </label>
                                                <input value="${funcionario.cpf}" disabled>
                                           </div>
                                        </div>
                                        <div class="row">
                                           <div class="cold3" style=" width: 32%; ">
                                                <label class="row"> Salario: </label>
                                                <input  style="min-width:auto;" value="${salarios[0].salario}" disabled>
                                           </div>
                                           <div class="cold1" style=" width: 22%;">
                                                <label class="row"> Dt. Modificação: </label>
                                                <input value="${data}" style="  min-width: 10px;    width: 92%; " disabled>
                                           </div>
                                           <div class="cold3" style="">
                                                <label class="row"> Cargo: </label>
                                                <input value="${funcionario.cargo.nome}" disabled>
                                           </div>
                                        </div>
                                        <div class="row">
                                           <button type='button' style=" float: right; margin-right: 16px; margin-bottom: 5px;"> Adicionar </button>
                                           <table class="padrao">
                                               <thead>
                                                   <tr>
                                                       <th>ID</th>
                                                       <th>Data</th>
                                                       <th>valor</th>
                                                       <th>cod</th>
                                                   </tr>
                                               </thead>
                                               <tbody>
                                                   ${pagamentos}
                                               </tbody>
                                           </table>
                                        </div>
                                        <div class="row"></div>
                                    </form>`);

            alerta.buttons.push({
                texto:' Pagar ',
                click:function(){
                    funcionarios.efetuarPagamento(funcionario.id);
                }
            })
            alerta.show = function(){

              alerta.janela.find('button[type="button"]').click(function(){
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
              })
            }
            alerta.view('Pagamento ' + funcionario.nome).then(html=>{}).catch(erro=>{});

        })
      });
    },
    dao:{//Funções que fazem as operações no banco
        selectAll:function(){
          return new Promise(function(resolve,reject){
            return db.selectAll("SELECT tbl_funcionario.*, tbl_cargos.id_cargo AS id_cargo, tbl_cargos.nome AS 'cargo', tbl_setor.id_setor, tbl_setor.nome AS 'setor' FROM tbl_funcionario INNER JOIN tbl_cargos ON (tbl_cargos.id_cargo = tbl_funcionario.id_cargo) INNER JOIN tbl_setor ON tbl_funcionario.id_setor = tbl_setor.id_setor WHERE tbl_funcionario.excluido = 0 GROUP BY tbl_funcionario.id_funcionario")
                  .then(resposta=>{
                    console.log(resposta);
                    let lista = [];
                    for(let funcionario of resposta){
                      lista.push({
                        id:funcionario.id_funcionario,
                        cod:funcionario.cod_funcionario,
                        nome:funcionario.nome,
                        email:funcionario.email,
                        cpf:funcionario.cpf,
                        rg:funcionario.rg,
                        telefone:funcionario.telefone,
                        cep:funcionario.cep,
                        uf:funcionario.uf,
                        logradouro:funcionario.logradouro,
                        n:funcionario.n,
                        bairro:funcionario.bairro,
                        cidade:funcionario.cidade,
                        nascimento:funcionario.dt_nacimento,
                        admissao:funcionario.admissao,
                        setor:{
                          id:funcionario.id_setor,nome:funcionario.setor
                        },
                        cargo:{
                          id:funcionario.id_cargo,nome:funcionario.cargo
                        }})
                    }
                    return resolve(lista);
                  })
          })
        },
        selectById:function(id){
          return new Promise(function(resolve,reject){
            return db.selectById("SELECT tbl_funcionario.*, tbl_cargos.id_cargo AS id_cargo, tbl_cargos.nome AS 'cargo', tbl_setor.id_setor, tbl_setor.nome AS 'setor' FROM tbl_funcionario INNER JOIN tbl_cargos ON (tbl_cargos.id_cargo = tbl_funcionario.id_cargo) INNER JOIN tbl_setor ON tbl_funcionario.id_setor = tbl_setor.id_setor WHERE tbl_funcionario.id_funcionario = ? group by tbl_funcionario.id_funcionario",[id])
                  .then(funcionario=>{

                    var fun = {
                                id:funcionario.id_funcionario,
                                cod:funcionario.cod_funcionario,
                                nome:funcionario.nome,
                                email:funcionario.email,
                                cpf:funcionario.cpf,
                                rg:funcionario.rg,
                                telefone:funcionario.telefone,
                                cep:funcionario.cep,
                                uf:funcionario.uf,
                                logradouro:funcionario.logradouro,
                                n:funcionario.n,
                                bairro:funcionario.bairro,
                                cidade:funcionario.cidade,
                                nascimento:funcionario.dt_nacimento,
                                admissao:funcionario.admissao,
                                setor:{
                                  id:funcionario.id_setor,nome:funcionario.setor
                                },
                                cargo:{
                                  id:funcionario.id_cargo,nome:funcionario.cargo
                                }
                              };
                    funcionarios.lista[fun.id] = fun;

                    return resolve(funcionarios.lista[fun.id]);
                  })
          })
        },
        insert:function(dados){
            return new Promise(function(resolve,reject){
               console.log(dados);

               let nome = dados[0].value;
               let cod = dados[1].value;
               let cpf = dados[2].value;
               let rg = dados[3].value;
               let email = dados[4].value;
               let telefone = dados[5].value;
               let cargo = dados[6].value;
               let setor = dados[7].value;
               let cep = dados[8].value;
               let uf = dados[9].value;
               let logradouro = dados[10].value;
               let n = dados[11].value;
               let bairro = dados[12].value;
               let cidade = dados[13].value;
               let nascimento = dados[14].value;
               let admissao = dados[15].value;
               console.log("B")
               return db.insert(`tbl_funcionario(nome, cpf, cod_funcionario, email, rg, dt_nacimento, cep, bairro, uf, cidade, logradouro, n, telefone, admissao, id_setor,id_cargo)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,[nome,cpf,cod,email,rg,nascimento,cep, bairro,uf,cidade,logradouro,n,telefone,admissao,setor,cargo])
                     .then(id=>{
                        return cargos.dao.vincular(id,cargo).then(()=>{
                          return funcionarios.dao.selectById(id).then(funcionario=>{
                                  return resolve(funcionario)
                                })
                        })
                     })
            })
        },
        update:function(id,dados){

            return new Promise(function(resolve,reject){

                let nome = dados[0].value;
                let cod = dados[1].value;
                let cpf = dados[2].value;
                let rg = dados[3].value;
                let email = dados[4].value;
                let telefone = dados[5].value;
                let cargo = dados[6].value;
                let setor = dados[7].value;
                let cep = dados[8].value;
                let uf = dados[9].value;
                let logradouro = dados[10].value;
                let n = dados[11].value;
                let bairro = dados[12].value;
                let cidade = dados[13].value;
                let nascimento = dados[14].value;
                let admissao = dados[15].value;
                return db.update(`tbl_funcionario SET nome = ?, cpf = ?,  cod_funcionario = ?, email = ?,
                                  rg = ?, dt_nacimento = ?, cep = ?, uf = ?, cidade = ?, bairro = ?,
                                  logradouro = ?, n = ?, telefone = ?, admissao = ?, id_setor = ? ,id_cargo = ?
                                  WHERE id_funcionario = ?`,[nome,cpf,cod,email,rg,nascimento,cep,uf,cidade,bairro,logradouro,n,telefone,admissao,setor,cargo,id])
                                  .then(()=>{
                                      return cargos.dao.vincular(id,cargo).then(()=>{
                                          return funcionarios.dao.selectById(id).then(funcionario=>{
                                              console.log("Funcionario pego : ",funcionario)
                                             return resolve(funcionario);
                                          })
                                      })
                                  })

            })
        },
        delete:function(id){
            return new Promise(function(resolve,reject){
                return db.update('tbl_funcionario SET excluido = 1 WHERE id_funcionario = ? ',[id]).then(()=>{
                    delete funcionarios.lista[id];

                    return resolve();
                })

            })
        }
    }
}
var setores = {
    lista:[
        {id:1,nome:"Administração"},
        {id:2,nome:"RH"},
        {id:3,nome:"TI"},
        {id:4,nome:"Market"}
    ],
    dao:{
      selectAll:function(){
        return new Promise(function(resolve,reject){
          return db.selectAll('tbl_setor order by nome asc ').then(function(listaS){
              let lista = [];
              for(let setor of listaS){
                lista.push({id:setor.id_setor,nome:setor.nome})
              }
              setores.lista = lista;
              return resolve(lista);
          })
        })
      },
      vincular:function(idFuncionario,idSetores){
          return new Promise(function(reesolve,reject){
            return db.insert('tbl_cargo_funcionario(id_funcionario,id_cargo)VALUES(?,?)',[idFuncionario,idSetores])
                  .then(function(){
                      resolve()
                  })
          });
      },
      insert:function(){},
      delete:function(){}
    }
}
var cargos = {
    lista:[
        {id:1,nome:"Administrador"},
        {id:2,nome:"Diretor"},
        {id:3,nome:"Gestor"},
        {id:4,nome:"Coordenador"}
    ],
    dao:{
      selectAll:function(){
        return new Promise(function(resolve,reject){
          return db.selectAll('tbl_cargos order by nome asc ').then(function(listaC){
              let lista = [];
              for(let cargo of listaC){
                lista.push({id:cargo.id_cargo,nome:cargo.nome})
              }
              cargos.lista = lista;
              return resolve(lista);
          })
        })
      },
      vincular:function(idFuncionario,idSetores){
          return new Promise(function(resolve,reject){
            return db.insert('tbl_cargo_funcionario(id_funcionario,id_cargo)VALUES(?,?)',[idFuncionario,idSetores])
                  .then(function(){
                      return  resolve()
                  })
          });
      },
      insert:function(){},
      delete:function(){}
    }
}

// Iniciando

funcionarios.init();


}catch(erro){
    console.log("Erro ",erro.toString());
}
