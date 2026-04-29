import { FunctionData, Question } from './types';

export const FUNCTIONS: FunctionData[] = [
  {
    id: 'f1',
    name: 'Función A (Imagen 1)',
    description: 'Una función continua con tramos lineales.',
    points: [
      { x: -5, y: -1 },
      { x: 0, y: -6 },
      { x: 3, y: 0 },
      { x: 7, y: 8 }
    ],
    domain: [-5, 7],
    range: [-6, 8],
    roots: [3],
    positivity: [[3, 7]],
    negativity: [[-5, 3]],
    growth: [[0, 7]],
    decay: [[-5, 0]],
    extrema: [
      { x: 0, y: -6, type: 'min' },
      { x: 7, y: 8, type: 'max' }
    ],
    constantIntervals: []
  },
  {
    id: 'f2',
    name: 'Función B (Imagen 9)',
    description: 'Función con tramos constantes y múltiples variaciones.',
    points: [
      { x: -4, y: -4 },
      { x: -3, y: -4 },
      { x: -1, y: 4 },
      { x: 3, y: 2 },
      { x: 5, y: 4 },
      { x: 8, y: 4 }
    ],
    domain: [-4, 8],
    range: [-4, 4],
    roots: [-1.5, 7],
    positivity: [[-1.5, 7]],
    negativity: [[-4, -1.5], [7, 8]],
    growth: [[-3, -1], [3, 5]],
    decay: [[-1, 3], [7, 8]],
    extrema: [
      { x: -1, y: 4, type: 'max' },
      { x: 3, y: 2, type: 'min' },
      { x: 5, y: 4, type: 'max' }
    ],
    constantIntervals: [[-4, -3], [5, 8]]
  },
  {
    id: 'f3',
    name: 'Función Cuadrática (Imagen 4b)',
    description: 'Una parábola con vértice en el eje Y.',
    formula: (x: number) => (2 / 3) * (x * x) - 2,
    domain: [-3, 3],
    range: [-2, 4],
    roots: [-1.732, 1.732],
    rootLabels: ['-√3', '√3'],
    positivity: [[-3, -1.732], [1.732, 3]],
    negativity: [[-1.732, 1.732]],
    growth: [[0, 3]],
    decay: [[-3, 0]],
    extrema: [
      { x: 0, y: -2, type: 'min' }
    ],
    constantIntervals: []
  },
  {
    id: 'f4',
    name: 'Análisis Completo (Imagen 14)',
    description: 'Función con raíces, tramos constantes y crecientes.',
    points: [
      { x: -6, y: 0 },
      { x: 0, y: -12 },
      { x: 3, y: 0 },
      { x: 5, y: 8 },
      { x: 7, y: 8 },
      { x: 8, y: 0 }
    ],
    domain: [-6, 8],
    range: [-12, 8],
    roots: [-6, 3, 8],
    positivity: [[3, 8]],
    negativity: [[-6, 3]],
    growth: [[0, 5]],
    decay: [[-6, 0], [7, 8]],
    extrema: [
      { x: 0, y: -12, type: 'min' },
      { x: 5, y: 8, type: 'max' }
    ],
    constantIntervals: [[5, 7]]
  },
  {
    id: 'f5',
    name: 'Análisis Avanzado (Imagen 17)',
    description: 'Función con raíces, tramos constantes y múltiples extremos.',
    points: [
      { x: -8, y: -6 },
      { x: -5, y: 0 },
      { x: -3, y: -4 },
      { x: -1, y: -4 },
      { x: 1, y: 0 },
      { x: 2, y: 3 },
      { x: 4, y: 0 },
      { x: 7, y: 8 }
    ],
    domain: [-8, 7],
    range: [-6, 8],
    roots: [-5, 1, 4],
    positivity: [[1, 4], [4, 7]],
    negativity: [[-8, -5], [-5, 1]],
    growth: [[-1, 2], [4, 7]],
    decay: [[-8, -3], [2, 4]],
    extrema: [
      { x: -3, y: -4, type: 'min' },
      { x: 2, y: 3, type: 'max' },
      { x: 4, y: 0, type: 'min' }
    ],
    constantIntervals: [[-3, -1]]
  },
  {
    id: 'f6',
    name: 'Desafío de Uniones (Imagen Extra)',
    description: 'Análisis de una función con múltiples cruces por el eje X.',
    points: [
      { x: -10, y: 4 },
      { x: -7, y: 0 },
      { x: -5, y: -4 },
      { x: -3, y: 0 },
      { x: 0, y: 5 },
      { x: 3, y: 0 },
      { x: 5, y: -4 },
      { x: 7, y: 0 },
      { x: 10, y: 4 }
    ],
    domain: [-10, 10],
    range: [-4, 5],
    roots: [-7, -3, 3, 7],
    positivity: [[-10, -7], [-3, 3], [7, 10]],
    negativity: [[-7, -3], [3, 7]],
    growth: [[-5, 0], [5, 10]],
    decay: [[-10, -5], [0, 5]],
    extrema: [
      { x: -5, y: -4, type: 'min' },
      { x: 0, y: 5, type: 'max' },
      { x: 5, y: -4, type: 'min' }
    ],
    constantIntervals: []
  },
  {
    id: 'f7',
    name: 'Función Polinómica f(x)=(x-3)(x+2)(x-1)',
    description: 'Una función de tercer grado con tres raíces reales.',
    formula: (x: number) => (x - 3) * (x + 2) * (x - 1),
    domain: [-3, 4],
    range: [-10, 10],
    roots: [-2, 1, 3],
    positivity: [[-2, 1], [3, 4]],
    negativity: [[-3, -2], [1, 3]],
    growth: [[-3, -0.78], [2.12, 4]],
    decay: [[-0.78, 2.12]],
    extrema: [
      { x: -0.78, y: 8.21, type: 'max' },
      { x: 2.12, y: -4.06, type: 'min' }
    ],
    constantIntervals: []
  }
];

export const QUESTIONS_TEMPLATE: Record<string, Question[]> = {
  f1: [
    {
      id: 'f1-q1',
      type: 'dom',
      prompt: '¿Cuál es el dominio de la función? (Intervalo [min, max])',
      correctAnswer: '[-5, 7]',
      explanation: 'El dominio abarca todos los valores de x desde el inicio hasta el fin del trazo: [-5, 7].'
    },
    {
      id: 'f1-q2',
      type: 'im',
      prompt: '¿Cuál es la imagen de la función?',
      correctAnswer: '[-6, 8]',
      explanation: 'La imagen son los valores de y alcanzados, desde el mínimo -6 hasta el máximo 8: [-6, 8].'
    },
    {
      id: 'f1-q3',
      type: 'roots',
      prompt: '¿Cuál es el conjunto de ceros o raíces? (Usa {x1, x2, ...})',
      correctAnswer: '{3}',
      explanation: 'La función corta al eje x únicamente en x = 3.'
    },
    {
      id: 'f1-q4',
      type: 'growth',
      prompt: '¿En qué intervalo de x la función crece?',
      correctAnswer: '(0, 7)',
      explanation: 'La función sube (crece) desde x=0 hasta x=7.'
    }
  ],
  f2: [
    {
      id: 'f2-q1',
      type: 'extrema',
      prompt: '¿En qué valor de x se encuentra el mínimo relativo?',
      correctAnswer: '3',
      explanation: 'El "valle" del gráfico se encuentra en x=3 (punto (3, 2)).'
    },
    {
      id: 'f2-q2',
      type: 'constant',
      prompt: 'Indica un intervalo donde la función sea constante.',
      correctAnswer: '[-4, -3]',
      explanation: 'En el tramo de x=-4 a x=-3, el valor de y se mantiene fijo en -4. También sucede en [5, 8].'
    },
    {
      id: 'f2-q3',
      type: 'decay',
      prompt: 'Indica el intervalo de decrecimiento principal.',
      correctAnswer: '(-1, 3)',
      explanation: 'La función baja desde el pico en x=-1 hasta el valle en x=3.'
    }
  ],
  f3: [
    {
      id: 'f3-q1',
      type: 'roots',
      prompt: '¿Cuál es el conjunto de raíces? (Aproxima a 1.73 si es necesario)',
      correctAnswer: '{-1.73, 1.73}',
      explanation: 'La parábola corta al eje x en dos puntos simétricos: x ≈ -1.73 y x ≈ 1.73.'
    },
    {
      id: 'f3-q2',
      type: 'neg',
      prompt: '¿Cuál es el conjunto de negatividad C⁻?',
      correctAnswer: '(-1.73, 1.73)',
      explanation: 'La función está por debajo del eje x entre las dos raíces.'
    }
  ],
  f4: [
    {
      id: 'f4-q1',
      type: 'roots',
      prompt: '¿Cuál es el conjunto de ceros?',
      correctAnswer: '{-6, 3, 8}',
      explanation: 'Los puntos de corte con el eje x son -6, 3 y 8.'
    },
    {
      id: 'f4-q2',
      type: 'pos',
      prompt: '¿Cuál es el conjunto de positividad C⁺?',
      correctAnswer: '(3, 8)',
      explanation: 'La función está por encima del eje x desde x=3 hasta x=8.'
    },
    {
      id: 'f4-q3',
      type: 'growth',
      prompt: '¿Cuál es el intervalo de crecimiento?',
      correctAnswer: '(0, 5)',
      explanation: 'La función sube desde el mínimo en x=0 hasta el inicio del tramo constante en x=5.'
    }
  ],
  f5: [
    {
      id: 'f5-q1',
      type: 'roots',
      prompt: '¿Cuál es el conjunto de ceros?',
      correctAnswer: '{-5, 1, 4}',
      explanation: 'Los ceros son los valores de x donde la función toca o cruza el eje x: -5, 1 y 4.'
    },
    {
      id: 'f5-q2',
      type: 'growth',
      prompt: 'Indica un intervalo de crecimiento.',
      correctAnswer: '(4, 7)',
      explanation: 'La función crece en (-1, 2) y también en (4, 7).'
    },
    {
      id: 'f5-q3',
      type: 'constant',
      prompt: '¿En qué intervalo de x la función es constante?',
      correctAnswer: '[-3, -1]',
      explanation: 'Entre x=-3 y x=-1, la función mantiene un valor fijo de y=-4.'
    }
  ],
  f6: [
    {
      id: 'f6-q1',
      type: 'pos',
      prompt: '¿Cuál es el conjunto de positividad C⁺?',
      correctAnswer: '(-10, -7) U (-3, 3) U (7, 10)',
      explanation: 'La función está por encima del eje x en tres tramos distintos.'
    },
    {
      id: 'f6-q2',
      type: 'neg',
      prompt: '¿Cuál es el conjunto de negatividad C⁻?',
      correctAnswer: '(-7, -3) U (3, 7)',
      explanation: 'La función está por debajo del eje x en los intervalos entre las raíces centrales.'
    },
    {
      id: 'f6-q3',
      type: 'growth',
      prompt: 'Indica los intervalos de crecimiento.',
      correctAnswer: '(-5, 0) U (5, 10)',
      explanation: 'La función sube desde el primer mínimo al máximo, y desde el segundo mínimo al final.'
    }
  ],
  f7: [
    {
      id: 'f7-q1',
      type: 'roots',
      prompt: '¿Cuál es el conjunto de raíces C⁰?',
      correctAnswer: '{-2, 1, 3}',
      explanation: 'Las raíces son los valores que anulan cada factor: -2, 1 y 3.'
    },
    {
      id: 'f7-q2',
      type: 'pos',
      prompt: 'Determina el conjunto de positividad C⁺.',
      correctAnswer: '(-2, 1) U (3, 4)',
      explanation: 'La función es positiva entre las primeras dos raíces y después de la última.'
    },
    {
      id: 'f7-q3',
      type: 'decay',
      prompt: 'Determina el intervalo de decrecimiento.',
      correctAnswer: '(-0.78, 2.12)',
      explanation: 'La función baja desde el máximo relativo (~ -0.78) hasta el mínimo relativo (~ 2.12).'
    }
  ]
};
