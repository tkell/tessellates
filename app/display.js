function getSearchParameters() {
    let prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray(prmstr) {
    let params = {};
    let prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        let tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

let params = getSearchParameters();
if (!params['size']) {
    params['size'] = 50;
}
if (!params['start']) {
    params['start'] = 0;
}
if (!params['t']) {
    params['t'] = 'triangle';
}

// pick a tessellation, then ..
if (params['t'] == 'square') {
    tess = makeSquare();
} else {
    tess = makeTriangle();
}

fetch('vinyl.json')
  .then(response => response.json())
  .then(data => {
      start = parseInt(params['start']);
      end = start + parseInt(params['size']);
      data = data.slice(start, end);
      var canvas = new fabric.Canvas('vinylCanvas');
      canvas.hoverCursor = 'default';
      tess.render(canvas, tess.prepare(data))
  });
