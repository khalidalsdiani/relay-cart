/**
 * Created by Soon on 2/25/16.
 */

const PRODUCTS = [
  {
    id: '1497408180', productCode: '1497408180',
    name: 'A Smarter Way to Learn JavaScript: The new approach that uses technology to cut your effort in half',
    price: 17.96,
    images: [{
      format: 'thumbnail',
      url: 'http://ecx.images-amazon.com/images/I/51JwcqaSYPL._AA320_QL65_.jpg',
    }],
  },
  {
    id: '0596805527', productCode: '0596805527',
    name: 'The Definitive Guide: Activate Your Web Pages (Definitive Guides)',
    price: 33.89,
    images: [{
      format: 'thumbnail',
      url: 'http://ecx.images-amazon.com/images/I/51WD-F3GobL._AA320_QL65_.jpg',
    }],
  },
  {
    id: '1118531647', productCode: '1118531647',
    name: 'JavaScript and JQuery: Interactive Front-End Web Development',
    price: 28.85,
    images: [{
      format: 'thumbnail',
      url: 'http://ecx.images-amazon.com/images/I/41PhOmFQTTL._AA320_FMwebp_QL65_.jpg',
    }],
  },
  {
    id: '0596517742', productCode: '0596517742',
    name: 'JavaScript: The Good Parts',
    price: 20.46,
    images: [{
      format: 'thumbnail',
      url: 'http://ecx.images-amazon.com/images/I/518QVtPWA7L._AA320_FMwebp_QL65_.jpg',
    }],
  },
  {
    id: '1593275404', productCode: '1593275404',
    name: 'The Principles of Object-Oriented JavaScript',
    price: 15.87,
    images: [{
      format: 'thumbnail',
      url: 'http://ecx.images-amazon.com/images/I/51+Uy4JxjVL._AA320_FMwebp_QL65_.jpg',
    }],
  },
  {
    id: '1593275846', productCode: '1593275846',
    name: 'Eloquent JavaScript: A Modern Introduction to Programming',
    price: 27.92,
    images: [{
      format: 'thumbnail',
      url: 'http://ecx.images-amazon.com/images/I/51pLAgSXOzL._AA320_FMwebp_QL65_.jpg',
    }],
  },
  {
    id: '1118026691', productCode: '1118026691',
    name: 'Professional JavaScript for Web Developers',
    price: 26.45,
    images: [{
      format: 'thumbnail',
      url: 'http://ecx.images-amazon.com/images/I/51bRhyVTVGL._AA320_FMwebp_QL65_.jpg',
    }],
  },
  {
    id: '1493692615', productCode: '1493692615',
    name: 'A Software Engineer Learns HTML5, JavaScript and jQuery',
    price: 13.49,
    images: [{
      format: 'thumbnail',
      url: 'http://ecx.images-amazon.com/images/I/41XtnwhGs6L._AA320_FMwebp_QL65_.jpg',
    }],
  },
  {
    id: '1495233006', productCode: '1495233006',
    name: 'Learn JavaScript VISUALLY',
    price: 13.46,
    images: [{
      format: 'thumbnail',
      url: 'http://ecx.images-amazon.com/images/I/51F1TUdNOKL._AA320_FMwebp_QL65_.jpg',
    }],
  },
  {
    id: '0596806752', productCode: '0596806752',
    name: 'JavaScript Patterns',
    price: 18.09,
    images: [{
      format: 'thumbnail',
      url: 'http://ecx.images-amazon.com/images/I/51ACzMjH6rL._AA320_FMwebp_QL65_.jpg',
    }],
  },
  {
    id: '1491924462', productCode: '1491924462',
    name: "You Don't Know JS: Up & Going",
    price: 4.99,
    images: [{
      format: 'thumbnail',
      url: 'http://ecx.images-amazon.com/images/I/41FhogvNebL._AA320_FMwebp_QL65_.jpg',
    }],
  },
  {
    id: '0321812182', productCode: '0321812182',
    name: 'Effective JavaScript: 68 Specific Ways to Harness the Power of JavaScript (Effective Software Development Series)',
    price: 29.48,
    images: [{
      format: 'thumbnail',
      url: 'http://ecx.images-amazon.com/images/I/51t8vT-IvqL._AA320_FMwebp_QL65_.jpg',
    }],
  },
  {
    id: '144934013X', productCode: '144934013X',
    name: 'Head First JavaScript Programming',
    price: 38.89,
    images: [{
      format: 'thumbnail',
      url: 'http://ecx.images-amazon.com/images/I/51qpyuO-ANL._AA320_FMwebp_QL65_.jpg',
    }],
  },
  {
    id: '1519638779', productCode: '1519638779',
    name: "JavaScript: Crash Course - The Ultimate Beginner's Course to Learning JavaScript Programming in Under 12 Hours",
    price: 9.99,
    images: [{
      format: 'thumbnail',
      url: 'http://ecx.images-amazon.com/images/I/51d6QOwdxXL._AA320_FMwebp_QL65_.jpg',
    }],
  },
  {
    id: '067233738X', productCode: '067233738X',
    name: 'JavaScript in 24 Hours, Sams Teach Yourself (6th Edition)',
    price: 27.95,
    images: [{
      format: 'thumbnail',
      url: 'http://ecx.images-amazon.com/images/I/512+yH2PsbL._AA320_FMwebp_QL65_.jpg',
    }],
  },
  {
    id: '152373082X', productCode: '152373082X',
    name: "JavaScript: The Ultimate Beginner's Guide!",
    price: 9.99,
    images: [{
      format: 'thumbnail',
      url: 'http://ecx.images-amazon.com/images/I/41pLEp5yd7L._AA320_FMwebp_QL65_.jpg',
    }],
  },
];

export default class Product {
  static getAll = ()=> PRODUCTS.map(p=>new Product(p));

  static findOne = ({ productCode })=> PRODUCTS.find(p=> p.productCode === productCode);
  static findById = (id)=> PRODUCTS.find(p=> p.id === id);

  constructor({ id, name, price, images }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.images = images;
  }
}
