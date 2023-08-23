import styled from "styled-components";
import { CONTAINER_MAX_WIDTH, breakpoints, colors } from "./helpers/constants";

const ContainerFluid = styled.div`
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
`;

export const Container = styled(ContainerFluid)`
  margin: 0 auto;
  ${breakpoints.xsUp} {
    max-width: ${CONTAINER_MAX_WIDTH.XS_UP}px;
  }
  ${breakpoints.smUp} {
    max-width: ${CONTAINER_MAX_WIDTH.SM_UP}px;
  }
  ${breakpoints.mdUp} {
    max-width: ${CONTAINER_MAX_WIDTH.MD_UP}px;
  }
  ${breakpoints.lgUp} {
    max-width: ${CONTAINER_MAX_WIDTH.LG_UP}px;
  }
`;

export const ListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  ${breakpoints.smDown} {
    justify-content: center;
  }
`;

export const ListItem = styled.div`
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  min-width: 200px;
  background-color: ${colors.gray};
`;

export const UnitDisplayLine = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  align-items: center;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  line-height: 100%;
  width: 240px;
  ${breakpoints.xsDown} {
    width: 90vw;
  }
`;

export const UnitDisplayLineItemsCentered = styled(UnitDisplayLine)`
  align-items: center;
`;

export const FlexWrap = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.25rem /* 4px */;
`;

export const UnitsPresentationFlex = styled.div`
  display: flex;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.25rem;
`;
