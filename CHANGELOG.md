# Changelog
Todas as mudanças notáveis de commits e funcionalidades neste projeto serão documentadas aqui.

## [0.0.7] - 20-08-2025
### Adicionado
- Commit inicial estrutura do projeto
- Arquivos de documentação e estrutura inicial
- Conexao backend com o front
- Diagrama Mermaid do fluxo + Arquitetura dev das portas e proxy
- Criação do mvp_bronze.sql
- Documentação da API MVP Bronze
- Rota POST /api/echo validada com sucesso
- Backend entende requisições POST
- Middleware express.json() funcionando
- req.body acessado corretamente
## [0.0.10] - 18-09-2025
- Endpoint POST /api/checkin com validação e integração PostgreSQL
- Tabelas visitas e logs_auditoria; índice único uidx_visita_ativa
- .env ignorado no repositório por conter senha
- Endpoint POST /api/checkout/:id para finalizar visitas (atualiza status para fora e define data_saida)
- Arquivos .env.principal e .env.notebook para separar ambientes.
- .env.example para o git sem expor credenciais.
- db.js agora tem somente variáveis de ambiente.