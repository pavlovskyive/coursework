/* eslint-disable require-jsdoc */
'use strict';

export default class Vigenere {
  constructor() {
    this['ru'] = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');
    this['en'] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    this.vigenereSquare = [];
  }

  generateVigenereSquare(lan) {
    const alphabet = this[lan];
    for (let i = 0; i < alphabet.length; i++) {
      this.vigenereSquare[i] = alphabet.slice(i).concat(alphabet.slice(0, i));
    }
  }

  encryption(lan, text, key) {
    this.generateVigenereSquare(lan);
    let s = '';

    const re = new RegExp(`[^${this[lan].join('')}]`, 'g');

    text = text.toUpperCase().replace(re, '');
    key = key.toUpperCase().replace(re, '');

    [...text].forEach((letter, index) => {
      const row = this[lan].indexOf(letter);
      const coll = this[lan].indexOf(key[index % key.length]);
      s += this.vigenereSquare[row][coll];
    });
    return s;
  }

  decryption(lan, text, key) {
    this.generateVigenereSquare(lan);
    let s = '';

    const re = new RegExp(`[^${this[lan].join('')}]`, 'g');

    text = text.toUpperCase().replace(re, '');
    key = key.toUpperCase().replace(re, '');

    [...text].forEach((letter, index) => {
      const row = this[lan].indexOf(key[index % key.length]);
      const coll = this.vigenereSquare[row].indexOf(letter);
      s += this[lan][coll];
    });

    return s;
  }
}
