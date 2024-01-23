import { useState } from "react";
import { GptMessage, GptOrthography, TextMessageBox, TypingLoader } from "../../components"
import { MyMessage } from '../../components/chat-bubbles/MyMessage';
import { orthographyUseCase } from "../../../core/use-cases";
import { OrthographyResponse } from "../../../interfaces";


interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  },
}

export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePostMessage = async ( text: string ) => {


    setIsLoading(true)
    setMessages((prev) => [...prev, { text: text, isGpt: false }])

   const { ok, message, errors, userScore } = await orthographyUseCase(text) as OrthographyResponse


    if( !ok) {
      setMessages((prev) => [...prev, { text: 'No se pudo realizar la correcion', isGpt: true }])
    } else {
      setMessages((prev) => [...prev, { 
        text: message, 
        isGpt: true,
        info: {
          userScore,
          errors,
          message,
        }
      }])
    }

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
                  <GptOrthography
                    key={ i }
                    { ...message.info! }
                  />
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
