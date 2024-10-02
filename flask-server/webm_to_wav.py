""" from pydub import AudioSegment

AudioSegment.ffmpeg = "/opt/homebrew/bin/ffmpeg"
def convert(in_directory, out_directory):
    audio = AudioSegment.from_file(in_directory, format = 'webm')
    audio.export(out_directory, format = 'wav')
    return out_directory """

import subprocess

def convert(in_directory, out_directory):
    command = ['ffmpeg', '-y', '-i', in_directory, out_directory]
    subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return out_directory
