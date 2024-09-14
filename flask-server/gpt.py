import openai
API_KEY = 'sk-z3V2qKyrJIYPp7JXgsZTPfnSY--eEm-oGyGER7FaSDT3BlbkFJc0GariLnnVF4bEEHNBhOjeQmrIcDJY4PIqobi7lCIA'

openai.my_api_key = API_KEY

messages = [ {"""role": "system", "content": "You are part of a program called CrossDash, your goal is to help make calls to emergency services 
              by listening to what people are saying"""} ]

while True:
    message = input("User : ")
    if message:
        messages.append(
            {"role": "user", "content": message},
        )
        chat = openai.ChatCompletion.create(
            model="gpt-3.5-turbo", messages=messages
        )
    reply = chat.choices[0].message.content
    print(f"ChatGPT: {reply}")
    messages.append({"role": "assistant", "content": reply})