


export async function* prosConsStreamGeneratorUseCase ( prompt: string ) {

    try {
        
        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })

        })

        if(!resp.ok) throw new Error('No se pudo realizar la comparacion');

        const reader = resp.body?.getReader();

        if( !reader ) {
            console.log('No se pudo gererar el reader')
            return null;
        }


        const decoder = new TextDecoder();

        let text = '';

        while (true) {
            const { value, done } = await reader.read();

            if ( done ) {
                break;
            }

            const decodeChunk = decoder.decode(value, { stream: true })

            text += decodeChunk
            yield text;
        }


    } catch (error) {
        console.log(error)
        return null;
    }


}