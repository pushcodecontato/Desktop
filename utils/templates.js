const { Menu } =  require('electron');

module.exports = {
    genIconMenu(win){
      return Menu.buildFromTemplate([
          {label:'Sair',click:win.send('close')},
          {label:'',type:'separator'},
          {label:'Configurar',click:win.send('close')},
        ])
    },
    genAppMenu(app){
          let menu =[{
            label:"MobiShare",
            submenu:[
              {label:'preferencias'},
              {label:'configurações'},
              {label:'sair',click:app.quit},
            ]
          }]
        if(process.platform == 'darwin')menu.unshift({label:app.getName(),
          submenu:[{label:'sair',click:app.quit}]});//Verifica se é o MacOS
        else
          menu;
        return Menu.buildFromTemplate(menu);
    }

}
