import { useState, useEffect } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from "../../components";
import { createThreadUseCase, postQuestionUseCase } from '../../../core/use-cases';


interface Message {
  text: string;
  isGpt: boolean;
}

export const AssistantPage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [threadId, setThreadId] = useState<string>()

  useEffect(() => {

    const threadId = localStorage.getItem('threadId');

    if( threadId ) {

      setThreadId( threadId )

    } else {

      createThreadUseCase()
        .then( id => {
          setThreadId( id );
          localStorage.setItem('threadId', id)
        })
    }

  }, [])
  
  useEffect(() => {

    if( threadId ) {
      setMessages((prev) => [...prev, { text: `Numero de thread ${ threadId }`, isGpt: true }])
    }

  }, [threadId])
  

  const handlePostMessage = async ( text: string ) => {

    if( !threadId ) return;

    setIsLoading(true)
    setMessages((prev) => [...prev, { text: text, isGpt: false }])

    const replies = await postQuestionUseCase(threadId, text)

    setIsLoading(false)

    for (const reply of replies) {
      for (const message of reply.content) {
       setMessages( prev => [
        ...prev,
        { text: message, isGpt: ( reply.role === 'assistant' ), info: reply }
       ])
        
      }
    }
  }

  return (
    <div className="chat-container" >
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2" >
          <GptMessage text="Buen dia, soy Zara, en que puedo ayudarte?" />

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
