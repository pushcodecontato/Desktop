try{
/* Operações da tela de usuasario  */
var funcionarios = {
    
    tabela:{},
    lista:{},

    init:function(){
      let lista = [
                     {id:1,cod:'gfr534',nome:'Gil',email:'gilberto.tec@vivaldi.net',
                      cpf:'482.268.587-14',rg:'52.782.502-8',telefone:'4574-5575',cargo:{id:12,nome:'Administrador'}},
                     {id:2,cod:'kjui6543',nome:'Sandra',email:'sandra@vivaldi.net',
                      cpf:'759.837.120-20',rg:'52.792.552-7',telefone:'5858-5875',cargo:{id:16,nome:'Diretor'}},
                     {id:3,cod:'hy57845',nome:'Rafael',email:'rafael@vivaldi.net',
                      cpf:'990.772.050-04',rg:'52.782.502-8',telefone:'5245-5872',cargo:{id:18,nome:'Coordenador'}},
                     {id:4,cod:'khy5689',nome:'Alexandre',email:'alexandre@vivaldi.net',
                      cpf:'028.371.370-49',rg:'52.782.502-8',telefone:'3567-5846',cargo:{id:17,nome:'Gestor'}},
                    ];
       
      funcionarios.tabela = $('#tbl_funcionarios tbody');
      for(let usuario of lista){

           funcionarios.lista[usuario.id] = usuario;   
       
      }
       
      funcionarios.addViewAll(lista);
    },
    // Adiciona todos os funcionarios passados como paremetros a tabela
    addViewAll:function(lista){
        
        if(typeof lista == "object")lista = Object.values(lista);

        funcionarios.tabela.html('');

        for(let usuario of lista){
            funcionarios.addView(usuario);
        }

    },
    // Adiciona o usuario passados como paremetros a tabela
    addView:function(funcionario){
        let view = $(`
            <tr data-id="${funcionario.id}">
                <td>${funcionario.id}</td>
                <td>${funcionario.email}</td>
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
        
        let usuario =  {};
        if(typeof id == "object")usuario = id
        else usuario = funcionarios.lista[id];

        funcionarios.tabela.find(`tr[data-id="${usuario.id}"]`)
        .html(`
                <td>${usuario.id}</td>
                <td>${usuario.email}</td>
                <td>${usuario.cpf}</td>
                <td>3h</td>
                <td class="center">
                    <a href="javascript:funcionarios.ver(${usuario.id})"><label><i class="far fa-eye"></i>Exibir</label></a>
                    <a href="javascript:funcionarios.deletar(${usuario.id})"><label><i class="far fa-trash-alt"></i>Deletar</label></a>
                    <a href="javascript:funcionarios.editar(${usuario.id})"><label><i class="fas fa-edit"></i>Editar</label></a></td>
                </td>`);
    },
    editar:function(id){
        let usuario = {};
        // Verificado se o usuario já esta sendo psssado como parametro
        if(typeof id == "object")usuario = id
        else usuario = funcionarios.lista[id];
        
        

        let alerta = new Alert(`<form>\
                                    <div class="row">
                                       <div class="cold6">
                                            <label class="row"> Nome: </label>
                                            <div class="content-icon-input cold10">
                                                <input class="input-icone" data-model='nome' value="${usuario.nome}" >
                                                <span aria-hidden="true" class="icon_profile"></span>
                                            </div>
                                       </div>
                                       <div class="cold3">
                                            <label class="row"> CPF: </label>
                                            <input value="${usuario.cpf}"  data-model='cpf'>
                                       </div>
                                    </div>
                                    <div class="row">
                                       <div class="cold6">
                                            <label class="row"> E-mail: </label>
                                            <div class="content-icon-input cold10">
                                                <input class="input-icone" data-model='email' value="${usuario.email}"  required>
                                                <span aria-hidden="true" class="icon_mail_alt"></span>
                                            </div>
                                       </div>
                                       <div class="cold3">
                                            <label class="row"> Telefone: </label>
                                            <div class="content-icon-input">
                                                <input class="input-icone"  data-model="telefone" value="${usuario.telefone}">
                                                <span aria-hidden="true" class="icon_phone"></span>
                                            </div>
                                       </div>
                                    </div>
                                    <div class="row">
                                       <div class="cold8" style="width:81%;">
                                            <label class="row"> Senha: </label>
                                            <div class="content-icon-input cold10">
                                                <input type="password" class="input-icone" data-model="senha" required value="${usuario.nome}" >
                                                <span aria-hidden="true" class="icon_key_alt"></span>
                                            </div>
                                       </div>
                                       <div class="cold3">
                                       </div>
                                    </div>
                                </form>`);
        
        alerta.buttons.push({
            texto:'Salvar',
            click:function(){
                
                 let formulario = alerta.janela.find('form');

                 let listaDados = {};
                 
                 formulario.off('submit');

                 formulario.submit(function(event){
                    
                    event.preventDefault();
                    
                    formulario.find('input[data-model]').each(function(elm,list){
                       $(this).removeClass('required');
                       
                       if( $(this).val().slice('') <1 || typeof $(this).val() == "undefined" ){
					       $(this).addClass('required');
					       return false;
       				   }

                       listaDados[$(this).attr('data-model')] = $(this).val() || '';

                    });
                    
                    listaDados.id = usuario.id;

                    funcionarios.dao.update(listaDados).then(function(){
                        alerta.close();
                        funcionarios.updateView(usuario.id);

                    })
                    

                 })
                 
                 formulario.submit();

            }
        })
    
        alerta.view('Editar Usuario ' + usuario.nome).then(html=>{

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
                console.log("Editar chamada : ",funcionario);
                funcionarios.editar(funcionario);
            }
        })
    
        alerta.view('Usuario: ' + funcionario.nome).then(html=>{

        }).catch(erro=>{

        })
    },
    deletar:function(id){
        
        let usuario = funcionarios.lista[id];

        let alerta = new Alert(`<h1>Desejá realmente deletar <strong>${usuario.nome}</strong>?</h1>`,null,null);
        alerta.view().then(html=>{

        }).catch(erro=>{
            
        })
        .then(function(){
        
            console.log("Iniciano o delete");
            funcionarios.dao.delete(id).then(function(){
                
                funcionarios.removeView(id);

            })

        }).catch(function(janela){
            console.log("Cancelar")
        })
    },
    criar:function(){
        let alerta = new Alert(`<form>\
                                    <div class="row">
                                       <div class="cold6">
                                            <label class="row"> Nome: </label>
                                            <div class="content-icon-input cold10">
                                                <input class="input-icone" data-model='nome' placeholder="João" value>
                                                <span aria-hidden="true" class="icon_profile"></span>
                                            </div>
                                       </div>
                                       <div class="cold3">
                                            <label class="row"> CPF: </label>
                                            <input value placeholder="000.000.000-00" data-model='cpf'>
                                       </div>
                                    </div>
                                    <div class="row">
                                       <div class="cold6">
                                            <label class="row"> E-mail: </label>
                                            <div class="content-icon-input cold10">
                                                <input class="input-icone" placeholder="exemplo@mail.com" data-model='email' value required>
                                                <span aria-hidden="true" class="icon_mail_alt"></span>
                                            </div>
                                       </div>
                                       <div class="cold3">
                                            <label class="row"> Telefone: </label>
                                            <div class="content-icon-input">
                                                <input class="input-icone" placeholder="(11)4303-6889" data-model="telefone" value>
                                                <span aria-hidden="true" class="icon_phone"></span>
                                            </div>
                                       </div>
                                    </div>
                                    <div class="row">
                                       <div class="cold8" style="width:81%;">
                                            <label class="row"> Senha: </label>
                                            <div class="content-icon-input cold10">
                                                <input type="password" class="input-icone" data-model="senha" required value="asdsa" >
                                                <span aria-hidden="true" class="icon_key_alt"></span>
                                            </div>
                                       </div>
                                       <div class="cold3">
                                       </div>
                                    </div>
                                </form>`);
        
        alerta.buttons.push({
            texto:'Salvar',
            click:function(){
                
                 let formulario = alerta.janela.find('form');

                 let listaDados = {};
                 
                 formulario.off('submit');

                 formulario.submit(function(event){
                    
                    event.preventDefault();
                    
                    formulario.find('input[data-model]').each(function(elm,list){
                       $(this).removeClass('required');
                       
                       if( $(this).val().slice('') <1 || typeof $(this).val() == "undefined" ){
					       $(this).addClass('required');
					       return false;
       				   }

                       listaDados[$(this).attr('data-model')] = $(this).val() || '';

                    });
                    

                    funcionarios.dao.insert(listaDados).then(function(usuario){
                        alerta.close();
                        funcionarios.addView(usuario);

                    })
                    

                 })
                 
                 formulario.submit();

            }
        })
    
        alerta.view('Aticionar Usuario ').then(html=>{

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
                
                funcionarios.lista[dados.id].nome = dados.nome;
                funcionarios.lista[dados.id].email= dados.email;
                funcionarios.lista[dados.id].telefone = dados.telefone;
                funcionarios.lista[dados.id].cpf = dados.cpf;

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

// Iniciando

funcionarios.init();


}catch(erro){
    console.log("Erro ",erro.toString());
}