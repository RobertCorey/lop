/** @jsxRuntime classic */
/** @jsx jsx */
/**  @jsxFrag */
import { FC, useEffect, useReducer } from "react";
import "./App.css";
import { Player, Table } from "@chevtek/poker-engine";
import styled from "@emotion/styled";
import { css, jsx } from "@emotion/react";

const table = new Table();
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

const ActionBox = styled.div`
  width: 110px;
  height: 70px;
  background: linear-gradient(180deg, #d76a74 0%, rgba(125, 59, 65, 0.3) 100%);
  border: 2px solid #000000;
  border-radius: 4px;
  display: inline-block;
`;

const Column = styled.div`
  /* border: solid black 1px; */
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  /* background-color: grey; */
`;

const PlayerCardContainer = styled.div`
  display: flex;
  width: 151px;
  flex-direction: row;
  justify-content: space-around;
`;

const doBotActions = () => {
  while (table.currentActor.id !== "h") {
    try {
      table.currentActor.callAction();
    } catch (error) {
      table.currentActor.checkAction();
    }
  }
};
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
              return <PlayerBox player={player}></PlayerBox>;
            })}
            <PlayerCardContainer>
              {human.holeCards.map((c) => (
                <Card rank={c.rank} suit={c.suit} />
              ))}
              <div
                css={css`
                  width: 20px;
                  height: 20px;
                  visibility: hidden;
                `}
              ></div>
            </PlayerCardContainer>
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
            `}
          >
            <ActionBox
              onClick={() => {
                try {
                  table.currentActor.callAction();
                } catch (error) {
                  table.currentActor.checkAction();
                }
                doBotActions();
                forceUpdate();
              }}
            >
              Call
            </ActionBox>
            {new Array(5).fill(0).map((_, index) => (
              <ActionBox></ActionBox>
            ))}
          </div>
        </div>
      </InnerContainer>
    </OuterContainer>
  );
}
const PlayerBox: FC<{ player: Player }> = ({ player }) => {
  const isPlayer = player.id === "h";
  const isDealer = table.dealer.id === player.id;
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
          border: solid black 1px;
          border-radius: 50%;
          background-color: grey;
          text-align: center;
          ${!isDealer && "visibility: hidden"}
        `}
      >
        D
      </div>
    </div>
  );
};

const CardContainer = styled.div`
  display: inline-flex;
  width: 60px;
  height: 70px;
  background: black;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  margin-bottom: 5px;
`;

const Card: FC<{ rank: string; suit: "s" | "h" | "d" | "c" }> = ({
  rank,
  suit,
}) => {
  const getColor = () => {
    switch (suit) {
      case "c":
        return "#1C7C54";
      case "h":
        return "#DB162F";
      case "d":
        return "#F0C808";
      case "s":
        return "#d2d2d2";
    }
  };
  const color = getColor();
  return (
    <CardContainer
      css={css`
        color: ${color};
      `}
    >
      <div>{`${rank} ${suit.toUpperCase()}`}</div>
    </CardContainer>
  );
};
export default App;
