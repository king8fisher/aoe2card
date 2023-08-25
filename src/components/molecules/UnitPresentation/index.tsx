import { SlTooltip } from "@shoelace-style/shoelace/dist/react";
import { IUnitCivData } from "../../../data/model";
import { civImgUrl, styleForUnit } from "../../../helpers/tools";
import { UnitDisplayLine } from "../../../styles";
import { CostPresentation } from "../../atoms/UnitCost";
import { UnitLine } from "../UnitLine";

export const UnitPresentation = ({ unitCivData, showCivName }: { unitCivData: IUnitCivData; showCivName: boolean }) => (
  <div className={["flex flex-col rounded-md p-1", styleForUnit(unitCivData.unit)].join(" ")}>
    {showCivName && (
      <UnitDisplayLine>
        <SlTooltip style={{ ["--show-delay" as string]: "400" }}>
          <div className="flex flex-col gap-1" slot="content">
            <span className="font-bold leading-6">{unitCivData.civ.value}</span>
            <span dangerouslySetInnerHTML={{ __html: unitCivData.civ.help }} />
          </div>
          <img src={civImgUrl(unitCivData.civ.key)} className="w-7 h-7 flex-shrink-0 mt-[2px]" />
          <div className="leading-none">{unitCivData.civ.value}</div>
        </SlTooltip>
      </UnitDisplayLine>
    )}
    <UnitLine unit={unitCivData.unit} />
    <UnitDisplayLine className="text-xs mt-1">
      <CostPresentation cost={unitCivData.unitStats.cost} />
    </UnitDisplayLine>
  </div>
);
