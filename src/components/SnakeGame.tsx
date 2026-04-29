import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Pause, Play } from 'lucide-react';
import { Coordinate, Direction, GameState } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION } from '../constants';

const CELL_SIZE = 20;
const GAME_SPEED = 150;

export const SnakeGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: INITIAL_DIRECTION,
    score: 0,
    isGameOver: false,
    isPaused: true,
  });

  const nextDirection = useRef<Direction>(INITIAL_DIRECTION);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((snake: Coordinate[]): Coordinate => {
    let newFood: Coordinate;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: INITIAL_DIRECTION,
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
    nextDirection.current = INITIAL_DIRECTION;
  };

  const togglePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        if (gameState.direction !== 'DOWN') nextDirection.current = 'UP';
        break;
      case 'ArrowDown':
        if (gameState.direction !== 'UP') nextDirection.current = 'DOWN';
        break;
      case 'ArrowLeft':
        if (gameState.direction !== 'RIGHT') nextDirection.current = 'LEFT';
        break;
      case 'ArrowRight':
        if (gameState.direction !== 'LEFT') nextDirection.current = 'RIGHT';
        break;
      case ' ':
        togglePause();
        break;
    }
  }, [gameState.direction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (prev.isPaused || prev.isGameOver) return prev;

      const newHead = { ...prev.snake[0] };
      const currentDir = nextDirection.current;

      switch (currentDir) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Wall collision
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        return { ...prev, isGameOver: true };
      }

      const newSnake = [newHead, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;

      // Food collision
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        newFood = generateFood(newSnake);
        newScore += 10;
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
        direction: currentDir,
      };
    });
  }, [generateFood]);

  const gameLoop = useCallback((timestamp: number) => {
    if (lastUpdateRef.current === 0) lastUpdateRef.current = timestamp;
    const elapsed = timestamp - lastUpdateRef.current;

    if (elapsed > GAME_SPEED) {
      moveSnake();
      lastUpdateRef.current = timestamp;
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [moveSnake]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameLoop]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="flex justify-between w-full px-4 items-center z-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 opacity-60">System Ready</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">SNAKE.CORE</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 opacity-60">Score</span>
             <span className="text-xl font-mono text-white tabular-nums">{gameState.score.toString().padStart(4, '0')}</span>
          </div>
          <Trophy className="w-5 h-5 text-yellow-400" />
        </div>
      </div>

      <div 
        className="relative bg-[#050505] border-2 border-cyan-500/30 rounded-lg overflow-hidden"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        {/* Grid lines */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: `linear-gradient(to right, #22d3ee 1px, transparent 1px), linear-gradient(to bottom, #22d3ee 1px, transparent 1px)`,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
          }}
        />

        {/* Snake */}
        {gameState.snake.map((segment, index) => (
          <motion.div
            key={`${index}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{ 
              x: segment.x * CELL_SIZE, 
              y: segment.y * CELL_SIZE,
              scale: 1,
              backgroundColor: index === 0 ? '#22d3ee' : '#0891b2'
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 300, mass: 0.5 }}
            className={`absolute w-[18px] h-[18px] rounded-sm m-[1px] ${index === 0 ? 'shadow-[0_0_15px_rgba(34,211,238,0.5)] z-20' : 'z-10'}`}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute bg-fuchsia-500 rounded-full shadow-[0_0_15px_rgba(217,70,239,0.8)] z-30"
          style={{ 
            width: 14, 
            height: 14, 
            left: gameState.food.x * CELL_SIZE + 3, 
            top: gameState.food.y * CELL_SIZE + 3 
          }}
        />

        <AnimatePresence>
          {(gameState.isPaused || gameState.isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                {gameState.isGameOver ? (
                  <>
                    <h3 className="text-3xl font-bold text-white uppercase tracking-wider">Game Over</h3>
                    <p className="text-cyan-400 font-mono">Final Score: {gameState.score}</p>
                    <button 
                      onClick={resetGame}
                      className="px-6 py-2 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" /> REBOOT
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-3xl font-bold text-white uppercase tracking-wider">Paused</h3>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={togglePause}
                      className="w-16 h-16 bg-cyan-500 text-black flex items-center justify-center rounded-full hover:bg-cyan-400 transition-colors"
                    >
                      <Play className="ml-1 w-8 h-8 fill-black" />
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 z-10">
        <button 
          onClick={togglePause}
          disabled={gameState.isGameOver}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-white disabled:opacity-50"
        >
          {gameState.isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
          <span className="text-sm font-medium">{gameState.isPaused ? 'RESUME' : 'PAUSE'}</span>
        </button>
        {gameState.isGameOver && (
          <button 
            onClick={resetGame}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 rounded-xl border border-cyan-500/30 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm font-medium">RESTART</span>
          </button>
        )}
      </div>

      <p className="text-[10px] text-white/30 font-mono tracking-widest z-10">USE ARROW KEYS TO NAVIGATE</p>
    </div>
  );
};
