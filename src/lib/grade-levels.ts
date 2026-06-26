export const GRADES = ["Std 1","Std 2","Std 3","Std 4","Std 5","Std 6","Std 7","Std 8","Std 9","Std 10"];
export const LANGUAGES = ["Gujarati","Hindi","Marathi","Bengali","Urdu","Tamil","Telugu","Odia","Rajasthani","Other"];

export type Level = { id: string; label: string; expected?: boolean };
export type GradeData = { subjects: string[]; [subject: string]: Level[] | string[] };

export const GRADE_LEVELS: Record<string, GradeData> = {
  "Std 1": {
    subjects: ["Gujarati", "English", "Math"],
    Gujarati: [
      { id:"g1_gu_0", label:"Does not recognise Gujarati letters (kakko)" },
      { id:"g1_gu_1", label:"Recognises some letters of kakko" },
      { id:"g1_gu_2", label:"Knows full kakko (vowels + consonants)", expected:true },
      { id:"g1_gu_3", label:"Reads simple 2–3 letter words (no matra)" },
      { id:"g1_gu_4", label:"Reads simple words with matra" },
    ],
    English: [
      { id:"g1_en_0", label:"Does not recognise English letters" },
      { id:"g1_en_1", label:"Recognises some capital letters" },
      { id:"g1_en_2", label:"Knows all capital and small letters (A–Z)", expected:true },
      { id:"g1_en_3", label:"Reads simple 3-letter words (cat, dog)" },
      { id:"g1_en_4", label:"Writes letters and simple words" },
    ],
    Math: [
      { id:"g1_ma_0", label:"Cannot count to 10" },
      { id:"g1_ma_1", label:"Counts 1–10 verbally" },
      { id:"g1_ma_2", label:"Recognises and writes numbers 1–20", expected:true },
      { id:"g1_ma_3", label:"Counts and writes numbers up to 50" },
      { id:"g1_ma_4", label:"Simple addition within 10" },
    ],
  },
  "Std 2": {
    subjects: ["Gujarati", "English", "Math"],
    Gujarati: [
      { id:"g2_gu_0", label:"Does not recognise letters" },
      { id:"g2_gu_1", label:"Knows kakko but cannot read words" },
      { id:"g2_gu_2", label:"Reads simple words (no matra)" },
      { id:"g2_gu_3", label:"Reads words with common matra", expected:true },
      { id:"g2_gu_4", label:"Reads short sentences fluently" },
      { id:"g2_gu_5", label:"Reads a short paragraph with understanding" },
    ],
    English: [
      { id:"g2_en_0", label:"Does not recognise letters" },
      { id:"g2_en_1", label:"Knows alphabet A–Z" },
      { id:"g2_en_2", label:"Reads 3-letter CVC words (cat, pin)", expected:true },
      { id:"g2_en_3", label:"Reads simple sentences" },
      { id:"g2_en_4", label:"Writes words from dictation" },
    ],
    Math: [
      { id:"g2_ma_0", label:"Cannot count to 20" },
      { id:"g2_ma_1", label:"Counts 1–50" },
      { id:"g2_ma_2", label:"Recognises numbers up to 100" },
      { id:"g2_ma_3", label:"Addition within 20", expected:true },
      { id:"g2_ma_4", label:"Addition and subtraction within 50" },
      { id:"g2_ma_5", label:"Understands tens and ones (place value)" },
    ],
  },
  "Std 3": {
    subjects: ["Gujarati", "English", "Math", "EVS"],
    Gujarati: [
      { id:"g3_gu_0", label:"Cannot read words independently" },
      { id:"g3_gu_1", label:"Reads simple words with help" },
      { id:"g3_gu_2", label:"Reads sentences slowly" },
      { id:"g3_gu_3", label:"Reads a short paragraph independently", expected:true },
      { id:"g3_gu_4", label:"Reads and understands a full page" },
      { id:"g3_gu_5", label:"Writes a short paragraph (3–5 sentences)" },
    ],
    English: [
      { id:"g3_en_0", label:"Does not recognise letters" },
      { id:"g3_en_1", label:"Reads individual words" },
      { id:"g3_en_2", label:"Reads simple sentences" },
      { id:"g3_en_3", label:"Reads a short passage with help", expected:true },
      { id:"g3_en_4", label:"Answers simple questions on a passage" },
      { id:"g3_en_5", label:"Writes 2–3 sentences independently" },
    ],
    Math: [
      { id:"g3_ma_0", label:"Cannot do addition within 50" },
      { id:"g3_ma_1", label:"Addition and subtraction within 100" },
      { id:"g3_ma_2", label:"2-digit addition with carrying" },
      { id:"g3_ma_3", label:"3-digit addition and subtraction", expected:true },
      { id:"g3_ma_4", label:"Multiplication tables 2–5" },
      { id:"g3_ma_5", label:"Multiplication tables up to 10" },
    ],
    EVS: [
      { id:"g3_ev_0", label:"No awareness of surroundings or nature" },
      { id:"g3_ev_1", label:"Knows family, home, basic body parts" },
      { id:"g3_ev_2", label:"Knows plants, animals, food sources" },
      { id:"g3_ev_3", label:"Understands water, air, weather basics", expected:true },
      { id:"g3_ev_4", label:"Knows local community and helpers" },
    ],
  },
  "Std 4": {
    subjects: ["Gujarati", "English", "Math", "EVS"],
    Gujarati: [
      { id:"g4_gu_0", label:"Cannot read a paragraph" },
      { id:"g4_gu_1", label:"Reads slowly with many errors" },
      { id:"g4_gu_2", label:"Reads a page with some help" },
      { id:"g4_gu_3", label:"Reads and understands a full passage", expected:true },
      { id:"g4_gu_4", label:"Writes a paragraph with correct spelling" },
      { id:"g4_gu_5", label:"Writes independently on a given topic" },
    ],
    English: [
      { id:"g4_en_0", label:"Cannot read sentences" },
      { id:"g4_en_1", label:"Reads sentences with difficulty" },
      { id:"g4_en_2", label:"Reads a short passage" },
      { id:"g4_en_3", label:"Reads passage and answers questions", expected:true },
      { id:"g4_en_4", label:"Writes a short paragraph" },
      { id:"g4_en_5", label:"Uses basic grammar (is/are, has/have)" },
    ],
    Math: [
      { id:"g4_ma_0", label:"Cannot multiply" },
      { id:"g4_ma_1", label:"Knows multiplication tables up to 5" },
      { id:"g4_ma_2", label:"Knows multiplication tables up to 10" },
      { id:"g4_ma_3", label:"4-digit addition and subtraction", expected:true },
      { id:"g4_ma_4", label:"Multiplication of 2-digit numbers" },
      { id:"g4_ma_5", label:"Simple division with remainder" },
    ],
    EVS: [
      { id:"g4_ev_0", label:"No knowledge of EVS topics" },
      { id:"g4_ev_1", label:"Knows basic Std 3 EVS" },
      { id:"g4_ev_2", label:"Understands shelter, clothing, food chains" },
      { id:"g4_ev_3", label:"Knows basic maps and directions (N/S/E/W)", expected:true },
      { id:"g4_ev_4", label:"Knows Gujarat — cities, rivers, districts" },
    ],
  },
  "Std 5": {
    subjects: ["Gujarati", "English", "Math", "Science", "Social Science"],
    Gujarati: [
      { id:"g5_gu_0", label:"Cannot read a paragraph fluently" },
      { id:"g5_gu_1", label:"Reads slowly, meaning unclear" },
      { id:"g5_gu_2", label:"Reads and understands a passage" },
      { id:"g5_gu_3", label:"Reads any Std 4–5 text independently", expected:true },
      { id:"g5_gu_4", label:"Writes a paragraph on a topic" },
      { id:"g5_gu_5", label:"Writes an essay (10–12 sentences)" },
    ],
    English: [
      { id:"g5_en_0", label:"Cannot read sentences" },
      { id:"g5_en_1", label:"Reads simple sentences" },
      { id:"g5_en_2", label:"Reads a short passage" },
      { id:"g5_en_3", label:"Reads and comprehends a passage", expected:true },
      { id:"g5_en_4", label:"Writes a short paragraph on a topic" },
      { id:"g5_en_5", label:"Uses tenses (present, past) correctly" },
    ],
    Math: [
      { id:"g5_ma_0", label:"Cannot multiply 2-digit numbers" },
      { id:"g5_ma_1", label:"Multiplies 2-digit numbers" },
      { id:"g5_ma_2", label:"Long division basics" },
      { id:"g5_ma_3", label:"Fractions — addition and subtraction", expected:true },
      { id:"g5_ma_4", label:"Decimals — concept and basic operations" },
      { id:"g5_ma_5", label:"Area and perimeter of basic shapes" },
    ],
    Science: [
      { id:"g5_sc_0", label:"No basic science knowledge" },
      { id:"g5_sc_1", label:"Knows plants, animals, body parts" },
      { id:"g5_sc_2", label:"Understands food, health, hygiene" },
      { id:"g5_sc_3", label:"Knows states of matter and simple machines", expected:true },
      { id:"g5_sc_4", label:"Understands Std 5 Science textbook fully" },
    ],
    "Social Science": [
      { id:"g5_ss_0", label:"Cannot locate India on a map" },
      { id:"g5_ss_1", label:"Knows India, states and capital cities" },
      { id:"g5_ss_2", label:"Knows Indian geography — rivers, mountains" },
      { id:"g5_ss_3", label:"Knows basic Indian history (freedom struggle)", expected:true },
      { id:"g5_ss_4", label:"Understands Std 5 Social Science fully" },
    ],
  },
  "Std 6": {
    subjects: ["Gujarati", "English", "Math", "Science", "Social Science"],
    Gujarati: [
      { id:"g6_gu_0", label:"Cannot read fluently" },
      { id:"g6_gu_1", label:"Reads but struggles with comprehension" },
      { id:"g6_gu_2", label:"Reads and understands passages" },
      { id:"g6_gu_3", label:"Writes paragraphs and short essays", expected:true },
      { id:"g6_gu_4", label:"Understands grammar (kriya, visheshan)" },
      { id:"g6_gu_5", label:"Writes creatively with correct grammar" },
    ],
    English: [
      { id:"g6_en_0", label:"Cannot read a passage" },
      { id:"g6_en_1", label:"Reads simple sentences only" },
      { id:"g6_en_2", label:"Reads a passage with difficulty" },
      { id:"g6_en_3", label:"Reads and answers comprehension questions", expected:true },
      { id:"g6_en_4", label:"Writes a paragraph with correct sentences" },
      { id:"g6_en_5", label:"Uses grammar — tenses, articles, prepositions" },
    ],
    Math: [
      { id:"g6_ma_0", label:"Cannot work with fractions" },
      { id:"g6_ma_1", label:"Basic fractions and decimals" },
      { id:"g6_ma_2", label:"Integers and basic algebra" },
      { id:"g6_ma_3", label:"Ratio, proportion, percentages", expected:true },
      { id:"g6_ma_4", label:"Perimeter, area of rectangles and triangles" },
      { id:"g6_ma_5", label:"Data handling — bar graphs and tables" },
    ],
    Science: [
      { id:"g6_sc_0", label:"No Std 6 science knowledge" },
      { id:"g6_sc_1", label:"Knows basic matter and living things" },
      { id:"g6_sc_2", label:"Understands cell basics and body systems" },
      { id:"g6_sc_3", label:"Knows motion, light and electricity basics", expected:true },
      { id:"g6_sc_4", label:"Understands Std 6 Science textbook fully" },
    ],
    "Social Science": [
      { id:"g6_ss_0", label:"Cannot recall basic history" },
      { id:"g6_ss_1", label:"Knows Indian freedom struggle basics" },
      { id:"g6_ss_2", label:"Knows ancient Indian history (Indus Valley etc.)" },
      { id:"g6_ss_3", label:"Understands Indian Constitution basics", expected:true },
      { id:"g6_ss_4", label:"Understands Std 6 Social Science fully" },
    ],
  },
  "Std 7": {
    subjects: ["Gujarati", "English", "Math", "Science", "Social Science"],
    Gujarati: [
      { id:"g7_gu_0", label:"Cannot write independently" },
      { id:"g7_gu_1", label:"Writes simple sentences" },
      { id:"g7_gu_2", label:"Writes paragraphs with errors" },
      { id:"g7_gu_3", label:"Writes essays and formal letters", expected:true },
      { id:"g7_gu_4", label:"Understands and uses grammar correctly" },
      { id:"g7_gu_5", label:"Reads and analyses poetry and prose" },
    ],
    English: [
      { id:"g7_en_0", label:"Cannot write sentences" },
      { id:"g7_en_1", label:"Writes simple sentences" },
      { id:"g7_en_2", label:"Writes a short paragraph" },
      { id:"g7_en_3", label:"Writes on a topic with correct grammar", expected:true },
      { id:"g7_en_4", label:"Uses all tenses correctly" },
      { id:"g7_en_5", label:"Reads unseen passages and comprehends" },
    ],
    Math: [
      { id:"g7_ma_0", label:"Cannot solve basic equations" },
      { id:"g7_ma_1", label:"Simple linear equations (one variable)" },
      { id:"g7_ma_2", label:"Ratio, proportion and percentage" },
      { id:"g7_ma_3", label:"Simple interest calculations", expected:true },
      { id:"g7_ma_4", label:"Exponents and powers" },
      { id:"g7_ma_5", label:"Data handling — mean, median, mode" },
    ],
    Science: [
      { id:"g7_sc_0", label:"No Std 7 science knowledge" },
      { id:"g7_sc_1", label:"Understands nutrition and digestion" },
      { id:"g7_sc_2", label:"Knows acids, bases and physical vs chemical change" },
      { id:"g7_sc_3", label:"Understands heat and electric circuits", expected:true },
      { id:"g7_sc_4", label:"Understands Std 7 Science fully" },
    ],
    "Social Science": [
      { id:"g7_ss_0", label:"No Std 7 social science knowledge" },
      { id:"g7_ss_1", label:"Knows medieval Indian history basics" },
      { id:"g7_ss_2", label:"Understands democracy and government" },
      { id:"g7_ss_3", label:"Knows geographical features of India", expected:true },
      { id:"g7_ss_4", label:"Understands Std 7 Social Science fully" },
    ],
  },
  "Std 8": {
    subjects: ["Gujarati", "English", "Math", "Science", "Social Science"],
    Gujarati: [
      { id:"g8_gu_0", label:"Cannot read complex text" },
      { id:"g8_gu_1", label:"Reads but struggles with meaning" },
      { id:"g8_gu_2", label:"Reads and understands prose and poetry" },
      { id:"g8_gu_3", label:"Writes letters, essays and applications", expected:true },
      { id:"g8_gu_4", label:"Understands grammar at Std 8 level" },
      { id:"g8_gu_5", label:"Analyses texts and expresses opinion in writing" },
    ],
    English: [
      { id:"g8_en_0", label:"Cannot write independently" },
      { id:"g8_en_1", label:"Writes simple paragraphs" },
      { id:"g8_en_2", label:"Writes letters and short essays" },
      { id:"g8_en_3", label:"Writes on any topic with basic grammar", expected:true },
      { id:"g8_en_4", label:"Uses active and passive voice correctly" },
      { id:"g8_en_5", label:"Reads unseen passages and writes summary" },
    ],
    Math: [
      { id:"g8_ma_0", label:"Cannot handle algebraic expressions" },
      { id:"g8_ma_1", label:"Linear equations (one and two variables)" },
      { id:"g8_ma_2", label:"Quadrilaterals and polygons" },
      { id:"g8_ma_3", label:"Squares, cubes and their roots", expected:true },
      { id:"g8_ma_4", label:"Algebraic identities and factorisation" },
      { id:"g8_ma_5", label:"Mensuration — area of composite shapes" },
    ],
    Science: [
      { id:"g8_sc_0", label:"No Std 8 science knowledge" },
      { id:"g8_sc_1", label:"Understands crop production and microorganisms" },
      { id:"g8_sc_2", label:"Knows metals, non-metals, coal and petroleum" },
      { id:"g8_sc_3", label:"Understands force, pressure, sound and light", expected:true },
      { id:"g8_sc_4", label:"Understands cell structure and reproduction basics" },
      { id:"g8_sc_5", label:"Understands Std 8 Science fully" },
    ],
    "Social Science": [
      { id:"g8_ss_0", label:"No Std 8 social science knowledge" },
      { id:"g8_ss_1", label:"Knows the Indian independence movement" },
      { id:"g8_ss_2", label:"Understands Indian Constitution and laws" },
      { id:"g8_ss_3", label:"Understands natural resources and agriculture", expected:true },
      { id:"g8_ss_4", label:"Understands Std 8 Social Science fully" },
    ],
  },
  "Std 9": {
    subjects: ["Gujarati", "English", "Math", "Science", "Social Science"],
    Gujarati: [
      { id:"g9_gu_0", label:"Cannot write formal pieces" },
      { id:"g9_gu_1", label:"Writes simple paragraphs" },
      { id:"g9_gu_2", label:"Writes essays and formal letters" },
      { id:"g9_gu_3", label:"Reads and writes at Std 9 level", expected:true },
      { id:"g9_gu_4", label:"Analyses prose and poetry with explanation" },
      { id:"g9_gu_5", label:"Writes with strong grammar and expression" },
    ],
    English: [
      { id:"g9_en_0", label:"Cannot write formal English" },
      { id:"g9_en_1", label:"Writes simple sentences and paragraphs" },
      { id:"g9_en_2", label:"Writes letters and essays" },
      { id:"g9_en_3", label:"Reads and answers comprehension at Std 9 level", expected:true },
      { id:"g9_en_4", label:"Uses grammar accurately in writing" },
      { id:"g9_en_5", label:"Writes formal and informal pieces fluently" },
    ],
    Math: [
      { id:"g9_ma_0", label:"Cannot handle Std 9 math concepts" },
      { id:"g9_ma_1", label:"Number systems and irrational numbers" },
      { id:"g9_ma_2", label:"Polynomials and algebraic identities" },
      { id:"g9_ma_3", label:"Linear equations in two variables", expected:true },
      { id:"g9_ma_4", label:"Triangles, quadrilaterals and circles" },
      { id:"g9_ma_5", label:"Surface area and volume" },
      { id:"g9_ma_6", label:"Statistics and probability basics" },
    ],
    Science: [
      { id:"g9_sc_0", label:"No Std 9 science knowledge" },
      { id:"g9_sc_1", label:"Knows matter, atoms and molecules" },
      { id:"g9_sc_2", label:"Understands cells and tissues" },
      { id:"g9_sc_3", label:"Knows motion, force and laws of motion", expected:true },
      { id:"g9_sc_4", label:"Understands gravitation, work and energy" },
      { id:"g9_sc_5", label:"Understands Std 9 Science fully" },
    ],
    "Social Science": [
      { id:"g9_ss_0", label:"No Std 9 social science knowledge" },
      { id:"g9_ss_1", label:"Knows French Revolution and rise of socialism" },
      { id:"g9_ss_2", label:"Understands Indian independence and partition" },
      { id:"g9_ss_3", label:"Knows electoral politics and democracy", expected:true },
      { id:"g9_ss_4", label:"Understands climate, vegetation and population" },
      { id:"g9_ss_5", label:"Understands Std 9 Social Science fully" },
    ],
  },
  "Std 10": {
    subjects: ["Gujarati", "English", "Math", "Science", "Social Science"],
    Gujarati: [
      { id:"g10_gu_0", label:"Cannot write formal Gujarati" },
      { id:"g10_gu_1", label:"Writes essays and letters with errors" },
      { id:"g10_gu_2", label:"Writes clearly at Std 10 level" },
      { id:"g10_gu_3", label:"Reads and analyses literature", expected:true },
      { id:"g10_gu_4", label:"Writes with command over grammar" },
      { id:"g10_gu_5", label:"Board-exam ready in Gujarati" },
    ],
    English: [
      { id:"g10_en_0", label:"Cannot write formal English" },
      { id:"g10_en_1", label:"Writes basic sentences and paragraphs" },
      { id:"g10_en_2", label:"Reads passages and answers questions" },
      { id:"g10_en_3", label:"Writes essays, letters and reports", expected:true },
      { id:"g10_en_4", label:"Uses grammar correctly in all writing" },
      { id:"g10_en_5", label:"Board-exam ready in English" },
    ],
    Math: [
      { id:"g10_ma_0", label:"Cannot handle Std 10 math" },
      { id:"g10_ma_1", label:"Real numbers and polynomials" },
      { id:"g10_ma_2", label:"Quadratic equations" },
      { id:"g10_ma_3", label:"Arithmetic progressions", expected:true },
      { id:"g10_ma_4", label:"Triangles, circles and constructions" },
      { id:"g10_ma_5", label:"Trigonometry basics" },
      { id:"g10_ma_6", label:"Areas, surface areas and volumes" },
      { id:"g10_ma_7", label:"Board-exam ready in Math" },
    ],
    Science: [
      { id:"g10_sc_0", label:"No Std 10 science knowledge" },
      { id:"g10_sc_1", label:"Chemical reactions, acids and bases" },
      { id:"g10_sc_2", label:"Metals, non-metals and carbon compounds" },
      { id:"g10_sc_3", label:"Life processes and reproduction", expected:true },
      { id:"g10_sc_4", label:"Electricity and magnetic effects" },
      { id:"g10_sc_5", label:"Light, human eye and natural phenomena" },
      { id:"g10_sc_6", label:"Board-exam ready in Science" },
    ],
    "Social Science": [
      { id:"g10_ss_0", label:"No Std 10 social science knowledge" },
      { id:"g10_ss_1", label:"Knows nationalism in India and Europe" },
      { id:"g10_ss_2", label:"Understands democracy and political parties" },
      { id:"g10_ss_3", label:"Knows Indian economy and globalisation", expected:true },
      { id:"g10_ss_4", label:"Understands resources and development" },
      { id:"g10_ss_5", label:"Board-exam ready in Social Science" },
    ],
  },
};

export const getGL = (grade: string | null | undefined): GradeData | null =>
  grade ? GRADE_LEVELS[grade] || null : null;

export const getLevelColor = (levelId: string | undefined, gl: GradeData | null, subject: string) => {
  if (!levelId || !gl) return { bar:"#e2e8f0", badge:"#f1f5f9", text:"#94a3b8" };
  const levels = gl[subject] as Level[] | undefined;
  if (!levels) return { bar:"#e2e8f0", badge:"#f1f5f9", text:"#94a3b8" };
  const idx = levels.findIndex(l => l.id === levelId);
  const expIdx = levels.findIndex(l => l.expected);
  if (idx < 0) return { bar:"#e2e8f0", badge:"#f1f5f9", text:"#94a3b8" };
  if (idx < expIdx - 1) return { bar:"#ef4444", badge:"#fee2e2", text:"#b91c1c" };
  if (idx < expIdx) return { bar:"#f59e0b", badge:"#fef9c3", text:"#92400e" };
  return { bar:"#22c55e", badge:"#dcfce7", text:"#166534" };
};

export const getLevelLabel = (levelId: string | undefined, gl: GradeData | null, subject: string): Level | null => {
  if (!gl || !levelId) return null;
  const levels = gl[subject] as Level[] | undefined;
  if (!levels) return null;
  return levels.find(l => l.id === levelId) || null;
};
