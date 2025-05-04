// App.js
import React, { useRef, useEffect } from 'react';
import './App.css';

function App() {
  // Referências para elementos do DOM
  const tensionSoundRef = useRef(null);
  const celebrationSoundRef = useRef(null);
  const drumBearRef = useRef(null);
  const wordRef = useRef(null);

  // Armazenamos os intervalos e o status de animação em refs para evitar re-renderizações desnecessárias
  const intervalsRef = useRef([]);
  const isAnimatingRef = useRef(false);

  const options = ['a', 'o', 'e', 'i', 'u', 'x', 'y'];
  const finalWord = ['m', 'e', 'n', 'i', 'n', 'a']; // Substitua a letra final se desejar "menino"

  const startAnimation = () => {
    // Mostra o ursinho e garante que a animação não seja iniciada novamente se já estiver em curso
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    
    if (drumBearRef.current) {
      drumBearRef.current.src = 'ursinho.gif';
      drumBearRef.current.style.display = 'block';
      drumBearRef.current.classList.add('bear-move'); // Caso tenha estilos adicionais
    }

    document.body.classList.add('animate-background');

    if (tensionSoundRef.current) {
      tensionSoundRef.current.currentTime = 0;
      tensionSoundRef.current.play();
    }

    let currentIndex = 0;

    const animateLetter = () => {
      if (wordRef.current) {
        const letters = wordRef.current.querySelectorAll('.letter');

        if (currentIndex >= letters.length) {
          revealComplete();
          return;
        }
        let count = 0;
        let innerIndex = 0;
        const el = letters[currentIndex];

        const intervalId = setInterval(() => {
          el.textContent = options[innerIndex % options.length];
          innerIndex++;
          count++;
          if (count > 60) {
            clearInterval(intervalId);
            el.textContent = finalWord[currentIndex];
            el.classList.add('animate-flip');
            currentIndex++;
            setTimeout(animateLetter, 200);
          }
        }, 100);

        intervalsRef.current.push(intervalId);
      }
    };

    animateLetter();
  };

  const revealComplete = () => {
    if (drumBearRef.current) {
      drumBearRef.current.src = 'ursinho-comemorando.gif';
    }
    if (tensionSoundRef.current) {
      tensionSoundRef.current.pause();
      tensionSoundRef.current.currentTime = 0;
    }
    document.body.classList.remove('animate-background');
    document.body.style.backgroundColor = '#f0c0e8';
    launchConfetti();

    if (wordRef.current) {
      const letters = wordRef.current.querySelectorAll('.letter');
      const lastLetter = letters[letters.length - 1];
      lastLetter.classList.add('grow-effect');
    }
  };

  const launchConfetti = () => {
    if (celebrationSoundRef.current) {
      celebrationSoundRef.current.currentTime = 0;
      celebrationSoundRef.current.play();
    }

    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = '-10px';
      confetti.style.backgroundColor = randomColor();
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 30000);
    }
  };

  const randomColor = () => {
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd', '#ff9ff3'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const clearConfetti = () => {
    const confettiContainer = document.getElementById('confetti-container');
    if (confettiContainer) {
      confettiContainer.innerHTML = '';
    }
  };

  const reset = () => {
    if (drumBearRef.current) {
      drumBearRef.current.style.display = 'none';
    }
    isAnimatingRef.current = false;

    if (tensionSoundRef.current) {
      tensionSoundRef.current.pause();
      tensionSoundRef.current.currentTime = 0;
    }
    if (celebrationSoundRef.current) {
      celebrationSoundRef.current.pause();
      celebrationSoundRef.current.currentTime = 0;
    }
    document.body.classList.remove('animate-background');
    document.body.style.backgroundColor = '';

    // Para todos os intervalos ativos
    intervalsRef.current.forEach(intervalId => clearInterval(intervalId));
    intervalsRef.current = [];

    if (wordRef.current) {
      const letters = wordRef.current.querySelectorAll('.letter');
      letters.forEach(letter => {
        letter.textContent = '_';
        letter.classList.remove('animate-flip', 'grow-effect');
      });
    }

    clearConfetti();
  };

  // Garante que os intervals sejam limpos ao desmontar o componente
  useEffect(() => {
    return () => {
      intervalsRef.current.forEach(clearInterval);
    };
  }, []);

  return (
    <div>
      <div className="controls">
        <button id="resetButton" onClick={reset}>×</button>
        <button id="playButton" onClick={startAnimation}>▶️</button>
      </div>

      <div className="word" id="word" ref={wordRef}>
        {Array(6)
          .fill(0)
          .map((_, idx) => (
            <span key={idx} className="letter" data-index={idx}>
              _
            </span>
          ))}
      </div>

      <div id="confetti-container"></div>

      <audio id="tensionSound" ref={tensionSoundRef} src="tension.mp3" />
      <audio
        id="celebration-sound"
        ref={celebrationSoundRef}
        src="celebration.mp3"
        preload="auto"
      />

      <img
        id="drumBear"
        ref={drumBearRef}
        src="ursinho.gif"
        alt="Ursinho rufando tambor"
        className="bear-animation"
        style={{
          position: 'absolute',
          bottom: 0,
          left: '90%',
          transform: 'translateX(-50%)',
          zIndex: 0,
          maxHeight: '200px',
          opacity: 0.8,
          display: 'none',
        }}
      />
    </div>
  );
}

export default App;
