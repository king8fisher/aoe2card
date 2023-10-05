import { styled } from "styled-components";

export const FlexWrap = styled.div`
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 0.25rem /* 4px */;
`;

export const SingleSpan = styled.span`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0;
  align-items: center;
  font-size: 0.875rem /* 14px */;
  line-height: 1.25rem /* 20px */;
  cursor: default;
`;

export const SingleImg = styled.img`
  width: 1.25rem /* 20px */;
  height: 1.25rem /* 20px */;
`;
