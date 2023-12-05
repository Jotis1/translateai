"use client";
import TranslateFile from '@/app/lib/action';

import { useFormState } from 'react-dom';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/app/ui/Button';

const initialState = null;

export default function Page() {

  const [state, formAction] = useFormState(TranslateFile, initialState);
  const [isFile, setIsFile] = useState(false);
  const [fileLoaded, setFileLoaded] = useState(false);
  const [filePreview, setFilePreview] = useState<null | string>(null);

  const handleClick = () => {
    document.getElementById("file")?.click();
  }

  const handleChange = async (e: any) => {

    var data = e.target.files[0];

    if (!data) return;
    setIsFile(true);
    setFilePreview(data.name);
  }

  useEffect(() => {
    if (state?.response.ok) {
      setFileLoaded(true);
    }
  })


  return (
    <main className='w-screen font-medium h-screen py-5 px-10 text-zinc-950 text-center flex flex-col gap-10 justify-center'>
      <p className='text-3xl'>Translate<span className='font-black'>AI</span></p>
      <form action={formAction} className='flex flex-col gap-10'>
        {!fileLoaded ? (
          <>
            {!filePreview ? (
              <button type='button' onClick={handleClick} className='shadow-lg mx-auto w-full max-w-sm text-zinc-700 aspect-square border-2 border-dashed border-zinc-300 rounded-xl flex flex-col gap-5 items-center justify-center'>
                <header>
                  <p>Selecciona un archivo</p>
                  <p className='text-sm text-zinc-500'>(.mp3, .mp4)</p>
                </header>
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-zinc-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                </svg>
              </button>
            ) : (
              <section className='flex text-xs  flex-col gap-2.5 p-2.5 border border-zinc-300 rounded-lg'>
                <p className='text-zinc-700'>Archivo seleccionado:</p>
                <p>{filePreview.split(".")[0]}<span className='font-black'>.{filePreview.split(".")[1]}</span></p>
              </section>
            )}
            <input onChange={handleChange} accept='.mp3,.mp4' className='hidden' type="file" name='file' id='file' />
            <Button disable={!isFile} />
          </>
        ) : state?.response.file?.url && (
          <section className='text-xs flex items-center justify-between w-full h-10 rounded-lg bg-zinc-950 text-zinc-50'>
            <p className='flex-grow truncate px-2.5 text-start'>{state?.response.file?.name}</p>
            <Link href={state?.response.file?.url} className='w-10 h-full flex items-center justify-center border-l border-zinc-800'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M13.75 7h-3v5.296l1.943-2.048a.75.75 0 011.114 1.004l-3.25 3.5a.75.75 0 01-1.114 0l-3.25-3.5a.75.75 0 111.114-1.004l1.943 2.048V7h1.5V1.75a.75.75 0 00-1.5 0V7h-3A2.25 2.25 0 004 9.25v7.5A2.25 2.25 0 006.25 19h7.5A2.25 2.25 0 0016 16.75v-7.5A2.25 2.25 0 0013.75 7z" />
              </svg>
            </Link>
          </section>
        )
        }
      </form>
      {state?.response.ok === false && (
        <section className='rounded-lg absolute bottom-5 right-1/2 translate-x-1/2 py-2.5 px-5 bg-red-200 border-2 border-red-400 text-red-950'>
          <p>Ha ocurrido un error: {state.response.message}</p>
        </section>
      )}
    </main >
  );
}