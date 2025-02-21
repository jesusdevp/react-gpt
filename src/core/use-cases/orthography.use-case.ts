

export const orthographyUseCase = async ( prompt: string ) => {

    try {
        
        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/orthography-check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        })

        if(!resp.ok) throw new Error('No se pudo realizar la correcion');

        const data = await resp.json()

        return {
            ok: true,
            ...data
        }

    } catch (error) {
        return {
            ok: false,
            userScore: 0,
            errors: 'No se pudo realizar la correcion'
        }
    }


}