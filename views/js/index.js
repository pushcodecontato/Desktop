try{
  window.$ = window.jquery = require("jQuery");
  require("jquery-ui");
  const Swal = require('sweetalert2');
}catch(erro){
  console.log("Erro : ",erro.toString());
}
/* Atenção essa função cuida do redimensionamento da tela  e dos defineWidths*/
var defineWidths = {};
defineWidths = {
    observers:[],
    init:function(){
        window.onresize = function(){// Evento de redimendionar a tela
            
            if(defineWidths.observers.length < 1)return console.log("Não existe nada!!",);

            console.log(" Existe algo!! ");
            defineWidths.observers.forEach(function(observe){
                observe();
            });

        }
    }
}

defineWidths.init();


function getTbl(tabela){
    
    console.log("Tabela : ",tabela);

    if(!tabela)return false;




    //$('#painel')
    
    window.page = tabela;

// Parei aqui
    /*  background-image: url(img/load.gif);
        background-position: center;
        background-repeat: no-repeat;
    */
    var painel = $('#painel');
    var html = painel.html();

    painel.css({
        'background-image':'url("img/load.gif")',
        'background-position':'center',
        'background-size':'none',
        'background-repeat':'no-repeat'});
    
    painel.load(tabela+".html",function(response, status, xhr){
        


        if(status == "error"){
            painel.html('');
            painel.css({
                              'background-image':'url("img/error.png")',
                              });
            setTimeout(function(){
                painel.html(html);
                painel.css({'background-image':'none'});
            },7000)
            
        }else{
            window.page = tabela;
            painel.css({'background-image':'none'});
        }
        
    });

}


/* Alert Padrão */
/*
 * Metodos:
 * close() = fecha a janela
 * html = conteudo
 * falha = callback de falha
 * sucesso = callback de sucesso
 * view() = função que mostra o alert na tela 
 *           retorna um primise de then para sucesso(Executa tambem o callback)
 *           e catch para falha(Executa tambem o callback)
 */
function Alert(html,sucesso, falha){
try{
    this.html       = html;
    this.sucesso    = sucesso;
    this.falha      = falha;
    this.buttons    = [];
    this.janela;
    this.container;
    this.close      = function(){
        try{
            this.container.empty(this.janela);
            this.container.removeClass('active');
            return true;
        }catch(erro){
            console.log("Erro : ",erro);
            return false;
        }

    }
    this.view       = function(titulo){

        var ctx = this;
        console.log("Titulo passado : ",titulo);
        console.log("Titulo no objeto : ",this.titulo);
        return new Promise(function(resolve,reject){
            try{

                ctx.container = $('#container');
                var conteudo = (ctx.html)?ctx.html:'<p> Deseja proceder? </p>';

                // Define o titulo do alerta
                if(ctx.titulo || titulo){

                    titulo = (ctx.titulo)? ctx.titulo: titulo;

                }else titulo = 'Atenção';

                ctx.janela = $(`<div class="alert">
                                    <div class="titulo">${titulo}</div>
                                    <div class="close">
                                        <i class="fas fa-power-off"></i>
                                    </div>
                                    <div class="conteudo-html">
                                        ${conteudo}
                                    </div>
                                    <div class="actions">

                                    </div>
                                </div>`);
                if(typeof ctx.falha != "undefined"){

                    var btnCancel = $('<button class="btnCancel">  Cancelar </button>');
                    btnCancel.click(function(){
                        try{
                            let html = ctx.janela.html();
                            ctx.close();
                            if(typeof ctx.falha == "function")ctx.falha(html);//Promise e callback
                            if(typeof reject == "function")reject(html);
                            

                        }catch(erro){
                            console.log("Erro : ",erro.toString());
                        }
                    })
                    ctx.janela.find('.actions').append(btnCancel);
                }

                if(typeof ctx.sucesso != "undefined"){

                    var btnConfirm = $('<button class="btnConfirm">  OK </button>');
                    btnConfirm.click(function(){
                        try{
                            
                            let html = ctx.janela.html();
                            ctx.close();
                            if(typeof ctx.sucesso == "function")ctx.sucesso(html);//Promise e callback
                            if(typeof resolve == "function")resolve(html);

                        }catch(erro){
                            console.log("Erro : ",erro.toString());
                        }
                    })
                    ctx.janela.find('.actions').append(btnConfirm);
                }
                if(typeof ctx.sucesso == "undefined" && typeof ctx.falha == "undefined"){
                    console.log("Pegando vetor");
                    ctx.buttons.forEach(function(btn){

                        var botao = $(`<button class="btnConfirm"> ${btn.texto || btn.text} </button>`);
                        
                        botao.click(btn.click);
                        console.log("Adicionando!!",botao);
                        ctx.janela.find('.actions').append(botao);

                    });
                }
                ctx.janela.find('.close i').click(function(){
                    ctx.close();
                    if(typeof ctx.falha == "function")ctx.falha();//Promise e callback
                });

                ctx.container.addClass('active');
                ctx.container.append(ctx.janela);

            }catch(error){
                console.log("Erro!!",error.toString());
            }
            ctx.janela.draggable();//tornando os alertas arrastaveis;

        })
    }

}catch(erro){
    console.log("Erro : ",erro.toString());
}
}
