// Openly licensed photos from Wikimedia Commons, stored in /public/photos.
// Each one is credited on the page where it appears.

export type Photo = { src: string; alt: string; author: string; license: string; source: string };

export const heroPhoto: Photo = {
  src: "/photos/hero.jpg",
  alt: "Green Himalayan valley with snow peaks, Valley of Flowers National Park",
  author: "Rohit Sharma",
  license: "CC BY-SA 4.0",
  source: "https://commons.wikimedia.org/wiki/File:Valley_of_flowers_national_park,_Uttarakhand,_India.jpg",
};

export const trekPhotos: Record<string, Photo> = {
  "valley-of-flowers": {
    src: "/photos/valley-of-flowers.jpg",
    alt: "Pink and white wildflowers in a green valley between steep mountains",
    author: "Rohit Sharma",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Valley_of_flowers_national_park,_Uttarakhand,_India_03_(edit).jpg",
  },
  kedarnath: {
    src: "/photos/kedarnath.jpg",
    alt: "Kedarnath Temple with snow-capped peaks behind it",
    author: "Shivam Kumar 766",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Kedarnath_Temple_in_Rainy_season.jpg",
  },
  "tungnath-chandrashila": {
    src: "/photos/tungnath-chandrashila.jpg",
    alt: "Small stone shrine on Chandrashila peak above layers of blue hills",
    author: "Aditya Siva",
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Chandrashila,_Tungnath,_India_(Unsplash).jpg",
  },
  "deoria-tal": {
    src: "/photos/deoria-tal.jpg",
    alt: "Deoria Tal lake reflecting trees and the Chaukhamba peaks",
    author: "Ayush Pant",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:DeoriaTal.jpg",
  },
  "double-decker": {
    src: "/photos/double-decker.jpg",
    alt: "Two-level living root bridge over a clear stream in Nongriat",
    author: "Arshiya Urveeja Bose",
    license: "CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Living_root_bridges,_Nongriat_village,_Meghalaya2.jpg",
  },
  visapur: {
    src: "/photos/visapur.jpg",
    alt: "Stone bastion of Visapur Fort on a green monsoon hilltop",
    author: "Loharjay",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Visapurfort.jpg",
  },
  "har-ki-dun": {
    src: "/photos/har-ki-dun.jpg",
    alt: "Har Ki Dun valley with a river, pine trees and a snowy peak",
    author: "Omkar",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Entering_Har_Ki_Dun.JPG",
  },
};
