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

def main_be(location):
    #First step: Recognize what the issue is by listening#
    said_message = listen(convert('uploads/audio.webm', 'uploads/audio.wav'))
    #Second step: Put the message through both the advise giving AI and the calling AI#
    advice = ask_gpt(said_message)
    # call_message = call_text(said_message, location)
    #Third step: print out the advice and call the emergency services#
    # call(call_message)
    return advice, said_message

#needs audio in webm and location#
#main_be('190 W Drive, New Hall West')#