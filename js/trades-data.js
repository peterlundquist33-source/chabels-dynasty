// ============================================
// CHABELS DYNASTY — Trade Data (from Sleeper API)
// 14 confirmed trades across 3 seasons
// ============================================

const TRADES = [
  {
    teams: "Schu ↔ Nolan", season: "2023-24", date: "Early 2024",
    side1: { team: "Schu", assets: [
      { type: "player", name: "Vince Williams Jr." },
      { type: "pick", pickRound: 1, pickSeason: "2025", pickOrigTeam: "Nolan", draftedPlayer: "Jeremiah Fears" }
    ]},
    side2: { team: "Nolan", assets: [
      { type: "player", name: "Jalen Johnson" }
    ]}
  },
  {
    teams: "Schu ↔ Kaleb", season: "2023-24", date: "Early 2024",
    side1: { team: "Schu", assets: [
      { type: "player", name: "Obi Toppin" }
    ]},
    side2: { team: "Kaleb", assets: [
      { type: "pick", pickRound: 4, pickSeason: "2025", pickOrigTeam: "Schu", draftedPlayer: "Duop Reath" }
    ]}
  },
  {
    teams: "CJ ↔ Schu", season: "2023-24", date: "Early 2024",
    side1: { team: "CJ", assets: [
      { type: "player", name: "Ayo Dosunmu" },
      { type: "player", name: "Vince Williams Jr." },
      { type: "pick", pickRound: 1, pickSeason: "2024", pickOrigTeam: "Schu", draftedPlayer: "Stephon Castle" },
      { type: "pick", pickRound: 2, pickSeason: "2025", pickOrigTeam: "Schu", draftedPlayer: "Cedric Coward" },
      { type: "pick", pickRound: 3, pickSeason: "2024", pickOrigTeam: "Noah", draftedPlayer: "Isaiah Collier" }
    ]},
    side2: { team: "Schu", assets: [
      { type: "player", name: "Caris LeVert" },
      { type: "player", name: "Lauri Markkanen" }
    ]}
  },
  {
    teams: "CJ ↔ Logan", season: "2023-24", date: "Early 2024",
    side1: { team: "CJ", assets: [
      { type: "pick", pickRound: 3, pickSeason: "2024", pickOrigTeam: "Logan", draftedPlayer: "Bronny James" }
    ]},
    side2: { team: "Logan", assets: [
      { type: "pick", pickRound: 4, pickSeason: "2024", pickOrigTeam: "CJ", draftedPlayer: "Jaylon Tyson" },
      { type: "pick", pickRound: 3, pickSeason: "2024", pickOrigTeam: "Noah", draftedPlayer: "Isaiah Collier" }
    ]}
  },
  {
    teams: "Peter ↔ CJ", season: "2023-24", date: "Early 2024",
    side1: { team: "Peter", assets: [
      { type: "player", name: "Fred VanVleet" }
    ]},
    side2: { team: "CJ", assets: [
      { type: "player", name: "Keyonte George" },
      { type: "player", name: "Cason Wallace" }
    ]}
  },
  {
    teams: "Peter ↔ Logan", season: "2023-24", date: "Early 2024",
    side1: { team: "Peter", assets: [
      { type: "player", name: "Alperen Sengun" },
      { type: "pick", pickRound: 1, pickSeason: "2026", pickOrigTeam: "Logan" }
    ]},
    side2: { team: "Logan", assets: [
      { type: "player", name: "Scottie Barnes" }
    ]}
  },
  {
    teams: "Schu ↔ Kaleb", season: "2023-24", date: "Early 2024",
    side1: { team: "Schu", assets: [
      { type: "player", name: "Dyson Daniels" }
    ]},
    side2: { team: "Kaleb", assets: [
      { type: "player", name: "Jerami Grant" }
    ]}
  },
  {
    teams: "Schu ↔ Nolan", season: "2023-24", date: "Late 2024",
    side1: { team: "Schu", assets: [
      { type: "player", name: "Mikal Bridges" },
      { type: "player", name: "Jalen Johnson" },
      { type: "pick", pickRound: 1, pickSeason: "2026", pickOrigTeam: "Schu" }
    ]},
    side2: { team: "Nolan", assets: [
      { type: "player", name: "Lauri Markkanen" },
      { type: "player", name: "Jarrett Allen" },
      { type: "player", name: "Darius Garland" },
      { type: "player", name: "Franz Wagner" }
    ]}
  },
  {
    teams: "Schu ↔ Logan", season: "2024-25", date: "Jun 2025",
    side1: { team: "Schu", assets: [
      { type: "player", name: "John Collins" },
      { type: "pick", pickRound: 1, pickSeason: "2025", pickOrigTeam: "Logan", draftedPlayer: "Khaman Maluach" }
    ]},
    side2: { team: "Logan", assets: [
      { type: "pick", pickRound: 1, pickSeason: "2025", pickOrigTeam: "Schu", draftedPlayer: "Ace Bailey" },
      { type: "pick", pickRound: 1, pickSeason: "2025", pickOrigTeam: "Noah", draftedPlayer: "Egor Demin" }
    ]}
  },
  {
    teams: "CJ ↔ Austin", season: "2024-25", date: "2025",
    side1: { team: "CJ", assets: [
      { type: "pick", pickRound: 2, pickSeason: "2025", pickOrigTeam: "Austin", draftedPlayer: "Asa Newell" }
    ]},
    side2: { team: "Austin", assets: [
      { type: "pick", pickRound: 3, pickSeason: "2025", pickOrigTeam: "CJ", draftedPlayer: "Nique Clifford" },
      { type: "pick", pickRound: 4, pickSeason: "2025", pickOrigTeam: "CJ", draftedPlayer: "Yanic Konan Niederhauser" }
    ]}
  },
  {
    teams: "Schu ↔ Noah", season: "2024-25", date: "2025",
    side1: { team: "Schu", assets: [
      { type: "player", name: "DeMar DeRozan" },
      { type: "pick", pickRound: 2, pickSeason: "2026", pickOrigTeam: "Noah" }
    ]},
    side2: { team: "Noah", assets: [
      { type: "player", name: "Cameron Johnson" },
      { type: "pick", pickRound: 1, pickSeason: "2027", pickOrigTeam: "Schu" }
    ]}
  },
  {
    teams: "Peter ↔ Schu", season: "2024-25", date: "2025",
    side1: { team: "Peter", assets: [
      { type: "player", name: "Naz Reid" },
      { type: "pick", pickRound: 2, pickSeason: "2026", pickOrigTeam: "Schu" }
    ]},
    side2: { team: "Schu", assets: [
      { type: "player", name: "RJ Barrett" }
    ]}
  },
  {
    teams: "CJ ↔ Logan", season: "2024-25", date: "2025",
    side1: { team: "CJ", assets: [
      { type: "player", name: "Zion Williamson" },
      { type: "pick", pickRound: 2, pickSeason: "2026", pickOrigTeam: "Logan" },
      { type: "pick", pickRound: 1, pickSeason: "2027", pickOrigTeam: "Logan" },
      { type: "pick", pickRound: 4, pickSeason: "2027", pickOrigTeam: "Logan" }
    ]},
    side2: { team: "Logan", assets: [
      { type: "player", name: "Jalen Williams" },
      { type: "pick", pickRound: 2, pickSeason: "2027", pickOrigTeam: "CJ" }
    ]}
  },
  {
    teams: "Schu ↔ Kaleb", season: "2024-25", date: "2025",
    side1: { team: "Schu", assets: [
      { type: "player", name: "Pascal Siakam" },
      { type: "pick", pickRound: 1, pickSeason: "2026", pickOrigTeam: "Kaleb" },
      { type: "pick", pickRound: 2, pickSeason: "2026", pickOrigTeam: "Kaleb" }
    ]},
    side2: { team: "Kaleb", assets: [
      { type: "player", name: "Mikal Bridges" },
      { type: "player", name: "Paolo Banchero" }
    ]}
  }
];
