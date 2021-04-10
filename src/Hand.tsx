/** @jsxRuntime classic */
/**  @jsxFrag */
/** @jsx jsx */
import React, { FC } from "react";
import { Card as CardType } from "@chevtek/poker-engine";
import styled from "@emotion/styled";
import { Card } from "./Card";
import { css, jsx } from "@emotion/react";

const HandContainer = styled.div`
  display: flex;
  width: 151px;
  flex-direction: row;
  justify-content: space-around;
`;

export const Hand: FC<{ cards: CardType[] }> = ({ cards }) => {
  return (
    <HandContainer>
      {cards.map((c) => (
        <Card rank={c.rank} suit={c.suit} />
      ))}
      <div
        css={css`
          width: 20px;
          height: 20px;
          visibility: hidden;
        `}
      ></div>
    </HandContainer>
  );
};
