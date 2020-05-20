const fs = require('fs');
const request = require('request');
const rp = require('request-promise');
const $ = require('cheerio');

const url = 'https://ww7.readonepiece.com/chapter/one-piece-chapter-813/';
const first = 814;
const last = 815; //980

const createChapterFolder = (url) => {
    let folder = url.split('-')[url.split('-').length -1];
    folder = folder.substring(0, folder.length - 1)

    if (!fs.existsSync(`./chapters/${folder}`)){
        fs.mkdirSync(`./chapters/${folder}`);
    }
};

const getImgSrc = (html) => {
    const imgs = $('.text-center > img', html);
    return Object.values(imgs)
        .filter(img => img.attribs && img.attribs.src)
        .map( img => img.attribs.src )
    ;
};

const download = (url, path, callback) => {
    request.head(url, (err, res, body) => {
        //console.log(url)

        request(url)
        .pipe(fs.createWriteStream(path))
        .on('close', callback)
    })
  }


const loadHtml = async (chapter) => {
    const url = `https://ww7.readonepiece.com/chapter/one-piece-chapter-${chapter}/`;
    try {
        createChapterFolder(url);
        const html = await rp(url);
        const srcs = getImgSrc(html);
        srcs.map( src => {
            const name = src.split('/')[url.split('/').length -1];
            if(name){
                download(src, `./chapters/${chapter}/${name}`, () => {});
            }
        });

    } catch (error) {
        console.log('error', error);
    }

    console.log(chapter);
};


for (let chapter = first; chapter < last; chapter++) {
    loadHtml(chapter);
}

