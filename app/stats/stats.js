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

    const groupsList = document.getElementById("grouped-counts-list");
    groupsList.innerHTML = "";
    Object.keys(groups).forEach(groupDate => {
      const group = groups[groupDate];
      if (group.length !== 0) {
        const dateLi = document.createElement('li');
        dateLi.classList.add("stats-group-date")
        var dateString = groupDate
        // not good here
        if (g === 'month') {
          dateString = groupDate.slice(0, -3)
        } else if (g === 'year') {
          dateString = groupDate.slice(0, -6)
        }
        const dateSpan = document.createElement('span')
        dateSpan.innerText = `${dateString} -->`;
        dateLi.appendChild(dateSpan);
        groupsList.appendChild(dateLi);
      }
      const countList = document.createElement('ul');
      groupsList.appendChild(countList);
      addListViaElement(countList, countsToStrings(group, releases));

    });

    addList("all-counts-list", countsToStrings(counts, releases));
    addList("playbacks-list", playbacksToStrings(playbacks, releases));

  } catch (error) {
    console.error('Playback load error:', error);
  }
}
getPlaybacks();


function countsToStrings(counts, releases) {
  countsStrings = []
  for (let i = 0; i < counts.length; i++) {
    const releaseId = counts[i][0];
    const numPlays = counts[i][1];
    const release = releases[releaseId]
    const txt = `${release.artist} - ${release.title}: ${numPlays}`;
    countsStrings.push(txt);
  }
  return countsStrings
}

function playbacksToStrings(playbacks, releases) {
  const playbackStrings = []
  for (let i = 0; i < playbacks.length; i++) {
    const playback = playbacks[i];
    const release = releases[playback.release_id]
    const date = new Date(playback.created_at)
    const dateString = date.toLocaleDateString("en-US", dateStringOptions)
    const txt = `${release.artist} - ${release.title} on ${dateString}`;
    playbackStrings.push(txt);
  }
  return playbackStrings;
}

function addList(listElementId, listTextStrings) { 
  const list = document.getElementById(listElementId);
  list.innerHTML = "";
  addListViaElement(list, listTextStrings);
}

function addListViaElement(listElement, listTextStrings) {
  for (let i = 0; i < listTextStrings.length; i++) {
    const li = document.createElement('li');
    const txt = document.createTextNode(listTextStrings[i]);
    li.appendChild(txt);
    listElement.appendChild(li);
  }
}
