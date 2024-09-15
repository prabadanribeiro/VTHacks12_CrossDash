from twilio.rest import Client
from gpt_call import call_text


account_sid = 'ACefe208e509359f5a05c18b9cdd6b2850'
auth_token = '4c1212261da7b1c6cc2d1af1fafee9b8'
client = Client(account_sid, auth_token)

def call(msg):
    call = client.calls.create(
        twiml = '<Response><Say>'+ msg + '</Say></Response>',
        to = "+17125705082",
        from_ = '+18337723016')
