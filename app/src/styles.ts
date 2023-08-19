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
  margin-top: 20px;
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
