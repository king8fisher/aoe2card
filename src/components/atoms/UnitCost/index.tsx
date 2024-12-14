import { UnitCost } from "~/src/data/types/data_json_types";
import { getResImgUrl } from "../../../helpers/tools";
import { FlexWrap } from "./styles";

type CostType = keyof UnitCost;

// TODO: Confirm that purely functional components, located within main component,
// don't slow down rendering. If not, convert back.

const RenderSingleCostPresenter = ({ cost, type }: { cost: UnitCost; type: CostType; }) => (
  <span className={["flex flex-col gap-0 items-center text-sm", cost[type] == 0 ? "opacity-30" : ""].join(" ")}>
    <img src={getResImgUrl(type)} alt="" className="w-5 h-5" />
    {`${cost[type]}`}
  </span>
);

export const CostPresentation = ({ cost }: { cost: UnitCost; }) => {
  return (
    <FlexWrap>
      {cost.Food ? <RenderSingleCostPresenter cost={cost} type="Food" /> : <></>}
      {cost.Wood ? <RenderSingleCostPresenter cost={cost} type="Wood" /> : <></>}
      {cost.Gold ? <RenderSingleCostPresenter cost={cost} type="Gold" /> : <></>}
      {/* {cost.Stone ? <RenderSingleCostPresenter cost={cost} type="Stone" /> : <></>} */}
    </FlexWrap>
  );
};
