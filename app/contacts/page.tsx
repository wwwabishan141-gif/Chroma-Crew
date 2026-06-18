"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { PageHeader } from "@/components/page-header"
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function ContactsPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const waLink = `https://wa.me/94751297637?text=${encodeURIComponent(
        `Hi ORBYT, I'm ${formData.name}. \nSubject: ${formData.subject}\nMessage: ${formData.message}`
      )}`

      toast.success("Message sent successfully!")
      setSubmitted(true)

      setTimeout(() => {
        window.open(waLink, "_blank")
      }, 1500)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error"
      toast.error("Failed to send message: " + message)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-background flex-1">
        <Header currentPage="contacts" />
        <div className="page-container max-w-lg text-center">
          <div className="empty-state space-y-5">
            <div className="w-16 h-16 bg-red-600/15 rounded-full flex items-center justify-center mx-auto border border-red-600/30">
              <Send className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">Message Received</h1>
            <p className="text-white/60">Thank you for reaching out. We&apos;ll get back to you soon.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="btn-secondary text-sm"
              >
                Send Another
              </button>
              <Link href="/" className="btn-primary text-sm">
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const contactItems = [
    {
      icon: Mail,
      title: "Email",
      value: "support@orbyt.lk",
      href: "mailto:support@orbyt.lk",
    },
    {
      icon: Phone,
      title: "Phone / WhatsApp",
      value: "075 129 7637",
      href: "https://wa.me/94751297637",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "115 2nd Lane, Mt Lavinia, Colombo",
      href: null,
    },
  ]

  return (
    <main className="min-h-screen bg-background flex-1">
      <Header currentPage="contacts" />
      <div className="page-container max-w-5xl">
        <PageHeader
          badge="Get In Touch"
          title="Contact Us"
          description="Questions about an order, custom design, or shipping? We're here to help."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {contactItems.map((item) => (
              <div key={item.title} className="page-card p-5 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-red-600/15 border border-red-600/25 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">{item.title}</h3>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-white/65 text-sm mt-1 hover:text-red-400 transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-white/65 text-sm mt-1">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            <a
              href="https://wa.me/94751297637"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-red-600/30 bg-red-600/10 text-red-400 font-semibold text-sm hover:bg-red-600/20 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>

          <div className="lg:col-span-3 page-card p-6 md:p-8 border-red-600/15">
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="form-label-orbyt">Your Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-orbyt"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="form-label-orbyt">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-orbyt"
                  placeholder="you@email.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="form-label-orbyt">Subject</label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input-orbyt"
                  placeholder="How can we help?"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="form-label-orbyt">Message</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="input-orbyt resize-none"
                  placeholder="Your message..."
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
