from openai import OpenAI
from sttxt import listen

API_KEY = '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'  # Replace with your actual API key
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
