from pydub import AudioSegment

def convert(in_directory, out_directory):
    audio = AudioSegment.from_file(in_directory, format = 'webm')
    audio.export(out_directory, format = 'wav')
    return out_directory