const dateStringOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

async function getPlaybacks() {
  try {
    params = getSearchParameters();
    // get params ...
    const startDate = params['start_date'] || undefined;
    const endDate = params['end_date'] || undefined;
    const g = params['g'] || undefined
    let url= `${apiState.protocol}://${apiState.host}/playbacks`;
    if (startDate) {
      url = url + `?start_date=${startDate}`
    }
    if (endDate) {
      url = url + `&end_date=${endDate}`
    }
    if (g) {
      url = url + `&g=${g}`
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
    const groups = data['groups']
    const releases = data['releases']

    const groupsDiv = document.getElementById("grouped-counts");
    groupsDiv.innerHTML = "";
    Object.keys(groups).forEach(groupDate => {
      const group = groups[groupDate];
      if (group.length !== 0) {
        const dateDiv = document.createElement('div');
        var dateString = groupDate
        // not good here
        if (g === 'month') {
          dateString = groupDate.slice(0, -3)
        } else if (g === 'year') {
          dateString = groupDate.slice(0, -6)
        }
        const dateTxt = document.createTextNode(`${dateString} -->`);
        dateDiv.appendChild(dateTxt);
        groupsDiv.appendChild(dateDiv);
      }
      for (let i = 0; i < group.length; i++) {
        const releaseId = group[i][0];
        const numPlays = group[i][1];
        const groupDiv = document.createElement('div');
        const release = releases[releaseId];
        const txt = document.createTextNode(`${release.artist} - ${release.title}: ${numPlays}`);
        groupDiv.appendChild(txt);
        groupsDiv.appendChild(groupDiv);
      }
    });

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
