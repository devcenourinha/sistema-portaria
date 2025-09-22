# Dicionário de Dados & Fluxos

## Diagrama ER (Mermaid)

erDiagram
    USUARIOS {
        int id PK
        string nome
        string login
        string senha_hash
        string perfil
    }

    VISITAS {
        int id PK
        int visitante_id FK
        int morador_id FK
        datetime data_entrada
        datetime data_saida
        string status
        int criado_por FK
    }

    USUARIOS ||--o{ VISITAS : "criou" }

## Fluxos de Interação (Mermaid)
### Check-in

sequenceDiagram
    autonumber
    participant U as Usuário (Porteiro)
    participant FE as Frontend (React 3000)
    participant BE as Backend (Node/Express 5000)
    participant DB as PostgreSQL

    U->>FE: Preenche formulário de check-in<br/>(visitante, morador, placa)
    FE->>BE: POST /api/checkin {dados + token}
    BE->>BE: Valida token (usuário logado)
    BE->>BE: Regras: não permitir duas visitas "dentro"
    BE->>DB: INSERT em VISITAS (status="dentro", data_entrada=agora, criado_por=usuarioId)
    DB-->>BE: OK (id da visita)
    BE->>DB: INSERT em LOGS_AUDITORIA (acao="CHECKIN", entidade="visitas", entidade_id)
    DB-->>BE: OK
    BE-->>FE: 201 Created {id, status, data_entrada}
    FE-->>U: Atualiza UI (aparece em "Dentro agora")


### Check-out

sequenceDiagram
    autonumber
    participant U as Usuário (Porteiro)
    participant FE as Frontend (React 3000)
    participant BE as Backend (Node/Express 5000)
    participant DB as PostgreSQL

    U->>FE: Clica em "Check-out" na lista
    FE->>BE: POST /api/checkout/:id
    BE->>BE: Valida se visita está "dentro"
    BE->>DB: UPDATE VISITAS<br/>(status="fora", data_saida=agora)
    DB-->>BE: OK
    BE->>DB: INSERT LOGS_AUDITORIA (acao="CHECKOUT", entidade="visitas", entidade_id)
    DB-->>BE: OK
    BE-->>FE: 200 OK {status="fora", data_saida}
    FE-->>U: Some da lista "Dentro agora"


### Lista “Dentro agora”

sequenceDiagram
    autonumber
    participant U as Usuário (Porteiro/Síndico)
    participant FE as Frontend (React 3000)
    participant BE as Backend (Node/Express 5000)
    participant DB as PostgreSQL

    U->>FE: Abre Dashboard
    FE->>BE: GET /api/visitantes/ativos
    BE->>DB: SELECT * FROM VISITAS<br/>WHERE status="dentro"<br/>JOIN VISITANTES, MORADORES
    DB-->>BE: Retorna lista (nome visitante, morador, data_entrada...)
    BE-->>FE: 200 OK [ ... registros ... ]
    FE-->>U: Renderiza tabela "Dentro agora"

## Tabelas (MVP Bronze)
### USUÁRIOS

| Campo        | Tipo           | PK/FK | Descrição                                      |
|--------------|----------------|-------|------------------------------------------------|
| id           | SERIAL         | PK    | Identificador único do usuário                 |
| nome         | VARCHAR(100)   |       | Nome completo do usuário (porteiro, síndico)   |
| login        | VARCHAR(50)    |       | Nome de usuário usado no login                 |
| senha_hash   | VARCHAR(255)   |       | Senha criptografada do usuário                 |
| perfil       | VARCHAR(20)    |       | Papel do usuário no sistema (ex.: porteiro)    |
| criado_em    | TIMESTAMP      |       | Data de criação do registro                    |
| atualizado_em| TIMESTAMP      |       | Última atualização do registro                 |


### VISITAS

| Campo        | Tipo           | PK/FK | Descrição                                      |
|--------------|----------------|-------|------------------------------------------------|
| id           | SERIAL         | PK    | Identificador único da visita                  |
| visitante_id | INT            | FK    | Referência ao visitante (tabela VISITANTES)    |
| morador_id   | INT            | FK    | Referência ao morador visitado (tabela MORADORES) |
| data_entrada | TIMESTAMP      |       | Data e hora de entrada                         |
| data_saida   | TIMESTAMP      |       | Data e hora de saída                           |
| status       | VARCHAR(20)    |       | Estado da visita (dentro/fora)                 |
| criado_por   | INT            | FK    | Usuário (porteiro) que registrou a visita      |
| criado_em    | TIMESTAMP      |       | Data de criação do registro                    |
| atualizado_em| TIMESTAMP      |       | Última atualização do registro                 |


### LISTAR VISITAS ATIVAS 

SELECT id, visitante_id, morador_texto, placa, data_entrada
FROM visitas
WHERE status = 'dentro';