import { Tabs, TabsList, TabsTrigger } from "~/src/shadcn/components/ui/tabs";
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
  <>
    <Tabs value={filter} onValueChange={(v) => setFilter(v as DataFilter)}>
      <TabsList>
        <TabsTrigger value={DataFilter.units}><LabelWithBadge label="Units" amount={filterStats.unitsFoundAmount} /></TabsTrigger>
        <TabsTrigger value={DataFilter.civs}><LabelWithBadge label="Civs" amount={filterStats.civsFoundAmount} /></TabsTrigger>
      </TabsList>
    </Tabs>
  </>
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
