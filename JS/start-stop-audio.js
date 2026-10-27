/* START / STOP AUDIO
   Place your chosen audio at ./AUDIO/engine-sound.mp3
   START: plays / resumes looping audio
   STOP: pauses and rewinds audio
   Does not change the layout or existing PlayCanvas button actions.
   NOTE: It controls this webpage's audio, not audio created inside
   the cross-origin PlayCanvas iframe. For iframe audio, implement
   an explicit postMessage receiver in the PlayCanvas project.
*/
(() => {
  'use strict';
  const startButton = document.getElementById('btn-engine-start');
  const stopButton = document.getElementById('btn-engine-stop');
  if (!startButton || !stopButton) return;

  const sound = new Audio('./AUDIO/auto_Volvo_s40_Engine_drive2.mp3');
  sound.loop = true;
  sound.preload = 'auto';
  sound.volume = 0.65;

  // Reflect the real playback state (do not fake success on a missing MP3).
  const displayState = playing => {
    startButton.classList.toggle('active', playing);
    stopButton.classList.toggle('active', !playing);
    startButton.setAttribute('aria-pressed', String(playing));
    stopButton.setAttribute('aria-pressed', String(!playing));
  };

  // Initially off until a user clicks Start.
  displayState(false);

  startButton.addEventListener('click', async () => {
    try {
      await sound.play();
      displayState(true);
    } catch (error) {
      displayState(false);
      console.error('Engine audio failed: check AUDIO/auto_Volvo_s40_Engine_drive2.mp3', error);
    }
  });

  stopButton.addEventListener('click', () => {
    sound.pause();
    sound.currentTime = 0;
    displayState(false);
  });

  sound.addEventListener('ended', () => displayState(false));
  sound.addEventListener('error', () => {
    displayState(false);
    console.error('Could not load ./AUDIO/auto_Volvo_s40_Engine_drive2.mp3');
  });
})();
