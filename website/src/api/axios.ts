import axios from "axios";

import {
  removeStoredWebToken,
  storedWebToken
} from "../features/authentication/authenticationStorage";


type ErrorResponse = {
  title?: string;
  detail?: string;
};

export class ApiError extends Error
{
  public readonly status: number | null;

  constructor
  (
    message: string,

    status: number | null
  )
  {
    super(message);

    this.name = "ApiError";

    this.status = status;
  }
}

function ErrorMessage(error: unknown): string
{
  if (!axios.isAxiosError<ErrorResponse | string>(error))

    return error instanceof Error

      ? error.message

      : "An unexpected error occurred.";

  if (typeof error.response?.data == "string")

    return error.response.data;

  return error.response?.data.detail

    ?? error.response?.data.title

    ?? (error.response

      ? "The server was unable to complete the request."

      : "Unable to contact the server. Please try again.");
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

axiosInstance.interceptors.request.use(requestConfig =>
{
  const webToken = storedWebToken();

  if (webToken && requestConfig.url != "/login")

    requestConfig.headers.set(
      "Authorization",

      `Bearer ${webToken}`
    );

  return requestConfig;
});

axiosInstance.interceptors.response.use(
  response => response,

  (error: unknown) =>
  {
    const axiosError = axios.isAxiosError(error)

      ? error

      : null;

    const status = axiosError?.response?.status ?? null;

    const loginRequest = axiosError?.config?.url == "/login";

    if (status == 401 && !loginRequest)
    {
      removeStoredWebToken();

      window.location.assign(import.meta.env.BASE_URL);
    }

    if (status == 403 && !loginRequest)

      window.location.assign(
        `${import.meta.env.BASE_URL}access-denied`
      );

    return Promise.reject(
      new ApiError
      (
        ErrorMessage(error),

        status
      )
    );
  }
);

export default axiosInstance;