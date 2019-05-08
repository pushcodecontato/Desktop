INSERT INTO tbl_permissoes (nome, titulo, descricao, icone, href)
VALUES
("Usuários", "Usuários",
"Controla os Usuario do sistema e suas atribuições",
"far fa-user", "javascript:getTbl('usuario')"),

("Funcionários", "Funcionários",
"Controla os Funionarios incluindo seus salarios, setores e etc..",
"fas fa-briefcase", "javascript:getTbl('funcionario')"),

("Conta a Receber", "C. Receber",
"Controla as contas a Receber da empresa",
"fas fa-cash-register", "javascript:getTbl('conta_receber')"),

("Conta a Pagar", "C. Pagar",
"Controla as contas a Pagar da empresa",
"fas fa-money-check", "javascript:getTbl('conta_pagar')"),

("Conciliação Bancaria", "C. Bancaria",
"Controla as contas a Pagar da empresa",
"fas fa-tasks", "javascript:getTbl('bancaria')"),

("Pedidos", "Pedidos",
"Controla e criar os Pedidos de compra da empresa",
"fas fa-shopping-cart", "javascript:getTbl('bancaria')")


