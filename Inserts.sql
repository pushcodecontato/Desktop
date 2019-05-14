SELECT * FROM tbl_usuario_desktop;
SELECT * FROM tbl_usuario_desktop_permissoes;
SELECT * FROM tbl_permissoes;
SELECT p.*,if(udp.id_permicoes is null ,'','selected') as selecionado FROM
 tbl_permissoes p left join tbl_usuario_desktop_permissoes udp on p.id_permissoes = udp.id_permicoes AND udp.id_usuario_desktop = 2;
/*
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
"fas fa-shopping-cart", "javascript:getTbl('bancaria')");*/


SELECT * FROM tbl_usuario_desktop;
SELECT * FROM tbl_usuario_desktop_permissoes;

UPDATE tbl_usuario_desktop SET  excluido = 0 WHERE id_usuario_desktop = 1;

DELETE FROM tbl_permissoes WHERE id_permissoes in (7,8,9,10,11,12);

SELECT tbl_funcionario.*, MAX(cf.id_cargo) as id_cargo ,
MAX(tbl_cargos.nome) as 'cargo', tbl_setor.id_setor, tbl_setor.nome as 'setor'
FROM tbl_funcionario 
inner join ( SELECT * FROM tbl_cargo_funcionario order by tbl_cargo_funcionario.id_cargo_funcionario  desc ) as cf on (tbl_funcionario.id_funcionario = cf.id_funcionario) 
inner join tbl_cargos on (tbl_cargo_funcionario.id_cargo = tbl_cargos.id_cargo)
inner join tbl_setor on tbl_funcionario.id_setor = tbl_setor.id_setor 
WHERE tbl_funcionario.excluido = 0 group by tbl_funcionario.id_funcionario;