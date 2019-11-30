# launch-programs
This is an attempt to use speech recognition to launch programs on my desktop. The end-game is to be able to say "Launch Bojack Horseman on Netflix" and have chrome open to Netflix with Bojack Horseman playing.

## Basis of proof-of-concept
We will use Azure Cognitive Services along with Azure's Node/JS SDK to accomplish "speech to text". See this tutorial: https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/quickstart/javascript/node/index.js

## Running the app
Simply enter `npm install` and then `node index.js`

## Simple way to launch applications with Cortana

1. Create a batch file that can perform a task, such as launching chrome at specific URL.
2. Create shortcut to that batch file and place here: C:\ProgramData\Microsoft\Windows\Start Menu\Programs
3. Cortana can now invoke that shortcut

