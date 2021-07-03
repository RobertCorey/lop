import { BettingRound, Table } from "@chevtek/poker-engine";

type PlayerAction = {
  action: () => void;
  label: string | number;
};

export const getPlayerActions = (
  table: Table,
  totalPot: number
): PlayerAction[] => {
  let { currentRound, currentActor, currentBet } = table;
  if (!currentActor) return [];
  let { stackSize } = currentActor;
  currentBet = currentBet || 0;
  const isValidAction = (amount: number) => {
    const currentBet = table.currentBet || 0;
    const lastRaise = table.lastRaise;
    const minRaise =
      lastRaise !== null && lastRaise !== void 0 ? lastRaise : table.bigBlind;
    const raiseAmount = currentBet ? amount - currentBet : amount;
    return (
      !(raiseAmount < minRaise && amount < currentActor.stackSize) &&
      raiseAmount < currentActor.stackSize
    );
  };
  const actions = [
    totalPot * 0.4 + currentBet,
    totalPot * 0.8 + currentBet,
    totalPot * 1 + currentBet,
  ]
    .map(Math.floor)
    .filter((bet) => isValidAction(bet))
    .map((bet) => ({
      label: bet + currentBet,
      action: () => {
        currentActor.raiseAction(bet);
      },
    }));
  return [
    {
      action: () => {
        currentActor.foldAction();
      },
      label: "fold",
    },
    {
      action: () => {
        if (currentActor.legalActions().find((x) => x === "call")) {
          table.currentActor.callAction();
        } else {
          table.currentActor.checkAction();
        }
      },
      label: currentActor.legalActions().find((x) => x === "call")
        ? "call"
        : "check",
    },
    ...actions,
    {
      action: () => {
        currentActor.raiseAction(currentActor.stackSize);
      },
      label: currentActor.stackSize,
    },
  ].filter((x) => !!x);
};
