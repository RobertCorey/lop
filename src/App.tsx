/** @jsxRuntime classic */
/** @jsx jsx */
/**  @jsxFrag */
import React, { FC, useEffect, useReducer, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Table } from "@chevtek/poker-engine";
import styled from "@emotion/styled";
import { css, jsx } from "@emotion/react";

const table = new Table();
table.sitDown("" + Math.random(), 1000);
table.sitDown("" + Math.random(), 1000);
table.sitDown("" + Math.random(), 1000);
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

const column = css`
  /* border: solid black 1px; */
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  /* background-color: grey; */
  height: 100%;
`;

function App() {
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
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
          <div
            css={css`
              ${column};
              width: 40%;
            `}
          >
            {new Array(5).fill(0).map((_, index) => (
              <PlayerBox isPlayer={index === 4 ? true : false}></PlayerBox>
            ))}
          </div>
          <div
            css={css`
              ${column};
              width: 10%;
            `}
          ></div>
          <div
            css={css`
              ${column};
              width: 50%;
            `}
          >
            <Card rank="8" suit="h" />
            <Card rank="8" suit="c" />
            <Card rank="8" suit="s" />
            <Card rank="8" suit="d" />
            <Card rank="J" suit="h" />
          </div>
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
            {new Array(6).fill(0).map((_, index) => (
              <ActionBox></ActionBox>
            ))}
          </div>
        </div>
      </InnerContainer>
    </OuterContainer>
  );
}
const Action: FC = () => {
  return <ActionBox />;
};
const PlayerBox: FC<{ isPlayer: boolean }> = ({ isPlayer }) => {
  return (
    <div
      css={css`
        border: solid black 2px;
        border-radius: 5px;
        ${!isPlayer && "margin-bottom: 5px"};
        width: 125px;
        height: 70px;
        background-color: ${isPlayer ? colors.medpurple : colors.orange};
      `}
    >
      100<br></br> 10
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
// /* color: ${color}; */
// /* border: solid ${color} 2px; */

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
