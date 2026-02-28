from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_ai_response(message: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Você é um assistente inteligente."},
            {"role": "user", "content": message},
        ],
        temperature=0.7,
    )

    return response.choices[0].message.content