from openai import OpenAI


API_KEY = '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'  # Replace with your actual API key
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
                scenario. When you say the address, do not include the name of the country. Also, make sure to include the address smoothly.
                scenario. Do not forget that what you are supposed to do is to give a report of the incident you received.
                Here is their input: """ + content + "And here is the address you must include" + location,
                
            }
        ])
    response = completion.choices[0].message.content
    return response