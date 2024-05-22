

import { useState } from "react";
import { GptMessage, MyMessage, TypingLoader, TextFileMessageBox } from "../../components";
import { audioToTextUseCase } from "../../../core/use-cases";


interface Message {
  text: string;
  isGpt: boolean;
}

export const AudioToTextPage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePostMessage = async ( text: string, audioFile: File ) => {


    setIsLoading(true)
    setMessages((prev) => [...prev, { text: text, isGpt: false }])

    const resp = await audioToTextUseCase( audioFile, text )

    setIsLoading(false)

    if ( !resp ) return;

    const gptMessage = `
## Transcripcion:
__Duracion:__ ${ Math.round( resp.duration ) } segundos
### El texto es:
${ resp.text }
`

    setMessages(prev => [
      ...prev,
      { text: gptMessage, isGpt: true }
    ])

    for( const segment of resp.segments ) {
      const segmentMessage = `
  __De ${ Math.round( segment.start ) } a ${ Math.round( segment.end ) } segundos:__
  ${ segment.text }
`

      setMessages(prev => [
        ...prev,
        { text: segmentMessage, isGpt: true }
      ])

    }

  }

  return (
    <div className="chat-container" >
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2" >
          <GptMessage text="Hola, que audio quieres generar hoy?" />

          {
            messages.map((message, i) => (
              message.isGpt
              ? (
                  <GptMessage key={ i } text={ message.text } />
              )
              : (
                <MyMessage key={ i } text={ (message.text === '') ? 'Transcribe el audio' : message.text } />
              )
            ))
          }

          {
            isLoading && (
              <div className="col-start-1 col-end-1 fade-in" >
                <TypingLoader />
              </div>
            )
          }
        </div>
      </div>

      <TextFileMessageBox
        onSendMessage={ handlePostMessage }
        placeholder="Escribe aqui lo que deseas"
        disabledCorrections
        accept="audio/*"
      />
    </div>
  )
}