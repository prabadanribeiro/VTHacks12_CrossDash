from openai import OpenAI
from sttxt import listen
from dotenv import load_dotenv
import os

load_dotenv()
open_ai_api_key = os.getenv('OPEN_AI_API_KEY')

API_KEY = open_ai_api_key
MODEL="gpt-4o-mini"


client = OpenAI(
    api_key = API_KEY,
)
def gpt_data(content):
    completion = client.chat.completions.create(
    model=MODEL,
        messages=[
            {
                "role": "system",
            
                "content":  """You will be given a text that explains a situation somewhere. You will have to listen to the described situation and
                decide if it fits under the category of 'alcohol', 'drugs', 'accident'. If it fits into none of these you will return 'unknown'
                Please only and only return one of these options.  
                Here is their input: """ +
                content,
            }
        ])
    response = completion.choices[0].message.content
    return response
