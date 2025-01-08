"use client";

import clsx from "clsx";
import { Check, CheckCircleIcon, CheckIcon, MinusCircleIcon } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import SingleCivIcon from "~/src/components/atoms/SingleCivIcon";
import { AllCivsHoverOver } from "~/src/components/molecules/CivView/AllCivsHoverOver";
import Navbar from "~/src/components/molecules/Navbar";
import { data, getAllCivs, ICivData } from "~/src/data/model";
import { Age, Tech } from "~/src/data/types/data_json_types";
import { getTechImgUrl } from "~/src/helpers/tools";
import { Container } from "~/src/styles";

const ClientOnly = () => {
  const listOfCivs = [
    "Burgundians",
    "Armenians",
    "Aztecs",
    // "Berbers",
    // "Bohemians",
    // "Britons"
  ];


  const allCivs = useMemo(() => {
    const allCivs = getAllCivs();
    return listOfCivs.map((civKey) => allCivs.find((v) => v.value == civKey)!);
  }, []);
  return <CivsTechComparison civs={allCivs} />;
};

const CivsTechComparison = ({ civs }: { civs: ICivData[]; }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Container className="flex flex-col gap-2 pt-2">

        <div className="flex flex-row">
          <span className="w-[12rem] shrink-0"></span>
          {civs.map((civData) => {
            return (<div
              className="w-5 shrink-0 text-xs"
              key={civData.key}>
              <SingleCivIcon
                civData={civData}
                highlight={true}
                key={civData.key}
                className="w-5 h-5" />
            </div>);
          })}
        </div>

        {techs(civs).nonMatching.map(t => {
          const anyDiffs = civs.
            some((civData) => {
              const first = techAvailabilityAge(t.id, civs[0].key);
              const thisOne = techAvailabilityAge(t.id, civData.key);
              return (first !== null && thisOne !== null && first != thisOne);
            });
          const minAge =
            civs
              .map((civData) => techAvailabilityAge(t.id, civData.key))
              .filter((v) => v != null)
              .reduce((a: number, b: number) => Math.min(a!, b!), 4);

          return <div key={t.id} className="flex flex-row">
            <span className="w-[12rem] shrink-0 text-base whitespace-break-spaces flex flex-row gap-1" title={`${t.id} - ${t.tech.internal_name}`}>
              <img src={getTechImgUrl(t.tech.ID)} height={20} width={20} alt={t.tech.internal_name}
                className="shrink-0 w-6 h-6 rounded" />
              {t.tech.internal_name}
            </span>
            {civs.map((civData) => {
              const techAge = techAvailabilityAge(t.id, civData.key);
              const ageDiff = techAge != null ? techAge - minAge : 0;
              return (<div
                className="w-5 shrink-0 text-xs"
                key={civData.key}>
                {techAge != null ?
                  <div className="">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    {anyDiffs &&
                      <div className="relative">
                        <div className={clsx("absolute -top-4 right-1 rounded-full p-px  font-bold text-[11px] h-3 w-3 leading-none text-center",
                          ageDiff > 0 ? "bg-neutral-300 text-black" :
                            ageDiff < 0 ? "bg-red-400 text-black" : "bg-green-800 text-white",
                        )}>
                          <div style={{ position: 'relative', top: '-1px' }}>
                            {techAge}
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                  :
                  <MinusCircleIcon className="w-5 h-5 text-red-800 p-1" />}
              </div>);
            })
            }
          </div>;
        })
        }
      </Container>
    </div>
  );
};

const techs = (civs: ICivData[]) => {
  const matching = new Array<{ id: string, tech: Tech; }>();
  const nonMatching = new Array<{ id: string, tech: Tech; }>();
  const all = new Array<{ id: string, tech: Tech; }>();
  for (const techId in data.data.techs) {
    const allTrue = civs.every((civData) => techAvailabilityAge(techId, civData.key) !== null);
    const allFalse = civs.every((civData) => techAvailabilityAge(techId, civData.key) == null);
    const anyDiffs = civs.some(
      (civData) => techAvailabilityAge(techId, civData.key)
        !== techAvailabilityAge(techId, civs[0].key)
    );
    if (anyDiffs || (!allTrue && !allFalse)) {
      nonMatching.push({ id: techId, tech: data.data.techs[techId] });
    } else {
      matching.push({ id: techId, tech: data.data.techs[techId] });
    }
    all.push({ id: techId, tech: data.data.techs[techId] });
  }
  return { matching, nonMatching, all };
};

const techAvailabilityAge = (techId: string, civKey: string): Age | null => {
  const found = data.techtrees[civKey].techs.find(t => t.id.toString() === techId);
  return found ? found.age : null;
  //return data.techtrees[civKey].techs.some(t => t.id.toString() === techId);
};

const unitAvailabilityAge = (unitId: string, civKey: string): Age | null => {
  const found = data.techtrees[civKey].units.find(t => t.id.toString() === unitId);
  return found ? found.age : null;
};

export default ClientOnly;