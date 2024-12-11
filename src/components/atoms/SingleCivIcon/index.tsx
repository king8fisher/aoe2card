import { HTMLAttributes } from "react";
import { ICivData } from "../../../data/model";
import { getCivImgUrl } from "../../../helpers/tools";
import { ContentWithPopover } from "../ContentWithTooltip";
import { SingleCivIconWrap } from "./styles";

interface SingleCivIconProps {
  highlight: boolean;
  disablePopup?: boolean;
  civData: ICivData;
}

const SingleCivIcon = ({
  highlight,
  civData,
  disablePopup,
  ...props
}: SingleCivIconProps & HTMLAttributes<HTMLDivElement>) => {
  const imgClassName = highlight ? undefined : "opacity-20";
  return (
    <SingleCivIconWrap {...props}>
      {disablePopup && <img src={getCivImgUrl(civData.key)} alt="" className={imgClassName} />}
      {!disablePopup && (
        <ContentWithPopover popover={<TooltipContent civData={civData} />}>
          <img src={getCivImgUrl(civData.key)} alt="" className={imgClassName} />
        </ContentWithPopover>
      )}
    </SingleCivIconWrap>
  );
};

export default SingleCivIcon;

export const TooltipContent = ({ civData }: { civData: ICivData; }) => {
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
