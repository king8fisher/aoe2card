'use client'

import { allRegularUnits } from "~/src/data/model";
import { getUnitImgUrl } from "~/src/helpers/tools";

import dynamic from 'next/dynamic'

export function ClientOnly() {
  return <div className="flex flex-row flex-wrap gap-3">
    {allRegularUnits(null).map((unit) => {
      return <div className="flex w-18 flex-col items-center p-2" key={unit.id}>
        <img src={getUnitImgUrl(unit.id)} alt="" className="w-6 h-6 flex-shrink-0 mt-[2px] rounded-sm ml-[4px]" />
        <div className="text-xs text-center leading-none mt-[0.44rem]">{unit.statisticsUnitData.name}</div>
      </div>
      // return <UnitLine cost={emptyCost} unit={v} key={v.id} />
    })}
  </div>
}