import { memo } from "react";
import { Cost } from "../../../data/model";
import { resImgUrl } from "../../../helpers/tools";
import { FlexWrap } from "./styles";

type CostType = keyof Cost;

// TODO: Confirm that purely functional components, located within main component,
// don't slow down rendering. If not, convert back.

const RenderSingleCostPresenter = memo(({ cost, type }: { cost: Cost; type: CostType }) => (
  <span className={["flex flex-col gap-0 items-center", cost[type] == 0 ? "opacity-30" : ""].join(" ")}>
    <img src={resImgUrl(type)} className="w-5 h-5" />
    {`${cost[type]}`}
  </span>
));

export const CostPresentation = memo(({ cost }: { cost: Cost }) => {
  return (
    <FlexWrap>
      {cost.food > 0 && <RenderSingleCostPresenter cost={cost} type="food" />}
      {cost.wood > 0 && <RenderSingleCostPresenter cost={cost} type="wood" />}
      {cost.gold > 0 && <RenderSingleCostPresenter cost={cost} type="gold" />}
      {cost.stone > 0 && <RenderSingleCostPresenter cost={cost} type="stone" />}
    </FlexWrap>
  );
});
