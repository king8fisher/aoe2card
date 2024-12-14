import { HTMLAttributes } from "react";
import { ICivData } from "../../../data/model";
import { getCivImgUrl } from "../../../helpers/tools";
import { ContentWithPopover } from "../ContentWithTooltip";

interface SingleCivIconProps {
  highlight: boolean;
  disablePopup?: boolean;
  showTooltip?: boolean;
  civData: ICivData;
}

const SingleCivIcon = ({
  highlight,
  civData,
  disablePopup,
  showTooltip,
  ...props
}: SingleCivIconProps & HTMLAttributes<HTMLDivElement>) => {
  const imgClassName = highlight ? "" : "opacity-20";
  return (
    <div {...props}>
      {disablePopup && <img src={getCivImgUrl(civData.key)} alt="" className={imgClassName} />}
      {!disablePopup && (
        <ContentWithPopover
          tooltip={showTooltip ? <span className="text-sm">{civData.value}</span> : undefined}
          popover={<SingleCivTooltipContent civData={civData} />}>
          <img src={getCivImgUrl(civData.key)} alt="" className={imgClassName} />
        </ContentWithPopover>
      )}
    </div>
  );
};

export default SingleCivIcon;

export const SingleCivTooltipContent = ({ civData }: { civData: ICivData; }) => {
  return (
    <div className="flex flex-col gap-1 text-sm">
      <div className="flex flex-row items-center gap-1">
        <SingleCivIcon highlight disablePopup civData={civData} className="w-8 h-8 shrink-0" />
        <span className="font-bold leading-6 grow">{civData.value}</span>
      </div>
      <span className="text-wrap" dangerouslySetInnerHTML={{ __html: civData.help }} />
    </div>
  );
};
