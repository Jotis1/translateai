/**
 * @author Jotis
 * This has to be client side rendered, because we have sensitive data treated here, like the API key.
 * As this will be static generated, we can't have the API key in the code, so we have to make a request to the server.
 * Thats also the reason why we don't need an skeleton loader.
 * For usage information, see the README.md
 */
'use client';
/**
 * We import the TranslateFile action, which is the one that will make the request to the server.
 * We also import the AuthUser action, which will make the request to the server to authenticate the user.
 */
import TranslateFile, { AuthUser } from '@/app/lib/action';
/**
 * Both actions are async, so we have to use the `useFormState` hook to handle the state of the form.
 * See React docs for more information: https://reactjs.org/docs/forms.html#controlled-components
 */
import { useFormState } from 'react-dom';
/**
 * We import the `useEffect` and `useState` hooks to handle the state of the component.
 * Both are only client side only, so we don't have to worry about SSR (server side rendering).
 * See React docs for more information: https://reactjs.org/docs/hooks-intro.html
 */
import { FormEvent, useEffect, useState } from 'react';
/**
 * We import the `Link` component from Next.js to handle the navigation to the file.
 * We also import the `Button` component from the UI library to handle the button.ç
 * Button type is `submit` by default, so we don't have to specify it.
 * See Next.js docs for more information: https://nextjs.org/docs/api-reference/next/link
 * See Readme.md for more information about the UI library.
 */
import Link from 'next/link';
import Button from '@/app/ui/Button';
/**
 * We import the `FormStateProps` interface to handle the state of the form.
 * See `action.ts` for more information about the type.
 */
import { FormStateProps } from '@/app/types';
/**
 * initialState is the initial state of the form response.
 * We set it to null, because we don't have any response yet.
 * It will be updated when the user submits the form and the server responds.
 * We will be able to handle errors and success messages with this state
 * See React docs for more information: https://react.dev/reference/react-dom/hooks/useFormState
 */
const initialFileResponse: null | FormStateProps = null;
const initialAuthResponse: null | boolean = null;
/**
 * This is the page component. It will be rendered in the `/` route.
 * It will render a form with a button to select a file.
 * When the user selects a file, it will be uploaded to the server and the server will respond with the the same file, but  translated to Spanish.
 * The user will be able to download the file.
 * Only authenticated users will be able to use the service (by now).
 * Accedpted file types are `.mp3` and `.mp4`.
 * @returns The page component
 */
export default function Page() {
  /**
   * Here we use the `useFormState` hook to handle the state of the FILE form.
   * Errors and success messages will be handled with this state.
   */
  const [state, formAction] = useFormState(TranslateFile, initialFileResponse);
  /**
   * Here we use the `useFormState` hook to handle the state of the AUTH form.
   * Errors and success messages will be handled with this state.
   */
  const [stateAuth, formAuth] = useFormState(AuthUser, initialAuthResponse);
  /**
   * We use the `useState` hook to handle the state of the file.
   * We use it to know if the user has selected a file or not.
   */
  const [isFile, setIsFile] = useState<boolean>(false);
  /**
   * We use the `useState` hook to handle the state of the response.
   * We use it to know if the trasnlation has been successful or not, and if it has been successful, we show the download link.
   */
  const [fileLoaded, setFileLoaded] = useState<boolean>(false);
  /**
   * We use the `useState` hook to handle the state of the file preview.
   * We use it to show the name of the file the user has selected.
   * If the user has not selected a file, we show a button to select a file.
   */
  const [filePreview, setFilePreview] = useState<null | string>(null);
  /**
   * We use the `useState` hook to handle the state of the access.
   * If the user has not authenticated, we show the auth form.
   * If the user has authenticated, we show the file form.
   * The authentication will be "hardcoded" since we don't have a database yet.
   */
  const [access, setAccess] = useState<boolean>(false);
  /**
   * This function will be called when the user clicks the button to select a file.
   * It will trigger the click event of the file input.
   */
  const handleClick = (): void => {
    document.getElementById('file')?.click();
  };
  /**
   * This function will be called when the user selects a file.
   * It will set the file preview to the name of the file and set the isFile state to true.
   * @param formEvent The event of the file input
   */
  const handleChange = async (formEvent: any): Promise<void> => {
    var data = formEvent.target.files[0];
    if (!data) return;
    setIsFile(true);
    setFilePreview(data.name);
  };
  /**
   * This effect will be triggered when the state of the form changes.
   * If the state is ok, we set the fileLoaded state to true.
   * If the stateAuth is ok, we set the access state to true.
   * @returns The effect
   */
  useEffect((): void => {
    if (state?.response.ok) setFileLoaded(true);
    if (stateAuth) setAccess(true);
  });
  /**
   * This is the main render of the page.
   * If the user has not authenticated, we show the auth form.
   * If the user has authenticated, we show the file form.
   * If the user has selected a file, we show the download link.
   * @returns The render
   */
  return (
    <main className="w-screen font-medium h-screen py-5 px-10 text-zinc-950 text-center flex flex-col gap-10 justify-center">
      {!access ? (
        <form
          action={formAuth}
          className="p-5 text-zinc-950 flex flex-col border-2 border-zinc-300 rounded-lg gap-6"
        >
          <section className="flex flex-col items-start justify-center w-full gap-2">
            <label className="text-zinc-700" htmlFor="user">
              Usuario
            </label>
            <input
              name="name"
              className="w-full border-2 h-10 px-2.5 rounded-lg border-zinc-300"
              placeholder="Introduce tu usuario"
              type="text"
              required
            />
          </section>
          <section className="flex flex-col items-start justify-center w-full gap-2">
            <label className="text-zinc-700" htmlFor="password">
              Contraseña
            </label>
            <input
              name="password"
              className="w-full border-2 h-10 px-2.5 rounded-lg border-zinc-300"
              placeholder="Introduce tu usuario"
              type="password"
              required
            />
          </section>
          <Button disable={false}></Button>
        </form>
      ) : (
        <>
          <p className="text-3xl">
            Translate<span className="font-black">AI</span>
          </p>
          <form action={formAction} className="flex flex-col gap-10">
            {!fileLoaded ? (
              <>
                {!filePreview ? (
                  <button
                    type="button"
                    onClick={handleClick}
                    className="shadow-lg mx-auto w-full max-w-sm text-zinc-700 aspect-square border-2 border-dashed border-zinc-300 rounded-xl flex flex-col gap-5 items-center justify-center"
                  >
                    <header>
                      <p>Selecciona un archivo</p>
                      <p className="text-sm text-zinc-500">(.mp3, .mp4)</p>
                    </header>
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 text-zinc-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                      />
                    </svg>
                  </button>
                ) : (
                  <section className="flex text-xs  flex-col gap-2.5 p-2.5 border border-zinc-300 rounded-lg">
                    <p className="text-zinc-700">Archivo seleccionado:</p>
                    <p>
                      {filePreview.split('.')[0]}
                      <span className="font-black">
                        .{filePreview.split('.')[1]}
                      </span>
                    </p>
                  </section>
                )}
                <input
                  onChange={handleChange}
                  accept=".mp3,.mp4"
                  className="hidden"
                  type="file"
                  name="file"
                  id="file"
                />
                <Button disable={!isFile} />
              </>
            ) : (
              state?.response.file?.url && (
                <section className="text-xs flex items-center justify-between w-full h-10 rounded-lg bg-zinc-950 text-zinc-50">
                  <p className="flex-grow truncate px-2.5 text-start">
                    {state?.response.file?.name}
                  </p>
                  <Link
                    href={state?.response.file?.url}
                    className="w-10 h-full flex items-center justify-center border-l border-zinc-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M13.75 7h-3v5.296l1.943-2.048a.75.75 0 011.114 1.004l-3.25 3.5a.75.75 0 01-1.114 0l-3.25-3.5a.75.75 0 111.114-1.004l1.943 2.048V7h1.5V1.75a.75.75 0 00-1.5 0V7h-3A2.25 2.25 0 004 9.25v7.5A2.25 2.25 0 006.25 19h7.5A2.25 2.25 0 0016 16.75v-7.5A2.25 2.25 0 0013.75 7z" />
                    </svg>
                  </Link>
                </section>
              )
            )}
          </form>
          {state?.response.ok === false && (
            <section className="rounded-lg absolute bottom-5 right-1/2 translate-x-1/2 py-2.5 px-5 bg-red-200 border-2 border-red-400 text-red-950">
              <p>Ha ocurrido un error: {state.response.message}</p>
            </section>
          )}
        </>
      )}
    </main>
  );
}
