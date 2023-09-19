import { SlButton, SlButtonGroup } from "@shoelace-style/shoelace/dist/react";
import { DataFilter } from "../../../helpers/constants";
interface IButtonGroupProps {
  filter: DataFilter;
  setFilter: (unitView: DataFilter) => void;
}

export const ButtonGroup = ({ filter, setFilter }: IButtonGroupProps) => (
  <div className="flex flex-row items-center my-4">
    <SlButtonGroup>
      <SlButton
        size="small"
        variant={filter === DataFilter.units ? "primary" : "default"}
        onClick={() => setFilter(DataFilter.units)}
      >
        Units
      </SlButton>
      <SlButton
        size="small"
        variant={filter === DataFilter.civs ? "primary" : "default"}
        onClick={() => setFilter(DataFilter.civs)}
      >
        Civs
      </SlButton>
    </SlButtonGroup>
  </div>
);
