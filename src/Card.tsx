/** @jsxRuntime classic */
/** @jsx jsx */
/**  @jsxFrag */
import { FC } from "react";
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import * as Color from "color";

const CardContainer = styled.div`
  display: inline-flex;
  width: 60px;
  height: 70px;
  background: white;
  border: solid black 1.5px;
  align-items: center;
  justify-content: center;
  font-size: 1.8em;
  margin-bottom: 5px;
`;

export const Card: FC<{ rank: string; suit: "s" | "h" | "d" | "c" }> = ({
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
        return "#083ef0";
      case "s":
        return "#000000";
    }
  };
  const getSuiteSymbol = () => {
    switch (suit) {
      case "c":
        return "♣";
      case "h":
        return "♥";
      case "d":
        return "♦";
      case "s":
        return "♠";
    }
  };
  const textColor = getColor();
  const backgroundColor = [...Color(textColor).rgb().color, 0.1].map(
    (x) => "" + x
  );
  return (
    <CardContainer
      css={css`
        color: ${textColor};
        background: rgba(${backgroundColor.join()});
      `}
    >
      <div>{`${rank} ${getSuiteSymbol()}`}</div>
    </CardContainer>
  );
};
