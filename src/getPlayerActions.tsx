import { Table } from "@chevtek/poker-engine";

type PlayerAction = {
  action: () => void;
  label: string | number;
};

export const getPlayerActions = (
  table: Table,
  totalPot: number
): PlayerAction[] => {
  let { currentActor, currentBet } = table;
  if (!currentActor) return [];
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
    .filter((bet) => {
      const legalActions = currentActor.legalActions();
      if (!legalActions.includes("raise") && !legalActions.includes("bet")) {
        return false;
      }
      return isValidAction(bet) && bet <= currentActor.stackSize;
    })
    .map((bet) => ({
      label: bet + currentBet,
      action: () => {
        try {
          currentActor.betAction(bet);
        } catch (error) {
          currentActor.raiseAction(bet);
        }
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
        ? table.currentBet
        : "0",
    },
    ...actions,
    ...(() => {
      const legalActions = currentActor.legalActions();
      if (!legalActions.includes("raise") && !legalActions.includes("bet")) {
        return [];
      }
      return [
        {
          action: () => {
            currentActor.raiseAction(currentActor.stackSize);
          },
          label: currentActor.stackSize,
        },
      ];
    })(),
  ].filter((x) => !!x);
};
