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
      src: ['assets/audio/piano_chill.mp3'],
      loop: true,
      volume: 0.3
    });

    this.sounds['unlock_common'] = new Howl({
      src: ['assets/audio/unlock_common.mp3'],
      volume: 0.7
    });

    this.sounds['unlock_rare'] = new Howl({
      src: ['assets/audio/unlock_rare.mp3'],
      volume: 0.7
    });
    this.sounds['unlock_legendary'] = new Howl({
      src: ['assets/audio/unlock_legendary.mp3'],
      volume: 0.7
    });
    // // 🔊 effets
    // this.sounds['click'] = new Howl({
    //   src: ['assets/audio/click.mp3'],
    //   volume: 0.7
    // });

    // this.sounds['success'] = new Howl({
    //   src: ['assets/audio/success.mp3'],
    //   volume: 0.7
    // });
  }

  // 🎵 musique
  playMusic() {
    this.sounds['bg'].play();
  }

  stopMusic() {
    this.sounds['bg'].stop();
  }

  // 🔊 effets
  play(key: Sound) {
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

export enum Sound {
  BG = 'bg',
  UNLOCK_COMMON = 'unlock_common',
  UNLOCK_RARE = 'unlock_rare',
  UNLOCK_LEGENDARY = 'unlock_legendary'
}