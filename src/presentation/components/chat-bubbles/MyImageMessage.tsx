
interface Props {
    text: string,
    imageUrl: string,
    alt: string
}

export const MyImageMessage = ({ text, imageUrl, alt }: Props) => {
  return (
    <div className="col-start-1 col-end-13 p-3 rounded-lg" >
        <div className="flex items-center justify-start flex-row-reverse" >
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0" >
                J
            </div>
            <div className="relative mr-3 text-sm bg-indigo-700 py-2 px-4 shadow rounded-xl" >
                <div>{ text }</div>
                {
                imageUrl && (
                    <img 
                    src={ imageUrl }
                    alt={ alt }
                    className='mt-2 rounded-xl w-96 h-96 object-cover'
                    />
                )
               }
            </div>
        </div>
    </div>
  )
}