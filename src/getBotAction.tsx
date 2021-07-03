import { Table } from "@chevtek/poker-engine";

export const getBotAction = (table: Table) => {
  const { currentActor } = table;
  let items = currentActor.legalActions();
  var action = items[Math.floor(Math.random() * items.length)];
  switch (action) {
    case "fold":
      return () => currentActor.foldAction();
    case "bet":
      return () =>
        currentActor.betAction(
          table.pots[0].amount > currentActor.stackSize
            ? currentActor.stackSize
            : table.pots[0].amount
        );
    case "raise":
      return () => {
        return currentActor.raiseAction(
          table.currentBet * 3 > currentActor.stackSize
            ? currentActor.stackSize
            : table.currentBet * 3
        );
      };
    case "check":
      return () => currentActor.foldAction();
    case "call":
      return () => currentActor.callAction();
  }
};
