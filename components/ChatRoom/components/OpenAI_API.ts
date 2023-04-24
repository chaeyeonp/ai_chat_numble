const API_URL = "https://api.openai.com/v1/chat/completions";
export async function OpenAI_API(prompt: any) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("apiKey")}`,
    },
    body: JSON.stringify({
      prompt,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 1,
      model:"gpt-3.5-turbo",
      messages: [{"role": "user", "content": "Hello!"}],
      error: {
        message: "Invalid request. Please check your input.",
        type: "invalid_request_error",
        messages: ["The 'stop' parameter must be a non-empty string or null."]
      }

    }),
  });

  if (response.ok) {
    const data = await response.json();
    return data.choices[0].text.trim();
  } else {
    throw new Error("API request failed");
  }
}

export default OpenAI_API;
