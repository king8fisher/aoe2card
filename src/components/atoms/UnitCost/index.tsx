import { Cost } from "../../../data/model";
import { resImgUrl } from "../../../helpers/tools";
import { FlexWrap } from "./styles";

type CostType = keyof Cost;

export const CostPresentation = ({ cost }: { cost: Cost }) => {
  const shouldShowFoodCost = cost.food > 0;
  const shouldShowWoodCost = cost.wood > 0;
  const shouldShowGoldCost = cost.gold > 0;
  const shouldShowStoneCost = cost.stone > 0;

  const renderSingleCostPresenter = (type: CostType) => (
    <span className={["flex flex-col gap-0 items-center", cost[type] == 0 ? "opacity-30" : ""].join(" ")}>
      <img src={resImgUrl(type)} className="w-5 h-5" />
      {/* TODO: Refactor Cost class into function */}
      {`${cost[type]}`}
    </span>
  );

  return (
    <FlexWrap>
      {shouldShowFoodCost && renderSingleCostPresenter("food")}
      {shouldShowWoodCost && renderSingleCostPresenter("wood")}
      {shouldShowGoldCost && renderSingleCostPresenter("gold")}
      {shouldShowStoneCost && renderSingleCostPresenter("stone")}
    </FlexWrap>
  );
};
