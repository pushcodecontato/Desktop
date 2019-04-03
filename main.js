const path     =  require('path');

//const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
const { app, BrowserWindow, ipcMain, Tray, Menu } =  require('electron');
const templates = require('./utils/templates');

let main;/* Janela Principal */
let windows = {};/* Janelas Ativas  */
let tray = null;/* Tray Icon = icone de de notificação no canto inferior direito */

app.on('ready',function(){
  main = new BrowserWindow({ //Janela Principal
      title:' MobiShare ',
      width:900,
      height:600,
      minWidth:500,
      minHeight:500,
      icon:path.join(__dirname,'images/icons/icon.png'),
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
        preload: __dirname + '/views/renderer.js',
    }
  })

  main.loadURL(`file://${__dirname}/views/home.html`);
  main.on('ready-to-show',()=>main.show())
  main.on('close',()=>{
      main = null;
      app.quit();
  });

  tray = new Tray(path.join(__dirname,'images/icons/icon.png'));// Definindo o Icon de notificação

  tray.setContextMenu(templates.genIconMenu(main));// Pegando o menu do icone de notificação

  Menu.setApplicationMenu(templates.genAppMenu(app));

  main.webContents.openDevTools()

  //main.setOverlayIcon(path.join(__dirname,'images/icon.png'), "Hellow")
})
app.on('window-all-close',()=>{
  app.quit();
})

ipcMain.on('openWindow',(event,page,data)=>{
  if(page in windows)windows[page] = null;// Destruindo janelas anteriormente criada
  /* Iniciando ou reiniciando Janela e armazenando a sua instancia nas windows */
  windows[page] = new BrowserWindow({
    width:900,
    height:700,
  })
  windows[page].loadURL(`file://${__dirname}/views/${page}`)
  windows[page].on('close',()=>windows[page]=null);
  windows[page].send('init')
  windows[page].once('ready-to-show', () => {//Evita flash no carregamento da pagina
    windows[page].show()// Exibindo a pagina já carregada
  })
})


var fs = require('fs');
var pdf = require('html-pdf');
var options = { format: 'Letter' };

/* Iniciando teste genPdf */
ipcMain.on('genPDF',(event,pdfHtml)=>{
  var evento = event;
	console.log("chegou na geração do pdf");
	pdf.create(pdfHtml.html, options)
	.toFile('./'+pdfHtml.nome, function(err, caminho) {

	  if(!caminho) return console.error(err);

	  console.log("Caminho : ",caminho); // { filename: '/app/businesscard.pdf' }

    evento.sender.send('genPdf-complite',caminho);

	});

})
