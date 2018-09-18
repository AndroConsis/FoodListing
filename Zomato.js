const zomatoKey = ""; // place your zomato key here

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

export const getRestaurents = () => {
    return fetch("https://developers.zomato.com/api/v2.1/search?entity_id=3403&entity_type=subzone&count=50", {
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