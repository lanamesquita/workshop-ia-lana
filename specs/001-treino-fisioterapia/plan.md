# Implementation Plan: App de Acompanhamento de Treino de Fisioterapia

**Branch**: `001-treino-fisioterapia` | **Date**: 2026-09-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-treino-fisioterapia/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command; its definition describes the execution workflow.

## Summary

Aplicativo mobile que conduz a execução de treinos de fisioterapia em casa, cronometrando cada
etapa, contando repetições e séries, exibindo o treino como timeline vertical e mostrando de
forma contínua a porcentagem concluída e o tempo restante.

A abordagem técnica gira em torno de duas decisões que sustentam todo o resto. Primeiro, a
prescrição é **expandida em uma sequência linear de itens executáveis** ao iniciar a sessão, o
que transforma timeline, porcentagem e tempo restante em operações sobre uma única lista.
Segundo, o tempo é sempre derivado de **instantes absolutos**, nunca de acúmulo de ticks, porque
timers de JavaScript em React Native são estrangulados em segundo plano — um motor de execução
puro em TypeScript, com relógio injetável, concentra essa lógica fora da UI e a torna
deterministicamente testável.

## Technical Context

**Language/Version**: TypeScript em modo estrito, sobre React Native distribuído pelo Expo
(versões fixadas no `package.json` na criação do projeto)

**Primary Dependencies**: Expo Router (navegação), `expo-sqlite` (persistência),
`expo-notifications` (lembretes), `expo-haptics` e módulo de áudio do Expo (sinais de transição),
`expo-keep-awake` (tela acesa), Zustand (estado), lista virtualizada para a timeline

**Storage**: SQLite local no dispositivo, atrás de interfaces de repositório, com migrações
versionadas. Sem backend e sem sincronização.

**Testing**: Jest com relógio falso para o motor de execução;
`@testing-library/react-native` e SQLite em memória para integração; Maestro para o percurso
end-to-end em dispositivo

**Target Platform**: iOS e Android, aparelho físico como alvo de validação dos cenários de tempo

**Project Type**: mobile-app de app único, sem componente de servidor

**Performance Goals**: 60 fps na timeline durante a execução; desvio de cronômetro não superior
ao maior valor entre 1% da duração do item e 200 ms; atualização visual do cronômetro a cada
100 a 250 ms

**Constraints**: funcionamento integral offline; estado correto após retorno de segundo plano ou
tela desligada; alvos de toque de no mínimo 48 dp; contraste mínimo AA; interface e mensagens em
português do Brasil

**Scale/Scope**: uso individual, sem contas nem multiusuário; ordem de 8 a 12 telas; treinos de
dezenas a poucas centenas de itens executáveis após a expansão

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Avaliação contra a constitution v1.1.0. Resultado idêntico antes da Phase 0 e após a Phase 1.

| Princípio | Portão | Como o desenho atende | Status |
|---|---|---|---|
| I. Fidelidade ao Modelo de Treino | Hierarquia preservada, série opcional, exercício livre, disparo configurável | Camada de prescrição em [data-model.md](./data-model.md) espelha Treino/Série/Exercício/Etapa; exercício pode pender direto do treino; `modoDisparo` com padrão manual e preparação obrigatória no automático | PASS |
| II. Temporização Confiável | Lógica de tempo isolada, testável, com relógio injetável e tempo absoluto | Motor puro em TypeScript sem dependência de React ([contracts/motor-execucao.md](./contracts/motor-execucao.md)); invariantes 1, 2 e 8 traduzem o limite de desvio em teste automático | PASS |
| III. Progresso Sempre Visível | Porcentagem e tempo restante contínuos, cálculo definido | Consultas derivadas sobre a sequência achatada; preparação e descanso somam, espera manual não soma, item pulado sai do total | PASS |
| IV. Mobile-First e Offline | Offline total, 48 dp, contraste AA, avanço sem toque | SQLite local sem backend; avanço automático dentro do exercício; tela mantida acesa; sinal redúndate de som e háptica | PASS |
| V. Português do Brasil | Interface, mensagens e artefatos em PT-BR | Módulo único de textos em PT-BR; toda a documentação desta feature em português | PASS |
| VI. Timeline Vertical | Timeline como interface principal do treino | Lista vertical virtualizada renderizando diretamente a sequência achatada, com item ativo destacado e rolagem automática | PASS |

**Resultado**: nenhuma violação. Nenhuma exceção precisa ser justificada.

## Project Structure

### Documentation (this feature)

```text
specs/001-treino-fisioterapia/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/                          # rotas do Expo Router
├── index.tsx                  # lista de treinos
├── treino/[id]/index.tsx      # timeline do treino
├── treino/[id]/execucao.tsx   # tela de execução
├── treino/[id]/editar.tsx     # cadastro e edição
└── configuracoes.tsx          # exportar e apagar dados

src/
├── dominio/
│   ├── modelo/                # tipos de Treino, Série, Exercício, Etapa, Sessão
│   ├── expansao/              # prescrição → sequência de itens executáveis
│   ├── motor/                 # máquina de estados da execução (puro, sem React)
│   └── progresso/             # porcentagem e tempo restante
├── dados/
│   ├── sqlite/                # abertura do banco e migrações versionadas
│   └── repositorios/          # implementações dos contratos de persistência
├── servicos/                  # sinal de transição, tela acesa, lembretes, ciclo de vida
├── estado/                    # ponte Zustand entre motor e telas
├── ui/
│   ├── timeline/              # lista vertical, item, destaque, auto-scroll
│   └── comuns/                # botão de início, barra de progresso, contagem regressiva
└── textos/                    # strings em PT-BR

tests/
├── unit/                      # motor, expansão e progresso com relógio falso
├── integration/               # telas e repositórios contra SQLite em memória
└── e2e/                       # percursos Maestro
```

**Structure Decision**: app único Expo, sem componente de servidor, porque a spec exige
funcionamento integral offline e armazenamento local. A separação entre `src/dominio` e as demais
pastas é a materialização do Princípio II: `dominio/motor` e `dominio/progresso` não importam
nada de React, React Native ou SQLite, e por isso podem ser testados com salto de tempo
arbitrário. `dados/` e `servicos/` implementam os contratos de
[contracts/](./contracts/), mantendo SQLite e as APIs do dispositivo como detalhes
substituíveis.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Nenhuma violação da constitution. Nada a justificar.
