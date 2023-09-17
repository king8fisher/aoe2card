import { SlTooltip } from "@shoelace-style/shoelace/dist/react";
import { memo, useState } from "react";
import { ICivData, IGroupByUnitData, allCivs } from "../../../data/model";
import { getCivImgUrl, styleForUnit } from "../../../helpers/tools";
import { UnitDisplayLine } from "../../../styles";
import { CostPresentation } from "../../atoms/UnitCost";
import { UnitLine } from "../UnitLine";

const SingleCivIcon = memo(({ highlight, c }: { highlight: boolean; c: ICivData }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
      {showTooltip && (
        <SlTooltip style={{ ["--show-delay" as string]: "400" }}>
          <div className="flex flex-col gap-1" slot="content">
            <span className="font-bold leading-6">{c.value}</span>
            <span dangerouslySetInnerHTML={{ __html: c.help }} />
          </div>
          {highlight ? (
            <img src={getCivImgUrl(c.key)} className="w-7 h-7" />
          ) : (
            <img src={getCivImgUrl(c.key)} className="w-7 h-7 opacity-20" />
          )}
        </SlTooltip>
      )}
      {!showTooltip && (
        <>
          {highlight ? (
            <img src={getCivImgUrl(c.key)} className="w-7 h-7" />
          ) : (
            <img src={getCivImgUrl(c.key)} className="w-7 h-7 opacity-20" />
          )}
        </>
      )}
    </div>
  );
});

export const GroupedUnitPresentation = memo(({ groupByUnitData }: { groupByUnitData: IGroupByUnitData }) => {
  return (
    <div className={["flex flex-col rounded-md p-1", styleForUnit(groupByUnitData.unit)].join(" ")}>
      <UnitLine unit={groupByUnitData.unit} />
      <UnitDisplayLine className="text-xs mt-1">
        <CostPresentation cost={groupByUnitData.mostCommonUnitStats.cost} />
      </UnitDisplayLine>
      <div className="grid grid-cols-8 gap-1 p-1 mt-1">
        {allCivs().map((c, _index) => (
          <SingleCivIcon highlight={groupByUnitData.civs.has(c.key)} c={c} key={c.key} />
        ))}
      </div>
    </div>
  );
});
