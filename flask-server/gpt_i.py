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
def ask_gpt(content):
    completion = client.chat.completions.create(
    model=MODEL,
        messages=[
            {
                "role": "system",
            
                "content":  """You are going to assist a program called CrossDash. You will be giving first aid 
                advice according to their input as bullet points seperated by dashes (THIS IS IMPORTANT) moreover, DO NOT TELL THEM TO CALL EMERGENCY SERVICES OR HELP, as we will be calling it for them. 
                Also don't forget these people will be panicking, therefore give short and useful answers which they can apply immediately.  
                Here is their input: """ +
                content,
            }
        ])
    response = completion.choices[0].message.content
    return response
