/** @jsxRuntime classic */
/** @jsx jsx */
/**  @jsxFrag */
import { FC } from "react";
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";

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
