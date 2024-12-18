import { useState } from "react";
import { imageToTextUseCase } from "../../../core/use-cases/image-to-text.use-case";
import { GptMessage, TextFileMessageBox, TypingLoader } from "../../components";
import { MyImageMessage } from "../../components/chat-bubbles/MyImageMessage";


interface Message {
    text: string;
    isGpt: boolean;
    info?: {
      imageUrl: string;
      alt: string
    }
  }

export const ImageToTextPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const handlePostPrompt = async ( text: string, imageFile: File ) => {

        setIsLoading(true);

        const fileUrl = URL.createObjectURL(imageFile)

        if( fileUrl ) {
            setMessages((prev) => [...prev, 
                { 
                    text: text, 
                    isGpt: false, 
                    info: 
                        {   
                            imageUrl: fileUrl,
                            alt: imageFile.name,
                        } 
                }
            ])
        } else {
            setMessages((prev) => [...prev, { text: text, isGpt: false }])
        }

        const resp = await imageToTextUseCase( text, imageFile );
        setIsLoading(false);

        if( !resp ) return;

        setMessages( (prev) => [
            ...prev,
            {
                text: resp.msg,
                isGpt: true
            }
        ]);


    };

  return (
    <div className="chat-container" >
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2" >
          <GptMessage text="Que imagen quieres pasar a texto?" />

          {
            messages.map((message, i) => (
              message.isGpt
              ? (
                  <GptMessage key={ i } text={ message.text } />
              )
              : (
                <MyImageMessage
                    key={ i } 
                    text={ message.text }
                    imageUrl={ message?.info?.imageUrl! }
                    alt={ message.info?.alt! }
                  />
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
        onSendMessage={ handlePostPrompt }
        placeholder="Escribe aqui lo que deseas"
        disabledCorrections
        accept="image/*"
      />
    </div>
  )
}
