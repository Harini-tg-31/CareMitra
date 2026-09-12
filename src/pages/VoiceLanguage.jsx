import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Mic,
  Volume2,
  Languages,
  HeartPulse,
  MessageCircle,
  Square
} from 'lucide-react'

function VoiceLanguage({ onBack }) {
  const languages = [
    {
      name: 'English',
      code: 'en-IN'
    },
    {
      name: 'தமிழ்',
      code: 'ta-IN'
    },
    {
      name: 'हिन्दी',
      code: 'hi-IN'
    }
  ]

  const [language, setLanguage] = useState(
    languages[1]
  )

  const [text, setText] = useState('')
  const [response, setResponse] = useState('')
  const [listening, setListening] = useState(false)

  const [recognition, setRecognition] =
    useState(null)

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      return
    }

    const speechRecognition =
      new SpeechRecognition()

    speechRecognition.continuous = false
    speechRecognition.interimResults = false
    speechRecognition.lang = language.code

    speechRecognition.onresult = (event) => {
      const result =
        event.results[0][0].transcript

      setText(result)
      setListening(false)
    }

    speechRecognition.onerror = () => {
      setListening(false)
      alert(
        'Voice recognition could not start. Please check microphone permission.'
      )
    }

    speechRecognition.onend = () => {
      setListening(false)
    }

    setRecognition(speechRecognition)
  }, [language])

  const startListening = () => {
    if (!recognition) {
      alert(
        'Voice recognition is not supported in this browser. Please use Chrome or Edge.'
      )
      return
    }

    setListening(true)
    recognition.start()
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
    }

    setListening(false)
  }

  const speak = (message) => {
    if (!window.speechSynthesis) {
      alert(
        'Speech output is not supported in this browser.'
      )
      return
    }

    window.speechSynthesis.cancel()

    const speech =
      new SpeechSynthesisUtterance(message)

    speech.lang = language.code
    speech.rate = 0.9
    speech.pitch = 1

    window.speechSynthesis.speak(speech)
  }

  const generateResponse = () => {
    if (!text.trim()) {
      alert(
        'Please type or speak your question.'
      )
      return
    }

    const question =
      text.toLowerCase()

    let answer = ''

    if (
      question.includes('fever') ||
      question.includes('காய்ச்சல்')
    ) {
      if (language.name === 'தமிழ்') {
        answer =
          'காய்ச்சல் இருந்தால் போதுமான தண்ணீர் குடித்து ஓய்வு எடுக்கவும். அதிக காய்ச்சல் அல்லது நீண்ட நேரம் காய்ச்சல் இருந்தால் மருத்துவரை அணுகவும்.'
      } else if (
        language.name === 'हिन्दी'
      ) {
        answer =
          'बुखार होने पर पर्याप्त पानी पिएं और आराम करें। तेज या लगातार बुखार होने पर डॉक्टर से संपर्क करें।'
      } else {
        answer =
          'If you have fever, drink enough water and take adequate rest. If the fever is high or continues, consult a doctor.'
      }
    } else if (
      question.includes('cough') ||
      question.includes('இருமல்')
    ) {
      if (language.name === 'தமிழ்') {
        answer =
          'இருமல் இருந்தால் வெதுவெதுப்பான தண்ணீர் குடித்து ஓய்வு எடுக்கவும். மூச்சுத்திணறல் இருந்தால் உடனடியாக மருத்துவ உதவி பெறவும்.'
      } else if (
        language.name === 'हिन्दी'
      ) {
        answer =
          'खांसी होने पर गुनगुना पानी पिएं और आराम करें। सांस लेने में परेशानी हो तो तुरंत चिकित्सा सहायता लें।'
      } else {
        answer =
          'For cough, drink warm fluids and take rest. If you have difficulty breathing, seek medical help immediately.'
      }
    } else if (
      question.includes('doctor') ||
      question.includes('மருத்துவர்')
    ) {
      if (language.name === 'தமிழ்') {
        answer =
          'SevaCare மூலம் அருகிலுள்ள மருத்துவர், அரசு மருத்துவமனை அல்லது ஆரம்ப சுகாதார நிலையத்தை கண்டுபிடிக்கலாம்.'
      } else if (
        language.name === 'हिन्दी'
      ) {
        answer =
          'SevaCare से आप नजदीकी डॉक्टर, सरकारी अस्पताल या प्राथमिक स्वास्थ्य केंद्र खोज सकते हैं।'
      } else {
        answer =
          'You can use SevaCare to find a nearby doctor, government hospital or primary health centre.'
      }
    } else if (
      question.includes('emergency') ||
      question.includes('அவசரம்') ||
      question.includes('chest') ||
      question.includes('மார்பு')
    ) {
      if (language.name === 'தமிழ்') {
        answer =
          'இது அவசரநிலையாக இருக்கலாம். உடனடியாக Emergency SOS ஐ பயன்படுத்தி மருத்துவ உதவியை பெறவும்.'
      } else if (
        language.name === 'हिन्दी'
      ) {
        answer =
          'यह आपातकाल हो सकता है। तुरंत Emergency SOS का उपयोग करके चिकित्सा सहायता प्राप्त करें।'
      } else {
        answer =
          'This may be an emergency. Use Emergency SOS immediately and seek medical assistance.'
      }
    } else {
      if (language.name === 'தமிழ்') {
        answer =
          'உங்கள் உடல்நிலை குறித்து கவலை இருந்தால் அருகிலுள்ள சுகாதார பணியாளர் அல்லது மருத்துவரை அணுகவும்.'
      } else if (
        language.name === 'हिन्दी'
      ) {
        answer =
          'यदि आपको अपने स्वास्थ्य को लेकर चिंता है, तो नजदीकी स्वास्थ्य कार्यकर्ता या डॉक्टर से संपर्क करें।'
      } else {
        answer =
          'If you are concerned about your health, please contact a nearby healthcare worker or doctor.'
      }
    }

    setResponse(answer)
    speak(answer)
  }

  const quickQuestion = (question) => {
    setText(question)

    setTimeout(() => {
      const oldText = text
      setText(question)

      const event = {
        preventDefault: () => {}
      }

      generateQuickResponse(question)
    }, 50)
  }

  const generateQuickResponse = (
    question
  ) => {
    const previousText = text
    setText(question)

    let answer = ''

    if (
      question.includes('fever') ||
      question.includes('காய்ச்சல்')
    ) {
      answer =
        language.name === 'தமிழ்'
          ? 'காய்ச்சல் இருந்தால் தண்ணீர் குடித்து ஓய்வு எடுக்கவும். அதிக காய்ச்சல் இருந்தால் மருத்துவரை அணுகவும்.'
          : 'If you have fever, drink enough water and rest. Consult a doctor if the fever is high.'
    } else if (
      question.includes('doctor') ||
      question.includes('மருத்துவர்')
    ) {
      answer =
        language.name === 'தமிழ்'
          ? 'அருகிலுள்ள மருத்துவர் அல்லது அரசு மருத்துவமனையை SevaCare மூலம் கண்டுபிடிக்கலாம்.'
          : 'You can find a nearby doctor or government hospital through SevaCare.'
    } else {
      answer =
        language.name === 'தமிழ்'
          ? 'உடல்நிலை மோசமாக இருந்தால் உடனடியாக மருத்துவ உதவியை பெறவும்.'
          : 'If your condition becomes serious, seek medical help immediately.'
    }

    setResponse(answer)
    speak(answer)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <section className="bg-gradient-to-r from-blue-700 to-cyan-600 rounded-3xl p-8 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl">
              <Languages size={36} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Voice & Local Language
              </h1>

              <p className="text-blue-100 mt-2">
                Access healthcare using your preferred language and voice.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-blue-100 p-7 mt-7">
          <h2 className="text-xl font-bold text-gray-800">
            Choose Your Language
          </h2>

          <div className="grid grid-cols-3 gap-3 mt-5">
            {languages.map(
              (item) => (
                <button
                  key={item.code}
                  onClick={() =>
                    setLanguage(item)
                  }
                  className={`py-4 rounded-xl font-bold border ${
                    language.code ===
                    item.code
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200'
                  }`}
                >
                  {item.name}
                </button>
              )
            )}
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-blue-100 p-7 mt-6">
          <div className="text-center">
            <div className="w-28 h-28 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              {listening ? (
                <div className="animate-pulse">
                  <Mic size={50} />
                </div>
              ) : (
                <Mic size={50} />
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mt-5">
              {listening
                ? 'Listening...'
                : 'Speak Your Question'}
            </h2>

            <p className="text-gray-500 mt-2">
              Speak in {language.name}
            </p>

            <button
              onClick={
                listening
                  ? stopListening
                  : startListening
              }
              className={`mt-6 px-7 py-4 rounded-xl text-white font-bold flex items-center gap-2 mx-auto ${
                listening
                  ? 'bg-red-600'
                  : 'bg-blue-600'
              }`}
            >
              {listening ? (
                <>
                  <Square size={18} />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic size={18} />
                  Start Voice Input
                </>
              )}
            </button>
          </div>

          <div className="mt-7">
            <label className="text-sm font-semibold text-gray-600">
              Your Question
            </label>

            <textarea
              value={text}
              onChange={(e) =>
                setText(e.target.value)
              }
              placeholder="Type or speak your healthcare question..."
              rows="4"
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 mt-2 outline-none focus:ring-2 focus:ring-blue-300"
            />

            <button
              onClick={generateResponse}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold mt-4 flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Get Healthcare Guidance
            </button>
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-blue-100 p-7 mt-6">
          <div className="flex items-center gap-3">
            <HeartPulse
              className="text-red-500"
              size={27}
            />

            <h2 className="text-xl font-bold text-gray-800">
              Quick Questions
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-5">
            <button
              onClick={() =>
                quickQuestion(
                  language.name ===
                    'தமிழ்'
                    ? 'காய்ச்சல் இருந்தால் என்ன செய்ய வேண்டும்?'
                    : 'What should I do for fever?'
                )
              }
              className="bg-orange-50 border border-orange-100 rounded-2xl p-5 text-left"
            >
              <p className="font-bold text-orange-800">
                Fever
              </p>

              <p className="text-sm text-orange-700 mt-1">
                Get basic guidance
              </p>
            </button>

            <button
              onClick={() =>
                quickQuestion(
                  language.name ===
                    'தமிழ்'
                    ? 'அருகிலுள்ள மருத்துவரை எப்படி கண்டுபிடிப்பது?'
                    : 'How can I find a doctor?'
                )
              }
              className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-left"
            >
              <p className="font-bold text-blue-800">
                Find Doctor
              </p>

              <p className="text-sm text-blue-700 mt-1">
                Find healthcare nearby
              </p>
            </button>

            <button
              onClick={() =>
                quickQuestion(
                  language.name ===
                    'தமிழ்'
                    ? 'அவசரநிலையில் என்ன செய்ய வேண்டும்?'
                    : 'What should I do in an emergency?'
                )
              }
              className="bg-red-50 border border-red-100 rounded-2xl p-5 text-left"
            >
              <p className="font-bold text-red-800">
                Emergency
              </p>

              <p className="text-sm text-red-700 mt-1">
                Get emergency guidance
              </p>
            </button>
          </div>
        </section>

        {response && (
          <section className="bg-green-50 border border-green-200 rounded-3xl p-7 mt-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                <Volume2 size={25} />
              </div>

              <div className="flex-1">
                <h2 className="font-bold text-green-800">
                  SevaCare Guidance
                </h2>

                <p className="text-green-700 mt-3 leading-7">
                  {response}
                </p>

                <button
                  onClick={() =>
                    speak(response)
                  }
                  className="mt-4 bg-green-600 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
                >
                  <Volume2 size={18} />
                  Hear Response
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mt-6">
          <p className="text-sm text-yellow-800">
            <b>Important:</b> Voice guidance provides basic information
            only. It does not replace diagnosis or treatment by a qualified
            healthcare professional. For emergencies, seek immediate medical
            assistance.
          </p>
        </section>
      </main>
    </div>
  )
}

export default VoiceLanguage