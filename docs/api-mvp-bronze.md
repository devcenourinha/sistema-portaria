# API - MVP Bronze


## Verifica se o backend está on.
GET /api/ping

{ "ok": true, "service": "api", "time": "2025-08-20T13:10:00Z" }

cURL
curl http://localhost:5000/api/ping


## Cria visita ativa (status=dentro) para um visitante. (CREATE)
POST /api/checkin

{
  "visitante_id": 1,
  "morador_texto": "Bloco B, ap 12B",
  "placa": "ABC1D23"
}

{
  "id": 123,
  "visitante_id": 1,
  "morador_texto": "Bloco B, ap 12B",
  "placa": "ABC1D23",
  "data_entrada": "2025-08-20T13:10:00Z",
  "status": "dentro"
}

curl -X POST http://localhost:5000/api/checkin \
  -H "Content-Type: application/json" \
  -d '{"visitante_id":1,"morador_texto":"Bloco B, ap 12B","placa":"ABC1D23"}'

 Invoke-RestMethod -Method POST `
  -Uri 'http://localhost:5000/api/checkin' `
  -ContentType 'application/json' `
  -Body '{"visitante_id":1,"morador_texto":"Bloco B, ap 12B","placa":"ABC1D23"}'


  ## Finaliza uma visita com (status=dentro) define (data_saida) e muda (status=fora). (UPDATE)
POST /api/checkout/:id

{
  "id": 123,
  "status": "fora",
  "placa": "ABC1D23",
  "data_saida": "2025-08-20T15:20:00Z"
}

curl -X POST http://localhost:5000/api/checkout/123

Invoke-RestMethod -Method POST `
  -Uri 'http://localhost:5000/api/checkout/ID_DA_VISITA' `
  -ContentType 'application/json' `


##  Lista as visitas com (status=dentro). (READ)
GET /api/visitantes/ativos

[
  {
    "id": 123,
    "visitante": { "id": 1, "nome": "Fulano da Silva", "documento": "RG123" },
    "morador_texto": "Bloco B, ap 12B",
    "placa": "ABC1D23",
    "data_entrada": "2025-08-20T13:10:00Z",
    "status": "dentro"
  }
]

curl http://localhost:5000/api/visitantes/ativos



## Retorna contagem e registros do dia. (READ)
GET /api/relatorios?data=YYYY-MM-DD

{
  "data": "2025-08-20",
  "entradas": 12,
  "saidas": 10,
  "registros": [
    { "visitante": "Fulano", "morador_texto": "Bloco A, 101", "entrada": "08:10", "saida": "09:00" }
  ]
}

curl "http://localhost:5000/api/relatorios?data=2025-08-20"


## Convenções de erro serão neste formato:

{
  "error": "Bad Request",
  "message": "Campo morador_texto é obrigatório",
  "code": "VALIDATION_ERROR"
}