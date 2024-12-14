import { IStatisticsUnitData } from "./model";
import { Armour, Attack } from "./types/data_json_types";

/**
 * Returns default melee/pierce damage of attackingUnit against defendingUnit.
 * @param attackingUnit 
 * @param defendingUnit 
 * @returns 
 */
export function calculateDamage(attackingUnit: IStatisticsUnitData, defendingUnit: IStatisticsUnitData) {
  const matchingData = findMatchingClasses(attackingUnit, defendingUnit);
  let sum = 0;
  matchingData.forEach((d) => {
    let temp = d.attack.Amount - d.defend.Amount;
    temp = Math.max(temp, 0);
    sum += temp;
  });
  const damage = Math.max(sum, 1);
  return damage;
}

/**
 * Returns an array of matching classes 
 * ```
 * { Attack: n, Class: i  } < --- > { Armor: n, Class i }
 * ```
 * and fallback to 10000 in case matching class was not found.
 */
function findMatchingClasses(attackingUnit: IStatisticsUnitData, defendingUnit: IStatisticsUnitData) {
  const result: {
    attack: Attack;
    defend: Armour;
  }[] = [];
  for (const record of attackingUnit.unitStatistics.Attacks) {
    let found = false;
    for (const def of defendingUnit.unitStatistics.Armours) {
      if (def.Class == record.Class) {
        result.push({
          attack: record,
          defend: def
        });
        found = true;
      }
    }
    if (!found) {
      result.push({
        attack: record,
        defend: {
          Amount: 10000,
          Class: record.Class
        }
      });
    }
  }
  return result;
}
