const dateStringOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

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
    const playbacks = data['playbacks']
    const counts = data['counts']
    const releases = data['releases']

    const countsDiv = document.getElementById("all-counts");
    countsDiv.innerHTML = "";
    for (let i = 0; i < counts.length; i++) {
      const releaseId = counts[i][0];
      const numPlays = counts[i][1];
      const countDiv = document.createElement('div');
      const release = releases[releaseId]
      const txt = document.createTextNode(`${release.artist} - ${release.title}: ${numPlays}`);
      countDiv.appendChild(txt);
      countsDiv.appendChild(countDiv);
    }

    const statsDiv = document.getElementById("all-playbacks");
    statsDiv.innerHTML = "";
    for (let i = 0; i < playbacks.length; i++) {
      const playback = playbacks[i];
      const playbackDiv = document.createElement('div');
      const release = releases[playback.release_id]

      const date = new Date(playback.created_at)
      const dateString = date.toLocaleDateString("en-US", dateStringOptions)

      const txt = document.createTextNode(`${release.artist} - ${release.title} on ${dateString}`);
      playbackDiv.appendChild(txt);
      statsDiv.appendChild(playbackDiv);
    }
    
  } catch (error) {
    console.error('Playback load error:', error);
  }
}

getPlaybacks();
