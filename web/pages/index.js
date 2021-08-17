import { useEffect, useState } from 'react'
import Head from 'next/head'
import {Container, Form, Button} from 'react-bootstrap'

export default function Home() {
  const [comments,setComments] = useState([])
  const [comment, setComment] = useState("")
  const [idVoice, setIdVoice] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [index, setIndex] = useState("")
  const [updateComments, setUpdateComments] = useState(false)

  const sendComment = () => {
    setUpdateComments(true)
    fetch('http://localhost:3333/addcomment', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({comment: comment})
    })
    .then(response => response.json())
    .then(data => {
      setComment("")
      getComments()
    })
  }

  const getComments = () => {
    fetch('http://localhost:3333/comments', {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    },
    })
    .then(response => response.json())
    .then(data => setComments(data))
  }

  const playAudio = (id_voice) => {
    const audio = new Audio(`voice-text${id_voice}.mp3`)
    audio.play()
    audio.onended = () => setIsPlaying(false)
  }

  const convertVoice = (text, id_voice) => {
    if(idVoice.indexOf(id_voice) === - 1) {
      setIdVoice((prevState) => [...prevState, id_voice])
      fetch('http://localhost:3333/voice', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({text: text, id_voice: id_voice})
      })
      .then(response => response.json())
      .then(data => {
      setIsPlaying(true)
      playAudio(id_voice)
      })
    }else {
      playAudio(id_voice)
    }
  }
  useEffect(() => {
    getComments()
  },[])

  return (
    <Container className="container">
      <Head>
        <title>Adicionar Comentário</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Container className="container-add-comment">
            <Form.Label style={{fontFamily: 'Segoe UI', fontWeight: 'bold', 
                color: '#696969', fontSize:15,}}>Comentário</Form.Label>
            <Form.Control value={comment} className="input-comment" as="textarea" onChange={(event) => setComment((event.target.value))} />
            <Button type="submit" style={{marginTop: 10, width: "100%"}} variant="success" onClick={() => sendComment()}>Cadastrar</Button>
        </Container>

        <Container className="container-comment">
          <p style={{fontFamily: 'Segoe UI', fontWeight: 'bold', color: '#696969', fontSize: 15}}>Comentários</p>
          {comments.length > 0 ? comments.map((element,i) => {
            return (
              <div className="comment" key={i}>
                <p align="justify" style={{fontFamily: 'Segoe UI', color: '#696969', fontSize: 15, flex: 4}}>
                {element.comment}
              </p>
              <button  onClick={() => {
                setIndex(i)
                setIsPlaying(true)
                convertVoice(element.comment, element.id_voice)
              }} className="btnOuvir" >
                <p style={{fontFamily: 'Segoe UI', fontSize: 15, textAlign: 'center', fontWeight: 'bold', color:"#363636"}}>{isPlaying && i === index ? "Tocando" : "Ouvir"}</p>
              </button>
              </div>
            )
          }) : <p>Nenhum comentário</p>}
        </Container>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </Container>
  )
}
