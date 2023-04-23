const API_URL = "https://api.openai.com/v1/engines/davinci-codex/completions";

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
