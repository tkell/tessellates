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

function parseTessellatesParams(params) {
    if (!params['items']) {
        params['items'] = 50;
    } else {
        params['items'] = parseInt(params['items'])
    }
    if (!params['offset']) {
        params['offset'] = 0;
    } else {
        params['offset'] = parseInt(params['offset'])
    }
    if (!params['t']) {
        params['t'] = 'triangle';
    }
    return params;
}
