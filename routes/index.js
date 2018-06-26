const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const Formation = require('../models/formation');
const router = express.Router();

const fetch = require('node-fetch');
const getCoords = require('city-to-coords')
var moment = require('moment')
//API Key= 5edd98ce34fbd27acab549e7451bbafcf13f243565ebf20828fdf4625b7e2962

/*https://apifootball.com/api/?action=get_countries&APIkey=xxxxxxxxxxxxxx*/


router.get('/dog/:name/:type', (req, res) => {
    res.render('dog', {dog:req.params.name, species:req.params.type, color:req.query.color} )

});

router.get('/weather',  (req, res) => {
   // console.log('weather');
   // console.log('city');
   // console.log(req.params, req.query, req.body)
    getCoords(req.query.city)
        .then((coords) => {
            console.log(coords);
            let lat = coords.lat
            let lng = coords.lng
            fetch(`https://api.darksky.net/forecast/3ec3bf283e0385c2860d5cea98480b6f/${coords.lat},${coords.lng}`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(myJson) {
                    console.log(myJson);
                    myJson.daily.data.forEach( (day) => {
                        day.time = moment(day.time*1000).format('dddd');

                    })
                    myJson.minutely.data.forEach( (minute) => {
                        minute.time = moment(minute.time*1000).format('h:mm a');
                    })

                    res.render('weather', {current:myJson.currently, minute:myJson.minutely, data:myJson.daily.data, city:req.query.city} )
                });
    });
    
})

router.get('/', (req, res) => {
   // res.render('index', { user : req.user });
   res.redirect('weather?city=Atlanta');


});

router.get('/register', (req, res) => {
  //  res.render('register', { });
  res.redirect('weather?city=Atlanta');


});

router.post('/register', (req, res, next) => {
    Account.register(new Account({ username : req.body.username }), req.body.password, (err, account) => {
        if (err) {
          return res.render('register', { error : err.message });
        }

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});






router.get('/profile', (req, res) => { 
    
   
        res.render('profile', {user: req.user});      
   
});





router.get('/login', (req, res) => {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/weather?city=Atlanta');
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/ping', (req, res) => {
    res.status(200).send("pong!");
});

module.exports = router;




/*  console.log('req.params',req.params, 'req.query', req.query);
   // let lat = req.params.lat;
   // let lng = req.params.lng;
    getCoords(req.query.city).then((coords) => {
        console.log('get coords ',coords);
        let lat = coords.lat
        let lng = coords.lng
    fetch(`https://api.darksky.net/forecast/3ec3bf283e0385c2860d5cea98480b6f/${lat},${lng}`)
    .then(res => {
      //  console.log(res);
     return   res.json()})
    .then(json => {
     //   console.log(json)
        res.render('weather', {data:json.daily.data, now:json.currently, temp:json.currently.temperature})
    })
    });*/