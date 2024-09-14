#import all the libraries#
import speech_recognition as sr
from openai import OpenAI
from sttxt import listen
from twilio.rest import Client
from sttxt import listen
from gpt_i import ask_gpt
from gpt_call import call_text
from ring import call
from webm_to_wav import convert
#First step: Recognize what the issue is by listening#
said_message = listen(convert('uploads/untitled.webm', 'uploads/untitled.wav'))
#Second step: Put the message through both the advise giving AI and the calling AI#
advice = ask_gpt(said_message)
call_message = call_text(said_message, "190 West Drive, Blacksburg")
#Third step: print out the advice and call the emergency services
print(advice)
call(call_message)
