var MOVE_TYPE_COLORS = {
	"???": "#68a090",
	"Bug": "#a8b820",
	"Dark": "#705848",
	"Dragon": "#7038f8",
	"Electric": "#f8d030",
	"Fighting": "#c03028",
	"Fire": "#f08030",
	"Flying": "#a890f0",
	"Ghost": "#705898",
	"Grass": "#78c850",
	"Ground": "#e0c068",
	"Ice": "#98d8d8",
	"Normal": "#a8a878",
	"Poison": "#a040a0",
	"Psychic": "#f85888",
	"Rock": "#b8a038",
	"Steel": "#b8b8d0",
	"Water": "#6890f0"
};

var MOVE_CATEGORY_COLORS = {
	"Physical": {bg: "#c92112", text: "#f67a1a"},
	"Special": {bg: "#4f5870", text: "#ffffff"},
	"Status": {bg: "#8c888c", text: "#ffffff"}
};

var MOVE_DATA = {
	"Pound": {
		type: "Normal",
		category: "Physical",
		pp: 35,
		power: "40",
		accuracy: "100%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Karate Chop": {
		type: "Fighting",
		category: "Physical",
		pp: 25,
		power: "50",
		accuracy: "100%",
		priority: 0,
		description: "High critical hit ratio (12.5%)."
	},
	"Double Slap": {
		type: "Normal",
		category: "Physical",
		pp: 10,
		power: "15",
		accuracy: "85%",
		priority: 0,
		description: "Hits 2-5 times in one turn."
	},
	"Comet Punch": {
		type: "Normal",
		category: "Physical",
		pp: 15,
		power: "18",
		accuracy: "85%",
		priority: 0,
		description: "Hits 2-5 times in one turn."
	},
	"Mega Punch": {
		type: "Normal",
		category: "Physical",
		pp: 20,
		power: "80",
		accuracy: "85%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Pay Day": {
		type: "Normal",
		category: "Physical",
		pp: 20,
		power: "40",
		accuracy: "100%",
		priority: 0,
		description: "A small amount of money is gained after the battle resolves."
	},
	"Fire Punch": {
		type: "Fire",
		category: "Physical",
		pp: 15,
		power: "75",
		accuracy: "100%",
		priority: 0,
		description: "May burn opponent (10%)."
	},
	"Ice Punch": {
		type: "Ice",
		category: "Physical",
		pp: 15,
		power: "75",
		accuracy: "100%",
		priority: 0,
		description: "May freeze opponent (10%)."
	},
	"Thunder Punch": {
		type: "Electric",
		category: "Physical",
		pp: 15,
		power: "75",
		accuracy: "100%",
		priority: 0,
		description: "May paralyze opponent (10%)."
	},
	"Scratch": {
		type: "Normal",
		category: "Physical",
		pp: 35,
		power: "40",
		accuracy: "100%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Vice Grip": {
		type: "Normal",
		category: "Physical",
		pp: 30,
		power: "55",
		accuracy: "100%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Guillotine": {
		type: "Normal",
		category: "Physical",
		pp: 5,
		power: "—",
		accuracy: "30%",
		priority: 0,
		description: "One-Hit-KO, if it hits."
	},
	"Razor Wind": {
		type: "Normal",
		category: "Special",
		pp: 10,
		power: "80",
		accuracy: "100%",
		priority: 0,
		description: "High critical hit ratio (12.5%).*"
	},
	"Swords Dance": {
		type: "Normal",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Sharply raises user's Attack."
	},
	"Cut": {
		type: "Normal",
		category: "Physical",
		pp: 30,
		power: "50",
		accuracy: "95%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Gust": {
		type: "Flying",
		category: "Special",
		pp: 35,
		power: "40",
		accuracy: "100%",
		priority: 0,
		description: "Hits Pokémon using Fly/Bounce with double power."
	},
	"Wing Attack": {
		type: "Flying",
		category: "Physical",
		pp: 35,
		power: "60",
		accuracy: "100%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Whirlwind": {
		type: "Normal",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "—",
		priority: -6,
		description: "In battles, the opponent switches. In the wild, the Pokémon runs."
	},
	"Fly": {
		type: "Flying",
		category: "Physical",
		pp: 15,
		power: "90",
		accuracy: "95%",
		priority: 0,
		description: "Flies up on first turn, attacks on second turn."
	},
	"Bind": {
		type: "Normal",
		category: "Physical",
		pp: 20,
		power: "15",
		accuracy: "85%",
		priority: 0,
		description: "Traps opponent, damaging them for 4-5 turns."
	},
	"Slam": {
		type: "Normal",
		category: "Physical",
		pp: 20,
		power: "80",
		accuracy: "75%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Vine Whip": {
		type: "Grass",
		category: "Physical",
		pp: 10,
		power: "45",
		accuracy: "100%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Stomp": {
		type: "Normal",
		category: "Physical",
		pp: 20,
		power: "65",
		accuracy: "100%",
		priority: 0,
		description: "May cause flinching (30%)."
	},
	"Double Kick": {
		type: "Fighting",
		category: "Physical",
		pp: 30,
		power: "30",
		accuracy: "100%",
		priority: 0,
		description: "Hits twice in one turn."
	},
	"Mega Kick": {
		type: "Normal",
		category: "Physical",
		pp: 5,
		power: "120",
		accuracy: "75%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Jump Kick": {
		type: "Fighting",
		category: "Physical",
		pp: 10,
		power: "100",
		accuracy: "95%",
		priority: 0,
		description: "If it misses, the user loses half their HP."
	},
	"Rolling Kick": {
		type: "Fighting",
		category: "Physical",
		pp: 15,
		power: "60",
		accuracy: "85%",
		priority: 0,
		description: "May cause flinching (30%)."
	},
	"Sand Attack": {
		type: "Ground",
		category: "Status",
		pp: 15,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Lowers opponent's Accuracy."
	},
	"Headbutt": {
		type: "Normal",
		category: "Physical",
		pp: 15,
		power: "70",
		accuracy: "100%",
		priority: 0,
		description: "May cause flinching (30%)."
	},
	"Horn Attack": {
		type: "Normal",
		category: "Physical",
		pp: 25,
		power: "65",
		accuracy: "100%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Fury Attack": {
		type: "Normal",
		category: "Physical",
		pp: 20,
		power: "15",
		accuracy: "85%",
		priority: 0,
		description: "Hits 2-5 times in one turn."
	},
	"Horn Drill": {
		type: "Normal",
		category: "Physical",
		pp: 5,
		power: "—",
		accuracy: "30%",
		priority: 0,
		description: "One-Hit-KO, if it hits."
	},
	"Tackle": {
		type: "Normal",
		category: "Physical",
		pp: 35,
		power: "50",
		accuracy: "100%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Body Slam": {
		type: "Normal",
		category: "Physical",
		pp: 15,
		power: "85",
		accuracy: "100%",
		priority: 0,
		description: "May paralyze opponent (30%)."
	},
	"Wrap": {
		type: "Normal",
		category: "Physical",
		pp: 20,
		power: "15",
		accuracy: "90%",
		priority: 0,
		description: "Traps opponent, damaging them for 4-5 turns."
	},
	"Take Down": {
		type: "Normal",
		category: "Physical",
		pp: 20,
		power: "90",
		accuracy: "85%",
		priority: 0,
		description: "User receives recoil damage (1/4)."
	},
	"Thrash": {
		type: "Normal",
		category: "Physical",
		pp: 10,
		power: "120",
		accuracy: "100%",
		priority: 0,
		description: "User attacks for 2-3 turns but then becomes confused."
	},
	"Double-Edge": {
		type: "Normal",
		category: "Physical",
		pp: 15,
		power: "120",
		accuracy: "100%",
		priority: 0,
		description: "User receives recoil damage (1/3)."
	},
	"Tail Whip": {
		type: "Normal",
		category: "Status",
		pp: 30,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Lowers opponent's Defense."
	},
	"Poison Sting": {
		type: "Poison",
		category: "Physical",
		pp: 35,
		power: "15",
		accuracy: "100%",
		priority: 0,
		description: "May poison the opponent (30%)."
	},
	"Twineedle": {
		type: "Bug",
		category: "Physical",
		pp: 20,
		power: "25",
		accuracy: "100%",
		priority: 0,
		description: "Hits twice in one turn. May poison opponent (40%*)."
	},
	"Pin Missile": {
		type: "Bug",
		category: "Physical",
		pp: 20,
		power: "25",
		accuracy: "95%",
		priority: 0,
		description: "Hits 2-5 times in one turn."
	},
	"Leer": {
		type: "Normal",
		category: "Status",
		pp: 30,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Lowers opponent's Defense."
	},
	"Bite": {
		type: "Dark",
		category: "Physical",
		pp: 25,
		power: "60",
		accuracy: "100%",
		priority: 0,
		description: "May cause flinching (30%)."
	},
	"Growl": {
		type: "Normal",
		category: "Status",
		pp: 40,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Lowers opponent's Attack."
	},
	"Roar": {
		type: "Normal",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "—",
		priority: -6,
		description: "In battles, the opponent switches. In the wild, the Pokémon runs."
	},
	"Sing": {
		type: "Normal",
		category: "Status",
		pp: 15,
		power: "—",
		accuracy: "55%",
		priority: 0,
		description: "Puts opponent to sleep."
	},
	"Supersonic": {
		type: "Normal",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "55%",
		priority: 0,
		description: "Confuses opponent."
	},
	"Sonic Boom": {
		type: "Normal",
		category: "Special",
		pp: 20,
		power: "—",
		accuracy: "90%",
		priority: 0,
		description: "Always inflicts 20 HP."
	},
	"Disable": {
		type: "Normal",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Opponent can't use its last attack for a few turns."
	},
	"Acid": {
		type: "Poison",
		category: "Special",
		pp: 30,
		power: "40",
		accuracy: "100%",
		priority: 0,
		description: "May lower opponent's Special Defense (30%*).*"
	},
	"Ember": {
		type: "Fire",
		category: "Special",
		pp: 25,
		power: "40",
		accuracy: "100%",
		priority: 0,
		description: "May burn opponent (10%)."
	},
	"Flamethrower": {
		type: "Fire",
		category: "Special",
		pp: 15,
		power: "95",
		accuracy: "100%",
		priority: 0,
		description: "May burn opponent (10%)."
	},
	"Mist": {
		type: "Ice",
		category: "Status",
		pp: 30,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "User's stats cannot be changed for a period of time."
	},
	"Water Gun": {
		type: "Water",
		category: "Special",
		pp: 25,
		power: "40",
		accuracy: "100%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Hydro Pump": {
		type: "Water",
		category: "Special",
		pp: 5,
		power: "120",
		accuracy: "80%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Surf": {
		type: "Water",
		category: "Special",
		pp: 15,
		power: "95",
		accuracy: "100%",
		priority: 0,
		description: "Hits all adjacent Pokémon."
	},
	"Ice Beam": {
		type: "Ice",
		category: "Special",
		pp: 10,
		power: "95",
		accuracy: "100%",
		priority: 0,
		description: "May freeze opponent (10%)."
	},
	"Blizzard": {
		type: "Ice",
		category: "Special",
		pp: 5,
		power: "120",
		accuracy: "90%",
		priority: 0,
		description: "May freeze opponent (30%*)."
	},
	"Psybeam": {
		type: "Psychic",
		category: "Special",
		pp: 20,
		power: "65",
		accuracy: "100%",
		priority: 0,
		description: "May confuse opponent (10%)."
	},
	"Bubble Beam": {
		type: "Water",
		category: "Special",
		pp: 20,
		power: "65",
		accuracy: "100%",
		priority: 0,
		description: "May lower opponent's Speed (30%*)."
	},
	"Aurora Beam": {
		type: "Ice",
		category: "Special",
		pp: 20,
		power: "65",
		accuracy: "100%",
		priority: 0,
		description: "May lower opponent's Attack (30%*)."
	},
	"Hyper Beam": {
		type: "Normal",
		category: "Special",
		pp: 5,
		power: "150",
		accuracy: "90%",
		priority: 0,
		description: "User must recharge next turn."
	},
	"Peck": {
		type: "Flying",
		category: "Physical",
		pp: 35,
		power: "35",
		accuracy: "100%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Drill Peck": {
		type: "Flying",
		category: "Physical",
		pp: 20,
		power: "80",
		accuracy: "100%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Submission": {
		type: "Fighting",
		category: "Physical",
		pp: 20,
		power: "80",
		accuracy: "80%",
		priority: 0,
		description: "User receives recoil damage (1/4)."
	},
	"Low Kick": {
		type: "Fighting",
		category: "Physical",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "The heavier the opponent, the stronger the attack."
	},
	"Counter": {
		type: "Fighting",
		category: "Physical",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: -5,
		description: "When hit by a Physical Attack, user strikes back with 2x power."
	},
	"Seismic Toss": {
		type: "Fighting",
		category: "Physical",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Inflicts damage equal to user's level."
	},
	"Strength": {
		type: "Normal",
		category: "Physical",
		pp: 15,
		power: "80",
		accuracy: "100%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Absorb": {
		type: "Grass",
		category: "Special",
		pp: 20,
		power: "20",
		accuracy: "100%",
		priority: 0,
		description: "User recovers half the HP inflicted on opponent."
	},
	"Mega Drain": {
		type: "Grass",
		category: "Special",
		pp: 10,
		power: "40",
		accuracy: "100%",
		priority: 0,
		description: "User recovers half the HP inflicted on opponent."
	},
	"Leech Seed": {
		type: "Grass",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "90%",
		priority: 0,
		description: "User steals HP from opponent each turn."
	},
	"Growth": {
		type: "Normal",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Raises user's Special Attack."
	},
	"Razor Leaf": {
		type: "Grass",
		category: "Physical",
		pp: 25,
		power: "55",
		accuracy: "95%",
		priority: 0,
		description: "High critical hit ratio (12.5%)."
	},
	"Solar Beam": {
		type: "Grass",
		category: "Special",
		pp: 10,
		power: "120",
		accuracy: "100%",
		priority: 0,
		description: "Charges on first turn, attacks on second."
	},
	"Poison Powder": {
		type: "Poison",
		category: "Status",
		pp: 35,
		power: "—",
		accuracy: "75%",
		priority: 0,
		description: "Poisons opponent."
	},
	"Stun Spore": {
		type: "Grass",
		category: "Status",
		pp: 30,
		power: "—",
		accuracy: "75%",
		priority: 0,
		description: "Paralyzes opponent."
	},
	"Sleep Powder": {
		type: "Grass",
		category: "Status",
		pp: 15,
		power: "—",
		accuracy: "75%",
		priority: 0,
		description: "Puts opponent to sleep."
	},
	"Petal Dance": {
		type: "Grass",
		category: "Special",
		pp: 10,
		power: "120",
		accuracy: "100%",
		priority: 0,
		description: "User attacks for 2-3 turns but then becomes confused."
	},
	"String Shot": {
		type: "Bug",
		category: "Status",
		pp: 40,
		power: "—",
		accuracy: "95%",
		priority: 0,
		description: "Sharply lowers opponent's Speed.*"
	},
	"Dragon Rage": {
		type: "Dragon",
		category: "Special",
		pp: 10,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Always inflicts 40 HP."
	},
	"Fire Spin": {
		type: "Fire",
		category: "Special",
		pp: 15,
		power: "35",
		accuracy: "85%",
		priority: 0,
		description: "Traps opponent, damaging them for 4-5 turns."
	},
	"Thunder Shock": {
		type: "Electric",
		category: "Special",
		pp: 30,
		power: "40",
		accuracy: "100%",
		priority: 0,
		description: "May paralyze opponent (10%)."
	},
	"Thunderbolt": {
		type: "Electric",
		category: "Special",
		pp: 15,
		power: "95",
		accuracy: "100%",
		priority: 0,
		description: "May paralyze opponent (10%)."
	},
	"Thunder Wave": {
		type: "Electric",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Paralyzes opponent."
	},
	"Thunder": {
		type: "Electric",
		category: "Special",
		pp: 10,
		power: "120",
		accuracy: "70%",
		priority: 0,
		description: "May paralyze opponent (30%)."
	},
	"Rock Throw": {
		type: "Rock",
		category: "Physical",
		pp: 15,
		power: "50",
		accuracy: "90%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Earthquake": {
		type: "Ground",
		category: "Physical",
		pp: 10,
		power: "100",
		accuracy: "100%",
		priority: 0,
		description: "Power is doubled if opponent is underground from using Dig."
	},
	"Fissure": {
		type: "Ground",
		category: "Physical",
		pp: 5,
		power: "—",
		accuracy: "30%",
		priority: 0,
		description: "One-Hit-KO, if it hits."
	},
	"Dig": {
		type: "Ground",
		category: "Physical",
		pp: 10,
		power: "80",
		accuracy: "100%",
		priority: 0,
		description: "Digs underground on first turn, attacks on second. Can also escape from caves."
	},
	"Toxic": {
		type: "Poison",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "90%",
		priority: 0,
		description: "Badly poisons opponent."
	},
	"Confusion": {
		type: "Psychic",
		category: "Special",
		pp: 25,
		power: "50",
		accuracy: "100%",
		priority: 0,
		description: "May confuse opponent (10%)."
	},
	"Psychic": {
		type: "Psychic",
		category: "Special",
		pp: 10,
		power: "90",
		accuracy: "100%",
		priority: 0,
		description: "May lower opponent's Special Defense (30%*)."
	},
	"Hypnosis": {
		type: "Psychic",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "70%",
		priority: 0,
		description: "Puts opponent to sleep."
	},
	"Meditate": {
		type: "Psychic",
		category: "Status",
		pp: 40,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Raises user's Attack."
	},
	"Agility": {
		type: "Psychic",
		category: "Status",
		pp: 30,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Sharply raises user's Speed."
	},
	"Quick Attack": {
		type: "Normal",
		category: "Physical",
		pp: 30,
		power: "40",
		accuracy: "100%",
		priority: 1,
		description: "User attacks first."
	},
	"Rage": {
		type: "Normal",
		category: "Physical",
		pp: 20,
		power: "20",
		accuracy: "100%",
		priority: 0,
		description: "Raises user's Attack when hit.*"
	},
	"Teleport": {
		type: "Psychic",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Allows user to flee wild battles; also warps player to last PokéCenter."
	},
	"Night Shade": {
		type: "Ghost",
		category: "Special",
		pp: 15,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Inflicts damage equal to user's level."
	},
	"Mimic": {
		type: "Normal",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Copies the opponent's last move."
	},
	"Screech": {
		type: "Normal",
		category: "Status",
		pp: 40,
		power: "—",
		accuracy: "85%",
		priority: 0,
		description: "Lowers opponent's Defense."
	},
	"Double Team": {
		type: "Normal",
		category: "Status",
		pp: 15,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Raises user's Evasiveness."
	},
	"Recover": {
		type: "Normal",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "User recovers half its max HP."
	},
	"Harden": {
		type: "Normal",
		category: "Status",
		pp: 30,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Raises user's Defense."
	},
	"Minimize": {
		type: "Normal",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Raises user's Evasiveness."
	},
	"Smokescreen": {
		type: "Normal",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Lowers opponent's Accuracy."
	},
	"Confuse Ray": {
		type: "Ghost",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Confuses opponent."
	},
	"Withdraw": {
		type: "Water",
		category: "Status",
		pp: 40,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Raises user's Defense."
	},
	"Defense Curl": {
		type: "Normal",
		category: "Status",
		pp: 40,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Raises user's Defense."
	},
	"Barrier": {
		type: "Psychic",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Sharply raises user's Defense."
	},
	"Light Screen": {
		type: "Psychic",
		category: "Status",
		pp: 30,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Halves damage from Special attacks for 5 turns."
	},
	"Haze": {
		type: "Ice",
		category: "Status",
		pp: 30,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Resets all stat changes."
	},
	"Reflect": {
		type: "Psychic",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Halves damage from Physical attacks for 5 turns."
	},
	"Focus Energy": {
		type: "Normal",
		category: "Status",
		pp: 30,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Increases critical hit ratio (12.5%)."
	},
	"Bide": {
		type: "Normal",
		category: "Physical",
		pp: 10,
		power: "—",
		accuracy: "—",
		priority: 1,
		description: "User takes damage for two turns then strikes back double."
	},
	"Metronome": {
		type: "Normal",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "User performs any move in the game at random."
	},
	"Mirror Move": {
		type: "Flying",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "User performs the opponent's last move."
	},
	"Self-Destruct": {
		type: "Normal",
		category: "Physical",
		pp: 5,
		power: "200",
		accuracy: "100%",
		priority: 0,
		description: "User faints."
	},
	"Egg Bomb": {
		type: "Normal",
		category: "Physical",
		pp: 10,
		power: "100",
		accuracy: "75%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Lick": {
		type: "Ghost",
		category: "Physical",
		pp: 30,
		power: "30",
		accuracy: "100%",
		priority: 0,
		description: "May paralyze opponent (30%)."
	},
	"Smog": {
		type: "Poison",
		category: "Special",
		pp: 20,
		power: "30",
		accuracy: "70%",
		priority: 0,
		description: "May poison the opponent (40%)."
	},
	"Sludge": {
		type: "Poison",
		category: "Special",
		pp: 20,
		power: "65",
		accuracy: "100%",
		priority: 0,
		description: "May poison the opponent (40%*)."
	},
	"Bone Club": {
		type: "Ground",
		category: "Physical",
		pp: 20,
		power: "65",
		accuracy: "85%",
		priority: 0,
		description: "May cause flinching (10%)."
	},
	"Fire Blast": {
		type: "Fire",
		category: "Special",
		pp: 5,
		power: "120",
		accuracy: "85%",
		priority: 0,
		description: "May burn opponent (30%*)."
	},
	"Waterfall": {
		type: "Water",
		category: "Physical",
		pp: 15,
		power: "80",
		accuracy: "100%",
		priority: 0,
		description: "May cause flinching (20%).*"
	},
	"Clamp": {
		type: "Water",
		category: "Physical",
		pp: 10,
		power: "35",
		accuracy: "85%",
		priority: 0,
		description: "Traps opponent, damaging them for 4-5 turns."
	},
	"Swift": {
		type: "Normal",
		category: "Special",
		pp: 20,
		power: "60",
		accuracy: "—",
		priority: 0,
		description: "Ignores Accuracy and Evasiveness."
	},
	"Skull Bash": {
		type: "Normal",
		category: "Physical",
		pp: 10,
		power: "130",
		accuracy: "100%",
		priority: 0,
		description: "Raises Defense on first turn, attacks on second."
	},
	"Spike Cannon": {
		type: "Normal",
		category: "Physical",
		pp: 15,
		power: "20",
		accuracy: "100%",
		priority: 0,
		description: "Hits 2-5 times in one turn."
	},
	"Constrict": {
		type: "Normal",
		category: "Physical",
		pp: 35,
		power: "10",
		accuracy: "100%",
		priority: 0,
		description: "May lower opponent's Speed (30%*)."
	},
	"Amnesia": {
		type: "Psychic",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Sharply raises user's Special Defense."
	},
	"Kinesis": {
		type: "Psychic",
		category: "Status",
		pp: 15,
		power: "—",
		accuracy: "80%",
		priority: 0,
		description: "Lowers opponent's Accuracy."
	},
	"Soft-Boiled": {
		type: "Normal",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "User recovers half its max HP."
	},
	"Hi Jump Kick": {
		type: "Fighting",
		category: "Physical",
		pp: 10,
		power: "130",
		accuracy: "90%",
		priority: 0,
		description: "If it misses, the user loses half their HP."
	},
	"Glare": {
		type: "Normal",
		category: "Status",
		pp: 30,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Paralyzes opponent."
	},
	"Dream Eater": {
		type: "Psychic",
		category: "Special",
		pp: 15,
		power: "100",
		accuracy: "100%",
		priority: 0,
		description: "User recovers half the HP inflicted on a sleeping opponent."
	},
	"Poison Gas": {
		type: "Poison",
		category: "Status",
		pp: 40,
		power: "—",
		accuracy: "90%",
		priority: 0,
		description: "Poisons opponent."
	},
	"Barrage": {
		type: "Normal",
		category: "Physical",
		pp: 20,
		power: "15",
		accuracy: "85%",
		priority: 0,
		description: "Hits 2-5 times in one turn."
	},
	"Leech Life": {
		type: "Bug",
		category: "Physical",
		pp: 10,
		power: "80",
		accuracy: "100%",
		priority: 0,
		description: "User recovers half the HP inflicted on opponent."
	},
	"Lovely Kiss": {
		type: "Normal",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "75%",
		priority: 0,
		description: "Puts opponent to sleep."
	},
	"Sky Attack": {
		type: "Flying",
		category: "Physical",
		pp: 5,
		power: "140",
		accuracy: "90%",
		priority: 0,
		description: "High critical hit ratio (12.5%).*"
	},
	"Transform": {
		type: "Normal",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "User takes on the form and attacks of the opponent."
	},
	"Bubble": {
		type: "Water",
		category: "Special",
		pp: 30,
		power: "40",
		accuracy: "100%",
		priority: 0,
		description: "May lower opponent's Speed (30%*)."
	},
	"Dizzy Punch": {
		type: "Normal",
		category: "Physical",
		pp: 10,
		power: "70",
		accuracy: "100%",
		priority: 0,
		description: "May confuse opponent (20%)."
	},
	"Spore": {
		type: "Grass",
		category: "Status",
		pp: 15,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Puts opponent to sleep."
	},
	"Flash": {
		type: "Normal",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Lowers opponent's Accuracy."
	},
	"Psywave": {
		type: "Psychic",
		category: "Special",
		pp: 15,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Inflicts damage 50-150% of user's level."
	},
	"Splash": {
		type: "Normal",
		category: "Status",
		pp: 40,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Doesn't do ANYTHING."
	},
	"Acid Armor": {
		type: "Poison",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Sharply raises user's Defense."
	},
	"Crabhammer": {
		type: "Water",
		category: "Physical",
		pp: 10,
		power: "100",
		accuracy: "90%",
		priority: 0,
		description: "High critical hit ratio (12.5%)."
	},
	"Explosion": {
		type: "Normal",
		category: "Physical",
		pp: 5,
		power: "250",
		accuracy: "100%",
		priority: 0,
		description: "User faints."
	},
	"Fury Swipes": {
		type: "Normal",
		category: "Physical",
		pp: 15,
		power: "18",
		accuracy: "80%",
		priority: 0,
		description: "Hits 2-5 times in one turn."
	},
	"Bonemerang": {
		type: "Ground",
		category: "Physical",
		pp: 10,
		power: "50",
		accuracy: "90%",
		priority: 0,
		description: "Hits twice in one turn."
	},
	"Rest": {
		type: "Psychic",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "User sleeps for 2 turns, but user is fully healed."
	},
	"Rock Slide": {
		type: "Rock",
		category: "Physical",
		pp: 10,
		power: "75",
		accuracy: "90%",
		priority: 0,
		description: "May cause flinching (30%)."
	},
	"Hyper Fang": {
		type: "Normal",
		category: "Physical",
		pp: 15,
		power: "80",
		accuracy: "90%",
		priority: 0,
		description: "May cause flinching (10%)."
	},
	"Sharpen": {
		type: "Normal",
		category: "Status",
		pp: 30,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Raises user's Attack."
	},
	"Conversion": {
		type: "Normal",
		category: "Status",
		pp: 30,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Changes user's type to that of its first move."
	},
	"Tri Attack": {
		type: "Normal",
		category: "Special",
		pp: 10,
		power: "80",
		accuracy: "100%",
		priority: 0,
		description: "May paralyze, burn or freeze opponent [30%*](10% each*)."
	},
	"Super Fang": {
		type: "Normal",
		category: "Physical",
		pp: 10,
		power: "—",
		accuracy: "90%",
		priority: 0,
		description: "Always takes off half of the opponent's HP."
	},
	"Slash": {
		type: "Normal",
		category: "Physical",
		pp: 20,
		power: "70",
		accuracy: "100%",
		priority: 0,
		description: "High critical hit ratio (12.5%)."
	},
	"Substitute": {
		type: "Normal",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Uses HP to creates a decoy that takes hits."
	},
	"Struggle": {
		type: "Normal",
		category: "Physical",
		pp: 1,
		power: "50",
		accuracy: "—",
		priority: 0,
		description: "Only usable when all PP are gone. Hurts the user."
	},
	"Sketch": {
		type: "Normal",
		category: "Status",
		pp: 1,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Permanently copies the opponent's last move."
	},
	"Triple Kick": {
		type: "Fighting",
		category: "Physical",
		pp: 10,
		power: "10",
		accuracy: "90%",
		priority: 0,
		description: "Hits thrice in one turn at increasing power."
	},
	"Thief": {
		type: "Dark",
		category: "Physical",
		pp: 10,
		power: "60",
		accuracy: "100%",
		priority: 0,
		description: "Also steals opponent's held item."
	},
	"Spider Web": {
		type: "Bug",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Opponent cannot escape/switch."
	},
	"Mind Reader": {
		type: "Normal",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "User's next attack is guaranteed to hit."
	},
	"Nightmare": {
		type: "Ghost",
		category: "Status",
		pp: 15,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "The sleeping opponent loses 25% of its max HP each turn."
	},
	"Flame Wheel": {
		type: "Fire",
		category: "Physical",
		pp: 25,
		power: "60",
		accuracy: "100%",
		priority: 0,
		description: "May burn opponent. (10%)"
	},
	"Snore": {
		type: "Normal",
		category: "Special",
		pp: 15,
		power: "50",
		accuracy: "100%",
		priority: 0,
		description: "Can only be used if asleep. May cause flinching (30%)."
	},
	"Curse": {
		type: "Ghost",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Ghosts lose 50% of max HP and curse the opponent; Non-Ghosts raise Attack, Defense and lower Speed."
	},
	"Flail": {
		type: "Normal",
		category: "Physical",
		pp: 15,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "The lower the user's HP, the higher the power."
	},
	"Conversion 2": {
		type: "Normal",
		category: "Status",
		pp: 30,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "User changes type to become resistant to opponent's last move."
	},
	"Aeroblast": {
		type: "Flying",
		category: "Special",
		pp: 5,
		power: "100",
		accuracy: "95%",
		priority: 0,
		description: "High critical hit ratio (12.5%)."
	},
	"Cotton Spore": {
		type: "Grass",
		category: "Status",
		pp: 40,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Sharply lowers opponent's Speed."
	},
	"Reversal": {
		type: "Fighting",
		category: "Physical",
		pp: 15,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "The lower the user's HP, the higher the power."
	},
	"Spite": {
		type: "Ghost",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "The opponent's last move loses 2-5 PP."
	},
	"Powder Snow": {
		type: "Ice",
		category: "Special",
		pp: 25,
		power: "40",
		accuracy: "100%",
		priority: 0,
		description: "May freeze opponent (10%)."
	},
	"Protect": {
		type: "Normal",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "—",
		priority: 4,
		description: "User is not affected by opponent's move."
	},
	"Mach Punch": {
		type: "Fighting",
		category: "Physical",
		pp: 30,
		power: "40",
		accuracy: "100%",
		priority: 1,
		description: "User attacks first."
	},
	"Scary Face": {
		type: "Normal",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Sharply lowers opponent's Speed."
	},
	"Faint Attack": {
		type: "Dark",
		category: "Physical",
		pp: 20,
		power: "60",
		accuracy: "—",
		priority: 0,
		description: "Ignores Accuracy and Evasiveness."
	},
	"Sweet Kiss": {
		type: "Normal",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "75%",
		priority: 0,
		description: "Confuses opponent."
	},
	"Belly Drum": {
		type: "Normal",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "User loses 50% of its max HP, but Attack raises to maximum."
	},
	"Sludge Bomb": {
		type: "Poison",
		category: "Special",
		pp: 10,
		power: "90",
		accuracy: "100%",
		priority: 0,
		description: "May poison the opponent (30%)."
	},
	"Mud-Slap": {
		type: "Ground",
		category: "Special",
		pp: 10,
		power: "20",
		accuracy: "100%",
		priority: 0,
		description: "Lowers opponent's Accuracy."
	},
	"Octazooka": {
		type: "Water",
		category: "Special",
		pp: 10,
		power: "65",
		accuracy: "85%",
		priority: 0,
		description: "May lower opponent's Accuracy (50%)."
	},
	"Spikes": {
		type: "Ground",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Hurts opponents when they switch into battle."
	},
	"Zap Cannon": {
		type: "Electric",
		category: "Special",
		pp: 5,
		power: "120",
		accuracy: "50%",
		priority: 0,
		description: "Paralyzes opponent."
	},
	"Foresight": {
		type: "Normal",
		category: "Status",
		pp: 40,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Resets opponent's Evasiveness, Normal and Fighting attacks can now hit Ghosts, and Ghost attacks hit Normal."
	},
	"Destiny Bond": {
		type: "Ghost",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "If the user faints, the opponent also faints."
	},
	"Perish Song": {
		type: "Normal",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Any Pokémon in play when this attack is used faints in 3 turns."
	},
	"Icy Wind": {
		type: "Ice",
		category: "Special",
		pp: 15,
		power: "55",
		accuracy: "95%",
		priority: 0,
		description: "Lowers opponent's Speed."
	},
	"Detect": {
		type: "Fighting",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "—",
		priority: 4,
		description: "Opponent's attack doesn't affect you, but may fail if used often."
	},
	"Bone Rush": {
		type: "Ground",
		category: "Physical",
		pp: 10,
		power: "25",
		accuracy: "90%",
		priority: 0,
		description: "Hits 2-5 times in one turn."
	},
	"Lock-On": {
		type: "Normal",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "The next move the user uses is guaranteed to hit."
	},
	"Outrage": {
		type: "Dragon",
		category: "Physical",
		pp: 10,
		power: "120",
		accuracy: "100%",
		priority: 0,
		description: "User attacks for 2-3 turns but then becomes confused."
	},
	"Sandstorm": {
		type: "Rock",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Creates a sandstorm for 5 turns."
	},
	"Giga Drain": {
		type: "Grass",
		category: "Special",
		pp: 5,
		power: "75",
		accuracy: "100%",
		priority: 0,
		description: "User recovers half the HP inflicted on opponent."
	},
	"Endure": {
		type: "Normal",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "—",
		priority: 4,
		description: "Always left with at least 1 HP, but may fail if used consecutively."
	},
	"Charm": {
		type: "Normal",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Sharply lowers opponent's Attack."
	},
	"Rollout": {
		type: "Rock",
		category: "Physical",
		pp: 20,
		power: "30",
		accuracy: "90%",
		priority: 0,
		description: "Doubles in power each turn for 5 turns."
	},
	"False Swipe": {
		type: "Normal",
		category: "Physical",
		pp: 40,
		power: "40",
		accuracy: "100%",
		priority: 0,
		description: "Always leaves opponent with at least 1 HP."
	},
	"Swagger": {
		type: "Normal",
		category: "Status",
		pp: 15,
		power: "—",
		accuracy: "90%",
		priority: 0,
		description: "Confuses opponent, but raises its Attack by two stages."
	},
	"Milk Drink": {
		type: "Normal",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "User recovers half its max HP."
	},
	"Spark": {
		type: "Electric",
		category: "Physical",
		pp: 20,
		power: "65",
		accuracy: "100%",
		priority: 0,
		description: "May paralyze opponent (30%)."
	},
	"Fury Cutter": {
		type: "Bug",
		category: "Physical",
		pp: 20,
		power: "40",
		accuracy: "95%",
		priority: 0,
		description: "Power increases each turn."
	},
	"Steel Wing": {
		type: "Steel",
		category: "Physical",
		pp: 25,
		power: "70",
		accuracy: "90%",
		priority: 0,
		description: "May raise user's Defense (10%)."
	},
	"Mean Look": {
		type: "Normal",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Opponent cannot flee or switch."
	},
	"Attract": {
		type: "Normal",
		category: "Status",
		pp: 15,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "If opponent is the opposite gender, it's less likely to attack."
	},
	"Sleep Talk": {
		type: "Normal",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "User performs one of its own moves while sleeping."
	},
	"Heal Bell": {
		type: "Normal",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Cures all status problems in your party."
	},
	"Return": {
		type: "Normal",
		category: "Physical",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Power increases with user's Happiness."
	},
	"Present": {
		type: "Normal",
		category: "Physical",
		pp: 15,
		power: "—",
		accuracy: "90%",
		priority: 0,
		description: "Either deals damage or heals."
	},
	"Frustration": {
		type: "Normal",
		category: "Physical",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Power decreases with higher Happiness."
	},
	"Safeguard": {
		type: "Normal",
		category: "Status",
		pp: 25,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "The user's party is protected from status conditions."
	},
	"Pain Split": {
		type: "Normal",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "The user's and opponent's HP becomes the average of both."
	},
	"Sacred Fire": {
		type: "Fire",
		category: "Physical",
		pp: 5,
		power: "100",
		accuracy: "95%",
		priority: 0,
		description: "May burn opponent (50%)."
	},
	"Magnitude": {
		type: "Ground",
		category: "Physical",
		pp: 30,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Hits with random power."
	},
	"Dynamic Punch": {
		type: "Fighting",
		category: "Physical",
		pp: 5,
		power: "100",
		accuracy: "50%",
		priority: 0,
		description: "Confuses opponent."
	},
	"Megahorn": {
		type: "Bug",
		category: "Physical",
		pp: 10,
		power: "120",
		accuracy: "85%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Dragon Breath": {
		type: "Dragon",
		category: "Special",
		pp: 20,
		power: "60",
		accuracy: "100%",
		priority: 0,
		description: "May paralyze opponent (30%)."
	},
	"Baton Pass": {
		type: "Normal",
		category: "Status",
		pp: 40,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "User switches out and gives stat changes to the incoming Pokémon."
	},
	"Encore": {
		type: "Normal",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Forces opponent to keep using its last move for 3 turns."
	},
	"Pursuit": {
		type: "Dark",
		category: "Physical",
		pp: 20,
		power: "40",
		accuracy: "100%",
		priority: 0,
		description: "Double power if the opponent is switching out."
	},
	"Rapid Spin": {
		type: "Normal",
		category: "Physical",
		pp: 40,
		power: "50",
		accuracy: "100%",
		priority: 0,
		description: "Removes effects of trap moves."
	},
	"Sweet Scent": {
		type: "Normal",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Lowers opponent's Evasiveness."
	},
	"Iron Tail": {
		type: "Steel",
		category: "Physical",
		pp: 15,
		power: "100",
		accuracy: "75%",
		priority: 0,
		description: "May lower opponent's Defense (30%)."
	},
	"Metal Claw": {
		type: "Steel",
		category: "Physical",
		pp: 35,
		power: "50",
		accuracy: "95%",
		priority: 0,
		description: "May raise user's Attack (10%)."
	},
	"Vital Throw": {
		type: "Fighting",
		category: "Physical",
		pp: 10,
		power: "70",
		accuracy: "100%",
		priority: -1,
		description: "User attacks last, but ignores Accuracy and Evasiveness."
	},
	"Morning Sun": {
		type: "Normal",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "User recovers HP. Amount varies with the weather."
	},
	"Synthesis": {
		type: "Grass",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "User recovers HP. Amount varies with the weather."
	},
	"Moonlight": {
		type: "Normal",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "User recovers HP. Amount varies with the weather."
	},
	"Hidden Power": {
		type: "???",
		category: "Special",
		pp: 15,
		power: "60-70",
		accuracy: "100%",
		priority: 0,
		description: "Type depends on user's IVs."
	},
	"Cross Chop": {
		type: "Fighting",
		category: "Physical",
		pp: 5,
		power: "100",
		accuracy: "80%",
		priority: 0,
		description: "High critical hit ratio (12.5%)."
	},
	"Twister": {
		type: "Dragon",
		category: "Special",
		pp: 20,
		power: "40",
		accuracy: "100%",
		priority: 0,
		description: "May cause flinching (20%). Hits Pokémon using Fly/Bounce with double power."
	},
	"Rain Dance": {
		type: "Water",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Makes it rain for 5 turns."
	},
	"Sunny Day": {
		type: "Fire",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Makes it sunny for 5 turns."
	},
	"Crunch": {
		type: "Dark",
		category: "Physical",
		pp: 15,
		power: "80",
		accuracy: "100%",
		priority: 0,
		description: "May lower opponent's Defense (20%).*"
	},
	"Mirror Coat": {
		type: "Psychic",
		category: "Special",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: -5,
		description: "When hit by a Special Attack, user strikes back with 2x power."
	},
	"Psych Up": {
		type: "Normal",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Copies the opponent's stat changes."
	},
	"Extreme Speed": {
		type: "Normal",
		category: "Physical",
		pp: 5,
		power: "80",
		accuracy: "100%",
		priority: 2,
		description: "User attacks first."
	},
	"Ancient Power": {
		type: "Rock",
		category: "Special",
		pp: 5,
		power: "60",
		accuracy: "100%",
		priority: 0,
		description: "May raise all user's stats at once (10%)."
	},
	"Shadow Ball": {
		type: "Ghost",
		category: "Special",
		pp: 15,
		power: "80",
		accuracy: "100%",
		priority: 0,
		description: "May lower opponent's Special Defense (20%)."
	},
	"Future Sight": {
		type: "Psychic",
		category: "Special",
		pp: 10,
		power: "120",
		accuracy: "100%",
		priority: 0,
		description: "Damage occurs 2 turns later."
	},
	"Rock Smash": {
		type: "Fighting",
		category: "Physical",
		pp: 15,
		power: "40",
		accuracy: "100%",
		priority: 0,
		description: "May lower opponent's Defense (50%)."
	},
	"Whirlpool": {
		type: "Water",
		category: "Special",
		pp: 15,
		power: "35",
		accuracy: "85%",
		priority: 0,
		description: "Traps opponent, damaging them for 4-5 turns."
	},
	"Beat Up": {
		type: "Dark",
		category: "Physical",
		pp: 10,
		power: "10",
		accuracy: "100%",
		priority: 0,
		description: "Each Pokémon in your party attacks."
	},
	"Fake Out": {
		type: "Normal",
		category: "Physical",
		pp: 10,
		power: "40",
		accuracy: "100%",
		priority: 3,
		description: "User attacks first, foe flinches. Only usable on first turn."
	},
	"Uproar": {
		type: "Normal",
		category: "Special",
		pp: 10,
		power: "90",
		accuracy: "100%",
		priority: 0,
		description: "User attacks for 3 turns and prevents sleep."
	},
	"Stockpile": {
		type: "Normal",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Stores energy for use with Spit Up and Swallow."
	},
	"Spit Up": {
		type: "Normal",
		category: "Special",
		pp: 10,
		power: "100",
		accuracy: "100%",
		priority: 0,
		description: "Power depends on how many times the user performed Stockpile."
	},
	"Swallow": {
		type: "Normal",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "The more times the user has performed Stockpile, the more HP is recovered."
	},
	"Heat Wave": {
		type: "Fire",
		category: "Special",
		pp: 10,
		power: "100",
		accuracy: "90%",
		priority: 0,
		description: "May burn opponent. (10%)"
	},
	"Hail": {
		type: "Ice",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Non-Ice types are damaged for 5 turns."
	},
	"Torment": {
		type: "Dark",
		category: "Status",
		pp: 15,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Opponent cannot use the same move in a row."
	},
	"Flatter": {
		type: "Dark",
		category: "Status",
		pp: 15,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Confuses opponent, but raises its Special Attack by two stages."
	},
	"Will-O-Wisp": {
		type: "Fire",
		category: "Status",
		pp: 15,
		power: "—",
		accuracy: "85%",
		priority: 0,
		description: "Burns opponent."
	},
	"Memento": {
		type: "Dark",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "User faints, sharply lowers opponent's Attack and Special Attack."
	},
	"Facade": {
		type: "Normal",
		category: "Physical",
		pp: 20,
		power: "70",
		accuracy: "100%",
		priority: 0,
		description: "Power doubles if user is burned, poisoned, or paralyzed."
	},
	"Focus Punch": {
		type: "Fighting",
		category: "Physical",
		pp: 20,
		power: "150",
		accuracy: "100%",
		priority: -3,
		description: "If the user is hit before attacking, it flinches instead."
	},
	"Smelling Salt": {
		type: "Normal",
		category: "Physical",
		pp: 10,
		power: "70",
		accuracy: "100%",
		priority: 0,
		description: "Power doubles if opponent is paralyzed, but cures it."
	},
	"Follow Me": {
		type: "Normal",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 2,
		description: "In Double Battle, the user takes all the attacks."
	},
	"Nature Power": {
		type: "Normal",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Uses a certain move based on the current terrain."
	},
	"Charge": {
		type: "Electric",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Next Electric move's power increases."
	},
	"Taunt": {
		type: "Dark",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Opponent can only use moves that attack."
	},
	"Helping Hand": {
		type: "Normal",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 5,
		description: "In Double Battles, boosts the power of the partner's move."
	},
	"Trick": {
		type: "Psychic",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Swaps held items with the opponent."
	},
	"Role Play": {
		type: "Psychic",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "User copies the opponent's Ability."
	},
	"Wish": {
		type: "Normal",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "The user recovers HP in the following turn."
	},
	"Assist": {
		type: "Normal",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "In a Double Battle, user randomly attacks with a partner's move."
	},
	"Ingrain": {
		type: "Grass",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "User restores HP each turn. User cannot escape/switch."
	},
	"Superpower": {
		type: "Fighting",
		category: "Physical",
		pp: 5,
		power: "120",
		accuracy: "100%",
		priority: 0,
		description: "Lowers user's Attack and Defense."
	},
	"Magic Coat": {
		type: "Psychic",
		category: "Status",
		pp: 15,
		power: "—",
		accuracy: "100%",
		priority: 4,
		description: "Any special move is reflected back to the attacker."
	},
	"Recycle": {
		type: "Normal",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "User's used hold item is restored."
	},
	"Revenge": {
		type: "Fighting",
		category: "Physical",
		pp: 10,
		power: "60",
		accuracy: "100%",
		priority: -4,
		description: "Power increases if user was hit first."
	},
	"Brick Break": {
		type: "Fighting",
		category: "Physical",
		pp: 15,
		power: "75",
		accuracy: "100%",
		priority: 0,
		description: "Breaks through Reflect and Light Screen barriers."
	},
	"Yawn": {
		type: "Normal",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Puts opponent to sleep in the next turn."
	},
	"Knock Off": {
		type: "Dark",
		category: "Physical",
		pp: 20,
		power: "65",
		accuracy: "100%",
		priority: 0,
		description: "Removes opponent's held item for the rest of the battle."
	},
	"Endeavor": {
		type: "Normal",
		category: "Physical",
		pp: 5,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Reduces opponent's HP to same as user's."
	},
	"Eruption": {
		type: "Fire",
		category: "Special",
		pp: 5,
		power: "150",
		accuracy: "100%",
		priority: 0,
		description: "Stronger when the user's HP is higher."
	},
	"Skill Swap": {
		type: "Psychic",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "The user swaps Abilities with the opponent."
	},
	"Imprison": {
		type: "Psychic",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Opponent is unable to use moves that the user also knows."
	},
	"Refresh": {
		type: "Normal",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Cures paralysis, poison, and burns."
	},
	"Grudge": {
		type: "Ghost",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "If the users faints after using this move, the PP for the opponent's last move is depleted."
	},
	"Snatch": {
		type: "Dark",
		category: "Status",
		pp: 10,
		power: "—",
		accuracy: "100%",
		priority: 4,
		description: "Steals the effects of the opponent's next move."
	},
	"Secret Power": {
		type: "???",
		category: "Physical",
		pp: 20,
		power: "70",
		accuracy: "100%",
		priority: 0,
		description: "Type depends on user's IVs.*"
	},
	"Dive": {
		type: "Water",
		category: "Physical",
		pp: 10,
		power: "80",
		accuracy: "100%",
		priority: 0,
		description: "Dives underwater on first turn, attacks on second turn."
	},
	"Arm Thrust": {
		type: "Fighting",
		category: "Physical",
		pp: 20,
		power: "15",
		accuracy: "100%",
		priority: 0,
		description: "Hits 2-5 times in one turn."
	},
	"Camouflage": {
		type: "Normal",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Changes user's type according to the location."
	},
	"Tail Glow": {
		type: "Bug",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Sharply raises user's Special Attack."
	},
	"Luster Purge": {
		type: "Psychic",
		category: "Special",
		pp: 5,
		power: "95",
		accuracy: "100%",
		priority: 0,
		description: "May lower opponent's Special Defense (50%)."
	},
	"Mist Ball": {
		type: "Psychic",
		category: "Special",
		pp: 5,
		power: "95",
		accuracy: "100%",
		priority: 0,
		description: "May lower opponent's Special Attack (50%)."
	},
	"Feather Dance": {
		type: "Flying",
		category: "Status",
		pp: 15,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Sharply lowers opponent's Attack."
	},
	"Teeter Dance": {
		type: "Normal",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Confuses all Pokémon."
	},
	"Blaze Kick": {
		type: "Fire",
		category: "Physical",
		pp: 10,
		power: "85",
		accuracy: "90%",
		priority: 0,
		description: "High critical hit ratio (12.5%). May burn opponent (10%)."
	},
	"Mud Sport": {
		type: "Ground",
		category: "Status",
		pp: 15,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Weakens the power of Electric-type moves."
	},
	"Ice Ball": {
		type: "Ice",
		category: "Physical",
		pp: 20,
		power: "30",
		accuracy: "90%",
		priority: 0,
		description: "Doubles in power each turn for 5 turns."
	},
	"Needle Arm": {
		type: "Grass",
		category: "Physical",
		pp: 15,
		power: "60",
		accuracy: "100%",
		priority: 0,
		description: "May cause flinching (30%)."
	},
	"Slack Off": {
		type: "Normal",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "User recovers half its max HP."
	},
	"Hyper Voice": {
		type: "Normal",
		category: "Special",
		pp: 10,
		power: "90",
		accuracy: "100%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Poison Fang": {
		type: "Poison",
		category: "Physical",
		pp: 15,
		power: "50",
		accuracy: "100%",
		priority: 0,
		description: "May badly poison opponent (50%)."
	},
	"Crush Claw": {
		type: "Normal",
		category: "Physical",
		pp: 10,
		power: "75",
		accuracy: "95%",
		priority: 0,
		description: "May lower opponent's Defense (50%)."
	},
	"Blast Burn": {
		type: "Fire",
		category: "Special",
		pp: 5,
		power: "150",
		accuracy: "90%",
		priority: 0,
		description: "User must recharge next turn."
	},
	"Hydro Cannon": {
		type: "Water",
		category: "Special",
		pp: 5,
		power: "150",
		accuracy: "90%",
		priority: 0,
		description: "User must recharge next turn."
	},
	"Meteor Mash": {
		type: "Steel",
		category: "Physical",
		pp: 10,
		power: "100",
		accuracy: "90%",
		priority: 0,
		description: "May raise user's Attack (20%)."
	},
	"Astonish": {
		type: "Ghost",
		category: "Physical",
		pp: 15,
		power: "30",
		accuracy: "100%",
		priority: 0,
		description: "May cause flinching (30%)."
	},
	"Weather Ball": {
		type: "Normal",
		category: "Special",
		pp: 10,
		power: "50",
		accuracy: "100%",
		priority: 0,
		description: "Move's power and type changes with the weather."
	},
	"Aromatherapy": {
		type: "Grass",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Cures all status problems in your party."
	},
	"Fake Tears": {
		type: "Dark",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Sharply lowers opponent's Special Defense."
	},
	"Air Cutter": {
		type: "Flying",
		category: "Special",
		pp: 25,
		power: "60",
		accuracy: "95%",
		priority: 0,
		description: "High critical hit ratio (12.5%)."
	},
	"Overheat": {
		type: "Fire",
		category: "Special",
		pp: 5,
		power: "140",
		accuracy: "90%",
		priority: 0,
		description: "Sharply lowers user's Special Attack."
	},
	"Odor Sleuth": {
		type: "Normal",
		category: "Status",
		pp: 40,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Resets opponent's Evasiveness, Normal and Fighting attacks can now hit Ghosts, and Ghost attacks hit Normal."
	},
	"Rock Tomb": {
		type: "Rock",
		category: "Physical",
		pp: 10,
		power: "60",
		accuracy: "95%",
		priority: 0,
		description: "Lowers opponent's Speed."
	},
	"Silver Wind": {
		type: "Bug",
		category: "Special",
		pp: 5,
		power: "60",
		accuracy: "100%",
		priority: 0,
		description: "May raise all user's stats at once (10%)."
	},
	"Metal Sound": {
		type: "Steel",
		category: "Status",
		pp: 40,
		power: "—",
		accuracy: "85%",
		priority: 0,
		description: "Sharply lowers opponent's Special Defense."
	},
	"Grass Whistle": {
		type: "Grass",
		category: "Status",
		pp: 15,
		power: "—",
		accuracy: "55%",
		priority: 0,
		description: "Puts opponent to sleep."
	},
	"Tickle": {
		type: "Normal",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Lowers opponent's Attack and Defense."
	},
	"Cosmic Power": {
		type: "Psychic",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Raises user's Defense and Special Defense."
	},
	"Water Spout": {
		type: "Water",
		category: "Special",
		pp: 5,
		power: "150",
		accuracy: "100%",
		priority: 0,
		description: "Stronger when the user's HP is higher."
	},
	"Signal Beam": {
		type: "Bug",
		category: "Special",
		pp: 15,
		power: "75",
		accuracy: "100%",
		priority: 0,
		description: "May confuse opponent (10%)."
	},
	"Shadow Punch": {
		type: "Ghost",
		category: "Physical",
		pp: 20,
		power: "60",
		accuracy: "—",
		priority: 0,
		description: "Ignores Accuracy and Evasiveness."
	},
	"Extrasensory": {
		type: "Psychic",
		category: "Special",
		pp: 20,
		power: "80",
		accuracy: "100%",
		priority: 0,
		description: "May cause flinching (10%)."
	},
	"Sky Uppercut": {
		type: "Fighting",
		category: "Physical",
		pp: 15,
		power: "85",
		accuracy: "90%",
		priority: 0,
		description: "Hits the opponent, even during Fly."
	},
	"Sand Tomb": {
		type: "Ground",
		category: "Physical",
		pp: 15,
		power: "35",
		accuracy: "85%",
		priority: 0,
		description: "Traps opponent, damaging them for 4-5 turns."
	},
	"Sheer Cold": {
		type: "Ice",
		category: "Special",
		pp: 5,
		power: "—",
		accuracy: "30%",
		priority: 0,
		description: "One-Hit-KO, if it hits."
	},
	"Muddy Water": {
		type: "Water",
		category: "Special",
		pp: 10,
		power: "95",
		accuracy: "85%",
		priority: 0,
		description: "May lower opponent's Accuracy (30%)."
	},
	"Bullet Seed": {
		type: "Grass",
		category: "Physical",
		pp: 30,
		power: "25",
		accuracy: "100%",
		priority: 0,
		description: "Hits 2-5 times in one turn."
	},
	"Aerial Ace": {
		type: "Flying",
		category: "Physical",
		pp: 20,
		power: "60",
		accuracy: "—",
		priority: 0,
		description: "Ignores Accuracy and Evasiveness."
	},
	"Icicle Spear": {
		type: "Ice",
		category: "Physical",
		pp: 30,
		power: "25",
		accuracy: "100%",
		priority: 0,
		description: "Hits 2-5 times in one turn."
	},
	"Iron Defense": {
		type: "Steel",
		category: "Status",
		pp: 15,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Sharply raises user's Defense."
	},
	"Block": {
		type: "Normal",
		category: "Status",
		pp: 5,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Opponent cannot flee or switch."
	},
	"Howl": {
		type: "Normal",
		category: "Status",
		pp: 40,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Raises user's Attack."
	},
	"Dragon Claw": {
		type: "Dragon",
		category: "Physical",
		pp: 15,
		power: "80",
		accuracy: "100%",
		priority: 0,
		description: "Deals damage with no additional effect."
	},
	"Frenzy Plant": {
		type: "Grass",
		category: "Special",
		pp: 5,
		power: "150",
		accuracy: "90%",
		priority: 0,
		description: "User must recharge next turn."
	},
	"Bulk Up": {
		type: "Fighting",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Raises user's Attack and Defense."
	},
	"Bounce": {
		type: "Flying",
		category: "Physical",
		pp: 5,
		power: "85",
		accuracy: "85%",
		priority: 0,
		description: "Springs up on first turn, attacks on second. May paralyze opponent (30%)."
	},
	"Mud Shot": {
		type: "Ground",
		category: "Special",
		pp: 15,
		power: "55",
		accuracy: "95%",
		priority: 0,
		description: "Lowers opponent's Speed."
	},
	"Poison Tail": {
		type: "Poison",
		category: "Physical",
		pp: 25,
		power: "50",
		accuracy: "100%",
		priority: 0,
		description: "High critical hit ratio (12.5%). May poison opponent (10%)."
	},
	"Covet": {
		type: "Normal",
		category: "Physical",
		pp: 25,
		power: "60",
		accuracy: "100%",
		priority: 0,
		description: "Opponent's item is stolen by the user."
	},
	"Volt Tackle": {
		type: "Electric",
		category: "Physical",
		pp: 15,
		power: "120",
		accuracy: "100%",
		priority: 0,
		description: "User receives recoil damage (1/3). May paralyze opponent (10%)."
	},
	"Magical Leaf": {
		type: "Grass",
		category: "Special",
		pp: 20,
		power: "60",
		accuracy: "—",
		priority: 0,
		description: "Ignores Accuracy and Evasiveness."
	},
	"Water Sport": {
		type: "Water",
		category: "Status",
		pp: 15,
		power: "—",
		accuracy: "100%",
		priority: 0,
		description: "Weakens the power of Fire-type moves."
	},
	"Calm Mind": {
		type: "Psychic",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Raises user's Special Attack and Special Defense."
	},
	"Leaf Blade": {
		type: "Grass",
		category: "Physical",
		pp: 15,
		power: "90",
		accuracy: "100%",
		priority: 0,
		description: "High critical hit ratio (12.5%)."
	},
	"Dragon Dance": {
		type: "Dragon",
		category: "Status",
		pp: 20,
		power: "—",
		accuracy: "—",
		priority: 0,
		description: "Raises user's Attack and Speed."
	},
	"Rock Blast": {
		type: "Rock",
		category: "Physical",
		pp: 10,
		power: "25",
		accuracy: "90%",
		priority: 0,
		description: "Hits 2-5 times in one turn."
	},
	"Shock Wave": {
		type: "Electric",
		category: "Special",
		pp: 20,
		power: "60",
		accuracy: "—",
		priority: 0,
		description: "Ignores Accuracy and Evasiveness."
	},
	"Water Pulse": {
		type: "Water",
		category: "Special",
		pp: 20,
		power: "60",
		accuracy: "100%",
		priority: 0,
		description: "May confuse opponent (20%)."
	},
	"Doom Desire": {
		type: "Steel",
		category: "Special",
		pp: 5,
		power: "140",
		accuracy: "100%",
		priority: 0,
		description: "Damage occurs 2 turns later."
	},
	"Psycho Boost": {
		type: "Psychic",
		category: "Special",
		pp: 5,
		power: "140",
		accuracy: "90%",
		priority: 0,
		description: "Sharply lowers user's Special Attack."
	}
};
