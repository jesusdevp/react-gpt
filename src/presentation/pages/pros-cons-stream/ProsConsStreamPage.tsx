import { useRef, useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { prosConsStreamGeneratorUseCase } from "../../../core/use-cases/pros-cons-stream-generator.use-case";


interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsStreamPage = () => {

  const abortController = useRef( new AbortController() )
  const isRunning = useRef(false)

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePostMessage = async ( text: string ) => {

    if( isRunning.current ) {
      abortController.current.abort();
      abortController.current = new AbortController()
    }

    setIsLoading(true)
    isRunning.current = true
    setMessages((prev) => [...prev, { text: text, isGpt: false }])

    const stream = prosConsStreamGeneratorUseCase( text, abortController.current.signal )
    setIsLoading(false)

    setMessages((prev) => [...prev, { text: '', isGpt: true }])

    for await (const text of stream) {
      setMessages(( messages ) => {
        const newMessages = [...messages];
        newMessages[ newMessages.length - 1 ].text = text;

        return newMessages;
      })
    }

    isRunning.current = false;

    // const reader = await prosConsStreamUseCase( text )
    // setIsLoading(false)

    // if( !reader ) return;

    // const decoder = new TextDecoder();
    // let message = ''
    // setMessages((messages) => [...messages, { text: message, isGpt: true }])

    // while(true) {
    //   const { value, done } = await reader.read();

    //   if( done ) break;

    //   const decodedChunk = decoder.decode(value, { stream: true })
    //   message += decodedChunk;

      // setMessages(( messages ) => {
      //   const newMessages = [...messages];
      //   newMessages[ newMessages.length - 1 ].text = message;

      //   return newMessages;
      // })



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
