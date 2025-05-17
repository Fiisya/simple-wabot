const fetch = require('node-fetch')
const FormData = require('form-data')
const { fromBuffer } = require('file-type')

/**
* Upload image to url
* Supported mimetype:
* - `image/jpeg`
* - `image/jpg`
* - `image/png`
* - `video/mp4`
* - `all files`
* @param {Buffer} buffer Image Buffer
*/

module.exports = async (buffer) => {
    let { ext } = await fromBuffer(buffer);
    let bodyForm = new FormData();
    bodyForm.append("file", buffer, "file." + ext);
    let res = await fetch("https://i.supa.codes/api/upload", {
        method: "post",
        body: bodyForm,
    });
    let data = await res.json();
    let resultUrl = data
    return resultUrl.link
}
