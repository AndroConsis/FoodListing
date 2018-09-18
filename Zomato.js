const zomatoKey = ""; //place your key here
const BASE_URL = "https://developers.zomato.com/api/v2.1";

export const getCategories = () => {
    return fetch("https://developers.zomato.com/api/v2.1/collections?city_id=5&count=20", {
        method: 'GET',
        headers: {
            "Accept": 'application/json',
            "user-key": zomatoKey
        }
    }).then(response => response.json())
        .catch((error) => {
            console.log(error);
        });
}

export const getRestaurents = (lat, long) => {
    const url = `${BASE_URL}/search?lat=${lat}&lon=${long}&sort=real_distance&order=desc`
    return fetch(url, {
        method: 'GET',
        headers: {
            "Accept": 'application/json',
            "user-key": zomatoKey
        }
    }).then(response => response.json())
        .catch((error) => {
            console.log(error);
        });
}

export const getReviews = resId => {
    return fetch("https://developers.zomato.com/api/v2.1/reviews?res_id=" + resId, {
        method: 'GET',
        headers: {
            "Accept": 'application/json',
            "user-key": zomatoKey
        }
    }).then(response => response.json())
        .catch((error) => {
            console.log(error);
        });
}