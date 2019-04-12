try{
/* Operações da tela de usuasario  */
var funcionarios = {
    
    tabela:{},
    lista:{},

    init:function(){
      let lista = [
                     {id:1,cod:'gfr534',nome:'Claudio',email:'ramos@mail.com',cpf:'482.268.587-14',rg:'52.782.502-8',
                      telefone:'4574-5575',setor:{id:1,nome:"Administração"},cargo:{id:1,nome:'Administrador'} },

                     {id:2,cod:'kjui6543',nome:'Sandra',email:'sandra@vivaldi.net',cpf:'759.837.120-20',rg:'52.792.552-7',
                      telefone:'5858-5875',setor:{id:2,nome:"RH"},cargo:{id:2,nome:'Diretor'} },

                     {id:3,cod:'hy57845',nome:'Rafael',email:'rafael@vivaldi.net',cpf:'990.772.050-04',rg:'52.782.502-8',
                      telefone:'5245-5872',setor:{id:1,nome:"Administração"},cargo:{id:4,nome:'Coordenador'} },

                     {id:4,cod:'khy5689',nome:'Alexandre',email:'alexandre@vivaldi.net',cpf:'028.371.370-49',rg:'52.782.502-8',
                      telefone:'3567-5846',setor:{id:3,nome:"TI"},cargo:{id:3,nome:'Gestor'} },
                  ];
       
      
      funcionarios.tabela = $('#tbl_funcionarios tbody');

      for(let funcionario of lista){

           funcionarios.lista[funcionario.id] = funcionario;   
       
      }
       
      funcionarios.addViewAll(lista);
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


         /* Adicionando options nos slc */
        for(let cargo of cargos.lista){

            if(cargo.id == funcionario.cargo.id)slcCargo.append(`<option value="${cargo.id}" selected>${cargo.nome}</option>`);
            else slcCargo.append(`<option value="${cargo.id}">${cargo.nome}</option>`);
        
        }

        for(let setor of setores.lista){
            if(setor.id == funcionario.setor.id)slcSetor.append(`<option value="${setor.id}" selected>${setor.nome}</option>`);
            else slcSetor.append(`<option value="${setor.id}">${setor.nome}</option>`);
        }

        let alerta = new Alert(`<form>\
                                    <div class="row">
                                       <div class="cold6">
                                            <label class="row"> Nome: </label>
                                            <div class="content-icon-input cold10">
                                                <input class="input-icone" name='nome' value="${funcionario.nome}" required>
                                                <span aria-hidden="true" class="icon_profile"></span>
                                            </div>
                                       </div>
                                       <div class="cold3">
                                            <label class="row"> Cod: </label>
                                            <input value="${funcionario.cod}"  name='cod' required>
                                       </div>
                                    </div>
                                    <div class="row">
                                       <div class="cold6">
                                            <label class="row"> CPF: </label>
                                            <input name='cpf' style=" width: 303px; " value="${funcionario.cpf}"  required>
                                       </div>
                                       <div class="cold3">
                                            <label class="row"> RG: </label>
                                            <input name='rg' value="${funcionario.rg}"  required>
                                       </div>
                                    </div>
                                    <div class="row">
                                       <div class="cold6">
                                            <label class="row"> E-mail: </label>
                                            <div class="content-icon-input cold10">
                                                <input class="input-icone" name='email' value="${funcionario.email}"  required>
                                                <span aria-hidden="true" class="icon_mail_alt"></span>
                                            </div>
                                       </div>
                                       <div class="cold3">
                                            <label class="row"> Telefone: </label>
                                            <div class="content-icon-input">
                                                <input class="input-icone"  name="telefone" value="${funcionario.telefone}" required>
                                                <span aria-hidden="true" class="icon_phone"></span>
                                            </div>
                                       </div>
                                    </div>
                                    <div class="row">
                                       <div class="cold8" style="width:81%;">
                                            <label class="row"> Cargo: </label>
                                            <div class="content-icon-input cold10">
                                                <select  class="input-icone" name="cargo" required>
                                                    ${slcCargo.html()}
                                                </select>
                                                <span aria-hidden="true" class="icon_toolbox"></span>
                                            </div>
                                            <span style="font-size: 1.9em; position: relative; margin-top: 0px; color: #2d2; display: inline-block" aria-hidden="true" class="icon_plus_alt"></span>
                                       </div>
                                    </div>
                                    <div class="row">
                                       <div class="cold8" style="width:81%;">
                                            <label class="row"> Setor: </label>
                                            <div class="content-icon-input cold10">
                                                <select  class="input-icone" name="setor" required>
                                                    ${slcSetor.html()}
                                                </select>
                                                <span aria-hidden="true" class="icon_contacts"></span>
                                            </div>
                                            <span style="font-size: 1.9em; position: relative; margin-top: 0px; color: #2d2; display: inline-block" aria-hidden="true" class="icon_plus_alt"></span>
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

                 formulario.submit(function(event){
                    
                    event.preventDefault();

                    // Inputs
                    formulario.find('input[name]').each(function(){

                       listaDados[$(this).attr('name')] = $(this).val() || '';

                    });

                    // SELECT's
                    formulario.find('select[name]').each(function(elm,list){

                       let id = $(this).val();

                       let nome= $(this).find('option[value="' + id + '"]').html();

                       listaDados[$(this).attr('name')] = {
                           id,nome
                       };

                    });
                    
                    listaDados.id = funcionario.id;
                    

                    funcionarios.dao.update(listaDados).then(function(){
                        alerta.close();
                        funcionarios.updateView(funcionario.id);

                    })
                    

                 })
                 
                 btnSubmit.click();

            }
        })

        alerta.show = ()=>{
            // Usando o jquery ui para criar a combobox
            alerta.janela.find("[name='cargo']").combobox();
            alerta.janela.find("[name='setor']").combobox();
        }
    
        alerta.view('Editar funcionario ' + funcionario.nome).then(html=>{

        }).catch(erro=>{
            
        })
    },
    ver:function(id){
        
        let funcionario = funcionarios.lista[id];

        let alerta = new Alert(`<form>\
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

        let alerta = new Alert(`<h1>Desejá realmente deletar <strong>${funcionario.nome}</strong>?</h1>`,null,null);
        alerta.view().then(html=>{

        }).catch(erro=>{
            
        })
        .then(function(){
        

            funcionarios.dao.delete(id).then(function(){
                
                funcionarios.removeView(id);

            })

        }).catch(function(janela){
            console.log("Cancelar")
        })
    },
    criar:function(){

        let slcCargo = $('<select  class="input-icone" name="cargo" required></select>');
        let slcSetor = $('<select  class="input-icone" name="setor" required></select>');


         /* Adicionando options nos slc */
        for(let cargo of cargos.lista){

           slcCargo.append(`<option value="${cargo.id}">${cargo.nome}</option>`);
        
        }

        for(let setor of setores.lista){
            
            slcSetor.append(`<option value="${setor.id}">${setor.nome}</option>`);
        
        }

        let alerta = new Alert(`<form>\
                                    <div class="row">
                                       <div class="cold6">
                                            <label class="row"> Nome: </label>
                                            <div class="content-icon-input cold10">
                                                <input class="input-icone" placeholder="Guilherme Luiz Gomes" name='nome'  required>
                                                <span aria-hidden="true" class="icon_profile"></span>
                                            </div>
                                       </div>
                                       <div class="cold3">
                                            <label class="row"> Cod: </label>
                                            <input name='cod' placeholder="f3434" required>
                                       </div>
                                    </div>
                                    <div class="row">
                                       <div class="cold6">
                                            <label class="row"> CPF: </label>
                                            <input name='cpf' style=" width: 303px; "  placeholder="603.427.162-20" required>
                                       </div>
                                       <div class="cold3">
                                            <label class="row"> RG: </label>
                                            <input name='rg' placeholder="35.948.004-4" required>
                                       </div>
                                    </div>
                                    <div class="row">
                                       <div class="cold6">
                                            <label class="row"> E-mail: </label>
                                            <div class="content-icon-input cold10">
                                                <input class="input-icone" placeholder="gguilhermeluizgomes@ceviu.com.br" name='email' required>
                                                <span aria-hidden="true" class="icon_mail_alt"></span>
                                            </div>
                                       </div>
                                       <div class="cold3">
                                            <label class="row"> Telefone: </label>
                                            <div class="content-icon-input">
                                                <input class="input-icone" placeholder="(15) 2834-3718" name="telefone" required>
                                                <span aria-hidden="true" class="icon_phone"></span>
                                            </div>
                                       </div>
                                    </div>
                                    <div class="row">
                                       <div class="cold8" style="width:81%;">
                                            <label class="row"> Cargo: </label>
                                            <div class="content-icon-input cold10">
                                                <select  class="input-icone" name="cargo" required>
                                                   ${slcCargo.html()}
                                                </select>
                                                <span aria-hidden="true" class="icon_toolbox"></span>
                                            </div>
                                            <span style="font-size: 1.9em; position: relative; margin-top: 0px; color: #2d2; display: inline-block" aria-hidden="true" class="icon_plus_alt"></span>
                                       </div>
                                    </div>
                                    <div class="row">
                                       <div class="cold8" style="width:81%;">
                                            <label class="row"> Setor: </label>
                                            <div class="content-icon-input cold10">
                                                <select  class="input-icone" name="setor" required>
                                                   ${slcSetor.html()}
                                                </select>
                                                <span aria-hidden="true" class="icon_contacts"></span>
                                            </div>
                                            <span style="font-size: 1.9em; position: relative; margin-top: 0px; color: #2d2; display: inline-block" aria-hidden="true" class="icon_plus_alt"></span>
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

                 formulario.submit(function(event){
                    
                    event.preventDefault();

                    // Inputs
                    formulario.find('input[name]').each(function(){

                       listaDados[$(this).attr('name')] = $(this).val() || '';

                    });
                    // SELECT's
                    formulario.find('select[name]').each(function(elm,list){

                       let id = $(this).val();

                       let nome= $(this).find('option[value="' + id + '"]').html();

                       listaDados[$(this).attr('name')] = {
                           id,nome
                       };

                    });
                    

                    funcionarios.dao.insert(listaDados).then(function(funcionario){
                        alerta.close();
                        funcionarios.addView(funcionario);
                    })
                    

                 })
                 
                 btnSubmit.click();

            }
        })

        alerta.show = ()=>{
            // Usando o jquery ui para criar a combobox
            alerta.janela.find("[name='cargo']").combobox();
            alerta.janela.find("[name='setor']").combobox();
        }
    
        alerta.view('Adicionar funcionario ').then(html=>{

        }).catch(erro=>{
            
        })
    },
    dao:{//Funções que fazem as operações no banco
        insert:function(dados){
            return new Promise(function(resolve,reject){
                let id = 574;
                do{

                    id = (Math.random()*13 + Math.random()*13).toFixed(0)*1;
                
                }while(id in funcionarios.lista)// Gera um id Aleatorio que não exista no array

                dados.id = id;

                funcionarios.lista[dados.id] = dados;


                resolve(dados);
            })
        },
        update:function(dados){
            
            return new Promise(function(resolve,reject){
                
                funcionarios.lista[dados.id].nome   = dados.nome;
                funcionarios.lista[dados.id].email  = dados.email;
                funcionarios.lista[dados.id].telefone = dados.telefone;
                funcionarios.lista[dados.id].cpf    = dados.cpf;
                funcionarios.lista[dados.id].cargo  = dados.cargo;
                funcionarios.lista[dados.id].setor  = dados.setor;

                resolve(funcionarios.lista[dados.id]);

            })
        },
        delete:function(id){
            return new Promise(function(resolve,reject){
                
                delete funcionarios.lista[id];

                resolve();

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
    ]
}
var cargos = {
    lista:[
        {id:1,nome:"Administrador"},
        {id:2,nome:"Diretor"},
        {id:3,nome:"Gestor"},
        {id:4,nome:"Coordenador"}
    ]
}

// Iniciando

funcionarios.init();


}catch(erro){
    console.log("Erro ",erro.toString());
}