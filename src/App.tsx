/** @jsxRuntime classic */
/** @jsx jsx */
/**  @jsxFrag */
import React, { FC, useEffect, useReducer } from "react";
import "./App.css";
import { BettingRound, Player, Table } from "@chevtek/poker-engine";
import styled from "@emotion/styled";
import { css, jsx } from "@emotion/react";
import { Card } from "./Card";
import { Hand } from "./Hand";
import { getPlayerActions } from "./getPlayerActions";

let table = new Table();
table.sitDown("b1", 1000);
table.sitDown("b2", 1000);
table.sitDown("b3", 1000);
table.sitDown("b4", 1000);
table.sitDown("h", 1000);
table.dealCards();
(window as any).t = table;

const colors = {
  orange: "#dc8564",
  red: "#d76a74",
  blue: "#3c408c",
  whitepurp: "#ded0f4",
  medpurple: "#885ca4",
  lightpurple: "#bcacd4",
  darkpurple: "#603450",
};

const OuterContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const InnerContainer = styled.div`
  background-color: ${colors.lightpurple};
  width: 360px;
  height: 640px;
  padding: 10px;
`;

const GradientBox = styled.div`
  background: linear-gradient(180deg, #d76a74 0%, rgba(125, 59, 65, 0.3) 100%);
  border: 2px solid #000000;
  border-radius: 4px;
  display: inline-block;
  text-align: center;
`;

const ActionBox = styled(GradientBox)`
  width: 110px;
  height: 70px;
  font-size: 28px;
  line-height: 70px;
`;

const Column = styled.div`
  /* border: solid black 1px; */
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  /* background-color: grey; */
`;

const doBotActions = () => {
  while (table.currentActor && table.currentActor.id !== "h") {
    try {
      table.currentActor.foldAction();
      // table.currentActor.foldAction();
      // table.currentActor.callAction();
    } catch (error) {
      table.currentActor.checkAction();
    }
  }
};

function getPlayerWinnings(player: Player) {
  if (table.pots.every((p) => p.winners)) {
    const idToWinnings = table.pots.reduce((p, c) => {
      const award = c.amount / c.winners!.length;
      c.winners.forEach((w) => (p[w.id] = p[w.id] ? p[w.id] + award : award));
      return p;
    }, {});
    return idToWinnings[player.id];
  }
}

const isHuman = (player: Player) => player.id === "h";

function App() {
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    doBotActions();
    forceUpdate();
  }, []);

  const getPlayers = () => table.players.filter((p) => p);
  const totalPot = (() => {
    const betTotal = table.players.reduce((p, c) => p + (c?.bet || 0), 0);
    const potTotal = table.pots.reduce((p, c) => p + (c.amount || 0), 0);
    return betTotal + potTotal;
  })();

  const playerActions = getPlayerActions(table, totalPot);

  const human = table.players.find((p) => p.id === "h");
  return (
    <OuterContainer>
      <InnerContainer>
        <div
          css={css`
            height: 75%;
            display: flex;
            flex-direction: row;
          `}
        >
          <Column
            css={css`
              width: 50%;
            `}
          >
            {getPlayers().map((player, index) => {
              if (table.winners && !player.folded && !isHuman(player)) {
                const winnings = getPlayerWinnings(player);
                return <Hand cards={player.holeCards} status={winnings}></Hand>;
              }
              return <PlayerBox player={player}></PlayerBox>;
            })}
            <Hand cards={human.holeCards}></Hand>
          </Column>
          <Column
            css={css`
              width: 50%;
            `}
          >
            <Column
              css={css`
                height: 375px;
              `}
            >
              {table.communityCards.map((c) => (
                <Card rank={c.rank} suit={c.suit} />
              ))}
            </Column>
            <div
              css={css`
                font-size: 2rem;
              `}
            >
              {totalPot}
            </div>
          </Column>
        </div>
        <div
          css={css`
            width: 100%;
            height: 25%;
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              gap: 5px;
              height: 100%;
            `}
          >
            {table.winners ? (
              <GradientBox
                css={css`
                  width: 100%;
                  height: 100%;
                  font-size: 108px;
                `}
                onClick={() => {
                  const withMoney = table.players.filter(
                    (p) => p?.stackSize > 0
                  );
                  if (
                    !withMoney.find((p) => isHuman(p)) ||
                    withMoney.length === 1
                  ) {
                    table.players.forEach((p) => p && table.standUp(p.id));
                    table.sitDown("b1", 1000);
                    table.sitDown("b2", 1000);
                    table.sitDown("b3", 1000);
                    table.sitDown("b4", 1000);
                    table.sitDown("h", 1000);
                  }
                  table.dealCards();
                  doBotActions();
                  forceUpdate();
                }}
              >
                Next
              </GradientBox>
            ) : (
              <>
                {playerActions.map((action) => (
                  <ActionBox
                    onClick={() => {
                      action.action();
                      doBotActions();
                      forceUpdate();
                    }}
                  >
                    {action.label}
                  </ActionBox>
                ))}
              </>
            )}
          </div>
        </div>
      </InnerContainer>
    </OuterContainer>
  );
}
const PlayerBox: FC<{ player: Player }> = ({ player }) => {
  const isPlayer = player.id === "h";
  const isDealer = table.dealer.id === player.id;
  const winnings = getPlayerWinnings(player);
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        align-items: center;
        visibility: ${player.folded && "hidden"};
      `}
    >
      <div
        css={css`
          border: solid black 2px;
          border-radius: 5px;
          margin-bottom: 5px;
          width: 125px;
          height: 70px;
          background-color: ${isPlayer ? colors.medpurple : colors.orange};
          margin-right: 5px;
          text-align: center;
          font-size: 1.5rem;
        `}
      >
        {player.stackSize}
        <br></br> {player.bet}
      </div>
      <div
        css={css`
          width: 20px;
          height: 20px;
        `}
      >
        {isDealer && (
          <div
            css={css`
              border: solid black 1px;
              border-radius: 50%;
              background-color: grey;
              text-align: center;
            `}
          >
            D
          </div>
        )}
        {winnings}
      </div>
    </div>
  );
};

export default App;
