import { Injectable } from '@angular/core';
import { Howl, Howler } from 'howler';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private sounds: { [key: string]: Howl } = {};

  constructor() {
    this.loadSounds();
  }

  private loadSounds() {
    // 🎵 musique de fond
    this.sounds['bg'] = new Howl({
      src: ['assets/audio/music.mp3'],
      loop: true,
      volume: 0.3
    });

    // 🔊 effets
    this.sounds['click'] = new Howl({
      src: ['assets/audio/click.mp3'],
      volume: 0.7
    });

    this.sounds['success'] = new Howl({
      src: ['assets/audio/success.mp3'],
      volume: 0.7
    });
  }

  // 🎵 musique
  playMusic() {
    this.sounds['bg'].play();
  }

  stopMusic() {
    this.sounds['bg'].stop();
  }

  // 🔊 effets
  play(key: string) {
    this.sounds[key]?.play();
  }

  // 🎚 volume global
  setGlobalVolume(volume: number) {
    Howler.volume(volume);
  }

  // 🔇 mute global
  mute(muted: boolean) {
    Howler.mute(muted);
  }
}