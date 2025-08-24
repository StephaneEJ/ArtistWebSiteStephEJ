'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ContactPage(){
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    
    try {
      // Envoyer le formulaire à Netlify
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok) {
        // Rediriger vers la page de succès
        router.push('/contact/success/');
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-semibold mb-4">Contact</h1>
      <p className="text-neutral-600 dark:text-neutral-300 mb-6">Laisse-moi un message via le formulaire ci-dessous.</p>
      <form 
        name="contact" 
        method="POST" 
        data-netlify="true" 
        netlify-honeypot="bot-field" 
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-[#151924] border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg"
      >
        <input type="hidden" name="form-name" value="contact" />
        <p className="hidden"><label>Ne pas remplir : <input name="bot-field" /></label></p>
        <label className="block">
          <span className="text-sm">Nom</span>
          <input 
            className="w-full border border-neutral-300 dark:border-neutral-700 rounded-md p-2 bg-transparent" 
            type="text" 
            name="name" 
            required 
          />
        </label>
        <label className="block">
          <span className="text-sm">Email</span>
          <input 
            className="w-full border border-neutral-300 dark:border-neutral-700 rounded-md p-2 bg-transparent" 
            type="email" 
            name="email" 
            required 
          />
        </label>
        <label className="block">
          <span className="text-sm">Message</span>
          <textarea 
            className="w-full border border-neutral-300 dark:border-neutral-700 rounded-md p-2 bg-transparent" 
            name="message" 
            rows={6} 
            required 
          />
        </label>
        <button 
          className="btn" 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </form>
    </div>
  );
}
