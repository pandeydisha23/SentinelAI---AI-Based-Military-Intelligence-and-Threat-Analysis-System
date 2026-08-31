from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

print("API Key:", api_key[:15] + "..." if api_key else "NOT FOUND")

client = genai.Client(api_key=api_key)

print("\nAvailable models:")

for model in client.models.list():
    print(model.name)