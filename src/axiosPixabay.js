// === именованный экспорт функции которая делает запрос на бекенд и возвращает промис
// import axios from 'axios';
const axios = require('axios');
const API_KEY = '27687419-9b7122bc0ad1f15a1028fb6b8';
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
      key: '27687419-9b7122bc0ad1f15a1028fb6b8',
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