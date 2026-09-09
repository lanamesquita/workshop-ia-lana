# Workshop IA Lana

Aplicativo mobile em React Native/Expo para acompanhamento de treinos de fisioterapia em casa, com foco em execução guiada, temporização confiável, timeline vertical e acompanhamento de progresso em tempo real.

## Visão geral

Este projeto foi estruturado e formalizado usando Spec Kit, seguindo o fluxo:

- Constituição do projeto
- Especificação da feature
- Clarificação de requisitos
- Plano técnico
- Geração de tarefas
- Implementação inicial do domínio

A proposta principal é substituir a folha de exercícios do fisioterapeuta por uma experiência mobile que guiada a pessoa durante o treino, com:

- timeline vertical de execução
- cronômetro por etapa
- repetições e séries
- disparo manual por botão e disparo automático com tempo de preparação
- percentagem concluída e tempo restante
- uso offline e prioritariamente em celular

## Uso de Spec Kit

O projeto foi desenvolvido com a estrutura do Spec Kit para manter a documentação e a implementação alinhadas com requisitos, arquitetura e governança.

Arquivos principais:

- `.specify/memory/constitution.md` — Constituição do projeto e princípios de desenvolvimento
- `specs/001-treino-fisioterapia/spec.md` — Especificação funcional da feature
- `specs/001-treino-fisioterapia/plan.md` — Plano técnico da implementação
- `specs/001-treino-fisioterapia/tasks.md` — Lista de tarefas organizadas por história

## Etapas executadas

### 1. Constituição do projeto
Concluída.

- Definição dos princípios do produto
- Regras de temporização e progresso
- Regras de disparo manual e automático
- Diretriz de timeline vertical como interface principal
- Governança e versionamento da constituição

Arquivo: `.specify/memory/constitution.md`

### 2. Especificação da feature
Concluída.

- Definição do problema e contexto do app
- Histórias de usuário com prioridades P1, P2 e P3
- Requisitos funcionais e cenários de teste
- Clarificações de comportamento do sistema

Arquivo: `specs/001-treino-fisioterapia/spec.md`

### 3. Planejamento técnico
Concluído.

- Arquitetura React Native + Expo
- Persistência local
- Estratégia de temporização e cálculo de progresso
- Estrutura recomendada de pastas e módulos
- Validação de conformidade com a constituição

Arquivo: `specs/001-treino-fisioterapia/plan.md`

### 4. Geração de tarefas
Concluída.

- Organização por histórias de usuário
- Dependências entre fases
- Critérios independentes de teste
- Estratégia de implementação incremental

Arquivo: `specs/001-treino-fisioterapia/tasks.md`

### 5. Implementação inicial do domínio
Concluída.

- Modelos de prescrição
- Modelos de execução
- Validações de domínio
- Textos em PT-BR
- Treino de exemplo para validação inicial

Arquivos principais:

- `src/dominio/modelo/prescricao.ts`
- `src/dominio/modelo/execucao.ts`
- `src/dominio/modelo/validacoes.ts`
- `src/textos/index.ts`
- `src/dados/seed/treinoExemplo.ts`

### 6. Commit do domínio
Concluído.

- Registro do primeiro conjunto de implementações do núcleo do produto
- Commit realizado com a estrutura inicial do modelo e validações

### 7. Push do repositório
Concluído.

- Branch principal atualizada no remoto

## Status atual do projeto

O projeto já possui:

- constituição formalizada
- especificação de feature completa
- plano técnico concluído
- tarefas geradas e organizadas
- base inicial do domínio implementada

A etapa de scaffold do app mobile foi tentada com Expo, mas o ambiente foi bloqueado pela existência do diretório do projeto já preenchido, sendo necessário prosseguir com a criação da base mobile de forma controlada no próximo passo.

## Estrutura do repositório

```text
.
├── .specify/
├── .github/
├── specs/
├── src/
├── requisitos.txt
├── README.md
└── .git/
```

## Tecnologias previstas

- React Native
- Expo
- TypeScript
- SQLite local
- Expo Notifications
- Zustand
- Testes automatizados com Jest

## Próximos passos

1. Scaffold do app Expo dentro do repositório
2. Instalação das dependências
3. Implementação das telas e timeline de treino
4. Motor de execução e temporização
5. Persistência local e lembretes
6. Testes automatizados e validação em dispositivo

## Observação

Este README documenta o estado real do projeto até o momento, incluindo os passos concluídos e os próximos passos pendentes da implementação mobile.
