//initialize unsplash

import { createApi } from "unsplash-js";

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  //...other fetch options
});

const getUrlForCoffeeStore = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 40,
  });
  const unsplashResults = photos.response.results;
  return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchCoffeeStores = async (
  latLong = "5.352716408754163%2C100.47233300802132",
  limit = 6
) => {
  const photos = await getListOfCoffeeStorePhotos();
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForCoffeeStore(latLong, "coffee shop", limit),
    options
  );

  const data = await response.json();
  console.log(data);

  return data.results.map((venue, idx) => {
    return {
      //   ...venue,
      id: venue.fsq_id,
      address: venue.location.address || "",
      name: venue.name,
      neighbourhood:
        venue.location.neighborhood || venue.location.crossStreet || "",
      imgUrl: photos[idx],
    };
  });
};
