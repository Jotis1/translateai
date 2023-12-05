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
                    className={`bg-zinc-300 flex items-center gap-2 text-zinc-500 cursor-not-allowed w-fit mx-auto px-5 py-2  rounded-lg`}
                    type='submit'
                    disabled={disable}>
                    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="16" width="16" viewBox="0 0 512 512">
                        <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
                    </svg>
                    Cargando
                </button>
            )}
        </>
    )
}