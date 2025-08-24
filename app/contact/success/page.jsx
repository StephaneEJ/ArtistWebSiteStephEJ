export const metadata = { 
  title: "Merci – Message envoyé",
  description: "Votre message a été envoyé avec succès"
};

export default function Success() { 
  return (
    <div className="py-10 text-center space-y-4">
      <h1 className="text-3xl font-semibold">Merci !</h1>
      <p className="text-neutral-600 dark:text-neutral-300">
        Votre message a bien été envoyé.
      </p>
      <a className="btn" href="/">Retour à l'accueil</a>
    </div>
  ); 
}
