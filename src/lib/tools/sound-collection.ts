import type { Sound } from '@pixi/sound'

export class SoundCollection {
  private _lastPlayedIndex = -1

  constructor(private sounds: Sound[], private randomly: boolean = false) {}

  public play() {
    const playIndex = this.randomly
      ? Math.floor(Math.random() * this.sounds.length)
      : this._lastPlayedIndex + (1 % this.sounds.length)

    if (this.randomly && playIndex === this._lastPlayedIndex) {
      this.play()
      return
    }

    this._lastPlayedIndex = playIndex

    this.sounds[playIndex].play()
  }
}
