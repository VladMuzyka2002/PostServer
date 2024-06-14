const express = require('express')
const router = express.Router()
const { Users } = require('../models')
const bcrypt = require("bcrypt")
const {sign} = require("jsonwebtoken");
const { validateToken } = require('../middlewares/AuthMiddleware');

//we pass the complete, validated form as req
router.post("/", async (req, res) => {
    const {username, password} = req.body; //get the contents of the form
    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username, 
            password: hash
        }); //post it into db
    res.json({username, password}); //confirmation that the data was sent
    });
})

//we pass the complete, validated form as req
router.post("/login", async (req, res) => {
    const {username, password} = req.body; //get the contents of the form

    const user = await Users.findOne({where: {username: username}});

    if (!user) res.json({error: "User Doesn't Exist"});
    else {
        bcrypt.compare(password, user.password).then((match) => {
            if (!match) res.json({error: "Wrong Password"}); 
            else {
                const accessToken = sign({username: user.username, id: user.id}, "importantsecret")
                res.json({
                    token: accessToken,
                    username: user.username,
                    id: user.id
                });
            }
        })
    }
})

router.get('/auth', validateToken, (req, res) => {
    res.json(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
    const id = req.params.id;
    const basicInfo = await Users.findByPk(id, {
        attributes: { exclude: ['password'] }
    })
    res.json(basicInfo);
})

router.put('/changepassword', validateToken, async (req, res) => {
    const {oldPassword, newPassword} = req.body
    const user = await Users.findOne({where: {username: req.user.username}});

    bcrypt.compare(oldPassword, user.password).then(async (match) => {
        if (!match) res.json({error: "Wrong Password"}); 

        bcrypt.hash(newPassword, 10).then((hash) => {
            Users.update(
                {password: hash},
                {where: {username: req.user.username}}
            ) 
        res.json("Password updated successfuly"); //confirmation that the data was sent
        })
    })

})

module.exports = router;