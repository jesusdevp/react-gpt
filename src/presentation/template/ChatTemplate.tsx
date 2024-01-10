import { useState } from "react";
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from "../components";


interface Message {
  text: string;
  isGpt: boolean;
}

export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePostMessage = ( text: string ) => {


    setIsLoading(true)
    setMessages((prev) => [...prev, { text: text, isGpt: false }])

    setIsLoading(false)
  }

  return (
    <div className="chat-container" >
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2" >
          <GptMessage text="Hola, puedes decirme la hora" />

          {
            messages.map((message, i) => (
              message.isGpt
              ? (
                  <GptMessage key={ i } text="Esto es gpt" />
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
