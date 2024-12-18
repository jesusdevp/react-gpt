

export const imageToTextUseCase = async ( prompt: string, imageFile: File ) => {

    try {

        const formData = new FormData();
        formData.append('file', imageFile);

        if ( prompt ) {
            formData.append('prompt', prompt)
        }


        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/extract-text-from-image`, {
            method: 'POST',
            body: formData
        });

        const { msg } = await resp.json();

        return { msg } as any;


    } catch (error) {
        console.log(error)
        return null;
    }


}