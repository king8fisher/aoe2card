import { useState } from "react";
import { ICivData } from "../../../data/model";
import { getCivImgUrl } from "../../../helpers/tools";
import { SlTooltip } from "@shoelace-style/shoelace/dist/react";

interface SingleCivIconProps {
  highlight: boolean;
  civData: ICivData;
}

const SingleCivIcon = ({ highlight, civData }: SingleCivIconProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const imgClassName = highlight ? "w-7 h-7" : "w-7 h-7 opacity-20";
  return (
    <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
      {showTooltip && (
        <SlTooltip style={{ ["--show-delay" as string]: "400" }}>
          <div className="flex flex-col gap-1" slot="content">
            <span className="font-bold leading-6">{civData.value}</span>
            <span dangerouslySetInnerHTML={{ __html: civData.help }} />
          </div>
          <img src={getCivImgUrl(civData.key)} className={imgClassName} />
        </SlTooltip>
      )}
      {!showTooltip && <img src={getCivImgUrl(civData.key)} className={imgClassName} />}
    </div>
  );
};

export default SingleCivIcon;
