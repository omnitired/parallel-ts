import Axios, { AxiosError } from "axios";

interface IResponse {
  url: string;
  text?: string;
  error?: string;
}

export async function runInParallel(
  urls: string[],
  concurrency: number
): Promise<IResponse[]> {
  const returnResult: IResponse[] = [];

  if (concurrency < 1) {
    throw new Error("please enter a valid concurrent value");
  }

  for (let i = 0; i < urls.length; i += concurrency) {
    const chunk = urls.slice(i, i + concurrency);
    const responses = await Promise.all<IResponse>(
      chunk.map(
        (url) =>
          new Promise((resolve, reject) => {
            Axios(url, {
              responseType: "text",
            })
              .then((res) =>
                resolve({
                  text: res.data,
                  url: url,
                })
              )
              .catch((err: AxiosError) =>
                resolve({
                  url: url,
                  error: err.message,
                })
              );
          })
      )
    );
    returnResult.push(...responses);
  }
  return returnResult;
}

