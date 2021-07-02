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
    totalPot * 0.33 + currentBet,
    totalPot * 0.66 + currentBet,
    totalPot + currentBet,
    totalPot * 1.5 + currentBet,
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
        try {
          table.currentActor.callAction();
        } catch (error) {
          table.currentActor.checkAction();
        }
      },
      label: "c/c",
    },
    ...actions,
    {
      action: () => {
        currentActor.raiseAction(currentActor.stackSize);
      },
      label: currentActor.stackSize,
    },
  ];
};
