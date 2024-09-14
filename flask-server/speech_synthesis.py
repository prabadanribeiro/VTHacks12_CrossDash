import pyttsx3
engine = pyttsx3.init()

voices = engine.getProperty('voices')

engine.setProperty('voices', 'com.apple.eloquence.en-US.Rocko')
engine.say('Hello!')
engine.runAndWait()

