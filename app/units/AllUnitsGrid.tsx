"use client";

import clsx from "clsx";
import { useMemo } from "react";
import { ContentWithTooltip } from "~/src/components/atoms/ContentWithTooltip";
import { TooltipContent } from "~/src/components/atoms/SingleCivIcon";
import { UnitPresentation } from "~/src/components/molecules/UnitPresentation";
import { allRegularUnits, Cost } from "~/src/data/model";
import { patchedUnitAttributes } from "~/src/data/unit-attributes-patch";
import { getStyleForUnit, getUnitImgUrl } from "~/src/helpers/tools";

export function AllUnitsGrid({ filter }: { filter: string; }) {
  const allUnits = useMemo(() => allRegularUnits(null), []);
  return (
    <div className="flex flex-row flex-wrap gap-1 p-1 mt-1 shrink-0">
      {allUnits.map((unit) => {
        return (
          <ContentWithTooltip tooltip={
            <>
              <div className={getStyleForUnit(unit)}>
                <UnitPresentation unit={unit} />
              </div>
            </>
          }>
            <div className="flex flex-col items-center" key={unit.id}>
              <img
                src={getUnitImgUrl(unit.id)}
                alt=""
                className={
                  clsx("w-8 h-8 flex-shrink-0 rounded-lg border-2",
                    filter == "" ? "border-white/20" :
                      unit.statisticsUnitData.name.toLowerCase().includes(filter.toLowerCase())
                        ? "border-yellow-400"
                        : "opacity-50"
                  )
                }
              />
              {/* <div className="text-xs text-center leading-none mt-[0.44rem]">{unit.id}</div>
                  <div className="text-xs text-center leading-none mt-[0.44rem]">{patched.name}</div> */}
            </div>
          </ContentWithTooltip>
        );
        // return <UnitLine cost={emptyCost} unit={v} key={v.id} />
      })}
    </div>
  );
}
