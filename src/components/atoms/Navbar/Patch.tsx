import patch from "../../../data/json/patch.json" with { type: "json" };

export const Patch = () => {
  return (
    <>
      <span
        className="text-xs opacity-30 flex flex-col items-left py-2"
        title={`Age of Empires II: Definitive Edition - Patch ${patch.DE}`}
      >
        <span>DE</span>
        <span>{patch.DE}</span>
      </span>
    </>
  );
};
