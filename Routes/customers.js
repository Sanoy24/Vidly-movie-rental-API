const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    isGold:{type:Boolean,required:true},
    name:{
        type:String,
        minLength:5,
        maxLength:50,
        required:true
    },
    phone:{type:Number,required:true}
})

const Customer = mongoose.model('Customer',customerSchema);

router.get('/',async (req,res)=>{
   const customers = await Customer
            .find()
            .sort('name')
        res.send(customers);
})

router.post('/',async(req,res)=>{
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name:req.body.name,
        isGold:req.body.isGold,
        phone:req.body.phone
    })
    customer = await customer.save();
    res.send(customer);
})

router.put('/:id',async (req,res)=>{
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = await Customer.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        phone:req.body.phone,
        isGlold:req.body.isGold
    },{
        new:true
    })
    if(!customer) return res.status(404).send('The genre with the given ID does not exist');
    res.send(customer);
})

router.delete('/:id',async (req,res)=>{
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if(!customer) return res.status(404).send('The genre with the given ID does not exist');
    res.send(customer)
})

router.get('/:id',async(req,res)=>{
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send("The customer with the given ID does not exist");
    res.send(customer);
})


function validateCustomer(customer){
    const schema = (
        Joi.object({
            name:Joi.string().min(3).required(),
            phone:Joi.number().required(),
            isGold:Joi.boolean()
        }) 
    )
      return schema.validate(customer);  
    };

module.exports = router;