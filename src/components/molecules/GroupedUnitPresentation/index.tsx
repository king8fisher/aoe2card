import { SlTooltip } from "@shoelace-style/shoelace/dist/react";
import { IGroupByUnitData } from "../../../data/model";
import { getCivImgUrl, getStyleForUnit } from "../../../helpers/tools";
import { UnitDisplayLine } from "../../../styles";
import { CostPresentation } from "../../atoms/UnitCost";
import { UnitLine } from "../UnitLine";

export const GroupedUnitPresentation = ({ groupByUnitData }: { groupByUnitData: IGroupByUnitData }) => {
  const commonCostKey = groupByUnitData.mostCommonUnitStats.cost.toKey();
  return (
    <div className={["flex flex-col rounded-md p-1", getStyleForUnit(groupByUnitData.unit)].join(" ")}>
      <UnitLine unit={groupByUnitData.unit} />
      <UnitDisplayLine className="text-xs mt-1">
        <CostPresentation cost={groupByUnitData.mostCommonUnitStats.cost} />
      </UnitDisplayLine>
      <div className="grid grid-cols-8 gap-1 p-1 mt-1">
        {groupByUnitData?.civs.map((c, _index) => (
          <div key={`${c.civ.key}`}>
            <SlTooltip style={{ ["--show-delay" as string]: "400" }}>
              <div className="flex flex-col gap-1" slot="content">
                <span className="font-bold leading-6">{c.civ.value}</span>
                <span dangerouslySetInnerHTML={{ __html: c.civ.help }} />
              </div>
              <div className="flex flex-col items-center">
                <img src={getCivImgUrl(c.civ.key)} className="w-7 h-7" />
                {c.unitStats.cost.toKey() !== commonCostKey && (
                  // TODO: Doesn't seem to ever kick in
                  <UnitDisplayLine className="text-xs mt-1">
                    <CostPresentation cost={c.unitStats.cost} />
                  </UnitDisplayLine>
                )}
              </div>
            </SlTooltip>
          </div>
        ))}
      </div>
    </div>
  );
};
