// === именованный экспорт функции которая делает запрос на бекенд и возвращает промис
// import axios from 'axios';
const axios = require('axios');
const API_KEY = '25154920-bc2b97b916e9c15e1ff6fb5dd';
const BASE_URL = 'https://pixabay.com/api';

export default class ImageApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }
  async fetchPhotos() {
    // console.log(this);
    const params = new URLSearchParams({
      q: this.searchQuery,
      key: '25154920-bc2b97b916e9c15e1ff6fb5dd',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.per_page,
      page: this.page,
    });
    const url = `${BASE_URL}/?${params}`;
    // console.log(url);
    this.icrementPage();
    // console.log(axios.get(url, { params }));
    return await axios.get(url);
  }
  icrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.query - newQuery;
  }
}