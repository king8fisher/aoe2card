export const BREAKPOINT = {
  XXS: 320,
  XS: 575,
  SM: 767,
  MD: 991,
  LG: 1199,
  XL: 1699,
};

export const breakpoints = {
  xxsDown: `@media (max-width: ${BREAKPOINT.XXS}px)`,
  xsDown: `@media (max-width: ${BREAKPOINT.XS}px)`,
  smDown: `@media (max-width: ${BREAKPOINT.SM}px)`,
  mdDown: `@media (max-width: ${BREAKPOINT.MD}px)`,
  lgDown: `@media (max-width: ${BREAKPOINT.LG}px)`,
  xlDown: `@media (max-width: ${BREAKPOINT.XL}px)`,

  xsUp: `@media (min-width: ${BREAKPOINT.XS + 1}px)`,
  smUp: `@media (min-width: ${BREAKPOINT.SM + 1}px)`,
  mdUp: `@media (min-width: ${BREAKPOINT.MD + 1}px)`,
  lgUp: `@media (min-width: ${BREAKPOINT.LG + 1}px)`,
  xlUp: `@media (min-width: ${BREAKPOINT.XL + 1}px)`,
};

export const CONTAINER_MAX_WIDTH = {
  XS_UP: 540,
  SM_UP: 720,
  MD_UP: 960,
  LG_UP: 1290,
};

export const colors = {
  white: "#ffffff",
  black: "#000000",
  gray: "#6C6C6C",
  middleGray: "#C3C3C3",
  lightgray: "#D3D3D3",
  grayBrown: "#80746D",
};

export enum WaysOfGroupingUnits {
  all = "all",
  byCiv = "by-civ",
}
