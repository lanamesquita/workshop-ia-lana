# Phase 0 — Pesquisa e Decisões Técnicas

**Feature**: 001 — App de Acompanhamento de Treino de Fisioterapia
**Data**: 2026-09-09
**Entrada do usuário**: "I am building with react native"

Este documento resolve as lacunas técnicas deixadas em aberto pela especificação. A spec
deliberadamente não fixou plataforma nem armazenamento; a escolha de React Native veio do
usuário e as demais decisões derivam dela e da constitution v1.1.0.

---

## D1. Distribuição do React Native: Expo com Dev Client

- **Decisão**: React Native através do Expo, em fluxo *managed* com Dev Client, usando
  `expo prebuild` apenas se algum módulo nativo exigir configuração fora do alcance dos plugins.
- **Rationale**: o app precisa de notificações locais agendadas, háptica, áudio curto,
  bloqueio de sleep da tela e SQLite. Todos existem como módulos oficiais do Expo, com
  configuração declarativa e sem manutenção de código nativo. Isso mantém o esforço concentrado
  no motor de tempo, que é onde está o risco real do produto.
- **Alternativas consideradas**:
  - *Bare React Native + bibliotecas da comunidade*: rejeitada. Traz custo de manutenção nativa
    (Podfile, Gradle, permissões) sem nenhum ganho para os requisitos desta feature.
  - *Nativo puro (Swift/Kotlin)*: rejeitada. Contraria a escolha do usuário e dobraria o esforço
    para atender uma única pessoa em tratamento.
- **Nota de versão**: a versão exata do SDK do Expo e do React Native é fixada na criação do
  projeto e registrada no `package.json`. Este plano não fixa números de versão para não
  envelhecer.

## D2. Cronômetro por tempo absoluto, fora do ciclo de vida da UI

- **Decisão**: a passagem de tempo é derivada de instantes absolutos (`Date.now()`), nunca de
  acúmulo de ticks. O estado guarda `iniciadoEm` e a duração planejada de cada item; a posição
  atual é sempre `agora - iniciadoEm`. O `setInterval` existe apenas para redesenhar a tela, e um
  tick perdido não altera o resultado.
- **Rationale**: este é o requisito mais arriscado do produto (Princípio II, FR-022, SC-002,
  SC-003). Em React Native os timers de JavaScript são estrangulados quando o app vai para
  segundo plano e param quando o dispositivo dorme. Qualquer implementação que some `+100ms` a
  cada tick acumula atraso proporcional ao tempo em background — exatamente o defeito que a
  constitution classifica como crítico.
- **Consequência de projeto**: ao voltar do background (`AppState` mudando para `active`), o
  motor recalcula o estado a partir do relógio, podendo saltar várias etapas de uma vez. O motor
  precisa suportar "avançar N itens" como operação única, não como sequência de ticks.
- **Alternativas consideradas**:
  - *Timer nativo em background*: rejeitada. Execução em segundo plano no iOS é restrita e não é
    necessária — o app não precisa *executar* em background, apenas *saber* quanto tempo passou.
  - *Acúmulo de ticks com correção periódica*: rejeitada. Mais código e ainda sujeito a deriva.

## D3. Motor de execução como máquina de estados pura em TypeScript

- **Decisão**: toda a lógica de execução — sequência achatada do treino, avanço de etapa e
  repetição, descanso entre séries, preparação, pausa, pulo, cálculo de porcentagem e de tempo
  restante — vive em um módulo puro, sem importar nada de React ou do React Native. Ele recebe o
  relógio por injeção e expõe `(estado, evento) => novoEstado`.
- **Rationale**: o Princípio II exige lógica de temporização "em uma camada testável,
  independente da UI, coberta por testes determinísticos com relógio injetável". Um módulo puro
  permite testar 30 minutos de treino em milissegundos, sem renderizar nada.
- **Alternativas consideradas**:
  - *Lógica dentro de hooks/componentes*: rejeitada. Viola o princípio e torna impossível testar
    saltos de tempo sem simular o ciclo de vida do React.
  - *Biblioteca de máquina de estados (XState)*: rejeitada por ora. A máquina aqui é simples e
    linear; a dependência extra não se paga. Pode ser reavaliada se surgirem estados paralelos.

## D4. Sequência achatada como estrutura de execução

- **Decisão**: antes de iniciar a sessão, o treino é expandido em uma lista linear de itens
  executáveis, cada um com tipo (preparação, etapa, descanso), duração planejada e referência ao
  elemento de origem. Repetições de exercício e repetições de série viram itens concretos na
  lista.
- **Rationale**: resolve de uma vez a timeline vertical (Princípio VI é uma renderização direta
  dessa lista), o cálculo de porcentagem e de tempo restante (soma sobre a lista) e o salto de
  vários itens ao voltar do background. Sem isso, cada um desses três requisitos precisaria
  percorrer a árvore Treino/Série/Exercício/Etapa com sua própria lógica de repetição.
- **Alternativas consideradas**:
  - *Percorrer a árvore com ponteiros aninhados*: rejeitada. Índices aninhados (série, repetição
    da série, exercício, repetição do exercício, etapa) são fonte garantida de erro de borda.

## D5. Persistência local em SQLite

- **Decisão**: `expo-sqlite` com uma camada de repositório e migrações versionadas. Os
  repositórios são interfaces; o SQLite é detalhe substituível.
- **Rationale**: o modelo tem cinco entidades relacionadas com ordenação explícita e sessões que
  crescem a cada execução. SQLite dá integridade referencial, ordenação e consulta sem carregar
  tudo em memória, e é totalmente local, atendendo FR-034 e FR-035.
- **Alternativas consideradas**:
  - *AsyncStorage com JSON*: rejeitada. Perde integridade e obriga reescrever o documento inteiro
    a cada check marcado durante o treino, que é o caminho mais quente do app.
  - *WatermelonDB / Realm*: rejeitada. Dimensionadas para sincronização e grandes volumes;
    excesso para um app de uso individual e offline.

## D6. Persistência do progresso durante a execução

- **Decisão**: a sessão é gravada de forma incremental a cada transição de item, guardando
  o índice atual, o instante de início do item e os estados dos itens já resolvidos.
- **Rationale**: FR-025a exige retomar de onde parou mesmo após o app ser encerrado pelo sistema.
  Como o estado é reconstruído por tempo absoluto (D2), basta persistir os instantes: a retomada
  recalcula sozinha onde o treino deveria estar.
- **Alternativas consideradas**:
  - *Salvar apenas ao sair da tela*: rejeitada. O sistema operacional pode matar o app sem aviso.

## D7. Lembretes por notificação local semanal

- **Decisão**: `expo-notifications` com gatilhos semanais, um por combinação de dia da semana e
  horário do treino. O reagendamento ocorre sempre que o treino é criado ou editado.
- **Rationale**: atende FR-033 sem servidor e sem rede. O agendamento semanal nativo sobrevive ao
  app fechado e ao reinício do aparelho.
- **Consequência de projeto**: a falha em agendar, inclusive por permissão negada, é registrada e
  exibida como aviso, mas nunca bloqueia a execução do treino, conforme exige o Princípio IV.
- **Alternativas consideradas**:
  - *Alarme calculado pelo app em primeiro plano*: rejeitada. Não funciona com o app fechado.

## D8. Sinais de transição: háptica e som curto

- **Decisão**: vibração via `expo-haptics` combinada com um som curto via módulo de áudio do
  Expo, disparados juntos a cada transição, com o áudio configurado para tocar mesmo com a tela
  bloqueada.
- **Rationale**: FR-021 e o Princípio IV exigem sinal perceptível sem olhar a tela. Emitir os
  dois em paralelo cobre o caso do aparelho no silencioso, em que resta a vibração, e o caso da
  vibração desativada, em que resta o som.
- **Alternativas consideradas**:
  - *Somente som*: rejeitada. Falha no silencioso, que é o cenário comum em casa.
  - *Notificação como sinal*: rejeitada. Depende de permissão e é intrusiva demais para uma
    transição que ocorre a cada poucos segundos.

## D9. Tela sempre acesa durante a execução

- **Decisão**: `expo-keep-awake` ativado ao entrar na execução e desativado ao concluir, pausar
  ou sair.
- **Rationale**: decisão registrada na sessão de clarificação e materializada em FR-022a e
  SC-004. O escopo restrito à tela de execução evita consumo de bateria fora do treino.

## D10. Interface: Expo Router e timeline virtualizada

- **Decisão**: navegação com Expo Router; a timeline vertical renderizada com `FlashList` ou
  `FlatList` sobre a sequência achatada de D4, com rolagem automática até o item ativo sem
  bloquear a rolagem manual do usuário.
- **Rationale**: FR-014 a FR-018. Um treino com várias séries e repetições gera dezenas a
  centenas de itens; a lista virtualizada mantém a fluidez exigida na tela mais usada do app.
- **Alternativas consideradas**:
  - *ScrollView simples*: rejeitada. Renderiza tudo de uma vez e degrada em treinos longos.

## D11. Estado da aplicação com Zustand

- **Decisão**: Zustand como camada fina de estado, servindo apenas de ponte entre o motor puro
  (D3) e os componentes.
- **Rationale**: o estado real vive no motor; a camada de estado só precisa distribuir e
  notificar. Zustand faz isso com pouca cerimônia e sem provider aninhado.
- **Alternativas consideradas**:
  - *Redux Toolkit*: rejeitada. Cerimônia desproporcional ao tamanho do app.
  - *Apenas Context*: rejeitada. Re-renderiza demais em uma tela que atualiza a cada tick.

## D12. Estratégia de testes

- **Decisão**: três camadas.
  1. *Unitários* com Jest sobre o motor de execução e o cálculo de progresso, usando relógio
     falso e saltos de tempo explícitos. É onde mora a cobertura dos princípios II e III.
  2. *Integração* com `@testing-library/react-native` nas telas de execução e cadastro,
     incluindo repositórios contra um SQLite em memória.
  3. *End-to-end* com Maestro para o percurso completo do treino de exemplo em dispositivo.
- **Rationale**: o portão de qualidade da constitution exige testes automatizados antes de
  considerar pronta qualquer funcionalidade que envolva tempo, progresso ou conclusão.
- **Alternativas consideradas**:
  - *Detox no lugar do Maestro*: aceitável, porém mais custoso de configurar e manter; Maestro
    descreve o percurso em YAML e basta para os cenários desta feature.

## D13. Textos em português centralizados

- **Decisão**: todas as strings visíveis ficam em um módulo único de textos em PT-BR, sem
  biblioteca de internacionalização nesta versão.
- **Rationale**: o Princípio V exige PT-BR, e a spec declara idioma único. Centralizar mantém a
  consistência do vocabulário de domínio e deixa o caminho aberto para i18n futura sem reescrever
  as telas.

## D14. Acessibilidade e conformidade visual

- **Decisão**: alvos de toque de no mínimo 48 dp, contraste mínimo AA e rótulos de
  acessibilidade em todos os controles da execução; o estado do item na timeline é comunicado por
  forma e texto, não apenas por cor.
- **Rationale**: Princípio IV e FR-023a. Distinguir "concluído" de "pulado" apenas por cor
  falharia para daltônicos e sob luz forte.

---

## Lacunas remanescentes

Nenhuma. Todos os pontos de NEEDS CLARIFICATION do Technical Context foram resolvidos por estas
decisões.
