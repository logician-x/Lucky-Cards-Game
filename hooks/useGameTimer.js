import { useState, useEffect, useRef } from 'react';
import { PHASES } from '../constants/gameConstants';

export default function useGameTimer(onPhaseChange, onDetermineWinner) {
  const [timer, setTimer] = useState(30);
  const [phaseTimer, setPhaseTimer] = useState(22);
  const [gamePhase, setGamePhase] = useState(PHASES.BETTING);
  const timerRef = useRef(null);
  const lastPhaseChangeRef = useRef(null);
  
  // Start a new round
  const startNewRound = () => {
    clearInterval(timerRef.current);
    setTimer(30);
    setPhaseTimer(22);
    setGamePhase(PHASES.BETTING);
    lastPhaseChangeRef.current = PHASES.BETTING;
    
    // Notify about phase change once
    if (onPhaseChange) {
      onPhaseChange(PHASES.BETTING);
    }
    
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          return 30; // Reset to 30 when reached 0
        }
        return prevTimer - 1;
      });
    }, 1000);
  };
  
  // Handle timer updates and phase transitions
  useEffect(() => {
    if (timer > 0) {
      // Update phase-specific timer
      if (timer <= 30 && timer > 8) {
        setPhaseTimer(timer - 8); // Betting phase (22s)
      } else if (timer <= 8 && timer > 3) {
        setPhaseTimer(timer - 3); // Result phase (5s)
      } else {
        setPhaseTimer(timer); // Reset phase (3s)
      }
      
      // Phase transitions - only trigger if phase has actually changed
      if (timer === 30 && lastPhaseChangeRef.current !== PHASES.BETTING) {
        setGamePhase(PHASES.BETTING);
        lastPhaseChangeRef.current = PHASES.BETTING;
        if (onPhaseChange) onPhaseChange(PHASES.BETTING);
      }
      if (timer === 8 && lastPhaseChangeRef.current !== PHASES.RESULT) {
        setGamePhase(PHASES.RESULT);
        lastPhaseChangeRef.current = PHASES.RESULT;
        if (onPhaseChange) onPhaseChange(PHASES.RESULT);
        if (onDetermineWinner) onDetermineWinner();
      }
      if (timer === 3 && lastPhaseChangeRef.current !== PHASES.RESET) {
        setGamePhase(PHASES.RESET);
        lastPhaseChangeRef.current = PHASES.RESET;
        if (onPhaseChange) onPhaseChange(PHASES.RESET);
      }
    } else {
      startNewRound();
    }
  }, [timer, onPhaseChange, onDetermineWinner]);
  
  // Clean up timer on unmount
  useEffect(() => {
    startNewRound();
    return () => clearInterval(timerRef.current);
  }, []);
  
  // Determine timer color based on phase
  const timerColor = () => {
    if (timer > 8) return '#00ff00'; // Pink for betting phase
    if (timer > 3) return '#ffd700'; // Yellow for result phase
    return '#ff4b5c'; // Red for reset phase
  };
  
  return {
    timer,
    phaseTimer,
    gamePhase,
    timerColor,
    startNewRound
  };
}