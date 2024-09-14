import speech_recognition as sr


def listen(directory):
        r = sr.Recognizer()
        with sr.AudioFile(directory) as source:
            audio = r.record(source)
            text = r.recognize_google(audio)
            return text


"""""
def listen():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Say Something :")
        r.adjust_for_ambient_noise(source)
        audio = r.listen(source)
        try:
            text = r.recognize_google(audio)
            print(text)     
            return text

        except:
            return 'no recognition'
"""
