export const getCategories = () => {
    return fetch("https://developers.zomato.com/api/v2.1/collections?city_id=5&count=20", {
        method: 'GET',
        headers: {
            "Accept": 'application/json',
            "user-key": "ecc70b402a55da328d5f42e52c15046f"
        }
    }).then(response => response.json())
        .catch((error) => {
            console.log(error);
        });
}