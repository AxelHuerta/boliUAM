export const trimesters = [
  // trimester 0
  [
    {
      id: "210005",
      trimester: 0,
      name: "cursos complementarios",
      credits: 26,
      seriation: [],
      type: "tronco",
    },
  ],

  // trimester 1
  [
    {
      id: "2130038",
      trimester: 1,
      name: "cálculo diferencial",
      credits: 11,
      seriation: [],
      type: "tronco",
    },
    {
      id: "2110019",
      trimester: 1,
      name: "mecánica elemental I",
      credits: 9,
      seriation: [],
      type: "tronco",
    },
    {
      id: "2150005",
      trimester: 1,
      name: "introducción a la computación",
      credits: 9,
      seriation: [],
      type: "computacion",
    },
  ],

  // trimester 2
  [
    {
      id: "2100001",
      trimester: 2,
      name: "método experimental I",
      credits: 9,
      seriation: ["210005"],
      type: "tronco",
    },
    {
      id: "2130039",
      trimester: 1,
      name: "cálculo integral",
      credits: 11,
      seriation: ["2130038"],
      type: "tronco",
    },
    {
      id: "2110020",
      trimester: 2,
      name: "mécanica elemental II",
      credits: 9,
      seriation: ["2110019"],
      type: "tronco",
    },
    {
      id: "2151103",
      trimester: 2,
      name: "fundamentos de programación",
      credits: 9,
      seriation: [],
      type: "computacion",
    },
  ],

  // trimester 3
  [
    {
      id: "2140009",
      trimester: 3,
      name: "estructura de la materia",
      credits: 9,
      seriation: [],
      type: "tronco",
    },
    {
      id: "2130035",
      trimester: 3,
      name: "algebra lineal aplicada I",
      credits: 9,
      seriation: [],
      type: "tronco",
    },
    {
      id: "2131100",
      trimester: 3,
      name: "matemáticas discretas I",
      credits: 10,
      seriation: ["2130038"],
      type: "computacion",
    },
    {
      id: "2151104",
      trimester: 3,
      name: "APALOO",
      credits: 9,
      seriation: ["2151103"],
      type: "computacion",
    },
  ],

  // trimester 4

  [
    {
      id: "2130040",
      trimester: 4,
      name: "cálculo de varias variables",
      credits: 11,
      seriation: ["2130039", "2130035"],
      type: "tronco",
    },
    {
      id: "2132074",
      trimester: 4,
      name: "algebra lineal aplicada II",
      credits: 9,
      seriation: ["2130035"],
      type: "tronco",
    },
    {
      id: "2131101",
      trimester: 4,
      name: "matemáticas discretas II",
      credits: 10,
      seriation: ["2131100"],
      type: "computacion",
    },
    {
      id: "2151105",
      trimester: 4,
      name: "APANLOO",
      credits: 11,
      seriation: ["2151104"],
      type: "computacion",
    },
  ],

  // trimester 5
  [
    {
      id: "2131091",
      trimester: 5,
      name: "ecuaciones diferenciales ordinarias I",
      credits: 9,
      seriation: ["2130040"],
      type: "tronco",
    },
    {
      id: "2131094",
      trimester: 5,
      name: "probabilidad aplicada",
      credits: 9,
      seriation: ["2130040"],
      type: "tronco",
    },
    {
      id: "2151107",
      trimester: 5,
      name: "teoría matemática de la computación",
      credits: 10,
      seriation: ["2131101"],
      type: "computacion",
    },
    {
      id: "2151106",
      trimester: 5,
      name: "bases de datos",
      credits: 11,
      seriation: ["2151105"],
      type: "computacion",
    },
  ],

  // trimester 6
  [
    {
      id: "2131093",
      trimester: 6,
      name: "métodos numéricos",
      credits: 9,
      seriation: ["2131091"],
      type: "computacion",
    },
    {
      id: "2131041",
      trimester: 6,
      name: "estadistica y diseño de experimentos",
      credits: 9,
      seriation: ["2131094"],
      type: "tronco",
    },
    {
      id: "2151115",
      trimester: 6,
      name: "arquitectura de computadoras",
      credits: 10,
      seriation: ["2151104"],
      type: "computacion",
    },
    {
      id: "2151108",
      trimester: 6,
      name: "análisis y diseño de sistemas computacionales",
      credits: 11,
      seriation: ["2151106"],
      type: "computacion",
    },
  ],

  // trimester 7
  [
    {
      id: "2255064",
      trimester: 7,
      name: "inglés intermedio I",
      credits: 10,
      seriation: [],
      type: "tronco",
    },
    {
      id: "2151110",
      trimester: 7,
      name: "compiladores",
      credits: 8,
      seriation: ["2151103", "2151107"],
      type: "tronco",
    },
    {
      id: "2151111",
      trimester: 7,
      name: "programación concurrente",
      credits: 8,
      seriation: ["2151115"],
      type: "tronco",
    },
    {
      id: "2151112",
      trimester: 7,
      name: "ingeniería de software",
      credits: 11,
      seriation: ["2151108"],
      type: "computacion",
    },
  ],

  // trimester 8
  [
    {
      id: "2255065",
      trimester: 8,
      name: "inglés intermedio II",
      credits: 10,
      seriation: ["2155064"],
      type: "tronco",
    },
    {
      id: "2151113",
      trimester: 8,
      name: "inteligencia artificial",
      credits: 10,
      seriation: ["2151105"],
      type: "computacion",
    },
    {
      id: "2151114",
      trimester: 8,
      name: "sistemas operativos",
      credits: 8,
      seriation: ["2151111"],
      type: "computacion",
    },
    {
      id: "2151109",
      trimester: 8,
      name: "computación y su entorno empresarial",
      credits: 8,
      seriation: ["2151105"],
      type: "computacion",
    },
  ],

  // trimester 9
  [
    {
      id: "2255066",
      trimester: 9,
      name: "inglés intermedio III",
      credits: 10,
      seriation: ["2155065"],
      type: "tronco",
    },
    {
      id: "optativa0T9",
      trimester: 9,
      name: "Opt. CBS/CSH I",
      credits: 8,
      seriation: [],
      type: "optativa",
    },
    {
      id: "2151116",
      trimester: 9,
      name: "análisis y diseño de algoritmos",
      credits: 10,
      seriation: ["2151105"],
      type: "computacion",
    },
    {
      id: "2151014",
      trimester: 9,
      name: "redes de telecom",
      credits: 9,
      seriation: ["2151115"],
      type: "computacion",
    },
  ],

  // trimester 10
  [
    {
      id: "optativa0T10",
      trimester: 10,
      name: "optativa computación",
      credits: 11,
      seriation: [],
      type: "optativa",
    },
    {
      id: "optativa1T10",
      trimester: 10,
      name: "Opt. CBS/CSH II",
      credits: 8,
      seriation: [],
      type: "optativa",
    },
    {
      id: "optativa2T10",
      trimester: 10,
      name: "optativa licenciatura computación",
      credits: 8,
      seriation: [],
      type: "optativa",
    },
    {
      id: "optativa3T10",
      trimester: 10,
      name: "optativa licenciatura computación",
      credits: 8,
      seriation: [],
      type: "optativa",
    },
  ],

  // trimester 11
  [
    {
      id: "optativa0T11",
      trimester: 11,
      name: "optativa licenciatura computación",
      credits: 11,
      seriation: [],
      type: "optativa",
    },
    {
      id: "optativa1T11",
      trimester: 11,
      name: "Opt. CBS/CSH III",
      credits: 8,
      seriation: [],
      type: "optativa",
    },
    {
      id: "optativa2T11",
      trimester: 11,
      name: "optativa CBI",
      credits: 9,
      seriation: [],
      type: "optativa",
    },
    {
      id: "proyecto 1",
      trimester: 11,
      name: "proyecto de investiagación I",
      credits: 12,
      seriation: ["2151112", "2151114"],
      type: "proyecto",
    },
  ],

  // trimester 12
  [
    {
      id: "optativa0T12",
      trimester: 12,
      name: "optativa licenciatura computación",
      credits: 8,
      seriation: [],
      type: "optativa",
    },
    {
      id: "optativa1T12",
      trimester: 12,
      name: "Opt. CBS/CSH IV",
      credits: 8,
      seriation: [],
      type: "optativa",
    },
    {
      id: "optativa2T12",
      trimester: 12,
      name: "optativa CBI",
      credits: 9,
      seriation: [],
      type: "optativa",
    },
    {
      id: "proyecto 2",
      trimester: 12,
      name: "proyecto de investiagación II",
      credits: 18,
      seriation: ["proyecto de investiagación I"],
      type: "proyecto",
    },
  ],
];
