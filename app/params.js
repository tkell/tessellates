function getSearchParameters() {
  const prmstr = window.location.search.substr(1);
  return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray(prmstr) {
  const params = {};
  const paramArray = prmstr.split("&");
  for ( var i = 0; i < paramArray.length; i++) {
    const temp = paramArray[i].split("=");
    params[temp[0]] = temp[1];
  }
  return params;
}

function parseTessellatesParams(params, tess) {
  if (!params['offset']) {
    params['offset'] = 0;
    params['minOffset'] = 0;
    params['maxOffset'] = (tess.defaultItems * 2);
  } else {
    params['offset'] = parseInt(params['offset'])
    params['minOffset'] = Math.max(0, params['offset'] - tess.defaultItems);
    params['maxOffset'] = params['offset'] + (tess.defaultItems * 2);
  }
  if (!params['filter']) {
    params['filter'] = "";
  }
  return params;
}
