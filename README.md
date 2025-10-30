#  URL Shortener — Escalável e de Alta Performance

Gerador de URLs escalável, capaz de processar até **100 milhões de encurtamentos por dia**, desenvolvido com **Node.js**, **TypeScript**, **Redis**, **Cassandra** e **Docker**, aplicando princípios de **Clean Architecture** e **System Design**.

---

##  Tecnologias Utilizadas

* **Node.js** + **TypeScript** — backend performático e tipado
* **Cassandra** — banco de dados distribuído e escalável
* **Redis** — cache para otimizar leituras e redirecionamentos
* **Docker** — containerização e fácil deploy
* **Joi** — validação de dados
* **Helmet** e **Cors** — segurança e controle de acesso
* **Hashids** — ofuscação e geração segura dos shortcodes
* **Jest** — testes automatizados

---

##  Arquitetura

O projeto segue os princípios de **Clean Architecture**, garantindo separação clara entre camadas:

* `application/` — casos de uso e serviços de negócio
* `domain/` — entidades e interfaces de repositório
* `infrastructure/` — banco de dados, cache e configurações
* `interfaces/` — DTOs e mapeadores de dados
* `http/` — rotas, controladores e middlewares

---

##  Requisitos Funcionais

1. **Encurtamento de URL** — Dado um URL longo, retornar um URL encurtado.
2. **Redirecionamento da URL** — Dado um URL curto, redirecionar para o URL original.

---

## Requisitos Não Funcionais

1. O sistema deve suportar **100 milhões de URLs geradas por dia**.
2. A URL encurtada deve ser **o mais curta possível**.
3. Somente **números (0-9)** e **caracteres (a-z, A-Z)** são permitidos.
4. Para cada 1 operação de gravação, devem ocorrer **10 operações de leitura**.
5. O comprimento médio das URLs armazenadas é de **100 bytes**.
6. URLs devem ser armazenadas por **no mínimo 10 anos**.
7. O sistema deve operar em **alta disponibilidade (24/7)**.

---
##  System Design

![System Design](./public/image.png)

---

## Modelagem do Cassandra

A modelagem segue o princípio de que o `shortcode` é único e deve ser a **chave primária**, garantindo eficiência nas buscas:

```sql
CREATE TABLE url (
  shortcode TEXT PRIMARY KEY,
  long_url TEXT,
  created_at TIMESTAMP
);
```

A geração do `shortcode` usa **Base62** combinada com **Hashids** para garantir unicidade e ofuscação.

---

##  Execução com Docker

```bash
docker-compose up --build
```

O serviço ficará disponível em `http://localhost:3000`.

---

## Testes

Execute os testes com:

```bash
npm run test
```

Os testes são implementados com **Jest**, cobrindo casos de uso, serviços e repositórios.

---

##  Estrutura de Pastas

```
src/
 ├── application/
 ├── domain/
 ├── infrastructure/
 │    ├── database/
 │    │    ├── cassandra/
 │    │    └── redis/
 ├── interfaces/
 └── main.ts
```

---

## Segurança

* **Helmet**: protege a aplicação com cabeçalhos HTTP.
* **Cors**: controle de origem cruzada.
* **Hashids**: impede previsibilidade dos códigos gerados.

---

## Escalabilidade

O sistema foi desenhado com foco em **leitura massiva (10:1)**, cache eficiente com Redis, persistência distribuída via Cassandra e uso de containers para suportar alta carga e replicação horizontal.

---

