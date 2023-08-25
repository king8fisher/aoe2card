import { SlTooltip } from "@shoelace-style/shoelace/dist/react";
import { ICivData, IGroupByUnitData, allCivs } from "../../../data/model";
import { civImgUrl, styleForUnit } from "../../../helpers/tools";
import { UnitDisplayLine } from "../../../styles";
import { CostPresentation } from "../../atoms/UnitCost";
import { UnitLine } from "../UnitLine";

export const GroupedUnitPresentation = ({ groupByUnitData }: { groupByUnitData: IGroupByUnitData }) => {
  // const commonCostKey = groupByUnitData.mostCommonUnitStats.cost.toKey();

  const RenderCivIcon = ({ c }: { c: ICivData }) => {
    const found = groupByUnitData?.civs.has(c.key);
    const skipTooltip = true;
    return skipTooltip ? (
      <>
        <div>
          <div className={["flex flex-col items-center", found ? "opacity-100" : "opacity-20"].join(" ")}>
            <img src={civImgUrl(c.key)} className="w-7 h-7" />
          </div>
        </div>
      </>
    ) : (
      // TODO: Restore tooltips when figured out how to dynamically create them.
      <>
        <div>
          <SlTooltip style={{ ["--show-delay" as string]: "400" }}>
            <div className="flex flex-col gap-1" slot="content">
              <span className="font-bold leading-6">{c.value}</span>
              <span dangerouslySetInnerHTML={{ __html: c.help }} />
            </div>
            <div className={["flex flex-col items-center", found ? "opacity-100" : "opacity-20"].join(" ")}>
              <img src={civImgUrl(c.key)} className="w-7 h-7" />
            </div>
          </SlTooltip>
        </div>
      </>
    );
  };

  return (
    <div className={["flex flex-col rounded-md p-1", styleForUnit(groupByUnitData.unit)].join(" ")}>
      <UnitLine unit={groupByUnitData.unit} />
      <UnitDisplayLine className="text-xs mt-1">
        <CostPresentation cost={groupByUnitData.mostCommonUnitStats.cost} />
      </UnitDisplayLine>
      <div className="grid grid-cols-8 gap-1 p-1 mt-1">
        {allCivs().map((c, _index) => (
          <RenderCivIcon c={c} key={c.key} />
        ))}
      </div>
    </div>
  );
};
