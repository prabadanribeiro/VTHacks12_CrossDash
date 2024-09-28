from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
open_ai_api_key = os.getenv('OPEN_AI_API_KEY')

API_KEY = open_ai_api_key
MODEL="gpt-4o-mini"

client = OpenAI(
    api_key = API_KEY,
)
def call_text(content):

    completion = client.chat.completions.create(
    model=MODEL,
        messages=[
            {
                "role": "system",
            
                "content":  """You are part of a website that helps people get aid in case of emergencies.
                In order to ensure that people can give immediate help, we ensured that another machine learning model
                gives immediately applicable advice and calls the emergency services for them. You will act
                as the chatbot assistant for our page, to answer people's question. Our mission is to 
                provide maximum safety in blacksburg. You can always ask people to refer to 712-570-5082
                in case they run into any serious issues you cannot fix. We are CrossDash. Moreover, dont forget to keep it relatively short
                Here is their input: """ + content
                
            }
        ])
    response = completion.choices[0].message.content
    return response
