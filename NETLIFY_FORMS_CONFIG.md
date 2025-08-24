# Configuration Netlify Forms - Envoi d'emails

## État actuel : ✅ Le formulaire est correctement configuré

Le formulaire de contact sur `/contact` est configuré pour fonctionner avec Netlify Forms et enverra des emails une fois déployé.

## Configuration dans le code (✅ Déjà fait)

### 1. Formulaire HTML (`app/contact/page.jsx`)
Le formulaire contient tous les attributs nécessaires :
- `data-netlify="true"` : Active Netlify Forms
- `method="POST"` : Méthode d'envoi
- `name="contact"` : Nom du formulaire (important pour l'identification)
- `action="/contact/success"` : Page de redirection après envoi
- `data-netlify-honeypot="bot-field"` : Protection anti-spam
- Champ caché `<input type="hidden" name="form-name" value="contact" />` : Requis pour les sites statiques

### 2. Build statique
Le formulaire est bien présent dans le HTML statique généré (`out/contact/index.html`), ce qui est nécessaire pour que Netlify le détecte.

## Configuration dans l'interface Netlify (⚠️ À faire après déploiement)

### Étapes pour activer les notifications par email :

1. **Déployer le site** sur Netlify
2. Aller dans **Netlify Dashboard** > Votre site
3. Naviguer vers **Forms** dans le menu de gauche
4. Vous devriez voir le formulaire "contact" détecté automatiquement
5. Cliquer sur **Settings & usage** du formulaire
6. Dans **Form notifications**, cliquer sur **Add notification**
7. Choisir **Email notification**
8. Configurer :
   - **Email to notify** : `stephmyej+FormulaireContactSiteWeb@gmail.com` (comme indiqué dans netlify.toml)
   - **Custom subject** (optionnel) : "Nouveau message depuis AuraOnCanvas.art"
   - Laisser les autres options par défaut

## Comment ça fonctionne

1. **Détection automatique** : Netlify scanne le HTML statique au moment du build et détecte automatiquement les formulaires avec `data-netlify="true"`

2. **Traitement** : Quand un visiteur soumet le formulaire :
   - Les données sont envoyées aux serveurs Netlify
   - Netlify valide et stocke la soumission
   - Si configuré, un email est envoyé à l'adresse spécifiée
   - Le visiteur est redirigé vers `/contact/success`

3. **Stockage** : Toutes les soumissions sont stockées dans le dashboard Netlify (limite de 100/mois sur le plan gratuit)

## Vérification après déploiement

Pour vérifier que tout fonctionne :
1. Aller sur https://www.auraoncanvas.art/contact
2. Remplir et soumettre le formulaire de test
3. Vérifier :
   - La redirection vers la page de succès
   - La réception de l'email
   - La soumission dans Netlify Dashboard > Forms

## Limites du plan gratuit Netlify

- 100 soumissions de formulaire par mois
- Au-delà, les soumissions sont bloquées sauf upgrade du plan

## Dépannage

Si les emails ne sont pas reçus :
1. Vérifier les spams
2. Vérifier dans Netlify Dashboard > Forms que les soumissions sont bien reçues
3. Vérifier la configuration des notifications
4. S'assurer que l'adresse email est correcte

## Protection anti-spam

Le formulaire inclut :
- Un honeypot field (champ caché que seuls les bots remplissent)
- La validation HTML5 (required, type="email")
- Netlify inclut aussi sa propre protection anti-spam