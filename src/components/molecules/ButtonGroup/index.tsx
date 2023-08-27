import { SlButton, SlButtonGroup } from "@shoelace-style/shoelace/dist/react";
import { memo } from "react";

interface IButtonGroupProps {
  isGroupedView: boolean;
  setIsGroupedView: (isGroupedView: boolean) => void;
}

export const ButtonGroup = memo(({ isGroupedView, setIsGroupedView }: IButtonGroupProps) => {
  return (
    <div className="flex flex-row items-center">
      <SlButtonGroup>
        <SlButton size="small" variant={isGroupedView ? "primary" : "default"} onClick={(_) => setIsGroupedView(true)}>
          Grouped
        </SlButton>
        <SlButton size="small" variant={isGroupedView ? "default" : "primary"} onClick={(_) => setIsGroupedView(false)}>
          Linear
        </SlButton>
      </SlButtonGroup>
    </div>
  );
});
