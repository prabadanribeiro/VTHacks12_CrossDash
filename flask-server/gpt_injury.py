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
                scenario.
                Here is their input: """ + content + "And here is the address you must include" + location,
                
            }
        ])
    response = completion.choices[0].message.content
    return response