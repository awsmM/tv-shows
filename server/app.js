const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const port = 3000;

const find = async function (url) {
  const seek = fetch(url)
  const response = await seek.then(value => value.json())
    .catch(err => err)
  return response;
}

const processSeasons = async function (arr, url) {

  const resultArr = []

  for (i = 0; i < arr.length; i++) {
    const seek = find(`http://api.tvmaze.com/seasons/${arr[i].id}/episodes`)
    const episodes = await seek.then(value => value);

    resultArr.push({
      season: arr[i],
      episodes
    })

  }

  console.log(resultArr)
  return resultArr
}

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../src/index.html'))
});

app.get('/tvshows/:showName', async (req, res) => {

  const tvShows = find(`http://api.tvmaze.com/search/shows?q=${req.params.showName}`)
  const result = await tvShows.then(value => value);

  res.json(result);
});


app.get('/seasons/:id', async (req, res) => {

  const seasons = find(`http://api.tvmaze.com/shows/${req.params.id}/seasons`)
  const seasonsArr = await seasons.then((value) => value)

  const data = processSeasons(seasonsArr);
  const result = await data.then(value => value);

  res.send(result);

});




app.listen(port, () => {
  console.log(`I'm listening on port ${port}`);
})