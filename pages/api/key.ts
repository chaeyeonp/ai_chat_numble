import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

type ResponseType = {
  result?: string;
  error?: {
    message: string;
  };
};

export default async function validateKey(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const key = req.body.apiKey;

  try {
    const openai = new OpenAIApi(
      new Configuration({
        apiKey: key,
      }),
    );
    openai
      .listModels()
      .then(() => {
        res.status(200).json({
          result: "success",
        });
      })
      .catch(e => {
        res.status(200).json({
          error: {
            message: "fail",
          },
        });
      });
  } catch (e) {
    res.status(200).json({
      error: {
        message: "Failed validating key",
      },
    });
  }
}
