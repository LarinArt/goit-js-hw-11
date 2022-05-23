import Notiflix from 'notiflix';
import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '27450205-8765e518dc84e5655ddf2d669';

const customAxios = axios.create({
    baseURL: URL,
    params: {
        key: API_KEY,
    }
});

export const fetchImgParams = {
    q: "",
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    per_page: 40,
    page: 1,
};

export const searchImg = async (params) => {
    try {
        const res = await customAxios.get('', { params });
        if (res.data.hits === 0){
            return;
        }
        return res;
    } catch (error) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
};
export default { fetchImgParams, searchImg };