let vlcHelper = {}

vlcHelper.makePlayFunc = function(record) {
  return function() {
    if (uiState.bigImage.isShowing) {
      const tracks = record.tracks;
      for (let i = 0; i < tracks.length; i++) {
        // const filepath = encodeURIComponent(tracks[i].filepath);
        // const url = vlcUrl + filepath;
        const vlcUrl = "http://127.0.0.1:8089/requests/status.xml?command=in_play&input=/Users/thor/Desktop/Overmono%20-%20Blow%20Out.flac";
        const headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa("" + ":" + "wombat"));
        console.log(vlcUrl, headers);
        fetch(vlcUrl, {headers: headers}).then(response => response.text()).then(text => console.log(text));
        break;
      }
    }
  }
}
