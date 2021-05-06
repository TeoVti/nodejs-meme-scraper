const fetch = require('node-fetch');
const fs = require('node:fs');

fetch('https://memegen-link-examples-upleveled.netlify.app/')
  .then((res) => res.text())
  .then((text) => {
    const dataHtml = text;

    const picSource = dataHtml.match(/<img [^>]*src="[^"]*"[^>]*>/gm);

    const links = [];

    for (let i = 0; i < 10; i++) {
      links.push(picSource[i]);
    }

    function getURLsFromString() {
      const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-]*)?\??(?:[-+=&;%@.\w]*)#?\w*)?)/gm;
      let m;
      const arr = [];
      const str = links;
      while ((m = re.exec(str)) !== null) {
        if (m.index === re.lastIndex) {
          re.lastIndex++;
        }
        arr.push(m[0]);
      }
      return arr;
    }

    const urls = getURLsFromString(links);

    async function download(url, index) {
      const response = await fetch(url);
      const buffer = await response.buffer();
      fs.writeFile(`./memes/image ${index + 1}.jpg`, buffer, () =>
        console.log(`finished downloading!`),
      );
    }
    urls.forEach(download);
  });
