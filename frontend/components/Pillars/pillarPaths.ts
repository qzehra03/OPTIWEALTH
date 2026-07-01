// SVG path strings (d attribute) for the 4 Pillar ribbon states
// ViewBox is assumed to be 0 0 200 600

export const pillarPaths = [
  // State 1: The 50/30/20 budget splitter (three branching paths)
  "M 100,0 L 105,0 L 105,150 Q 105,250 50,350 L 50,600 L 40,600 L 40,350 Q 95,250 95,150 L 95,0 Z M 100,0 M 105,150 Q 105,270 120,350 L 120,600 L 110,600 L 110,350 Q 95,270 95,150 Z M 100,0 M 105,150 Q 105,290 170,350 L 170,600 L 165,600 L 165,350 Q 95,290 95,150 Z",

  // State 2: The 4% safe withdrawal rule (thin strand peeling off)
  "M 100,0 L 110,0 L 110,200 Q 110,250 40,300 L 20,400 L 15,400 L 35,300 Q 100,250 100,200 Z M 100,0 M 110,0 L 110,600 L 100,600 L 100,0 Z",

  // State 3: The 20/4/10 vehicle affordability cap (structural, angular, blocky stairs)
  "M 80,0 L 120,0 L 120,150 L 170,150 L 170,300 L 140,300 L 140,450 L 30,450 L 30,300 L 60,300 L 60,150 L 80,150 Z M 95,150 L 105,150 L 105,300 L 95,300 Z",

  // State 4: The 25x True Freedom multiplier (fanning explosion at the bottom)
  "M 95,0 L 105,0 L 105,300 L 200,600 L 0,600 L 95,300 Z M 100,300 L 100,600 L 98,600 L 98,300 Z M 100,300 L 50,600 L 48,600 L 98,300 Z M 100,300 L 150,600 L 148,600 L 98,300 Z"
];
