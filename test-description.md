# KLAB DESAFIO REACT

### Introdução

Antes de começarmos a falar do desafio, gostaria de agradecer
por ter reservado seu tempo para execução deste desafio.

### Sobre as tarefas e commits

Toda a atividade executada deve ter seu respectivo commit
seguindo o padrão KLAB-XXXX onde XXXX é atividade.

### Instruções de entrega do teste

Deve ser criado um repositório aqui no github privado e compartilhar comigo (alexandresebrao)
Entrega 3 Dias

### Exigências do teste

- Ser feito utilizado o NextJS como base
- Mostrar o dominio de uso de componentes
- Mostrar a capacidade de interação com o backend e frontend

### KLAB-0001 Pesquisar por CEP

- Criar um input onde devo digitar o CEP ou colar, exibir no input já formatado (Ex: xx.xxx-xxx)
- Consultar uma api no backend do nextjs e retornar os dados (Sugestão: Utilizar o viacep.com.br)

### KLAB-0002 Exibir informações Meteorológicas

- Agora que temos o endereço, deve-se exibir as informações Meteorológicas da cidade
- https://developer.accuweather.com/ (Este exemplo de API pode ser utilizado, ele tem um teste de 50 chamadas por dia)
- As regras da atividade continuam valendo

### KLAB-0003 Persistência de sessão

- Utilizar-se de cookies (não pode ser LocalStorage) para armazenar dados das consultas de cep e exibir na tela separada
- Deve-se exibir uma tabela com os seguintes cabeçalhos (Hora da Consulta, CEP, cidade, estado e temperatura)
- Deve-se exibir os ultimos 10 registros (e caso uma nova consulta, o ultimo deve ser destartado)
- Caso um mesmo CEP seja reconsultado e esteja na lista, ele deve ser atualizado.
- Devo ser capaz de ordenar por qualquer uma das colunas.
- Lembre-se não devo consultar a api para esta consulta em nenhum momento, devo trazer os valores do que já foram retornados.

### KLAB-004 Estilização e responsividade

- O site deve ter um estilo agradavel (Preferência Tailwind)
- Deve ser responsivo (mobile, tablets, e pc)
