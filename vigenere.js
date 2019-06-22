'use strict'

const fs = require('fs')

const vigenere = {
  ru: 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split(''),
  en: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),

  vigenereSquare: [],

  generateVigenereSquare: function(language) {
    const alphabet = this[language]
    alphabet.map(
      (val, i) =>
        (this.vigenereSquare[i] = alphabet
          .slice(i)
          .concat(alphabet.slice(0, i)))
    )
  },

  encryption: function(language, text, key) {
    if (!this[language]) return false
    this.generateVigenereSquare(language)
    let s = ''

    const re = new RegExp(`[^${this[language].join('')}]`, 'g')

    text = text.toUpperCase().replace(re, '')
    key = key.toUpperCase().replace(re, '')
    ;[...text].forEach((letter, index) => {
      const row = this[language].indexOf(letter)
      const coll = this[language].indexOf(key[index % key.length])
      s += this.vigenereSquare[row][coll]
    })
    return s
  },

  decryption: function(language, cipher, key) {
    if (!this[language]) return false
    this.generateVigenereSquare(language)
    let s = ''

    const re = new RegExp(`[^${this[language].join('')}]`, 'g')

    cipher = cipher.toUpperCase().replace(re, '')
    key = key.toUpperCase().replace(re, '')
    ;[...cipher].forEach((letter, index) => {
      const row = this[language].indexOf(key[index % key.length])
      const coll = this.vigenereSquare[row].indexOf(letter)
      s += this[language][coll]
    })

    return s
  },
}

fs.readFile('./text.txt', 'utf8', (err, data) => {
  if (err) throw err
  console.log(`\n\nText from file:\n
    ${data}\n\n\n`)
  const text = vigenere.encryption('en', data, 'SHAKESPEARE')
  console.log(`Encrypted text:\n
    ${vigenere.encryption('en', data, 'SHAKESPEARE')}\n\n\n`)
  console.log(`Decrypted text:\n
    ${vigenere.decryption('en', text, 'SHAKESPEARE')}\n\n\n`)
})
