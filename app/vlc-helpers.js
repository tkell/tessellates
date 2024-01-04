let vlcHelper = {}

vlcHelper._headers = new Headers();
vlcHelper._headers.set('Authorization', 'Basic ' + btoa("" + ":" + "wombat"));

vlcHelper.makePlayFunc = function(record) {
  return function() {
    vlcHelper._checkState()
      .then(vlcState => {
        const tracks = record.tracks;
        for (let i = 0; i < tracks.length; i++) {
          const fileSuffix = encodeURIComponent(tracks[i].filepath);
          const filePrefix = "/Volumes/Mimir/Music/Albums/"

          if (i == 0) {
            let vlcCommand = "in_enqueue" 
            if (vlcState === "stopped") {
              vlcCommand = "in_play"
            }
            const vlcUrl = `http://127.0.0.1:8089/requests/status.xml?command=${vlcCommand}&input=${filePrefix}${fileSuffix}`;
            fetch(vlcUrl, {headers: vlcHelper._headers})
              .then(response => response.text())
          } else {
            let vlcCommand = "in_enqueue" 
            const vlcUrl = `http://127.0.0.1:8089/requests/status.xml?command=${vlcCommand}&input=${filePrefix}${fileSuffix}`;
            fetch(vlcUrl, {headers: vlcHelper._headers})
              .then(response => response.text())
          }
        }
      })

  }
}

vlcHelper._checkState = function() {
    const vlcStateUrl = "http://127.0.0.1:8089/requests/status.xml";
    return fetch(vlcStateUrl, {headers: vlcHelper._headers})
      .then(response => response.text())
      .then(text => {
        const parser = new DOMParser();
        const xmlResponse = parser.parseFromString(text, "application/xml");
        const vlcState = xmlResponse.children[0].children[11].textContent
        return vlcState;
      })
}
