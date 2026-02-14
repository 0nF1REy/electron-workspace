import "./App.css";
import { useState, useEffect, useMemo, useCallback } from "react";
import playImg from "./assets/play.png";
import resetImg from "./assets/reset.png";
import idleGif from "./assets/idle.gif";
import workGif from "./assets/work.gif";
import breakGif from "./assets/break.gif";
import meowSound from "./assets/meow.mp3";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

function App() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [encouragement, setEncouragement] = useState("");
  const [gifImage, setGifImage] = useState(idleGif);
  const [image, setImage] = useState(playImg);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const meowAudio = useMemo(() => {
    const audio = new Audio(meowSound);
    audio.preload = "auto";
    audio.volume = 0.7;
    return audio;
  }, []);

  const cheerMessages = useMemo(
    () => [
      "Vamos lá!",
      "Foco no trabalho!",
      "Continue concentrado!",
      "Mantenha o ritmo!",
      "Você consegue terminar!",
    ],
    []
  );

  const breakMessages = useMemo(
    () => [
      "Faça uma pausa rápida",
      "Alongue-se um pouco",
      "Respire fundo",
      "Relaxe por alguns minutos",
      "Hora de descansar",
    ],
    []
  );

  const playAudio = useCallback(() => {
    if (!audioEnabled) return;
    meowAudio.currentTime = 0;
    meowAudio.play().catch((err) => {
      console.error("Erro ao reproduzir áudio:", err);
      setTimeout(() => meowAudio.play().catch(() => {}), 100);
    });
  }, [audioEnabled, meowAudio]);

  const switchMode = useCallback((breakMode: boolean) => {
    setAudioEnabled(true);
    setIsBreak(breakMode);
    setIsRunning(false);
    setTimeLeft(breakMode ? BREAK_TIME : WORK_TIME);
    setGifImage(idleGif);
    setImage(playImg);
  }, []);

  const toggleRunning = useCallback(() => {
    setAudioEnabled(true);
    setIsRunning((prev) => {
      const nextState = !prev;
      setGifImage(nextState ? (isBreak ? breakGif : workGif) : idleGif);
      setImage(nextState ? resetImg : playImg);
      if (!nextState) setTimeLeft(isBreak ? BREAK_TIME : WORK_TIME);
      return nextState;
    });
  }, [isBreak]);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setTimeout(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          playAudio();
          toggleRunning();
          switchMode(!isBreak);
          return isBreak ? WORK_TIME : BREAK_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isRunning, isBreak, playAudio, toggleRunning, switchMode]);

  useEffect(() => {
    let index = 0;
    if (!isRunning) return;

    const messages = isBreak ? breakMessages : cheerMessages;
    setEncouragement(messages[0]);

    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setEncouragement(messages[index]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isRunning, isBreak, cheerMessages, breakMessages]);

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  return (
    <div className="container">
      <div className="home-content">
        <div className="home-controls">
          <button
            className={`text-button ${!isBreak ? "active" : ""}`}
            onClick={() => switchMode(false)}
          >
            Trabalho
          </button>
          <button
            className={`text-button ${isBreak ? "active" : ""}`}
            onClick={() => switchMode(true)}
          >
            Pausa
          </button>
        </div>
        <p className={`encouragement-text ${!isRunning ? "hidden" : ""}`}>
          {encouragement}
        </p>
        <h1 className="home-timer">{formatTime(timeLeft)}</h1>
        <div className="home-gif">
          <img src={gifImage} alt="GIF animado" />
        </div>
        <button className="home-button" onClick={toggleRunning}>
          <img src={image} alt={isRunning ? "Reset" : "Play"} />
        </button>
      </div>
    </div>
  );
}

export default App;
