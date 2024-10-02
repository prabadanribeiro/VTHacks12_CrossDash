from twilio.rest import Client
from gpt_call import call_text
from dotenv import load_dotenv
import os

load_dotenv()
phone_account_sid = os.getenv('PHONE_ACCOUNT_SID')
phone_auth_token = os.getenv('PHONE_AUTH_TOKEN')

client = Client(phone_account_sid, phone_auth_token)

def call(msg):
    call = client.calls.create(
        twiml = '<Response><Say>'+ msg + '</Say></Response>',
        to = "+17125705082",
        from_ = '+18337723016')
