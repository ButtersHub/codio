import {showMessage,  MESSAGES} from '../user_interface/messages';
import {showPlayerProgressBar} from '../user_interface/Viewers';
import Player from '../player/Player';
import Recorder from '../recorder/Recorder';
import FSManager from '../filesystem/FSManager';

export default async function playCodio(fsManager: FSManager, player: Player, recorder: Recorder, path? : string) {
  try {
    if (recorder && recorder.isRecording) {
      showMessage(MESSAGES.cantPlayWhileRecording);
      return;
    }
    if (player && player.isPlaying) {
      showMessage(MESSAGES.stopTutorial);
      player.pause();
      player.closeTutorial();
    }
    if (path) {
      await loadAndPlay(player, path);
    } else {
      const codioId = await fsManager.chooseCodio();
      if (codioId) {
        const codioPath = fsManager.codioPath(codioId);
        //@TODO: add an if to check that the folder contains audio.mp3 and actions.json
        await loadAndPlay(player, codioPath);
      }
    }
  } catch (e) {
    console.log("Play codio failed", e);
  }
}

async function loadAndPlay(player: Player, path) {
  showMessage(MESSAGES.tutorialStart);
  await player.loadCodio(path);
  await player.startTutorial();
  showPlayerProgressBar(player, false);

}