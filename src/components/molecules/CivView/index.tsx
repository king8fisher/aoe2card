import { useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/src/shadcn/components/ui/accordion";
import { ICivData, IUnitCivData, getAllCivUnits } from "../../../data/model";
import { getCivImgUrl } from "../../../helpers/tools";
import { UnitsPresentationFlex } from "../../../styles";
import { UnitPresentation } from "../UnitPresentation";

interface ICivViewProps {
  civ: ICivData;
}

export const CivView = ({ civ }: ICivViewProps) => {
  const unitsByCiv: IUnitCivData[] = useMemo(() => getAllCivUnits(civ.key), [civ]);

  const renderCivDetailsView = () => (
    <>
      {(civ?.help || "") != "" && (
        <div className="text-sm pb-3">{<span dangerouslySetInnerHTML={{ __html: civ?.help || "" }} />}</div>
      )}
      <UnitsPresentationFlex>
        {unitsByCiv?.map((unitCivData) => (
          <UnitPresentation
            key={`${unitCivData.civ.key}-${unitCivData.unit.id}`}
            unitCivData={unitCivData}
            showCiv={false}
          />
        ))}
      </UnitsPresentationFlex>
    </>
  );

  return (
    <Accordion type="single" collapsible className="details w-full mt-2">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        {/* <SlIcon name="plus-square" slot="expand-icon" />
        <SlIcon name="dash-square" slot="collapse-icon" /> */}
        <AccordionContent>
          <span slot="summary" className="flex flex-row gap-3 items-center">
            <img src={getCivImgUrl(civ.key)} className="w-5 h-5 flex-shrink-0" />
            {civ.value}
          </span>
          {renderCivDetailsView()}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
