import { SlButton, SlButtonGroup } from "@shoelace-style/shoelace/dist/react";
import { DataFilter } from "../../../helpers/constants";

export interface IFilterStats {
  unitsFoundAmount: number;
  civsFoundAmount: number;
}

interface IButtonGroupProps {
  filterStats: IFilterStats;
  filter: DataFilter;
  setFilter: (unitView: DataFilter) => void;
}

export const ButtonGroup = ({ filter, setFilter, filterStats }: IButtonGroupProps) => (
  <div className="flex flex-row items-center my-2">
    <SlButtonGroup>
      <SlButton
        size="small"
        variant={filter === DataFilter.units ? "primary" : "default"}
        onClick={() => setFilter(DataFilter.units)}
      >
        <LabelWithBadge label="Units" amount={filterStats.unitsFoundAmount} />
      </SlButton>
      <SlButton
        size="small"
        variant={filter === DataFilter.civs ? "primary" : "default"}
        onClick={() => setFilter(DataFilter.civs)}
      >
        <LabelWithBadge label="Civs" amount={filterStats.civsFoundAmount} />
      </SlButton>
    </SlButtonGroup>
  </div>
);

const LabelWithBadge = ({ label, amount }: { label: string; amount: number }) => (
  <div className="flex flex-row gap-1 justify-between min-w-[80px] w-full">
    {label}
    <AmountBadge amount={amount} />
  </div>
);

const AmountBadge = ({ amount }: { amount: number }) => (
  <span className={amount === 0 ? "ml-2 opacity-50" : "ml-2 font-bold"}>{amount}</span>
);
