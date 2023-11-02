var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
import dataSrc from "./json/data.json";
import stringsSrc from "./json/strings.json";
var data = dataSrc;
var strings = stringsSrc;
export var extractUnitDataByID = function (unitId) {
  // data.data.units[561].LanguageNameId // 5458
  // strings[5458] // "Elite Mangudai"
  var d = data.data.units[unitId.toString()];
  return {
    name: strings[d.LanguageNameId],
    unitStatistics: d,
  };
};
export var unitHelpByID = function (unitId) {
  var _a;
  var about = (_a = strings[data.data.units[unitId.toString()].LanguageHelpId]) !== null && _a !== void 0 ? _a : "";
  return splitAbout(about);
};
var strongEnRegex = new RegExp("strong\\s+vs.\\s+([^\\.]+)\\.?", "gmiu");
var weakEnRegex = new RegExp("weak\\s+vs.\\s+([^\\.]+)\\.?", "gmiu");
var trimSuffix = function (s, suffix) {
  return s.endsWith(suffix) ? s.substring(0, s.length - suffix.length) : s;
};
var splitAbout = function (about) {
  // Trim "Create <Unit Name> (‹cost›)" out of the "about" section
  //              |   var   |
  //              |  piece  |
  var f = about.indexOf("(‹cost›)<br>\n");
  var aboutTrimmed = about;
  if (f >= 0) aboutTrimmed = about.substring(f + 13);
  // Remove \n‹hp› ‹attack› ‹armor› ‹piercearmor› ‹range›
  // Remove \n‹hp› ‹attack› ‹armor› ‹piercearmor› ‹range› ‹garrison›
  // Remove ...
  var h = aboutTrimmed.indexOf("\n‹hp› ");
  if (h >= 0) aboutTrimmed = aboutTrimmed.substring(0, h);
  var u = aboutTrimmed.indexOf("<i> Upgrades:");
  var upgrades = "";
  if (u >= 0) {
    upgrades = aboutTrimmed.substring(u + 13).trim();
    upgrades = trimSuffix(upgrades, ".</i><br>");
    aboutTrimmed = aboutTrimmed.substring(0, u);
  }
  // Resetting regex
  strongEnRegex.lastIndex = 0;
  weakEnRegex.lastIndex = 0;
  var m;
  var strong = "";
  if ((m = strongEnRegex.exec(aboutTrimmed)) !== null) {
    if (m.index !== strongEnRegex.lastIndex) {
      strong = m[1];
      aboutTrimmed = aboutTrimmed.replace(m[0], "");
    }
  }
  var weak = "";
  if ((m = weakEnRegex.exec(aboutTrimmed)) !== null) {
    if (m.index !== weakEnRegex.lastIndex) {
      weak = m[1];
      aboutTrimmed = aboutTrimmed.replace(m[0], "");
    }
  }
  return { about: aboutTrimmed, strong: strong, weak: weak, upgrades: upgrades };
};
export var techNameByID = function (techId) {
  // data.data.techs[6].internal_name // "Mongol Siege Drill"
  // data.data.techs[6].LanguageNameId // 7422
  // strings[7422] // "Drill"
  return strings[data.data.techs[techId].LanguageNameId];
};
var _cachedAllCivs = [];
export var getAllCivs = function () {
  if (_cachedAllCivs.length > 0) {
    return _cachedAllCivs;
  }
  Object.entries(data.civ_names).forEach(function (v, _k) {
    // {key: internal_name, value: strings_localized_value}
    var help = strings[data.civ_helptexts[v[0]]];
    _cachedAllCivs.push({
      key: v[0],
      value: strings[v[1]],
      help: help,
    });
  });
  return _cachedAllCivs;
};
var _cachedCivByKey = new Map();
export var civByKey = function (civKey) {
  if (_cachedCivByKey.has(civKey)) {
    return _cachedCivByKey.get(civKey);
  }
  var result = {
    key: civKey,
    value: strings[data.civ_names[civKey]],
    help: strings[data.civ_helptexts[civKey]],
  };
  _cachedCivByKey.set(civKey, result);
  return result;
};
export var UnitType;
(function (UnitType) {
  UnitType[(UnitType["RegularUnit"] = 0)] = "RegularUnit";
  UnitType[(UnitType["CastleAgeUniqueUnit"] = 1)] = "CastleAgeUniqueUnit";
  UnitType[(UnitType["ImperialAgeUniqueUnit"] = 2)] = "ImperialAgeUniqueUnit";
})(UnitType || (UnitType = {}));
var _cacheAllUnitsByCivKey = new Map();
export var allUnits = function (civKey) {
  if (_cacheAllUnitsByCivKey.has(civKey)) {
    return _cacheAllUnitsByCivKey.get(civKey);
  }
  var entries = [];
  data.techtrees[civKey].units.forEach(function (id) {
    entries.push({
      id: id,
      statisticsUnitData: extractUnitDataByID(id),
      unitType: UnitType.RegularUnit,
      help: unitHelpByID(id),
    });
  });
  _cacheAllUnitsByCivKey.set(civKey, entries);
  return entries;
};
export var imperialAgeUniqueUnit = function (civKey) {
  var id = data.techtrees[civKey].unique.imperialAgeUniqueUnit;
  return {
    id: id,
    statisticsUnitData: extractUnitDataByID(id),
    unitType: UnitType.ImperialAgeUniqueUnit,
    help: unitHelpByID(id),
  };
};
export var castleAgeUniqueUnit = function (civKey) {
  var id = data.techtrees[civKey].unique.castleAgeUniqueUnit;
  return {
    id: id,
    statisticsUnitData: extractUnitDataByID(id),
    unitType: UnitType.CastleAgeUniqueUnit,
    help: unitHelpByID(id),
  };
};
// TODO: Refactor this into a function
var Cost = /** @class */ (function () {
  function Cost(food, gold, stone, wood) {
    this.food = food;
    this.gold = gold;
    this.stone = stone;
    this.wood = wood;
  }
  Cost.prototype.toKey = function () {
    return "f".concat(this.food, "g").concat(this.gold, "s").concat(this.stone, "w").concat(this.wood);
  };
  Cost.key = function (food, gold, stone, wood) {
    return new Cost(food, gold, stone, wood).toKey();
  };
  return Cost;
})();
export { Cost };
export var searchUnits = function (like) {
  like = like.toLowerCase().trim();
  if (like == "") return [];
  // TODO: Turn this into fuzzy search
  return matchUnits(getAllCivs(), function (u) {
    return u.statisticsUnitData.name.toLowerCase().indexOf(like) >= 0 || u.id.toString() == like;
  });
};
export var groupByUnitType = function (units) {
  var result = [];
  var _loop_1 = function (i) {
    var next = units[i];
    var found = result.find(function (v) {
      return v.unit.id == next.unit.id;
    });
    if (found) {
      found.civs.add(next.civ.key);
      // found.civs.push(next);
    } else {
      var m = new Set();
      m.add(next.civ.key);
      result.push({ unit: next.unit, civs: m, mostCommonUnitStats: { cost: next.unitStats.cost } });
    }
  };
  for (var i = 0; i < units.length; i++) {
    _loop_1(i);
  }
  // patchCalculateMostCommon(result);
  return result;
};
// const patchCalculateMostCommon = (result: IGroupByUnitData[]) => {
//   result.forEach((r) => {
//     const st: Map<string, [Cost, number]> = new Map();
//     r.civs.forEach((c, _civKey) => {
//       const costKey = c.unitStats.cost.toKey();
//       if (st.has(costKey)) {
//         const [c, n] = st.get(costKey)!;
//         st.set(costKey, [c, n + 1]);
//       } else {
//         st.set(costKey, [c.unitStats.cost, 1]);
//       }
//     });
//     if (st.size > 1) {
//       // TODO: Run this through tests. If we always have the same price
//       // for every single unit, why bothering with this sorting / calculating
//       // the most common price?
//       console.error(`Unexpected map size: ${st}`);
//     }
//     const a = [...st.entries()].sort((a, b) => b[1][1] - a[1][1]);
//     r.mostCommonUnitStats.cost = a[0][1][0];
//   });
// };
export var getAllCivUnits = function (civKey) {
  var civ_ = civByKey(civKey);
  if (civ_ == null) return [];
  return matchUnits([civ_], function (_u) {
    return true;
  });
};
export var matchUnits = function (civs, match) {
  var result = [];
  civs.forEach(function (c) {
    __spreadArray([imperialAgeUniqueUnit(c.key), castleAgeUniqueUnit(c.key)], allUnits(c.key), true).forEach(
      function (u) {
        if (match(u)) {
          var cost = data.data.units[u.id].Cost;
          result.push({
            civ: c,
            unit: u,
            unitStats: {
              cost: new Cost(
                cost["Food"] || 0,
                cost["Gold"] || 0,
                0, // FIXME: Units cost no stone ? Type doesn't appear to have stone. Confirm.
                cost["Wood"] || 0
              ),
            },
          });
        }
      }
    );
  });
  return result;
};
export var searchCivs = function (like) {
  like = like.toLowerCase().trim();
  if (like == "") return [];
  // TODO: Turn this into fuzzy search
  return matchCivs(getAllCivs(), function (u) {
    return u.value.toLowerCase().indexOf(like) >= 0 || u.key.toLowerCase().indexOf(like) >= 0;
  });
};
export var matchCivs = function (civs, match) {
  var result = [];
  civs.forEach(function (c) {
    if (match(c)) {
      result.push(c);
    }
  });
  return result;
};
