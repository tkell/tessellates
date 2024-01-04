let vlcHelper = {}

vlcHelper._headers = new Headers();
vlcHelper._headers.set('Authorization', 'Basic ' + btoa("" + ":" + "wombat"));
vlcHelper._filePrefix = "/Volumes/Mimir/Music/Albums/";
vlcHelper._apiUrl = "http://127.0.0.1:8089/requests/status.xml";

vlcHelper.makePlayFunc = function(record) {
  if (uiState.localPlayback === true) {
    return function() {
      vlcHelper._checkState()
        .then(vlcState => vlcHelper._addTracks(record.tracks, vlcState));
    }
  }
}

vlcHelper._addTracks = function(tracks, vlcState) {
  for (let i = 0; i < tracks.length; i++) {
    let vlcCommand = "in_enqueue"
    const fileSuffix = encodeURIComponent(tracks[i].filepath);
    if (i === 0 && vlcState === "stopped") {
        vlcCommand = "in_play"
      }
    vlcHelper._addTrack(vlcCommand, vlcHelper._filePrefix, fileSuffix);
  }
}

vlcHelper._addTrack = function(command, prefix, suffix) {
  const vlcUrl = `${vlcHelper._apiUrl}?command=${command}&input=${prefix}${suffix}`;
  return fetch(vlcUrl, {headers: vlcHelper._headers})
    .then(response => response.text());
}

vlcHelper._checkState = function() {
    const vlcStateUrl = `${vlcHelper._apiUrl}`;
    return fetch(vlcStateUrl, {headers: vlcHelper._headers})
      .then(response => response.text())
      .then(text => {
        const parser = new DOMParser();
        const xmlResponse = parser.parseFromString(text, "application/xml");
        const vlcState = xmlResponse.children[0].children[11].textContent
        return vlcState;
      })
}
