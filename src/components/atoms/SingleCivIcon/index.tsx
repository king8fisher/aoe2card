import { ICivData } from "../../../data/model";
import { getCivImgUrl } from "../../../helpers/tools";
import { ContentWithTooltip } from "../ContentWithTooltip";
import { SingleCivIconWrap } from "./styles";

interface SingleCivIconProps {
  highlight: boolean;
  civData: ICivData;
}

const SingleCivIcon = ({ highlight, civData }: SingleCivIconProps) => {
  const imgClassName = highlight ? undefined : "opacity-20";
  return (
    <SingleCivIconWrap>
      <ContentWithTooltip
        tooltip={
          <>
            <span className="font-bold leading-6">{civData.value}</span>
            <span dangerouslySetInnerHTML={{ __html: civData.help }} />
          </>
        }
      >
        <img src={getCivImgUrl(civData.key)} className={imgClassName} />
      </ContentWithTooltip>
    </SingleCivIconWrap>
  );
};

export default SingleCivIcon;
