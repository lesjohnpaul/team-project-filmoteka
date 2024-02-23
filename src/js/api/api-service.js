import axios from 'axios';
const BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = 'd44d649bf29b13f15f7c09e3a7c504dd';

async function getBySearchQuery(query, page) {
  const response = await axios.get(
    `${BASE_URL}search/movie?api_key=${API_KEY}&query=${query}&page=${page}`,
  );
  return response;
}
async function getPopularFilms(page) {
  const response = axios.get(`${BASE_URL}trending/movie/week?api_key=${API_KEY}&page=${page}`);
  return response;
}
async function getGenres() {
  const response = await axios.get(`${BASE_URL}genre/movie/list?api_key=${API_KEY}`);
  return response.data;
}
async function getFilmById(id) {
  const response = await axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  return response;
}

async function getFilmsByIdArray(arrayOfIds) {
  const promises = arrayOfIds.map(async id => {
    const response = await axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
    return response.data;
  });
  const data = await Promise.all(promises);
  return data;
}
async function getFilmByGenreId(id, page) {
  const response = await axios.get(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${id}&page=${page}`,
  );
  return response;
}

async function onfetchTrailers(id) {
  try {
    const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`;
    const response = await fetch(url);
    const data = response.json();
    return data;
  } catch (error) {
    console.error('Get state error: ', error.message);
  }
}

export {
  getBySearchQuery,
  getPopularFilms,
  getFilmById,
  getGenres,
  getFilmsByIdArray,
  getFilmByGenreId,
  onfetchTrailers,
};
