"use client";

import { allRegularUnits } from "~/src/data/model";
import { getUnitImgUrl } from "~/src/helpers/tools";

import dynamic from "next/dynamic";
import { patchedUnitAttributes } from "~/src/data/unit-attributes-patch";

export function AllUnitsGrid() {
  return (
    <div className="flex flex-row flex-wrap gap-0">
      {allRegularUnits(null).map((unit) => {
        const patched = patchedUnitAttributes({ unitId: unit.id, name: unit.statisticsUnitData.name });

        return (
          <div className="flex flex-col items-center" key={unit.id}>
            <img
              src={getUnitImgUrl(unit.id)}
              alt=""
              className="w-8 h-8 flex-shrink-0 rounded-lg border-white/10 border-2"
            />
            {/* <div className="text-xs text-center leading-none mt-[0.44rem]">{unit.id}</div>
        <div className="text-xs text-center leading-none mt-[0.44rem]">{patched.name}</div> */}
          </div>
        );
        // return <UnitLine cost={emptyCost} unit={v} key={v.id} />
      })}
    </div>
  );
}
