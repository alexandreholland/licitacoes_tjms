---
id: DDS-20327
jira_parent: DTIC-1247
titulo: "Especificação de Requisitos - Modernização da Página de Licitações e Contratações Diretas"
demandante: "Secretaria de Bens e Serviços / Departamento de Compras e Licitações"
coordenadoria: "Coordenadoria de Compras"
ponto_focal: "Milena Missiano (Ramal 1338)"
analista_requisitos: "Alexandre Holland dos Santos Filho"
unidade_ti: "GG-STI-DDS-CDSA / DIAQ"
data_elaboracao: 2026-08-27
status: "Levantamento de Requisitos / Prototipação"
versao: "1.0"
tags:
  - requisitos
  - tjms
  - portal-institucional
  - compras-publicas
  - licitacoes
---

# Especificação de Requisitos de Software (ERS)
## DDS-20327 (DTIC-1247) – Modernização do Módulo de Licitações e Contratações Diretas

> [!abstract] Resumo Executivo
> Especificação funcional e visual para reformulação completa da página de **Licitações e Contratações Diretas** do Portal Institucional do Tribunal de Justiça de Mato Grosso do Sul (TJMS). O projeto tem como objetivo migrar a página legada para o novo padrão de design system do portal (inspirado no modelo `/comitedasaude`), integrar canais de acesso a sistemas federais e legados (Compras.gov, SICAF, SGC, Manuais) e disponibilizar um módulo dinâmico e gerenciável para publicação e consulta de **Avisos de Dispensa de Licitação Tradicional (sem disputa eletrônica)** com seus respectivos Termos de Referência e anexos.

---

## 1. Identificação e Metadados da Demanda

| Atributo | Detalhe |
| :--- | :--- |
| **Código da Tarefa (Jira):** | `DTIC-1247` / `DDS-20327` |
| **Sistema / Serviço:** | Portal Institucional TJMS |
| **Área Demandante:** | Secretaria de Bens e Serviços |
| **Unidade Beneficiada:** | Departamento de Compras e Licitações / Coordenadoria de Compras |
| **Responsável Técnico / Análise:** | Alexandre Holland dos Santos Filho (DIAQ / CDSA) |
| **Objetivo Estratégico:** | **OBJETIVO 03** – *Assegurar o acesso à informação de forma compreensível promovendo integração e parcerias* |
| **URL Atual (Legado):** | `https://www5.tjms.jus.br/licitacoes/` |
| **Portal de Referência Visual:** | `https://www.tjms.jus.br/comitedasaude` |
| **Referência de Negócio (Tabela):** | `https://www.mpms.mp.br/contratacoes/compras` |

---

## 2. Contextualização e Justificativa

### 2.1. Cenário Atual
A página legada de licitações do TJMS opera em formato predominantemente textual sobre tema escuro, com links estáticos e sem mecanismos de busca, filtros ou categorização intuitiva para os licitantes.

### 2.2. Necessidade de Negócio
Com a descentralização de certas aquisições e a aplicação da Lei nº 14.133/2021, fez-se imperativo viabilizar a **publicação dos avisos de dispensa de licitação física/tradicional sem disputa** (aquelas não operacionalizadas diretamente no Compras.gov), permitindo que fornecedores locais e interessados consultem os avisos, prazos de envio de proposta e realizem o download do Termo de Referência (TR).

---

## 3. Perfis de Acesso (Personas)

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PERFIS DE ACESSO                              │
├──────────────────────────┬─────────────────────────────────────────────┤
│ 1. Fornecedor / Cidadão  │ • Consulta avisos de contratação direta     │
│    (Acesso Público)      │ • Faz download de editais, avisos e TRs     │
│                          │ • Acessa Compras.gov (UASG 929735) e SICAF  │
│                          │ • Consulta canais de atendimento e manuais  │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 2. Operador de Compras   │ • Cadastra novos avisos de dispensa         │
│    (Coordenadoria/Depto) │ • Publica prorrogações e republicações      │
│                          │ • Realiza upload de avisos e termos de ref. │
│                          │ • Encerra e gerencia publicações no portal  │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 3. Administrador STI     │ • Gerencia permissões e parametrização      │
│    (DDS / DIAQ)          │ • Realiza manutenção estrutural da página   │
└──────────────────────────┴─────────────────────────────────────────────┘
```

---

## 4. Requisitos Funcionais (RF)

### 4.1. Módulo Público do Portal

#### `RF01` - Painel de Acesso Rápido (Cards de Destaque)
Apresentar uma grade de cards com ícones institucionais, títulos objetivos, descritivos e links diretos para as seguintes ferramentas:
1. **Licitações e Dispensas Eletrônicas (Compras.gov):**
   - Destaque fixo e visual para o código: **`UASG 929735`**.
   - Link de redirecionamento para o Portal de Compras do Governo Federal (`https://www.gov.br/compras/pt-br`).
2. **SICAF (Sistema de Cadastramento Unificado de Fornecedores):**
   - Link direto para consulta e credenciamento de empresas fornecedoras (`https://www3.comprasnet.gov.br/sicaf-web/`).
3. **Legado de Informações até 2025 (Acervo SGC):**
   - Link de consulta aos editais e resultados de licitações anteriores ao novo modelo (`https://www5.tjms.jus.br/licitacoes/`).
4. **Manuais e Orientações Compras.gov:**
   - Link oficial de manuais e tutoriais para fornecedores (`https://www.gov.br/compras/pt-br/acesso-a-informacao/manuais`).

#### `RF02` - Tabela Dinâmica de Contratações Diretas (Dispensas sem Disputa)
Disponibilizar tabela interativa contendo os avisos de dispensas tradicionais com as colunas:
- **Identificador / Número:** Identificação com tag de status (Ex: `#Prorrogação - AVISO DE CONTRATAÇÃO DIRETA Nº 038/2026 - FEADMP`, `#Republicação...`, `#AVISO...`).
- **Objeto:** Descrição detalhada do bem, serviço ou material a ser contratado.
- **Prazo Inicial:** Data inicial de acolhimento das cotações/propostas (`DD/MM/AAAA`).
- **Prazo Final:** Data limite de recebimento de propostas (`DD/MM/AAAA`).
- **Status da Dispensa:** Badge visual indicando *Em Aberto / Vigente*, *Prorrogado*, *Republicado* ou *Encerrado*.
- **Anexo(s):** Botões para visualização e download dos arquivos pertinentes (Aviso de Dispensa, Termo de Referência ou arquivo consolidado `.zip`).

#### `RF03` - Mecanismos de Busca e Filtragem
- **Busca por Palavra-Chave:** Filtragem instantânea ao digitar termos do *Objeto* ou do *Número do Processo*.
- **Filtro por Status:** Opções: *Todos*, *Abertos / Em Andamento*, *Prorrogados*, *Republicados*, *Encerrados*.
- **Filtro por Ano de Exercício:** Seleção do ano de publicação (Ex: *2026*, *2025*).

#### `RF04` - Central de Atendimento e Canais de Contato
Estruturar blocos com contatos oficiais organizados por setor:
- **Departamento de Compras e Licitações:**
  - E-mail: `licitacao@tjms.jus.br`
  - Telefones: `(67) 3314-1329` / `(67) 3314-1517`
- **Coordenadoria de Compras:**
  - E-mail: `compras@tjms.jus.br`
  - Telefone Institucional: `(67) 3314-1338`
  - Canal WhatsApp: `(67) 99825-6693` (com botão de redirecionamento `wa.me`)
- **Horário de Atendimento Institucional:**
  - *11:00 às 19:00 horas (Horário de Brasília / Expediente TJMS)*.

---

### 4.2. Módulo de Gerenciamento / Administrativo (CMS)

#### `RF05` - Cadastro e Edição de Avisos de Dispensa
Interface restrita à Coordenadoria de Compras permitindo:
- Inclusão de novo aviso com definição de prefixo (`#Aviso Inicial`, `#Prorrogação`, `#Republicação`).
- Definição do número do processo e redação do objeto.
- Definição da vigência com controle de datas inicial e final.
- Upload de arquivos (Aviso de Dispensa e Termo de Referência em formato `.pdf` ou `.zip`).
- Edição de registros existentes e possibilidade de prorrogação de prazo com atualização automática da tabela pública.
- Inativação / Exclusão lógica de avisos cadastrados indevidamente.

---

## 5. Regras de Negócio (RN)

> [!important] Diretrizes Jurídicas e Operacionais
> - **`RN01 - Encerramento Automático por Data Limite`:** Quando a data corrente ultrapassar a data/hora definida no campo `Prazo Final`, o registro deve assumir automaticamente a etiqueta visual de **"Encerrado"**, bloqueando o envio de propostas a menos que haja prorrogação cadastrada.
> - **`RN02 - Padronização de Prefixos de Publicação`:** Todas as publicações decorrentes de alterações de cronograma ou termo de referência devem obrigatoriamente adotar os prefixos normatizados `#Prorrogação` ou `#Republicação` no início do título.
> - **`RN03 - Restrição de Extensão e Tamanho de Arquivos`:** O upload de documentos é restrito aos formatos `.pdf`, `.p7s` e `.zip`, com tamanho máximo individual de 50 MB.
> - **`RN04 - Exibição Obrigatória da UASG Institucional`:** A indicação da UASG **929735** deve figurar de maneira fixa no topo da área de licitações eletrônicas para evitar cotações direcionadas a órgãos divergentes.

---

## 6. Requisitos Não-Funcionais (RNF)

* **`RNF01 - Padrão Visual Institucional:`** Interface limpa, moderna, baseada em cards brancos, cantos arredondados (`border-radius: 12px`), sombras sutis, ícones representativos e paleta de azuis oficiais do TJMS.
* **`RNF02 - Responsividade:`** Compatibilidade plena com dispositivos móveis, tablets e monitores desktop ultrawide.
* **`RNF03 - Acessibilidade:`** Conformidade com o Modelo de Acessibilidade em Governo Eletrônico (**e-MAG**) e **WCAG 2.1 AA** (alto contraste, atalhos de teclado e compatibilidade com leitores de tela).
* **`RNF04 - Performance:`** Carregamento total da página pública em tempo inferior a 1,5 segundos em conexões padrão.
* **`RNF05 - Segurança e Autenticação:`** Acesso ao painel administrativo integrado ao controle de acesso corporativo do TJMS.

---

## 7. Dados Reais de Homologação (Massa de Testes)

| Identificador | Objeto | Prazo Inicial | Prazo Final | Status |
| :--- | :--- | :---: | :---: | :---: |
| `#Prorrogação - AVISO DE CONTRATAÇÃO DIRETA Nº 038/2026 - FEADMP` | REPUBLICAÇÃO Fornecimento de Kits APH tático completos | 27/07/2026 | 30/07/2026 | Prorrogado |
| `#Republicação - AVISO DE CONTRATAÇÃO DIRETA - DISPENSA nº 036/2026` | Aquisição de moedas institucionais personalizadas, destinadas à distribuição a colaboradores, convidados e participantes de eventos institucionais, com o objetivo de fortalecer a identidade institucional e fomentar a cooperação interinstitucional | 27/07/2026 | 30/07/2026 | Republicado |
| `#AVISO DE CONTRATAÇÃO DIRETA - DISPENSA nº 44/2026` | Aquisição de material permanente (persianas) e fornecimento de serviços de instalação de persianas | 27/07/2026 | 30/07/2026 | Aberto |
| `#AVISO DE CONTRATAÇÃO DIRETA Nº 025/2026` | Fornecimento de água mineral natural acondicionada em garrafões retornáveis de 20 litros | 10/06/2026 | 15/06/2026 | Encerrado |

---

## 8. Evidências do Protótipo Funcional

Cole os prints de tela capturados a partir do protótipo nos campos correspondentes abaixo:

### 8.1. Visão Geral da Nova Página e Banner Principal
> [!note] Evidência 01: Header, Breadcrumbs e Identidade Visual
> Visão panorâmica da nova interface do Portal TJMS adaptada para a área de Licitações.

![[prototipo_01_visao_geral.png]]

---

### 8.2. Cards de Acesso Rápido (Compras.gov, SICAF, SGC, Manuais)
> [!note] Evidência 02: Grade de Acesso Rápido
> Cards no padrão `/comitedasaude` com destaque para a UASG 929735 e links de sistemas externos.

![[prototipo_02_acesso_rapido.png]]

---

### 8.3. Tabela de Dispensas de Licitação sem Disputa e Filtros
> [!note] Evidência 03: Tabela Interativa de Contratações Diretas
> Listagem de avisos, filtros de status/ano, busca em tempo real e botões para download de anexos (Aviso + TR).

![[prototipo_03_tabela_dispensas.png]]

---

### 8.4. Painel Administrativo / Modal de Cadastro da Coordenadoria de Compras
> [!note] Evidência 04: Módulo de Gestão e Upload de Anexos
> Interface restrita para publicação, prorrogação de datas e inserção de arquivos de dispensas.

![[prototipo_04_modal_gerenciador.png]]

---

### 8.5. Central de Contatos e Canais de Atendimento
> [!note] Evidência 05: Cards de Contato
> Seção de atendimento ao público e fornecedores com telefones, e-mails e botão direto para WhatsApp.

![[prototipo_05_cards_contatos.png]]

---

## 9. Critérios de Aceite e Homologação

- [ ] **CA01:** O link do Compras.gov exibe e direciona corretamente com referência à UASG 929735.
- [ ] **CA02:** Os cards de Acesso Rápido direcionam com sucesso para SICAF, SGC Legado e Manuais.
- [ ] **CA03:** A tabela de contratações diretas exibe todas as colunas acordadas (Número, Objeto, Prazos, Anexos).
- [ ] **CA04:** A busca por texto no Objeto e Número filtra os registros instantaneamente.
- [ ] **CA05:** O download dos anexos (Aviso e TR) funciona corretamente em formato PDF/ZIP.
- [ ] **CA06:** O módulo de cadastro permite criar, editar e prorrogar dispensas com persistência.
- [ ] **CA07:** Os botões de contato abrem o e-mail pré-formatado e a conversa do WhatsApp da Coordenadoria.