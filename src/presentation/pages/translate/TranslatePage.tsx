import { useState } from "react";
import { GptMessage, MyMessage, TypingLoader, TextSelectMessageBox } from "../../components";
import { translateTextUseCase } from "../../../core/use-cases/translate.use-case";
interface Message {
  text: string;
  isGpt: boolean;
}

const languages = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
];

export const TranslatePage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePostMessage = async ( text: string, selectedOption: string ) => {


    setIsLoading(true)
    setMessages((prev) => [...prev, { text: text, isGpt: false }])

    const { message, ok } = await translateTextUseCase(text, selectedOption)

    setIsLoading(false)

    if(!ok ) {
      return alert(message)
    }

    setMessages((prev) => [...prev, { text: message, isGpt: true }])
  }

  return (
    <div className="chat-container" >
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2" >
          <GptMessage text="Que quieres traducir el dia de hoy?" />

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

      <TextSelectMessageBox
        onSendMessage={ handlePostMessage }
        placeholder="Escribe aqui lo que deseas"
        options={ languages }
      />
    </div>
  )
}
