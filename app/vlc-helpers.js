let vlcHelper = {}

vlcHelper.makePlayFunc = function(record) {
  return function() {
    // check state;
    const headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa("" + ":" + "wombat"));
    const vlcStateUrl = "http://127.0.0.1:8089/requests/status.xml";

    fetch(vlcStateUrl, {headers: headers})
      .then(response => response.text())
      .then(text => {
        const parser = new DOMParser();
        const xmlResponse = parser.parseFromString(text, "application/xml");
        const vlcState = xmlResponse.children[0].children[11].textContent
        return vlcState;
      }).then(vlcState => {
        const tracks = record.tracks;
        for (let i = 0; i < tracks.length; i++) {
          // const filepath = encodeURIComponent(tracks[i].filepath);
          // const url = vlcUrl + filepath;

          console.log(vlcState);
          let vlcCommand = "in_enqueue" 
          if (vlcState === "stopped") {
            vlcCommand = "in_play"
          }
          const vlcUrl = `http://127.0.0.1:8089/requests/status.xml?command=${vlcCommand}&input=/Users/thor/Desktop/Overmono%20-%20Blow%20Out.flac`;
          console.log(vlcUrl, headers);
          fetch(vlcUrl, {headers: headers})
            .then(response => response.text())

          break;
        }
      })

  }
}
