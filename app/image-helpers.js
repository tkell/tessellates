let imageHelper = {}

imageHelper.loadImages = function(data) {
    promises = [];
    for (let record of data) {
      let promise = fabricImageLoad(record.imagePath).then(img => {
        record.image = img;
        record.bigImage = fabric.util.object.clone(record.image);
      });
      promises.push(promise);
    }
    return Promise.all(promises);
  }

let fabricImageLoad = async function(imagePath) {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(imagePath, function(img) {
      resolve(img);
    });
  });
}
