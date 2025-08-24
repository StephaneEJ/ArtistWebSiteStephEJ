export default function ContactPage(){
  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-semibold mb-4">Contact</h1>
      <p className="text-neutral-600 dark:text-neutral-300 mb-6">Laisse-moi un message via le formulaire ci-dessous.</p>
      
      {/* Netlify Forms - Static version */}
      <form 
        name="contact" 
        method="POST" 
        data-netlify="true" 
        data-netlify-honeypot="bot-field"
        action="/contact/success"
        className="space-y-4 bg-white dark:bg-[#151924] border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg"
      >
        <input type="hidden" name="form-name" value="contact" />
        
        {/* Honeypot field */}
        <p className="hidden">
          <label>Ne pas remplir : <input name="bot-field" /></label>
        </p>
        
        {/* Name field */}
        <label className="block">
          <span className="text-sm">Nom</span>
          <input 
            className="w-full border border-neutral-300 dark:border-neutral-700 rounded-md p-2 bg-transparent" 
            type="text" 
            name="name" 
            required 
          />
        </label>
        
        {/* Email field */}
        <label className="block">
          <span className="text-sm">Email</span>
          <input 
            className="w-full border border-neutral-300 dark:border-neutral-700 rounded-md p-2 bg-transparent" 
            type="email" 
            name="email" 
            required 
          />
        </label>
        
        {/* Message field */}
        <label className="block">
          <span className="text-sm">Message</span>
          <textarea 
            className="w-full border border-neutral-300 dark:border-neutral-700 rounded-md p-2 bg-transparent" 
            name="message" 
            rows={6} 
            required 
          />
        </label>
        
        {/* Submit button */}
        <button 
          className="btn w-full" 
          type="submit"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
