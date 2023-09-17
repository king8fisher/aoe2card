import { SlButton, SlButtonGroup } from "@shoelace-style/shoelace/dist/react";
import { WaysOfGroupingUnits } from "../../../helpers/constants";
interface IButtonGroupProps {
  unitView: WaysOfGroupingUnits;
  setUnitView: (unitView: WaysOfGroupingUnits) => void;
}

export const ButtonGroup = ({ unitView, setUnitView }: IButtonGroupProps) => (
  <div className="flex flex-row items-center my-4">
    <SlButtonGroup>
      <SlButton
        size="small"
        variant={unitView === WaysOfGroupingUnits.all ? "primary" : "default"}
        onClick={() => setUnitView(WaysOfGroupingUnits.all)}
      >
        All Units
      </SlButton>
      <SlButton
        size="small"
        variant={unitView === WaysOfGroupingUnits.byCiv ? "primary" : "default"}
        onClick={() => setUnitView(WaysOfGroupingUnits.byCiv)}
      >
        Units by Civ
      </SlButton>
    </SlButtonGroup>
  </div>
);
