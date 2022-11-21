let imageHelper = {}

imageHelper.loadImages = function(data) {
    let promises = [];
    for (let record of data) {
      let promise = fabricImageLoad(record.smallImagePath).then(img => {
        record.image = img;
      });
      promises.push(promise);
    }
    return Promise.all(promises);
  }

let fabricImageLoad = async function(imagePath) {
  return new Promise((resolve, reject) => {
    return fabric.Image.fromURL(imagePath, function(img) {
      resolve(img);
    });
  });
}
