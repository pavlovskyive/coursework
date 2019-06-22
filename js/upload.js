import Vigenere from '/js/vigenere.js';
const vigenere = new Vigenere();

const dropArea = document.getElementById('drop-area');
const uploadContainer = document.getElementById('upload-container');
const keyInput = document.getElementById('key');
const processButton = document.getElementById('process-button');
const uploadButton = document.getElementById('upload-button');
const notification = document.getElementById('notification');
const fileElem = document.getElementById('file-elem');

fileElem.addEventListener('change', (e) => handleFiles(e.target.files));

keyInput.placeholder = 'key to cipher:';

let counter = 0;

[
  'drag',
  'dragstart',
  'dragend',
  'dragover',
  'dragenter',
  'dragleave',
  'drop',
].forEach((eventName) =>
  dropArea.addEventListener(
      eventName,
      (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      false
  )
);

['dragenter'].forEach((eventName) => {
  dropArea.addEventListener(
      eventName,
      () => {
        dropArea.classList.add('highlight');
        counter++;
      },
      false
  );
});

['dragleave', 'drop'].forEach((eventName) => {
  dropArea.addEventListener(
      eventName,
      () => {
        counter--;
        if (counter === 0) dropArea.classList.remove('highlight');
      },
      false
  );
});

let data = '';

dropArea.addEventListener('drop', (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;

  handleFiles(files);
});

const handleFiles = (files) => {
  if (files.length > 1) return alert('Please, upload 1 file at time!');
  [...files].forEach((file) => {
    return file.name.split('.').pop() === 'txt'
      ? openFile(file)
      : alert('Please, pick a txt file and try again');
  });
};

const openFile = (file) => {
  const reader = new FileReader();
  reader.onload = () => {
    const text = reader.result;

    dropArea.classList.add('disabled');
    uploadContainer.classList.remove('disabled');

    const node = document.createTextNode(text);
    uploadContainer.children[0].appendChild(node);

    data = text;
  };
  reader.onerror = () => {
    alert('Error while reading file');
  };
  reader.readAsText(file);
};

keyInput.addEventListener('keyup', (e) => {
  processButton.disabled = e.target.value.length == 0 ? true : false;
  if (e.keyCode === 13) {
    e.preventDefault();
    processButton.click();
  }
});

processButton.addEventListener('click', () => {
  const key = keyInput.value;
  const cipher = vigenere.encryption('en', data, key);

  const textNode = document.createTextNode(cipher);
  uploadContainer.children[0].appendChild(textNode);
  uploadContainer.children[0].removeChild(textNode.previousSibling);
  uploadButton.disabled = false;
});

const notificate = (text) => {
  notification.classList.remove('disabled');
  notification.children[1].addEventListener('click', () => {
    window.location.replace('/');
  });
  const textNode = document.createTextNode(text);
  notification.children[0].appendChild(textNode);
  notification.children[0].removeChild(textNode.previousSibling);
};

uploadButton.addEventListener('click', () => {
  const text = uploadContainer.children[0].textContent;

  fetch('/uploadFile', {
    method: 'POST',
    headers: {'Content-Type': 'text/plain'},
    body: text,
  })
      .then((res) => {
        if (res.status == 200) {
          console.log(res);
          const id = res.statusText;
          notificate(`File uploaded succesfully!
The id of your file is: ${id}
It is recommended to write this down!`);
        } else {
          throw Error(`File is NOT uploaded:
    ${rew.statusText}`);
        }
      })
      .catch((err) => alert(err));
});
