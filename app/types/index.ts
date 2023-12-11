/**
 * Interface for the File form state
 * We will handle the form response and store it in the state.
 */
export interface FormStateProps {
  response: {
    ok: boolean;
    message: string;
    file: { name: string; url: string } | null;
  };
}
/**
 * Interface for the File form state
 * We will handle the form response and store it in the state.
 * The null value is used to indicate that the form has not been submitted.
 */
export type PrevStateProps = null | FormStateProps;
