import {NextApiRequest, NextApiResponse} from "next";
import {Configuration, OpenAIApi} from "openai";

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
                    result: "Successfully fetched API key",
                });
            })
            .catch(e => {
                res.status(200).json({
                    error: {
                        message: `Failed to fetch API Key`,
                    },
                });
            });
    } catch (e) {
        res.status(200).json({
            error: {
                message: `Failed validating API Key`,
            },
        });
    }
}
