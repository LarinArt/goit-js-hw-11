import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '27450205-8765e518dc84e5655ddf2d669';

export const params = {
    q: "",
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    per_page: 40,
    page: 1,
    key: API_KEY,
};
export async function searchImg() {
    try {
        const res = await axios.get(URL, { params });
        return res;
    } catch (error) {
        console.log("object", error);
    }
};