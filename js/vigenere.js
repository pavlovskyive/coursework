'use strict';

const vigenere = {
  ru: 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split(''),
  en: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),

  vigenereSquare: [],

  generateVigenereSquare: function(language) {
    const alphabet = this[language];
    alphabet.map(
        (val, i) =>
          (this.vigenereSquare[i] = alphabet
              .slice(i)
              .concat(alphabet.slice(0, i)))
    );
  },

  encryption: function(language, text, key) {
    if (!this[language]) return false;
    this.generateVigenereSquare(language);
    let s = '';

    const re = new RegExp(`[^${this[language].join('')}]`, 'g');

    text = text.toUpperCase().replace(re, '');
    key = key.toUpperCase().replace(re, '');

    [...text].forEach((letter, index) => {
      const row = this[language].indexOf(letter);
      const coll = this[language].indexOf(key[index % key.length]);
      s += this.vigenereSquare[row][coll];
    });
    return s;
  },

  decryption: function(language, cipher, key) {
    if (!this[language]) return false;
    this.generateVigenereSquare(language);
    let s = '';

    const re = new RegExp(`[^${this[language].join('')}]`, 'g');

    cipher = cipher.toUpperCase().replace(re, '');
    key = key.toUpperCase().replace(re, '');

    [...cipher].forEach((letter, index) => {
      const row = this[language].indexOf(key[index % key.length]);
      const coll = this.vigenereSquare[row].indexOf(letter);
      s += this[language][coll];
    });

    return s;
  },
};
