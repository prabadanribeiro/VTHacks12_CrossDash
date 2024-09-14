import speech_recognition as sr
def listen():
    while True :
        r = sr.Recognizer()
        with sr.Microphone() as source:
            print("Say Something :")
            r.adjust_for_ambient_noise(source)
            audio = r.listen(source)
            try:
                text = r.recognize_google(audio)
                print("You said : {}".format(text))
        
            except:
                print("Could not recognize what you said")
