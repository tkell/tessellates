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
    console.log(data);
  } catch (error) {
    console.error('Playback load error:', error);
  }
}

getPlaybacks();
