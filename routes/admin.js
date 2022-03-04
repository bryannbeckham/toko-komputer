//import library
const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');

//implementasi
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model 
const model = require('../models/index');
const res = require('express/lib/response');
const admin = model.admin

//import auth
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BelajarNodeJSItuMenyenangkan"

//endpoint untuk menampilkan semua data admin, METHOD: GET, function FINDALL()
app.get("/",auth, (req,res) =>{
    admin.findAll()
        .then(admin => {
            res.json(admin)
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//endpoint untuk menyimpan data admin, METHOD:POST, function, create
app.post("/", (req,res) => {
    let data = {
        name : req.body.name,
        username : req.body.username,
        password : md5(req.body.password)
    }
    admin.create(data)
        .then(result => {
            res.json({
                message : "data has been inserted"
            })
        })
        .catch(error => {
            message : error.message
        })
})
//endpoint untuk mengupdate data admin, METHOD: PUT, fuction: UPDATE
app.put("/:id",auth, (req,res) => {
    let param = {
        admin_id : req.params.id
    }
    let data = {
        name : req.body.name,
        username : req.body.username,
        password : md5(req.body.password)
    }
    admin.update(data, {where: param})
    .then(result => {
        res.json({
            message : "data has been updated"
        })
    })
    .catch(error => {
        res.json({
            message  : error.message
        })
    })
})
//endpoint untuk menghapus data admin,METHOD: DELETE, function: destroy
app.delete("/:id",auth, (req,res) => {
    let param = {
        admin_id : req.params.id
    }
    admin.destroy({where: param})
    .then(result => {
        res.json({
            massege : "data has been deleted"
        })
    })
    .catch(error => {
        res.json({
            message: "error.message"
        })
    })
})

//endpoint login admin METHOD: POST fuction: findone
app.post("/auth", async (req,res) => {
    let data = {
        username: req.body.username,
        password: md5(req.body.password)
    }
    let result = await admin.findOne({where:data})
    if(result){
        //let played from data
        let payled = JSON.stringify(result)
        //generate token based on played and secret_key
        let token = jwt.sign(payled, SECRET_KEY)

        res.json({
            longged: true,
            data: result,
            token: token
        })
    } else {
        res.json({
            logged: false,
            mesaage: "invalid username or password"
        })
    }
})
module.exports = app