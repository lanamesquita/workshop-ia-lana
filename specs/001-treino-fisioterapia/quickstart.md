# Quickstart — Validação da Feature 001

**Feature**: App de Acompanhamento de Treino de Fisioterapia
**Objetivo**: provar, de ponta a ponta, que a feature atende à spec e à constitution.

Este é um guia de execução e validação. Detalhes de estrutura estão em
[data-model.md](./data-model.md) e as fronteiras em [contracts/](./contracts/).

## Pré-requisitos

- Node.js LTS e npm
- Expo CLI (via `npx`)
- Para o percurso em dispositivo: Expo Go ou um build de desenvolvimento, em aparelho físico
- Maestro instalado, apenas para os cenários end-to-end

> O aparelho físico é obrigatório para os cenários de tempo e background. Emulador não reproduz
> de forma confiável o estrangulamento de timers nem o comportamento da tela desligada.

## Preparação

```powershell
npm install
npm run test          # unitários e integração
npm run lint
npx expo start        # abre o app no dispositivo
```

Os cenários abaixo pressupõem o **treino de exemplo** disponível no app: série única, exercício
"Contrair" com 8 repetições (etapas de 7s e 4s) e exercício "Contrai/Relaxa" com 10 repetições
(etapas de 2s e 2s), ambos com disparo manual. A expansão esperada é de 36 itens e 128 segundos
de tempo planejado.

---

## Cenário 1 — Execução completa do treino (P1)

**Requisitos**: FR-014 a FR-021, FR-026 a FR-032 · **Critérios**: SC-001, SC-004, SC-005

1. Abrir o treino de exemplo.
2. Conferir a timeline vertical antes de iniciar.
3. Acionar o botão de início do primeiro exercício.
4. Executar o treino inteiro sem tocar na tela.

**Resultado esperado**

- A timeline lista os 36 itens em ordem, cada um com seu tempo e o check em branco.
- O botão de início é o elemento de maior destaque enquanto nada está em execução.
- Cada transição de etapa emite som e vibração e avança sozinha.
- O item em execução fica destacado e a lista rola sozinha para mantê-lo visível.
- Porcentagem e tempo restante permanecem visíveis e decrescentes durante toda a execução.
- Ao terminar o primeiro exercício, o app **para** e aguarda o disparo do segundo.
- Ao final, o app indica 100% e apresenta o encerramento.

## Cenário 2 — Precisão do cronômetro (Princípio II)

**Requisitos**: FR-019 · **Critério**: SC-002

1. Executar os testes unitários do motor de execução com relógio falso.
2. Em dispositivo, cronometrar externamente uma etapa de 7 segundos.

**Resultado esperado**: desvio não superior ao maior valor entre 1% da duração e 200 ms, em todas
as medições.

## Cenário 3 — Tela bloqueada e segundo plano

**Requisitos**: FR-022 · **Critério**: SC-003

1. Iniciar o treino de exemplo.
2. Durante uma etapa, bloquear a tela ou trocar de app por 3 minutos.
3. Retornar ao app.

**Resultado esperado**: o estado exibido corresponde ao instante real, com todos os itens vencidos
resolvidos de uma vez, sem atraso acumulado, parando no primeiro item que exige disparo manual.

## Cenário 4 — Tela permanece acesa

**Requisitos**: FR-022a · **Critério**: SC-004

1. Configurar o desligamento automático de tela do aparelho para o menor valor possível.
2. Iniciar o treino e não tocar na tela por um período maior que esse valor.
3. Concluir ou sair do treino e aguardar novamente.

**Resultado esperado**: a tela não apaga durante a execução e volta a apagar normalmente após o
fim do treino.

## Cenário 5 — Disparo manual e preparação automática

**Requisitos**: FR-007 a FR-013, FR-012a

1. Editar um exercício para disparo automático com 10 segundos de preparação.
2. Executar o treino e observar a transição para esse exercício.
3. Repetir acionando "iniciar agora" durante a contagem.
4. Repetir acionando "adiar" durante a contagem.

**Resultado esperado**

- A contagem regressiva de 10 segundos aparece antes da primeira etapa.
- "Iniciar agora" começa o exercício imediatamente.
- "Adiar" cancela a contagem e o exercício passa a aguardar o botão; ao reabrir o treino em nova
  sessão, ele volta a ser automático.
- Um exercício manual nunca inicia sozinho.

## Cenário 6 — Repetição de séries

**Requisitos**: FR-003, FR-003a

1. Configurar a série do treino de exemplo com quantidade 3 e descanso de 30 segundos.

**Resultado esperado**: o grupo de exercícios aparece 3 vezes na timeline, com descanso entre a
primeira e a segunda e entre a segunda e a terceira, e **nenhum** descanso após a terceira. O
tempo total previsto aumenta em 2 × 30 segundos além do triplo do tempo de exercícios.

## Cenário 7 — Pular item

**Requisitos**: FR-023, FR-023a, FR-030a, FR-032

1. Iniciar o treino e pular um exercício inteiro.
2. Concluir o restante.

**Resultado esperado**: os itens pulados aparecem com estado visualmente distinto de concluído, a
porcentagem chega a 100% ao final dos itens restantes, e a tela de encerramento informa quantos
itens foram pulados.

## Cenário 8 — Sessão e retomada

**Requisitos**: FR-025, FR-025a, FR-025b

1. Iniciar o treino, concluir alguns itens e encerrar o app pelo sistema.
2. Reabrir o treino no mesmo dia.
3. Escolher "retomar" e verificar o ponto. Depois repetir escolhendo "recomeçar".
4. Alterar a data do aparelho para o dia seguinte e reabrir o treino.

**Resultado esperado**: no mesmo dia o app oferece retomar ou recomeçar e a retomada volta ao
ponto exato; em um novo dia a sessão começa zerada, sem perguntar.

## Cenário 9 — Exercício livre

**Requisitos**: FR-005, FR-017, FR-024

1. Cadastrar um exercício livre e executá-lo.

**Resultado esperado**: aparece na timeline como sem tempo previsto, não avança sozinho, exige
conclusão manual, e o tempo restante do treino passa a ser exibido como estimativa.

## Cenário 10 — Cadastro do treino (P2)

**Requisitos**: FR-001 a FR-011 · **Critério**: SC-006

1. Cadastrar do zero o treino de exemplo, incluindo dias e horários.
2. Tentar salvar um exercício automático sem tempo de preparação.

**Resultado esperado**: o cadastro é concluído em menos de 5 minutos; o salvamento sem tempo de
preparação é bloqueado com mensagem clara; um exercício adicionado sem série é aceito.

## Cenário 11 — Lembretes (P3)

**Requisitos**: FR-033

1. Configurar um horário poucos minutos à frente e fechar o app.
2. Negar a permissão de notificação e repetir.

**Resultado esperado**: o lembrete chega no horário e abre a timeline do treino; com a permissão
negada, aparece aviso e o treino continua totalmente executável.

## Cenário 12 — Offline

**Requisitos**: FR-034, FR-035 · **Critério**: SC-008

1. Ativar o modo avião e executar os cenários 1, 8 e 10.

**Resultado esperado**: nenhuma diferença de comportamento.

## Cenário 13 — Idioma e acessibilidade

**Requisitos**: FR-037 · **Constitution**: Princípios IV e V

1. Percorrer todas as telas.

**Resultado esperado**: todos os textos em português do Brasil; alvos de toque de no mínimo
48 dp; contraste AA; estados de item distinguíveis sem depender de cor.

---

## Critério de pronto

A feature só é considerada entregue quando os 13 cenários passam, os testes automatizados do
motor de execução estão verdes e o
[checklist de requisitos](./checklists/requirements.md) permanece integralmente aprovado.
