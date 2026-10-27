/**
 * CONCEPT 05 — ARCHITECTURAL MINIMAL LUXURY CONTROLLER
 * Direct PlayCanvas messaging bridge and luxury UI controller.
 */

(function () {
  'use strict';

  // Feature cards data matching the project's assets and the user's reference mockup
  const featuresData = [
    {
      id: 'drl',
      title: 'Boomerang Shaped DRLs',
      image: './IMAGES/HL.png',
      desc: 'Boomerang-shaped low and high projection LED lights, combined with rhombus-shaped headlamps, deliver impressive and modern illumination.',
      modalBtn: 'btn_2'
    },
    {
      id: 'mirrors',
      title: 'High Gloss Flag Outside Mirrors',
      image: './IMAGES/SM.png',
      desc: 'High gloss black exterior mirrors enhance visibility and add a sporty, distinctive aerodynamic look.',
      modalBtn: 'btn_1'
    },
    {
      id: 'cpillar',
      title: 'C-Pillar Garnish',
      image: './IMAGES/SW.png',
      desc: 'The dynamic two-tone pillar treatment combining gloss black and body accents creates a distinctive flying roofline silhouette.',
      modalBtn: 'btn_3'
    },
    {
      id: 'taillamp',
      title: 'Notch-Shaped LED Rear Lamp',
      image: './IMAGES/TL.png',
      desc: 'The new notch-shaped tail lamp design connects the left and right rear lamps with a sleek dark bezel across the tailgate.',
      modalBtn: 'btn_4'
    },
    {
      id: 'roofrack',
      title: 'Glossy Black Roof Rack',
      image: './IMAGES/UVG.png',
      desc: 'Exclusive aerodynamic gloss black rack adds supreme versatility and sport-inspired aesthetic.',
      modalBtn: 'btn_5'
    },
    {
      id: 'display',
      title: 'Dual 12.3" Panoramic Display',
      image: './IMAGES/Steer.png',
      desc: 'Integrated panoramic display visually amplifies cockpit space, delivering a cinematic interface and intuitive driver controls.',
      modalBtn: 'btn_10'
    }
  ];

  let currentFeatureIndex = 0;
  let lightsOn = false;
  let doorsOpen = false;
  let indOn = false;

  // Direct and infallible postMessage sender to PlayCanvas
  function sendPlayCanvasMessage(msg) {
    const iframe = document.getElementById('app');
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage(msg, '*');
        console.log('[PlayCanvas Bridge] Sent message:', msg);
      } catch (err) {
        console.warn('[PlayCanvas Bridge] Failed to send message:', err);
      }
    }
  }

  // App readiness state & UI activation
  let isAppReady = false;

  function enableShowroomUI() {
    if (isAppReady) return;
    isAppReady = true;

    document.body.classList.remove('app-loading');
    document.body.classList.add('app-ready');

    const topBar = document.getElementById('top-bar');
    const ui1 = document.getElementById('UI_container');
    const ui2 = document.getElementById('UI_container2');

    if (topBar) {
      topBar.classList.remove('ui-disabled');
      topBar.style.display = 'flex';
    }
    if (ui1) {
      ui1.classList.remove('ui-disabled');
      ui1.style.display = 'flex';
    }
    if (ui2) {
      ui2.classList.remove('ui-disabled');
      ui2.style.display = 'flex';
    }

    // Enable all interactive buttons
    document.querySelectorAll('#top-bar button, #UI_container button, #UI_container2 .env-thumbnail-card, .luxury-color-card button').forEach(el => {
      if (el.tagName === 'BUTTON') el.disabled = false;
      el.style.pointerEvents = 'auto';
    });

    console.log('[PlayCanvas Bridge] Showroom UI successfully enabled via app:ready / appready postMessage!');
  }

  function disableShowroomUI() {
    isAppReady = false;
    document.body.classList.add('app-loading');
    document.body.classList.remove('app-ready');

    const topBar = document.getElementById('top-bar');
    const ui1 = document.getElementById('UI_container');
    const ui2 = document.getElementById('UI_container2');

    if (topBar) topBar.classList.add('ui-disabled');
    if (ui1) ui1.classList.add('ui-disabled');
    if (ui2) ui2.classList.add('ui-disabled');

    // Disable all interactive buttons
    document.querySelectorAll('#top-bar button, #UI_container button, #UI_container2 .env-thumbnail-card, .luxury-color-card button').forEach(el => {
      if (el.tagName === 'BUTTON') el.disabled = true;
      el.style.pointerEvents = 'none';
    });

    console.log('[PlayCanvas Bridge] Showroom UI initially disabled until appready message');
  }

  window.enableShowroomUI = enableShowroomUI;
  window.disableShowroomUI = disableShowroomUI;

  function initLuxuryUI() {
    // 1. Synchronize Top Environment Switcher & Bottom Carousel
    const envBtns = document.querySelectorAll('.env-tab-btn');
    const envCards = document.querySelectorAll('.env-thumbnail-card');
    // Mobile Environment Open / Close
    const mobileEnvToggle = document.getElementById('mobile-env-toggle');
    const environmentPanel = document.getElementById('UI_container2');

    if (mobileEnvToggle && environmentPanel) {

      mobileEnvToggle.addEventListener('click', function () {

        const isOpen = environmentPanel.classList.toggle('mobile-env-open');

        mobileEnvToggle.classList.toggle('open', isOpen);
        mobileEnvToggle.setAttribute('aria-expanded', String(isOpen));

      });

      // Close menu after selecting an environment
      environmentPanel.querySelectorAll('.env-thumbnail-card').forEach(card => {

        card.addEventListener('click', function () {

          environmentPanel.classList.remove('mobile-env-open');
          mobileEnvToggle.classList.remove('open');
          mobileEnvToggle.setAttribute('aria-expanded', 'false');

        });

      });
    }
    function setEnvironment(envKey) {
      const msgMap = {
        day: 'dayenv:',
        night: 'nightenv:',
        studio: 'studioenv:'
      };

      const msg = msgMap[envKey] || (envKey + ':');
      sendPlayCanvasMessage(msg);

      // If switching to studio environment, doors automatically close in PlayCanvas
      if (envKey === 'studio' && doorsOpen) {
        doorsOpen = false;
        const doorsBtn = document.querySelector('.sidebar-nav-item[data-action="doors"]');
        if (doorsBtn) doorsBtn.classList.remove('active');
        if (typeof window.doors_toggle !== 'undefined') window.doors_toggle = false;
      }

      // Also trigger original element click if available for legacy handlers
      const btnIdMap = {
        day: 'dayenv',
        night: 'nightenv',
        studio: 'studioenv'
      };
      const orig = document.getElementById(btnIdMap[envKey]);
      if (orig) orig.click();

      // Update bottom carousel card active states
      envCards.forEach(card => {
        card.classList.toggle('active', card.dataset.env === envKey);
      });
    }

    envCards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        setEnvironment(card.dataset.env);
      });
    });

    // Carousel Arrow Navigation
    const carouselPrev = document.getElementById('env-carousel-prev');
    const carouselNext = document.getElementById('env-carousel-next');
    const envOrder = ['day', 'night', 'studio'];

    if (carouselPrev && carouselNext) {
      carouselPrev.addEventListener('click', (e) => {
        e.preventDefault();
        const activeCard = document.querySelector('.env-thumbnail-card.active');
        const activeEnv = activeCard ? activeCard.dataset.env : 'day';
        const idx = envOrder.indexOf(activeEnv);
        const nextIdx = (idx - 1 + envOrder.length) % envOrder.length;
        setEnvironment(envOrder[nextIdx]);
      });

      carouselNext.addEventListener('click', (e) => {
        e.preventDefault();
        const activeCard = document.querySelector('.env-thumbnail-card.active');
        const activeEnv = activeCard ? activeCard.dataset.env : 'day';
        const idx = envOrder.indexOf(activeEnv);
        const nextIdx = (idx + 1) % envOrder.length;
        setEnvironment(envOrder[nextIdx]);
      });
    }

    // 2. Sidebar Navigation Items
    const sidebarItems = document.querySelectorAll('.sidebar-nav-item');
    const bodyColorPanel = document.getElementById('body-color-panel');
    const seatsColorPanel = document.getElementById('seats-color-panel');
    let isExitFeatureEnabled = false;
    sidebarItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const action = item.dataset.action;

        if (action === 'paint') {
          const isCurrentlyOpen = bodyColorPanel && !bodyColorPanel.classList.contains('collapsed');
          if (isCurrentlyOpen) {
            item.classList.remove('active');
            bodyColorPanel.classList.add('collapsed');
          } else {
            const panelNavItems = document.querySelectorAll('.sidebar-nav-item[data-action="paint"], .sidebar-nav-item[data-action="interior"]');
            panelNavItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            if (bodyColorPanel) bodyColorPanel.classList.remove('collapsed');
            if (seatsColorPanel) seatsColorPanel.classList.add('collapsed');
          }
        } else if (action === 'interior') {

          const isCurrentlyOpen = seatsColorPanel &&
            !seatsColorPanel.classList.contains('collapsed');

          if (isCurrentlyOpen) {

            // Close Interior options - No postMessage
            item.classList.remove('active');
            seatsColorPanel.classList.add('collapsed');

          } else {
            // Send message ONLY when opening Interior options
            sendPlayCanvasMessage('interior:');

            const panelNavItems = document.querySelectorAll(
              '.sidebar-nav-item[data-action="paint"], .sidebar-nav-item[data-action="interior"]'
            );

            panelNavItems.forEach(i => i.classList.remove('active'));

            item.classList.add('active');

            if (seatsColorPanel) {
              seatsColorPanel.classList.remove('collapsed');
            }

            if (bodyColorPanel) {
              bodyColorPanel.classList.add('collapsed');
            }

            const seatOrig = document.getElementById('seat');
            if (seatOrig) seatOrig.click();
          }

        } else if (action === 'lights') {
          lightsOn = !lightsOn;
          item.classList.toggle('active', lightsOn);
          sendPlayCanvasMessage(lightsOn ? 'lights:' : 'lightsoff:');
          if (typeof window.lights_toggle !== 'undefined') window.lights_toggle = lightsOn;
        } else if (action === 'doors') {
          doorsOpen = !doorsOpen;
          item.classList.toggle('active', doorsOpen);
          sendPlayCanvasMessage('doors:');
          if (typeof window.doors_toggle !== 'undefined') window.doors_toggle = doorsOpen;
        } else if (action === 'ind') {
          indOn = !indOn;
          item.classList.toggle('active', indOn);
          sendPlayCanvasMessage(indOn ? 'ind:' : 'indoff:');
          if (typeof window.ind_toggle !== 'undefined') window.ind_toggle = indOn;
        } else if (action === 'camera') {
          sendPlayCanvasMessage('screenshot:');
          const shotOrig = document.getElementById('screenshot');
          if (shotOrig) shotOrig.click();
        } else if (action === 'home') {
          sendPlayCanvasMessage('ResetCamera:');
          const resetCam = document.getElementById('ResetCamera');
          if (resetCam) resetCam.click();
        } else if (action === 'fullscreen') {
          const fsBtn = document.getElementById('fullscreenToggleButton');
          if (fsBtn) fsBtn.click();
        }
      });
    });

    // Top-left Home button handler
    const topHomeBtn = document.getElementById('btn-top-home');

    if (topHomeBtn) {
      topHomeBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if (isExitFeatureEnabled) {
          // Same postMessage as Exit Feature
          sendPlayCanvasMessage('wapsi:');

          isExitFeatureEnabled = false;

          topHomeBtn.classList.remove('btn-blink');
          document.getElementById('wapsi')?.classList.remove('btn-blink');

          // Hide Exit Feature like its normal click
          if (typeof disableExitButton === 'function') {
            disableExitButton();
          }

        } else {
          // Normal Home behavior
          sendPlayCanvasMessage('ResetCamera:');
        }

        if (bodyColorPanel) bodyColorPanel.classList.add('collapsed');
        if (seatsColorPanel) seatsColorPanel.classList.add('collapsed');

        document.querySelectorAll(
          '.sidebar-nav-item[data-action="paint"], .sidebar-nav-item[data-action="interior"]'
        ).forEach(b => b.classList.remove('active'));
      });
    }
    // Keep doorsOpen in sync if closed/opened via studio or legacy bridge
    const legacyDoors = document.getElementById('doors');
    if (legacyDoors) {
      legacyDoors.addEventListener('click', () => {
        if (typeof window.doors_toggle !== 'undefined') {
          doorsOpen = window.doors_toggle;
          const doorsBtn = document.querySelector('.sidebar-nav-item[data-action="doors"]');
          if (doorsBtn) doorsBtn.classList.toggle('active', doorsOpen);
        }
      });
    }

    // 3. Engine Ignition Control (Engine Start / Stop)
    const engineStartBtn = document.getElementById('btn-engine-start');
    const engineStopBtn = document.getElementById('btn-engine-stop');
    let engineRunning = true;

    function setEngineState(running) {
      engineRunning = running;
      if (engineStartBtn && engineStopBtn) {
        engineStartBtn.classList.toggle('active', engineRunning);
        engineStopBtn.classList.toggle('active', !engineRunning);
      }

      if (engineRunning) {
        // Send start messages to PlayCanvas
        sendPlayCanvasMessage('Sart-Car:');
        sendPlayCanvasMessage('Start-Car:');
        sendPlayCanvasMessage('enginestart:');
        sendPlayCanvasMessage('engine_start:');
        const legacyStart = document.getElementById('StartBt');
        if (legacyStart) legacyStart.click();
      } else {
        // Send stop messages to PlayCanvas
        sendPlayCanvasMessage('Stop-Car:');
        sendPlayCanvasMessage('enginestop:');
        sendPlayCanvasMessage('engine_stop:');
      }
    }

    if (engineStartBtn) {
      engineStartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setEngineState(true);
      });
    }

    if (engineStopBtn) {
      engineStopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setEngineState(false);
      });
    }

    // 4. Color Swatches (Body & Seat Colors)
    const colorRows = document.querySelectorAll('.color-row-item');
    colorRows.forEach(row => {
      row.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = row.closest('.color-palette-list');
        if (parent) {
          parent.querySelectorAll('.color-row-item').forEach(r => r.classList.remove('active'));
        }
        row.classList.add('active');

        // Update header active color badge
        const colorLabel = row.querySelector('.color-label-text');
        if (colorLabel) {
          const badge = row.closest('.luxury-color-card')?.querySelector('.panel-active-color-badge');
          if (badge) badge.textContent = colorLabel.textContent;
        }

        const colorKey = row.dataset.color;
        const colorMsgMap = {
          blue: 'blue:',
          black: 'black:',
          white: 'white:',
          igrey: 'Igrey:',
          grey: 'grey:',
          greyseat: 'greyseat:',
          blackseat: 'blackseat:',
          whiteseat: 'whiteseat:'
        };

        const msg = colorMsgMap[colorKey];
        if (msg) {
          sendPlayCanvasMessage(msg);
        }

        const origBtn = document.getElementById(colorKey);
        if (origBtn) origBtn.click();
      });
    });

    // Color panel close/toggle chevrons
    document.querySelectorAll('.panel-close-chevron').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const card = btn.closest('.luxury-color-card');
        if (card) {
          card.classList.add('collapsed');
          const action = card.id === 'body-color-panel' ? 'paint' : 'interior';
          const navBtn = document.querySelector(`.sidebar-nav-item[data-action="${action}"]`);
          if (navBtn) navBtn.classList.remove('active');
        }
      });
    });

    // 4. Feature Info Card (Bottom-Right)
    const featureCard = document.getElementById('feature-info-card');
    const featureImg = document.getElementById('feature-card-img');
    const featureTitle = document.getElementById('feature-card-title');
    const featureDesc = document.getElementById('feature-card-desc');
    const featureCounter = document.getElementById('feature-counter-txt');
    const featureProgress = document.getElementById('feature-progress-fill');
    const featureClose = document.getElementById('feature-card-close');
    const featurePrev = document.getElementById('feature-prev-btn');
    const featureNext = document.getElementById('feature-next-btn');

    function updateFeatureCard(index) {
      if (index < 0) index = featuresData.length - 1;
      if (index >= featuresData.length) index = 0;
      currentFeatureIndex = index;

      const f = featuresData[currentFeatureIndex];
      if (featureImg) featureImg.src = f.image;
      if (featureTitle) featureTitle.textContent = f.title;
      if (featureDesc) featureDesc.textContent = f.desc;
      if (featureCounter) {
        featureCounter.textContent = `0${currentFeatureIndex + 1} / 0${featuresData.length}`;
      }
      if (featureProgress) {
        const pct = ((currentFeatureIndex + 1) / featuresData.length) * 100;
        featureProgress.style.width = `${pct}%`;
      }
      if (featureCard) {
        featureCard.classList.remove('hidden');
      }
    }

    if (featureClose) {
      featureClose.addEventListener('click', (e) => {
        e.preventDefault();
        if (featureCard) featureCard.classList.add('hidden');
      });
    }

    if (featurePrev) {
      featurePrev.addEventListener('click', (e) => {
        e.preventDefault();
        updateFeatureCard(currentFeatureIndex - 1);
      });
    }

    if (featureNext) {
      featureNext.addEventListener('click', (e) => {
        e.preventDefault();
        updateFeatureCard(currentFeatureIndex + 1);
      });
    }


    // 6. Listen for PlayCanvas incoming modal trigger events and app:ready signal
    window.addEventListener('message', function (event) {
      if (!event.data) return;
      const data = event.data;
      if (data === 'enableexitbutton') {
        isExitFeatureEnabled = true;

        document.getElementById('btn-top-home')?.classList.add('btn-blink');
        document.getElementById('wapsi')?.classList.add('btn-blink');
      }
      console.log('[PlayCanvas Event Received]:', data);

      // App ready detection (supports "app:ready", "appready", "app_ready" or object payload)
      if (typeof data === 'string') {
        const cleaned = data.trim().toLowerCase();
        if (cleaned === 'app:ready' || cleaned === 'appready' || cleaned === 'app_ready') {
          sendPlayCanvasMessage('dayenv:');
          enableShowroomUI();


          return;
        }
      } else if (typeof data === 'object') {
        const type = String(data.type || data.event || data.action || '').trim().toLowerCase();
        if (type === 'app:ready' || type === 'appready' || type === 'app_ready') {
          enableShowroomUI();
          return;
        }
      }

      if (data === 'enableHLpopup') {
        updateFeatureCard(0); // Boomerang DRL
      } else if (data === 'enableSideMirrorpopup') {
        updateFeatureCard(1); // Mirrors
      } else if (data === 'enableSideWindowspopup') {
        updateFeatureCard(2); // C-Pillar
      } else if (data === 'enableTailLightspopup') {
        updateFeatureCard(3); // Tail lights
      } else if (data === 'enableGlasspopup') {
        updateFeatureCard(4); // Roof rack
      } else if (data === 'enableSteeringpopup') {
        updateFeatureCard(5); // Panoramic display
      }
    });

    // Feature card will open when triggered by user or PlayCanvas
  }

  // Ensure UI is initially disabled until app:ready arrives
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      disableShowroomUI();
      initLuxuryUI();
    });
  } else {
    disableShowroomUI();
    initLuxuryUI();
  }

})();

