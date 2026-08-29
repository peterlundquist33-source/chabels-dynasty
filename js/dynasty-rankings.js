/* ============================================
   CHABELS DYNASTY — 3-Tier Power Rankings
   Based on Hashtag current-season points + dynasty rankings
   ============================================ */

// Hashtag Basketball 2025-26 points league rankings.
// Used by rank only for current-season / win-now scoring; raw projected PPG
// is not displayed or used because Chabels has custom scoring rules.
const CURRENT_SEASON_POINTS_DB = [
  { name: "Nikola Jokic", rank: 1, points: 60.28, gp: 65 },
  { name: "Luka Doncic", rank: 2, points: 55.49, gp: 64 },
  { name: "Victor Wembanyama", rank: 3, points: 52.15, gp: 64 },
  { name: "Shai Gilgeous-Alexander", rank: 4, points: 49.46, gp: 68 },
  { name: "Tyrese Maxey", rank: 5, points: 47.62, gp: 70 },
  { name: "Giannis Antetokounmpo", rank: 6, points: 47.46, gp: 36 },
  { name: "Jalen Johnson", rank: 7, points: 46.41, gp: 72 },
  { name: "Cade Cunningham", rank: 8, points: 46.4, gp: 64 },
  { name: "Kawhi Leonard", rank: 9, points: 44.46, gp: 65 },
  { name: "Jaylen Brown", rank: 10, points: 43.43, gp: 71 },
  { name: "Anthony Davis", rank: 11, points: 43.17, gp: 20 },
  { name: "Donovan Mitchell", rank: 12, points: 43.05, gp: 70 },
  { name: "Joel Embiid", rank: 13, points: 43.04, gp: 38 },
  { name: "Jayson Tatum", rank: 14, points: 42.95, gp: 16 },
  { name: "Anthony Edwards", rank: 15, points: 42.75, gp: 61 },
  { name: "Alperen Sengün", rank: 16, points: 42.48, gp: 72 },
  { name: "Jamal Murray", rank: 17, points: 41.78, gp: 75 },
  { name: "Deni Avdija", rank: 18, points: 41.03, gp: 66 },
  { name: "Scottie Barnes", rank: 19, points: 40.75, gp: 80 },
  { name: "James Harden", rank: 20, points: 40.61, gp: 70 },
  { name: "Lauri Markkanen", rank: 21, points: 40.38, gp: 42 },
  { name: "Bam Adebayo", rank: 22, points: 40.2, gp: 73 },
  { name: "LeBron James", rank: 23, points: 40.02, gp: 60 },
  { name: "Kevin Durant", rank: 24, points: 39.98, gp: 78 },
  { name: "Josh Giddey", rank: 25, points: 39.71, gp: 54 },
  { name: "Karl-Anthony Towns", rank: 26, points: 39.33, gp: 75 },
  { name: "Paolo Banchero", rank: 27, points: 39.33, gp: 72 },
  { name: "Jalen Brunson", rank: 28, points: 39.26, gp: 74 },
  { name: "Pascal Siakam", rank: 29, points: 38.82, gp: 62 },
  { name: "Evan Mobley", rank: 30, points: 38.75, gp: 65 },
  { name: "Cooper Flagg", rank: 31, points: 38.74, gp: 70 },
  { name: "Kevin Porter Jr.", rank: 32, points: 38.49, gp: 38 },
  { name: "Amen Thompson", rank: 33, points: 38.31, gp: 79 },
  { name: "Devin Booker", rank: 34, points: 38.28, gp: 64 },
  { name: "Stephen Curry", rank: 35, points: 38.27, gp: 43 },
  { name: "Michael Porter Jr.", rank: 36, points: 37.67, gp: 52 },
  { name: "Austin Reaves", rank: 37, points: 37.19, gp: 51 },
  { name: "Jalen Duren", rank: 38, points: 37.05, gp: 70 },
  { name: "Trey Murphy III", rank: 39, points: 37.04, gp: 66 },
  { name: "Keyonte George", rank: 40, points: 36.74, gp: 54 },
  { name: "Walker Kessler", rank: 41, points: 36.66, gp: 5 },
  { name: "LaMelo Ball", rank: 42, points: 36.51, gp: 72 },
  { name: "Jimmy Butler III", rank: 43, points: 36.47, gp: 38 },
  { name: "Julius Randle", rank: 44, points: 36.34, gp: 79 },
  { name: "Chet Holmgren", rank: 45, points: 35.43, gp: 69 },
  { name: "Alexandre Sarr", rank: 46, points: 35.08, gp: 48 },
  { name: "Domantas Sabonis", rank: 47, points: 34.88, gp: 19 },
  { name: "Brandon Ingram", rank: 48, points: 34.67, gp: 77 },
  { name: "Derrick White", rank: 49, points: 34.53, gp: 77 },
  { name: "Zion Williamson", rank: 50, points: 34.44, gp: 62 },
  { name: "Donovan Clingan", rank: 51, points: 34.27, gp: 77 },
  { name: "Ja Morant", rank: 52, points: 34.11, gp: 20 },
  { name: "De'Aaron Fox", rank: 53, points: 33.51, gp: 72 },
  { name: "Stephon Castle", rank: 54, points: 33.46, gp: 68 },
  { name: "Jaren Jackson Jr.", rank: 55, points: 33.44, gp: 48 },
  { name: "Dyson Daniels", rank: 56, points: 33.41, gp: 76 },
  { name: "Ty Jerome", rank: 57, points: 33.11, gp: 15 },
  { name: "Dejounte Murray", rank: 58, points: 33.08, gp: 14 },
  { name: "Onyeka Okongwu", rank: 59, points: 33.02, gp: 74 },
  { name: "Ryan Rollins", rank: 60, points: 32.87, gp: 74 },
  { name: "Tyler Herro", rank: 61, points: 32.86, gp: 33 },
  { name: "Franz Wagner", rank: 62, points: 32.84, gp: 34 },
  { name: "Nickeil Alexander-Walker", rank: 63, points: 32.68, gp: 78 },
  { name: "Desmond Bane", rank: 64, points: 32.67, gp: 82 },
  { name: "Jalen Williams", rank: 65, points: 32.52, gp: 33 },
  { name: "Paul George", rank: 66, points: 32.51, gp: 37 },
  { name: "Zach Edey", rank: 67, points: 32.47, gp: 11 },
  { name: "Brandon Miller", rank: 68, points: 32.38, gp: 65 },
  { name: "Rudy Gobert", rank: 69, points: 32.35, gp: 76 },
  { name: "Jusuf Nurkic", rank: 70, points: 32.23, gp: 41 },
  { name: "VJ Edgecombe", rank: 71, points: 32.02, gp: 75 },
  { name: "Immanuel Quickley", rank: 72, points: 32, gp: 70 },
  { name: "Nikola Vucevic", rank: 73, points: 31.78, gp: 64 },
  { name: "Jarrett Allen", rank: 74, points: 31.75, gp: 56 },
  { name: "Trae Young", rank: 75, points: 31.4, gp: 15 },
  { name: "Russell Westbrook", rank: 76, points: 31.28, gp: 64 },
  { name: "Andrew Nembhard", rank: 77, points: 31.21, gp: 57 },
  { name: "Ivica Zubac", rank: 78, points: 31.02, gp: 48 },
  { name: "Darius Garland", rank: 79, points: 30.98, gp: 45 },
  { name: "RJ Barrett", rank: 80, points: 30.91, gp: 57 },
  { name: "Norman Powell", rank: 81, points: 30.55, gp: 58 },
  { name: "OG Anunoby", rank: 82, points: 30.44, gp: 67 },
  { name: "Jalen Suggs", rank: 83, points: 30.18, gp: 57 },
  { name: "DeMar DeRozan", rank: 84, points: 30.13, gp: 77 },
  { name: "Jrue Holiday", rank: 85, points: 30.07, gp: 53 },
  { name: "Kristaps Porzingis", rank: 86, points: 30.04, gp: 32 },
  { name: "Shaedon Sharpe", rank: 87, points: 30.01, gp: 50 },
  { name: "Matas Buzelis", rank: 88, points: 29.86, gp: 77 },
  { name: "Saddiq Bey", rank: 89, points: 29.82, gp: 72 },
  { name: "Payton Pritchard", rank: 90, points: 29.78, gp: 79 },
  { name: "Miles Bridges", rank: 91, points: 29.76, gp: 77 },
  { name: "CJ McCollum", rank: 92, points: 29.71, gp: 76 },
  { name: "Kon Knueppel", rank: 93, points: 29.66, gp: 81 },
  { name: "Jabari Smith Jr.", rank: 94, points: 29.63, gp: 77 },
  { name: "Kennedy Chandler", rank: 95, points: 29.58, gp: 11 },
  { name: "Keegan Murray", rank: 96, points: 29.51, gp: 23 },
  { name: "Kyshawn George", rank: 97, points: 29.47, gp: 48 },
  { name: "Josh Hart", rank: 98, points: 29.43, gp: 66 },
  { name: "Julian Reese", rank: 99, points: 29.35, gp: 13 },
  { name: "Mikal Bridges", rank: 100, points: 29.31, gp: 82 },
  { name: "Andrew Wiggins", rank: 101, points: 29.26, gp: 68 },
  { name: "Santi Aldama", rank: 102, points: 29.24, gp: 43 },
  { name: "P.J. Washington", rank: 103, points: 29.05, gp: 56 },
  { name: "Nicolas Claxton", rank: 104, points: 28.83, gp: 69 },
  { name: "Isaiah Hartenstein", rank: 105, points: 28.58, gp: 47 },
  { name: "Grayson Allen", rank: 106, points: 28.5, gp: 51 },
  { name: "Jaime Jaquez Jr.", rank: 107, points: 28.45, gp: 75 },
  { name: "Dillon Brooks", rank: 108, points: 28.42, gp: 56 },
  { name: "Anthony Black", rank: 109, points: 28.41, gp: 64 },
  { name: "Aaron Gordon", rank: 110, points: 28.26, gp: 36 },
  { name: "Tre Jones", rank: 111, points: 28.02, gp: 65 },
  { name: "Naz Reid", rank: 112, points: 27.94, gp: 77 },
  { name: "Derik Queen", rank: 113, points: 27.9, gp: 81 },
  { name: "Ausar Thompson", rank: 114, points: 27.84, gp: 73 },
  { name: "Neemias Queta", rank: 115, points: 27.63, gp: 76 },
  { name: "Jaden McDaniels", rank: 116, points: 27.49, gp: 73 },
  { name: "Kel'el Ware", rank: 117, points: 27.45, gp: 77 },
  { name: "Bennedict Mathurin", rank: 118, points: 27.38, gp: 54 },
  { name: "Peyton Watson", rank: 119, points: 27.38, gp: 54 },
  { name: "Jalen Green", rank: 120, points: 27.07, gp: 32 },
  { name: "Naji Marshall", rank: 121, points: 26.99, gp: 74 },
  { name: "Brandin Podziemski", rank: 122, points: 26.97, gp: 82 },
  { name: "Jerami Grant", rank: 123, points: 26.7, gp: 57 },
  { name: "Reed Sheppard", rank: 124, points: 26.43, gp: 82 },
  { name: "Mark Williams", rank: 125, points: 26.43, gp: 60 },
  { name: "Collin Gillespie", rank: 126, points: 26.32, gp: 80 },
  { name: "Deandre Ayton", rank: 127, points: 26.3, gp: 72 },
  { name: "Zach LaVine", rank: 128, points: 26.16, gp: 39 },
  { name: "Kelly Oubre Jr.", rank: 129, points: 26.1, gp: 50 },
  { name: "Isaiah Collier", rank: 130, points: 25.95, gp: 59 },
  { name: "Wendell Carter Jr.", rank: 131, points: 25.93, gp: 78 },
  { name: "Alondes Williams", rank: 132, points: 25.91, gp: 4 },
  { name: "Donte DiVincenzo", rank: 133, points: 25.82, gp: 82 },
  { name: "Kyle Filipowski", rank: 134, points: 25.74, gp: 77 },
  { name: "Myles Turner", rank: 135, points: 25.61, gp: 71 },
  { name: "Tobias Harris", rank: 136, points: 25.57, gp: 63 },
  { name: "Bilal Coulibaly", rank: 137, points: 25.56, gp: 56 },
  { name: "Ayo Dosunmu", rank: 138, points: 25.48, gp: 69 },
  { name: "Coby White", rank: 139, points: 25.38, gp: 50 },
  { name: "Ajay Mitchell", rank: 140, points: 25.36, gp: 57 },
  { name: "Jeremiah Fears", rank: 141, points: 25.34, gp: 82 },
  { name: "Cedric Coward", rank: 142, points: 25.33, gp: 62 },
  { name: "Moussa Diabaté", rank: 143, points: 25.24, gp: 73 },
  { name: "Jakob Poeltl", rank: 144, points: 25.1, gp: 46 },
  { name: "Toumani Camara", rank: 145, points: 25.07, gp: 82 },
  { name: "Devin Vassell", rank: 146, points: 25, gp: 67 },
  { name: "Bobby Portis", rank: 147, points: 24.68, gp: 67 },
  { name: "Bez Mbeng", rank: 148, points: 24.66, gp: 15 },
  { name: "Maxime Raynaud", rank: 149, points: 24.65, gp: 74 },
  { name: "Andersson Garcia", rank: 150, points: 24.58, gp: 5 },
  { name: "Kadary Richmond", rank: 151, points: 24.26, gp: 3 },
  { name: "John Collins", rank: 152, points: 24.16, gp: 69 },
  { name: "Jaylon Tyson", rank: 153, points: 23.97, gp: 66 },
  { name: "Scotty Pippen Jr.", rank: 154, points: 23.94, gp: 10 },
  { name: "Quentin Grimes", rank: 155, points: 23.87, gp: 75 },
  { name: "Ace Bailey", rank: 156, points: 23.79, gp: 72 },
  { name: "Daniel Gafford", rank: 157, points: 23.78, gp: 55 },
  { name: "Draymond Green", rank: 158, points: 23.7, gp: 68 },
  { name: "Precious Achiuwa", rank: 159, points: 23.69, gp: 73 },
  { name: "Davion Mitchell", rank: 160, points: 23.64, gp: 70 },
  { name: "Collin Sexton", rank: 161, points: 23.56, gp: 68 },
  { name: "Tari Eason", rank: 162, points: 23.31, gp: 60 },
  { name: "Christian Braun", rank: 163, points: 23.31, gp: 44 },
  { name: "Cam Spencer", rank: 164, points: 23.25, gp: 72 },
  { name: "Kyle Kuzma", rank: 165, points: 23.2, gp: 69 },
  { name: "De'Anthony Melton", rank: 166, points: 23.19, gp: 49 },
  { name: "Brandon Williams", rank: 167, points: 23.08, gp: 66 },
  { name: "Scoot Henderson", rank: 168, points: 22.99, gp: 30 },
  { name: "Dylan Harper", rank: 169, points: 22.93, gp: 69 },
  { name: "Dariq Whitehead", rank: 170, points: 22.9, gp: 6 },
  { name: "Aaron Nesmith", rank: 171, points: 22.89, gp: 45 },
  { name: "Julian Champagnie", rank: 172, points: 22.86, gp: 82 },
  { name: "Mitchell Robinson", rank: 173, points: 22.74, gp: 60 },
  { name: "Sandro Mamukelashvili", rank: 174, points: 22.63, gp: 80 },
  { name: "Jalen Slawson", rank: 175, points: 22.63, gp: 13 },
  { name: "Keldon Johnson", rank: 176, points: 22.53, gp: 82 },
  { name: "Jalen Smith", rank: 177, points: 22.44, gp: 53 },
  { name: "Jay Huff", rank: 178, points: 22.4, gp: 82 },
  { name: "Cameron Johnson", rank: 179, points: 22.31, gp: 54 },
  { name: "Jonathan Kuminga", rank: 180, points: 22.22, gp: 36 },
  { name: "Royce O'Neale", rank: 181, points: 22.16, gp: 78 },
  { name: "Al Horford", rank: 182, points: 22.13, gp: 45 },
  { name: "Cason Wallace", rank: 183, points: 22.07, gp: 77 },
  { name: "Jarace Walker", rank: 184, points: 22.07, gp: 76 },
  { name: "Marvin Bagley III", rank: 185, points: 22.02, gp: 60 },
  { name: "Day'Ron Sharpe", rank: 186, points: 22.02, gp: 62 },
  { name: "Noah Clowney", rank: 187, points: 21.99, gp: 66 },
  { name: "GG Jackson II", rank: 188, points: 21.86, gp: 55 },
  { name: "Moses Moody", rank: 189, points: 21.76, gp: 60 },
  { name: "Dylan Cardwell", rank: 190, points: 21.75, gp: 44 },
  { name: "Isaiah Stewart", rank: 191, points: 21.7, gp: 58 },
  { name: "Robert Williams III", rank: 192, points: 21.7, gp: 59 },
  { name: "Dennis Schröder", rank: 193, points: 21.69, gp: 70 },
  { name: "Jock Landale", rank: 194, points: 21.64, gp: 68 },
  { name: "T.J. McConnell", rank: 195, points: 21.64, gp: 56 },
  { name: "Jordan Goodwin", rank: 196, points: 21.63, gp: 70 },
  { name: "Brice Sensabaugh", rank: 197, points: 21.62, gp: 75 },
  { name: "Herbert Jones", rank: 198, points: 21.53, gp: 56 },
  { name: "Cormac Ryan", rank: 199, points: 21.5, gp: 11 },
  { name: "De'Andre Hunter", rank: 200, points: 21.47, gp: 45 },
  { name: "Pelle Larsson", rank: 201, points: 21.3, gp: 70 },
  { name: "Collin Murray-Boyles", rank: 202, points: 21.25, gp: 57 },
  { name: "Andre Drummond", rank: 203, points: 21.13, gp: 63 },
  { name: "Steven Adams", rank: 204, points: 20.92, gp: 32 },
  { name: "Derrick Jones Jr.", rank: 205, points: 20.9, gp: 50 },
  { name: "Miles McBride", rank: 206, points: 20.88, gp: 41 },
  { name: "Kevin Huerter", rank: 207, points: 20.8, gp: 69 },
  { name: "Anfernee Simons", rank: 208, points: 20.75, gp: 55 },
  { name: "Jordan Poole", rank: 209, points: 20.75, gp: 39 },
  { name: "Justin Champagnie", rank: 210, points: 20.67, gp: 69 },
  { name: "Bub Carrington", rank: 211, points: 20.63, gp: 82 },
  { name: "Luke Kornet", rank: 212, points: 20.57, gp: 68 },
  { name: "Sam Merrill", rank: 213, points: 20.42, gp: 52 },
  { name: "Max Strus", rank: 214, points: 20.38, gp: 12 },
  { name: "Max Christie", rank: 215, points: 20.34, gp: 77 },
  { name: "Marcus Smart", rank: 216, points: 20.31, gp: 62 },
  { name: "Duncan Robinson", rank: 217, points: 20.24, gp: 77 },
  { name: "Adama Bal", rank: 218, points: 20.12, gp: 8 },
  { name: "Jaylen Wells", rank: 219, points: 20.09, gp: 69 },
  { name: "Malik Monk", rank: 220, points: 20.03, gp: 62 },
  { name: "Obi Toppin", rank: 221, points: 20.03, gp: 24 },
  { name: "Kris Dunn", rank: 222, points: 19.96, gp: 82 },
  { name: "Ryan Kalkbrenner", rank: 223, points: 19.93, gp: 69 },
  { name: "Javon Small", rank: 224, points: 19.87, gp: 41 },
  { name: "Egor Demin", rank: 225, points: 19.84, gp: 52 },
  { name: "Tim Hardaway Jr.", rank: 226, points: 19.77, gp: 80 },
  { name: "DeJon Jarreau", rank: 227, points: 19.67, gp: 11 },
  { name: "Tyler Burton", rank: 228, points: 19.59, gp: 12 },
  { name: "Jake LaRavia", rank: 229, points: 19.45, gp: 82 },
  { name: "Danny Wolf", rank: 230, points: 19.43, gp: 57 },
  { name: "Malachi Smith", rank: 231, points: 19.28, gp: 15 },
  { name: "Chaney Johnson", rank: 232, points: 19.27, gp: 34 },
  { name: "Chaney Johnson", rank: 233, points: 19.27, gp: 34 },
  { name: "Jaylin Williams", rank: 234, points: 19.2, gp: 65 },
  { name: "Leaky Black", rank: 235, points: 19.1, gp: 15 },
  { name: "Vince Williams Jr.", rank: 236, points: 19.08, gp: 40 },
  { name: "Oso Ighodaro", rank: 237, points: 19.07, gp: 82 },
  { name: "Paul Reed", rank: 238, points: 19.05, gp: 65 },
  { name: "Tristan da Silva", rank: 239, points: 18.99, gp: 77 },
  { name: "Brook Lopez", rank: 240, points: 18.97, gp: 75 },
  { name: "Zach Collins", rank: 241, points: 18.97, gp: 10 },
  { name: "Tre Johnson", rank: 242, points: 18.86, gp: 60 },
  { name: "Dominick Barlow", rank: 243, points: 18.86, gp: 71 },
  { name: "Micah Potter", rank: 244, points: 18.85, gp: 47 },
  { name: "Yves Missi", rank: 245, points: 18.81, gp: 66 },
  { name: "Daniss Jenkins", rank: 246, points: 18.81, gp: 72 },
  { name: "Oscar Tshiebwe", rank: 247, points: 18.72, gp: 27 },
  { name: "Khris Middleton", rank: 248, points: 18.69, gp: 63 },
  { name: "Gui Santos", rank: 249, points: 18.68, gp: 68 },
  { name: "Zaccharie Risacher", rank: 250, points: 18.66, gp: 67 },
  { name: "Tristen Newton", rank: 251, points: 18.6, gp: 1 },
  { name: "Ziaire Williams", rank: 252, points: 18.48, gp: 56 },
  { name: "Rui Hachimura", rank: 253, points: 18.46, gp: 68 },
  { name: "Josh Oduro", rank: 254, points: 18.44, gp: 3 },
  { name: "John Konchar", rank: 255, points: 18.41, gp: 56 },
  { name: "Jordan Miller", rank: 256, points: 18.4, gp: 60 },
  { name: "Mouhamadou Gueye", rank: 257, points: 18.35, gp: 2 },
  { name: "Kyle Anderson", rank: 258, points: 18.2, gp: 43 },
  { name: "Devin Carter", rank: 259, points: 18.11, gp: 38 },
  { name: "Nique Clifford", rank: 260, points: 18.11, gp: 75 },
  { name: "Dereck Lively II", rank: 261, points: 18.01, gp: 7 },
  { name: "Bruce Brown", rank: 262, points: 17.98, gp: 82 },
  { name: "Jamal Shead", rank: 263, points: 17.94, gp: 82 },
  { name: "D'Angelo Russell", rank: 264, points: 17.91, gp: 26 },
  { name: "Daeqwon Plowden", rank: 265, points: 17.85, gp: 32 },
  { name: "Isaiah Joe", rank: 266, points: 17.85, gp: 71 },
  { name: "Sam Hauser", rank: 267, points: 17.81, gp: 78 },
  { name: "Lonzo Ball", rank: 268, points: 17.8, gp: 35 },
  { name: "Aaron Wiggins", rank: 269, points: 17.77, gp: 65 },
  { name: "Cam Thomas", rank: 270, points: 17.64, gp: 42 },
  { name: "Jamir Watkins", rank: 271, points: 17.63, gp: 50 },
  { name: "Goga Bitadze", rank: 272, points: 17.6, gp: 64 },
  { name: "Isaiah Jackson", rank: 273, points: 17.56, gp: 55 },
  { name: "Ron Holland II", rank: 274, points: 17.5, gp: 78 },
  { name: "Isaac Okoro", rank: 275, points: 17.49, gp: 63 },
  { name: "Harrison Barnes", rank: 276, points: 17.41, gp: 77 },
  { name: "Jonas Valanciunas", rank: 277, points: 17.37, gp: 65 },
  { name: "Klay Thompson", rank: 278, points: 17.37, gp: 69 },
  { name: "Cody Williams", rank: 279, points: 17.35, gp: 67 },
  { name: "Olivier-Maxence Prosper", rank: 280, points: 17.35, gp: 53 },
  { name: "Blake Hinson", rank: 281, points: 17.33, gp: 14 },
  { name: "Will Riley", rank: 282, points: 17.23, gp: 74 },
  { name: "Cameron Payne", rank: 283, points: 17.15, gp: 22 },
  { name: "Jose Alvarado", rank: 284, points: 17.15, gp: 69 },
  { name: "Caleb Love", rank: 285, points: 17.06, gp: 49 },
  { name: "Luguentz Dort", rank: 286, points: 17, gp: 69 },
  { name: "Kevin Love", rank: 287, points: 16.96, gp: 37 },
  { name: "Nolan Traoré", rank: 288, points: 16.91, gp: 56 },
  { name: "AJ Green", rank: 289, points: 16.79, gp: 78 },
  { name: "Gary Payton II", rank: 290, points: 16.77, gp: 73 },
  { name: "Kentavious Caldwell-Pope", rank: 291, points: 16.65, gp: 51 },
  { name: "David Roddy", rank: 292, points: 16.64, gp: 5 },
  { name: "Jaxson Hayes", rank: 293, points: 16.62, gp: 66 },
  { name: "Terance Mann", rank: 294, points: 16.59, gp: 63 },
  { name: "Caris LeVert", rank: 295, points: 16.55, gp: 60 },
  { name: "Craig Porter Jr.", rank: 296, points: 16.53, gp: 64 },
  { name: "Dru Smith", rank: 297, points: 16.4, gp: 70 },
  { name: "Quenton Jackson", rank: 298, points: 16.36, gp: 49 },
  { name: "Walter Clayton Jr.", rank: 299, points: 16.35, gp: 69 },
  { name: "Ryan Nembhard", rank: 300, points: 16.29, gp: 60 },
  { name: "Elijah Harkless", rank: 301, points: 16.25, gp: 26 },
  { name: "Taurean Prince", rank: 302, points: 16.22, gp: 26 },
  { name: "Quinten Post", rank: 303, points: 16.1, gp: 67 },
  { name: "Alex Caruso", rank: 304, points: 16.01, gp: 56 },
  { name: "Dean Wade", rank: 305, points: 15.94, gp: 59 },
  { name: "Tristan Vukcevic", rank: 306, points: 15.9, gp: 49 },
  { name: "Taylor Hendricks", rank: 307, points: 15.89, gp: 59 },
  { name: "Luka Garza", rank: 308, points: 15.87, gp: 69 },
  { name: "Svi Mykhailiuk", rank: 309, points: 15.85, gp: 50 },
  { name: "Ryan Dunn", rank: 310, points: 15.79, gp: 70 },
  { name: "Pat Spencer", rank: 311, points: 15.78, gp: 66 },
  { name: "Grant Williams", rank: 312, points: 15.73, gp: 36 },
  { name: "Matisse Thybulle", rank: 313, points: 15.7, gp: 30 },
  { name: "Luke Kennard", rank: 314, points: 15.66, gp: 78 },
  { name: "Vít Krejcí", rank: 315, points: 15.61, gp: 65 },
  { name: "Cam Whitmore", rank: 316, points: 15.56, gp: 21 },
  { name: "Jaden Ivey", rank: 317, points: 15.55, gp: 37 },
  { name: "Moussa Cisse", rank: 318, points: 15.54, gp: 38 },
  { name: "Nikola Jovic", rank: 319, points: 15.46, gp: 47 },
  { name: "Bones Hyland", rank: 320, points: 15.46, gp: 71 },
  { name: "Josh Minott", rank: 321, points: 15.44, gp: 49 },
  { name: "DeAndre Jordan", rank: 322, points: 15.41, gp: 12 },
  { name: "Javonte Green", rank: 323, points: 15.36, gp: 82 },
  { name: "Jahmai Mashack", rank: 324, points: 15.32, gp: 31 },
  { name: "Ja'Kobe Walter", rank: 325, points: 15.27, gp: 72 },
  { name: "Ousmane Dieng", rank: 326, points: 15.19, gp: 57 },
  { name: "Landry Shamet", rank: 327, points: 15.06, gp: 51 },
  { name: "Killian Hayes", rank: 328, points: 15.01, gp: 23 },
  { name: "Keon Ellis", rank: 329, points: 14.98, gp: 72 },
  { name: "Simone Fontecchio", rank: 330, points: 14.95, gp: 70 },
  { name: "Kris Murray", rank: 331, points: 14.92, gp: 57 },
  { name: "DaQuan Jeffries", rank: 332, points: 14.89, gp: 3 },
  { name: "Ben Saraf", rank: 333, points: 14.82, gp: 44 },
  { name: "Cole Anthony", rank: 334, points: 14.8, gp: 35 },
  { name: "Leonard Miller", rank: 335, points: 14.73, gp: 46 },
  { name: "John Poulakidas", rank: 336, points: 14.71, gp: 13 },
  { name: "Bryce McGowens", rank: 337, points: 14.67, gp: 42 },
  { name: "Corey Kispert", rank: 338, points: 14.66, gp: 58 },
  { name: "Patrick Williams", rank: 339, points: 14.65, gp: 72 },
  { name: "Ben Sheppard", rank: 340, points: 14.6, gp: 65 },
  { name: "Trendon Watford", rank: 341, points: 14.51, gp: 53 },
  { name: "Karlo Matkovic", rank: 342, points: 14.49, gp: 62 },
  { name: "Charles Bassey", rank: 343, points: 14.38, gp: 13 },
  { name: "Sharife Cooper", rank: 344, points: 14.37, gp: 41 },
  { name: "Adem Bona", rank: 345, points: 14.31, gp: 71 },
  { name: "Jordan Walsh", rank: 346, points: 14.25, gp: 68 },
  { name: "Jericho Sims", rank: 347, points: 14.15, gp: 67 },
  { name: "Buddy Hield", rank: 348, points: 14.11, gp: 51 },
  { name: "Will Richard", rank: 349, points: 14.05, gp: 69 },
  { name: "Kevon Looney", rank: 350, points: 14.02, gp: 21 },
  { name: "Kasparas Jakucionis", rank: 351, points: 13.97, gp: 53 },
  { name: "Spencer Jones", rank: 352, points: 13.81, gp: 64 },
  { name: "Sion James", rank: 353, points: 13.8, gp: 82 },
  { name: "Ethan Thompson", rank: 354, points: 13.72, gp: 32 },
  { name: "Jarred Vanderbilt", rank: 355, points: 13.7, gp: 65 },
  { name: "Clint Capela", rank: 356, points: 13.52, gp: 75 },
  { name: "Bogdan Bogdanovic", rank: 357, points: 13.52, gp: 23 },
  { name: "Isaiah Stevens", rank: 358, points: 13.5, gp: 3 },
  { name: "Kenrich Williams", rank: 359, points: 13.46, gp: 56 },
  { name: "Johnny Furphy", rank: 360, points: 13.38, gp: 35 },
  { name: "Mouhamed Gueye", rank: 361, points: 13.37, gp: 77 },
  { name: "Nick Richards", rank: 362, points: 13.34, gp: 47 },
  { name: "Jared McCain", rank: 363, points: 13.25, gp: 67 },
  { name: "Anthony Gill", rank: 364, points: 13.18, gp: 55 },
  { name: "Kobe Sanders", rank: 365, points: 13.06, gp: 68 },
  { name: "Nae'Qwan Tomlin", rank: 366, points: 13.03, gp: 64 },
  { name: "Jordan Clarkson", rank: 367, points: 12.86, gp: 72 },
  { name: "Baylor Scheierman", rank: 368, points: 12.85, gp: 77 },
  { name: "Thomas Bryant", rank: 369, points: 12.83, gp: 60 },
  { name: "Jevon Carter", rank: 370, points: 12.79, gp: 53 },
  { name: "Keshon Gilbert", rank: 371, points: 12.76, gp: 4 },
  { name: "Tidjane Salaün", rank: 372, points: 12.75, gp: 37 },
  { name: "Mike Conley", rank: 373, points: 12.69, gp: 54 },
  { name: "Moritz Wagner", rank: 374, points: 12.69, gp: 36 },
  { name: "Tyrese Martin", rank: 375, points: 12.6, gp: 46 },
  { name: "MarJon Beauchamp", rank: 376, points: 12.56, gp: 14 },
  { name: "Branden Carlson", rank: 377, points: 12.25, gp: 42 },
  { name: "Payton Sandfort", rank: 378, points: 12.25, gp: 4 },
  { name: "Tyson Etienne", rank: 379, points: 12.22, gp: 24 },
  { name: "Jamaree Bouyea", rank: 380, points: 12.21, gp: 46 },
  { name: "Rob Dillingham", rank: 381, points: 12.15, gp: 65 },
  { name: "Guerschon Yabusele", rank: 382, points: 12.05, gp: 67 },
  { name: "Jaden Hardy", rank: 383, points: 12.05, gp: 57 },
  { name: "Hayden Gray", rank: 384, points: 12, gp: 1 },
  { name: "Rayan Rupert", rank: 385, points: 11.98, gp: 64 },
  { name: "Olivier Sarr", rank: 386, points: 11.96, gp: 4 },
  { name: "Skal Labissiere", rank: 387, points: 11.95, gp: 3 },
  { name: "Julian Strawther", rank: 388, points: 11.85, gp: 57 },
  { name: "Justin Edwards", rank: 389, points: 11.85, gp: 64 },
  { name: "Nikola Topic", rank: 390, points: 11.83, gp: 10 },
  { name: "Kobe Brown", rank: 391, points: 11.8, gp: 61 },
  { name: "Jeremiah Robinson-Earl", rank: 392, points: 11.74, gp: 22 },
  { name: "Gary Trent Jr.", rank: 393, points: 11.7, gp: 65 },
  { name: "Drake Powell", rank: 394, points: 11.66, gp: 63 },
  { name: "Sidy Cissoko", rank: 395, points: 11.64, gp: 75 },
  { name: "Nate Williams", rank: 396, points: 11.57, gp: 14 },
  { name: "Jalen Pickett", rank: 397, points: 11.56, gp: 50 },
  { name: "Drew Eubanks", rank: 398, points: 11.5, gp: 42 },
  { name: "Grant Nelson", rank: 399, points: 11.35, gp: 4 },
  { name: "Brandon Clarke", rank: 400, points: 11.35, gp: 2 },
  { name: "Mac McClung", rank: 401, points: 11.23, gp: 11 },
  { name: "Dwight Powell", rank: 402, points: 11.22, gp: 63 },
  { name: "Josh Okogie", rank: 403, points: 11.22, gp: 78 },
  { name: "Mo Bamba", rank: 404, points: 11.2, gp: 4 },
  { name: "E.J. Liddell", rank: 405, points: 11.19, gp: 26 },
  { name: "Kam Jones", rank: 406, points: 11.12, gp: 37 },
  { name: "Pete Nance", rank: 407, points: 11.04, gp: 47 },
  { name: "L.J. Cryer", rank: 408, points: 11.02, gp: 18 },
  { name: "Haywood Highsmith", rank: 409, points: 10.98, gp: 7 },
  { name: "Bradley Beal", rank: 410, points: 10.96, gp: 6 },
  { name: "Caleb Martin", rank: 411, points: 10.95, gp: 58 },
  { name: "PJ Hall", rank: 412, points: 10.83, gp: 19 },
  { name: "Noah Penda", rank: 413, points: 10.79, gp: 59 },
  { name: "Christian Koloko", rank: 414, points: 10.65, gp: 27 },
  { name: "Seth Curry", rank: 415, points: 10.64, gp: 10 },
  { name: "Chris Paul", rank: 416, points: 10.61, gp: 16 },
  { name: "Hugo González", rank: 417, points: 10.56, gp: 74 },
  { name: "Gradey Dick", rank: 418, points: 10.53, gp: 76 },
  { name: "Tyler Kolek", rank: 419, points: 10.52, gp: 62 },
  { name: "KJ Simpson", rank: 420, points: 10.48, gp: 20 },
  { name: "Jalen Wilson", rank: 421, points: 10.42, gp: 54 },
  { name: "Ochai Agbaji", rank: 422, points: 10.41, gp: 62 },
  { name: "Trey Alexander", rank: 423, points: 10.39, gp: 9 },
  { name: "Nicolas Batum", rank: 424, points: 10.3, gp: 74 },
  { name: "Tre Mann", rank: 425, points: 10.24, gp: 53 },
  { name: "Enrique Freeman", rank: 426, points: 10.2, gp: 4 },
  { name: "Asa Newell", rank: 427, points: 10.09, gp: 44 },
  { name: "Micah Peavy", rank: 428, points: 10.03, gp: 61 },
  { name: "Marcus Sasser", rank: 429, points: 10, gp: 38 },
  { name: "Blake Wesley", rank: 430, points: 9.96, gp: 31 },
  { name: "Larry Nance Jr.", rank: 431, points: 9.94, gp: 35 },
  { name: "Dalen Terry", rank: 432, points: 9.91, gp: 48 },
  { name: "Jabari Walker", rank: 433, points: 9.85, gp: 64 },
  { name: "Colby Jones", rank: 434, points: 9.8, gp: 1 },
  { name: "Tolu Smith", rank: 435, points: 9.76, gp: 15 },
  { name: "Yuki Kawamura", rank: 436, points: 9.76, gp: 18 },
  { name: "Cody Martin", rank: 437, points: 9.75, gp: 4 },
  { name: "Yanic Konan Niederhauser", rank: 438, points: 9.73, gp: 41 },
  { name: "Myron Gardner", rank: 439, points: 9.54, gp: 45 },
  { name: "Patrick Baldwin Jr.", rank: 440, points: 9.52, gp: 9 },
  { name: "Tyrese Proctor", rank: 441, points: 9.51, gp: 50 },
  { name: "Trayce Jackson-Davis", rank: 442, points: 9.49, gp: 53 },
  { name: "Rocco Zikarsky", rank: 443, points: 9.46, gp: 5 },
  { name: "Taelon Peter", rank: 444, points: 9.42, gp: 38 },
  { name: "Zeke Nnaji", rank: 445, points: 9.37, gp: 52 },
  { name: "Jett Howard", rank: 446, points: 9.37, gp: 55 },
  { name: "Joan Beringer", rank: 447, points: 9.36, gp: 40 },
  { name: "Jamal Cain", rank: 448, points: 9.3, gp: 40 },
  { name: "Rasheer Fleming", rank: 449, points: 9.16, gp: 55 },
  { name: "Tyus Jones", rank: 450, points: 9.12, gp: 67 },
  { name: "Malevy Leons", rank: 451, points: 9.12, gp: 25 },
  { name: "Aaron Holiday", rank: 452, points: 9.1, gp: 57 },
  { name: "Garrison Mathews", rank: 453, points: 9.07, gp: 15 },
  { name: "Jaylen Clark", rank: 454, points: 9.01, gp: 68 },
  { name: "Carter Bryant", rank: 455, points: 9, gp: 71 },
  { name: "Keshad Johnson", rank: 456, points: 8.95, gp: 32 },
  { name: "Tony Bradley", rank: 457, points: 8.93, gp: 40 },
  { name: "Chris Boucher", rank: 458, points: 8.9, gp: 9 },
  { name: "Jeremy Sochan", rank: 459, points: 8.88, gp: 44 },
  { name: "Josh Green", rank: 460, points: 8.86, gp: 58 },
  { name: "Nick Smith Jr.", rank: 461, points: 8.81, gp: 30 },
  { name: "Jordan Hawkins", rank: 462, points: 8.79, gp: 51 },
  { name: "Ron Harper Jr.", rank: 463, points: 8.79, gp: 29 },
  { name: "Doug McDermott", rank: 464, points: 8.76, gp: 29 },
  { name: "Gabe Vincent", rank: 465, points: 8.75, gp: 53 },
  { name: "Jonathan Isaac", rank: 466, points: 8.75, gp: 52 },
  { name: "RayJ Dennis", rank: 467, points: 8.75, gp: 17 },
  { name: "Dorian Finney-Smith", rank: 468, points: 8.7, gp: 37 },
  { name: "Liam McNeeley", rank: 469, points: 8.68, gp: 31 },
  { name: "Tristan Enaruna", rank: 470, points: 8.57, gp: 9 },
  { name: "Keaton Wallace", rank: 471, points: 8.57, gp: 53 },
  { name: "Eric Gordon", rank: 472, points: 8.56, gp: 6 },
  { name: "Lachlan Olbrich", rank: 473, points: 8.55, gp: 37 },
  { name: "Ömer Yurtseven", rank: 474, points: 8.51, gp: 9 },
  { name: "Malaki Branham", rank: 475, points: 8.47, gp: 28 },
  { name: "A.J. Lawson", rank: 476, points: 8.46, gp: 24 },
  { name: "Taj Gibson", rank: 477, points: 8.29, gp: 10 },
  { name: "Khaman Maluach", rank: 478, points: 8.28, gp: 46 },
  { name: "Terrence Shannon Jr.", rank: 479, points: 8.27, gp: 43 },
  { name: "Luke Travers", rank: 480, points: 8.15, gp: 12 },
  { name: "Jase Richardson", rank: 481, points: 7.94, gp: 54 },
  { name: "Kelly Olynyk", rank: 482, points: 7.88, gp: 41 },
  { name: "David Jones-Garcia", rank: 483, points: 7.79, gp: 11 },
  { name: "Ariel Hukporti", rank: 484, points: 7.75, gp: 54 },
  { name: "Zyon Pullin", rank: 485, points: 7.72, gp: 5 },
  { name: "Gary Harris", rank: 486, points: 7.71, gp: 48 },
  { name: "Monté Morris", rank: 487, points: 7.44, gp: 6 },
  { name: "Miles Kelly", rank: 488, points: 7.09, gp: 14 },
  { name: "Dalton Knecht", rank: 489, points: 7.08, gp: 54 },
  { name: "Dalano Banton", rank: 490, points: 7.01, gp: 6 },
  { name: "Mason Plumlee", rank: 491, points: 6.94, gp: 20 },
  { name: "Maxi Kleber", rank: 492, points: 6.8, gp: 42 },
  { name: "Mohamed Diawara", rank: 493, points: 6.78, gp: 69 },
  { name: "JD Davison", rank: 494, points: 6.64, gp: 28 },
  { name: "Curtis Jones", rank: 495, points: 6.62, gp: 10 },
  { name: "CJ Huntley", rank: 496, points: 6.21, gp: 4 },
  { name: "Bronny James Jr.", rank: 497, points: 6.2, gp: 42 },
  { name: "Andre Jackson Jr.", rank: 498, points: 6.15, gp: 48 },
  { name: "Amir Coffey", rank: 499, points: 6.14, gp: 46 },
  { name: "DaRon Holmes II", rank: 500, points: 6.13, gp: 25 },
  { name: "AJ Johnson", rank: 501, points: 6.12, gp: 48 },
  { name: "Emanuel Miller", rank: 502, points: 6.12, gp: 5 },
  { name: "Isaiah Livers", rank: 503, points: 6.09, gp: 36 },
  { name: "Riley Minix", rank: 504, points: 6.09, gp: 9 },
  { name: "Drew Timme", rank: 505, points: 6.04, gp: 27 },
  { name: "Duop Reath", rank: 506, points: 5.99, gp: 32 },
  { name: "Cam Christie", rank: 507, points: 5.98, gp: 55 },
  { name: "Jae'Sean Tate", rank: 508, points: 5.92, gp: 46 },
  { name: "Julian Phillips", rank: 509, points: 5.9, gp: 48 },
  { name: "James Wiseman", rank: 510, points: 5.85, gp: 4 },
  { name: "Kevin McCullar Jr.", rank: 511, points: 5.76, gp: 21 },
  { name: "Brooks Barnhizer", rank: 512, points: 5.75, gp: 40 },
  { name: "Koby Brea", rank: 513, points: 5.69, gp: 12 },
  { name: "Chris Livingston", rank: 514, points: 5.55, gp: 3 },
  { name: "Pat Connaughton", rank: 515, points: 5.45, gp: 42 },
  { name: "Hunter Tyson", rank: 516, points: 5.44, gp: 21 },
  { name: "Amari Williams", rank: 517, points: 5.36, gp: 22 },
  { name: "Jamison Battle", rank: 518, points: 5.35, gp: 61 },
  { name: "Jonathan Mogbo", rank: 519, points: 5.34, gp: 40 },
  { name: "Norchad Omier", rank: 520, points: 5.29, gp: 6 },
  { name: "Jordan McLaughlin", rank: 521, points: 5.24, gp: 44 },
  { name: "Kobe Bufkin", rank: 522, points: 5.21, gp: 16 },
  { name: "Wendell Moore Jr.", rank: 523, points: 5.21, gp: 6 },
  { name: "Drew Peterson", rank: 524, points: 5.15, gp: 6 },
  { name: "Orlando Robinson", rank: 525, points: 5.1, gp: 4 },
  { name: "Hunter Dickinson", rank: 526, points: 5.1, gp: 5 },
  { name: "Alijah Martin", rank: 527, points: 5.08, gp: 23 },
  { name: "John Tonje", rank: 528, points: 5.05, gp: 6 },
  { name: "Alex Antetokounmpo", rank: 529, points: 5, gp: 6 },
  { name: "TyTy Washington Jr.", rank: 530, points: 4.93, gp: 16 },
  { name: "Xavier Tillman", rank: 531, points: 4.83, gp: 30 },
  { name: "Chris Mañon", rank: 532, points: 4.82, gp: 9 },
  { name: "Joe Ingles", rank: 533, points: 4.74, gp: 27 },
  { name: "Bobi Klintman", rank: 534, points: 4.62, gp: 12 },
  { name: "Dillon Jones", rank: 535, points: 4.6, gp: 7 },
  { name: "Yang Hansen", rank: 536, points: 4.6, gp: 43 },
  { name: "Chaz Lanier", rank: 537, points: 4.44, gp: 34 },
  { name: "Thanasis Antetokounmpo", rank: 538, points: 4.43, gp: 34 },
  { name: "Adou Thiero", rank: 539, points: 4.42, gp: 25 },
  { name: "Jayson Kent", rank: 540, points: 4.4, gp: 5 },
  { name: "Isaiah Crawford", rank: 541, points: 4.37, gp: 14 },
  { name: "Johni Broome", rank: 542, points: 4.35, gp: 11 },
  { name: "Colin Castleton", rank: 543, points: 4.3, gp: 4 },
  { name: "Lindy Waters III", rank: 544, points: 4.29, gp: 40 },
  { name: "Antonio Reeves", rank: 545, points: 4.26, gp: 10 },
  { name: "Chris Youngblood", rank: 546, points: 4.11, gp: 34 },
  { name: "Jeff Green", rank: 547, points: 4.06, gp: 30 },
  { name: "N'Faly Dante", rank: 548, points: 4.01, gp: 4 },
  { name: "Nigel Hayes", rank: 549, points: 3.86, gp: 23 },
  { name: "Caleb Houstan", rank: 550, points: 3.62, gp: 18 },
  { name: "Pacôme Dadiet", rank: 551, points: 3.53, gp: 29 },
  { name: "Markelle Fultz", rank: 552, points: 3.44, gp: 5 },
  { name: "Johnny Juzang", rank: 553, points: 3.41, gp: 21 },
  { name: "Sean Pedulla", rank: 554, points: 3.28, gp: 7 },
  { name: "Kyle Lowry", rank: 555, points: 3.27, gp: 14 },
  { name: "Stanley Umude", rank: 556, points: 3.25, gp: 2 },
  { name: "Javonte Cooke", rank: 557, points: 3.15, gp: 19 },
  { name: "Jahmir Young", rank: 558, points: 3.06, gp: 14 },
  { name: "Mark Sears", rank: 559, points: 3.01, gp: 7 },
  { name: "Jacob Toppin", rank: 560, points: 2.98, gp: 5 },
  { name: "Trey Jemison III", rank: 561, points: 2.98, gp: 13 },
  { name: "Alex Morales", rank: 562, points: 2.96, gp: 4 },
  { name: "Vladislav Goldin", rank: 563, points: 2.9, gp: 9 },
  { name: "Bismack Biyombo", rank: 564, points: 2.85, gp: 25 },
  { name: "Nigel Hayes-Davis", rank: 565, points: 2.85, gp: 4 },
  { name: "Chucky Hepburn", rank: 566, points: 2.85, gp: 2 },
  { name: "Trentyn Flowers", rank: 567, points: 2.6, gp: 2 },
  { name: "Dario Šaric", rank: 568, points: 2.44, gp: 5 },
  { name: "Isaac Jones", rank: 569, points: 2.44, gp: 7 },
  { name: "Garrett Temple", rank: 570, points: 2.33, gp: 22 },
  { name: "Harrison Ingram", rank: 571, points: 2.08, gp: 7 },
  { name: "Trevor Keels", rank: 572, points: 1.66, gp: 8 },
  { name: "Buddy Boeheim", rank: 573, points: 1.5, gp: 4 },
  { name: "Noa Essengue", rank: 574, points: 1.5, gp: 2 },
  { name: "Max Shulga", rank: 575, points: 1.35, gp: 11 },
  { name: "Hunter Sallis", rank: 576, points: 1.27, gp: 7 },
  { name: "Darius Brown II", rank: 577, points: 1.2, gp: 1 },
  { name: "Jahmyl Telfort", rank: 578, points: 0.88, gp: 8 },
  { name: "Tosan Evbuomwan", rank: 579, points: 0.48, gp: 5 },
];

// Hashtag Basketball POINTS-LEAGUE Dynasty Rankings (Top 460) — updated 02 July 2026
// Format: { name, rank, age, team, pos }
const DYNASTY_DB = [
  { name: "Victor Wembanyama", rank: 1, age: 22.5, team: "SA", pos: "PF,C" },
  { name: "Shai Gilgeous-Alexander", rank: 2, age: 28, team: "OKC", pos: "PG" },
  { name: "Luka Doncic", rank: 3, age: 27.3, team: "LAL", pos: "PG,SG" },
  { name: "Nikola Jokic", rank: 4, age: 31.4, team: "DEN", pos: "C" },
  { name: "Giannis Antetokounmpo", rank: 5, age: 31.6, team: "MIA", pos: "PF,C" },
  { name: "Cade Cunningham", rank: 6, age: 24.8, team: "DET", pos: "PG,SG" },
  { name: "Cooper Flagg", rank: 7, age: 19.5, team: "DAL", pos: "PG,SG,SF" },
  { name: "Tyrese Maxey", rank: 8, age: 25.7, team: "PHI", pos: "PG" },
  { name: "Anthony Edwards", rank: 9, age: 24.9, team: "MIN", pos: "PG,SG" },
  { name: "Scottie Barnes", rank: 10, age: 24.9, team: "TOR", pos: "SG,SF,PF,C" },
  { name: "Alperen Sengün", rank: 11, age: 23.9, team: "HOU", pos: "PF,C" },
  { name: "Jalen Johnson", rank: 12, age: 24.5, team: "ATL", pos: "SF,PF" },
  { name: "Cameron Boozer", rank: 13, age: 19, team: "MEM", pos: "" },
  { name: "Jayson Tatum", rank: 14, age: 28.3, team: "BOS", pos: "SF,PF" },
  { name: "Tyrese Haliburton", rank: 15, age: 26.3, team: "IND", pos: "PG,SG" },
  { name: "Chet Holmgren", rank: 16, age: 24.2, team: "OKC", pos: "PF,C" },
  { name: "Evan Mobley", rank: 17, age: 25, team: "CLE", pos: "PF,C" },
  { name: "Dylan Harper", rank: 18, age: 20.3, team: "SA", pos: "PG,SG" },
  { name: "Darryn Peterson", rank: 19, age: 19.5, team: "UTA", pos: "" },
  { name: "Donovan Mitchell", rank: 20, age: 29.8, team: "CLE", pos: "PG,SG" },
  { name: "Jalen Williams", rank: 21, age: 25.2, team: "OKC", pos: "SF,PF" },
  { name: "Trae Young", rank: 22, age: 27.8, team: "WAS", pos: "PG" },
  { name: "Trey Murphy III", rank: 23, age: 26, team: "NO", pos: "SG,SF,PF" },
  { name: "Amen Thompson", rank: 24, age: 23.4, team: "HOU", pos: "PG,SG,SF" },
  { name: "Austin Reaves", rank: 25, age: 28.1, team: "LAL", pos: "PG,SG,SF" },
  { name: "Devin Booker", rank: 26, age: 29.7, team: "PHO", pos: "PG,SG" },
  { name: "Paolo Banchero", rank: 27, age: 23.6, team: "ORL", pos: "PF,C" },
  { name: "Josh Giddey", rank: 28, age: 23.7, team: "CHI", pos: "PG,SG" },
  { name: "AJ Dybantsa", rank: 29, age: 19.4, team: "WAS", pos: "" },
  { name: "Alexandre Sarr", rank: 30, age: 21.2, team: "WAS", pos: "C" },
  { name: "Deni Avdija", rank: 31, age: 25.5, team: "POR", pos: "SG,SF,PF" },
  { name: "Karl-Anthony Towns", rank: 32, age: 30.6, team: "NY", pos: "PF,C" },
  { name: "Kon Knueppel", rank: 33, age: 20.9, team: "CHA", pos: "SG,SF" },
  { name: "Franz Wagner", rank: 34, age: 24.8, team: "ORL", pos: "SF,PF" },
  { name: "Jamal Murray", rank: 35, age: 29.4, team: "DEN", pos: "PG,SG" },
  { name: "Jalen Duren", rank: 36, age: 22.6, team: "DET", pos: "C" },
  { name: "Jaren Jackson Jr.", rank: 37, age: 26.8, team: "UTA", pos: "PF,C" },
  { name: "Jalen Brunson", rank: 38, age: 29.8, team: "NY", pos: "PG" },
  { name: "LaMelo Ball", rank: 39, age: 24.9, team: "MIN", pos: "PG,SG" },
  { name: "Zion Williamson", rank: 40, age: 26, team: "NO", pos: "SF,PF,C" },
  { name: "Stephon Castle", rank: 41, age: 21.7, team: "SA", pos: "PG,SG" },
  { name: "Donovan Clingan", rank: 42, age: 22.4, team: "POR", pos: "C" },
  { name: "Darius Garland", rank: 43, age: 26.4, team: "LAC", pos: "PG" },
  { name: "Caleb Wilson", rank: 44, age: 20, team: "CHI", pos: "" },
  { name: "Jaylen Brown", rank: 45, age: 29.7, team: "PHI", pos: "SG,SF" },
  { name: "VJ Edgecombe", rank: 46, age: 20.9, team: "PHI", pos: "PG,SG" },
  { name: "Keyonte George", rank: 47, age: 22.7, team: "UTA", pos: "PG,SG" },
  { name: "Bam Adebayo", rank: 48, age: 29, team: "MIA", pos: "PF,C" },
  { name: "Keaton Wagler", rank: 49, age: 19.4, team: "LAC", pos: "" },
  { name: "Anthony Davis", rank: 50, age: 33.3, team: "WAS", pos: "PF,C" },
  { name: "Tyler Herro", rank: 51, age: 26.5, team: "MIL", pos: "PG,SG" },
  { name: "De'Aaron Fox", rank: 52, age: 28.5, team: "SA", pos: "PG,SG" },
  { name: "Mikel Brown Jr.", rank: 53, age: 20.2, team: "BKN", pos: "" },
  { name: "Darius Acuff Jr.", rank: 54, age: 19.6, team: "SAC", pos: "" },
  { name: "James Harden", rank: 55, age: 36.9, team: "CLE", pos: "PG,SG" },
  { name: "Stephen Curry", rank: 56, age: 38.3, team: "GS", pos: "PG" },
  { name: "RJ Barrett", rank: 57, age: 26.1, team: "TOR", pos: "SG,SF,PF" },
  { name: "Domantas Sabonis", rank: 58, age: 30.2, team: "SAC", pos: "PF,C" },
  { name: "Lauri Markkanen", rank: 59, age: 29.1, team: "UTA", pos: "SF,PF" },
  { name: "Matas Buzelis", rank: 60, age: 21.7, team: "CHI", pos: "SF,PF" },
  { name: "Zach Edey", rank: 61, age: 24.1, team: "MEM", pos: "C" },
  { name: "Onyeka Okongwu", rank: 62, age: 25.6, team: "ATL", pos: "PF,C" },
  { name: "Brandon Miller", rank: 63, age: 23.6, team: "CHA", pos: "SF,PF" },
  { name: "Pascal Siakam", rank: 64, age: 32.3, team: "IND", pos: "SF,PF,C" },
  { name: "Ivica Zubac", rank: 65, age: 29.3, team: "IND", pos: "C" },
  { name: "Desmond Bane", rank: 66, age: 28, team: "ORL", pos: "SG,SF" },
  { name: "Kel'el Ware", rank: 67, age: 22.2, team: "MIL", pos: "PF,C" },
  { name: "OG Anunoby", rank: 68, age: 29, team: "NY", pos: "SF,PF" },
  { name: "Michael Porter Jr.", rank: 69, age: 28, team: "BKN", pos: "SF,PF" },
  { name: "Keegan Murray", rank: 70, age: 25.9, team: "SAC", pos: "SF,PF" },
  { name: "Jalen Green", rank: 71, age: 24.4, team: "PHO", pos: "PG,SG,SF" },
  { name: "Ja Morant", rank: 72, age: 26.9, team: "POR", pos: "PG" },
  { name: "Julius Randle", rank: 73, age: 31.6, team: "BKN", pos: "PF,C" },
  { name: "Fred VanVleet", rank: 74, age: 32.4, team: "HOU", pos: "PG" },
  { name: "Scoot Henderson", rank: 75, age: 22.4, team: "POR", pos: "PG" },
  { name: "Derrick White", rank: 76, age: 32, team: "BOS", pos: "PG,SG" },
  { name: "Naz Reid", rank: 77, age: 26.9, team: "CHA", pos: "PF,C" },
  { name: "Walker Kessler", rank: 78, age: 24.9, team: "LAL", pos: "C" },
  { name: "Nickeil Alexander-Walker", rank: 79, age: 27.8, team: "ATL", pos: "PG,SG,SF" },
  { name: "Kevin Durant", rank: 80, age: 37.8, team: "HOU", pos: "SG,SF,PF" },
  { name: "Jaden McDaniels", rank: 81, age: 25.8, team: "MIN", pos: "SF,PF" },
  { name: "Brandon Ingram", rank: 82, age: 28.8, team: "LAC", pos: "SG,SF,PF" },
  { name: "Derik Queen", rank: 83, age: 21.5, team: "NO", pos: "PF,C" },
  { name: "Kingston Flemings", rank: 84, age: 19.5, team: "ATL", pos: "" },
  { name: "Brayden Burries", rank: 85, age: 20.8, team: "MIL", pos: "" },
  { name: "Collin Murray-Boyles", rank: 86, age: 21.1, team: "TOR", pos: "PF,C" },
  { name: "Reed Sheppard", rank: 87, age: 22, team: "HOU", pos: "PG,SG" },
  { name: "Immanuel Quickley", rank: 88, age: 27, team: "TOR", pos: "PG,SG" },
  { name: "Mikal Bridges", rank: 89, age: 29.8, team: "NY", pos: "SG,SF,PF" },
  { name: "Isaiah Hartenstein", rank: 90, age: 28.2, team: "OKC", pos: "C" },
  { name: "Ajay Mitchell", rank: 91, age: 24, team: "OKC", pos: "PG,SG" },
  { name: "Jalen Suggs", rank: 92, age: 25.1, team: "ORL", pos: "PG,SG" },
  { name: "Anthony Black", rank: 93, age: 22.5, team: "ORL", pos: "PG,SG,SF" },
  { name: "Kyshawn George", rank: 94, age: 22.6, team: "WAS", pos: "SG,SF,PF" },
  { name: "Kyrie Irving", rank: 95, age: 34.3, team: "DAL", pos: "PG" },
  { name: "Jabari Smith Jr.", rank: 96, age: 23.1, team: "HOU", pos: "SF,PF,C" },
  { name: "Mark Williams", rank: 97, age: 24.5, team: "PHO", pos: "C" },
  { name: "Nicolas Claxton", rank: 98, age: 27.2, team: "CHI", pos: "C" },
  { name: "Dejounte Murray", rank: 99, age: 29.8, team: "NO", pos: "PG,SG" },
  { name: "Joel Embiid", rank: 100, age: 32.3, team: "PHI", pos: "C" },
  { name: "Dyson Daniels", rank: 101, age: 23.3, team: "ATL", pos: "PG,SG,SF" },
  { name: "Norman Powell", rank: 102, age: 33.1, team: "MIA", pos: "SG,SF" },
  { name: "Deandre Ayton", rank: 103, age: 27.9, team: "LAL", pos: "C" },
  { name: "Myles Turner", rank: 104, age: 30.3, team: "MIL", pos: "C" },
  { name: "Ace Bailey", rank: 105, age: 19.9, team: "UTA", pos: "SG,SF,PF" },
  { name: "Jeremiah Fears", rank: 106, age: 19.7, team: "NO", pos: "PG,SG" },
  { name: "Kawhi Leonard", rank: 107, age: 35, team: "TOR", pos: "SF,PF" },
  { name: "Morez Johnson Jr.", rank: 108, age: 20.4, team: "DAL", pos: "" },
  { name: "Jarrett Allen", rank: 109, age: 28.2, team: "CLE", pos: "C" },
  { name: "Kristaps Porzingis", rank: 110, age: 30.9, team: "GS", pos: "PF,C" },
  { name: "Rudy Gobert", rank: 111, age: 34, team: "MIN", pos: "C" },
  { name: "Zach LaVine", rank: 112, age: 31.3, team: "SAC", pos: "PG,SG,SF" },
  { name: "Coby White", rank: 113, age: 26.4, team: "CHA", pos: "PG,SG" },
  { name: "Peyton Watson", rank: 114, age: 23.8, team: "DEN", pos: "SF,PF" },
  { name: "Brandin Podziemski", rank: 115, age: 23.4, team: "GS", pos: "PG,SG" },
  { name: "Cedric Coward", rank: 116, age: 22.8, team: "MEM", pos: "SG,SF" },
  { name: "Jaime Jaquez Jr.", rank: 117, age: 25.4, team: "MIL", pos: "SG,SF,PF" },
  { name: "Hannes Steinbach", rank: 118, age: 20.2, team: "CHA", pos: "" },
  { name: "Ryan Kalkbrenner", rank: 119, age: 24.5, team: "CHA", pos: "C" },
  { name: "Shaedon Sharpe", rank: 120, age: 23.1, team: "POR", pos: "PG,SG,SF" },
  { name: "Devin Vassell", rank: 121, age: 25.9, team: "SA", pos: "SG,SF" },
  { name: "Ryan Rollins", rank: 122, age: 24, team: "MIL", pos: "PG,SG" },
  { name: "Ausar Thompson", rank: 123, age: 23.4, team: "DET", pos: "SG,SF,PF" },
  { name: "Toumani Camara", rank: 124, age: 26.2, team: "POR", pos: "SF,PF,C" },
  { name: "Paul George", rank: 125, age: 36.2, team: "BOS", pos: "SG,SF,PF" },
  { name: "Miles Bridges", rank: 126, age: 28.3, team: "PHO", pos: "SF,PF" },
  { name: "Yaxel Lendeborg", rank: 127, age: 23.8, team: "GS", pos: "" },
  { name: "Christian Braun", rank: 128, age: 25.2, team: "DEN", pos: "SG,SF,PF" },
  { name: "Payton Pritchard", rank: 129, age: 28.4, team: "BOS", pos: "PG" },
  { name: "Josh Hart", rank: 130, age: 31.3, team: "NY", pos: "SG,SF,PF" },
  { name: "Maxime Raynaud", rank: 131, age: 23.2, team: "SAC", pos: "C" },
  { name: "LeBron James", rank: 132, age: 41.5, team: "LAL", pos: "SF,PF" },
  { name: "Cason Wallace", rank: 133, age: 22.7, team: "OKC", pos: "PG,SG,SF" },
  { name: "Tre Johnson", rank: 134, age: 20.3, team: "WAS", pos: "PG,SG,SF" },
  { name: "Jakob Poeltl", rank: 135, age: 30.7, team: "TOR", pos: "C" },
  { name: "Dailyn Swain", rank: 136, age: 21, team: "CHI", pos: "" },
  { name: "Allen Graves", rank: 137, age: 19.9, team: "TOR", pos: "" },
  { name: "Bilal Coulibaly", rank: 138, age: 21.9, team: "WAS", pos: "SG,SF" },
  { name: "Nate Ament", rank: 139, age: 19.6, team: "MIL", pos: "" },
  { name: "Moussa Diabaté", rank: 140, age: 24.4, team: "CHA", pos: "C" },
  { name: "Day'Ron Sharpe", rank: 141, age: 24.7, team: "BKN", pos: "C" },
  { name: "Dereck Lively II", rank: 142, age: 22.4, team: "DAL", pos: "C" },
  { name: "Andrew Nembhard", rank: 143, age: 26.5, team: "IND", pos: "PG,SG" },
  { name: "Santi Aldama", rank: 144, age: 25.5, team: "DAL", pos: "PF,C" },
  { name: "Wendell Carter Jr.", rank: 145, age: 27.2, team: "ORL", pos: "C" },
  { name: "Collin Gillespie", rank: 146, age: 27, team: "PHO", pos: "PG,SG" },
  { name: "Tari Eason", rank: 147, age: 25.1, team: "HOU", pos: "SG,SF,PF" },
  { name: "Cameron Johnson", rank: 148, age: 30.3, team: "DEN", pos: "SG,SF,PF" },
  { name: "DeMar DeRozan", rank: 149, age: 36.9, team: "SAC", pos: "SF,PF" },
  { name: "Jaylen Wells", rank: 150, age: 22.9, team: "MEM", pos: "SG,SF" },
  { name: "Ayo Dosunmu", rank: 151, age: 26.5, team: "MIN", pos: "PG,SG,SF" },
  { name: "CJ McCollum", rank: 152, age: 34.8, team: "ATL", pos: "PG,SG" },
  { name: "Jimmy Butler", rank: 153, age: 36.8, team: "GS", pos: "SG,SF,PF" },
  { name: "Khaman Maluach", rank: 154, age: 19.8, team: "PHO", pos: "C" },
  { name: "Anfernee Simons", rank: 155, age: 27.1, team: "CHI", pos: "PG,SG" },
  { name: "Aaron Nesmith", rank: 156, age: 26.7, team: "IND", pos: "SG,SF" },
  { name: "Isaiah Stewart", rank: 157, age: 25.1, team: "MEM", pos: "PF,C" },
  { name: "Yanic Konan Niederhauser", rank: 158, age: 23.3, team: "LAC", pos: "C" },
  { name: "Herbert Jones", rank: 159, age: 27.7, team: "NO", pos: "SG,SF,PF" },
  { name: "P.J. Washington", rank: 160, age: 27.9, team: "DAL", pos: "SF,PF,C" },
  { name: "Bennedict Mathurin", rank: 161, age: 24, team: "LAC", pos: "SG,SF" },
  { name: "Egor Demin", rank: 162, age: 20.3, team: "BKN", pos: "PG,SG" },
  { name: "Robert Williams III", rank: 163, age: 28.7, team: "POR", pos: "C" },
  { name: "Kevin Porter Jr.", rank: 164, age: 26.2, team: "MIL", pos: "PG,SG" },
  { name: "Jaylon Tyson", rank: 165, age: 23.6, team: "CLE", pos: "SG,SF" },
  { name: "Zaccharie Risacher", rank: 166, age: 21.2, team: "ATL", pos: "SF,PF" },
  { name: "Aaron Gordon", rank: 167, age: 30.8, team: "DEN", pos: "PF,C" },
  { name: "Daniss Jenkins", rank: 168, age: 24.9, team: "DET", pos: "PG,SG" },
  { name: "Davion Mitchell", rank: 169, age: 27.8, team: "MIA", pos: "PG" },
  { name: "Damian Lillard", rank: 170, age: 36, team: "POR", pos: "PG" },
  { name: "Dillon Brooks", rank: 171, age: 30.4, team: "PHO", pos: "SF,PF" },
  { name: "Daniel Gafford", rank: 172, age: 27.8, team: "DAL", pos: "C" },
  { name: "Aday Mara", rank: 173, age: 21.2, team: "OKC", pos: "" },
  { name: "Grayson Allen", rank: 174, age: 30.7, team: "CHA", pos: "PG,SG,SF" },
  { name: "Ebuka Okorie", rank: 175, age: 19.2, team: "DET", pos: "" },
  { name: "Christian Anderson", rank: 176, age: 20.3, team: "CHA", pos: "" },
  { name: "Joshua Jefferson", rank: 177, age: 22.6, team: "BKN", pos: "" },
  { name: "Labaron Philon Jr.", rank: 178, age: 20.6, team: "PHI", pos: "" },
  { name: "Noah Clowney", rank: 179, age: 22, team: "BKN", pos: "PF,C" },
  { name: "Terrence Shannon Jr.", rank: 180, age: 25.9, team: "MIN", pos: "SF,PF" },
  { name: "Malik Monk", rank: 181, age: 28.4, team: "SAC", pos: "PG,SG" },
  { name: "Jonathan Kuminga", rank: 182, age: 23.7, team: "ATL", pos: "SF,PF" },
  { name: "Leonard Miller", rank: 183, age: 22.6, team: "CHI", pos: "SF,PF" },
  { name: "Jarace Walker", rank: 184, age: 22.8, team: "IND", pos: "SF,PF" },
  { name: "John Collins", rank: 185, age: 28.8, team: "LAC", pos: "PF,C" },
  { name: "Jordan Poole", rank: 186, age: 27, team: "NO", pos: "PG,SG" },
  { name: "Kyle Filipowski", rank: 187, age: 22.7, team: "UTA", pos: "PF,C" },
  { name: "Oso Ighodaro", rank: 188, age: 24, team: "PHO", pos: "C" },
  { name: "Gui Santos", rank: 189, age: 24, team: "GS", pos: "SF,PF" },
  { name: "Isaiah Collier", rank: 190, age: 21.7, team: "UTA", pos: "PG,SG" },
  { name: "Will Riley", rank: 191, age: 20.4, team: "WAS", pos: "SF,PF" },
  { name: "Rui Hachimura", rank: 192, age: 28.4, team: "LAL", pos: "SF,PF" },
  { name: "Jared McCain", rank: 193, age: 22.4, team: "OKC", pos: "PG,SG" },
  { name: "Carlton Carrington", rank: 194, age: 21, team: "WAS", pos: "PG,SG" },
  { name: "Ousmane Dieng", rank: 195, age: 23.1, team: "MIL", pos: "SF,PF,C" },
  { name: "Max Christie", rank: 196, age: 23.4, team: "DAL", pos: "SG,SF" },
  { name: "Nikola Vucevic", rank: 197, age: 35.7, team: "ORL", pos: "C" },
  { name: "Donte DiVincenzo", rank: 198, age: 29.4, team: "MIN", pos: "PG,SG" },
  { name: "Caris LeVert", rank: 199, age: 31.9, team: "DET", pos: "SG,SF" },
  { name: "Max Strus", rank: 200, age: 30.3, team: "CLE", pos: "SG,SF" },
  { name: "Cam Spencer", rank: 201, age: 26.2, team: "MEM", pos: "PG,SG" },
  { name: "Nique Clifford", rank: 202, age: 24.4, team: "SAC", pos: "SG,SF" },
  { name: "Jalen Smith", rank: 203, age: 26.3, team: "CHI", pos: "PF,C" },
  { name: "Collin Sexton", rank: 204, age: 27.5, team: "CHI", pos: "PG,SG" },
  { name: "Carter Bryant", rank: 205, age: 20.6, team: "SA", pos: "SF" },
  { name: "Rasheer Fleming", rank: 206, age: 22, team: "PHO", pos: "PF" },
  { name: "Joan Beringer", rank: 207, age: 19.6, team: "MIN", pos: "C" },
  { name: "Nikola Jovic", rank: 208, age: 23.1, team: "MIA", pos: "PF,C" },
  { name: "Ron Holland II", rank: 209, age: 21, team: "DET", pos: "SF,PF" },
  { name: "Cam Whitmore", rank: 210, age: 22, team: "WAS", pos: "SF,PF" },
  { name: "GG Jackson II", rank: 211, age: 21.5, team: "MEM", pos: "SF,PF,C" },
  { name: "Kasparas Jakucionis", rank: 212, age: 20.1, team: "MIL", pos: "PG" },
  { name: "Mitchell Robinson", rank: 213, age: 28.3, team: "NY", pos: "C" },
  { name: "Keon Ellis", rank: 214, age: 26.5, team: "CLE", pos: "PG,SG" },
  { name: "Jerami Grant", rank: 215, age: 32.3, team: "MEM", pos: "SF,PF" },
  { name: "Obi Toppin", rank: 216, age: 28.3, team: "IND", pos: "PF" },
  { name: "Cameron Carr", rank: 217, age: 21.6, team: "LAL", pos: "" },
  { name: "Dylan Cardwell", rank: 218, age: 24.5, team: "SAC", pos: "PF,C" },
  { name: "Neemias Queta", rank: 219, age: 27, team: "BOS", pos: "PF,C" },
  { name: "Zuby Ejiofor", rank: 220, age: 22.2, team: "ATL", pos: "" },
  { name: "Karim Lopez", rank: 221, age: 19.2, team: "MEM", pos: "" },
  { name: "Jayden Quaintance", rank: 222, age: 19, team: "SA", pos: "" },
  { name: "Jay Huff", rank: 223, age: 28.9, team: "IND", pos: "C" },
  { name: "Jamal Shead", rank: 224, age: 23.9, team: "TOR", pos: "PG" },
  { name: "Dru Smith", rank: 225, age: 28.5, team: "MIA", pos: "PG,SG" },
  { name: "Isaiah Jackson", rank: 226, age: 24.5, team: "LAC", pos: "C" },
  { name: "Drake Powell", rank: 227, age: 20.8, team: "BKN", pos: "SG" },
  { name: "Thomas Sorber", rank: 228, age: 20.5, team: "OKC", pos: "C" },
  { name: "Brice Sensabaugh", rank: 229, age: 22.7, team: "UTA", pos: "SG,SF,PF" },
  { name: "Saddiq Bey", rank: 230, age: 27.2, team: "NO", pos: "SF,PF" },
  { name: "De'Anthony Melton", rank: 231, age: 28.1, team: "GS", pos: "PG,SG" },
  { name: "Jrue Holiday", rank: 232, age: 36.1, team: "POR", pos: "PG,SG" },
  { name: "Taylor Hendricks", rank: 233, age: 22.6, team: "MEM", pos: "SF,PF,C" },
  { name: "Naji Marshall", rank: 234, age: 28.4, team: "DAL", pos: "SG,SF,PF" },
  { name: "Tobias Harris", rank: 235, age: 34, team: "DET", pos: "PF" },
  { name: "Yang Hansen", rank: 236, age: 21, team: "POR", pos: "C" },
  { name: "Jusuf Nurkic", rank: 237, age: 31.9, team: "UTA", pos: "C" },
  { name: "Kelly Oubre Jr.", rank: 238, age: 30.6, team: "PHI", pos: "SF,PF" },
  { name: "Quentin Grimes", rank: 239, age: 26.2, team: "PHI", pos: "SG,SF" },
  { name: "Alex Karaban", rank: 240, age: 23.6, team: "SAC", pos: "" },
  { name: "Ryan Conwell", rank: 241, age: 22, team: "MIA", pos: "" },
  { name: "Sergio de Larrea", rank: 242, age: 20.6, team: "DAL", pos: "" },
  { name: "Andrew Wiggins", rank: 243, age: 31.4, team: "MIA", pos: "SG,SF,PF" },
  { name: "Draymond Green", rank: 244, age: 36.3, team: "GS", pos: "PF,C" },
  { name: "Jaylin Williams", rank: 245, age: 24, team: "OKC", pos: "PF,C" },
  { name: "Henri Veesaar", rank: 246, age: 22.3, team: "ATL", pos: "" },
  { name: "Baba Miller", rank: 247, age: 22.4, team: "LAC", pos: "" },
  { name: "Richie Saunders", rank: 248, age: 24.8, team: "MEM", pos: "" },
  { name: "Jaron Pierre Jr.", rank: 249, age: 24, team: "NO", pos: "" },
  { name: "Tyler Bilodeau", rank: 250, age: 22.2, team: "BKN", pos: "" },
  { name: "Ryan Dunn", rank: 251, age: 23.5, team: "PHO", pos: "SF,PF" },
  { name: "Miles McBride", rank: 252, age: 25.8, team: "NY", pos: "PG,SG" },
  { name: "Danny Wolf", rank: 253, age: 22.2, team: "BKN", pos: "PF,C" },
  { name: "Cody Williams", rank: 254, age: 21.6, team: "UTA", pos: "SG,SF" },
  { name: "Josh Minott", rank: 255, age: 23.6, team: "BKN", pos: "SF,PF" },
  { name: "Justin Champagnie", rank: 256, age: 25, team: "WAS", pos: "SF,PF" },
  { name: "Luke Kornet", rank: 257, age: 31, team: "SA", pos: "C" },
  { name: "Nolan Traoré", rank: 258, age: 20.1, team: "BKN", pos: "PG" },
  { name: "Noa Essengue", rank: 259, age: 19.5, team: "CHI", pos: "PF" },
  { name: "Yves Missi", rank: 260, age: 22.1, team: "NO", pos: "C" },
  { name: "Pelle Larsson", rank: 261, age: 25.4, team: "MIA", pos: "SG,SF" },
  { name: "Julian Champagnie", rank: 262, age: 25, team: "SA", pos: "SG,SF" },
  { name: "Keldon Johnson", rank: 263, age: 26.7, team: "SA", pos: "SF,PF" },
  { name: "Sandro Mamukelashvili", rank: 264, age: 27.1, team: "TOR", pos: "PF,C" },
  { name: "Emanuel Sharp", rank: 265, age: 22.3, team: "SAC", pos: "" },
  { name: "Tarris Reed Jr.", rank: 266, age: 22.9, team: "SA", pos: "" },
  { name: "Isaiah Evans", rank: 267, age: 20.6, team: "MIN", pos: "" },
  { name: "Kobe Sanders", rank: 268, age: 24.1, team: "LAC", pos: "SG,SF" },
  { name: "Devin Carter", rank: 269, age: 24.3, team: "ATL", pos: "PG,SG" },
  { name: "Trevon Brazile", rank: 270, age: 23.5, team: "DEN", pos: "" },
  { name: "Izaiyah Nelson", rank: 271, age: 22.8, team: "ORL", pos: "" },
  { name: "Koa Peat", rank: 272, age: 19.4, team: "PHO", pos: "" },
  { name: "Bruce Thornton", rank: 273, age: 22.8, team: "HOU", pos: "" },
  { name: "D'Angelo Russell", rank: 274, age: 30.4, team: "WAS", pos: "PG" },
  { name: "Bradley Beal", rank: 275, age: 33, team: "LAC", pos: "SG,SF" },
  { name: "Goga Bitadze", rank: 276, age: 27, team: "ORL", pos: "C" },
  { name: "Gradey Dick", rank: 277, age: 22.6, team: "LAC", pos: "SG,SF" },
  { name: "Jordan Walsh", rank: 278, age: 22.3, team: "BOS", pos: "SG,SF,PF" },
  { name: "Luke Kennard", rank: 279, age: 30, team: "LAL", pos: "PG,SG" },
  { name: "Ty Jerome", rank: 280, age: 29, team: "MEM", pos: "PG,SG" },
  { name: "Jordan Miller", rank: 281, age: 26.4, team: "LAC", pos: "SG,SF" },
  { name: "Brandon Williams", rank: 282, age: 26.6, team: "DAL", pos: "PG" },
  { name: "Bennett Stirtz", rank: 283, age: 22.7, team: "OKC", pos: "" },
  { name: "Chris Cenac Jr.", rank: 284, age: 19.4, team: "BOS", pos: "" },
  { name: "Malique Lewis", rank: 285, age: 21.6, team: "MIL", pos: "" },
  { name: "Felix Okpara", rank: 286, age: 22.2, team: "WAS", pos: "" },
  { name: "Tobi Lawal", rank: 287, age: 23.2, team: "DAL", pos: "" },
  { name: "Vsevolod Ishchenko", rank: 288, age: 21.4, team: "DAL", pos: "" },
  { name: "Michael Ajayi", rank: 289, age: 23.1, team: "CHA", pos: "" },
  { name: "Jake LaRavia", rank: 290, age: 24.7, team: "LAL", pos: "SF,PF" },
  { name: "Moussa Cisse", rank: 291, age: 24.0, team: "", pos: "" },
  { name: "Aaron Wiggins", rank: 292, age: 27.5, team: "ATL", pos: "SG,SF" },
  { name: "Ryan Nembhard", rank: 293, age: 23.3, team: "DAL", pos: "PG" },
  { name: "Sion James", rank: 294, age: 23.6, team: "CHA", pos: "SG,SF" },
  { name: "Walter Clayton Jr.", rank: 295, age: 23.3, team: "MEM", pos: "PG,SG" },
  { name: "De'Andre Hunter", rank: 296, age: 28.6, team: "SAC", pos: "SF,PF" },
  { name: "Kyle Kuzma", rank: 297, age: 30.9, team: "MIL", pos: "SF,PF" },
  { name: "Gary Trent Jr.", rank: 298, age: 27.5, team: "MIL", pos: "SG,SF" },
  { name: "Luguentz Dort", rank: 299, age: 27.2, team: "OKC", pos: "SG,SF" },
  { name: "Russell Westbrook", rank: 300, age: 37.6, team: "SAC", pos: "PG,SG" },
  { name: "Scotty Pippen Jr.", rank: 301, age: 25.6, team: "MEM", pos: "PG,SG" },
  { name: "Bobby Portis", rank: 302, age: 31.4, team: "MIA", pos: "PF,C" },
  { name: "Adem Bona", rank: 303, age: 23.3, team: "PHI", pos: "C" },
  { name: "Moses Moody", rank: 304, age: 24.1, team: "GS", pos: "SG,SF,PF" },
  { name: "Cole Anthony", rank: 305, age: 26.1, team: "PHO", pos: "PG" },
  { name: "Pat Spencer", rank: 306, age: 30, team: "GS", pos: "PG,SG" },
  { name: "Tristan Da Silva", rank: 307, age: 25.1, team: "ORL", pos: "SF,PF" },
  { name: "Derrick Jones Jr.", rank: 308, age: 29.4, team: "LAC", pos: "SF,PF" },
  { name: "Bones Hyland", rank: 309, age: 25.8, team: "MIN", pos: "PG,SG" },
  { name: "Grant Williams", rank: 310, age: 27.6, team: "CHA", pos: "PF,C" },
  { name: "Andre Drummond", rank: 311, age: 32.9, team: "PHI", pos: "C" },
  { name: "Dennis Schröder", rank: 312, age: 32.8, team: "CLE", pos: "PG,SG" },
  { name: "Duncan Robinson", rank: 313, age: 32.2, team: "DET", pos: "SG,SF" },
  { name: "Spencer Jones", rank: 314, age: 25.1, team: "DEN", pos: "SG,SF" },
  { name: "Cam Thomas", rank: 315, age: 24.7, team: "MIL", pos: "SG,SF" },
  { name: "Marcus Smart", rank: 316, age: 32.3, team: "LAL", pos: "PG,SG" },
  { name: "Paul Reed", rank: 317, age: 27.1, team: "DET", pos: "PF,C" },
  { name: "Julian Strawther", rank: 318, age: 24.2, team: "DEN", pos: "SG,SF" },
  { name: "Rob Dillingham", rank: 319, age: 21.5, team: "CHI", pos: "PG" },
  { name: "Zach Collins", rank: 320, age: 28.6, team: "CHI", pos: "C" },
  { name: "Johnny Furphy", rank: 321, age: 21.6, team: "IND", pos: "SG,SF" },
  { name: "Quinten Post", rank: 322, age: 26.3, team: "GS", pos: "C" },
  { name: "Marcus Sasser", rank: 323, age: 25.8, team: "DET", pos: "PG" },
  { name: "Alex Caruso", rank: 324, age: 32.3, team: "OKC", pos: "SG,SF" },
  { name: "Precious Achiuwa", rank: 325, age: 26.8, team: "SAC", pos: "PF,C" },
  { name: "Cameron Payne", rank: 326, age: 31.9, team: "PHI", pos: "PG,SG" },
  { name: "Isaiah Joe", rank: 327, age: 27, team: "DET", pos: "SG,SF" },
  { name: "Hugo González", rank: 328, age: 20.4, team: "BOS", pos: "SF" },
  { name: "Killian Hayes", rank: 329, age: 24.9, team: "SAC", pos: "PG" },
  { name: "Caleb Love", rank: 330, age: 24.8, team: "POR", pos: "PG,SG" },
  { name: "Khris Middleton", rank: 331, age: 34.9, team: "DAL", pos: "SF,PF" },
  { name: "Jeremy Sochan", rank: 332, age: 23.1, team: "NY", pos: "PF,C" },
  { name: "DaRon Holmes II", rank: 333, age: 23.9, team: "DEN", pos: "PF,C" },
  { name: "Nikola Topic", rank: 334, age: 20.9, team: "OKC", pos: "PG" },
  { name: "Vince Williams Jr.", rank: 335, age: 25.8, team: "UTA", pos: "PG,SG,SF" },
  { name: "Jose Alvarado", rank: 336, age: 28.2, team: "NY", pos: "PG" },
  { name: "Nae'Qwan Tomlin", rank: 337, age: 25.6, team: "CLE", pos: "PF" },
  { name: "Ben Sheppard", rank: 338, age: 25, team: "IND", pos: "SG,SF" },
  { name: "Sam Merrill", rank: 339, age: 30.1, team: "CLE", pos: "SG,SF" },
  { name: "Brook Lopez", rank: 340, age: 38.3, team: "LAC", pos: "C" },
  { name: "Steven Adams", rank: 341, age: 33, team: "HOU", pos: "C" },
  { name: "Karlo Matkovic", rank: 342, age: 25.3, team: "NO", pos: "PF,C" },
  { name: "Jaxson Hayes", rank: 343, age: 26.1, team: "LAL", pos: "C" },
  { name: "Jase Richardson", rank: 344, age: 20.7, team: "ORL", pos: "SG" },
  { name: "Klay Thompson", rank: 345, age: 36.4, team: "DAL", pos: "SG,SF" },
  { name: "Kevin Huerter", rank: 346, age: 27.8, team: "DET", pos: "SG,SF" },
  { name: "Ziaire Williams", rank: 347, age: 24.8, team: "BKN", pos: "SG,SF" },
  { name: "Dean Wade", rank: 348, age: 29.6, team: "CLE", pos: "SF,PF" },
  { name: "Royce O'Neale", rank: 349, age: 33.1, team: "CHA", pos: "SF,PF" },
  { name: "Landry Shamet", rank: 350, age: 29.3, team: "NY", pos: "SG,SF" },
  { name: "Jordan Goodwin", rank: 351, age: 27.7, team: "PHO", pos: "PG,SG,SF" },
  { name: "Isaac Okoro", rank: 352, age: 25.4, team: "CHI", pos: "SF,PF" },
  { name: "Bronny James", rank: 353, age: 21.7, team: "LAL", pos: "PG,SG" },
  { name: "Moritz Wagner", rank: 354, age: 29.2, team: "ORL", pos: "C" },
  { name: "Kris Dunn", rank: 355, age: 32.3, team: "LAC", pos: "PG,SG" },
  { name: "Meleek Thomas", rank: 356, age: 19.9, team: "CLE", pos: "" },
  { name: "Dillon Mitchell", rank: 357, age: 22.7, team: "BOS", pos: "" },
  { name: "Nick Boyd", rank: 358, age: 25.2, team: "GS", pos: "" },
  { name: "Tyler Nickel", rank: 359, age: 22.8, team: "NY", pos: "" },
  { name: "Jack Kayil", rank: 360, age: 20.4, team: "NY", pos: "" },
  { name: "Aaron Nkrumah", rank: 361, age: 24.6, team: "DEN", pos: "" },
  { name: "Tyler Kolek", rank: 362, age: 25.3, team: "NY", pos: "PG" },
  { name: "Tyus Jones", rank: 363, age: 30.1, team: "DEN", pos: "PG" },
  { name: "Bruce Brown", rank: 364, age: 29.9, team: "DEN", pos: "PG,SG" },
  { name: "Lonzo Ball", rank: 365, age: 28.7, team: "UTA", pos: "PG,SG" },
  { name: "Tre Jones", rank: 366, age: 26.5, team: "CHI", pos: "PG,SG" },
  { name: "Micah Peavy", rank: 367, age: 24.9, team: "NO", pos: "SG,SF" },
  { name: "AJ Green", rank: 368, age: 26.8, team: "MIL", pos: "PG,SG,SF" },
  { name: "RayJ Dennis", rank: 369, age: 25.3, team: "ATL", pos: "PG" },
  { name: "Guerschon Yabusele", rank: 370, age: 30.5, team: "CHI", pos: "PF,C" },
  { name: "T.J. McConnell", rank: 371, age: 34.3, team: "IND", pos: "PG" },
  { name: "Patrick Williams", rank: 372, age: 24.9, team: "CHI", pos: "PF" },
  { name: "Dominick Barlow", rank: 373, age: 23.1, team: "PHI", pos: "PF,C" },
  { name: "Tyrese Martin", rank: 374, age: 27.3, team: "PHI", pos: "PG,SG,SF" },
  { name: "Javon Small", rank: 375, age: 23.5, team: "MEM", pos: "PG,SG" },
  { name: "Will Richard", rank: 376, age: 23.5, team: "GS", pos: "SG,SF" },
  { name: "Corey Kispert", rank: 377, age: 27.3, team: "ATL", pos: "SF,PF" },
  { name: "Jaden Hardy", rank: 378, age: 24, team: "WAS", pos: "PG,SG" },
  { name: "Ben Saraf", rank: 379, age: 20.2, team: "BKN", pos: "SG" },
  { name: "Sam Hauser", rank: 380, age: 28.6, team: "BOS", pos: "SF,PF" },
  { name: "Buddy Hield", rank: 381, age: 33.5, team: "ATL", pos: "SG,SF" },
  { name: "Tre Mann", rank: 382, age: 25.4, team: "CHA", pos: "PG,SG" },
  { name: "Vít Krejcí", rank: 383, age: 26, team: "POR", pos: "SG,SF" },
  { name: "Tim Hardaway Jr.", rank: 384, age: 34.3, team: "DEN", pos: "SG,SF" },
  { name: "Haywood Highsmith", rank: 385, age: 29.6, team: "PHO", pos: "SF,PF" },
  { name: "Dalton Knecht", rank: 386, age: 25.2, team: "LAL", pos: "SG,SF" },
  { name: "Mouhamed Gueye", rank: 387, age: 23.6, team: "ATL", pos: "PF,C" },
  { name: "Trendon Watford", rank: 388, age: 25.6, team: "PHI", pos: "PF,C" },
  { name: "Jonathan Isaac", rank: 389, age: 28.7, team: "ORL", pos: "SF,PF" },
  { name: "Jordan Hawkins", rank: 390, age: 24.2, team: "NO", pos: "SG,SF" },
  { name: "Asa Newell", rank: 391, age: 20.7, team: "ATL", pos: "PF" },
  { name: "Jordan Clarkson", rank: 392, age: 34.1, team: "NY", pos: "PG,SG" },
  { name: "Dariq Whitehead", rank: 393, age: 21.9, team: "MEM", pos: "SG,SF" },
  { name: "Olivier-Maxence Prosper", rank: 394, age: 24, team: "MEM", pos: "PF,C" },
  { name: "Jock Landale", rank: 395, age: 30.7, team: "ATL", pos: "C" },
  { name: "Tristan Vukcevic", rank: 396, age: 23.3, team: "WAS", pos: "PF,C" },
  { name: "Kris Murray", rank: 397, age: 25.9, team: "MEM", pos: "SF,PF" },
  { name: "Luka Garza", rank: 398, age: 27.5, team: "BOS", pos: "C" },
  { name: "Trayce Jackson-Davis", rank: 399, age: 26.4, team: "TOR", pos: "C" },
  { name: "Josh Green", rank: 400, age: 25.6, team: "MIN", pos: "SG,SF" },
  { name: "Noah Penda", rank: 401, age: 21.5, team: "ORL", pos: "SF" },
  { name: "Chaz Lanier", rank: 402, age: 24.5, team: "DET", pos: "SG" },
  { name: "Liam McNeeley", rank: 403, age: 20.7, team: "CHA", pos: "SF" },
  { name: "Thomas Bryant", rank: 404, age: 28.9, team: "CLE", pos: "C" },
  { name: "Ben Simmons", rank: 405, age: 30, team: "LAC", pos: "PG,C" },
  { name: "Jonathan Mogbo", rank: 406, age: 24.7, team: "TOR", pos: "PF,C" },
  { name: "Bogdan Bogdanovic", rank: 407, age: 33.9, team: "LAC", pos: "SG,SF" },
  { name: "Andre Jackson Jr.", rank: 408, age: 24.6, team: "MIL", pos: "SG,SF" },
  { name: "Alijah Martin", rank: 409, age: 24.5, team: "TOR", pos: "SG" },
  { name: "Johni Broome", rank: 410, age: 24, team: "PHI", pos: "C" },
  { name: "Adou Thiero", rank: 411, age: 22.2, team: "LAL", pos: "SF" },
  { name: "Chris Youngblood", rank: 413, age: 24.4, team: "POR", pos: "SG" },
  { name: "Ron Harper Jr.", rank: 414, age: 26.2, team: "BOS", pos: "SF" },
  { name: "Kelly Olynyk", rank: 415, age: 35.2, team: "SA", pos: "PF,C" },
  { name: "Koby Brea", rank: 416, age: 23.7, team: "PHO", pos: "SG" },
  { name: "Jarred Vanderbilt", rank: 417, age: 27.2, team: "LAL", pos: "PF,C" },
  { name: "Nick Richards", rank: 418, age: 28.6, team: "CHI", pos: "C" },
  { name: "Jonas Valanciunas", rank: 419, age: 34.2, team: "DEN", pos: "C" },
  { name: "Brandon Boston Jr", rank: 420, age: 24.6, team: "NO", pos: "SF,PF" },
  { name: "Jalen Wilson", rank: 421, age: 25.7, team: "BKN", pos: "SF,PF" },
  { name: "AJ Johnson", rank: 422, age: 23.6, team: "MEM", pos: "PG,SG" },
  { name: "Wendell Moore Jr.", rank: 423, age: 24.8, team: "DET", pos: "SF" },
  { name: "Nikola Djurisic", rank: 424, age: 22.4, team: "ATL", pos: "SF" },
  { name: "Jared Butler", rank: 425, age: 25.9, team: "PHO", pos: "PG,SG" },
  { name: "Ochai Agbaji", rank: 426, age: 26.2, team: "BKN", pos: "SG,SF" },
  { name: "Jaden Ivey", rank: 427, age: 24.4, team: "CHI", pos: "PG,SG" },
  { name: "Taurean Prince", rank: 428, age: 32.3, team: "MIL", pos: "SF" },
  { name: "Clint Capela", rank: 429, age: 32.1, team: "HOU", pos: "C" },
  { name: "Bol Bol", rank: 430, age: 26.6, team: "PHO", pos: "PF,C" },
  { name: "Tidjane Salaun", rank: 431, age: 20.9, team: "CHA", pos: "PF" },
  { name: "Caleb Martin", rank: 432, age: 30.8, team: "DAL", pos: "SF,PF" },
  { name: "Richaun Holmes", rank: 433, age: 32.7, team: "WAS", pos: "C" },
  { name: "Jett Howard", rank: 434, age: 22.8, team: "ORL", pos: "SF" },
  { name: "Dalano Banton", rank: 435, age: 26.7, team: "BOS", pos: "SG,SF" },
  { name: "John Konchar", rank: 436, age: 30.3, team: "UTA", pos: "SG,SF" },
  { name: "James Wiseman", rank: 437, age: 25.3, team: "IND", pos: "C" },
  { name: "Bobi Klintman", rank: 438, age: 23.3, team: "DET", pos: "PF" },
  { name: "Terance Mann", rank: 439, age: 29.7, team: "BKN", pos: "SG,SF" },
  { name: "Duop Reath", rank: 440, age: 30, team: "ATL", pos: "C" },
  { name: "Maxi Kleber", rank: 441, age: 34.4, team: "LAL", pos: "PF,C" },
  { name: "Georges Niang", rank: 442, age: 33, team: "MEM", pos: "PF" },
  { name: "Keon Johnson", rank: 443, age: 24.3, team: "BKN", pos: "PG,SG" },
  { name: "Ariel Hukporti", rank: 444, age: 24.2, team: "NY", pos: "C" },
  { name: "Spencer Dinwiddie", rank: 445, age: 33.2, team: "CHA", pos: "PG,SG" },
  { name: "Malaki Branham", rank: 446, age: 23.1, team: "CHA", pos: "SG,SF" },
  { name: "Dante Exum", rank: 447, age: 31, team: "WAS", pos: "PG,SG" },
  { name: "Eric Gordon", rank: 448, age: 37.5, team: "MEM", pos: "SG,SF" },
  { name: "Kentavious Caldwell-Pope", rank: 449, age: 33.4, team: "MEM", pos: "SG,SF" },
  { name: "Markelle Fultz", rank: 450, age: 28.1, team: "TOR", pos: "PG,SG" },
  { name: "Ja'Kobe Walter", rank: 451, age: 21.8, team: "TOR", pos: "PG,SG" },
  { name: "Harrison Barnes", rank: 452, age: 34.1, team: "SA", pos: "SF,PF" },
  { name: "Marvin Bagley III", rank: 453, age: 27.3, team: "DAL", pos: "PF,C" },
  { name: "Baylor Scheierman", rank: 454, age: 25.8, team: "BOS", pos: "SF" },
  { name: "Jabari Walker", rank: 455, age: 23.9, team: "PHI", pos: "PF,C" },
  { name: "Craig Porter Jr.", rank: 456, age: 26.3, team: "CLE", pos: "PG,SG" },
  { name: "Matisse Thybulle", rank: 457, age: 29.3, team: "POR", pos: "SG,SF" },
  { name: "Tosan Evbuomwan", rank: 458, age: 25.4, team: "CHA", pos: "SF,PF" },
  { name: "MarJon Beauchamp", rank: 459, age: 25.7, team: "PHI", pos: "SG,SF" },
  { name: "Larry Nance Jr.", rank: 460, age: 33.5, team: "CLE", pos: "PF,C" },
];

// Dizzle Dynasty July 2026 Points rankings (full-player list from Peter's shared sheet).
// Used with Hashtag dynasty rankings as an across-the-board average for 5-year value.
const DIZZLE_DYNASTY_POINTS_DB = [
  { name: "Victor Wembanyama", rank: 1, age: 22.6, team: "SAS", pos: "PF,C" },
  { name: "Shai Gilgeous-Alexander", rank: 2, age: 28, team: "OKC", pos: "PG,SG" },
  { name: "Luka Doncic", rank: 3, age: 27.4, team: "LAL", pos: "PG,SG" },
  { name: "Nikola Jokic", rank: 4, age: 31.4, team: "DEN", pos: "C" },
  { name: "Cooper Flagg", rank: 5, age: 19.6, team: "DAL", pos: "SF,PF" },
  { name: "Cade Cunningham", rank: 6, age: 24.8, team: "DET", pos: "PG,SG" },
  { name: "Jayson Tatum", rank: 7, age: 28.4, team: "BOS", pos: "SF,PF" },
  { name: "Anthony Edwards", rank: 8, age: 25, team: "MIN", pos: "SG,SF" },
  { name: "Jalen Johnson", rank: 9, age: 24.6, team: "ATL", pos: "SF,PF" },
  { name: "Tyrese Maxey", rank: 10, age: 25.7, team: "PHI", pos: "PG,SG" },
  { name: "Cameron Boozer", rank: 11, age: 19, team: "MEM", pos: "PF,C" },
  { name: "Scottie Barnes", rank: 12, age: 25, team: "TOR", pos: "SF,PF" },
  { name: "Tyrese Haliburton", rank: 13, age: 26.4, team: "IND", pos: "PG,SG" },
  { name: "Alperen Sengun", rank: 14, age: 24, team: "HOU", pos: "C" },
  { name: "AJ Dybantsa", rank: 15, age: 19.5, team: "WAS", pos: "SG,SF" },
  { name: "Giannis Antetokounmpo", rank: 16, age: 31.6, team: "MIL", pos: "PF,C" },
  { name: "Darryn Peterson", rank: 17, age: 19.5, team: "UTA", pos: "PG,SG" },
  { name: "Amen Thompson", rank: 18, age: 23.5, team: "HOU", pos: "PG,SG,SF" },
  { name: "Evan Mobley", rank: 19, age: 25.1, team: "CLE", pos: "PF,C" },
  { name: "Dylan Harper", rank: 20, age: 20.4, team: "SAS", pos: "PG,SG" },
  { name: "Jalen Williams", rank: 21, age: 25.3, team: "OKC", pos: "SG,SF,PF" },
  { name: "Kon Knueppel", rank: 22, age: 21, team: "CHA", pos: "SG,SF" },
  { name: "Paolo Banchero", rank: 23, age: 23.7, team: "ORL", pos: "SF,PF" },
  { name: "Josh Giddey", rank: 24, age: 23.8, team: "CHI", pos: "PG,SG,SF" },
  { name: "Donovan Mitchell", rank: 25, age: 29.9, team: "CLE", pos: "PG,SG" },
  { name: "Deni Avdija", rank: 26, age: 25.6, team: "POR", pos: "SF,PF" },
  { name: "Chet Holmgren", rank: 27, age: 24.2, team: "OKC", pos: "PF,C" },
  { name: "Franz Wagner", rank: 28, age: 24.9, team: "ORL", pos: "SG,SF,PF" },
  { name: "Austin Reaves", rank: 29, age: 28.2, team: "LAL", pos: "PG,SG" },
  { name: "Caleb Wilson", rank: 30, age: 20, team: "CHI", pos: "SF,PF" },
  { name: "Jamal Murray", rank: 31, age: 29.4, team: "DEN", pos: "PG,SG" },
  { name: "Darius Garland", rank: 32, age: 26.5, team: "LAC", pos: "PG,SG" },
  { name: "Jalen Brunson", rank: 33, age: 29.9, team: "NYK", pos: "PG,SG" },
  { name: "LaMelo Ball", rank: 34, age: 24.9, team: "CHA", pos: "PG,SG" },
  { name: "Jalen Duren", rank: 35, age: 22.7, team: "DET", pos: "C" },
  { name: "Devin Booker", rank: 36, age: 29.7, team: "PHO", pos: "SG,SF" },
  { name: "Karl-Anthony Towns", rank: 37, age: 30.7, team: "NYK", pos: "PF,C" },
  { name: "Trey Murphy III", rank: 38, age: 26.1, team: "NOP", pos: "SG,SF,PF" },
  { name: "Jaylen Brown", rank: 39, age: 29.8, team: "BOS", pos: "SG,SF" },
  { name: "Trae Young", rank: 40, age: 27.9, team: "WAS", pos: "PG,SG" },
  { name: "Stephon Castle", rank: 41, age: 21.7, team: "SAS", pos: "PG,SG,SF" },
  { name: "Brandon Miller", rank: 42, age: 23.7, team: "CHA", pos: "SF,PF" },
  { name: "Bam Adebayo", rank: 43, age: 29, team: "MIA", pos: "PF,C" },
  { name: "VJ Edgecombe", rank: 44, age: 21, team: "PHI", pos: "PG,SG" },
  { name: "Lauri Markkanen", rank: 45, age: 29.2, team: "UTA", pos: "SF,PF" },
  { name: "Donovan Clingan", rank: 46, age: 22.4, team: "POR", pos: "C" },
  { name: "Walker Kessler", rank: 47, age: 25, team: "UTA", pos: "C" },
  { name: "Alex Sarr", rank: 48, age: 21.3, team: "WAS", pos: "PF,C" },
  { name: "Keyonte George", rank: 49, age: 22.7, team: "UTA", pos: "PG,SG" },
  { name: "Darius Acuff Jr.", rank: 50, age: 19.7, team: "SAC", pos: "PG" },
  { name: "Zach Edey", rank: 51, age: 24.2, team: "MEM", pos: "C" },
  { name: "Brandon Ingram", rank: 52, age: 28.9, team: "TOR", pos: "SF,PF" },
  { name: "Jaren Jackson Jr.", rank: 53, age: 26.9, team: "UTA", pos: "PF,C" },
  { name: "Keaton Wagler", rank: 54, age: 19.5, team: "LAC", pos: "PG,SG" },
  { name: "Domantas Sabonis", rank: 55, age: 30.2, team: "SAC", pos: "PF,C" },
  { name: "Onyeka Okongwu", rank: 56, age: 25.6, team: "ATL", pos: "PF,C" },
  { name: "Desmond Bane", rank: 57, age: 28.1, team: "ORL", pos: "SG,SF" },
  { name: "Kevin Durant", rank: 58, age: 37.8, team: "HOU", pos: "SF,PF" },
  { name: "James Harden", rank: 59, age: 36.9, team: "CLE", pos: "PG,SG" },
  { name: "Mikel Brown Jr.", rank: 60, age: 20.3, team: "BKN", pos: "PG,SG" },
  { name: "De'Aaron Fox", rank: 61, age: 28.6, team: "SAS", pos: "PG,SG" },
  { name: "Zion Williamson", rank: 62, age: 26.1, team: "NOP", pos: "PF,C" },
  { name: "Stephen Curry", rank: 63, age: 38.4, team: "GSW", pos: "PG,SG" },
  { name: "Anthony Davis", rank: 64, age: 33.4, team: "WAS", pos: "PF,C" },
  { name: "Collin Murray-Boyles", rank: 65, age: 21.1, team: "TOR", pos: "PF,C" },
  { name: "Kel'el Ware", rank: 66, age: 22.3, team: "MIA", pos: "C" },
  { name: "Ivica Zubac", rank: 67, age: 29.4, team: "IND", pos: "C" },
  { name: "Kawhi Leonard", rank: 68, age: 35.1, team: "LAC", pos: "SG,SF" },
  { name: "Kingston Flemings", rank: 69, age: 19.6, team: "ATL", pos: "PG,SG" },
  { name: "Kyrie Irving", rank: 70, age: 34.3, team: "DAL", pos: "PG,SG" },
  { name: "Pascal Siakam", rank: 71, age: 32.3, team: "IND", pos: "SF,PF,C" },
  { name: "Matas Buzelis", rank: 72, age: 21.8, team: "CHI", pos: "SF,PF" },
  { name: "OG Anunoby", rank: 73, age: 29, team: "NYK", pos: "SG,SF,PF" },
  { name: "Derrick White", rank: 74, age: 32.1, team: "BOS", pos: "PG,SG" },
  { name: "Tyler Herro", rank: 75, age: 26.5, team: "MIA", pos: "PG,SG" },
  { name: "Joel Embiid", rank: 76, age: 32.4, team: "PHI", pos: "C" },
  { name: "Ja Morant", rank: 77, age: 27, team: "MEM", pos: "PG,SG" },
  { name: "Dyson Daniels", rank: 78, age: 23.4, team: "ATL", pos: "PG,SG" },
  { name: "Ausar Thompson", rank: 79, age: 23.5, team: "DET", pos: "SG,SF" },
  { name: "Jalen Suggs", rank: 80, age: 25.2, team: "ORL", pos: "PG,SG" },
  { name: "Cedric Coward", rank: 81, age: 22.9, team: "MEM", pos: "SG,SF" },
  { name: "Ryan Rollins", rank: 82, age: 24.1, team: "MIL", pos: "PG,SG" },
  { name: "Nickeil Alexander-Walker", rank: 83, age: 27.9, team: "ATL", pos: "SG,SF" },
  { name: "Jarrett Allen", rank: 84, age: 28.3, team: "CLE", pos: "C" },
  { name: "Kyshawn George", rank: 85, age: 22.6, team: "WAS", pos: "SG,SF" },
  { name: "Derik Queen", rank: 86, age: 21.6, team: "NOP", pos: "PF,C" },
  { name: "Jaden McDaniels", rank: 87, age: 25.8, team: "MIN", pos: "SF,PF" },
  { name: "Reed Sheppard", rank: 88, age: 22.1, team: "HOU", pos: "PG,SG" },
  { name: "Payton Pritchard", rank: 89, age: 28.5, team: "BOS", pos: "PG,SG" },
  { name: "Ace Bailey", rank: 90, age: 20, team: "UTA", pos: "SF,PF" },
  { name: "Isaiah Hartenstein", rank: 91, age: 28.2, team: "OKC", pos: "C" },
  { name: "Michael Porter Jr.", rank: 92, age: 28.1, team: "BKN", pos: "SF,PF" },
  { name: "Coby White", rank: 93, age: 26.4, team: "CHA", pos: "PG,SG" },
  { name: "Scoot Henderson", rank: 94, age: 22.5, team: "POR", pos: "PG,SG" },
  { name: "Brayden Burries", rank: 95, age: 20.9, team: "MIL", pos: "PG,SG" },
  { name: "Immanuel Quickley", rank: 96, age: 27.1, team: "TOR", pos: "PG,SG" },
  { name: "Julius Randle", rank: 97, age: 31.7, team: "MIN", pos: "PF" },
  { name: "Mikal Bridges", rank: 98, age: 29.9, team: "NYK", pos: "SG,SF" },
  { name: "Yaxel Lendeborg", rank: 99, age: 23.8, team: "GSW", pos: "PF" },
  { name: "Nic Claxton", rank: 100, age: 27.3, team: "BKN", pos: "C" },
  { name: "Aday Mara", rank: 101, age: 21.3, team: "OKC", pos: "C" },
  { name: "Morez Johnson Jr.", rank: 102, age: 20.5, team: "DAL", pos: "PF,C" },
  { name: "Jalen Green", rank: 103, age: 24.5, team: "PHO", pos: "PG,SG" },
  { name: "Peyton Watson", rank: 104, age: 23.9, team: "DEN", pos: "SF,PF" },
  { name: "Naz Reid", rank: 105, age: 26.9, team: "MIN", pos: "PF,C" },
  { name: "Dejounte Murray", rank: 106, age: 29.9, team: "NOP", pos: "PG,SG" },
  { name: "Tari Eason", rank: 107, age: 25.2, team: "HOU", pos: "SF,PF" },
  { name: "Ajay Mitchell", rank: 108, age: 24.1, team: "OKC", pos: "PG,SG" },
  { name: "Anthony Black", rank: 109, age: 22.5, team: "ORL", pos: "PG,SG,SF" },
  { name: "Zach LaVine", rank: 110, age: 31.4, team: "SAC", pos: "SG,SF" },
  { name: "Jeremiah Fears", rank: 111, age: 19.8, team: "NOP", pos: "PG,SG" },
  { name: "Egor Demin", rank: 112, age: 20.4, team: "BKN", pos: "PG,SG,SF" },
  { name: "Miles Bridges", rank: 113, age: 28.4, team: "CHA", pos: "SF,PF" },
  { name: "Mark Williams", rank: 114, age: 24.6, team: "PHO", pos: "C" },
  { name: "Keegan Murray", rank: 115, age: 25.9, team: "SAC", pos: "SF,PF" },
  { name: "Josh Hart", rank: 116, age: 31.4, team: "NYK", pos: "SG,SF" },
  { name: "Andrew Nembhard", rank: 117, age: 26.5, team: "IND", pos: "PG,SG" },
  { name: "Tre Johnson", rank: 118, age: 20.4, team: "WAS", pos: "SG,SF" },
  { name: "Ebuka Okorie", rank: 119, age: 19.3, team: "DET", pos: "PG,SG" },
  { name: "Joan Beringer", rank: 120, age: 19.7, team: "MIN", pos: "C" },
  { name: "Devin Vassell", rank: 121, age: 25.9, team: "SAS", pos: "SG,SF" },
  { name: "RJ Barrett", rank: 122, age: 26.1, team: "TOR", pos: "SG,SF" },
  { name: "Khaman Malauch", rank: 123, age: 19.9, team: "PHO", pos: "C" },
  { name: "Day'Ron Sharpe", rank: 124, age: 24.7, team: "BKN", pos: "C" },
  { name: "Hannes Steinbach", rank: 125, age: 20.2, team: "CHA", pos: "PF,C" },
  { name: "Paul George", rank: 126, age: 36.2, team: "PHI", pos: "SG,SF,PF" },
  { name: "Toumani Camara", rank: 127, age: 26.2, team: "POR", pos: "SF,PF" },
  { name: "Norman Powell", rank: 128, age: 33.2, team: "MIA", pos: "SG,SF" },
  { name: "Myles Turner", rank: 129, age: 30.3, team: "MIL", pos: "C" },
  { name: "Cason Wallace", rank: 130, age: 22.7, team: "OKC", pos: "PG,SG" },
  { name: "PJ Washington", rank: 131, age: 27.9, team: "DAL", pos: "PF,C" },
  { name: "Jabari Smith Jr.", rank: 132, age: 23.2, team: "HOU", pos: "PF" },
  { name: "Jakob Poeltl", rank: 133, age: 30.8, team: "TOR", pos: "C" },
  { name: "Fred VanVleet", rank: 134, age: 32.4, team: "HOU", pos: "PG,SG" },
  { name: "Shaedon Sharpe", rank: 135, age: 23.2, team: "POR", pos: "SG,SF" },
  { name: "Ty Jerome", rank: 136, age: 29.1, team: "MEM", pos: "PG,SG" },
  { name: "Rudy Gobert", rank: 137, age: 34.1, team: "MIN", pos: "C" },
  { name: "Kristaps Porzingis", rank: 138, age: 31, team: "GSW", pos: "PF,C" },
  { name: "Bennett Stirtz", rank: 139, age: 22.8, team: "OKC", pos: "PG,SG" },
  { name: "Santi Aldama", rank: 140, age: 25.5, team: "MEM", pos: "SF,PF" },
  { name: "Aaron Gordon", rank: 141, age: 30.9, team: "DEN", pos: "SF,PF" },
  { name: "Neemias Queta", rank: 142, age: 27, team: "BOS", pos: "C" },
  { name: "Jared McCain", rank: 143, age: 22.4, team: "OKC", pos: "PG,SG" },
  { name: "Dailyn Swain", rank: 144, age: 21, team: "CHI", pos: "SG,SF" },
  { name: "Cameron Carr", rank: 145, age: 21.7, team: "LAL", pos: "SG,SF" },
  { name: "John Collins", rank: 146, age: 28.8, team: "LAC", pos: "PF,C" },
  { name: "Jaime Jaquez Jr.", rank: 147, age: 25.4, team: "MIA", pos: "SG,SF" },
  { name: "Bilal Coulibaly", rank: 148, age: 22, team: "WAS", pos: "SG,SF" },
  { name: "Dereck Lively II", rank: 149, age: 22.5, team: "DAL", pos: "C" },
  { name: "Ron Holland", rank: 150, age: 21.1, team: "DET", pos: "SF,PF" },
  { name: "Maxime Raynaud", rank: 151, age: 23.3, team: "SAC", pos: "PF,C" },
  { name: "LeBron James", rank: 152, age: 41.6, team: "LAL", pos: "SG,SF,PF" },
  { name: "Christian Anderson", rank: 153, age: 20.3, team: "CHA", pos: "PG,SG" },
  { name: "Thomas Sorber", rank: 154, age: 20.6, team: "OKC", pos: "C" },
  { name: "Carter Bryant", rank: 155, age: 20.7, team: "SAS", pos: "SF,PF" },
  { name: "Ayo Dosumnu", rank: 156, age: 26.5, team: "MIN", pos: "PG,SG" },
  { name: "Naji Marshall", rank: 157, age: 28.5, team: "DAL", pos: "SF,PF" },
  { name: "Damian Lillard", rank: 158, age: 36, team: "POR", pos: "PG,SG" },
  { name: "Andrew Wiggins", rank: 159, age: 31.4, team: "MIA", pos: "SF,PF" },
  { name: "Christian Braun", rank: 160, age: 25.3, team: "DEN", pos: "SG,SF" },
  { name: "Labaron Philon", rank: 161, age: 20.7, team: "PHI", pos: "PG,SG" },
  { name: "Nate Ament", rank: 162, age: 19.6, team: "MIL", pos: "SF,PF" },
  { name: "Brandin Podziemski", rank: 163, age: 23.4, team: "GSW", pos: "PG,SG,SF" },
  { name: "Jaylon Tyson", rank: 164, age: 23.7, team: "CLE", pos: "SG,SF" },
  { name: "Quentin Grimes", rank: 165, age: 26.2, team: "PHI", pos: "SG,SF" },
  { name: "Will Riley", rank: 166, age: 20.5, team: "WAS", pos: "SF,PF" },
  { name: "Kevin Porter Jr.", rank: 167, age: 26.2, team: "MIL", pos: "PG,SG" },
  { name: "Deandre Ayton", rank: 168, age: 28, team: "LAL", pos: "C" },
  { name: "Daniel Gafford", rank: 169, age: 27.8, team: "DAL", pos: "C" },
  { name: "Moussa Diabate", rank: 170, age: 24.5, team: "CHA", pos: "C" },
  { name: "Aaron Nesmith", rank: 171, age: 26.8, team: "IND", pos: "SF,PF" },
  { name: "Kasparas Jakucionis", rank: 172, age: 20.2, team: "MIA", pos: "PG,SG" },
  { name: "Collin Gillespie", rank: 173, age: 27.1, team: "PHO", pos: "PG" },
  { name: "Julian Champagnie", rank: 174, age: 25.1, team: "SAS", pos: "SF,PF" },
  { name: "Wendell Carter Jr.", rank: 175, age: 27.3, team: "ORL", pos: "PF,C" },
  { name: "Jonathan Kuminga", rank: 176, age: 23.8, team: "ATL", pos: "SF,PF" },
  { name: "Kyle Filipowski", rank: 177, age: 22.7, team: "UTA", pos: "PF,C" },
  { name: "Isaiah Stewart", rank: 178, age: 25.2, team: "DET", pos: "PF,C" },
  { name: "Dillon Brooks", rank: 179, age: 30.5, team: "PHO", pos: "SF,PF" },
  { name: "Davion Mitchell", rank: 180, age: 27.9, team: "MIA", pos: "PG,SG" },
  { name: "Jimmy Butler", rank: 181, age: 36.9, team: "GSW", pos: "SF,PF" },
  { name: "Cameron Johnson", rank: 182, age: 30.4, team: "DEN", pos: "SF,PF" },
  { name: "CJ McCollum", rank: 183, age: 34.9, team: "ATL", pos: "PG,SG" },
  { name: "Hugo Gonzalez", rank: 184, age: 20.5, team: "BOS", pos: "SG,SF" },
  { name: "Karim Lopez", rank: 185, age: 19.3, team: "MEM", pos: "SF,PF" },
  { name: "Tarris Reed Jr.", rank: 186, age: 23, team: "SAS", pos: "C" },
  { name: "Allen Graves", rank: 187, age: 20, team: "TOR", pos: "PF" },
  { name: "Gui Santos", rank: 188, age: 24.1, team: "GSW", pos: "SF,PF" },
  { name: "Noa Essengue", rank: 189, age: 19.6, team: "CHI", pos: "SF,PF" },
  { name: "Grayson Allen", rank: 190, age: 30.8, team: "PHO", pos: "SG,SF" },
  { name: "Malik Monk", rank: 191, age: 28.5, team: "SAC", pos: "SG,SF" },
  { name: "Herbert Jones", rank: 192, age: 27.8, team: "NOP", pos: "SF,PF" },
  { name: "Max Christie", rank: 193, age: 23.5, team: "DAL", pos: "SG,SF" },
  { name: "Rui Hachimura", rank: 194, age: 28.5, team: "LAL", pos: "SF,PF" },
  { name: "Draymond Green", rank: 195, age: 36.4, team: "GSW", pos: "PF,C" },
  { name: "Bennedict Mathurin", rank: 196, age: 24.1, team: "LAC", pos: "SG,SF" },
  { name: "Paul Reed", rank: 197, age: 27.1, team: "DET", pos: "PF,C" },
  { name: "Anfernee Simons", rank: 198, age: 27.1, team: "CHI", pos: "PG,SG" },
  { name: "Nique Clifford", rank: 199, age: 24.5, team: "SAC", pos: "SG,SF" },
  { name: "Danny Wolf", rank: 200, age: 22.2, team: "BKN", pos: "PF,C" },
  { name: "Mitchell Robinson", rank: 201, age: 28.3, team: "NYK", pos: "C" },
  { name: "Daniss Jenkins", rank: 202, age: 24.9, team: "DET", pos: "PG,SG" },
  { name: "Cam Spencer", rank: 203, age: 26.3, team: "MEM", pos: "PG,SG" },
  { name: "Jrue Holiday", rank: 204, age: 36, team: "POR", pos: "PG,SG" },
  { name: "Jamal Shead", rank: 205, age: 24.1, team: "TOR", pos: "PG,SG" },
  { name: "Bruce Thornton", rank: 206, age: 22.9, team: "HOU", pos: "PG,SG" },
  { name: "DeMar DeRozan", rank: 207, age: 37, team: "SAC", pos: "SG,SF,PF" },
  { name: "Scotty Pippen Jr.", rank: 208, age: 25.7, team: "MEM", pos: "PG,SG" },
  { name: "Jordan Poole", rank: 209, age: 27.1, team: "NOP", pos: "PG,SG" },
  { name: "Josh Minott", rank: 210, age: 23.7, team: "BKN", pos: "SF,PF" },
  { name: "De'Andre Hunter", rank: 211, age: 28.7, team: "SAC", pos: "SF,PF" },
  { name: "Aaron Wiggins", rank: 212, age: 27.6, team: "OKC", pos: "SG,SF" },
  { name: "Nikola Topic", rank: 213, age: 21, team: "OKC", pos: "PG,SG" },
  { name: "Tre Jones", rank: 214, age: 26.6, team: "CHI", pos: "PG,SG" },
  { name: "Jusuf Nurkic", rank: 215, age: 31.9, team: "UTA", pos: "C" },
  { name: "Walter Clayton Jr.", rank: 216, age: 23.4, team: "MEM", pos: "PG,SG" },
  { name: "Bobby Portis", rank: 217, age: 31.5, team: "MIL", pos: "PF,C" },
  { name: "Sam Hauser", rank: 218, age: 28.6, team: "BOS", pos: "SF,PF" },
  { name: "Saddiq Bey", rank: 219, age: 27.3, team: "NOP", pos: "SF,PF" },
  { name: "Sandro Mamukelashvili", rank: 220, age: 27.2, team: "TOR", pos: "PF,C" },
  { name: "Isaiah Collier", rank: 221, age: 21.8, team: "UTA", pos: "PG,SG" },
  { name: "Robert Williams III", rank: 222, age: 28.8, team: "POR", pos: "C" },
  { name: "Tobias Harris", rank: 223, age: 34, team: "DET", pos: "SF,PF" },
  { name: "Nikola Vucevic", rank: 224, age: 35.8, team: "BOS", pos: "C" },
  { name: "Nolan Traore", rank: 225, age: 20.2, team: "BKN", pos: "PG,SG" },
  { name: "Sergio De Larrea", rank: 226, age: 20.6, team: "DAL", pos: "PG,SG" },
  { name: "Zuby Ejiofor", rank: 227, age: 22.3, team: "ATL", pos: "PF,C" },
  { name: "Kobe Sanders", rank: 228, age: 23.4, team: "LAC", pos: "SG,SF" },
  { name: "De'Anthony Melton", rank: 229, age: 28.2, team: "GSW", pos: "PG,SG" },
  { name: "Jerami Grant", rank: 230, age: 32.4, team: "POR", pos: "SF,PF" },
  { name: "Jaylen Wells", rank: 231, age: 22.9, team: "MEM", pos: "SG,SF" },
  { name: "Ousmane Dieng", rank: 232, age: 23.2, team: "MIL", pos: "SF,PF" },
  { name: "Terrance Shannon Jr.", rank: 233, age: 26, team: "MIN", pos: "SG,SF" },
  { name: "Sam Merrill", rank: 234, age: 30.2, team: "CLE", pos: "SG" },
  { name: "Zaccharie Risacher", rank: 235, age: 21.3, team: "ATL", pos: "SF,PF" },
  { name: "Koa Peat", rank: 236, age: 19.5, team: "PHO", pos: "PF" },
  { name: "Meleek Thomas", rank: 237, age: 20, team: "CLE", pos: "SG" },
  { name: "Ryan Kalkbrenner", rank: 238, age: 24.5, team: "CHA", pos: "C" },
  { name: "Tristan Da Silva", rank: 239, age: 25.2, team: "ORL", pos: "SF,PF" },
  { name: "Chris Cenac Jr.", rank: 240, age: 19.5, team: "BOS", pos: "PF,C" },
  { name: "Keldon Johnson", rank: 241, age: 26.8, team: "SAS", pos: "SF,PF" },
  { name: "Dylan Cardwell", rank: 242, age: 24.6, team: "SAC", pos: "C" },
  { name: "Yanic Konan Niederhauser", rank: 243, age: 22.6, team: "LAC", pos: "PF,C" },
  { name: "Kelly Oubre Jr.", rank: 244, age: 30.6, team: "PHI", pos: "SG,SF" },
  { name: "Brice Sensabaugh", rank: 245, age: 22.7, team: "UTA", pos: "SG,SF" },
  { name: "Taylor Hendricks", rank: 246, age: 22.7, team: "MEM", pos: "SF,PF" },
  { name: "Ryan Nembhard", rank: 247, age: 22.6, team: "DAL", pos: "PG" },
  { name: "GG Jackson", rank: 248, age: 21.6, team: "MEM", pos: "SF,PF" },
  { name: "Rasheer Fleming", rank: 249, age: 22.1, team: "PHO", pos: "SF,PF" },
  { name: "Luguentz Dort", rank: 250, age: 27.3, team: "OKC", pos: "SG,SF" },
  { name: "Rob Dillingham", rank: 251, age: 21.6, team: "CHI", pos: "PG" },
  { name: "Joshua Jefferson", rank: 252, age: 22.7, team: "BKN", pos: "SF,PF" },
  { name: "Jayden Quaintance", rank: 253, age: 19, team: "SAS", pos: "C" },
  { name: "Isaiah Evans", rank: 254, age: 20.6, team: "MIN", pos: "SG,SF" },
  { name: "Richie Saunders", rank: 255, age: 24.9, team: "MEM", pos: "SG,SF" },
  { name: "Miles McBride", rank: 256, age: 25.9, team: "NYK", pos: "PG,SG" },
  { name: "Donte DiVincenzo", rank: 257, age: 29.5, team: "MIN", pos: "PG,SG" },
  { name: "Quentin Post", rank: 258, age: 26.4, team: "GSW", pos: "PF,C" },
  { name: "Yang Hansen", rank: 259, age: 21.1, team: "POR", pos: "C" },
  { name: "Pelle Larsson", rank: 260, age: 25.4, team: "MIA", pos: "SG,SF" },
  { name: "Kyle Kuzma", rank: 261, age: 31, team: "MIL", pos: "SF,PF" },
  { name: "Baylor Scheierman", rank: 262, age: 25.8, team: "BOS", pos: "SG,SF" },
  { name: "Max Strus", rank: 263, age: 30.3, team: "CLE", pos: "SG,SF" },
  { name: "Bradley Beal", rank: 264, age: 33.1, team: "LAC", pos: "SG" },
  { name: "Moses Moody", rank: 265, age: 24.2, team: "GSW", pos: "SG,SF" },
  { name: "Noah Clowney", rank: 266, age: 22, team: "BKN", pos: "PF,C" },
  { name: "Jase Richardson", rank: 267, age: 20.8, team: "ORL", pos: "SG" },
  { name: "Collin Sexton", rank: 268, age: 27.6, team: "CHI", pos: "PG,SG" },
  { name: "Royce O'Neale", rank: 269, age: 33.1, team: "PHO", pos: "SG,SF" },
  { name: "Alex Karaban", rank: 270, age: 23.7, team: "SAC", pos: "SF,PF" },
  { name: "Jay Huff", rank: 271, age: 28.9, team: "IND", pos: "C" },
  { name: "Justin Champagnie", rank: 272, age: 25.1, team: "WAS", pos: "SF,PF" },
  { name: "Jalen Smith", rank: 273, age: 26.4, team: "CHI", pos: "PF,C" },
  { name: "Ryan Conwell", rank: 274, age: 22.1, team: "MIA", pos: "SG" },
  { name: "Oso Ighodaro", rank: 275, age: 24.1, team: "PHO", pos: "PF,C" },
  { name: "Henri Veesaar", rank: 276, age: 22.3, team: "ATL", pos: "C" },
  { name: "Baba Miller", rank: 277, age: 22.5, team: "LAC", pos: "PF,C" },
  { name: "Dennis Schroder", rank: 278, age: 32.9, team: "CLE", pos: "PG,SG" },
  { name: "Asa Newell", rank: 279, age: 20.8, team: "ATL", pos: "PF,C" },
  { name: "Noah Penda", rank: 280, age: 21.6, team: "ORL", pos: "SF,PF" },
  { name: "Jose Alvarado", rank: 281, age: 28.3, team: "NYK", pos: "PG" },
  { name: "Javon Small", rank: 282, age: 23.6, team: "MEM", pos: "PG,SG" },
  { name: "Luke Kennard", rank: 283, age: 30.1, team: "ATL", pos: "SG,SF" },
  { name: "Adem Bona", rank: 284, age: 23.3, team: "PHI", pos: "PF,C" },
  { name: "Tidjane Salaun", rank: 285, age: 21, team: "CHA", pos: "PF" },
  { name: "Bogoljbub Markovic", rank: 286, age: 20.2, team: "MIL", pos: "PF" },
  { name: "Ja'Kobe Walter", rank: 287, age: 21.9, team: "TOR", pos: "SG,SF" },
  { name: "Kris Dunn", rank: 288, age: 32.4, team: "LAC", pos: "PG,SG" },
  { name: "Jordan Walsh", rank: 289, age: 22.4, team: "BOS", pos: "SF,PF" },
  { name: "Obi Toppin", rank: 290, age: 28.4, team: "IND", pos: "PF" },
  { name: "Emanuel Sharp", rank: 291, age: 22.4, team: "SAC", pos: "SG" },
  { name: "Carlton Carrington", rank: 292, age: 21, team: "WAS", pos: "PG,SG" },
  { name: "TJ McConnell", rank: 293, age: 34.3, team: "IND", pos: "PG,SG" },
  { name: "Derrick Jones Jr.", rank: 294, age: 29.4, team: "LAC", pos: "SF,PF" },
  { name: "Dean Wade", rank: 295, age: 29.7, team: "CLE", pos: "SF,PF" },
  { name: "Nikola Jovic", rank: 296, age: 23.1, team: "MIA", pos: "SF,PF" },
  { name: "Adou Thiero", rank: 297, age: 22.2, team: "LAL", pos: "SF,PF" },
  { name: "Jordan Miller", rank: 298, age: 26.5, team: "LAC", pos: "SF,PF" },
  { name: "Duncan Robinson", rank: 299, age: 32.3, team: "DET", pos: "SG,SF" },
  { name: "Tim Hardaway Jr.", rank: 300, age: 34.4, team: "DEN", pos: "SG,SF" },
  { name: "Alex Caruso", rank: 301, age: 32.4, team: "OKC", pos: "PG,SG" },
  { name: "Isaiah Joe", rank: 302, age: 27.1, team: "OKC", pos: "SG,SF" },
  { name: "Jake LaRavia", rank: 303, age: 24.7, team: "LAL", pos: "SF,PF" },
  { name: "Andre Drummond", rank: 304, age: 33, team: "PHI", pos: "C" },
  { name: "Jock Landale", rank: 305, age: 30.8, team: "ATL", pos: "C" },
  { name: "Jarace Walker", rank: 306, age: 22.9, team: "IND", pos: "SF,PF" },
  { name: "Dominick Barlow", rank: 307, age: 23.2, team: "PHI", pos: "PF,C" },
  { name: "AJ Green", rank: 308, age: 26.8, team: "MIL", pos: "SG" },
  { name: "Al Horford", rank: 309, age: 40.2, team: "GSW", pos: "PF,C" },
  { name: "DaRon Holmes II", rank: 310, age: 24, team: "DEN", pos: "PF,C" },
  { name: "Ryan Dunn", rank: 311, age: 23.6, team: "PHO", pos: "SG,SF" },
  { name: "Yves Missi", rank: 312, age: 22.2, team: "NOP", pos: "C" },
  { name: "Devin Carter", rank: 313, age: 24.4, team: "SAC", pos: "PG,SG" },
  { name: "Marcus Smart", rank: 314, age: 23.6, team: "LAL", pos: "PG,SG" },
  { name: "Jamir Watkins", rank: 315, age: 25.1, team: "WAS", pos: "SG,SF" },
  { name: "Mohamed Diawara", rank: 316, age: 21.2, team: "NYK", pos: "SF,PF" },
  { name: "Marvin Bagley III", rank: 317, age: 27.4, team: "DAL", pos: "PF,C" },
  { name: "Jaylin Williams", rank: 318, age: 24.1, team: "OKC", pos: "PF,C" },
  { name: "Cody Williams", rank: 319, age: 21.7, team: "UTA", pos: "SG,SF" },
  { name: "Luke Kornet", rank: 320, age: 31, team: "SAS", pos: "C" },
  { name: "Caleb Love", rank: 321, age: 24.8, team: "POR", pos: "SG" },
  { name: "Leonard Miller", rank: 322, age: 22.7, team: "CHI", pos: "SF,PF" },
  { name: "Isaiah Jackson", rank: 323, age: 24.5, team: "LAC", pos: "PF,C" },
  { name: "Vit Krejci", rank: 324, age: 26.1, team: "POR", pos: "PG,SG,SF" },
  { name: "Will Richard", rank: 325, age: 22.8, team: "GSW", pos: "SG,SF" },
  { name: "Grant Williams", rank: 326, age: 27.7, team: "CHA", pos: "SF,PF" },
  { name: "Goga Bitadze", rank: 327, age: 27, team: "ORL", pos: "C" },
  { name: "Patrick Williams", rank: 328, age: 24.9, team: "CHI", pos: "SF,PF" },
  { name: "Jordan Goodwin", rank: 329, age: 27.8, team: "PHO", pos: "PG,SG" },
  { name: "Moritz Wagner", rank: 330, age: 29.3, team: "ORL", pos: "PF,C" },
  { name: "Moussa Cisse", rank: 331, age: 23.9, team: "FA", pos: "C" },
  { name: "Liam McNeeley", rank: 332, age: 20.8, team: "CHA", pos: "SG,SF" },
  { name: "Gradey Dick", rank: 333, age: 22.7, team: "TOR", pos: "SG,SF" },
  { name: "Kevin Huerter", rank: 334, age: 27.9, team: "DET", pos: "SG,SF" },
  { name: "Ben Saraf", rank: 335, age: 20.3, team: "BKN", pos: "PG,SG" },
  { name: "Russell Westbrook", rank: 336, age: 37.7, team: "SAC", pos: "PG,SG" },
  { name: "Ugonna Onyenso", rank: 337, age: 21.8, team: "DET", pos: "C" },
  { name: "Karlo Matkovic", rank: 338, age: 25.3, team: "NOP", pos: "PF,C" },
  { name: "Ron Harper Jr.", rank: 339, age: 26.3, team: "BOS", pos: "SG" },
  { name: "Steven Adams", rank: 340, age: 33, team: "HOU", pos: "C" },
  { name: "Drake Powell", rank: 341, age: 20.9, team: "BKN", pos: "SG,SF" },
  { name: "Braden Smith", rank: 342, age: 23, team: "IND", pos: "PG" },
  { name: "Bruce Brown", rank: 343, age: 30, team: "DEN", pos: "PG,SG,SF" },
  { name: "Brandon Williams", rank: 344, age: 26.7, team: "DAL", pos: "PG,SG" },
  { name: "Brook Lopez", rank: 345, age: 38.3, team: "LAC", pos: "C" },
  { name: "Keon Ellis", rank: 346, age: 26.6, team: "CLE", pos: "SG,SF" },
  { name: "Khris Middleton", rank: 347, age: 35, team: "DAL", pos: "SF,PF" },
  { name: "Kentavious Caldwell-Pope", rank: 348, age: 33.4, team: "MEM", pos: "SG,SF" },
  { name: "Justin Edwards", rank: 349, age: 22.6, team: "PHI", pos: "SG,SF" },
  { name: "Julian Strawther", rank: 350, age: 24.3, team: "DEN", pos: "SG,SF" },
  { name: "Dorian Finney-Smith", rank: 351, age: 33.2, team: "HOU", pos: "SF,PF" },
  { name: "Jordan Hawkins", rank: 352, age: 24.2, team: "NOP", pos: "SG,SF" },
  { name: "Isaac Okoro", rank: 353, age: 25.5, team: "CHI", pos: "SG,SF" },
  { name: "Bogdan Bogdanovic", rank: 354, age: 33.9, team: "LAC", pos: "SG,SF" },
  { name: "Harrison Barnes", rank: 355, age: 34.2, team: "SAS", pos: "SF,PF" },
  { name: "Luka Garza", rank: 356, age: 27.6, team: "BOS", pos: "PF,C" },
  { name: "Kevon Looney", rank: 357, age: 30.5, team: "NOP", pos: "PF,C" },
  { name: "Johnny Furphy", rank: 358, age: 21.6, team: "IND", pos: "SG,SF" },
  { name: "Bones Hyland", rank: 359, age: 25.9, team: "MIN", pos: "PG,SG" },
  { name: "Tarik Biberovic", rank: 360, age: 25.5, team: "MEM", pos: "SG,SF" },
  { name: "Tristan Vukcevic", rank: 361, age: 23.4, team: "WAS", pos: "PF,C" },
  { name: "Jeremy Sochan", rank: 362, age: 23.2, team: "NYK", pos: "SF,PF" },
  { name: "Tyler Kolek", rank: 363, age: 25.3, team: "NYK", pos: "PG,SG" },
  { name: "Jaylen Clark", rank: 364, age: 24.8, team: "MIN", pos: "SG,SF" },
  { name: "Amari Williams", rank: 365, age: 24.5, team: "BOS", pos: "C" },
  { name: "Craig Porter Jr.", rank: 366, age: 26.4, team: "CLE", pos: "PG,SG" },
  { name: "Caris LeVert", rank: 367, age: 31.9, team: "DET", pos: "SG,SF" },
  { name: "Tyrese Proctor", rank: 368, age: 22.3, team: "CLE", pos: "PG,SG" },
  { name: "Landry Shamet", rank: 369, age: 29.4, team: "NYK", pos: "SG" },
  { name: "Marcus Sasser", rank: 370, age: 25.9, team: "DET", pos: "PG,SG" },
  { name: "Precious Achiuwa", rank: 371, age: 26.9, team: "SAC", pos: "PF,C" },
  { name: "Cam Thomas", rank: 372, age: 24.8, team: "FA", pos: "SG" },
  { name: "Simone Fontecchio", rank: 373, age: 30.6, team: "MIA", pos: "SF,PF" },
  { name: "Jaxson Hayes", rank: 374, age: 26.2, team: "LAL", pos: "C" },
  { name: "Myron Gardner", rank: 375, age: 25.2, team: "MIA", pos: "SF,PF" },
  { name: "Corey Kispert", rank: 376, age: 27.4, team: "ATL", pos: "SG,SF" },
  { name: "Gary Trent Jr.", rank: 377, age: 27.5, team: "MIL", pos: "SG,SF" },
  { name: "Daeqwon Plowden", rank: 378, age: 27.9, team: "SAC", pos: "SG,SF" },
  { name: "Josh Green", rank: 379, age: 25.7, team: "CHA", pos: "SG,SF" },
  { name: "Jonas Valančiūnas", rank: 380, age: 34.2, team: "DEN", pos: "C" },
  { name: "Spencer Jones", rank: 381, age: 25.1, team: "DEN", pos: "SF,PF" },
  { name: "Jarred Vanderbilt", rank: 382, age: 27.3, team: "LAL", pos: "SF,PF,C" },
  { name: "Mouhamed Gueye", rank: 383, age: 23.7, team: "ATL", pos: "PF,C" },
  { name: "Sion James", rank: 384, age: 23.6, team: "CHA", pos: "SG,SF" },
  { name: "Jamal Cain", rank: 385, age: 27.4, team: "ORL", pos: "SG,SF" },
  { name: "Johni Broome", rank: 386, age: 24, team: "PHI", pos: "PF,C" },
  { name: "Terance Mann", rank: 387, age: 29.8, team: "BKN", pos: "SG,SF" },
  { name: "Zach Collins", rank: 388, age: 28.7, team: "CHI", pos: "PF,C" },
  { name: "Jordan Clarkson", rank: 389, age: 34.1, team: "NYK", pos: "PG,SG" },
  { name: "Klay Thompson", rank: 390, age: 36.5, team: "DAL", pos: "SG,SF" },
  { name: "Pat Spencer", rank: 391, age: 30.1, team: "GSW", pos: "PG,SG" },
  { name: "Koby Brea", rank: 392, age: 23.7, team: "PHO", pos: "SG,SF" },
  { name: "Rocco Zikarsky", rank: 393, age: 19.2, team: "MIN", pos: "C" },
  { name: "Jericho Sims", rank: 394, age: 27.8, team: "MIL", pos: "C" },
  { name: "Charles Bassey", rank: 395, age: 25.8, team: "GSW", pos: "C" },
  { name: "Ariel Hukporti", rank: 396, age: 24.3, team: "NYK", pos: "C" },
  { name: "D'Angelo Russell", rank: 397, age: 30.4, team: "WAS", pos: "PG,SG" },
  { name: "Ziaire Williams", rank: 398, age: 24.9, team: "BKN", pos: "SF,PF" },
  { name: "Jamaree Bouyea", rank: 399, age: 27.1, team: "PHO", pos: "PG,SG" },
  { name: "Gary Payton II", rank: 400, age: 33.7, team: "GSW", pos: "PG,SG" },
  { name: "Jaden Ivey", rank: 401, age: 24.5, team: "FA", pos: "PG,SG" },
  { name: "Dalton Knecht", rank: 402, age: 25.3, team: "LAL", pos: "SG,SF" },
  { name: "Taurean Prince", rank: 403, age: 32.4, team: "MIL", pos: "SF,PF" },
  { name: "Kenrich Williams", rank: 404, age: 31.7, team: "OKC", pos: "PF" },
  { name: "Vince Williams Jr.", rank: 405, age: 25.9, team: "FA", pos: "SG,SF,PF" },
  { name: "Rayan Rupert", rank: 406, age: 22.2, team: "MEM", pos: "SG,SF" },
  { name: "Nae'Qwan Tomlin", rank: 407, age: 25.6, team: "CLE", pos: "PF" },
  { name: "Micah Peavy", rank: 408, age: 24.8, team: "NOP", pos: "SG,SF" },
  { name: "Dru Smith", rank: 409, age: 28.6, team: "MIA", pos: "SG" },
  { name: "Kam Jones", rank: 410, age: 24.4, team: "IND", pos: "PG,SG" },
  { name: "Alijah Martin", rank: 411, age: 23.8, team: "TOR", pos: "SG" },
  { name: "Jett Howard", rank: 412, age: 22.9, team: "ORL", pos: "SG,SF" },
  { name: "Caleb Martin", rank: 413, age: 30.8, team: "DAL", pos: "SG,SF" },
  { name: "Mike Conley", rank: 414, age: 38.8, team: "MIN", pos: "PG,SG" },
  { name: "Josh Okogie", rank: 415, age: 24.8, team: "HOU", pos: "SG,SF" },
  { name: "Buddy Hield", rank: 416, age: 33.6, team: "ATL", pos: "SG,SF" },
  { name: "Matisse Thybulle", rank: 417, age: 29.4, team: "POR", pos: "SG,SF" },
  { name: "Julian Reese", rank: 418, age: 23.1, team: "WAS", pos: "PF,C" },
  { name: "Trendon Watford", rank: 419, age: 25.7, team: "PHI", pos: "PF,C" },
  { name: "Chaz Lanier", rank: 420, age: 23.8, team: "DET", pos: "SG,SF" },
  { name: "Aaron Holiday", rank: 421, age: 29.8, team: "HOU", pos: "PG,SG" },
  { name: "Bronny James", rank: 422, age: 21.8, team: "LAL", pos: "SG" },
  { name: "Brooks Barnhizer", rank: 423, age: 23.6, team: "OKC", pos: "SG,SF" },
  { name: "Jahmai Mashack", rank: 424, age: 23.7, team: "MEM", pos: "SG,SF" },
  { name: "Nick Richards", rank: 425, age: 28.7, team: "CHI", pos: "C" },
  { name: "Jaden Hardy", rank: 426, age: 24.1, team: "WAS", pos: "SG,SF" },
  { name: "Elijah Harkless", rank: 427, age: 26.5, team: "UTA", pos: "SG" },
  { name: "Tre Mann", rank: 428, age: 25.5, team: "CHA", pos: "PG,SG" },
  { name: "Kyle Anderson", rank: 429, age: 32.9, team: "MIN", pos: "SF,PF" },
  { name: "AJ Johnson", rank: 430, age: 21.7, team: "DAL", pos: "PG,SG" },
  { name: "Javonte Green", rank: 431, age: 33, team: "DET", pos: "SG,SF" },
  { name: "Ben Sheppard", rank: 432, age: 25, team: "IND", pos: "SG,SF" },
  { name: "Cam Whitmore", rank: 433, age: 22.1, team: "WAS", pos: "SF" },
  { name: "Jonathan Mogbo", rank: 434, age: 24.7, team: "TOR", pos: "PF,C" },
  { name: "Ochai Agbaji", rank: 435, age: 26.3, team: "BKN", pos: "SG,SF" },
  { name: "Quenton Jackson", rank: 436, age: 27.9, team: "IND", pos: "PG,SG" },
  { name: "Thomas Bryant", rank: 437, age: 29, team: "CLE", pos: "C" },
  { name: "Pacome Dadiet", rank: 438, age: 21, team: "NYK", pos: "SF,PF" },
  { name: "Larry Nance Jr.", rank: 439, age: 33.6, team: "CLE", pos: "PF,C" },
  { name: "Svi Mykhailuk", rank: 440, age: 29.1, team: "UTA", pos: "SF,PF" },
  { name: "Jonathan Isaac", rank: 441, age: 28.8, team: "ORL", pos: "SF,PF" },
  { name: "Alex Toohey", rank: 442, age: 21.4, team: "GSW", pos: "SF,PF" },
  { name: "Olivier Maxence-Prosper", rank: 443, age: 24.1, team: "MEM", pos: "SF,PF" },
  { name: "Kris Murray", rank: 444, age: 25.9, team: "POR", pos: "SF,PF" },
  { name: "Jalen Wilson", rank: 445, age: 25.7, team: "BKN", pos: "SF,PF" },
  { name: "Lonzo Ball", rank: 446, age: 28.8, team: "FA", pos: "PG,SG" },
  { name: "Trayce Jackson-Davis", rank: 447, age: 26.4, team: "TOR", pos: "PF,C" },
  { name: "Taelon Peter", rank: 448, age: 23.6, team: "IND", pos: "SG" },
  { name: "Juan Nunez", rank: 449, age: 22.1, team: "SAS", pos: "PG" },
  { name: "Clint Capela", rank: 450, age: 32.2, team: "HOU", pos: "C" },
];

// Value function: convert rank to value points (higher = better)
function rankToValue(rank) {
  if (!rank || rank > 450) return 0.5;
  if (rank <= 10) return 100 - (rank - 1) * 5;     // 100, 95, 90...
  if (rank <= 30) return 55 - (rank - 10) * 1.5;    // 55 → 25
  if (rank <= 60) return 25 - (rank - 30) * 0.5;    // 25 → 10
  if (rank <= 120) return 10 - (rank - 60) * 0.1;   // 10 → 4
  if (rank <= 160) return 4 - (rank - 120) * 0.05;  // 4 → 2
  if (rank <= 220) return 2 - (rank - 160) * 0.02;  // 2 → 0.8
  if (rank <= 450) return 0.8 - (rank - 220) * 0.002;  // 0.8 → 0.34
  return 0.5;
}

// Age decay for different windows
function ageMultiplier(age, window) {
  if (window === '1yr') {
    // Next season: prime years are best, age doesn't matter much unless very old
    if (age >= 36) return 0.6;
    if (age >= 33) return 0.8;
    if (age >= 30) return 0.95;
    return 1.0;
  } else if (window === '5yr') {
    // 5-year window: youth matters more
    if (age >= 36) return 0.2;
    if (age >= 33) return 0.4;
    if (age >= 30) return 0.65;
    if (age >= 28) return 0.8;
    if (age >= 25) return 0.95;
    if (age >= 22) return 1.1;
    return 1.2; // Under 22 = premium
  } else {
    // Longer-term fallback: youth is king
    if (age >= 36) return 0.05;
    if (age >= 33) return 0.15;
    if (age >= 30) return 0.3;
    if (age >= 28) return 0.5;
    if (age >= 25) return 0.75;
    if (age >= 22) return 1.1;
    return 1.4; // Under 22 = massive premium
  }
}

// ===== Draft Pick Valuation =====
// Round-based base values (10-team league)
function pickRoundValue(round) {
  switch(round) {
    case 1: return 30;  // 1st rounders are gold
    case 2: return 15;
    case 3: return 8;
    case 4: return 5;
    case 5: return 3;
    case 6: return 2;
    case 7: return 1;
    default: return 1;
  }
}

// Boost pick value based on how bad the original team is (worse team = higher pick)
function teamStrengthMultiplier(wins, losses) {
  const totalGames = wins + losses || 1;
  const winPct = wins / totalGames;
  // Worse team = better pick = higher multiplier
  if (winPct <= 0.25) return 1.5;  // Lottery pick territory
  if (winPct <= 0.35) return 1.3;
  if (winPct <= 0.45) return 1.1;
  if (winPct <= 0.55) return 0.9;
  return 0.7;  // Contender pick = late round
}

// Time window multiplier for picks
function pickWindowMultiplier(season, window) {
  const yr = parseInt(season);
  if (window === '1yr') {
    // Next season: 2026 picks are about to be used, very valuable
    return yr === 2026 ? 1.2 : 0.7;
  } else if (window === '5yr') {
    // 5yr: all picks matter
    return yr <= 2027 ? 1.0 : 0.8;
  } else {
    // Longer-term: future picks are premium
    return yr <= 2027 ? 0.9 : 1.1;
  }
}

// Build draft pick inventory for each roster
function buildPickInventory(rosters, tradedPicks) {
  const NUM_ROUNDS = 7;
  const SEASONS = ['2026', '2027'];

  // Team record lookup by roster_id
  const teamRecords = {};
  rosters.forEach(r => {
    teamRecords[r.roster_id] = {
      wins: r.settings?.wins || 0,
      losses: r.settings?.losses || 0
    };
  });

  // Initialize: each team owns their own picks
  // Key: roster_id → array of { season, round, originalTeamId }
  const inventory = {};
  rosters.forEach(r => {
    inventory[r.roster_id] = [];
    SEASONS.forEach(s => {
      for (let rd = 1; rd <= NUM_ROUNDS; rd++) {
        inventory[r.roster_id].push({
          season: s,
          round: rd,
          originalTeamId: r.roster_id
        });
      }
    });
  });

  // Process trades: remove from previous owner, add to new owner
  tradedPicks.forEach(tp => {
    const fromId = tp.previous_owner_id;
    const toId = tp.owner_id;
    if (fromId === toId) return; // not actually traded

    // Remove from previous owner
    if (inventory[fromId]) {
      const idx = inventory[fromId].findIndex(p =>
        p.season === tp.season && p.round === tp.round && p.originalTeamId === tp.roster_id
      );
      if (idx >= 0) inventory[fromId].splice(idx, 1);
    }

    // Add to new owner
    if (inventory[toId]) {
      inventory[toId].push({
        season: tp.season,
        round: tp.round,
        originalTeamId: tp.roster_id
      });
    }
  });

  return { inventory, teamRecords };
}

// Calculate total draft capital value for a team in a given window
function calcDraftCapitalValue(picks, teamRecords, window) {
  let total = 0;
  const pickDetails = [];

  picks.forEach(p => {
    const baseVal = pickRoundValue(p.round);
    const rec = teamRecords[p.originalTeamId] || { wins: 20, losses: 20 };
    const strengthMult = teamStrengthMultiplier(rec.wins, rec.losses);
    const windowMult = pickWindowMultiplier(p.season, window);
    const val = baseVal * strengthMult * windowMult;
    total += val;

    if (p.round <= 2) { // Only show 1st and 2nd round picks in display
      pickDetails.push({
        label: `${p.season} Rd${p.round}`,
        originalTeam: p.originalTeamId,
        value: val.toFixed(1)
      });
    }
  });

  pickDetails.sort((a, b) => b.value - a.value);
  return { total, details: pickDetails };
}

// ===== Historical Performance Data (3 seasons from Sleeper) =====
const LEAGUE_HISTORY = {
  // roster_id -> historical data
  1: { name: 'Sneaky Athleticism', seasons: [{w:22,l:18,pf:8399},{w:25,l:15,pf:9840},{w:30,l:10,pf:9978}], chips: 0 },
  2: { name: 'Truz the Process', seasons: [{w:15,l:25,pf:7970},{w:8,l:32,pf:8558},{w:18,l:22,pf:9460}], chips: 0 },
  3: { name: 'Jschomm', seasons: [{w:11,l:29,pf:7525},{w:16,l:24,pf:9072},{w:17,l:23,pf:9285}], chips: 0 },
  4: { name: 'TrustTheProcess', seasons: [{w:6,l:34,pf:7084},{w:7,l:33,pf:8365},{w:6,l:34,pf:8483}], chips: 0 },
  5: { name: 'The Shams Bombs', seasons: [{w:25,l:15,pf:8606},{w:28,l:12,pf:10531},{w:25,l:15,pf:9883}], chips: 0 },
  6: { name: 'nmalo', seasons: [{w:17,l:23,pf:7968},{w:27,l:13,pf:10159},{w:10,l:30,pf:8633}], chips: 1 },
  7: { name: 'slipperynoodle69', seasons: [{w:22,l:18,pf:8251},{w:24,l:16,pf:10054},{w:34,l:6,pf:10462}], chips: 1 },
  8: { name: 'GetCade\'d', seasons: [{w:30,l:10,pf:8469},{w:18,l:22,pf:9307},{w:37,l:3,pf:10743}], chips: 0 },
  9: { name: 'massett2', seasons: [{w:31,l:9,pf:9411},{w:26,l:14,pf:9979},{w:14,l:26,pf:9166}], chips: 1 },
  10: { name: 'AustinCarter5', seasons: [{w:21,l:19,pf:8412},{w:21,l:19,pf:9731},{w:9,l:31,pf:8854}], chips: 0 }
};

function calcHistoricalScore(rosterId) {
  const h = LEAGUE_HISTORY[rosterId];
  if (!h) return { score: 0, winPct: 0, chips: 0, trend: 'flat', careerW: 0, careerL: 0 };

  let totalW = 0, totalL = 0, totalPF = 0;
  h.seasons.forEach(s => { totalW += s.w; totalL += s.l; totalPF += s.pf; });
  const totalG = totalW + totalL || 1;
  const winPct = totalW / totalG;

  // Trend: compare last season to first
  const first = h.seasons[0];
  const last = h.seasons[h.seasons.length - 1];
  const firstWP = first.w / (first.w + first.l || 1);
  const lastWP = last.w / (last.w + last.l || 1);
  const trendVal = lastWP - firstWP; // positive = improving
  const trend = trendVal > 0.1 ? 'rising' : trendVal < -0.1 ? 'falling' : 'steady';

  // Score: win% (0-100) + championship bonus + trend bonus
  let score = winPct * 60; // max 60
  score += h.chips * 20;   // 20 per championship
  score += trendVal * 30;  // trend bonus/penalty
  // PF bonus (normalized)
  const avgPF = totalPF / h.seasons.length;
  score += (avgPF - 8500) / 100; // roughly 0-25 range

  return { score: Math.max(0, score), winPct, chips: h.chips, trend, careerW: totalW, careerL: totalL };
}

// Main: Fetch rosters + users, calculate rankings
async function renderThreeTierRankings() {
  const containers = {
    '1yr': document.getElementById('rankings-1yr'),
    '5yr': document.getElementById('rankings-5yr')
  };

  Object.values(containers).forEach(el => {
    if (el) el.innerHTML = '<div class="loading">Loading power rankings</div>';
  });

  // Fetch data
  const BASE = 'https://api.sleeper.app/v1';
  const LEAGUE_ID = '1221920986723528704';

  let rosters, users, allPlayers;
  try {
    [rosters, users, allPlayers] = await Promise.all([
      fetch(`${BASE}/league/${LEAGUE_ID}/rosters`).then(r => r.json()),
      fetch(`${BASE}/league/${LEAGUE_ID}/users`).then(r => r.json()),
      fetch(`${BASE}/players/nba`).then(r => r.json())
    ]);
  } catch (e) {
    Object.values(containers).forEach(el => {
      if (el) el.innerHTML = '<p style="color:#999;">Failed to load data.</p>';
    });
    return;
  }

  // Owner name map (real names)
  const ownerNames = {
    '962450663101853696': 'Peter',
    '1002735718667612160': 'CJ',
    '738932675783647232': 'Schommer',
    '1013525285951606784': 'Schu',
    '1013523219346829312': 'Noah',
    '1015453331403218944': 'Noah', // co-owner
    '1013530783035850752': 'Nolan',
    '596410270528622592': 'Mitch', // co-owner with Christian
    '996235223224500224': 'Christian/Mitch',
    '878478967190016000': 'Austin'
  };
  // Roster ID to owner name fallback
  const rosterOwnerMap = {1:'Peter',2:'CJ',3:'Schommer',4:'Schu',5:'Noah',6:'Nolan',7:'Logan',8:'Kaleb',9:'Christian/Mitch',10:'Austin'};

  const userMap = {};
  users.forEach(u => {
    userMap[u.user_id] = ownerNames[u.user_id] || u.metadata?.team_name || u.display_name || u.username;
  });
  // Special: find Logan and Kaleb by roster
  // They'll get mapped via rosterOwnerMap below

  // Build team data with player names
  const teams = rosters.map(r => {
    const teamName = userMap[r.owner_id] || rosterOwnerMap[r.roster_id] || `Team ${r.roster_id}`;
    const playerNames = (r.players || []).map(pid => {
      const p = allPlayers[pid];
      if (!p) return null;
      return p.full_name || `${p.first_name} ${p.last_name}`;
    }).filter(Boolean);

    return {
      name: teamName,
      roster_id: r.roster_id,
      wins: r.settings?.wins || 0,
      losses: r.settings?.losses || 0,
      fpts: (r.settings?.fpts || 0) + (r.settings?.fpts_decimal || 0) / 100,
      playerNames: playerNames
    };
  });

  // Normalize accented characters to ASCII for matching
  function normalizeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function findByPlayerName(db, clean, cleaned, stripSuffix) {
    let match = db.find(d => normalizeAccents(d.name.toLowerCase()) === clean);
    if (!match) {
      match = db.find(d => stripSuffix(normalizeAccents(d.name.toLowerCase())) === cleaned);
    }
    return match || null;
  }

  // Match player name to current-season and dynasty DBs (handles accents and suffixes)
  function findRankedPlayer(playerName, window) {
    if (!playerName) return null;
    const clean = normalizeAccents(playerName.toLowerCase().trim());
    const stripSuffix = s => s.replace(/\s+(jr\.?|sr\.?|ii|iii|iv)$/i, '').trim();
    const cleaned = stripSuffix(clean);

    const seasonMatch = findByPlayerName(CURRENT_SEASON_POINTS_DB, clean, cleaned, stripSuffix);
    const match = findByPlayerName(DYNASTY_DB, clean, cleaned, stripSuffix);
    const dizzleMatch = findByPlayerName(DIZZLE_DYNASTY_POINTS_DB, clean, cleaned, stripSuffix);

    if (!seasonMatch && !match && !dizzleMatch) return null;

    const dizzleRank = dizzleMatch?.rank || null;
    const hashtagRank = match?.rank || null;
    const effectiveRank = hashtagRank && dizzleRank
      ? Math.round((hashtagRank + dizzleRank) / 2)
      : (hashtagRank || dizzleRank);

    return {
      name: match?.name || dizzleMatch?.name || seasonMatch?.name,
      rank: effectiveRank,
      seasonRank: seasonMatch?.rank || null,
      seasonPoints: seasonMatch?.points || null,
      seasonGp: seasonMatch?.gp || null,
      hashtagRank,
      dizzleRank,
      age: match?.age || dizzleMatch?.age || 27,
      team: match?.team || dizzleMatch?.team || '',
      pos: match?.pos || dizzleMatch?.pos || '',
      rankLabel: hashtagRank && dizzleRank
        ? `#${effectiveRank} avg · Hashtag #${hashtagRank} / Dizzle #${dizzleRank}`
        : dizzleMatch && effectiveRank
          ? `#${effectiveRank} · Dizzle #${dizzleRank}`
          : (effectiveRank ? `#${effectiveRank}` : `Season #${seasonMatch.rank}`)
    };
  }

  const componentWeightsByWindow = {
    '1yr':  { topEnd: 0.45, depth: 0.55, youngStars: 0.00, winNow: 0.00 },
    '5yr':  { topEnd: 0.35, depth: 0.25, youngStars: 0.35, winNow: 0.05 }
  };

  function teamKey(team) {
    return String(team.roster_id || team.name);
  }

  function buildWindowScores(window) {
    const weights = componentWeightsByWindow[window];
    const clampScore = value => Math.max(0, Math.min(100, value));
    const youngStarValue = player => {
      if (player.age >= 25 || player.rank > 150) return 0;
      const youthBoost = player.age < 22 ? 1.2 : 1;
      return rankToValue(player.rank) * youthBoost;
    };
    const winNowValue = player => {
      // Win-now is current-season rank value, not raw projected PPG.
      return player.seasonRank ? rankToValue(player.seasonRank) : 0;
    };

    const scored = teams.map(t => {
      let topPlayers = [];
      let rankedRanks = [];
      let unrankedCount = 0;

      t.playerNames.forEach(pName => {
        const dynMatch = findRankedPlayer(pName, window);
        if (dynMatch) {
          const baseVal = dynMatch.rank ? rankToValue(dynMatch.rank) : 0;
          const mult = ageMultiplier(dynMatch.age, window);
          const dynastyValue = baseVal * mult;
          const seasonValue = dynMatch.seasonRank ? rankToValue(dynMatch.seasonRank) : 0;
          const val = window === '1yr' ? seasonValue : dynastyValue;
          if (dynMatch.rank) rankedRanks.push(dynMatch.rank);
          topPlayers.push({
            name: dynMatch.name,
            rank: dynMatch.rank,
            rankLabel: window === '1yr' && dynMatch.seasonRank
              ? `Season #${dynMatch.seasonRank}`
              : dynMatch.rankLabel,
            seasonRank: dynMatch.seasonRank,
            seasonPoints: dynMatch.seasonPoints,
            seasonGp: dynMatch.seasonGp,
            hashtagRank: dynMatch.hashtagRank,
            dizzleRank: dynMatch.dizzleRank,
            age: dynMatch.age,
            value: val,
            dynastyValue,
            seasonValue,
            baseValue: baseVal
          });
        } else {
          unrankedCount += 1;
        }
      });

      topPlayers.sort((a, b) => b.value - a.value);
      const topEndValue = topPlayers.slice(0, 3).reduce((sum, p) => sum + p.value, 0);
      const depthValue = topPlayers.slice(0, 12).reduce((sum, p) => sum + p.value, 0);
      const youngStarsValue = topPlayers.reduce((sum, p) => sum + youngStarValue(p), 0);
      const winNowValueTotal = topPlayers.reduce((sum, p) => sum + winNowValue(p), 0);
      const topEndScore = clampScore((topEndValue / (window === '1yr' ? 160 : 210)) * 100);
      const depthScore = clampScore((depthValue / (window === '1yr' ? 360 : 300)) * 100);
      const youngStarsScore = clampScore((youngStarsValue / 180) * 100);
      const winNowScore = clampScore((winNowValueTotal / 360) * 100);
      const powerScore =
        topEndScore * weights.topEnd +
        depthScore * weights.depth +
        youngStarsScore * weights.youngStars +
        winNowScore * weights.winNow;

      // Top-15 average dynasty rank (lower = better). Fall back to whatever is
      // available if a roster somehow has fewer than 15 ranked players.
      const best15 = rankedRanks.slice().sort((a, b) => a - b).slice(0, 15);
      const avgTop15 = best15.length ? (best15.reduce((s, r) => s + r, 0) / best15.length) : 460;
      const top100Count = rankedRanks.filter(r => r <= 100).length;
      const youngCoreCount = topPlayers.filter(p => p.rank && p.age < 25 && p.rank <= 150).length;
      const winNowCount = topPlayers.filter(p => p.seasonRank && p.seasonRank <= 120).length;
      const eliteCount = rankedRanks.filter(r => r <= 30).length;

      return {
        ...t,
        topEndValue,
        depthValue,
        youngStarsValue,
        winNowValue: winNowValueTotal,
        avgTop15,
        topEndScore,
        depthScore,
        youngStarsScore,
        winNowScore,
        starScore: topEndScore,
        talentScore: topEndScore,
        powerScore,
        topPlayers: topPlayers.slice(0, 10),
        top100Count,
        youngCoreCount,
        winNowCount,
        eliteCount,
        unrankedCount
      };
    });

    return scored.sort((a, b) => b.powerScore - a.powerScore);
  }

  function getRankMovement(t, window, ranksByTeam) {
    const ranks = ranksByTeam[teamKey(t)] || {};
    if (window === '1yr') {
      const fiveYearRank = ranks['5yr'];
      if (!fiveYearRank || fiveYearRank === ranks['1yr']) return { label: 'Same 5Y slot', cls: 'neutral' };
      const delta = fiveYearRank - ranks['1yr'];
      return delta > 0
        ? { label: `${delta} spot${delta === 1 ? '' : 's'} lower in 5Y`, cls: 'down' }
        : { label: `${Math.abs(delta)} spot${Math.abs(delta) === 1 ? '' : 's'} higher in 5Y`, cls: 'up' };
    }

    const oneYearRank = ranks['1yr'];
    if (!oneYearRank || oneYearRank === ranks[window]) return { label: 'No window movement', cls: 'neutral' };
    const delta = oneYearRank - ranks[window];
    return delta > 0
      ? { label: `${delta} spot${delta === 1 ? '' : 's'} up vs win-now`, cls: 'up' }
      : { label: `${Math.abs(delta)} spot${Math.abs(delta) === 1 ? '' : 's'} down vs win-now`, cls: 'down' };
  }

  function getTeamVerdict(t, window) {
    const lead = t.topPlayers[0] ? `${t.topPlayers[0].name} anchors it` : 'No ranked anchor found';
    if (window === '1yr') {
      if (t.talentScore >= 75 && t.depthScore >= 70) return `Real title profile. ${lead}, and the depth is strong enough to survive a normal bad week.`;
      if (t.talentScore >= 70) return `Star-driven contender. ${lead}, but depth is the pressure point.`;
      if (t.depthScore >= 70) return `Deep roster, lighter on nuclear top-end talent. Needs the whole group to hit.`;
      return `Needs either a star jump or a consolidation trade before it looks scary next season.`;
    }
    if (t.youngCoreCount >= 6 && t.top100Count >= 7) return `Clean dynasty core. ${lead}, with enough young top-150 assets to age well.`;
    if (t.top100Count >= 8) return `Good five-year build, though some of the value is already in its prime.`;
    if (t.youngCoreCount >= 5) return `Future-leaning roster. The upside is real, but the proven top-end is thinner.`;
    return `Five-year value is fragile unless a few younger pieces make a leap.`;
  }

  function scoreBar(label, value, cls = '') {
    const pct = Math.max(0, Math.min(100, Math.round(value || 0)));
    return `<div class="signal-bar ${cls}">
      <div class="signal-bar-label"><span>${label}</span><strong>${pct}/100</strong></div>
      <div class="signal-bar-track"><i style="width:${pct}%"></i></div>
    </div>`;
  }

  function getRiskScore(t) {
    const shallowPenalty = Math.max(0, 6 - t.top100Count) * 10;
    const imbalancePenalty = Math.abs(t.talentScore - t.depthScore) * 0.45;
    const agePenalty = Math.max(0, t.winNowCount - t.youngCoreCount) * 8;
    return Math.min(100, shallowPenalty + imbalancePenalty + agePenalty + t.unrankedCount * 2);
  }

  function getTimelineLabel(t, ranks) {
    const one = ranks['1yr'];
    const five = ranks['5yr'];
    const avgRank = (one + five) / 2;
    if (one <= 2 && five <= 3) return 'Title Favorite';
    if (one <= 4 && five <= 5) return 'Contender';
    if (five <= 4 && one <= 6) return 'Dynasty Core';
    if (five <= 4 && one >= 7) return 'Future Build';
    if (one <= 4 && five >= 7) return 'Aging Win-Now';
    if (avgRank >= 8.5) return five <= 6 ? 'Deep Rebuild' : 'Bottom Tier';
    if (avgRank >= 7) return t.youngCoreCount >= 5 ? 'Rebuild Upside' : 'Retool Needed';
    if (avgRank >= 5.5) return t.youngCoreCount >= 5 && t.top100Count < 7 ? 'Upside Bet' : 'Playoff Fringe';
    return 'Solid Middle';
  }

  function getTier(rank) {
    if (rank <= 3) return { label: 'Tier 1: Title Contenders', cls: 'tier-one' };
    if (rank <= 7) return { label: 'Tier 2: Middle / Playoff Mix', cls: 'tier-two' };
    return { label: 'Tier 3: Rebuild / Bottom Tier', cls: 'tier-three' };
  }

  function getTeamWriteup(t, window, rank, ranksByTeam) {
    const ranks = ranksByTeam[teamKey(t)] || {};
    const lead = t.topPlayers[0]?.name || 'the top asset';
    const second = t.topPlayers[1]?.name;
    const core = second ? `${lead} and ${second}` : lead;
    const risk = getRiskScore(t);
    const rankLine = window === '1yr'
      ? `This is the win-now lens, where ${t.name} checks in at #${rank}.`
      : `This is the five-year dynasty lens, where ${t.name} checks in at #${rank}.`;
    const strength = t.talentScore >= t.depthScore
      ? `${core} drives the ranking with stronger star power than depth.`
      : `${core} gives the roster an anchor, but the broader depth is what really lifts the score.`;
    let concern = `The concern is risk: ${t.unrankedCount} roster spots are outside the current dynasty list, and the risk bar sits at ${Math.round(risk)}/100.`;
    if (t.youngCoreCount >= 6) concern = `The long-term floor is helped by ${t.youngCoreCount} young top-150 assets, which keeps the roster from being just a short-term build.`;
    if (window === '1yr' && t.winNowCount >= 4) concern = `The current-season profile is helped by ${t.winNowCount} useful win-now veterans, though that value fades in longer windows.`;
    const move = ranks['1yr'] && ranks['5yr'] && ranks['1yr'] !== ranks['5yr']
      ? `The window movement tells the story: #${ranks['1yr']} this year versus #${ranks['5yr']} in the 5-year view.`
      : `The ranking is fairly stable across windows, which usually means the roster is balanced instead of one-timeline dependent.`;
    return `${rankLine} ${strength} ${concern} ${move}`;
  }

  function renderDriverGroup(label, players, emptyText) {
    const content = players.length
      ? players.map(p => `<span class="player-pill"><strong>${p.name}</strong> <span>${p.rankLabel || `#${p.rank}`}</span></span>`).join(' ')
      : `<span class="driver-empty">${emptyText}</span>`;
    return `<div class="driver-group"><h4>${label}</h4><div class="player-pill-row">${content}</div></div>`;
  }

  function renderOverallIndex(scoredByWindow, ranksByTeam) {
    const container = document.getElementById('overall-index');
    if (!container) return;
    const byKey = {};
    Object.entries(scoredByWindow).forEach(([window, scored]) => {
      scored.forEach(t => {
        const key = teamKey(t);
        if (!byKey[key]) byKey[key] = { team: t, scores: {} };
        byKey[key].scores[window] = t.powerScore;
      });
    });
    const rows = Object.values(byKey).map(row => {
      const overall = row.scores['1yr'] * 0.45 + row.scores['5yr'] * 0.55;
      return { ...row, overall };
    }).sort((a, b) => b.overall - a.overall);

    let html = '<div class="overall-table-wrap"><table class="overall-table"><thead><tr><th>#</th><th>Team</th><th>Overall</th><th>This Year</th><th>5Y</th><th>Profile</th><th>Movement</th></tr></thead><tbody>';
    rows.forEach((row, i) => {
      const ranks = ranksByTeam[teamKey(row.team)] || {};
      const delta = ranks['5yr'] - ranks['1yr'];
      const movement = delta === 0 ? 'Stable' : delta > 0 ? `${delta} lower in 5Y` : `${Math.abs(delta)} higher in 5Y`;
      html += `<tr>
        <td><span class="rank-num">${i + 1}</span></td>
        <td><strong>${row.team.name}</strong></td>
        <td>${row.overall.toFixed(1)}</td>
        <td>${ranks['1yr'] || '-'}</td>
        <td>${ranks['5yr'] || '-'}</td>
        <td><span class="profile-pill">${getTimelineLabel(row.team, ranks)}</span></td>
        <td>${movement}</td>
      </tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
  }

  const scoredByWindow = {};
  ['1yr', '5yr'].forEach(window => {
    scoredByWindow[window] = buildWindowScores(window);
  });

  const ranksByTeam = {};
  Object.entries(scoredByWindow).forEach(([window, scored]) => {
    scored.forEach((team, index) => {
      const key = teamKey(team);
      if (!ranksByTeam[key]) ranksByTeam[key] = {};
      ranksByTeam[key][window] = index + 1;
    });
  });

  // Power score = fixed-scale blend of current-roster signals only (no draft capital, no history):
  // The 1-year view uses Hashtag's current-season points rankings only.
  // The 5-year view uses dynasty rank. If a player appears on Hashtag and
  // Dizzle, the effective dynasty rank is a straight average: Hashtag #5 + Dizzle #7 = #6.
  //   1. Top-end talent — the best three players in the selected window
  //   2. Depth — the best twelve players in the selected window
  //   3. Young stars — under-25 top-150 dynasty assets
  //   4. Win-now pieces — current-season rank value
  renderOverallIndex(scoredByWindow, ranksByTeam);

  ['1yr', '5yr'].forEach(window => {
    const scored = scoredByWindow[window];
    const container = containers[window];
    if (!container) return;

    let html = '';
    scored.forEach((t, i) => {
      const rank = i + 1;
      const tier = getTier(rank);
      const movement = getRankMovement(t, window, ranksByTeam);
      const verdict = getTeamVerdict(t, window);
      const writeup = getTeamWriteup(t, window, rank, ranksByTeam);
      const ranks = ranksByTeam[teamKey(t)] || {};
      const profile = getTimelineLabel(t, ranks);
      const riskScore = getRiskScore(t);
      const topFive = t.topPlayers.slice(0, 5);
      const youngAssets = t.topPlayers.filter(p => p.rank && p.age < 25 && p.rank <= 150).slice(0, 5);
      const winNowPieces = t.topPlayers.filter(p => p.seasonRank && p.seasonRank <= 120).slice(0, 5);

      const cardId = `card-${window}-${i}`;

      if (rank === 1 || rank === 4 || rank === 8) {
        html += `<div class="tier-divider ${tier.cls}">${tier.label}</div>`;
      }

      html += `<div class="pr-card pr-card--ranking" onclick="document.getElementById('${cardId}').style.display = document.getElementById('${cardId}').style.display === 'none' ? 'block' : 'none'; this.querySelector('.expand-icon').textContent = document.getElementById('${cardId}').style.display === 'none' ? '▶' : '▼';">
        <div class="pr-card-main">
          <div class="pr-rank">${rank}</div>
          <div class="pr-team">
            <div class="pr-team-title">
              <h3>${t.name}</h3>
              <span class="profile-pill">${profile}</span>
              <span class="movement-badge ${movement.cls}">${movement.label}</span>
            </div>
            <p>${verdict}</p>
          </div>
          <div class="pr-score">
            <div>${t.powerScore.toFixed(1)}</div>
            <span>Power Score</span>
          </div>
          <span class="expand-icon">▶</span>
        </div>
        <div id="${cardId}" class="pr-card-detail">
          <p class="team-writeup">${writeup}</p>
          <div class="signal-bars">
            ${scoreBar('Star Power', t.starScore)}
            ${scoreBar('Depth', t.depthScore)}
            ${scoreBar('Young Stars', t.youngStarsScore)}
            ${scoreBar('Win-Now Value', t.winNowScore)}
            ${scoreBar('Risk', riskScore, 'risk')}
          </div>
          <div class="signal-grid">
            <div><span>Top-15 Avg</span><strong>${t.avgTop15.toFixed(1)}</strong></div>
            <div><span>Top End</span><strong>${t.topEndScore.toFixed(0)}/100</strong></div>
            <div><span>Depth</span><strong>${t.depthScore.toFixed(0)}/100</strong></div>
            <div><span>Top 100</span><strong>${t.top100Count}</strong></div>
            <div><span>Young Core</span><strong>${t.youngCoreCount}</strong></div>
            <div><span>Unranked</span><strong>${t.unrankedCount}</strong></div>
          </div>
          <div class="driver-grid">
            ${renderDriverGroup('Top 5 Drivers', topFive, 'No ranked players found')}
            ${renderDriverGroup('Young Assets', youngAssets, 'No young top-150 assets')}
            ${renderDriverGroup('Win-Now Pieces', winNowPieces, 'No top-120 current-season pieces')}
          </div>
        </div>
      </div>`;
    });

    container.innerHTML = html;
  });
}
