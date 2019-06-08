let data = '';

search.addEventListener('keyup', (e) => {
  searchButton.disabled = search.value.length == 0 ? true : false;
  if (e.keyCode === 13) {
    e.preventDefault();
    searchButton.click();
  }
});

keyInput.addEventListener('keyup', (e) => {
  processButton.disabled = keyInput.value.length == 0 ? true : false;
  if (e.keyCode === 13) {
    e.preventDefault();
    processButton.click();
  }
});

searchButton.addEventListener('click', () => {
  if (search.value.length == 0) return;
  fetch(`/files/${search.value}`)
      .then((res) => {
        if (res.status === 200) {
          res.text().then((text) => {
            getContainer.classList.remove('disabled');
            lowerContainer.classList.add('disabled');
            const textNode = document.createTextNode(text);
            getContainer.children[0].appendChild(textNode);

            data = text;
          });
        } else throw Error('File not found! Please, check your file id');
      })
      .catch((err) => alert(err));
});

processButton.addEventListener('click', () => {
  const key = keyInput.value;
  const text = vigenere.decryption('en', data, key);

  const textNode = document.createTextNode(text);
  getContainer.children[0].appendChild(textNode);
  getContainer.children[0].removeChild(textNode.previousSibling);
});
