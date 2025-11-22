async function getPlaybacks() {
  try {
    params = getSearchParameters();
    // get params ...
    const startDate = params['start_date'] || "1970-1-1";
    const endDate = params['end_date'] || undefined;
    let url= `${apiState.protocol}://${apiState.host}/playbacks`;
    url = url + `?start_date=${startDate}`
    if (endDate) {
      url = url + `&end_date=${endDate}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' // need this for cookies
    });

    const data = await response.json();

    const statsDiv = document.getElementById("stats");
    for (let i = 0; i < data.length; i++) {
      const playback = data[i];
      console.log(playback);
      const playbackDiv = document.createElement('div');
      const txt = document.createTextNode(`${playback.release.artist} - ${playback.release.title} @ ${playback.created_at}`);
      playbackDiv.appendChild(txt);
      statsDiv.appendChild(playbackDiv);
    }
    
  } catch (error) {
    console.error('Playback load error:', error);
  }
}

getPlaybacks();
