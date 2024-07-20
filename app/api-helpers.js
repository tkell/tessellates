const apiHelper = {};

apiHelper.logPlayback = function(record) {
  const url= `${apiState.protocol}://${apiState.host}/playbacks`;
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({"release_id": record.id}),
    credentials: 'include'
  }).then(response => {
    console.log('playback logged:', response);
  }).catch(error => {
    console.error('error logging new playback:', error);
  });
};
