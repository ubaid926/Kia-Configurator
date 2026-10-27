function setActive(button) {
    // Remove the 'active' class from all buttons
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Add the 'active' class to the clicked button
    button.classList.add('active');
}


function setActiveBorder(clickedButton) {
    // Get all color buttons that can be active
    const colorButtons = document.querySelectorAll('.color-button-js');

    // Remove the active class from all color buttons
    colorButtons.forEach(button => {
        button.classList.remove('color-button--active');
    });

    // Add the active class to the clicked button
    clickedButton.classList.add('color-button--active');

    // You can add more logic here if needed
    console.log('Active color:', clickedButton.title);
}

/////////////////////////////////////////////////////////////////////////////////////
// Select elements
const bodyPanel = document.getElementById('body-panel');
const seatsPanel = document.getElementById('seats-panel');

// Image buttons
const bodyImage = document.getElementById('paint');
const seatsImage = document.getElementById('seat');

// Function to toggle panels and close the other
function togglePanel(panelToShow, panelToHide) {
    // Toggle visibility of the selected panel
    if (panelToShow.classList.contains('visible')) {
        panelToShow.classList.remove('visible');
    } else {
        panelToHide.classList.remove('visible'); // Close the other panel
        panelToShow.classList.add('visible');   // Open the requested panel
    }
}

// Click events for images
bodyImage.addEventListener('click', () => {
    togglePanel(bodyPanel, seatsPanel);
});

seatsImage.addEventListener('click', () => {
    togglePanel(seatsPanel, bodyPanel);
});

// Color selection functionality remains unchanged
function setActiveBorder(element) {
    const parentContainer = element.closest('.color-options');
    parentContainer.querySelectorAll('.color-button--active').forEach(btn => {
        btn.classList.remove('color-button--active');
    });

    element.classList.add('color-button--active');
}

///////////////////////////////////////////////////////////////////////////////////////
// document.querySelectorAll(".side-panel-icon").forEach(icon => {
//     icon.addEventListener("click", function () {
//         if (this.classList.contains("active")) {
//             // If the clicked icon is already active, remove the active class
//             this.classList.remove("active");
//         } else {
//             // Remove active class from all icons
//             document.querySelectorAll(".side-panel-icon").forEach(i => i.classList.remove("active"));
//             // Add active class to the clicked icon
//             this.classList.add("active");
//         }
//     });
// });


document.querySelectorAll(".side-panel-icon").forEach(icon => {
    icon.addEventListener("click", function () {
        if (this.id != 'screenshot-btn' && this.id != 'ResetCamera-btn') {
            console.log(this.id);
            this.classList.toggle("active");
        }
    });
});

///////////////////////////////////////////////////////////////////////////////////////
// Fullscreen Toggle Class
var FullscreenToggle = function (elementId) {
    this.isFullscreen = false;
    this.element = document.getElementById(elementId);
    if (this.element) {
        this.element.addEventListener('click', this.toggleFullscreen.bind(this));
    }
};

FullscreenToggle.prototype.toggleFullscreen = function () {
    if (!this.isFullscreen) {
        this.enterFullscreen();
    } else {
        this.exitFullscreen();
    }
    this.isFullscreen = !this.isFullscreen;
};

FullscreenToggle.prototype.enterFullscreen = function () {
    var docElm = document.documentElement;
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) { // Firefox
        docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullscreen) { // Chrome, Safari & Opera
        docElm.webkitRequestFullscreen();
    } else if (docElm.msRequestFullscreen) { // IE/Edge
        docElm.msRequestFullscreen();
    }
};

FullscreenToggle.prototype.exitFullscreen = function () {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari & Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
};

// Initialize the FullscreenToggle when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    new FullscreenToggle('fullscreenToggleButton');

    // Listen for fullscreen change events to update the button state
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    function handleFullscreenChange() {
        var fullscreenElement = document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement;

        // Update any UI elements based on fullscreen state if needed
    }
});

// Your other JavaScript functions
function setActive(button) {
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
}

function setActiveBorder(button) {
    const parent = button.closest('.color-options');
    parent.querySelectorAll('.color-button').forEach(btn => {
        btn.classList.remove('color-button--active');
    });
    button.classList.add('color-button--active');
}
/////////////////////////////////////////////////////////////////////////////////////
let toggle = false;

var ind_toggle = false;
var lights_toggle = false;
var doors_toggle = false;
function playSound() {
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

    if (toggle) {
        const soundClose = document.getElementById("DoorCloseSound");
        setTimeout(() => soundClose.play(), 2000);

    } else {
        const soundOpen = document.getElementById("DoorOpenSound");
        soundOpen.play();
    }
    toggle = !toggle;
}
//////////////////////////////////////////////////////////////////////
let isPlaying = false;
let indicatorSound;
let loopTimeout;

function playIndSound() {
    indicatorSound = document.getElementById("IndicatorsSound");

    if (!isPlaying) {
        // Start playing and looping the sound
        playSoundLoop();
        isPlaying = true;
    } else {
        // Stop the sound and clear the loop
        stopSoundLoop();
        isPlaying = false;
    }
}

function playSoundLoop() {
    indicatorSound.play();
    loopTimeout = setTimeout(() => {
        indicatorSound.currentTime = 0;
        playSoundLoop();
    }, 740); // 9070 milliseconds = 9.07 seconds
}

function stopSoundLoop() {
    clearTimeout(loopTimeout);
    indicatorSound.pause();
    indicatorSound.currentTime = 0;
}


$("#ind").on("click", function () {
    console.log("ind:");
    if (ind_toggle) {
        app.contentWindow.postMessage("indoff:", "*");
        // app.contentWindow.postMessage("ind:", "*");    
        ind_toggle = false;
    } else {
        ind_toggle = true;
        app.contentWindow.postMessage("ind:", "*");
    }

});

///////////////////////////////////////////////////////////////////////

var app;
$(document).ready(function () {
    console.log("ready!");
    app = document.getElementById("app");

});



$("#lights").on("click", function () {
    console.log("lights:");
    if (lights_toggle) {
        app.contentWindow.postMessage("lightsoff:", "*");
        // app.contentWindow.postMessage("lights:", "*");    
        lights_toggle = false;
    } else {
        lights_toggle = true;
        app.contentWindow.postMessage("lights:", "*");
    }
    // app.contentWindow.postMessage("lights:", "*");
});

$("#doors").on("click", function () {
    console.log("doors:");

    if (doors_toggle) {
        app.contentWindow.postMessage("doors:", "*");
        // app.contentWindow.postMessage("lights:", "*");    
        doors_toggle = false;
    } else {
        doors_toggle = true;
        app.contentWindow.postMessage("doors:", "*");
    }
    // app.contentWindow.postMessage("doors:", "*");
});

$("#color").on("click", function () {
    console.log("color:");
    app.contentWindow.postMessage("color:", "*");
});

$("#music").on("click", function () {
    console.log("music:");
    app.contentWindow.postMessage("music:", "*");
});

$("#screenshot").on("click", function () {
    console.log("screenshot:");
    app.contentWindow.postMessage("screenshot:", "*");
});

$("#sunrooffbt").on("click", function () {
    console.log("sunrooffbt:");
    app.contentWindow.postMessage("sunroof:", "*");
});

$("#StartBt").on("click", function () {
    console.log("Sart-Car:");
    app.contentWindow.postMessage("Sart-Car:", "*");
});

$("#blue").on("click", function () {
    console.log("bluecolor:");
    app.contentWindow.postMessage("blue:", "*");
});

$("#black").on("click", function () {
    console.log("blackcolor:");
    app.contentWindow.postMessage("black:", "*");
});

$("#red").on("click", function () {
    console.log("redcolor:");
    app.contentWindow.postMessage("red:", "*");
});

$("#white").on("click", function () {
    console.log("whitecolor:");
    app.contentWindow.postMessage("white:", "*");
});

$("#igrey").on("click", function () {
    console.log("InterstellarGreyColorButton:");
    app.contentWindow.postMessage("Igrey:", "*");
});

$("#grey").on("click", function () {
    console.log("InterstellarGreyColorButton:");
    app.contentWindow.postMessage("grey:", "*");
});

$("#dayenv").on("click", function () {
    console.log("dayenv:");
    app.contentWindow.postMessage("dayenv:", "*");
});

$("#nightenv").on("click", function () {
    console.log("nightenv:");
    app.contentWindow.postMessage("nightenv:", "*");
});

$("#studioenv").on("click", function () {
    console.log("studioenv:");
    app.contentWindow.postMessage("studioenv:", "*");
    if (doors_toggle) {
        document.getElementById('doors').click();
        // console.log('toggle door');
        // doors_toggle = false;
    }
    else {
        // doors_toggle = true;
    }
});

$("#greyseat").on("click", function () {
    console.log("greyseatcolor:");
    app.contentWindow.postMessage("greyseat:", "*");
});

$("#blackseat").on("click", function () {
    console.log("blackseatcolor:");
    app.contentWindow.postMessage("blackseat:", "*");
});

$("#whiteseat").on("click", function () {
    console.log("whiteseatcolor:");
    app.contentWindow.postMessage("whiteseat:", "*");
});
$("#ResetCamera").on("click", function () {
    console.log("ResetCamera:");
    app.contentWindow.postMessage("ResetCamera:", "*");
});


function DisableSFButton() {
    document.getElementById("sunrooffbt").disabled = true;
}
function EnableSFButton() {
    document.getElementById("sunrooffbt").disabled = false;
}

// Listen for post messages
window.onmessage = function (event) {
    console.log(event.data);
    if (event.data === "app:ready" || event.data === "appready" || event.data === "app_ready") {
        if (typeof window.enableShowroomUI === 'function') {
            window.enableShowroomUI();
        } else {
            document.body.classList.remove('app-loading');
            document.body.classList.add('app-ready');
            const ui1 = document.getElementById('UI_container');
            const ui2 = document.getElementById('UI_container2');
            const topBar = document.getElementById('top-bar');
            if (ui1) ui1.style.display = 'flex';
            if (ui2) ui2.style.display = 'flex';
            if (topBar) topBar.style.display = 'flex';
        }
        if (typeof app !== 'undefined' && app.click) {
            app.click();
        }
    }
    if (event.data === "enableexitbutton") {
        enableExitButton();
        console.log('exitbutton');
    }
    if (event.data === "enableHLpopup") {
        var headlight_btn = document.getElementById('btn_2');
        headlight_btn.click();
        console.log('headlight_btn');
    }
    if (event.data === "enableSideMirrorpopup") {
        var SideMirror_btn = document.getElementById('btn_1');
        SideMirror_btn.click();
        console.log('SideMirror_btn');
    }
    if (event.data === "enableGlasspopup") {
        var Glass_btn = document.getElementById('btn_5');
        Glass_btn.click();
        console.log('Glass_btn');
    }
    if (event.data === "enableSideWindowspopup") {
        var SideWindows_btn = document.getElementById('btn_3');
        SideWindows_btn.click();
        console.log('SideWindows_btn');
    }
    if (event.data === "enableTailLightspopup") {
        var TailLights_btn = document.getElementById('btn_4');
        TailLights_btn.click();
        console.log('TailLights_btn');
    }
    if (event.data === "enableSteeringpopup") {
        var Steering_btn = document.getElementById('btn_10');
        Steering_btn.click();
        console.log('Steering_btn');
    }
    if (event.data === "enableBackSeatpopup") {
        var BackSeat_btn = document.getElementById('btn_8');
        BackSeat_btn.click();
        console.log('BackSeat_btn');
    }
    if (event.data === "enableGearpopup") {
        var Gear_btn = document.getElementById('btn_6');
        Gear_btn.click();
        console.log('Gear_btn');
    }
    if (event.data === "enableSeatpopup") {
        var Seat_btn = document.getElementById('btn_7');
        Seat_btn.click();
        console.log('Seat_btn');
    }
    if (event.data === "enableSFbutton") {
        EnableSFButton();
    }
    if (event.data === "disableSFbutton") {
        DisableSFButton();
    }
};


$("#wapsi").on("click", function () {
    console.log("wapsi:");
    app.contentWindow.postMessage("wapsi:", "*");
});

function disableExitButton() {
    var exitButton = document.getElementById('wapsi');
    var homeButton = document.getElementById('btn-top-home');
    exitButton.style.opacity = '0.25';
    exitButton.style.pointerEvents = 'none';
    exitButton.style.cursor = 'not-allowed';
    exitButton.classList.remove('btn-blink');
    if (homeButton) homeButton.classList.remove('btn-blink');
}

function enableExitButton() {
    var exitButton = document.getElementById('wapsi');
    var homeButton = document.getElementById('btn-top-home');
    exitButton.style.opacity = '1';
    exitButton.style.pointerEvents = 'auto';
    exitButton.style.cursor = 'pointer';
    // small delay so opacity transition finishes before animation starts
    setTimeout(function() {
        exitButton.classList.add('btn-blink');
        if (homeButton) homeButton.classList.add('btn-blink');
    }, 50);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobile panel toggle function
function toggleMobilePanel(panelId) {
    // Handle each panel case
    switch (panelId) {
        case 'ind':
            playIndSound();
            // Add your indicator toggle logic here
            break;
        case 'lights':
            // Add your lights toggle logic here
            break;
        case 'doors':
            playSound();
            // Add your doors toggle logic here
            break;
        case 'paint':
            togglePanel(bodyPanel, seatsPanel);
            break;
        case 'screenshot':
            // Add your screenshot logic here
            break;
        case 'sunrooffbt':
            // Add your sunroof toggle logic here
            break;
        case 'seat':
            // Add your seats toggle logic here
            break;
        default:
            break;
    }
}

// Show/hide UI based on screen size (Updated to safely handle elements)
function checkScreenSize() {
    const mobileUI = document.getElementById('mobileUI');
    // Side panel display logic is now primarily handled by CSS media queries

    if (window.innerWidth <= 768) {
        if (mobileUI) mobileUI.style.display = 'flex';
    } else {
        if (mobileUI) mobileUI.style.display = 'none';
    }
}

// Run on load and resize
window.addEventListener('load', checkScreenSize);
window.addEventListener('resize', checkScreenSize);
////////////////////////////////////////////////////////////////////////////////////////////////////////////







