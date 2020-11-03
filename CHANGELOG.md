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
