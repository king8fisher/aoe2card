import { SlButton, SlButtonGroup } from "@shoelace-style/shoelace/dist/react";

interface IButtonGroupProps {
  isGroupedView: boolean;
  setIsGroupedView: (isGroupedView: boolean) => void;
  isCivViewActive: boolean;
  setIsCivViewActive: (isCivViewActive: boolean) => void;
}

export const ButtonGroup = ({
  isGroupedView,
  setIsGroupedView,
  isCivViewActive,
  setIsCivViewActive,
}: IButtonGroupProps) => (
  <>
    <SlButtonGroup className="mt-2">
      <SlButton size="small" variant={isGroupedView ? "primary" : "default"} onClick={(_) => setIsGroupedView(true)}>
        Grouped
      </SlButton>
      <SlButton size="small" variant={isGroupedView ? "default" : "primary"} onClick={(_) => setIsGroupedView(false)}>
        Linear
      </SlButton>
    </SlButtonGroup>

    <SlButtonGroup className="mt-2 ml-2">
      <SlButton
        size="small"
        variant={isCivViewActive ? "primary" : "default"}
        onClick={(_) => setIsCivViewActive(!isCivViewActive)}
      >
        Civ
      </SlButton>
    </SlButtonGroup>
  </>
);
