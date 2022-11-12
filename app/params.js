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

function parseTessellatesParams(params, tess) {
    if (!params['items']) {
        params['items'] = tess.defaultItems;
    } else {
        params['items'] = parseInt(params['items'])
    }
    if (!params['offset']) {
        params['offset'] = null;
    } else {
        params['offset'] = parseInt(params['offset'])
    }
    return params;
}
