"use client";

import { useFormStatus } from "react-dom";

export default function Button({ disable }: { disable: boolean }) {

    const { pending } = useFormStatus();

    return (
        <>
            {!pending ? (
                <button
                    className={`${!disable ? "bg-zinc-950 text-zinc-50" : "bg-zinc-300 text-zinc-500 cursor-not-allowed"} w-fit mx-auto px-5 py-2  rounded-lg`}
                    type='submit'
                    disabled={disable}>
                    Continuar
                </button>
            ) : (
                <button
                    className={`bg-zinc-300 text-zinc-500 cursor-not-allowed w-fit mx-auto px-5 py-2  rounded-lg`}
                    type='submit'
                    disabled={disable}>
                    Cargando
                </button>
            )}
        </>
    )
}