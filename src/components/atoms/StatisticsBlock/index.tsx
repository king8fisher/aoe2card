import { memo } from "react";
import { IStatisticsUnitData } from "../../../data/model";
import { getStatisticsImgUrl, roundTo } from "../../../helpers/tools";
import { ContentWithTooltip } from "../ContentWithTooltip";
import { SingleImg, SingleSpan } from "./styles";

const SingleStatisticsPresenter = memo(
  ({ icon, amount, tooltip }: { icon: string; amount: number | string; tooltip: string }) => (
    <ContentWithTooltip
      tooltip={
        <span>
          <strong>{tooltip}: </strong>
          {amount}
        </span>
      }
    >
      <SingleSpan className={amount == 0 ? "opacity-30" : ""}>
        <SingleImg src={getStatisticsImgUrl(icon)} />
        {amount}
      </SingleSpan>
    </ContentWithTooltip>
  )
);

export const StatisticsBlock = memo(({ unitData }: { unitData: IStatisticsUnitData }) => {
  return (
    <div className="grid grid-cols-5 gap-1 w-full">
      <SingleStatisticsPresenter icon="hp" tooltip="Hit Points" amount={unitData.unitStatistics.HP} />
      <SingleStatisticsPresenter icon="damage" tooltip="Attack" amount={unitData.unitStatistics.Attack} />
      <SingleStatisticsPresenter icon="armor" tooltip="Melee Armor" amount={unitData.unitStatistics.MeleeArmor} />
      <SingleStatisticsPresenter
        icon="range-armor"
        tooltip="Pierce Armor"
        amount={unitData.unitStatistics.PierceArmor}
      />
      <SingleStatisticsPresenter icon="range" tooltip="Range" amount={unitData.unitStatistics.Range} />
      <SingleStatisticsPresenter
        icon="garrison"
        tooltip="GarrisonCapacity"
        amount={unitData.unitStatistics.GarrisonCapacity}
      />
      <SingleStatisticsPresenter
        icon="delay"
        tooltip="Attack Delay Seconds"
        amount={roundTo(unitData.unitStatistics.AttackDelaySeconds, 2)}
      />
      <SingleStatisticsPresenter icon="speed" tooltip="Speed" amount={unitData.unitStatistics.Speed} />
      <SingleStatisticsPresenter
        icon="line-of-sight"
        tooltip="Line Of Sight"
        amount={unitData.unitStatistics.LineOfSight}
      />
      <SingleStatisticsPresenter
        icon="accuracy"
        tooltip="Accuracy Percent"
        amount={`${unitData.unitStatistics.AccuracyPercent}%`}
      />
    </div>
  );
});
