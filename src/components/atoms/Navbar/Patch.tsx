import patch from "../../../data/json/patch.json";

export const Patch = () => {
  return (
    <>
      <span
        className="text-xs opacity-30 flex flex-col items-left"
        title={`Age of Empires II: Definitive Edition - Patch ${patch.DE}`}
      >
        <span>DE</span>
        <span>
          {patch.DE}
        </span>
      </span>
    </>
  );
};

