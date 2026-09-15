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

  const [language, setLanguage] = useState(languages[1])
  const [text, setText] = useState('')
  const [response, setResponse] = useState('')
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [recognition, setRecognition] = useState(null)


  // ==========================================
  // VOICE INPUT
  // ==========================================

  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setRecognition(null)
      return
    }

    const speechRecognition = new SpeechRecognition()

    speechRecognition.continuous = false
    speechRecognition.interimResults = false
    speechRecognition.lang = language.code

    speechRecognition.onstart = () => {
      setListening(true)
    }

    speechRecognition.onresult = (event) => {

      const result =
        event.results[0][0].transcript

      setText(result)
      setListening(false)

      // Voice question → Gemini automatically
      askAI(result)
    }

    speechRecognition.onerror = (event) => {

      console.error(
        'VOICE ERROR:',
        event.error
      )

      setListening(false)

      if (event.error === 'not-allowed') {
        alert(
          'Please allow microphone permission in your browser.'
        )
      } else if (event.error === 'network') {
        alert(
          'Voice recognition service is unavailable. You can type your question instead.'
        )
      }
    }

    speechRecognition.onend = () => {
      setListening(false)
    }

    setRecognition(speechRecognition)

    return () => {
      try {
        speechRecognition.stop()
      } catch (error) {}
    }

  }, [language])


  // ==========================================
  // START LISTENING
  // ==========================================

  const startListening = () => {

    if (!recognition) {
      alert(
        'Voice recognition is not supported. Please use Chrome or Edge.'
      )
      return
    }

    if (listening) return

    setText('')
    setResponse('')

    try {
      recognition.start()
    } catch (error) {
      console.error('VOICE START ERROR:', error)
      setListening(false)
    }
  }


  // ==========================================
  // STOP LISTENING
  // ==========================================

  const stopListening = () => {

    if (recognition) {
      try {
        recognition.stop()
      } catch (error) {}
    }

    setListening(false)
  }


  // ==========================================
  // FIND VOICE FOR LANGUAGE
  // ==========================================

  const getVoiceForLanguage = () => {

    const voices =
      window.speechSynthesis.getVoices()
      console.log(voices)

    if (!voices.length) {
      return null
    }

    // Exact language
    let voice = voices.find(
      (item) =>
        item.lang.toLowerCase() ===
        language.code.toLowerCase()
    )

    if (voice) {
      return voice
    }

    // Same language prefix
    const prefix =
      language.code
        .split('-')[0]
        .toLowerCase()

    voice = voices.find(
      (item) =>
        item.lang
          .toLowerCase()
          .startsWith(prefix)
    )

    return voice || null
  }


  // ==========================================
  // TEXT TO SPEECH
  // ==========================================

  const speak = (message) => {

    if (!message) return

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

    const voice =
      getVoiceForLanguage()

    if (voice) {
      speech.voice = voice
    }

    speech.onstart = () => {
      setSpeaking(true)
    }

    speech.onend = () => {
      setSpeaking(false)
    }

    speech.onerror = (event) => {
      console.error(
        'SPEECH ERROR:',
        event.error
      )
      setSpeaking(false)
    }

    window.speechSynthesis.speak(speech)
  }


  // ==========================================
  // STOP SPEAKING
  // ==========================================

  const stopSpeaking = () => {

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }

    setSpeaking(false)
  }


  // ==========================================
  // FALLBACK RESPONSE
  // ==========================================

  const getFallbackResponse = () => {

    if (language.name === 'தமிழ்') {

      return `உங்களுக்கு உடம்பு சரியில்லையெனில், முதலில் ஓய்வு எடுத்துக் கொண்டு போதுமான தண்ணீர் குடிக்கவும்.

காய்ச்சல், தொடர்ந்து வாந்தி, கடுமையான வலி அல்லது உடல்நிலை மோசமாக இருந்தால் அருகிலுள்ள மருத்துவரை அணுகவும்.

மூச்சுத்திணறல், நெஞ்சுவலி, மயக்கம் அல்லது கடுமையான இரத்தப்போக்கு இருந்தால் உடனடியாக அவசர மருத்துவ உதவியை நாடுங்கள்.`
    }

    if (language.name === 'हिन्दी') {

      return `अगर आपकी तबीयत ठीक नहीं है, तो आराम करें और पर्याप्त पानी पिएं।

अगर बुखार, लगातार उल्टी, तेज दर्द या हालत बिगड़ रही है, तो नजदीकी डॉक्टर से सलाह लें।

अगर सांस लेने में परेशानी, सीने में दर्द, बेहोशी या गंभीर रक्तस्राव हो, तो तुरंत आपातकालीन चिकित्सा सहायता लें।`
    }

    return `If you are feeling unwell, take adequate rest and drink enough water.

If you have fever, repeated vomiting, severe pain, or your condition is getting worse, consult a nearby doctor.

If you have difficulty breathing, chest pain, unconsciousness, or severe bleeding, seek immediate emergency medical care.`
  }


  // ==========================================
  // GEMINI AI
  // ==========================================

  const askAI = async (question) => {

    if (!question || !question.trim()) {

      alert(
        language.name === 'தமிழ்'
          ? 'தயவுசெய்து உங்கள் கேள்வியை பேசவும் அல்லது type செய்யவும்.'
          : language.name === 'हिन्दी'
          ? 'कृपया अपना सवाल बोलें या टाइप करें।'
          : 'Please speak or type your question.'
      )

      return
    }

    setLoading(true)
    setResponse('')

    try {

      const res = await fetch(
        'http://localhost:5000/api/voice-chat',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            message: question,
            language: language.name
          })
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.error || 'AI request failed'
        )
      }

      const aiReply =
        data.reply || getFallbackResponse()

      setResponse(aiReply)

      // Automatically speak
      speak(aiReply)

    } catch (error) {

      console.error(
        'VOICE AI ERROR:',
        error
      )

      // No "Sorry, I could not connect..."
      const fallback =
        getFallbackResponse()

      setResponse(fallback)

      speak(fallback)

    } finally {

      setLoading(false)
    }
  }


  // ==========================================
  // TEXT SUBMIT
  // ==========================================

  const generateResponse = () => {

    if (!text.trim()) {

      alert(
        language.name === 'தமிழ்'
          ? 'தயவுசெய்து உங்கள் கேள்வியை type செய்யவும் அல்லது பேசவும்.'
          : language.name === 'हिन्दी'
          ? 'कृपया अपना सवाल टाइप करें या बोलें।'
          : 'Please type or speak your question.'
      )

      return
    }

    askAI(text)
  }


  // ==========================================
  // QUICK QUESTIONS
  // ==========================================

  const quickQuestion = (question) => {

    setText(question)
    askAI(question)
  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

      {/* Header */}

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


        {/* Hero */}

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


        {/* Language */}

        <section className="bg-white rounded-3xl shadow-sm border border-blue-100 p-7 mt-7">

          <h2 className="text-xl font-bold text-gray-800">
            Choose Your Language
          </h2>

          <div className="grid grid-cols-3 gap-3 mt-5">

            {languages.map((item) => (

              <button
                key={item.code}
                onClick={() => {

                  stopSpeaking()
                  setLanguage(item)
                  setResponse('')
                  setText('')

                }}

                className={`py-4 rounded-xl font-bold border ${
                  language.code === item.code
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
              >

                {item.name}

              </button>

            ))}

          </div>

        </section>


        {/* Voice Input */}

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


          {/* Question */}

          <div className="mt-7">

            <label className="text-sm font-semibold text-gray-600">

              Your Question

            </label>


            <textarea

              value={text}

              onChange={(e) =>
                setText(e.target.value)
              }

              placeholder={
                language.name === 'தமிழ்'
                  ? 'உங்கள் கேள்வியை type அல்லது பேசவும்...'
                  : language.name === 'हिन्दी'
                  ? 'अपना सवाल टाइप या बोलें...'
                  : 'Type or speak your healthcare question...'
              }

              rows="4"

              className="w-full border border-gray-200 rounded-2xl px-5 py-4 mt-2 outline-none focus:ring-2 focus:ring-blue-300"

            />


            <button

              onClick={generateResponse}

              disabled={loading}

              className="w-full bg-green-600 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold mt-4 flex items-center justify-center gap-2"

            >

              <MessageCircle size={20} />

              {loading
                ? 'Getting AI Guidance...'
                : 'Get Healthcare Guidance'}

            </button>

          </div>

        </section>


        {/* Quick Questions */}

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


            {/* Fever */}

            <button

              onClick={() =>
                quickQuestion(
                  language.name === 'தமிழ்'
                    ? 'காய்ச்சல் இருந்தால் என்ன செய்ய வேண்டும்?'
                    : language.name === 'हिन्दी'
                    ? 'बुखार होने पर क्या करना चाहिए?'
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


            {/* Find Doctor */}

            <button

              onClick={() =>
                quickQuestion(
                  language.name === 'தமிழ்'
                    ? 'அருகிலுள்ள மருத்துவரை எப்படி கண்டுபிடிப்பது?'
                    : language.name === 'हिन्दी'
                    ? 'मैं अपने पास डॉक्टर को कैसे ढूंढ सकता हूं?'
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


            {/* Emergency */}

            <button

              onClick={() =>
                quickQuestion(
                  language.name === 'தமிழ்'
                    ? 'அவசரநிலையில் என்ன செய்ய வேண்டும்?'
                    : language.name === 'हिन्दी'
                    ? 'आपातकालीन स्थिति में क्या करना चाहिए?'
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


        {/* AI Response */}

        {response && (

          <section className="bg-green-50 border border-green-200 rounded-3xl p-7 mt-6">

            <div className="flex items-start gap-4">

              <div className="bg-green-100 text-green-600 p-3 rounded-xl">

                <Volume2 size={25} />

              </div>


              <div className="flex-1">

                <h2 className="font-bold text-green-800">
                  CareMitra AI Guidance
                </h2>


                <p className="text-green-700 mt-3 leading-7 whitespace-pre-line">

                  {response}

                </p>


                {!loading && (

                  <div className="flex gap-3 mt-4 flex-wrap">

                    <button

                      onClick={() =>
                        speak(response)
                      }

                      className="bg-green-600 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2"

                    >

                      <Volume2 size={18} />

                      Hear Response

                    </button>


                    {speaking && (

                      <button

                        onClick={stopSpeaking}

                        className="bg-red-600 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2"

                      >

                        <Square size={18} />

                        Stop Speaking

                      </button>

                    )}

                  </div>

                )}

              </div>

            </div>

          </section>

        )}


        {/* Important Notice */}

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