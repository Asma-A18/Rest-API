const express = require('express')
const {MongoClient, ObjectID} = require ('mongodb')
const bodyparser = require('body-parser')
const assert = require('assert')
const app = express()


app.use(bodyparser.json())

const mongourl = 'mongodb://localhost:27017'
const database = 'Contactss'

MongoClient.connect(mongourl,{ useUnifiedTopology: true }, (err, client)=>{
    assert.equal(err, null, 'failed to connect')
    const db = client.db(database)


app.post('/addcontact', (req, res)=> {
let newcontact = req.body
db.collection('contactlists').insertOne(newcontact, (err, data)=>{
    if (err) res.send('cannot add a contact')
    else res.send('new contact added')
})
})



app.get('/contacts', (req, res)=> {
db.collection('contactlists').find().toArray( (err, data)=>{
        if (err) res.send('cannot find  contacts')
        else res.send(data)
    })
    })

app.get('/contacts/:id', (req, res)=> {
    let contactid = ObjectID(req.params.id)
    db.collection('contactlists').findOne({_id : contactid},(err, data)=>{
            if (err) res.send('cannot find the contact')
            else res.send(data)
        })
        })


app.put('/upcontacts/:id', (req, res)=> {
let contactid = ObjectID(req.params.id)
let modifiedcontact = req.body
db.collection('contactlists').findOneAndUpdate({_id : contactid},{$set : {...modifiedcontact}},(err, data)=>{
         if (err) res.send('cannot modify the contact')
        else res.send('cntc modified')
            })
            })

 app.delete('/deletecontact/:id', (req, res)=> {
    let contactid = ObjectID(req.params.id)
    db.collection('contactlists').findOneAndDelete({_id : contactid},(err, data)=>{
        if (err) res.send('cannot delete the contact')
        else res.send('cntc deleted')
                            })
                            })

})

app.listen(5000, (err)=>{
    if (err) console.log('err')
    else console.log('running')
})