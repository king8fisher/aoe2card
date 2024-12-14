import clsx from "clsx";
import { IStatisticsUnitData } from "../../../data/model";
import { getStatisticsImgUrl, roundTo } from "../../../helpers/tools";
import { ContentWithPopover } from "../ContentWithTooltip";
import { SingleImg, SingleSpan } from "./styles";

const SingleStatisticsPresenter = ({
  icon,
  amount,
  tooltip,
}: {
  icon: string;
  amount: number | string;
  tooltip: string;
}) => (
  <ContentWithPopover
    tooltip={<span>
      <strong>{tooltip}: </strong>
      {amount}
    </span>}
    popover={
      <span>
        <strong>{tooltip}: </strong>
        {amount}
      </span>
    }
  >
    <div className={clsx("cursor-pointer flex flex-row gap-1 items-center", amount == 0 ? "opacity-30" : "")}>
      <SingleImg src={getStatisticsImgUrl(icon)} />
      {amount}
    </div>
  </ContentWithPopover>
);

export const StatisticsBlock = ({ unitData }: { unitData: IStatisticsUnitData; }) => {
  return (
    <div className="grid grid-cols-5 gap-px w-full">
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
};
