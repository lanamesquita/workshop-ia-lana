# Tasks: App de Acompanhamento de Treino de Fisioterapia

**Input**: Design documents from `/specs/001-treino-fisioterapia/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

**Tests**: incluídos. A constitution v1.1.0 determina no portão de qualidade que "toda funcionalidade que envolva tempo, progresso ou conclusão MUST ter testes automatizados antes de ser considerada pronta", e o Princípio II exige cobertura determinística com relógio injetável.

**Organization**: tarefas agrupadas por história de usuário, para que cada uma seja implementável, testável e entregável de forma independente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependências pendentes)
- **[Story]**: a qual história pertence (US1, US2, US3)
- Caminhos de arquivo exatos nas descrições

## Path Conventions

App único Expo na raiz do repositório, conforme a Structure Decision do plano: rotas em `app/`,
código em `src/`, testes em `tests/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: inicialização do projeto e estrutura base

- [ ] T001 Criar projeto Expo com TypeScript em modo estrito na raiz do repositório, gerando `package.json`, `tsconfig.json` e `app.json`
- [ ] T002 Criar a árvore de pastas do plano: `app/`, `src/dominio/`, `src/dados/`, `src/servicos/`, `src/estado/`, `src/ui/`, `src/textos/`, `tests/unit/`, `tests/integration/`, `tests/e2e/`
- [ ] T003 [P] Configurar ESLint e Prettier em `.eslintrc.js` e `.prettierrc`, com regra que proíbe importar React ou React Native dentro de `src/dominio/`
- [ ] T004 [P] Configurar Jest e `@testing-library/react-native` em `jest.config.js`, com suporte a fake timers
- [ ] T005 [P] Adicionar scripts `test`, `test:watch` e `lint` em `package.json`
- [ ] T006 [P] Configurar Maestro e criar `tests/e2e/README.md` com instruções de execução em dispositivo físico
- [ ] T007 [P] Criar módulo central de textos em português do Brasil em `src/textos/index.ts` (FR-037)
- [ ] T008 Configurar Expo Router com layout raiz em `app/_layout.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: infraestrutura que todas as histórias consomem

**⚠️ CRITICAL**: nenhuma história pode começar antes desta fase terminar

- [ ] T009 Definir os tipos da camada de prescrição em `src/dominio/modelo/prescricao.ts`: `Treino`, `Serie`, `Exercicio`, `Etapa`, conforme data-model.md
- [ ] T010 Definir os tipos da camada de execução em `src/dominio/modelo/execucao.ts`: `Sessao`, `ItemExecucao` com `tipo` em `preparacao | etapa | descanso | exercicioLivre` e `estado` em `pendente | emExecucao | concluido | pulado`
- [ ] T011 Implementar as validações de prescrição em `src/dominio/modelo/validacoes.ts`: `nome` obrigatório de 1 a 80 caracteres; `descricao` da etapa obrigatória de 1 a 120 caracteres; `quantidadeDeSeries` inteiro maior ou igual a 1 com padrão 1; `descansoEntreSeriesSegundos` maior ou igual a 0 e obrigatório quando `quantidadeDeSeries` maior que 1; `repeticoes` maior ou igual a 1 quando o exercício não é livre; `tempoExecucaoSegundos` maior que 0 quando o exercício não é livre; `tempoPreparacaoSegundos` maior que 0 obrigatório quando `modoDisparo` é `automatico`
- [ ] T012 [P] Escrever testes unitários das validações em `tests/unit/validacoes.test.ts`, cobrindo cada limite citado em T011
- [ ] T013 [P] Implementar abertura do banco e migrações versionadas idempotentes em `src/dados/sqlite/migracoes.ts`
- [ ] T014 [P] Declarar as interfaces de persistência em `src/dados/repositorios/contratos.ts`, conforme `contracts/persistencia.md`
- [ ] T015 Implementar `RepositorioDeTreinos` em `src/dados/repositorios/treinos.ts`, com gravação atômica de treino, séries, exercícios e etapas em transação única e ordenação estável na leitura
- [ ] T016 Implementar `RepositorioDeSessoes` em `src/dados/repositorios/sessoes.ts`, garantindo que atualizar a sessão não reescreva a prescrição
- [ ] T017 [P] Escrever testes de integração dos repositórios em `tests/integration/repositorios.test.ts` contra SQLite em memória, cobrindo atomicidade, ordenação estável e imutabilidade da sessão
- [ ] T018 [P] Criar tema e primitivas acessíveis em `src/ui/comuns/tema.ts`, com alvo mínimo de toque de 48 dp e paleta de contraste mínimo AA
- [ ] T019 [P] Criar o treino de exemplo em `src/dados/seed/treinoExemplo.ts`: série única, "Contrair" com 8 repetições e etapas de 7s e 4s, "Contrai/Relaxa" com 10 repetições e etapas de 2s e 2s, ambos com disparo manual

**Checkpoint**: fundação pronta. O treino de exemplo existente é o que permite testar a US1 sem depender das telas de cadastro.

---

## Phase 3: User Story 1 - Executar o treino do dia acompanhando tempo e progresso (Priority: P1) 🎯 MVP

**Goal**: conduzir a execução completa de um treino com cronometragem precisa, timeline vertical, checks automáticos e indicadores contínuos de porcentagem e tempo restante.

**Independent Test**: executar de ponta a ponta o treino de exemplo carregado pela fundação, sem usar nenhuma tela de cadastro, verificando tempos, checks, porcentagem, tempo restante e comportamento após bloquear a tela.

### Tests for User Story 1 ⚠️

> **NOTA: escrever estes testes ANTES e garantir que FALHEM antes da implementação**

- [ ] T020 [P] [US1] Testes unitários da expansão em `tests/unit/expansao.test.ts`: o treino de exemplo produz 36 itens e 128 segundos planejados; com `quantidadeDeSeries` igual a 3 o descanso aparece entre repetições do grupo e não após a última
- [ ] T021 [P] [US1] Testes das invariantes 1 a 8 do motor em `tests/unit/motor-invariantes.test.ts`, com relógio falso, conforme `contracts/motor-execucao.md`
- [ ] T022 [P] [US1] Testes de salto de tempo em `tests/unit/motor-sincronizar.test.ts`: um único `sincronizar` após longo intervalo resolve todos os itens vencidos e para no primeiro item que exige disparo manual
- [ ] T023 [P] [US1] Testes de progresso em `tests/unit/progresso.test.ts`: item pulado sai do numerador e do denominador; espera por disparo manual e pausa não entram no tempo restante; tempo vira estimativa quando há exercício livre pendente
- [ ] T024 [P] [US1] Teste de integração da tela de execução em `tests/integration/execucao.test.tsx`, cobrindo disparo manual, avanço automático de etapa e atualização dos indicadores

### Implementation for User Story 1

- [ ] T025 [P] [US1] Implementar o relógio injetável em `src/dominio/motor/relogio.ts` com a interface `Relogio` de `contracts/motor-execucao.md`
- [ ] T026 [US1] Implementar a expansão da prescrição em sequência linear em `src/dominio/expansao/expandir.ts`, aplicando a regra determinística de data-model.md, incluindo `exigeDisparoManual` no primeiro item de exercício manual e a ausência de item de preparação no primeiro exercício do treino
- [ ] T027 [US1] Implementar `reduzir(estado, evento, relogio)` em `src/dominio/motor/reduzir.ts`, cobrindo os eventos `iniciarSessao`, `dispararExercicio`, `iniciarAgora`, `adiar`, `pausar`, `retomar`, `pularItemAtual`, `marcarItem`, `concluirExercicioLivre` e `sincronizar`
- [ ] T028 [US1] Implementar o recálculo por tempo absoluto em `src/dominio/motor/sincronizar.ts`, resolvendo múltiplos itens vencidos de uma vez sem acumular ticks
- [ ] T029 [US1] Implementar as consultas derivadas em `src/dominio/progresso/calcular.ts`: `porcentagemConcluida`, `tempoRestanteSegundos` com marcador `estimado`, `itemAtual` e `itensParaTimeline`
- [ ] T030 [P] [US1] Implementar `SinalizadorDeTransicao` em `src/servicos/sinal.ts`, disparando háptica e som em paralelo, com falha de um não impedindo o outro nem interrompendo o treino
- [ ] T031 [P] [US1] Implementar `ControleDeTela` em `src/servicos/tela.ts` com keep-awake, liberando a tela ao concluir, pausar, sair ou desmontar
- [ ] T032 [P] [US1] Implementar `ObservadorDeCicloDeVida` em `src/servicos/cicloDeVida.ts`, disparando `sincronizar` ao voltar para primeiro plano
- [ ] T033 [US1] Implementar o store da sessão em `src/estado/sessao.ts`, ligando o motor às telas e aplicando os `Efeito` devolvidos por `reduzir`
- [ ] T034 [US1] Implementar a persistência incremental da sessão a cada transição de item em `src/estado/persistenciaDeSessao.ts`
- [ ] T035 [P] [US1] Implementar o item da timeline em `src/ui/timeline/ItemTimeline.tsx`, exibindo tempo previsto e os quatro estados, distinguindo concluído de pulado por forma e texto e não apenas por cor
- [ ] T036 [US1] Implementar a timeline vertical virtualizada em `src/ui/timeline/Timeline.tsx`, com destaque do item ativo e rolagem automática que não bloqueia a rolagem manual
- [ ] T037 [P] [US1] Implementar a barra de progresso e o tempo restante em `src/ui/comuns/BarraDeProgresso.tsx`, sempre visível durante a execução
- [ ] T038 [P] [US1] Implementar o botão de início em `src/ui/comuns/BotaoDeInicio.tsx` como elemento de maior destaque enquanto houver exercício aguardando disparo
- [ ] T039 [P] [US1] Implementar a contagem regressiva de preparação em `src/ui/comuns/ContagemRegressiva.tsx`, com as ações "iniciar agora" e "adiar"
- [ ] T040 [US1] Montar a tela de execução em `app/treino/[id]/execucao.tsx`, integrando timeline, indicadores, botão de início, contagem regressiva, tela acesa e sinais de transição
- [ ] T041 [US1] Implementar pausar, retomar, pular e marcar ou desmarcar item manualmente em `app/treino/[id]/execucao.tsx`
- [ ] T042 [US1] Implementar o exercício livre em `app/treino/[id]/execucao.tsx`: exibido sem tempo previsto, sem avanço automático e concluído manualmente
- [ ] T043 [US1] Implementar a escolha de retomar ou recomeçar em `app/treino/[id]/index.tsx`, oferecida apenas para sessão inacabada do mesmo dia e iniciando sessão zerada em dia diferente
- [ ] T044 [US1] Implementar a tela de encerramento do treino em `app/treino/[id]/encerramento.tsx`, indicando conclusão e quantos itens foram pulados
- [ ] T045 [P] [US1] Escrever o percurso end-to-end da execução em `tests/e2e/execucao-treino.yaml`

**Checkpoint**: US1 completa. O app já substitui a folha de papel do fisioterapeuta e constitui o MVP entregável.

---

## Phase 4: User Story 2 - Cadastrar e editar o treino prescrito (Priority: P2)

**Goal**: permitir cadastrar, editar, reordenar e excluir qualquer prescrição, incluindo série com repetição, exercício livre e configuração de disparo.

**Independent Test**: cadastrar do zero o treino de exemplo e verificar que a estrutura salva reflete a prescrição, inclusive exercício sem série e exercício livre.

### Tests for User Story 2 ⚠️

- [ ] T046 [P] [US2] Testes de integração do cadastro em `tests/integration/cadastro.test.tsx`: salvar exercício automático sem tempo de preparação é bloqueado; exercício adicionado sem série é aceito
- [ ] T047 [P] [US2] Testes de recálculo em `tests/unit/recalculo-apos-edicao.test.ts`: reordenar, editar ou remover itens recalcula a timeline e o tempo total previsto

### Implementation for User Story 2

- [ ] T048 [P] [US2] Implementar a lista de treinos em `app/index.tsx`, com acesso a criar, editar, executar e excluir
- [ ] T049 [US2] Implementar o formulário do treino em `app/treino/[id]/editar.tsx`, com nome, dias da semana e um ou mais horários sem duplicatas
- [ ] T050 [US2] Implementar o editor de série em `src/ui/editor/EditorDeSerie.tsx`, com `quantidadeDeSeries` maior ou igual a 1 e `descansoEntreSeriesSegundos` obrigatório quando a quantidade é maior que 1
- [ ] T051 [US2] Implementar o editor de exercício em `src/ui/editor/EditorDeExercicio.tsx`, com repetições, marcação de exercício livre, `modoDisparo` com padrão manual e `tempoPreparacaoSegundos` maior que 0 obrigatório no modo automático
- [ ] T052 [US2] Implementar o editor de etapas em `src/ui/editor/EditorDeEtapas.tsx`, com descrição de 1 a 120 caracteres e tempo de execução maior que 0
- [ ] T053 [US2] Implementar a reordenação de séries, exercícios e etapas em `src/ui/editor/Reordenacao.tsx`, reescrevendo posições contíguas
- [ ] T054 [US2] Implementar a exclusão de treino com confirmação em `app/index.tsx`
- [ ] T055 [P] [US2] Escrever o percurso end-to-end do cadastro em `tests/e2e/cadastro-treino.yaml`

**Checkpoint**: US1 e US2 funcionam de forma independente. O app atende qualquer prescrição.

---

## Phase 5: User Story 3 - Ser lembrada nos dias e horários do treino (Priority: P3)

**Goal**: emitir lembretes locais nos dias e horários configurados e levar direto à timeline do treino.

**Independent Test**: configurar um treino com horário próximo, fechar o app e verificar que o lembrete dispara e abre a timeline correta.

### Tests for User Story 3 ⚠️

- [ ] T056 [P] [US3] Testes do agendador em `tests/unit/lembretes.test.ts`: uma notificação por combinação de dia e horário; salvar cancela os agendamentos anteriores antes de criar os novos; permissão negada devolve `sucesso: false` sem lançar erro

### Implementation for User Story 3

- [ ] T057 [US3] Implementar `AgendadorDeLembretes` em `src/servicos/lembretes.ts` com gatilhos semanais, conforme `contracts/servicos-do-dispositivo.md`
- [ ] T058 [US3] Persistir o vínculo entre treino, dia, horário e identificador da notificação em `src/dados/repositorios/lembretes.ts`
- [ ] T059 [US3] Reagendar os lembretes ao salvar ou excluir um treino em `app/treino/[id]/editar.tsx`
- [ ] T060 [US3] Implementar a abertura direta da timeline a partir do lembrete em `app/_layout.tsx`
- [ ] T061 [US3] Exibir aviso de permissão negada ou falha de agendamento em `app/treino/[id]/editar.tsx`, sem bloquear salvar nem executar o treino
- [ ] T062 [US3] Suprimir o lembrete do horário já concluído no dia em `src/servicos/lembretes.ts`

**Checkpoint**: as três histórias funcionam de forma independente.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T063 [P] Implementar exportar e apagar todos os dados em `app/configuracoes.tsx`, conforme a interface `ExportacaoDeDados` de `contracts/persistencia.md`
- [ ] T064 [P] Revisar acessibilidade em todas as telas de `app/`: alvos de 48 dp, contraste AA e rótulos de acessibilidade nos controles de execução
- [ ] T065 [P] Revisar se toda string visível vem de `src/textos/index.ts` e está em português do Brasil
- [ ] T066 Medir e ajustar a fluidez da timeline em `src/ui/timeline/Timeline.tsx` para manter 60 fps em treinos longos
- [ ] T067 Executar em aparelho físico os 13 cenários de `specs/001-treino-fisioterapia/quickstart.md`, com atenção especial aos cenários 2, 3 e 4, que não são confiáveis em emulador
- [ ] T068 Revisar a conformidade da implementação com os seis princípios de `.specify/memory/constitution.md` e registrar o resultado no pull request

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências, começa imediatamente
- **Foundational (Phase 2)**: depende da Phase 1 e BLOQUEIA todas as histórias
- **User Stories (Phase 3, 4, 5)**: dependem da Phase 2; depois disso podem ser paralelizadas entre pessoas, ou seguidas em ordem de prioridade P1 → P2 → P3
- **Polish (Phase 6)**: depende das histórias desejadas estarem completas

### User Story Dependencies

- **US1 (P1)**: começa após a Phase 2. Não depende de US2 nem de US3, porque usa o treino de exemplo criado em T019
- **US2 (P2)**: começa após a Phase 2. Independente de US1; consome os mesmos repositórios da fundação
- **US3 (P3)**: começa após a Phase 2. Funciona melhor com US2, mas é testável isoladamente usando o treino de exemplo

### Within User Story 1

Esta é a única cadeia longa e rígida do projeto, porque tudo depende do motor:

```text
T020..T024 (testes, devem falhar)
   → T025 relógio
   → T026 expansão
   → T027 reduzir → T028 sincronizar → T029 progresso
   → T033 store → T034 persistência da sessão
   → T036 timeline → T040 tela de execução
   → T041, T042, T043, T044
```

T030, T031, T032, T035, T037, T038 e T039 não dependem do motor e podem ser feitos em paralelo a
qualquer momento após a Phase 2.

### Parallel Opportunities

- Phase 1: T003 a T007 em paralelo após T002
- Phase 2: T013, T014 e T018 em paralelo; T012, T017 e T019 em paralelo após seus alvos
- US1: os cinco arquivos de teste T020 a T024 em paralelo; os componentes de UI T035, T037, T038 e T039 em paralelo; os serviços T030, T031 e T032 em paralelo
- US2: T046 e T047 em paralelo; T048 em paralelo aos editores
- Entre histórias: com mais de uma pessoa, US1, US2 e US3 podem correr simultaneamente após a Phase 2

---

## Implementation Strategy

**MVP sugerido**: Phase 1 + Phase 2 + Phase 3 (US1), ou seja, T001 a T045. Entrega um app que
executa o treino de exemplo com precisão de tempo, timeline, checks e progresso — que é o valor
central do produto.

**Incrementos seguintes**: US2 destrava qualquer prescrição; US3 acrescenta aderência.

**Ordem recomendada para uma pessoa só**: seguir a numeração. Ela já respeita as dependências.

**Ponto de maior risco**: T026 a T029. É onde vivem os Princípios II e III, e é por isso que os
testes T020 a T023 vêm antes — eles definem, em código executável, o que "cronômetro correto"
significa antes que qualquer linha de implementação exista.
