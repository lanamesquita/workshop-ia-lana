<!--
SYNC IMPACT REPORT
Mudança de versão: 1.0.0 → 1.1.0
Tipo de bump: MINOR (novo princípio VI e expansão material dos princípios I e IV)

Princípios modificados:
- I. Fidelidade ao Modelo de Treino: adicionada configuração de disparo inicial do Exercício
  (manual por botão como padrão; encadeamento automático com tempo de preparação)
- III. Progresso Sempre Visível: tempo restante passa a considerar tempos de preparação e a
  ignorar a espera por disparo manual
- IV. Uso Durante o Exercício: avanço automático delimitado ao interior do exercício, sem
  contrariar o disparo manual entre exercícios

Princípios adicionados:
- VI. Timeline Vertical como Interface do Treino

Seções adicionadas: nenhuma
Seções removidas: nenhuma
TODOs pendentes: nenhum

Histórico:
- 1.0.0 (2026-09-09): ratificação inicial com os princípios I a V, Restrições de Plataforma e
  Dados, Fluxo de Desenvolvimento e Portões de Qualidade e Governança.
-->

# Constituição do App de Acompanhamento de Fisioterapia

## Core Principles

### I. Fidelidade ao Modelo de Treino (NÃO NEGOCIÁVEL)

A hierarquia do domínio é Treino → Série → Exercício → Etapa e MUST ser preservada em modelos,
APIs, persistência e interface. Regras obrigatórias:

- Um Treino MUST conter os dias da semana e os horários em que ocorre.
- A Série é OPCIONAL: um Treino MUST aceitar exercícios diretamente, sem série intermediária.
- Cada Série MUST possuir um tempo de descanso entre séries.
- Um Exercício MUST possuir uma quantidade de repetições e uma lista ordenada de Etapas, cada
  Etapa com descrição e tempo de execução.
- Um Exercício MUST poder ser marcado como livre, isto é, sem tempo e sem repetições.
- Cada Exercício MUST possuir uma configuração de disparo inicial, com dois modos suportados:
  manual e automático.
  - Manual é o padrão: o exercício só inicia quando o usuário aciona um botão de início visível
    na tela de execução.
  - Automático encadeia o exercício ao anterior e MUST exigir um tempo de preparação maior que
    zero, contado após a conclusão do item anterior e antes do início da primeira etapa.
  - Durante o tempo de preparação o app MUST exibir contagem regressiva e permitir que o usuário
    inicie imediatamente ou adie o início.
- Todo elemento da hierarquia MUST expor um estado de conclusão (check) individual.

Rationale: o app substitui a folha de exercícios entregue pelo fisioterapeuta; qualquer
simplificação do modelo quebra a prescrição real do tratamento. O disparo manual como padrão
protege o usuário, que precisa se posicionar antes de começar; o modo automático existe para
quem quer sequência contínua, e por isso o tempo de preparação é obrigatório.

### II. Temporização Confiável (NÃO NEGOCIÁVEL)

O cronômetro é o coração do produto. Regras obrigatórias:

- A contagem de tempo de etapas e de descanso entre séries MUST ter desvio máximo de 1% ou
  200 ms por etapa, o que for maior.
- A contagem MUST continuar correta com o app em segundo plano ou com a tela desligada; ao
  retornar, o estado MUST ser recalculado por tempo absoluto, nunca por acúmulo de ticks.
- Toda transição de etapa MUST emitir sinal perceptível sem olhar a tela (som e/ou vibração).
- A lógica de temporização MUST ser implementada em uma camada testável, independente da UI, e
  coberta por testes automatizados determinísticos com relógio injetável.

Rationale: um exercício executado com tempo errado tem valor terapêutico reduzido ou pode
causar lesão; erro de tempo é defeito crítico, não cosmético.

### III. Progresso Sempre Visível

Durante a execução de um treino, a interface MUST apresentar, de forma contínua e sem interação
do usuário:

- A porcentagem já concluída do treino, com barra ou indicador visual equivalente.
- O tempo restante estimado até o fim do treino.
- O item atualmente em execução e o próximo item.

O cálculo de porcentagem e de tempo restante MUST considerar etapas, repetições, descansos entre
séries e tempos de preparação, e MUST ser recalculado a cada conclusão ou pulo de item. O tempo
de espera por um disparo manual MUST NOT ser contabilizado no tempo restante estimado.
Exercícios livres MUST ser tratados com regra explícita e documentada no cálculo, já que não têm
duração previsível.

Rationale: o usuário está em movimento e precisa saber "quanto falta" em um relance.

### IV. Uso Durante o Exercício (Mobile-First e Offline)

O app MUST ser projetado para uso com o usuário deitado, sentado no chão ou com as mãos
ocupadas. Portanto:

- A execução de um treino MUST funcionar totalmente offline, sem dependência de rede.
- A tela de execução MUST manter alvos de toque de no mínimo 48 dp e contraste mínimo AA.
- O avanço automático entre etapas e repetições cronometradas de um mesmo exercício MUST ocorrer
  sem toque do usuário.
- O avanço de um exercício para o seguinte MUST respeitar a configuração de disparo definida no
  Princípio I e NÃO pode iniciar automaticamente um exercício configurado como manual.
- O botão de início do exercício MUST ser o elemento de maior destaque da tela enquanto houver
  um exercício aguardando disparo.
- Qualquer nova funcionalidade MUST justificar seu impacto na tela de execução; complexidade que
  atrapalhe a execução do treino MUST ser rejeitada ou movida para fora dessa tela.

Rationale: um app de fisioterapia usado no chão de casa não pode exigir atenção visual constante
nem conexão estável.

### V. Português do Brasil como Idioma Padrão

Interface, mensagens de erro, documentação, especificações, planos, tarefas e comunicação do
time MUST ser escritos em português do Brasil. Identificadores de código (nomes de variáveis,
funções, classes) e termos técnicos consagrados MAY permanecer em inglês, desde que os termos de
domínio (treino, série, exercício, etapa, repetição) sejam mantidos com significado consistente
em ambos os idiomas.

Rationale: a usuária final e o time trabalham em PT-BR; traduzir o domínio duas vezes gera
ambiguidade e erro de requisito.

### VI. Timeline Vertical como Interface do Treino

A tela do treino MUST ser uma timeline vertical que apresenta, em ordem de execução, todos os
elementos do treino e seus tempos. Regras obrigatórias:

- A timeline MUST exibir séries, exercícios, etapas, repetições, descansos entre séries e tempos
  de preparação como itens da mesma linha do tempo, respeitando a hierarquia visualmente.
- Cada item MUST mostrar seu tempo previsto e seu estado de conclusão (check).
- O item em execução MUST estar destacado e a timeline MUST rolar automaticamente para mantê-lo
  visível, sem impedir a rolagem manual do usuário.
- Exercícios livres MUST ser identificados como sem tempo previsto, em vez de exibir tempo zero.
- Qualquer visualização alternativa do treino é OPCIONAL e MUST NOT substituir a timeline
  vertical como interface principal.

Rationale: a timeline dá em uma única tela o que o papel do fisioterapeuta dá — a sequência
completa e a duração de cada parte — e serve de âncora para os checks e para o disparo manual.

## Restrições de Plataforma e Dados

- O alvo primário é aplicativo mobile; a experiência de execução de treino MUST ser validada em
  tela de celular antes de qualquer outra plataforma.
- O armazenamento primário dos treinos MUST ser local no dispositivo; sincronização remota é
  OPCIONAL e nunca pode ser pré-requisito para executar um treino.
- Os horários configurados no Treino MUST poder gerar lembretes locais; a falha em agendar
  lembrete NÃO pode impedir a execução manual do treino.
- Dados de treino são dados sensíveis de saúde: MUST NOT ser enviados a terceiros sem
  consentimento explícito do usuário, e qualquer envio MUST usar canal criptografado.
- O app MUST permitir exportar e apagar todos os dados do usuário.

## Fluxo de Desenvolvimento e Portões de Qualidade

- O trabalho segue o fluxo Spec Kit: especificação → plano → tarefas → implementação.
- Toda funcionalidade que envolva tempo, progresso ou conclusão MUST ter testes automatizados
  antes de ser considerada pronta.
- Nenhuma entrega é aceita se quebrar um dos princípios I a VI; a exceção MUST ser registrada na
  seção de Complexity Tracking do plano, com justificativa e alternativa descartada.
- Revisão de código MUST verificar explicitamente a conformidade com esta constituição.
- Bugs de temporização e de cálculo de progresso têm prioridade sobre novas funcionalidades.

## Governance

Esta constituição supersede quaisquer outras práticas ou convenções do projeto. Em caso de
conflito entre um documento de plano, tarefa ou código e esta constituição, a constituição
prevalece.

- Emendas MUST ser propostas por escrito, com a mudança, a justificativa e o impacto nos
  artefatos existentes, e MUST ser aprovadas pelo responsável do projeto antes de vigorarem.
- O versionamento segue MAJOR.MINOR.PATCH:
  - MAJOR: remoção ou redefinição incompatível de princípio ou regra de governança.
  - MINOR: novo princípio ou seção, ou expansão material de orientação existente.
  - PATCH: esclarecimentos, correções de redação e ajustes não semânticos.
- Toda emenda MUST atualizar a data de última alteração e registrar o Sync Impact Report no topo
  deste arquivo.
- A conformidade MUST ser revisada a cada entrega de funcionalidade e sempre que um novo plano
  for aprovado.

**Version**: 1.1.0 | **Ratified**: 2026-09-09 | **Last Amended**: 2026-09-09
