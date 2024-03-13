
import { useState } from "react";
import { GptMessage, MyMessage, TypingLoader, TextSelectMessageBox, GptMessageAudio } from "../../components";
import { textToAudioUseCase } from "../../../core/use-cases";

const disclamer =`## Que audio quieres generar hoy?
  * Todo el audio generado es por AI.
`

const voices = [
  { id: "nova", text: "Nova" },
  { id: "alloy", text: "Alloy" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "onyx", text: "Onyx" },
  { id: "shimmer", text: "Shimmer" },
]

interface TextMessage {
  text: string;
  isGpt: boolean;
  type: 'text'
}

interface AudioMessage {
  text: string;
  isGpt: boolean;
  audio: string;
  type: 'audio'
}

type Message = TextMessage | AudioMessage

export const TextToAudioPage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePostMessage = async ( text: string, selectedVoice: string ) => {


    setIsLoading(true)
    setMessages((prev) => [...prev, { text: text, isGpt: false, type: 'text' }])

    // use case
    const {ok, message, audioUrl} = await textToAudioUseCase(text, selectedVoice)

    setIsLoading(false)

    if(!ok) return;

    setMessages((prev) => [...prev, { text: `${ selectedVoice } - ${ message }`, isGpt: true, type: 'audio', audio: audioUrl! }])
  }

  return (
    <div className="chat-container" >
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2" >
          <GptMessage text={ disclamer } />

          {
            messages.map((message, i) => (
              message.isGpt
              ? (
                  message.type === 'audio'
                  ? (
                    <GptMessageAudio 
                    key={ i } 
                    text={ message.text }
                    audio={ message.audio } 
                  />
                  )
                  : (
                    <GptMessage key={ i } text={ message.text } />
                  )
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
        options={ voices }
      />
    </div>
  )
}
