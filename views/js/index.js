try{
  window.$ = window.jquery = require("jQuery");
  require("jquery-ui");
  window.md5 = require('md5');
}catch(erro){
  console.log("Erro : ",erro.toString());
}
/* Atenção essa função cuida do redimensionamento da tela  e dos defineWidths*/
var defineWidths = {};
defineWidths = {
    observers:[],
    init:function(){
        window.onresize = function(){// Evento de redimendionar a tela

            if(defineWidths.observers.length < 1)return console.log("Não existe nada!!");

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
    this.show       = function(){};
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

                    ctx.buttons.forEach(function(btn){

                        var botao = $(`<button class="btnConfirm"> ${btn.texto || btn.text} </button>`);

                        botao.click(btn.click);

                        ctx.janela.find('.actions').append(botao);

                    });
                }
                ctx.janela.find('.close i').click(function(){
                    ctx.close();
                    if(typeof ctx.falha == "function")ctx.falha();//Promise e callback
                });

                ctx.container.addClass('active');
                ctx.container.append(ctx.janela);

                /* Cuida das mascaras tel e cpf */
                if(ctx.janela.find('[name="cpf"]')[0]){
                  require('jquery-mask-plugin');
                  jQuery(ctx.janela.find('input[name="cpf"]')).mask('999.999.99-99');
                  jQuery(ctx.janela.find('input[name="telefone"]')).mask('(99)9999-9999');
                }

                ctx.show();// chAMANDO CALLBACK PAR AQUANDO O FORMUALRIO E VISTO

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
/* Area dos compomentes jquery-ui custom  e modulos que são carregados depois do carregamento do dom */
document.addEventListener('DOMContentLoaded', () => {

    $.widget( "custom.combobox", {
      _create: function() {
        this.wrapper = $( "<span>" )
          .addClass( "custom-combobox" )
          .insertAfter( this.element );

        this.element.hide();
        this._createAutocomplete();
        this._createShowAllButton();
      },

      _createAutocomplete: function() {
        var selected = this.element.children( ":selected" ),
          value = selected.val() ? selected.text() : "";

        this.input = $( "<input>" )
          .appendTo( this.wrapper )
          .val( value )
          .attr( "title", "" )
          .css({"min-width":"414px","padding-left" :"22px"})
          .addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
          .autocomplete({
            delay: 0,
            minLength: 0,
            source: $.proxy( this, "_source" )
          })
          .tooltip({
            classes: {
              "ui-tooltip": "ui-state-highlight"
            }
          });

        this._on( this.input, {
          autocompleteselect: function( event, ui ) {
            ui.item.option.selected = true;
            this._trigger( "select", event, {
              item: ui.item.option
            });
          },

          autocompletechange: "_removeIfInvalid"
        });
      },

      _createShowAllButton: function() {
        var input = this.input,
          wasOpen = false;

        $( "<a>" )
          .css('min-height','25px')
          .attr( "tabIndex", -1 )
          .attr( "title", "Show All Items" )
          .tooltip()
          .appendTo( this.wrapper )
          .button({
            icons: {
              primary: "ui-icon-triangle-1-s"
            },
            text: false
          })
          .removeClass( "ui-corner-all" )
          .addClass( "custom-combobox-toggle ui-corner-right" )
          .on( "mousedown", function() {
            wasOpen = input.autocomplete( "widget" ).is( ":visible" );
          })
          .on( "click", function() {
            input.trigger( "focus" );

            // Close if already visible
            if ( wasOpen ) {
              return;
            }

            // Pass empty string as value to search for, displaying all results
            input.autocomplete( "search", "" );
          });
      },

      _source: function( request, response ) {
        var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
        response( this.element.children( "option" ).map(function() {
          var text = $( this ).text();
          if ( this.value && ( !request.term || matcher.test(text) ) )
            return {
              label: text,
              value: text,
              option: this
            };
        }) );
      },

      _removeIfInvalid: function( event, ui ) {

        // Selected an item, nothing to do
        if ( ui.item ) {
          return;
        }

        // Search for a match (case-insensitive)
        var value = this.input.val(),
          valueLowerCase = value.toLowerCase(),
          valid = false;
        this.element.children( "option" ).each(function() {
          if ( $( this ).text().toLowerCase() === valueLowerCase ) {
            this.selected = valid = true;
            return false;
          }
        });

        // Found a match, nothing to do
        if ( valid ) {
          return;
        }

        // Remove invalid value
        this.input
          .val( "" )
          .attr( "title", value + "!Não encontrado" )
          .tooltip( "open" );
        this.element.val( "" );
        this._delay(function() {
          this.input.tooltip( "close" ).attr( "title", "" );
        }, 2500 );
        this.input.autocomplete( "instance" ).term = "";
      },

      _destroy: function() {
        this.wrapper.remove();
        this.element.show();
      }
   });
});


/* Polifil reduce */
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function(callback /*, valorInicial*/) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.reduce chamado é nulo (null) ou indefinido (undefined)');
    }
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' não é uma função')
    }
    var t = Object(this), len = t.length >>> 0, k = 0, value;
    if (arguments.length == 2) {
      value = arguments[1];
    } else {
      while (k < len && !(k in t)) {
        k++;
      }
      if (k >= len) {
        throw new TypeError('Reduce possui um array vazio sem um valor inicial');
      }
      value = t[k++];
    }
    for (; k < len; k++) {
      if (k in t) {
        value = callback(value, t[k], k, t);
      }
    }
    return value;
  };
}
/* Polifils Object.keys */
const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
const concat = Function.bind.call(Function.call, Array.prototype.concat);
const keys = Reflect.ownKeys;

if (!Object.values) {
	Object.values = function values(O) {
		return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), []);
	};
}

if (!Object.entries) {
	Object.entries = function entries(O) {
		return reduce(keys(O), (e, k) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []), []);
	};
}
