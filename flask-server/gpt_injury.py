from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
open_ai_api_key = os.getenv('OPEN_AI_API_KEY')

API_KEY = open_ai_api_key

API_KEY = open_ai_api_key
MODEL="gpt-4o-mini"

client = OpenAI(
    api_key = API_KEY,
)
def call_text(content, location):

    completion = client.chat.completions.create(
    model=MODEL,
        messages=[
            {
                "role": "system",
            
                "content":  """You are going to assist a program called CrossDash. You will be generating text to be read out to
                emergency services given their input. Please make sure you keep it professional, but also brief as it is a life death
                scenario.
                Here is their input: """ + content + "And here is the address you must include" + location,
                
            }
        ])
    response = completion.choices[0].message.content
    return response