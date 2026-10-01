function CAP() {
	this.pokemonName = "";

	this.slug = "";
	this.type1 = "";
	this.type2 = "";

	this.ability1 = "";
	this.ability1Desc = "";
	this.customAbility1 = null;
	this.ability2 = "";
	this.ability2Desc = "";
	this.customAbility2 = null;
	this.ability3 = "";
	this.ability3Desc = "";

	this.baseHP = 0;
	this.baseAttack = 0;
	this.baseDefense = 0;
	this.baseSpAttack = 0;
	this.baseSpDefense = 0;
	this.baseSpeed = 0;

	this.weightKilos = 0;

	this.eggGroup1 = "";
	this.eggGroup2 = "";

	var i;
	this.movesLevel = [];
	for (i=0;i<101;i++) { this.movesLevel[i] = null; }
	this.movesTM = [];
	for (i=0;i<100;i++) { this.movesTM[i] = null; }
	this.movesHM = [];
	for (i=0;i<10;i++) { this.movesHM[i] = null; }
	this.movesEgg = [];
	this.movesTutor = [];
	this.movesEvent = [];
	this.movesCustom = [];

	this.movesets = [];

	this.topicLeader = "";
	this.conceptCreator = ""
	this.statSpreadCreator = "";
	this.designArtist = "";
	this.spriteArtist = "";
	this.nameCreator = "";
	this.movepoolCreator = "";
	this.playtestChampion = "";

	this.indexDesc = "";
	this.generation = null;
};
CAP.prototype.calcStat = function(base, iv, ev, natureString, labelString) {
	var natureMultiplier = 1;
	if (natureString == "+") {
		natureMultiplier = 1.1;
	}
	if (natureString == "-") {
		natureMultiplier = 0.9;
	}
	var computedStat = 0;
	if (labelString == 'HP') {
		if (natureString == '') {
			computedStat = Math.floor(Math.floor(((((2 * base) + iv) + Math.floor(ev/4))) + 10) + 100);
		} else {
			computedStat = '-';
		}
	} else {
		computedStat = Math.floor(Math.floor(((((2 * base) + iv) + Math.floor(ev/4))) + 5) * natureMultiplier);
	}
	return computedStat;
};
function Moveset() {
	this.movesetName = "";
	this.ability = "";
	this.item = "";
	this.nature = "";

	this.hpEV = 0;
	this.atkEV = 0;
	this.defEV = 0;
	this.spAtkEV = 0;
	this.spDefEV = 0;
	this.speedEV = 0;

	this.moveslots = [];
};
function CustomMove() {
	this.moveName = "";
	this.type = "";
	this.category = "";
	this.power = 0;
	this.accuracy = 0;
	this.priority = 0;
	this.pp = 0;
	this.target = "Single non-user";
	this.shortDesc = "";
	this.longDesc = "";
};
function CustomAbility() {
	this.abilityName = "";
	this.shortDesc = "";
	this.longDesc = "";
};
function lowerAndJoin(aString) {
	return aString.toLowerCase().replace(" ", "_");
};
function dexNumber(aNumber, aDigits) {
	var str = "" + aNumber;
	while (str.length < aDigits) str = "0" + str;
	return str;
};
function capSlug(cap) {
	if (cap.slug !== "") return cap.slug;
	return cap.pokemonName.toLowerCase();
};
function toHex(aNumber) {
  var result = "00";
  if ((aNumber >= 0) && (aNumber <= 15))
  	{ result = "0" + aNumber.toString(16); }
  else
  	{ result = aNumber.toString(16); }
  return result;
};
function getBar(aStat) {
	var widthPx = Math.max(Math.min((aStat * 1.5), 300), 18);

	var cstat = Math.floor(Math.min(Math.max(aStat - 50, 0), 100) * 2.55);
    var r = toHex(Math.min(((255 - cstat) * 2), 255));
    var g = toHex(Math.min(cstat * 2,255));
    var b = toHex(Math.floor(Math.min(Math.max((aStat - 140), 0), 60) * (255 / 60)));
    var rgb = r + g + b;

	return '<div class="statBar" style="width: ' + widthPx + 'px; background: #' + rgb + ';">' + aStat + '</div>';
}
function getStatRow(aStat, aLabel) {
	var txt = '';
	txt += '<tr> \n';
	txt += '<th>' + aLabel + '</th> \n';
	txt += '<td class="bar"> \n';
	txt += getBar(aStat) + '\n';
	txt += '</td> \n';
	txt += '<td>' + cap.calcStat(aStat, 0, 0, '-', aLabel) + '</td> \n';
	txt += '<td>' + cap.calcStat(aStat, 31, 0, '', aLabel) + '</td> \n';
	txt += '<td>' + cap.calcStat(aStat, 31, 252, '', aLabel) + '</td> \n';
	txt += '<td>' + cap.calcStat(aStat, 31, 252, '+', aLabel) + '</td> \n';
	txt += '</tr> \n';
	return txt;
};
function getTypeIcon(aType) {
	var lowerType = aType.toLowerCase();
	return '<img class="typeIcon" src="' + siteBase() + 'types/' +
	lowerType + '_big.png" alt="' + aType + '" />';
};
function getTypePair(aCap) {
	var second = aCap.type2 !== '' ? aCap.type2 : aCap.type1;
	return getTypeIcon(aCap.type1) + getTypeIcon(second);
};
var capNameBySlug = null;
function capNames() {
	if (capNameBySlug !== null) return capNameBySlug;
	capNameBySlug = {};
	for (var i = 1; i < caps.length; i++) {
		if (caps[i] !== null && caps[i] !== undefined) {
			capNameBySlug[capSlug(caps[i])] = caps[i].pokemonName;
		}
	}
	return capNameBySlug;
}
function getEvoChain(aCap) {
	var self = capSlug(aCap);
	var root = EVO_MEMBER[self];
	if (!root) return '';
	var line = EVO_LINE[root];
	if (!line) return '';
	var names = capNames();
	var kids = {}, via = {};
	var i, e;
	for (i = 0; i < line.length; i++) {
		e = line[i];
		if (kids[e[0]] === undefined) kids[e[0]] = [];
		kids[e[0]].push(e[1]);
		via[e[1]] = e[2];
	}

	var trunk = [self];
	var node = self;
	for (var guard = 0; node !== root && guard < 32; guard++) {
		var parent = null;
		for (i = 0; i < line.length; i++) {
			if (line[i][1] === node) { parent = line[i][0]; break; }
		}
		if (parent === null) break;
		trunk.unshift(parent);
		node = parent;
	}

	var down = [];
	function walk(at, acc) {
		if (down.length > 32) return;
		var next = kids[at];
		if (next === undefined || next.length === 0) { down.push(acc.slice(0)); return; }
		for (var k = 0; k < next.length; k++) {
			acc.push(next[k]);
			walk(next[k], acc);
			acc.pop();
		}
	}
	walk(self, []);
	if (down.length === 0) down.push([]);
	var out = [];
	for (var p = 0; p < down.length; p++) {
		var seq = (p === 0) ? trunk.concat(down[p]) : down[p];
		var bits = [];
		for (var q = 0; q < seq.length; q++) {
			var slug = seq[q];
			var label = (names[slug] !== undefined) ? names[slug] : slug;
			var link = '<a href="../pokedex/' + slug + '.html" class="evoName">[' +
				label + ']</a>';
			if (p === 0 && q === 0) {
				bits.push(link);
			} else if (via[slug] !== undefined && via[slug] !== '') {
				bits.push('<span class="evoVia' + ((p > 0 && q === 0) ? ' evoViaSep' : '') + '">' +
					via[slug] +
					'</span><span class="evoArrow">&#8594;</span>' + link);
			} else {
				bits.push('<span class="evoArrow">&#8594;</span>' + link);
			}
		}
		out.push('<span class="evoPath">' + bits.join('') + '</span>');
	}
	return '<span class="evoChain">' + out.join('<span class="evoSep">|</span>') + '</span>';
};
function indexDescFor(aCap) {
	var note = (aCap.indexDesc === undefined || aCap.indexDesc === null)
		? '' : String(aCap.indexDesc).replace(/^\s+|\s+$/g, '');
	if (note !== '') return note;
	return getEvoChain(aCap);
}
function abilityAnchor(name) {
	if (name === undefined || name === null) return '';
	var text = String(name).replace(/^\s+|\s+$/g, '');
	if (text === '') return '';
	if (ABILITY_ANCHOR[text] !== undefined) return ABILITY_ANCHOR[text];
	var slug = text.toLowerCase().replace(/[^0-9a-z]+/g, '-').replace(/^-+|-+$/g, '');
	if (ABILITY_ANCHOR[slug] !== undefined) return ABILITY_ANCHOR[slug];
	return '';
}
function abilityLinks(aCap) {
	var names = [aCap.ability1, aCap.ability2];
	var out = [];
	for (var i = 0; i < names.length; i++) {
		var text = (names[i] === undefined || names[i] === null)
			? '' : String(names[i]).replace(/^\s+|\s+$/g, '');
		if (text === '') continue;
		var anchor = abilityAnchor(text);
		if (anchor !== '') {
			out.push('<a class="abLink" href="' + siteBase() + 'abilities.html#' +
				anchor + '">' + text + '</a>');
		} else {
			out.push('<span class="abPlain">' + text + '</span>');
		}
	}
	if (out.length === 0) return '';
	return '<span class="abWrap">' + out.join('<span class="abOr">|</span>') + '</span>';
}
function displayName(aName) {
	var text = (aName === undefined || aName === null) ? '' : String(aName);
	var sign = '';
	var m = /[\u2640\u2642]$/.exec(text);
	if (m !== null) {
		sign = m[0];
		text = text.slice(0, text.length - 1);
	}
	if (sign === '') return text;
	return text + '<span class="genderSign">' + sign + '</span>';
}
function siteBase() {
	var path = (typeof location !== "undefined" && location.pathname != null) ? location.pathname : "/";
	if (path.indexOf("/pokedex/moves/") >= 0 || path.indexOf("/pokedex/strategies/") >= 0) return "../../";
	return "../";
};
var SPRITE_SLUG = {"nidoran_female": "nidoran_f", "nidoran_male": "nidoran_m", "unown": "unown/x"};
var EVO_LINE = {
	"abra": [["abra", "kadabra", "Level 16"], ["kadabra", "alakazam", "Trade"]],
	"bellsprout": [["bellsprout", "weepinbell", "Level 21"], ["weepinbell", "victreebel", "Leaf Stone"]],
	"bulbasaur": [["bulbasaur", "ivysaur", "Level 16"], ["ivysaur", "venusaur", "Level 32"]],
	"caterpie": [["caterpie", "metapod", "Level 7"], ["metapod", "butterfree", "Level 10"]],
	"chansey": [["chansey", "blissey", "High Friendship"]],
	"charmander": [["charmander", "charmeleon", "Level 16"], ["charmeleon", "charizard", "Level 36"]],
	"chikorita": [["chikorita", "bayleef", "Level 16"], ["bayleef", "meganium", "Level 32"]],
	"chinchou": [["chinchou", "lanturn", "Level 27"]],
	"cleffa": [["cleffa", "clefairy", "High Friendship"], ["clefairy", "clefable", "Moon Stone"]],
	"cubone": [["cubone", "marowak", "Level 28"]],
	"cyndaquil": [["cyndaquil", "quilava", "Level 14"], ["quilava", "typhlosion", "Level 36"]],
	"diglett": [["diglett", "dugtrio", "Level 26"]],
	"doduo": [["doduo", "dodrio", "Level 31"]],
	"dratini": [["dratini", "dragonair", "Level 30"], ["dragonair", "dragonite", "Level 55"]],
	"drowzee": [["drowzee", "hypno", "Level 26"]],
	"eevee": [["eevee", "vaporeon", "Water Stone"], ["eevee", "jolteon", "Thunder Stone"], ["eevee", "flareon", "Fire Stone"], ["eevee", "espeon", "Sun Stone"], ["eevee", "umbreon", "Moon Stone"]],
	"ekans": [["ekans", "arbok", "Level 22"]],
	"elekid": [["elekid", "electabuzz", "Level 30"]],
	"exeggcute": [["exeggcute", "exeggutor", "Leaf Stone"]],
	"gastly": [["gastly", "haunter", "Level 25"], ["haunter", "gengar", "Trade"]],
	"geodude": [["geodude", "graveler", "Level 25"], ["graveler", "golem", "Trade"]],
	"goldeen": [["goldeen", "seaking", "Level 33"]],
	"grimer": [["grimer", "muk", "Level 38"]],
	"growlithe": [["growlithe", "arcanine", "Fire Stone"]],
	"hoothoot": [["hoothoot", "noctowl", "Level 20"]],
	"hoppip": [["hoppip", "skiploom", "Level 18"], ["skiploom", "jumpluff", "Level 27"]],
	"horsea": [["horsea", "seadra", "Level 32"], ["seadra", "kingdra", "Trade (Dragon Scale)"]],
	"houndour": [["houndour", "houndoom", "Level 24"]],
	"igglybuff": [["igglybuff", "jigglypuff", "High Friendship"], ["jigglypuff", "wigglytuff", "Moon Stone"]],
	"kabuto": [["kabuto", "kabutops", "Level 40"]],
	"koffing": [["koffing", "weezing", "Level 35"]],
	"krabby": [["krabby", "kingler", "Level 28"]],
	"larvitar": [["larvitar", "pupitar", "Level 30"], ["pupitar", "tyranitar", "Level 55"]],
	"ledyba": [["ledyba", "ledian", "Level 18"]],
	"machop": [["machop", "machoke", "Level 28"], ["machoke", "machamp", "Trade"]],
	"magby": [["magby", "magmar", "Level 30"]],
	"magikarp": [["magikarp", "gyarados", "Level 20"]],
	"magnemite": [["magnemite", "magneton", "Level 30"]],
	"mankey": [["mankey", "primeape", "Level 28"]],
	"mareep": [["mareep", "flaaffy", "Level 15"], ["flaaffy", "ampharos", "Level 30"]],
	"marill": [["marill", "azumarill", "Level 18"]],
	"meowth": [["meowth", "persian", "Level 28"]],
	"natu": [["natu", "xatu", "Level 25"]],
	"nidoran_female": [["nidoran_female", "nidorina", "Level 16"], ["nidorina", "nidoqueen", "Moon Stone"]],
	"nidoran_male": [["nidoran_male", "nidorino", "Level 16"], ["nidorino", "nidoking", "Moon Stone"]],
	"oddish": [["oddish", "gloom", "Level 21"], ["gloom", "bellossom", "Sun Stone"], ["gloom", "vileplume", "Leaf Stone"]],
	"omanyte": [["omanyte", "omastar", "Level 40"]],
	"onix": [["onix", "steelix", "Trade (Metal Coat)"]],
	"paras": [["paras", "parasect", "Level 24"]],
	"phanpy": [["phanpy", "donphan", "Level 25"]],
	"pichu": [["pichu", "pikachu", "High Friendship"], ["pikachu", "raichu", "Thunder Stone"]],
	"pidgey": [["pidgey", "pidgeotto", "Level 18"], ["pidgeotto", "pidgeot", "Level 36"]],
	"pineco": [["pineco", "forretress", "Level 31"]],
	"poliwag": [["poliwag", "poliwhirl", "Level 25"], ["poliwhirl", "poliwrath", "Water Stone"], ["poliwhirl", "politoed", "Trade (King's Rock)"]],
	"ponyta": [["ponyta", "rapidash", "Level 40"]],
	"porygon": [["porygon", "porygon2", "Trade (Up-Grade)"]],
	"psyduck": [["psyduck", "golduck", "Level 33"]],
	"rattata": [["rattata", "raticate", "Level 20"]],
	"remoraid": [["remoraid", "octillery", "Level 25"]],
	"rhyhorn": [["rhyhorn", "rhydon", "Level 42"]],
	"sandshrew": [["sandshrew", "sandslash", "Level 22"]],
	"scyther": [["scyther", "scizor", "Trade (Metal Coat)"]],
	"seel": [["seel", "dewgong", "Level 34"]],
	"sentret": [["sentret", "furret", "Level 15"]],
	"shellder": [["shellder", "cloyster", "Water Stone"]],
	"slowpoke": [["slowpoke", "slowbro", "Level 37"], ["slowpoke", "slowking", "Trade (King's Rock)"]],
	"slugma": [["slugma", "magcargo", "Level 38"]],
	"smoochum": [["smoochum", "jynx", "Level 30"]],
	"snubbull": [["snubbull", "granbull", "Level 23"]],
	"spearow": [["spearow", "fearow", "Level 20"]],
	"spinarak": [["spinarak", "ariados", "Level 22"]],
	"squirtle": [["squirtle", "wartortle", "Level 16"], ["wartortle", "blastoise", "Level 36"]],
	"staryu": [["staryu", "starmie", "Water Stone"]],
	"sunkern": [["sunkern", "sunflora", "Sun Stone"]],
	"swinub": [["swinub", "piloswine", "Level 33"]],
	"teddiursa": [["teddiursa", "ursaring", "Level 30"]],
	"tentacool": [["tentacool", "tentacruel", "Level 30"]],
	"togepi": [["togepi", "togetic", "High Friendship"]],
	"totodile": [["totodile", "croconaw", "Level 18"], ["croconaw", "feraligatr", "Level 30"]],
	"tyrogue": [["tyrogue", "hitmonchan", "Level 20, Atk &lt; Def"], ["tyrogue", "hitmonlee", "Level 20, Atk &gt; Def"], ["tyrogue", "hitmontop", "Level 20, Atk = Def"]],
	"venonat": [["venonat", "venomoth", "Level 31"]],
	"voltorb": [["voltorb", "electrode", "Level 30"]],
	"vulpix": [["vulpix", "ninetales", "Fire Stone"]],
	"weedle": [["weedle", "kakuna", "Level 7"], ["kakuna", "beedrill", "Level 10"]],
	"wooper": [["wooper", "quagsire", "Level 20"]],
	"zubat": [["zubat", "golbat", "Level 22"], ["golbat", "crobat", "High Friendship"]]
};

var EVO_MEMBER = {
	"abra": "abra",
	"alakazam": "abra",
	"ampharos": "mareep",
	"arbok": "ekans",
	"arcanine": "growlithe",
	"ariados": "spinarak",
	"azumarill": "marill",
	"bayleef": "chikorita",
	"beedrill": "weedle",
	"bellossom": "oddish",
	"bellsprout": "bellsprout",
	"blastoise": "squirtle",
	"blissey": "chansey",
	"bulbasaur": "bulbasaur",
	"butterfree": "caterpie",
	"caterpie": "caterpie",
	"chansey": "chansey",
	"charizard": "charmander",
	"charmander": "charmander",
	"charmeleon": "charmander",
	"chikorita": "chikorita",
	"chinchou": "chinchou",
	"clefable": "cleffa",
	"clefairy": "cleffa",
	"cleffa": "cleffa",
	"cloyster": "shellder",
	"crobat": "zubat",
	"croconaw": "totodile",
	"cubone": "cubone",
	"cyndaquil": "cyndaquil",
	"dewgong": "seel",
	"diglett": "diglett",
	"dodrio": "doduo",
	"doduo": "doduo",
	"donphan": "phanpy",
	"dragonair": "dratini",
	"dragonite": "dratini",
	"dratini": "dratini",
	"drowzee": "drowzee",
	"dugtrio": "diglett",
	"eevee": "eevee",
	"ekans": "ekans",
	"electabuzz": "elekid",
	"electrode": "voltorb",
	"elekid": "elekid",
	"espeon": "eevee",
	"exeggcute": "exeggcute",
	"exeggutor": "exeggcute",
	"fearow": "spearow",
	"feraligatr": "totodile",
	"flaaffy": "mareep",
	"flareon": "eevee",
	"forretress": "pineco",
	"furret": "sentret",
	"gastly": "gastly",
	"gengar": "gastly",
	"geodude": "geodude",
	"gloom": "oddish",
	"golbat": "zubat",
	"goldeen": "goldeen",
	"golduck": "psyduck",
	"golem": "geodude",
	"granbull": "snubbull",
	"graveler": "geodude",
	"grimer": "grimer",
	"growlithe": "growlithe",
	"gyarados": "magikarp",
	"haunter": "gastly",
	"hitmonchan": "tyrogue",
	"hitmonlee": "tyrogue",
	"hitmontop": "tyrogue",
	"hoothoot": "hoothoot",
	"hoppip": "hoppip",
	"horsea": "horsea",
	"houndoom": "houndour",
	"houndour": "houndour",
	"hypno": "drowzee",
	"igglybuff": "igglybuff",
	"ivysaur": "bulbasaur",
	"jigglypuff": "igglybuff",
	"jolteon": "eevee",
	"jumpluff": "hoppip",
	"jynx": "smoochum",
	"kabuto": "kabuto",
	"kabutops": "kabuto",
	"kadabra": "abra",
	"kakuna": "weedle",
	"kingdra": "horsea",
	"kingler": "krabby",
	"koffing": "koffing",
	"krabby": "krabby",
	"lanturn": "chinchou",
	"larvitar": "larvitar",
	"ledian": "ledyba",
	"ledyba": "ledyba",
	"machamp": "machop",
	"machoke": "machop",
	"machop": "machop",
	"magby": "magby",
	"magcargo": "slugma",
	"magikarp": "magikarp",
	"magmar": "magby",
	"magnemite": "magnemite",
	"magneton": "magnemite",
	"mankey": "mankey",
	"mareep": "mareep",
	"marill": "marill",
	"marowak": "cubone",
	"meganium": "chikorita",
	"meowth": "meowth",
	"metapod": "caterpie",
	"muk": "grimer",
	"natu": "natu",
	"nidoking": "nidoran_male",
	"nidoqueen": "nidoran_female",
	"nidoran_female": "nidoran_female",
	"nidoran_male": "nidoran_male",
	"nidorina": "nidoran_female",
	"nidorino": "nidoran_male",
	"ninetales": "vulpix",
	"noctowl": "hoothoot",
	"octillery": "remoraid",
	"oddish": "oddish",
	"omanyte": "omanyte",
	"omastar": "omanyte",
	"onix": "onix",
	"paras": "paras",
	"parasect": "paras",
	"persian": "meowth",
	"phanpy": "phanpy",
	"pichu": "pichu",
	"pidgeot": "pidgey",
	"pidgeotto": "pidgey",
	"pidgey": "pidgey",
	"pikachu": "pichu",
	"piloswine": "swinub",
	"pineco": "pineco",
	"politoed": "poliwag",
	"poliwag": "poliwag",
	"poliwhirl": "poliwag",
	"poliwrath": "poliwag",
	"ponyta": "ponyta",
	"porygon": "porygon",
	"porygon2": "porygon",
	"primeape": "mankey",
	"psyduck": "psyduck",
	"pupitar": "larvitar",
	"quagsire": "wooper",
	"quilava": "cyndaquil",
	"raichu": "pichu",
	"rapidash": "ponyta",
	"raticate": "rattata",
	"rattata": "rattata",
	"remoraid": "remoraid",
	"rhydon": "rhyhorn",
	"rhyhorn": "rhyhorn",
	"sandshrew": "sandshrew",
	"sandslash": "sandshrew",
	"scizor": "scyther",
	"scyther": "scyther",
	"seadra": "horsea",
	"seaking": "goldeen",
	"seel": "seel",
	"sentret": "sentret",
	"shellder": "shellder",
	"skiploom": "hoppip",
	"slowbro": "slowpoke",
	"slowking": "slowpoke",
	"slowpoke": "slowpoke",
	"slugma": "slugma",
	"smoochum": "smoochum",
	"snubbull": "snubbull",
	"spearow": "spearow",
	"spinarak": "spinarak",
	"squirtle": "squirtle",
	"starmie": "staryu",
	"staryu": "staryu",
	"steelix": "onix",
	"sunflora": "sunkern",
	"sunkern": "sunkern",
	"swinub": "swinub",
	"teddiursa": "teddiursa",
	"tentacool": "tentacool",
	"tentacruel": "tentacool",
	"togepi": "togepi",
	"togetic": "togepi",
	"totodile": "totodile",
	"typhlosion": "cyndaquil",
	"tyranitar": "larvitar",
	"tyrogue": "tyrogue",
	"umbreon": "eevee",
	"ursaring": "teddiursa",
	"vaporeon": "eevee",
	"venomoth": "venonat",
	"venonat": "venonat",
	"venusaur": "bulbasaur",
	"victreebel": "bellsprout",
	"vileplume": "oddish",
	"voltorb": "voltorb",
	"vulpix": "vulpix",
	"wartortle": "squirtle",
	"weedle": "weedle",
	"weepinbell": "bellsprout",
	"weezing": "koffing",
	"wigglytuff": "igglybuff",
	"wooper": "wooper",
	"xatu": "natu",
	"zubat": "zubat"
};

var ABILITY_ANCHOR = {
	"Air Lock": "air-lock",
	"Arena Trap": "arena-trap",
	"Battle Armor": "battle-armor",
	"Blaze": "blaze",
	"Cacophony": "cacophony",
	"Chlorophyll": "chlorophyll",
	"Clear Body": "clear-body",
	"Cloud Nine": "cloud-nine",
	"Color Change": "color-change",
	"Compound Eyes": "compound-eyes",
	"Cute Charm": "cute-charm",
	"Damp": "damp",
	"Drizzle": "drizzle",
	"Drought": "drought",
	"Early Bird": "early-bird",
	"Effect Spore": "effect-spore",
	"Flame Body": "flame-body",
	"Flash Fire": "flash-fire",
	"Forecast": "forecast",
	"Guts": "guts",
	"Huge Power": "huge-power",
	"Hustle": "hustle",
	"Hyper Cutter": "hyper-cutter",
	"Illuminate": "illuminate",
	"Immunity": "immunity",
	"Inner Focus": "inner-focus",
	"Insomnia": "insomnia",
	"Intimidate": "intimidate",
	"Keen Eye": "keen-eye",
	"Levitate": "levitate",
	"Lightning Rod": "lightning-rod",
	"Limber": "limber",
	"Liquid Ooze": "liquid-ooze",
	"Magma Armor": "magma-armor",
	"Magnet Pull": "magnet-pull",
	"Marvel Scale": "marvel-scale",
	"Minus": "minus",
	"Natural Cure": "natural-cure",
	"Oblivious": "oblivious",
	"Overgrow": "overgrow",
	"Own Tempo": "own-tempo",
	"Pickup": "pickup",
	"Plus": "plus",
	"Poison Point": "poison-point",
	"Pressure": "pressure",
	"Pure Power": "pure-power",
	"Rain Dish": "rain-dish",
	"Rock Head": "rock-head",
	"Rough Skin": "rough-skin",
	"Run Away": "run-away",
	"Sand Stream": "sand-stream",
	"Sand Veil": "sand-veil",
	"Serene Grace": "serene-grace",
	"Shadow Tag": "shadow-tag",
	"Shed Skin": "shed-skin",
	"Shell Armor": "shell-armor",
	"Shield Dust": "shield-dust",
	"Soundproof": "soundproof",
	"Speed Boost": "speed-boost",
	"Static": "static",
	"Stench": "stench",
	"Sticky Hold": "sticky-hold",
	"Sturdy": "sturdy",
	"Suction Cups": "suction-cups",
	"Swarm": "swarm",
	"Swift Swim": "swift-swim",
	"Synchronize": "synchronize",
	"Thick Fat": "thick-fat",
	"Torrent": "torrent",
	"Trace": "trace",
	"Truant": "truant",
	"Vital Spirit": "vital-spirit",
	"Volt Absorb": "volt-absorb",
	"Water Absorb": "water-absorb",
	"Water Veil": "water-veil",
	"White Smoke": "white-smoke",
	"Wonder Guard": "wonder-guard",
	"Adaptability": "adaptability",
	"Anger Point": "anger-point",
	"Download": "download",
	"Dry Skin": "dry-skin",
	"Filter": "filter",
	"Forewarn": "forewarn",
	"Frisk": "frisk",
	"Gluttony": "gluttony",
	"Hydration": "hydration",
	"Iron Fist": "iron-fist",
	"Leaf Guard": "leaf-guard",
	"Magic Guard": "magic-guard",
	"Mold Breaker": "mold-breaker",
	"Motor Drive": "motor-drive",
	"No Guard": "no-guard",
	"Quick Feet": "quick-feet",
	"Reckless": "reckless",
	"Rivalry": "rivalry",
	"Scrappy": "scrappy",
	"Skill Link": "skill-link",
	"Sniper": "sniper",
	"Snow Cloak": "snow-cloak",
	"Snow Warning": "snow-warning",
	"Solar Power": "solar-power",
	"Solid Rock": "solid-rock",
	"Steadfast": "steadfast",
	"Super Luck": "super-luck",
	"Tangled Feet": "tangled-feet",
	"Technician": "technician",
	"Tinted Lens": "tinted-lens"
};

var SPRITE_CYCLE = {"unown": {"front_normal.png": "unown/cycle.gif", "front_shiny.png": "unown/cycle_shiny.gif"}};
function spriteSlug(cap) {
	var slug = capSlug(cap);
	if (SPRITE_SLUG[slug] != null) return SPRITE_SLUG[slug];
	return slug;
};
function spriteUrl(cap, file) {
	var cycle = SPRITE_CYCLE[capSlug(cap)];
	if (cycle != null && cycle[file] != null) return siteBase() + "2/Sprites/" + cycle[file];
	return siteBase() + "2/Sprites/" + spriteSlug(cap) + "/" + file;
};
function spriteHide(img) {
	img.style.visibility = "hidden";
};
function spriteImg(cap, file, cls, alt) {
	return '<img class="' + cls + '" src="' + spriteUrl(cap, file) + '" alt="' + alt + '"'
		 + ' onerror="spriteHide(this)" />';
};
function topHeaderInfo(cap) {
	var lowerName = capSlug(cap);
	var txt = "";
	txt += '<table id="dex_pokemon" style="margin-bottom: 0px;"> \n';
	txt += '<tr> \n';
	txt += '<td class="sprite"><span class="pokemonIcon" style="background-image: url(' + spriteUrl(cap, "icon.png") + ');"></span></td> \n';
	txt += '<td class="header"> \n';
	txt += '<h1>' + cap.pokemonName + '</h1> \n';
	txt += getTypeIcon(cap.type1);
	if (cap.type2 !== '') {
	txt += getTypeIcon(cap.type2);
	}
	txt += '</td> \n';

	txt += '<td class="ability"> \n';
	txt += '<dl> \n';
	if (cap.customAbility1 == null) {
	txt += '<dt> \n';
	txt += '<a href="#">' + cap.ability1 + '</a> \n';
	txt += '</dt> \n';
	txt += '<dd>' + cap.ability1Desc + '</dd> \n';
	} else {
	txt += '<dt> \n';
	txt += '<a href="/2/abilities?' + lowerAndJoin(cap.customAbility1.abilityName) + '">' + cap.customAbility1.abilityName + '</a> \n';
	txt += '</dt> \n';
	txt += '<dd>' + cap.customAbility1.shortDesc + '</dd> \n';
	}
	if (cap.customAbility2 == null) {
	if (cap.ability2 !== '') {
	txt += '<dt> \n';
	txt += '<a href="#">' + cap.ability2 + '</a> \n';
	txt += '</dt> \n';
	txt += '<dd>' + cap.ability2Desc + '</dd> \n';
	}} else {
	txt += '<dt> \n';
	txt += '<a href="/2/abilities?' + lowerAndJoin(cap.customAbility2.abilityName) + '">' + cap.customAbility2.abilityName + '</a> \n';
	txt += '</dt> \n';
	txt += '<dd>' + cap.customAbility2.shortDesc + '</dd> \n';
	}
	if (cap.ability3 !== '') {
	txt += '<dt> \n';
	txt += '<em><a href="/abilities/' + lowerAndJoin(cap.ability3) + '">' + cap.ability3 + '</a></em> \n';
	txt += '</dt> \n';
	txt += '<dd>' + cap.ability3Desc + '</dd> \n';
	}
	txt += '</dl> \n';
	txt += '</td> \n';

	txt += '</tr> \n';
	txt += '</table> \n';

	return txt;
};
function composeDexPage(cap) {

	var lowerName = capSlug(cap);

	var txt = "";
	txt += '<ul class="tabs"> \n';
	txt += '<li><strong>#</strong></li> \n';
	txt += '<li class="tabspacer"><strong>Dex</strong></li> \n';
	txt += '<li><a href="moves/' + lowerName + '.html">Moves</a></li> \n';
	txt += '<li><a href="strategies/' + lowerName + '.html">Strategy</a></li> \n';
	txt += '</ul> \n';

	txt += topHeaderInfo(cap);

	txt += '<table id="dex_pokemon_stats" style="margin-top: 0px;"> \n';
	txt += '<caption>Statistics</caption> \n';
	txt += '<thead> \n';
	txt += '<tr> \n';
	txt += '<th colspan="2"></th> \n';
	txt += '<th align="left">Min-</th> \n';
	txt += '<th align="left">Min</th> \n';
	txt += '<th align="left">Max</th> \n';
	txt += '<th align="left">Max+</th> \n';
	txt += '</tr> \n';
	txt += '</thead> \n';
	txt += '<tbody> \n';
	txt += getStatRow(cap.baseHP, 'HP');
	txt += getStatRow(cap.baseAttack, 'Atk');
	txt += getStatRow(cap.baseDefense, 'Def');
	txt += getStatRow(cap.baseSpAttack, 'SpA');
	txt += getStatRow(cap.baseSpDefense, 'SpD');
	txt += getStatRow(cap.baseSpeed, 'Spe');
	txt += '</tbody> \n';
	txt += '</table> \n';

	txt += '<table class="info" > \n';
	txt += '<tr> \n';
	txt += '<th> </th> \n';
	txt += '<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th> \n';
	txt += '<th>Weight</th> \n';
	if (cap.eggGroup2 == '') {
	txt += '<th>Egg Group</th> \n';
	} else {
	txt += '<th>Egg Group 1</th> \n';
	txt += '<th>Egg Group 2</th> \n';
	}
	txt += '</tr> \n';
	txt += '<tr> \n';
	txt += '<td> </td> \n';
	txt += '<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td> \n';
	txt += '<td>' + cap.weightKilos + ' kg </td> \n';
	txt += '<td>' + cap.eggGroup1 + '</td> \n';
	if (cap.eggGroup2 !== '') {
	txt += '<td>' + cap.eggGroup2 + '</td> \n';
	}
	txt += '</tr> \n';
	txt += '</table> \n';

	return txt;
};
function CAPSet() {
	this.name = "";
	this.item = "";
	this.ability = "";
	this.nature = "";
	this.move = [null];
	this.evs =
		{"HP": 0,
		"Atk": 0,
		"Def": 0,
		"SpA": 0,
		"SpD": 0,
		"Spe": 0
		};
	this.ivs =
		{"HP": 31,
		"Atk": 31,
		"Def": 31,
		"SpA": 31,
		"SpD": 31,
		"Spe": 31
		};
}
CAPSet.prototype.hasIVs = function() {
	var v;
	for (v in this.ivs) {
		if (this.ivs[v] !== 32) {
			return true;
		}
	}
	return false;

};
function strategyTabs(aName) {
	var lowerName = aName.toLowerCase();
	var txt = "";
	txt += '<ul class="tabs"> \n';
	txt += '<li><strong>#</strong></li> \n';
	txt += '<li class="tabspacer"><a href="../' + lowerName + '.html">Dex</a></li> \n';
	txt += '<li><a href="../moves/' + lowerName + '.html">Moves</a></li> \n';
	txt += '<li><strong>Strategy</strong></li> \n';
	txt += '</ul> \n';
	return txt;
};
function makeArray(aStringOrArray) {
	if (typeof(aStringOrArray)=='string') {
		var ary = [];
		ary[0] = aStringOrArray;
		return ary;
	}
	return aStringOrArray;
};
function slashAndLink(linkPrefix, aValue) {
	var txt = "";
	var valArray = makeArray(aValue);
	for (var i=0; i < valArray.length; i++) {
		if (i > 0) {
			txt += " / ";
		}
		txt += '<a href="#">';
		txt += valArray[i];
		txt += '</a>';
	}
	return txt;
};
function composeSet(set) {
	var txt = "";
	txt += '<table class="info strategyheader"> \n';
	txt += '<tr> \n';
	txt += '<th>Name</th> \n';
	txt += '<th>Item</th> \n';
	txt += '<th>Ability</th> \n';
	txt += '<th>Nature</th> \n';
	txt += '</tr> \n';
	txt += '<tr> \n';
	txt += '<td class="name"><h2>' + set.name + '</h2></td> \n';
	txt += '<td> \n';
	txt += slashAndLink('/items/', set.item) + ' \n';
	txt += '</td> \n';
	txt += '<td> \n';
	txt += slashAndLink('/abilities/', set.ability) + ' \n';
	txt += '</td> \n';
	txt += '<td> \n';
	txt += slashAndLink('/natures/', set.nature) + ' \n';
	txt += '</td> \n';
	txt += '</tr> \n';
	txt += '</table> \n';

	txt += '<table class="info moveset"> \n';
	txt += '<tr> \n';
	txt += '<th>Moveset</th> \n';
	txt += '<th>EVs</th> \n';
	txt += '</tr> \n';
	txt += '<tr> \n';

	if (set.hasIVs()) {
		txt += '<td rowspan="3"> \n';
	} else {
		txt += '<td> \n';
	}
	for (var m=0;m<set.move.length;m++) {
		if (set.move[m] !== null) {
			txt += '~ ' + slashAndLink('/moves/', set.move[m]);
			txt += '<br /> \n';
		}
	}
	txt += '</td> \n';

	txt += '<td> \n';
	var useSlash = false;
	var v;
	for (v in set.evs) {
		if (set.evs[v] !== 0) {
			if (useSlash) { txt += ' / '; }
			txt += set.evs[v];
			txt += ' ' + v;
			useSlash = true;
		}
	}
	txt += '</td> \n';

	txt += '</tr> \n';

	if (set.hasIVs()) {
		txt += '<tr><th>IVs</th></tr> \n';
		txt += '<tr><td> \n';
		var useSlash = false;
		var v;
		for (v in set.ivs) {
			if (set.ivs[v] !==32) {
				if (useSlash) { txt += ' / '; }
				txt += set.ivs[v];
				txt += ' ' + v;
				useSlash = true;
			}
		}
		txt += '</td> \n';
		txt += '</tr> \n';
	}

	txt += '</table> \n';

	return txt;
};
function customMovesTable(cap) {
	var txt = "";
	if (cap.movesCustom.length == 0) return txt;

	if (cap.movesCustom.length > 1) {
	txt += '<h3>Signature Moves</h3> \n';
	} else {
	txt += '<h3>Signature Move</h3> \n';
	}
	txt += '<table class="sortable">';
	txt += '<thead> \n';
	txt += '<tr> \n';
	txt += '<th>Name</th> \n';
	txt += '<th>Type</th> \n';
	txt += '<th>Category</th> \n';
	txt += '<th>Power</th> \n';
	txt += '<th>Accuracy</th> \n';
	txt += '<th>PP</th> \n';
	txt += '<th>Description</th> \n';
	txt += '</tr> \n';
	txt += '</thead> \n';
	txt += '<tbody> \n';
	for (var i=0;i<cap.movesCustom.length;i++) {
	var move = cap.movesCustom[i];
	txt += '<tr> \n';
	txt += '<td><strong>'+move.moveName+'</strong></td> \n';
	txt += '<td>'+move.type+'</td> \n';
	txt += '<td>'+move.category+'</td> \n';
	txt += '<td>'+move.power+'</td> \n';
	txt += '<td>'+move.accuracy+'%</td> \n';
	txt += '<td>'+move.pp+'</td> \n';
	txt += '<td>'+move.shortDesc+'</td> \n';
	txt += '</tr> \n';
	}
	txt += '</tbody> \n';
	txt += '</table> \n';
	return txt;
};
function moveRow(i, moveName, odd_even, tableType) {
	var txt = '<tr class="' + odd_even + '">';
	switch (tableType) {
	case 'LEVEL':
		txt += '<td>' +  i + '</td><td>' + moveTipLink(moveName) + '</td>';
		break;
	case 'TM':
		var tmNum = (i < 10) ? ('0'+i) : i;
		txt += '<td> TM' +  tmNum + '</td><td>' + moveTipLink(moveName) + '</td>';
		break;
	case 'HM':
		var hmNum = (i < 10) ? ('0'+i) : i;
		txt += '<td> HM' +  hmNum + '</td><td>' + moveTipLink(moveName) + '</td>';
		break;
	default:
		txt += '<td>' + moveTipLink(moveName) + '</td>';
	}
	txt += '</tr> \n';
	return txt;
};
function moveTipLink(moveName) {
	if (typeof MOVE_DATA === "undefined") return moveName;
	if (MOVE_DATA[moveName] === undefined) return moveName;
	return '<a href="#" class="moveTip" data-move="' + moveName + '">' + moveName + '</a>';
};
function moveTipAnchor(node) {
	while (node != null) {
		if (node.nodeType === 1 && node.className === "moveTip") return node;
		node = node.parentNode;
	}
	return null;
};
function moveTipBox() {
	var box = document.getElementById("moveTipBox");
	if (box == null) {
		box = document.createElement("div");
		box.id = "moveTipBox";
		box.className = "moveTipBox";
		document.body.appendChild(box);
	}
	return box;
};
function moveTipContains(node) {
	while (node != null) {
		if (node.nodeType === 1 && node.id === "moveTipBox") return true;
		node = node.parentNode;
	}
	return false;
};
function moveTipText(info) {
	var text = info.description;
	if (info.priority > 0) {
		text += ' Always moves first, before any other Pokémon (+' + info.priority + ' priority).';
	} else if (info.priority < 0) {
		text += ' Always moves last, after every other Pokémon (' + info.priority + ' priority).';
	}
	return text;
};
function moveTipHtml(moveName, info) {
	var cat = MOVE_CATEGORY_COLORS[info.category];
	var txt = '<table class="moveTipTable"> \n';
	txt += '<tr> \n';
	txt += '<th>Name</th><th>Type</th><th>Category</th><th>PP</th><th>Power</th><th>Accuracy</th> \n';
	txt += '</tr> \n';
	txt += '<tr> \n';
	txt += '<td class="moveTipName">' + moveName + '</td> \n';
	txt += '<td style="background: ' + MOVE_TYPE_COLORS[info.type] + '; color: #FFFFFF;">' + info.type + '</td> \n';
	txt += '<td style="background: ' + cat.bg + '; color: ' + cat.text + ';">' + info.category + '</td> \n';
	txt += '<td>' + info.pp + '</td> \n';
	txt += '<td>' + info.power + '</td> \n';
	txt += '<td>' + info.accuracy + '</td> \n';
	txt += '</tr> \n';
	txt += '<tr><td colspan="6" class="moveTipDesc">' + moveTipText(info) + '</td></tr> \n';
	txt += '</table> \n';
	return txt;
};
function moveTipPlace(box, anchor) {
	var rect = anchor.getBoundingClientRect();
	var doc = document.documentElement;
	var scrollX = window.pageXOffset || doc.scrollLeft || 0;
	var scrollY = window.pageYOffset || doc.scrollTop || 0;
	var left = rect.left + scrollX;
	var top = rect.bottom + scrollY + 2;
	if (left + box.offsetWidth > scrollX + doc.clientWidth) {
		left = scrollX + doc.clientWidth - box.offsetWidth - 4;
	}
	if (left < scrollX) left = scrollX;
	if (top + box.offsetHeight > scrollY + doc.clientHeight) {
		top = rect.top + scrollY - box.offsetHeight - 2;
	}
	if (top < scrollY) top = scrollY + 4;
	box.style.left = left + 'px';
	box.style.top = top + 'px';
};
function showMoveTip(anchor) {
	var moveName = anchor.getAttribute("data-move");
	var info = MOVE_DATA[moveName];
	if (info === undefined) return;
	var box = moveTipBox();
	box.innerHTML = moveTipHtml(moveName, info);
	box.style.display = "block";
	moveTipPlace(box, anchor);
};
function hideMoveTip() {
	var box = document.getElementById("moveTipBox");
	if (box != null) box.style.display = "none";
};
function moveTipOver(e) {
	var anchor = moveTipAnchor(e.target);
	if (anchor != null) {
		showMoveTip(anchor);
		return;
	}
	if (moveTipContains(e.target)) return;
	hideMoveTip();
};
function moveTipClick(e) {
	if (moveTipAnchor(e.target) != null) e.preventDefault();
};
function moveTipInit() {
	if (moveTipInit.done) return;
	moveTipInit.done = true;
	document.addEventListener("mouseover", moveTipOver, false);
	document.addEventListener("click", moveTipClick, false);
};
function movesTable(moves, headings, tableType) {
	var txt = '';
	var i;
	txt += '<td valign=top style="padding-right: 20px;"> \n';
	if (moves.length == 0) {
		txt += '- NONE - </td> \n';
		return txt;
	}
	txt += '<table class="sortable" style="margin-top: 0px;">';
	txt += '<thead><tr> \n';
	for (i=0;i<headings.length;i++) {
		txt += '<th>' + headings[i] + '</th> \n';
	}
	txt += '</tr></thead> \n';
	txt += '<tbody> \n';
	var odd_even = 'even';
	for (i=0;i<moves.length;i++) {
		if (moves[i] !== null) {
			if (typeof(moves[i])=='string') {
				txt += moveRow(i, moves[i], odd_even, tableType);
				odd_even = (odd_even == 'even') ? 'odd' : 'even';
			} else {
				for (var j=0;j<moves[i].length;j++) {
					txt += moveRow(i, moves[i][j], odd_even, tableType);
					odd_even = (odd_even == 'even') ? 'odd' : 'even';
				}
			}
		}
	}
	txt += '</tbody> \n';
	txt += '</table> \n';
	txt += '</td> \n';
	return txt;
};
function composeMovesPage(cap) {
	var lowerName = capSlug(cap);
	var txt = "";
	moveTipInit();
	txt += '<ul class="tabs"> \n';
	txt += '<li><strong>#</strong></li> \n';
	txt += '<li class="tabspacer"><a href="../' + lowerName + '.html">Dex</a></li> \n';
	txt += '<li><strong>Moves</strong></li> \n';
	txt += '<li><a href="../strategies/' + lowerName + '.html">Strategy</a></li> \n';
	txt += '</ul> \n';

	txt += topHeaderInfo(cap);

	txt += customMovesTable(cap);

	txt += '<table> \n';
	txt += '<tr> \n';
	txt += '<td><h3>Level Up Moves</h3></td> \n';
	txt += '<td><h3>Tutor Moves</h3></td> \n';
	txt += '<td><h3>Egg Moves</h3></td> \n';
	txt += '</tr> \n';
	txt += '<tr> \n';
	txt += movesTable(cap.movesLevel, ['Level', 'Move'], 'LEVEL');
	txt += movesTable(cap.movesTutor, ['Move'], 'TUTOR');
	txt += movesTable(cap.movesEgg, ['Move'], 'EGG');
	txt += '</tr> \n';
	txt += '<tr> \n';
	txt += '<td><h3>TM Moves</h3></td> \n';
	txt += '<td><h3>HM Moves</h3></td> \n';
	txt += '<td><h3>Event Moves</h3></td> \n';
	txt += '</tr> \n';
	txt += '<tr> \n';
	txt += movesTable(cap.movesTM, ['TM', 'Move'], 'TM');
	txt += movesTable(cap.movesHM, ['HM', 'Move'], 'HM');
	txt += movesTable(cap.movesEvent, ['Move'], 'EVENT');
	txt += '</tr> \n';
	txt += '</table> \n';

	return txt;
};
function composeCAPIndex(caps) {
	var txt = "";
	var currentGen = null;
	txt += '<table class="capindex" border="1" cellspacing="0" style="width: 100%; text-align: center;"> \n';
	for (var i=1;i<caps.length;i++) {
		var lowerName = capSlug(caps[i]);
		var capGen = caps[i].generation;
		if (currentGen != capGen) {
			txt += '<tr> \n';
			txt += '<td colspan="10"> \n';
			if (capGen == 'DP') {
				txt += '<h2>Generation 4 - Diamond/Pearl</h2>';
			} else if (capGen == 'BW') {
				txt += '<h2>Generation 5 - Black/White</h2>';
			} else if (capGen == 'XY') {
				txt += '<h2>Generation 6 - X/Y</h2>';
			}
			txt += '</td> \n';
			txt += '</tr> \n';
			currentGen = capGen;
		}
		txt += '<tr> \n';
		txt += '<td rowspan="3" align="center" class="spriteCell"> \n';
		txt += '<div class="spritePair"> \n';
		txt += spriteImg(caps[i], "front_normal.png", "front", caps[i].pokemonName) + ' \n';
		txt += spriteImg(caps[i], "front_shiny.png", "front shiny", "Shiny " + caps[i].pokemonName) + ' \n';
		txt += '</div> \n';
		txt += '</td> \n';
		txt += '<td rowspan="2" class="dexNo"><strong>#' + dexNumber(i, 3) + '</strong></td> \n';
		txt += '<td rowspan="2"><a href="../pokedex/' + lowerName + '.html"><strong>' + displayName(caps[i].pokemonName) + '</strong></a></td> \n';
		txt += '<td rowspan="2" class="typeCell"> \n';
		txt += getTypePair(caps[i]);
		txt += '</td> \n';
		txt += '<th style="text-align: center">HP</td> \n';
		txt += '<th style="text-align: center">Atk</td> \n';
		txt += '<th style="text-align: center">Def</td> \n';
		txt += '<th style="text-align: center">SpA</td> \n';
		txt += '<th style="text-align: center">SpD</td> \n';
		txt += '<th style="text-align: center">Spe</td> \n';
		txt += '</tr> \n';

		txt += '<tr> \n';
		txt += '<td>' + caps[i].baseHP + '</td> \n';
		txt += '<td>' + caps[i].baseAttack + '</td> \n';
		txt += '<td>' + caps[i].baseDefense + '</td> \n';
		txt += '<td>' + caps[i].baseSpAttack + '</td> \n';
		txt += '<td>' + caps[i].baseSpDefense + '</td> \n';
		txt += '<td>' + caps[i].baseSpeed + '</td> \n';
		txt += '</tr> \n';

txt += '<tr>' +
			'<td class="desc evoCell" colspan="3">' + indexDescFor(caps[i]) + '</td>' +
			'<td class="desc abCell" colspan="6">' + abilityLinks(caps[i]) + '</td></tr> \n';
		if (i < (caps.length - 1)) {
			txt += '<tr><td colspan="10"></td></tr> \n';
		}
	}
	txt += '</table> \n';
	txt += '<script>fitEvoChains();</script> \n';
	return txt;
};
function fitEvoChains() {
	if (typeof document === 'undefined' || !document.createRange) return;
	var all = document.getElementsByTagName('span'), list = [];
	for (var i = 0; i < all.length; i++) {
		if (all[i].className && all[i].className.indexOf('evoChain') === 0) list.push(all[i]);
	}
	var steps = [0.85, 0.83, 0.81, 0.79, 0.77, 0.75, 0.73, 0.71, 0.69, 0.67, 0.65];
	for (var j = 0; j < list.length; j++) {
		var el = list[j];
		var cell = el.parentNode;
		if (!cell || cell.nodeName !== 'TD') continue;
		var view = document.defaultView || window;
		var base = parseFloat(view.getComputedStyle(cell).fontSize) || 13;
		el.style.fontSize = '';
		for (var s = 0; s < steps.length; s++) {
			el.style.fontSize = (base * steps[s]).toFixed(2) + 'px';
			var r = document.createRange();
			r.selectNodeContents(el);
			var t = r.getBoundingClientRect();
			var c = cell.getBoundingClientRect();
			if (t.width < 1 || c.width < 1) continue;
			if (t.left >= c.left - 0.5) break;
		}
	}
}
function composeCAPIndex2(caps) {
	var txt = "";
	var currentGen = null;
	txt += '<table class="capindex" border="1" cellspacing="0" style="width: 100%; text-align: center;"> \n';
	for (var i=1;i<caps.length;i++) {
		var lowerName = capSlug(caps[i]);
		txt += '<tr> \n';
		txt += '<td rowspan="3" align="center"> \n';
		txt += '<a href="/2/Sprites/' + lowerName + '.png"> \n';
		txt += '<img src="../2/Sprites/' + lowerName + '.png"/> \n';
		txt += '</a> \n';
		txt += '</td> \n';
		txt += '<td rowspan="2"><a href="../2/pokedex/' + lowerName + '"><strong>' + caps[i].pokemonName + '</strong></a></td> \n';
		txt += '<td rowspan="2" class="typeCell"> \n';
		txt += getTypePair(caps[i]);
		txt += '</td> \n';
		txt += '<th style="text-align: center">HP</td> \n';
		txt += '<th style="text-align: center">Atk</td> \n';
		txt += '<th style="text-align: center">Def</td> \n';
		txt += '<th style="text-align: center">SpA</td> \n';
		txt += '<th style="text-align: center">SpD</td> \n';
		txt += '<th style="text-align: center">Spe</td> \n';
		txt += '</tr> \n';

		txt += '<tr> \n';
		txt += '<td>' + caps[i].baseHP + '</td> \n';
		txt += '<td>' + caps[i].baseAttack + '</td> \n';
		txt += '<td>' + caps[i].baseDefense + '</td> \n';
		txt += '<td>' + caps[i].baseSpAttack + '</td> \n';
		txt += '<td>' + caps[i].baseSpDefense + '</td> \n';
		txt += '<td>' + caps[i].baseSpeed + '</td> \n';
		txt += '</tr> \n';

		txt += '<tr><td class="desc" colspan="8">' + indexDescFor(caps[i]) + '</td></tr> \n';
		if (i < (caps.length - 1)) {
			txt += '<tr><td colspan="9"></td></tr> \n';
		}
	}
	txt += '</table> \n';
	return txt;
};
function getTypeIcons(artObject) {
	var txt = "";
	txt += '<img src="media/types/%27 + artObject.type1().toLowerCase() + %27_big.png"/> \n';
	if (artObject.type2() !== '') {
		txt += '<img src="media/types/%27 + artObject.type2().toLowerCase() + %27_big.png" /> \n';
	}
	return txt;
};
function get3RandomNums(magnitude) {
	var r0, r1, r2 = null;
	r0 = (magnitude < 1) ? 0 : (Math.floor(Math.random()*magnitude));
	if (magnitude > 1) {
		while ((r1==null)||(r1==r0)) {
			r1 = Math.floor(Math.random()*magnitude);
		}
		if (magnitude > 2) {
			while ((r2==null)||(r2==r0)||(r2==r1)) {
				r2 = Math.floor(Math.random()*magnitude);
			}
		} else { return [r0, r1, 0]; }
	} else { return [r0, 0, 0]; }
	return [r0, r1, r2];
}
function composeThumb(section, gallery, tSeq, tNum) {
	var txt = "";
	var idString = "thumb" + tSeq;
	var thumbLeft = 10;
	var thumbTop = 10;
	if (tSeq == 2) {
		thumbLeft += 40;
		thumbTop += 10;
	}
	if (tSeq == 3) {
		thumbLeft += 15;
		thumbTop += 35;
	}
	txt += '<div id="' + idString + '" class="capart_thumb" style="';
	txt += 'background-image: url(http://cap.smogon.com/web/art/gallery/' + section + '/'+ gallery + '/thumbnails.png); ';
	var offset = Math.floor(tNum * -50);
	txt += 'background-position: ' + offset + 'px 0px; ';
	txt += 'top: ' + thumbTop + 'px; ';
	txt += 'left: ' + thumbLeft + 'px; ';
	txt += '"></div> \n';
	return txt;
};
function composeThumbGroup(sectionDir, galleryDir, gallerySize) {
	var txt = "";
	var rands = get3RandomNums(gallerySize);
	txt += '<div class="capart_thumbGroup">';
	txt += composeThumb(sectionDir, galleryDir, 1, rands[0]);
	txt += composeThumb(sectionDir, galleryDir, 2, rands[1]);
	txt += composeThumb(sectionDir, galleryDir, 3, rands[2]);
	txt += '</div> \n';
	return txt;
};
function composeMini(section, gallery, tNum) {
	var txt = "";
	txt += '<div class="capart_mini" style="';
	txt += 'background-image: url(http://cap.smogon.com/web/art/gallery/' + section + '/'+ gallery + '/minis.jpg); ';
	var offset = Math.floor(tNum * -150);
	txt += 'background-position: ' + offset + 'px 0px; ';
	txt += '"></div> \n';
	return txt;
};
function composeSprite(section, gallery, fileName, tNum, colNum, rowNum, spriteSize) {
	var txt = "";
	var idString = "sprite" + tNum;
	var spriteTop = rowNum * (spriteSize + 3);
	var spriteLeft = colNum * (spriteSize + 3);
	txt += '<div id="' + idString + '" class="capart_sprite_' + spriteSize + '" style="';
	txt += 'background-image: url(http://cap.smogon.com/web/art/gallery/' + section + '/'+ gallery + '/sprites/' + fileName + '); ';
	var offset = Math.floor((tNum - 1) * (0 - spriteSize));
	txt += 'background-position: ' + offset + 'px 0px; ';
	txt += 'top: ' + spriteTop + 'px; ';
	txt += 'left: ' + spriteLeft + 'px; ';
	txt += '"></div> \n';
	return txt;
};
function composeSpriteGroup(sectionDir, galleryDir, fileName, spriteSize) {
	var txt = "";
	txt += '<div class="capart_spriteGroup_' + spriteSize + '">';
	txt += composeSprite(sectionDir, galleryDir, fileName, 1, 0, 0, spriteSize);
	txt += composeSprite(sectionDir, galleryDir, fileName, 2, 0, 1, spriteSize);
	txt += composeSprite(sectionDir, galleryDir, fileName, 3, 1, 0, spriteSize);
	txt += composeSprite(sectionDir, galleryDir, fileName, 4, 1, 1, spriteSize);
	txt += '</div> \n';
	return txt;
};

function composeGallerySection(aSection) {
	var sectionName = aSection.name;
	var sectionDir = aSection.directory;
	var galleries = aSection.galleries;

	var txt = "";
	txt += '<div class="capart_section"> \n';
	txt += '<h2 class="capart_sectionHeader">' + sectionName + '</h2> \n';

	for (var i=0;i<galleries.length;i++) {
	var gallery = galleries[i];
	txt += '<div class="capart_linkBox"> \n';
	txt += '<a href="' + sectionDir + '/' + gallery.directory + '"> \n';
	txt += composeThumbGroup(sectionDir, gallery.directory, gallery.totalArtworks());
	txt += '</a> \n';

	txt += '<div class="capart_linkBoxInfo capart_thumbGroupInfo"> \n';
	if (gallery.type1() !== '') {
		txt += getTypeIcons(gallery);
		txt += '<br> \n';
	}
	txt += '<strong><a href="' + sectionDir + '/' + gallery.directory + '"> \n';
	txt += gallery.name;
	txt += '</a></strong> \n';
	txt += '</div> \n';
	txt += '</div> \n';
	}
	txt += '<div class="capart_sectionFooter"></div> \n';
	txt += '</div> \n';
	return txt;
};
function placeString(pNum) {
	var pString = "";
	switch (pNum) {
		case 1:
			pString = "1st";
			break;
		case 2:
			pString = "2nd";
			break;
		case 3:
			pString = "3rd";
			break;
		default:
			pString = "" + pNum + "th";
	}
	return pString;
};
function composeGalleryPage(aSection, galleryName) {
	var sectionDir = aSection.directory;
	var gallery = aSection.getGallery(galleryName);
	var galleryType = gallery.type1();

	var txt = "";
	txt +='<div class="capart_pageTop"> \n';
	if (sectionDir == 'past') {
		txt += '<h1>Featured Art - ' + gallery.name + '</h1> \n';
	} else {
		txt += '<h1>Featured Artist - ' + gallery.name + '</h1> \n';
	}
	txt += '<p>Click a thumbnail below to see the full-size image.</p>';
	txt += '</div> \n';

	txt += '<div class="capart_navBar"> \n';
	txt += '<table class="capart_navTable" CELLSPACING=0> \n';
	txt += '<tr> \n';
	txt += '<td class="leftNav"> \n';
	if (gallery.previousGallery !== null) {
		txt += '<a href="' + gallery.previousGallery.directory + '"> \n';
		txt += '\u00AB ' + gallery.previousGallery.name;
		txt += '</a> \n';
	}
	txt += '</td> \n';
	txt += '<td class="middleNav"> \n';
	txt += gallery.name;
	if (galleryType !== '') {
		txt += '<br>';
		txt += getTypeIcons(gallery);
	}
	txt += '</td> \n';
	txt += '<td class="rightNav"> \n';
	if (gallery.nextGallery !== null) {
		txt += '<a href="' + gallery.nextGallery.directory + '"> \n';
		txt += gallery.nextGallery.name + ' \u00BB';
		txt += '</a> \n';
	}
	txt += '</td> \n';
	txt += '</tr> \n';
	txt += '</table> \n';
	txt += '</div> \n';

	for (var i=0;i<gallery.artworks.length;i++) {
	var art = gallery.artworks[i];
	txt += '<div class="capart_linkBox capart_miniLinkBox"> \n';

	txt += '<a href="http://cap.smogon.com/web/art/gallery/' + sectionDir + '/' + gallery.directory + '/' + art.fileName +'"> \n';
	txt += composeMini(sectionDir, gallery.directory, i);
	txt += '</a> \n';

	txt += '<div class="capart_linkBoxInfo capart_miniInfo"> \n';

	if (art.type1() !== galleryType) {
		txt += getTypeIcons(art);
		txt += '<br> \n';
	}

	if (art.projectNum !== gallery.projectNum) {
	txt += '<nobr>';
	txt += '<span class="capart_infoLabel">Project:</span> \n';
	txt += '<span class="capart_infoValue">CAP ' + art.projectNum + '</span> \n';
	txt += '</nobr>';
	txt += '<br> \n';
	}

	if (art.artist !== gallery.name) {
	txt += '<nobr>';
	txt += '<strong>' + art.artist + '</strong> \n';
	txt += '</nobr>';
	txt += '<br> \n';
	}

	if (art.placeNum !== 0) {
	txt += '<nobr>';
	txt += '<span class="capart_infoLabel">Place:</span> \n';
	txt += '<span class="capart_infoValue">' + placeString(art.placeNum) + '</span> \n';
	txt += '</nobr>';
	txt += '<br> \n';
	}

	txt += '</div> \n';
	txt += '</div> \n';
	}

	txt += '<div class="capart_spriteBar">Sprites</div> \n';

	for (var i=0;i<gallery.sprites.length;i++) {
	var sprite = gallery.sprites[i];
	txt += '<div class="capart_linkBox"> \n';

	var spriteSize = (sprite.projectNum >= 12) ? 96 : 80;
	txt += composeSpriteGroup(sectionDir, gallery.directory, sprite.fileName, spriteSize);

	txt += '<div class="capart_linkBoxInfo capart_spriteInfo_' + spriteSize + '"> \n';

	if (sprite.projectNum !== gallery.projectNum) {
	txt += '<nobr>';
	txt += '<span class="capart_infoLabel">Project:</span> \n';
	txt += '<span class="capart_infoValue">CAP ' + sprite.projectNum + '</span> \n';
	txt += '</nobr>';
	txt += '<br> \n';
	}

	if (sprite.artist !== gallery.name) {
	txt += '<nobr>';
	txt += '<strong>' + sprite.artist + '</strong> \n';
	txt += '</nobr>';
	txt += '<br> \n';
	}

	if (sprite.placeNum !== 0) {
	txt += '<nobr>';
	txt += '<span class="capart_infoLabel">Place:</span> \n';
	txt += '<span class="capart_infoValue">' + placeString(sprite.placeNum) + '</span> \n';
	txt += '</nobr>';
	txt += '<br> \n';
	}

	txt += '</div> \n';
	txt += '</div> \n';
	}

	txt += '<div class="capart_sectionFooter"></div> \n';
	txt += '<br>'
	txt += '</div> \n';
	return txt;
};
function composeCustomMovePage() {
	var txt = "";
	var urlParts=location.href.split("?");
	if (!urlParts[1]) {
		return txt;
	};
	var move = null;
	if (urlParts[1] == "paleo_wave") {
		move = PaleoWave();
	} else if (urlParts[1] == "shadowstrike") {
		move = ShadowStrike();
	}
	if (move == null) return txt;

	txt += '<ul class="tabs"><li><strong>CAP</strong></li></ul>';
	txt += '<h1>' + move.moveName + '</h1>';

	txt += '<table class="info"> \n';
	txt += '<tr> \n';
	txt += '<th>Type</th> \n';
	txt += '<th>Power</th> \n';
	txt += '<th>Accuracy</th> \n';
	txt += '<th>PP</th> \n';
	txt += '<th>Priority</th> \n';
	txt += '<th>Damage</th> \n';
	txt += '<th>Target</th> \n';
	txt += '</tr> \n';
	txt += '<tr> \n';
	txt += '<td><a href="/types/' + move.type.toLowerCase() + '">' + move.type + '</a></td> \n';
	txt += '<td>' + move.power + '</td> \n';
	txt += '<td>' + move.accuracy + '</td> \n';
	txt += '<td>' + move.pp + '</td> \n';
	txt += '<td>' + move.priority + '</td> \n';
	txt += '<td>' + move.category + '</td> \n';
	txt += '<td>' + move.target + '</td> \n';
	txt += '</tr> \n';
	txt += '</table> \n';

	if (move.longDesc == "") {
		txt += '<p>' + move.shortDesc + '</p>';
	} else if (move.longDesc[0] == '<') {
		txt += move.longDesc;
	} else {
		txt += '<p>' + move.longDesc + '</p>';
	}

	return txt;
};
function composeCustomAbilityPage() {
	var txt = "";
	var urlParts=location.href.split("?");
	if (!urlParts[1]) {
		return txt;
	};
	var ability = null;
	if (urlParts[1] == "mountaineer") {
		ability = Mountaineer();
	} else if (urlParts[1] == "persistent") {
		ability = Persistent();
	} else if (urlParts[1] == "rebound") {
		ability = Rebound();
	}
	if (ability == null) return txt;

	txt += '<ul class="tabs"><li><strong>CAP</strong></li></ul>';
	txt += '<h1>' + ability.abilityName + '</h1>';

	if (ability.longDesc == "") {
		txt += '<p>' + ability.shortDesc + '</p>';
	} else if (ability.longDesc[0] == '<') {
		txt += ability.longDesc;
	} else {
		txt += '<p>' + ability.longDesc + '</p>';
	}

	return txt;
};
