from twilio.rest import Client

msg = 'ballsss i love them so muchhh'

account_sid = 'ACefe208e509359f5a05c18b9cdd6b2850'
auth_token = '661d68b24c4707bb8e6e1420efe9559f'
client = Client(account_sid, auth_token)
balance_data = client.api.v2010.balance.fetch()

call = client.calls.create(
    twiml = '<Response><Say>'+ msg + '</Say></Response>',
    to = "+17125705082",
    from_ = '+18337723016')