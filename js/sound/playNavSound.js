/* Copyright: Sounds from: https://freesound.org/people/LittleRobotSoundFactory/packs/16681/?page=2#sound */

/* play Sound from given path */
function playSound(soundPath) {
    const audio = new Audio(soundPath);
    audio.play();
}

/* add Event-Listeners to all buttons */
document.querySelectorAll('button').forEach(function (button) {
    button.addEventListener('mouseover', function () {
        playSound('data/sound/Menu_Navigate_00.mp3');
    });

    button.addEventListener('mousedown', function () {
        if (button.classList.contains('is-blue') || button.classList.contains('is-green') || button.classList.contains('is-red')) {
            playSound('data/sound/Menu_Navigate_01.mp3');
        } else {
            playSound('data/sound/Menu_Navigate_02.mp3');
        }
    });
});