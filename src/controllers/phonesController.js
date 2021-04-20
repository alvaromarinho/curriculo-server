const { insert, select, update, remove } = require('../models/genericModel');
const json = require("../config/config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require('path')
const fs = require('fs');

const TABLE = 'phones';

const createPhone = (req, res, next) => {

}

const findPhone = (req, res, next) => {

}

const findPhoneByUser = (req, res, next) => {

}

const updatePhone = (req, res, next) => {

}

const deletePhone = (req, res) => {

}

module.exports = { createPhone, findPhone, findPhoneByUser, updatePhone, deletePhone }
