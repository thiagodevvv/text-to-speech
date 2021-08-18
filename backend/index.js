require('dotenv').config()

const express = require('express')
const app = express()
const knex = require('./src/config/db')
const cors = require('cors')
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1')
const fs = require('fs')
const { IamAuthenticator } = require('ibm-watson/auth')
const ULID = require('ulid')

app.use(cors())
app.use(express.json())

const HOST = '0.0.0.0'

app.post('/addcomment', async (req,res) => {
    const comment = req.body.comment
    if(comment) {
        try { 
            await knex('comments').insert({comment: `${comment}`, id_voice: `${ULID.ulid()}`})
            res.status(200).send({ok: "ok"})
        }catch (err) {
            console.log(err)
        }
    }else {
        res.status(400).send()
    }
})


app.get('/comments', async (req,res) => {
    try {
       const comments = await knex('comments').select()
       res.send(comments)
    }catch (err) {
        console.log(err)
    }
})

app.post('/voice', async (req,res) => {
    const text = req.body.text
    const id_voice = req.body.id_voice
    const textToSpeech = new TextToSpeechV1({
        authenticator: new IamAuthenticator({
          apikey: process.env.TEXT_TO_SPEECH_APIKEY,
        }),
        serviceUrl: process.env.TEXT_TO_SPEECH_URL,
        disableSslVerification: true,
      })

    const synthesizeParams = {
        text: `${text}`,
        accept: 'audio/mp3',
        voice: 'pt-BR_IsabelaV3Voice',
    }
      
    textToSpeech
    .synthesize(synthesizeParams)
    .then(response => {
        const audio = response.result
        audio.pipe(fs.createWriteStream(`../web/public/voice-text${id_voice}.mp3`))
        audio.on('end', () => {
            return res.status(200).json({id_voice: id_voice})
        })
    })
    .catch(err => {
        console.log('error:', err)
    }) 
})

app.listen(3333,HOST)