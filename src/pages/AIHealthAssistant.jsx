import { useState } from 'react'
import {
  ArrowLeft,
  Bot,
  Send,
  Volume2,
  User,
  LoaderCircle
} from 'lucide-react'

function AIHealthAssistant({ onBack }) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'வணக்கம்! நான் CareMitra AI Health Assistant. உங்கள் உடல்நலம் தொடர்பான கேள்விகளை கேட்கலாம்.'
    }
  ])

  const speak = (text) => {
    if (!window.speechSynthesis) {
      return
    }

    window.speechSynthesis.cancel()

    const speech = new SpeechSynthesisUtterance(text)

    speech.lang = 'ta-IN'
    speech.rate = 0.9
    speech.pitch = 1

    window.speechSynthesis.speak(speech)
  }

  const sendMessage = async () => {
    if (!message.trim() || loading) {
      return
    }

    const userMessage = message.trim()

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: userMessage
      }
    ])

    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:5000/api/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: userMessage,
            language: 'Tamil'
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'AI request failed'
        )
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: data.reply
        }
      ])

    } catch (error) {
      console.error('AI ERROR:', error)

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'மன்னிக்கவும். AI சேவையுடன் இணைக்க முடியவில்லை. மீண்டும் முயற்சி செய்யவும்.'
        }
      ])

    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

      {/* Header */}

      <header className="bg-white border-b border-blue-100 shadow-sm">

        <div className="max-w-5xl mx-auto px-6 py-4">

          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

        </div>

      </header>


      <main className="max-w-4xl mx-auto px-6 py-8">

        {/* Title */}

        <section className="bg-gradient-to-r from-blue-700 to-cyan-600 rounded-3xl p-7 text-white shadow-xl">

          <div className="flex items-center gap-4">

            <div className="bg-white/20 p-4 rounded-2xl">
              <Bot size={38} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                AI Health Assistant
              </h1>

              <p className="text-blue-100 mt-2">
                Ask healthcare questions and get AI-powered guidance.
              </p>
            </div>

          </div>

        </section>


        {/* Chat Box */}

        <section className="bg-white rounded-3xl shadow-sm border border-blue-100 mt-6 overflow-hidden">

          {/* Chat Header */}

          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">

            <div className="bg-green-100 text-green-600 p-3 rounded-xl">
              <Bot size={25} />
            </div>

            <div>
              <h2 className="font-bold text-gray-800">
                CareMitra AI
              </h2>

              <p className="text-sm text-green-600">
                ● Online
              </p>
            </div>

          </div>


          {/* Messages */}

          <div className="h-[450px] overflow-y-auto p-6 space-y-5">

            {messages.map((item, index) => (

              <div
                key={index}
                className={`flex gap-3 ${
                  item.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >

                {item.role === 'ai' && (

                  <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <Bot size={20} />
                  </div>

                )}


                <div
                  className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                    item.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >

                  <p className="leading-7 whitespace-pre-wrap">
                    {item.text}
                  </p>


                  {item.role === 'ai' && (

                    <button
                      onClick={() => speak(item.text)}
                      className="mt-3 text-blue-600 flex items-center gap-2 text-sm font-semibold"
                    >
                      <Volume2 size={17} />
                      Hear Response
                    </button>

                  )}

                </div>


                {item.role === 'user' && (

                  <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0">
                    <User size={18} />
                  </div>

                )}

              </div>

            ))}


            {/* Loading */}

            {loading && (

              <div className="flex gap-3 items-center">

                <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <Bot size={20} />
                </div>

                <div className="bg-gray-100 rounded-2xl px-5 py-3 flex items-center gap-2 text-gray-500">

                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />

                  CareMitra is thinking...

                </div>

              </div>

            )}

          </div>


          {/* Input */}

          <div className="border-t border-gray-100 p-5">

            <div className="flex gap-3 items-end">

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Type your health question..."
                rows="2"
                className="flex-1 border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              />


              <button
                onClick={sendMessage}
                disabled={
                  !message.trim() || loading
                }
                className="bg-blue-600 disabled:bg-gray-300 text-white p-4 rounded-2xl"
              >

                <Send size={22} />

              </button>

            </div>

            <p className="text-xs text-gray-400 mt-3">
              Press Enter to send • Shift + Enter for a new line
            </p>

          </div>

        </section>


        {/* Safety Notice */}

        <section className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mt-6">

          <p className="text-sm text-yellow-800">

            <b>Important:</b> CareMitra AI provides general
            healthcare information and does not replace a
            qualified healthcare professional. For emergencies,
            seek immediate medical assistance.

          </p>

        </section>

      </main>

    </div>
  )
}

export default AIHealthAssistant