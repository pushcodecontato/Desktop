var auth = {

    login:function(form){

      event.preventDefault();

      let login = form.find('input[name="login"]');

      let senha = form.find('input[name="senha"]');

      login.selectUserByLogin(login).then(resultado=>{

      })

    },
    selectUserByLogin:function(login){
      return new Promise((resolve,reject)=>{
          let validaEmail = /^([a-z.1-9]+@[a-z]*.*)+$/;

          let sql = 'SELECT * FROM tbl_usuario_desktop WHERE ';
          let prepared = [login.val().toString()];

          if(validaEmail.test(login.val())){
            sql += ` email like  ? `;
          } else {
            sql += ` cpf like  ? `;
          }
          return db.selectById(sql,prepared)
          .then(usuario=>{
              if(usuario){
                console.log("te encontrei!!! :D ",sql);
              }else{
                console.log("Não te encontrei!!! :c ",sql);
              }
          })
      })

    }

}
