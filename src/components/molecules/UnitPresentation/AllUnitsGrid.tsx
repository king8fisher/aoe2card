"use client";

import clsx from "clsx";
import { useMemo } from "react";
import { ContentWithPopover } from "~/src/components/atoms/ContentWithTooltip";
import { UnitPresentation } from "~/src/components/molecules/UnitPresentation";
import { calculateDamage } from "~/src/data/calculateDamage";
import { allRegularUnits, extractUnitDataByID } from "~/src/data/model";
import { getUnitImgUrl } from "~/src/helpers/tools";

export function AllUnitsGrid({ filter }: { filter: string; }) {
  const allUnits = useMemo(() => allRegularUnits(null), []);
  const halb = extractUnitDataByID(359);
  return (
    <div className="flex flex-row flex-wrap gap-1 p-1 mt-1 shrink-0">
      {allUnits.map((unit) => {
        return (
          <ContentWithPopover
            key={unit.id}
            tooltip={<span className="text-sm">{unit.statisticsUnitData.name}</span>}
            popover={
              <>
                <UnitPresentation unit={unit} cost={unit.statisticsUnitData.unitStatistics.Cost} />
              </>
            }>
            <div className="flex flex-col items-center" key={unit.id}>
              {/* <div className="text-xs text-center leading-none">{unit.id}</div> */}
              <img
                src={getUnitImgUrl(unit.id)}
                alt=""
                className={
                  clsx("w-8 h-8 flex-shrink-0 rounded-lg border-2",
                    filter == "" ? "border-black/20 dark:border-white/10" :
                      unit.statisticsUnitData.name.toLowerCase().includes(filter.toLowerCase())
                        ? "border-yellow-600 dark:border-yellow-400"
                        : "opacity-50"
                  )
                }
              />
              {/* <div className="text-xs">
                {calculateDamage(extractUnitDataByID(unit.id), halb)}
              </div> */}
              {/* <div className="text-xs text-center leading-none mt-[0.44rem]">{unit.id}</div>
               <div className="text-xs text-center leading-none mt-[0.44rem]">{patched.name}</div> */}
            </div>
          </ContentWithPopover>
        );
        // return <UnitLine cost={emptyCost} unit={v} key={v.id} />
      })}
    </div>
  );
}
