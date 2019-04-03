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