import { GptMessage, TextMessageBox, TypingLoader } from "../../components"
import { MyMessage } from '../../components/chat-bubbles/MyMessage';


export const OrthographyPage = () => {

  return (
    <div className="chat-container" >
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2" >
          <GptMessage text="Hola, puedes decirme la hora" />
          <MyMessage text="Hola mundo" />

          <TypingLoader className='fade-in' />
        </div>
      </div>

      <TextMessageBox 
        onSendMessage={(mesage) => console.log(mesage)}
        placeholder="Escribe aqui lo que deseas"
        disabledCorrections
      />
    </div>
  )
}
