try{
window.$ = window.jquery = require("jQuery");
const Swal = require('sweetalert2');
}catch(e){
    console.log("Erro ao pegar as Dependencias",e);
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



function alertar(html,sucesso, falha){
    this.html = html;
    this.sucesso = sucesso;
    this.falha = falha;
    this.view = function(){
        return new Promise(function(resolve,reject){
            
            var conteudo = (this.html)?this.html:'<p> Deseja proceder? </p>';
            var titulo = (this.titulo)?this.titulo:'Atenção';
            var janela = $(`<div class="alert">
                                <div class="titulo">Atenção</div>
                                <div class="conteudo-html">
                                    ${conteudo}
                                </div>
                                <div class="actions">
                                    
                                </div>
                            </div>`);

            if(this.sucesso){
                var btnConfirm = $('<button class="btnConfirm">  OK </button>');
                btnConfirm.click(function(){
                    resolve();
                    janela.empty();
                    $('#container').removeClass('active');
                })
                janela.find('div.actions').append(btnConfirm);
            }
            if(this.falha){
                var btnCancel = $('<button class="btnCancel">  Cancelar </button>');
                btnCancel.click(function(){
                    reject();
                    janela.empty();
                    $('#container').removeClass('active');
                })
                janela.find('div.actions').append(btnCancel);
            }
            $('#container').addClass('active');
            $('#container').append(janela);
            
        })
    }
}

/* Desenvolvendo  codigo desnecessario!! Não apagar 
var  widthPainel = function(){
    var painel = document.querySelector('#painel');

    var width = document.querySelector('body').offsetWidth;
    
    var widthMenu = document.querySelector('nav[role="menu"]').offsetWidth;

    var tamanho = (width - widthMenu)-1;
    
    console.log(" Width Body : ", width);
    console.log(" Width Menu : ", widthMenu);
    console.log(" tamanho Geral : ",tamanho);

    painel.style.width = tamanho + 'px';


}
defineWidths.observers.push(widthPainel);
widthPainel();*/

