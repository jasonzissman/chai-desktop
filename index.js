const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");

const subscriptionKey = "YourSubscriptionKey"; // TODO - read from command line arg
const serviceRegion = "YourServiceRegion"; // TODO - read from command line arg, e.g., "westus"
const filename = "YourAudioFile.wav"; // 16000 Hz, Mono

// create the push stream we need for the speech sdk.
const pushStream = sdk.AudioInputStream.createPushStream();

// open the file and push it to the push stream.
fs.createReadStream(filename).on('data', function (arrayBuffer) {
    pushStream.write(arrayBuffer.slice());
}).on('end', function () {
    pushStream.close();
});

// we are done with the setup
console.log("Now recognizing from: " + filename);

// now create the audio-config pointing to our stream and
// the speech config specifying the language.
const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

// setting the recognition language to English.
speechConfig.speechRecognitionLanguage = "en-US";

// create the speech recognizer.
const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

// start the recognizer and wait for a result.
recognizer.recognizeOnceAsync(
    function (result) {
        console.log(result);

        recognizer.close();
        recognizer = undefined;
    },
    function (err) {
        console.trace("err - " + err);

        recognizer.close();
        recognizer = undefined;
    }
);

