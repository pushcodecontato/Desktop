window.page = "home";

var gridMenu = function() {//Função de atualização do gridAnuncioVenda
    
    if(window.page != "home")return console.log("Não estamos na pagina home nãop alterar o grid");

    var boxGrid = document.querySelector('#MenuBox');

    var width = boxGrid.offsetWidth;

    var quantidadePorLinha = Math.round(width / 290);

    boxGrid.setAttribute("style", `grid-template-columns: repeat(${quantidadePorLinha},220px);`);
}

defineWidths.observers.push(gridMenu);

gridMenu();


$('#MenuBox').sortable();

function defineImgUser(imagem){
    let input  = $('<input type="file">');


    input.on('change',function(){ 

          let file = this.files[0];

          var reader = new FileReader();

          reader.readAsDataURL(file);

          reader.onload = function () {
           console.log(" BASE64 ",reader.result);
           //console.log(" Tammnho",reader.result.toString().length);
           $(imagem).attr('src',reader.result);

          };

          reader.onerror = function() {

          }

    })

    input.click();
}