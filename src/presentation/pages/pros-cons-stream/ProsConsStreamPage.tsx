import { useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { ProsConsResponse } from "../../../interfaces";
import { prosConsStreamUseCase } from "../../../core/use-cases/pros-cons-stream.use-case";


interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsStreamPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePostMessage = async ( text: string ) => {


    setIsLoading(true)
    setMessages((prev) => [...prev, { text: text, isGpt: false }])

    await prosConsStreamUseCase( text ) 

    // if( !ok ) return;

    // setMessages((prev) => [...prev, { text: content, isGpt: true }])

    setIsLoading(false)
  }

  return (
    <div className="chat-container" >
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2" >
          <GptMessage text="Que quieres comparar hoy?" />

          {
            messages.map((message, i) => (
              message.isGpt
              ? (
                  <GptMessage key={ i } text={ message.text } />
              )
              : (
                <MyMessage key={ i } text={ message.text } />
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

      <TextMessageBox
        onSendMessage={ handlePostMessage }
        placeholder="Escribe aqui lo que deseas"
        disabledCorrections
      />
    </div>
  )
}
