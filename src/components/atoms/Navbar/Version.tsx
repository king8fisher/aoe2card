import patch from "../../../data/json/patch.json";
export const Version = () => {
  return (<><span className="text-xs opacity-30" title={`Age of Empires II: Definitive Edition - Update ${patch.DE}`}>DE<br />{patch.DE}</span></>);
};