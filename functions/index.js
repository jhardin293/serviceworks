const functions = require('firebase-functions');
const rp = require('request-promise');
const cheerio = require('cheerio');

exports.getAmazonList = functions.https.onRequest((req, res) => {
    res.header('Content-Type','application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    let reqObj = JSON.parse(req.body);
    let id = reqObj.id;
    let base = 'https://www.amazon.com/gp/registry/wishlist/';
    let url = base + id;
    let wishlist = [];
    rp(url)
        .then((html) => {
            let $ = cheerio.load(html);
            $('.g-item-sortable').each((i,el) => {
                let title = $(el).find('h5').text();
                let cost = $(el).attr('data-price');
                let img = $(el).find('img').attr('src');
                let item = {
                    title,
                    cost,
                    img
                }
                wishlist.push(item);
            })
            res.send(wishlist);
            // console.log(wishlist,'wishlist');
        }).catch(console.error.bind(console));
});