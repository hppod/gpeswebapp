# GPES API

Log de alterações da aplicação

### Versão 5.0
* **Processo Seletivo:** Implementado o módulo de Processo Seletivo, os componentes de listar todos e criar,também o validador de título unico e alterações nos arquivos de rotas e módulos para acessar os componentes.
* **Integrantes:** Implementado o módulo de Integrantes, os componentes de listar todos e criar,também o validador de nome unico e alterações nos arquivos de rotas e módulos para acessar os componentes.
* **Publicações:** Refatorando o módulo de Portal-Transparencia para Publicações, o componente de listar todos e criar, validator de título único e alterações nos arquivos de rotas e
módulos para acessar os componentes. Também foi alterado o nome das pastas detalhes-transparencia e atualizar-transparencia para detalhes-publicacoes e atualizar-publicacoes.
* **Eventos:** Refatorando o módulo de notícias para Eventos, o componente de listar todos e criar, validator de título único e alterações nos arquivos de rotas e módulos para acessar os componentes.
* **Sobre:** Implementando módulo Sobre, metodo create e listar todos e validators.


### Versão 5.1
* **Processo Seletivo:** Implementado o componente para visualizar os detalhes do processo seletivo e alteração do arquivo da service para adicionar a chamada ao método que faz a busca pelo título na API.
* **Publicações:** Padronizado mensagens nos toastr e nomeação de variáveis e componente, removido console.log desnecessário e adicionando campos autores, plataforma, cidade e dataPublicacao ao modelo de publicações e no componente create-publicação, implementado o componente para visualizar os detalhes da publicação e implementado filtro por categoria na listagem de publicações com alterações nos parâmetros de ordenação de Postado em.
* **Categorias:** Ajustado campo recebido da API e removido console.log desnecessário.
* **Eventos:** Padronizado mensagens nos toastr e nomeação de variáveis e componente, problema de exibição de data errada foi corrigda, adicionando o campo de data no visualizar eventos.
* **Integrantes:** Correção no problema de data inicial e final, adição do campo lattes na criação de integrantes.
* **Sobre:** Padronizado mensagens nos toastr e nomeação de variáveis e componente, removido console.log desnecessários. Fazendo com que o campo ordenação receba o total de registros +1.  
* **Processo Seletivo:** Implementado reordenação via modal no componente.
* **Integrantes:** Adição do metodo getIntegranteByName.
* **Sobre:** Implementado método de exibição de detalhes de um registro ao clicar e configurando para exibição no painel administrativo.


### Versão 5.2
* **Processo Seletivo:** Implementado componenete que atualiza as informações de processo seletivo e alteração do arquivo da service para adicionar a chamada ao método que faz a atualização na API.
* **Processo Seletivo:** Implementado componenete que deleta o registro e alteração do arquivo da service para adicionar a chamada ao método que faz a exclusão na API.
* **Processo Seletivo:** Implementado componenete e módulo para exibir todos os registros no institucional (web-app).
* **Delete FAQ:** Remoção de todos os arquivos e referências ao módulo e componente de Dúvidas Frequentes/FAQ.
* **Integrantes:** Ajustes no metodo e html de todos integrantes e detalhes do integrantes no painel administrativo.
* **Integrantes:** Adição do todos-integrantes institucional no tsconfig, criação do component, alteração no menu institucional, adição das rotas de integrantes, criação dos metodos getExIntegrantes, getAtuaisIntegrantes, getIntegranteByNamePublic
* **Alterações Gerais:** Alterado logo no menu, na página de login, na página de criação de senha, na página de redefinição de senha, na página de send email, na aba e no painel admin. Alterado o título da aba. Removido dropdown do Login e o "Sobre o GPES" do painel admin e do institucional.
* **Publicações:** Adequando o componente para visualizar todas as publicações com os dados corretos e separadas por categoria, ordenando por mais novo primeiro e por mais antigo primeiro e pondendo buscar por um período de tempo, e modificando o arquivo css de documents-collapse adicionando uma nova classe.
* **Eventos:** Refatorando o modulo de notícias para Eventos e alterando o nome do componente visualizar eventos para detalhes-evento do admin-panel.
* **Eventos:** Ajustando a visualização de todos registros no institucional (web-app).
* **Eventos:** Alterando o nome do componente de evento para detalhes-evento no institucional, campo de exibição de data modificado.

### Versão 5.3
* **Integrantes:** alteração da model de integrantes para aceitar email, alteração de detalhes e novo integrante no painel administrativo para suportar campo email, alteração no todos integrantes no institucional para suportar o campo email e informações da integrante Daniela
* **Integrantes:** alteração de todos integrantes e detalhes, criação do atualizar integrante adição do metodo na service. Correção de todos integrantes institucional
* **Eventos:** Trocando o rótulo da data do evento no evento-card e no detalhes-evento; Adicionando o texto explicativo no todos-evento.
* **Eventos:** Refatorando o componente de atualizar-evento: adicionando o campo de data para ser editado, modificando o método de updateEvento e chamando os métodos corretamente do arquivo service.
* **Integrantes:** excluir integrantes metodo no componente listar todos e visualizar, metodo na service e correções no admin panel integrantes e institucional.
* **Sobre:** modificando o método de updateSobre e chamando os métodos corretamente do arquivo service.
* **Publicações:** Troca dos rótulos "Plataforma" e "Descrição" para "Publicado Em" e "Resumo" realizada no cadastro e nos detalhes da publicação.
* **Publicações:** Implementado slice no título da publicação na listagem das publicações no painel administrativo, e colocado texto explicativo do módulo publicações e retirado informações dos detalhes da publicação.
* **Publicações:** Implementado modal de cadastro de autor, validador de nome único, e modificado o input autores para um dropdown e instalado o pacote ng-select2 (componente do dropdown).
* **Publicações:** Modificado atualização de transparência para atualizar publicações e  os métodos updateDocument e getDataByTitle de publicaçoes.service.
* **Publicações:** Instalado o pacote NPM ngx-select-ex e refatoraro a listagem de autores ao criar e atualizar uma publicação. Modificado campo autores do model, placeholder ao criar autores, e modificado a listagem de autores da publicação no institucional.
* **Processo Seletivo - Inscrição:** Separado os componentes de Processo Seletivo em  Informações (onde ficam os blocos de informações referentes ao processo seletivo) e Inscriçãp (onde é realizada efetivamente a inscrição e controle das inscrições). Criado e estilizado formulário de inscrição.

### Versão 5.4
* **Publicações** Padronizado contador de caracteres do título no Painel Administrativo, removendo o método sliceTitle e adicionando o showEllipsisInTheText. Retirado a propriedade "ngxDisabled" do HTMl do create e atualizar. Padronizado a formatação do texto explicativo de publicações no Institucional. Refatorado o método onChangeAutor em create e atualizar.