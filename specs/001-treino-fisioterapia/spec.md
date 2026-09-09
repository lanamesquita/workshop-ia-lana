# Feature Specification: App de Acompanhamento de Treino de Fisioterapia

**Feature Branch**: `master` (sem branch dedicada; diretório da feature: `specs/001-treino-fisioterapia`)

**Created**: 2026-09-09

**Status**: Draft

**Input**: User description: "Sistema mobile para acompanhar os exercícios de fisioterapia passados para fazer em casa, com controle do tempo de cada etapa do exercício, quantidade de repetições e quantidade de séries. Treino formado por séries de exercícios ou exercícios diretos, com dias da semana e horários. Série é um conjunto de exercícios com tempo entre séries; organizar por série não é obrigatório. Exercício é um conjunto de etapas com descrição e tempo de execução, possui repetições e pode ser livre de tempo e repetição. Cada elemento deve ter um check indicando conclusão. O sistema deve mostrar barra ou símbolo com a porcentagem já realizada e o tempo restante para finalizar o treino. O disparo inicial de cada exercício é manual por um botão em tela, com opção de iniciar automaticamente após o anterior definindo um tempo de preparação. A interface do treino deve ser uma timeline vertical com todos os elementos e seus tempos."

## Clarifications

### Session 2026-09-09

- Q: Uma Série pode se repetir várias vezes dentro do treino, ou cada repetição do grupo é
  cadastrada separadamente? → A: A Série tem um campo "quantidade de séries": o grupo de
  exercícios se repete N vezes, com o tempo de descanso aplicado entre cada repetição do grupo e
  não após a última.
- Q: Quando o mesmo treino é executado mais de uma vez no dia, os checks de conclusão zeram a
  cada execução? → A: Cada execução é uma Sessão própria com checks próprios; ao abrir o treino,
  se houver sessão inacabada do mesmo dia o app oferece retomar ou recomeçar, e em um novo dia a
  execução sempre começa zerada.
- Q: Quando o usuário pula um item durante o treino, esse item conta como concluído no cálculo da
  porcentagem? → A: Não. O item pulado sai do cálculo, sendo removido do total, e fica marcado na
  timeline como pulado, em estado visualmente distinto de concluído.
- Q: O que acontece quando o usuário aciona "adiar" durante a contagem de preparação de um
  exercício automático? → A: A contagem é cancelada e o exercício passa a aguardar o botão de
  início apenas nesta sessão; a configuração automática do exercício permanece intacta para as
  próximas execuções.
- Q: O app deve manter a tela do celular ligada enquanto o treino está em execução? → A: Sim. A
  tela permanece ligada durante toda a execução e volta ao comportamento normal do sistema ao
  terminar, pausar ou sair do treino.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Executar o treino do dia acompanhando tempo e progresso (Priority: P1)

A pessoa em tratamento abre o app na hora do treino, vê a timeline vertical com toda a sequência
do dia e seus tempos, aciona o botão de início do primeiro exercício e é conduzida etapa por
etapa: o app cronometra cada etapa, avisa por som e vibração a cada transição, conta as
repetições, cronometra o descanso entre séries e marca automaticamente os checks concluídos.
Enquanto isso, ela vê a qualquer momento a porcentagem já realizada e o tempo restante até o fim
do treino, sem precisar tocar na tela.

**Why this priority**: é a razão de existir do produto. Sem ela o app não substitui a folha de
papel do fisioterapeuta. Entrega valor sozinha e é a única história indispensável para um MVP.

**Independent Test**: pode ser testada de ponta a ponta com um treino de exemplo já carregado no
app (o treino da Lana descrito no material de origem), sem depender das telas de cadastro.
Executar o treino inteiro do início ao fim e verificar tempos, checks, porcentagem e tempo
restante.

**Acceptance Scenarios**:

1. **Given** um treino com uma série e dois exercícios cronometrados, **When** a usuária abre a
   tela do treino, **Then** o app exibe uma timeline vertical com série, exercícios, etapas,
   repetições e descansos, cada um com seu tempo previsto e seu check em branco.
2. **Given** a timeline exibida e nenhum exercício em andamento, **When** a usuária aciona o botão
   de início do primeiro exercício, **Then** a primeira etapa começa a ser cronometrada e passa a
   ser o item destacado da timeline.
3. **Given** uma etapa de 7 segundos em andamento, **When** o tempo se esgota, **Then** o app
   emite sinal sonoro e vibração, marca a etapa como concluída e inicia a etapa seguinte sem
   nenhum toque da usuária.
4. **Given** a última etapa da última repetição de um exercício, **When** ela é concluída,
   **Then** o exercício é marcado como concluído e o app aguarda o disparo do próximo exercício
   conforme a configuração dele.
5. **Given** um treino em execução, **When** a usuária olha a tela em qualquer momento, **Then**
   a porcentagem concluída e o tempo restante estimado estão visíveis e atualizados.
6. **Given** um exercício em andamento, **When** a usuária bloqueia a tela por 3 minutos e
   retorna, **Then** o app mostra o estado correto do treino para o instante atual, sem atraso
   acumulado.
7. **Given** todos os itens concluídos, **When** o último check é marcado, **Then** o app indica
   100% de conclusão e apresenta o encerramento do treino.

---

### User Story 2 - Cadastrar e editar o treino prescrito (Priority: P2)

A pessoa recebe a prescrição do fisioterapeuta e cadastra no app o treino: nome, dias da semana,
horários, séries (quando houver), exercícios com repetições e etapas com descrição e tempo, além
de escolher para cada exercício se o disparo é manual ou automático com tempo de preparação.

**Why this priority**: sem cadastro o app só serve para o treino de exemplo, mas a execução
(P1) já entrega valor antes disso. É a segunda história porque destrava o uso por qualquer
pessoa com qualquer prescrição.

**Independent Test**: cadastrar do zero o treino de exemplo do material de origem e verificar que
a estrutura salva reflete exatamente a prescrição, inclusive exercício livre e exercício sem
série.

**Acceptance Scenarios**:

1. **Given** a tela de criação de treino, **When** a usuária informa nome, dias da semana e um ou
   mais horários, **Then** o treino é salvo e passa a aparecer na lista de treinos.
2. **Given** um treino em edição, **When** a usuária adiciona um exercício diretamente ao treino
   sem criar nenhuma série, **Then** o app aceita a estrutura sem exigir série.
3. **Given** uma série em edição, **When** a usuária informa a quantidade de séries e o tempo de
   descanso entre séries, **Then** o grupo de exercícios passa a aparecer repetido essa
   quantidade de vezes na timeline, com o descanso entre as repetições e não após a última.
4. **Given** um exercício em edição, **When** a usuária marca o exercício como livre, **Then** o
   app dispensa tempo de etapa e quantidade de repetições para aquele exercício.
5. **Given** um exercício em edição, **When** a usuária escolhe disparo automático, **Then** o app
   exige um tempo de preparação maior que zero antes de permitir salvar.
6. **Given** um exercício em edição sem escolha explícita de disparo, **When** a usuária salva,
   **Then** o exercício é salvo com disparo manual.
7. **Given** um treino salvo, **When** a usuária reordena, edita ou remove exercícios e etapas,
   **Then** a timeline e o tempo total previsto são recalculados.

---

### User Story 3 - Ser lembrada nos dias e horários do treino (Priority: P3)

Nos dias da semana e horários configurados, a pessoa recebe um lembrete no celular e, ao
acioná-lo, cai direto na timeline do treino correspondente, pronta para iniciar.

**Why this priority**: melhora a aderência ao tratamento, mas o treino pode ser executado sem
lembrete algum. É valor incremental sobre P1 e P2.

**Independent Test**: configurar um treino com horário próximo e verificar que o lembrete dispara
no dia e horário certos e abre a timeline correta.

**Acceptance Scenarios**:

1. **Given** um treino configurado para segunda, quarta e sexta às 8h, 13h e 18h, **When** chega
   uma dessas datas e horários, **Then** o app emite um lembrete identificando o treino.
2. **Given** um lembrete recebido, **When** a usuária o aciona, **Then** o app abre a timeline do
   treino correspondente pronta para o disparo do primeiro exercício.
3. **Given** um treino já concluído no horário do dia, **When** o lembrete daquele horário
   dispararia, **Then** o app não insiste com um novo lembrete para o mesmo horário.

---

### Edge Cases

- Como o app calcula porcentagem e tempo restante quando o treino contém exercícios livres, que
  não têm duração previsível?
- O que acontece se a usuária nunca acionar o botão de início e deixar o app parado por muito
  tempo aguardando o disparo manual?
- O que acontece se a usuária receber uma ligação ou trocar de app no meio de uma etapa
  cronometrada?
- O que acontece se o celular estiver no silencioso ou com a vibração desativada no momento da
  transição de etapa?
- Como o app se comporta se a usuária marcar manualmente um item como concluído antes do tempo,
  ou desmarcar um item já concluído?
- O que acontece se a usuária abandonar o treino pela metade e voltar horas depois, ou já em
  outro dia?
- Como a timeline se comporta em um treino longo, em que os itens não cabem na tela?
- O que acontece durante o tempo de preparação de um exercício automático se a usuária ainda não
  estiver posicionada?
- O que acontece se dois horários do mesmo treino estiverem muito próximos ou se a usuária
  executar o mesmo treino duas vezes no mesmo dia?
- Como o app trata um treino cadastrado sem nenhum exercício, ou uma série sem exercícios?

## Requirements *(mandatory)*

### Functional Requirements

#### Estrutura do treino

- **FR-001**: O sistema MUST permitir criar, editar e excluir treinos, com nome, dias da semana e
  um ou mais horários de ocorrência.
- **FR-002**: O sistema MUST aceitar treinos compostos por séries, por exercícios diretos, ou por
  ambos, sem exigir a criação de séries.
- **FR-003**: O sistema MUST permitir que cada série contenha uma lista ordenada de exercícios,
  uma quantidade de séries maior ou igual a 1 e um tempo de descanso entre séries.
- **FR-003a**: O sistema MUST repetir o grupo de exercícios da série tantas vezes quantas forem a
  quantidade de séries configurada, aplicando o tempo de descanso entre uma repetição do grupo e
  a seguinte, e MUST NOT aplicar o descanso após a última repetição do grupo.
- **FR-004**: O sistema MUST permitir que cada exercício tenha nome, quantidade de repetições e
  uma lista ordenada de etapas, cada etapa com descrição e tempo de execução.
- **FR-005**: O sistema MUST permitir marcar um exercício como livre, dispensando tempo de etapa
  e quantidade de repetições.
- **FR-006**: O sistema MUST permitir reordenar séries, exercícios e etapas dentro de um treino, e
  MUST recalcular o tempo total previsto após qualquer alteração.

#### Disparo do exercício

- **FR-007**: O sistema MUST armazenar, para cada exercício, um modo de disparo inicial: manual
  ou automático.
- **FR-008**: O sistema MUST adotar o disparo manual como padrão quando o modo não for informado.
- **FR-009**: Usuários MUST ser capazes de iniciar um exercício de disparo manual por meio de um
  botão de início visível na tela de execução.
- **FR-010**: O sistema MUST exigir um tempo de preparação maior que zero para todo exercício
  configurado com disparo automático, e MUST impedir o salvamento sem esse tempo.
- **FR-011**: O sistema MUST contar o tempo de preparação após a conclusão do item anterior e
  antes do início da primeira etapa do exercício automático, exibindo contagem regressiva.
- **FR-012**: Durante o tempo de preparação, usuários MUST ser capazes de iniciar imediatamente
  ou adiar o início do exercício.
- **FR-012a**: Ao adiar, o sistema MUST cancelar a contagem de preparação e passar a aguardar o
  acionamento do botão de início, MUST limitar esse efeito à sessão em andamento e MUST NOT
  alterar a configuração de disparo automático do exercício.
- **FR-013**: O sistema MUST NOT iniciar automaticamente um exercício configurado como manual.

#### Interface do treino

- **FR-014**: O sistema MUST apresentar o treino como uma timeline vertical contendo, em ordem de
  execução, séries, cada repetição da série, exercícios, etapas, repetições, descansos entre
  séries e tempos de preparação.
- **FR-015**: O sistema MUST exibir, em cada item da timeline, o tempo previsto e o estado do
  item: pendente, em execução, concluído ou pulado.
- **FR-016**: O sistema MUST destacar o item em execução e rolar a timeline automaticamente para
  mantê-lo visível, sem impedir a rolagem manual.
- **FR-017**: O sistema MUST identificar exercícios livres como sem tempo previsto, em vez de
  exibir tempo zero.
- **FR-018**: O sistema MUST manter o botão de início como elemento de maior destaque da tela
  enquanto houver um exercício aguardando disparo.

#### Execução e temporização

- **FR-019**: O sistema MUST cronometrar cada etapa pelo tempo configurado e avançar
  automaticamente para a próxima etapa ou repetição sem toque do usuário.
- **FR-020**: O sistema MUST cronometrar o descanso entre séries e tratá-lo como item da execução.
- **FR-021**: O sistema MUST emitir sinal sonoro e vibração a cada transição de etapa, repetição,
  descanso e preparação.
- **FR-022**: O sistema MUST manter a contagem de tempo correta com o app em segundo plano ou com
  a tela desligada, recalculando o estado por tempo absoluto ao retornar.
- **FR-022a**: O sistema MUST impedir que a tela apague automaticamente enquanto houver um treino
  em execução, e MUST devolver o comportamento padrão do sistema ao concluir, pausar ou sair do
  treino.
- **FR-023**: Usuários MUST ser capazes de pausar, retomar e pular o item em execução.
- **FR-023a**: O sistema MUST registrar o item pulado com um estado próprio, distinto de
  concluído e de pendente, e MUST exibi-lo na timeline de forma visualmente diferente de um item
  concluído.
- **FR-024**: O sistema MUST permitir que exercícios livres sejam concluídos manualmente pelo
  usuário, já que não têm término cronometrado.
- **FR-025**: O sistema MUST registrar cada execução de um treino como uma sessão própria, com
  seus próprios checks e seu próprio progresso.
- **FR-025a**: O sistema MUST preservar o progresso de uma sessão interrompida e, ao abrir o
  treino no mesmo dia, MUST oferecer ao usuário retomar do ponto em que parou ou recomeçar do
  zero.
- **FR-025b**: O sistema MUST iniciar uma sessão zerada quando o treino for aberto em um dia
  diferente do da última sessão inacabada.

#### Conclusão e progresso

- **FR-026**: O sistema MUST expor um check de conclusão individual para treino, série,
  exercício e etapa, sempre no escopo da sessão em andamento.
- **FR-027**: O sistema MUST marcar automaticamente o check ao concluir um item cronometrado, e
  MUST permitir que o usuário marque e desmarque itens manualmente.
- **FR-028**: O sistema MUST exibir de forma contínua, durante a execução, a porcentagem
  concluída do treino em barra ou indicador visual equivalente.
- **FR-029**: O sistema MUST exibir de forma contínua o tempo restante estimado até o fim do
  treino.
- **FR-030**: O sistema MUST calcular porcentagem e tempo restante considerando etapas,
  repetições, quantidade de séries, descansos entre séries e tempos de preparação, recalculando a
  cada conclusão ou pulo de item.
- **FR-030a**: O sistema MUST remover o item pulado do total considerado no cálculo da
  porcentagem concluída e do tempo restante, e MUST NOT contabilizá-lo como concluído.
- **FR-031**: O sistema MUST NOT contabilizar no tempo restante estimado o tempo de espera por um
  disparo manual.
- **FR-032**: O sistema MUST indicar a conclusão do treino quando todos os itens não pulados
  estiverem concluídos, e MUST informar quantos itens foram pulados na sessão.

#### Lembretes, dados e disponibilidade

- **FR-033**: O sistema MUST permitir a emissão de lembretes nos dias da semana e horários
  configurados no treino, e MUST NOT impedir a execução manual do treino caso o lembrete falhe.
- **FR-034**: O sistema MUST permitir executar um treino integralmente sem conexão de rede.
- **FR-035**: O sistema MUST armazenar os treinos no próprio dispositivo.
- **FR-036**: Usuários MUST ser capazes de exportar e de apagar todos os seus dados.
- **FR-037**: O sistema MUST apresentar toda a interface e as mensagens em português do Brasil.

### Key Entities

- **Treino**: a prescrição completa a ser executada. Possui nome, dias da semana, horários de
  ocorrência, estado de conclusão da sessão e uma lista ordenada de itens, que podem ser séries
  ou exercícios diretos.
- **Série**: agrupamento opcional de exercícios dentro de um treino. Possui ordem, quantidade de
  séries (quantas vezes o grupo se repete), tempo de descanso entre séries e estado de conclusão
  por repetição do grupo e do conjunto.
- **Exercício**: unidade de execução. Possui nome, quantidade de repetições, indicador de
  exercício livre, modo de disparo inicial (manual ou automático), tempo de preparação quando
  automático, lista ordenada de etapas e estado de conclusão.
- **Etapa**: menor unidade de execução. Possui descrição, tempo de execução, ordem dentro do
  exercício e estado de conclusão.
- **Sessão de Execução**: o registro de uma execução do treino em uma data e horário. É a dona
  dos checks e do progresso: guarda o ponto em que a execução está, os itens já concluídos e os
  instantes de início e fim. Cada execução do treino origina uma sessão nova, permitindo executar
  o mesmo treino várias vezes no mesmo dia sem interferência entre elas.
- **Lembrete**: a combinação de um treino com um dia da semana e um horário que origina um aviso
  ao usuário.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: a partir da abertura do app, o usuário inicia o treino do dia em no máximo 3 toques
  e menos de 15 segundos.
- **SC-002**: o tempo cronometrado de cada etapa não difere do tempo configurado em mais de 1% ou
  200 milissegundos, o que for maior, em 100% das execuções medidas.
- **SC-003**: em 100% das execuções em que a tela permanece bloqueada por até 30 minutos, o
  estado do treino ao retornar corresponde ao instante real, sem atraso acumulado.
- **SC-004**: durante 100% do tempo de execução do treino, a porcentagem concluída e o tempo
  restante estão visíveis sem qualquer interação do usuário e sem que a tela apague sozinha.
- **SC-005**: o usuário conclui um treino cronometrado inteiro sem tocar na tela, exceto nos
  disparos manuais configurados por ele.
- **SC-006**: um usuário novo cadastra o treino de exemplo, com uma série, dois exercícios e
  quatro etapas, em menos de 5 minutos na primeira tentativa, sem ajuda externa.
- **SC-007**: 90% dos usuários identificam corretamente, em menos de 3 segundos de observação da
  timeline, qual é o item em execução e quanto falta para o fim do treino.
- **SC-008**: 100% das funções de execução de treino funcionam com o dispositivo em modo avião.
- **SC-009**: 90% dos treinos iniciados são concluídos até o fim, medido ao longo de quatro
  semanas de uso.

## Assumptions

- O app é de uso pessoal e individual: não há contas, login, perfis múltiplos nem área do
  fisioterapeuta nesta versão.
- O próprio usuário cadastra a prescrição no app; não há integração com sistemas de clínica ou
  importação de prescrição.
- Os dados ficam no dispositivo. Sincronização em nuvem e backup remoto estão fora do escopo
  desta versão; a exportação de dados atende à necessidade de cópia.
- Exercícios livres entram no cálculo de porcentagem pela contagem de itens concluídos, mas não
  somam tempo previsto; o tempo restante exibido é apresentado como estimativa quando o treino
  contém exercícios livres.
- Quando o app aguarda um disparo manual, o cronômetro do treino permanece parado e a espera não
  é contabilizada no tempo restante.
- Se o dispositivo estiver no silencioso, a vibração é o sinal de transição; se ambos estiverem
  indisponíveis, permanece o destaque visual na timeline.
- Histórico de longo prazo, relatórios de aderência, gráficos de evolução e compartilhamento com
  o fisioterapeuta estão fora do escopo desta versão. As sessões são registradas apenas para
  permitir a retomada e o cálculo de progresso, sem tela de histórico nesta versão.
- Vídeos, imagens ou animações demonstrativas dos exercícios estão fora do escopo desta versão; a
  etapa é descrita por texto.
- A escolha de plataforma mobile, framework e mecanismo de armazenamento é decisão da fase de
  plano, não desta especificação.
- Os lembretes dependem das permissões de notificação concedidas pelo usuário no sistema
  operacional.
