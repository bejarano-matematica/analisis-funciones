/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  Info, 
  BookOpen, 
  RotateCcw,
  Target,
  Maximize2
} from 'lucide-react';
import { FunctionGraph } from './components/FunctionGraph';
import { FUNCTIONS, QUESTIONS_TEMPLATE } from './constants';
import { Question, GameStatus } from './types';

export default function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>('welcome');
  const [playerName, setPlayerName] = useState('');
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [currentFunctionIdxIdx, setCurrentFunctionIdxIdx] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // Shuffle functions on start
  const handleStartClicked = () => {
    setGameStatus('getName');
  };

  const startGame = () => {
    const indices = FUNCTIONS.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledIndices(indices);
    setCurrentFunctionIdxIdx(0);
    setCurrentQuestionIndex(0);
    setScore({ correct: 0, total: 0 });
    setGameStatus('playing');
  };

  const currentFunctionIndex = shuffledIndices[currentFunctionIdxIdx] ?? 0;
  const currentFunction = FUNCTIONS[currentFunctionIndex];
  const questions = QUESTIONS_TEMPLATE[currentFunction?.id] || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleCheck = () => {
    if (!currentQuestion) return;

    // Deep normalization: strip prefixes, spaces, and convert to lower
    const preNormalize = (str: string) => {
      return str.trim()
        .toLowerCase()
        .replace(/^(x|y|f\(x\))\s*=\s*/, '') // Strip x=, y=, f(x)=
        .replace(/;/g, ',') // Replace semicolon with comma for consistency
        .replace(/\s+/g, '');
    };

    const normalizedUser = preNormalize(userAnswer);
    const normalizedCorrect = preNormalize(currentQuestion.correctAnswer);

    let correct = normalizedUser === normalizedCorrect;

    // Check for union split
    if (!correct && normalizedCorrect.includes('u')) {
      const userParts = normalizedUser.split('u').map(p => p.trim()).filter(p => p !== '').sort();
      const correctParts = normalizedCorrect.split('u').map(p => p.trim()).filter(p => p !== '').sort();
      
      if (userParts.length === correctParts.length) {
        // Deep compare parts ignoring brackets for numbers
        const extractNums = (s: string) => s.replace(/[\[\]\(\)]/g, '').split(',').map(v => v.trim()).filter(v => v !== '');
        correct = userParts.every((p, i) => {
          const uN = extractNums(p);
          const cN = extractNums(correctParts[i]);
          return uN.length === cN.length && uN.every((v, j) => v === cN[j]);
        });
      }
    }

    // Check for ordered pair vs single value for extrema/value_at
    if (!correct && (currentQuestion.type === 'extrema' || currentQuestion.type === 'value_at')) {
      // User might enter (3, 2) or 3, 2
      const pairMatch = normalizedUser.match(/^\(?(\-?\d+(\.\d+)?),(\-?\d+(\.\d+)?)\)?$/);
      if (pairMatch) {
        const userX = pairMatch[1];
        if (userX === normalizedCorrect) correct = true;
      }
    }

    // Check for roots in set notation {x1, x2}
    if (!correct && currentQuestion.type === 'roots') {
      const extractValues = (str: string) => {
        const cleaned = str.replace(/[\{\}]/g, ''); // Strip braces
        return cleaned.split(',').map(v => v.trim()).filter(v => v !== '').sort();
      };
      const userValues = extractValues(normalizedUser);
      const correctValues = extractValues(normalizedCorrect);
      if (userValues.length === correctValues.length && userValues.every((v, i) => v === correctValues[i])) {
        correct = true;
      }
    }

    // Check for intervals (a, b) vs [a, b] for growth/decay/pos/neg
    const isIntervalType = ['dom', 'im', 'pos', 'neg', 'growth', 'decay', 'constant'].includes(currentQuestion.type);
    if (!correct && isIntervalType && !normalizedCorrect.includes('u')) {
      const extractNums = (str: string) => str.replace(/[\[\]\(\)]/g, '').split(',').map(v => v.trim()).filter(v => v !== '');
      const userNums = extractNums(normalizedUser);
      const correctNums = extractNums(normalizedCorrect);
      if (userNums.length === correctNums.length && userNums.every((v, i) => v === correctNums[i])) {
        correct = true;
      }
    }

    setIsCorrect(correct);
    setShowFeedback(true);
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const handleNext = () => {
    setUserAnswer('');
    setShowFeedback(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Move to next function
      const nextIdxIdx = (currentFunctionIdxIdx + 1) % shuffledIndices.length;
      setCurrentFunctionIdxIdx(nextIdxIdx);
      setCurrentQuestionIndex(0);
    }
  };

  const resetProgress = () => {
    setGameStatus('welcome');
  };

  // Determine what to highlight based on question type
  const highlightX = currentQuestion?.type === 'value_at' && currentQuestion.prompt.includes('f(') 
    ? parseInt(currentQuestion.prompt.match(/f\((\-?\d+)\)/)?.[1] || '') 
    : undefined;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <AnimatePresence mode="wait">
        {gameStatus === 'welcome' ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-indigo-600 to-violet-700"
          >
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden text-center p-12 space-y-8">
              <div className="mx-auto bg-indigo-100 w-24 h-24 rounded-full flex items-center justify-center text-indigo-600 mb-4 animate-bounce">
                <BookOpen size={48} />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                  Matemática Interactiva
                </h1>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">
                  ¡Hola! Te invito a desafiar tus conocimientos analizando funciones reales de forma dinámica.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-left">
                {[
                  { icon: Target, text: 'Análisis de Ceros y Extremos', color: 'text-amber-600', bg: 'bg-amber-50' },
                  { icon: Maximize2, text: 'Dominio e Imagen Reales', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { icon: CheckCircle2, text: 'Positividad y Negatividad', color: 'text-green-600', bg: 'bg-green-50' },
                  { icon: Info, text: 'Crecimiento y Decrecimiento', color: 'text-purple-600', bg: 'bg-purple-50' }
                ].map((item, i) => (
                  <div key={i} className={`${item.bg} p-4 rounded-2xl flex items-center gap-3 border border-slate-100`}>
                    <item.icon className={item.color} size={20} />
                    <span className="text-sm font-bold text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleStartClicked}
                className="w-full bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xl font-bold py-6 rounded-2xl shadow-xl shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
              >
                ¡Comenzar Desafío!
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        ) : gameStatus === 'getName' ? (
          <motion.div
            key="getName"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-indigo-600 to-violet-700"
          >
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-slate-800">¿Cómo te llamas?</h2>
                    <p className="text-slate-500 font-medium">Queremos personalizar tu experiencia de aprendizaje.</p>
                </div>
                <div className="space-y-4">
                    <input 
                        type="text" 
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && playerName.trim() && startGame()}
                        placeholder="Escribe tu nombre..."
                        autoFocus
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-4 text-center text-xl font-bold text-slate-700 focus:border-indigo-600 outline-hidden transition-all"
                    />
                    <button
                        onClick={startGame}
                        disabled={!playerName.trim()}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-lg font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        Comenzar
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-h-screen"
          >
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg text-white">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-800">
                    Matemática Interactiva
                  </h1>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    {playerName ? `Estudiante: ${playerName}` : 'Análisis de Funciones'} • Prof. Bejarano
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-slate-400 uppercase">Puntaje</p>
                  <p className="text-sm font-bold text-indigo-600">
                     {score.correct} / {score.total}
                  </p>
                </div>
                <button 
                  onClick={resetProgress}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                  title="Reiniciar progreso"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
            </header>

            <main className="max-w-6xl mx-auto p-4 md:p-8 flex-grow">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* Left: Graph Section */}
                <section className="space-y-4">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h2 className="text-lg font-bold text-slate-800">{currentFunction?.name}</h2>
                        <p className="text-sm text-slate-500">{currentFunction?.description}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-600">
                        <Maximize2 size={12} />
                        <span>Interactive</span>
                      </div>
                    </div>
                    
                    {(() => {
                      const getIntervalToShow = () => {
                        if (!showFeedback && currentQuestion?.type !== 'roots') return undefined;
                        if (currentQuestion?.type === 'dom') return currentFunction.domain;
                        if (currentQuestion?.type === 'im') return currentFunction.range;
                        
                        const type = currentQuestion?.type;
                        if (type === 'pos') return currentFunction.positivity[0];
                        if (type === 'neg') return currentFunction.negativity[0];
                        if (type === 'growth') return currentFunction.growth[0];
                        if (type === 'decay') return currentFunction.decay[0];
                        if (type === 'constant') return currentFunction.constantIntervals[0];
                        if (type === 'roots') return [-10, 10]; // Hack to trigger root drawing logic
                        return undefined;
                      };

                      return (
                        <FunctionGraph 
                          data={currentFunction} 
                          highlightX={highlightX}
                          showInterval={getIntervalToShow() as any}
                          intervalType={currentQuestion?.type as any}
                        />
                      );
                    })()}
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase tracking-tighter border border-blue-100">Dominio</span>
                      <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded uppercase tracking-tighter border border-green-100">Imagen</span>
                      <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded uppercase tracking-tighter border border-red-100">Ceros</span>
                      <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded uppercase tracking-tighter border border-amber-100">C⁺ / C⁻</span>
                      <span className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded uppercase tracking-tighter border border-purple-100">Crecimiento</span>
                    </div>
                  </div>

                  {/* Hint Box */}
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3">
                    <Info className="text-indigo-400 shrink-0" size={20} />
                    <p className="text-sm text-indigo-700 leading-relaxed">
                      <strong>Tip Técnico:</strong> Para intervalos, usa corchetes <code>[a, b]</code> o paréntesis <code>(a, b)</code>. Usa <code>U</code> para unión.
                    </p>
                  </div>
                </section>

                {/* Right: Interaction Panel */}
                <section className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Question Header */}
                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Pregunta {currentQuestionIndex + 1} de {questions.length}
                      </span>
                      <div className="flex gap-1">
                        {questions.map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1.5 w-6 rounded-full transition-all ${
                              i === currentQuestionIndex ? 'bg-indigo-600 w-10' : 'bg-slate-200'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>

                    {/* Question Body */}
                    <div className="p-8">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${currentFunctionIndex}-${currentQuestion?.id}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <h3 className="text-xl font-bold text-slate-800 leading-tight">
                            {currentQuestion?.prompt}
                          </h3>

                          {!showFeedback ? (
                            <div className="space-y-6">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={userAnswer}
                                  onChange={(e) => setUserAnswer(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                                  placeholder="Tu respuesta aquí..."
                                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-4 pr-12 text-lg font-medium focus:border-indigo-500 focus:ring-0 transition-all outline-hidden"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                                  <Target size={24} />
                                </div>
                              </div>

                              {/* Symbol Buttons */}
                              <div className="flex flex-wrap gap-2">
                                {['(', ')', '[', ']', '{', '}', 'U', ';', ',', '∞', '-'].map(symbol => (
                                  <button
                                    key={symbol}
                                    onClick={() => setUserAnswer(prev => prev + symbol)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 rounded-lg text-sm font-bold text-slate-600 transition-all border border-slate-200"
                                  >
                                    {symbol}
                                  </button>
                                ))}
                              </div>

                              <button
                                onClick={handleCheck}
                                disabled={!userAnswer.trim()}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                              >
                                Verificar Respuesta
                                <ChevronRight size={20} />
                              </button>
                            </div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`p-6 rounded-2xl border-2 ${
                                isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                              }`}
                            >
                              <div className="flex items-center gap-3 mb-3">
                                {isCorrect ? (
                                  <CheckCircle2 className="text-green-600" size={28} />
                                ) : (
                                  <XCircle className="text-red-600" size={28} />
                                )}
                                <p className={`text-lg font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                  {isCorrect ? '¡Excelente trabajo!' : 'No es del todo correcto'}
                                </p>
                              </div>
                              
                              <p className={`text-md leading-relaxed mb-6 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                {currentQuestion?.explanation}
                              </p>

                              <div className="bg-white/50 p-4 rounded-xl mb-6">
                                  <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">Respuesta Esperada</p>
                                  <p className="text-xl font-mono font-bold text-indigo-600">{currentQuestion?.correctAnswer}</p>
                              </div>

                              <button
                                onClick={handleNext}
                                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                              >
                                Continuar
                                <ChevronRight size={20} />
                              </button>
                            </motion.div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Navigation Progress */}
                  <div className="flex justify-between items-center px-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      <button 
                        onClick={() => {
                            const prevIdxIdx = (currentFunctionIdxIdx - 1 + shuffledIndices.length) % shuffledIndices.length;
                            setCurrentFunctionIdxIdx(prevIdxIdx);
                            setCurrentQuestionIndex(0);
                            setShowFeedback(false);
                            setUserAnswer('');
                        }}
                        className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                      >
                          <ChevronLeft size={16} />
                          Función Anterior
                      </button>
                      <div className="h-px bg-slate-200 grow mx-4"></div>
                      <button 
                         onClick={() => {
                          const nextIdxIdx = (currentFunctionIdxIdx + 1) % shuffledIndices.length;
                          setCurrentFunctionIdxIdx(nextIdxIdx);
                          setCurrentQuestionIndex(0);
                          setShowFeedback(false);
                          setUserAnswer('');
                         }}
                         className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                      >
                          Siguiente Función
                          <ChevronRight size={16} />
                      </button>
                  </div>
                </section>

              </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto py-8 text-center border-t border-slate-200 bg-white">
              <p className="text-sm text-slate-400 font-medium">
                Diseñado para el aprendizaje interactivo de análisis matemático.
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
