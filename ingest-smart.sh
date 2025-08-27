#!/bin/bash

# Script intelligent pour n'ingérer que les images modifiées
# Utilise les checksums MD5 pour détecter les changements

CANVAS_DIR="assets/raw/canvas"
MOCKUPS_DIR="assets/raw/mockups"
CHECKSUM_FILE=".image_checksums"
TEMP_DIR="assets/raw/temp_process"

# Créer les dossiers si nécessaire
mkdir -p "$TEMP_DIR/canvas"
mkdir -p "$TEMP_DIR/mockups"
mkdir -p "$CANVAS_DIR"
mkdir -p "$MOCKUPS_DIR"

# Fonction pour calculer le checksum d'un fichier
get_checksum() {
    md5sum "$1" 2>/dev/null | cut -d' ' -f1
}

# Charger les checksums précédents
declare -A OLD_CHECKSUMS
if [ -f "$CHECKSUM_FILE" ]; then
    while IFS='=' read -r file checksum; do
        OLD_CHECKSUMS["$file"]="$checksum"
    done < "$CHECKSUM_FILE"
fi

# Calculer les nouveaux checksums et identifier les changements
declare -A NEW_CHECKSUMS
NEW_COUNT=0
MODIFIED_COUNT=0

echo "🔍 Analyse des images..."

# Analyser les images canvas
for img in "$CANVAS_DIR"/*.{jpg,jpeg,png} 2>/dev/null; do
    [ -f "$img" ] || continue
    
    checksum=$(get_checksum "$img")
    filename=$(basename "$img")
    NEW_CHECKSUMS["canvas/$filename"]="$checksum"
    
    if [ -z "${OLD_CHECKSUMS[canvas/$filename]}" ]; then
        echo "  ✨ Nouvelle: $filename"
        cp "$img" "$TEMP_DIR/canvas/"
        ((NEW_COUNT++))
    elif [ "${OLD_CHECKSUMS[canvas/$filename]}" != "$checksum" ]; then
        echo "  📝 Modifiée: $filename"
        cp "$img" "$TEMP_DIR/canvas/"
        ((MODIFIED_COUNT++))
    fi
done

# Analyser les mockups
for img in "$MOCKUPS_DIR"/*.{jpg,jpeg,png} 2>/dev/null; do
    [ -f "$img" ] || continue
    
    checksum=$(get_checksum "$img")
    filename=$(basename "$img")
    NEW_CHECKSUMS["mockups/$filename"]="$checksum"
    
    if [ -z "${OLD_CHECKSUMS[mockups/$filename]}" ]; then
        echo "  ✨ Nouvelle: $filename"
        cp "$img" "$TEMP_DIR/mockups/"
        ((NEW_COUNT++))
    elif [ "${OLD_CHECKSUMS[mockups/$filename]}" != "$checksum" ]; then
        echo "  📝 Modifiée: $filename"
        cp "$img" "$TEMP_DIR/mockups/"
        ((MODIFIED_COUNT++))
    fi
done

TOTAL_CHANGES=$((NEW_COUNT + MODIFIED_COUNT))

if [ "$TOTAL_CHANGES" -eq 0 ]; then
    echo "✅ Aucun changement détecté - les images optimisées sont à jour"
    rm -rf "$TEMP_DIR"
    exit 0
fi

echo ""
echo "📊 Résumé: $NEW_COUNT nouvelles, $MODIFIED_COUNT modifiées"
echo ""

# Sauvegarder les images actuelles
BACKUP_DIR="assets/raw/.backup_$(date +%s)"
mkdir -p "$BACKUP_DIR"
cp -r "$CANVAS_DIR" "$BACKUP_DIR/" 2>/dev/null || true
cp -r "$MOCKUPS_DIR" "$BACKUP_DIR/" 2>/dev/null || true

# Remplacer temporairement par seulement les images à traiter
mv "$CANVAS_DIR" "$CANVAS_DIR.old"
mv "$MOCKUPS_DIR" "$MOCKUPS_DIR.old"
mv "$TEMP_DIR/canvas" "$CANVAS_DIR"
mv "$TEMP_DIR/mockups" "$MOCKUPS_DIR"

# Exécuter l'ingestion
echo "🚀 Ingestion des images modifiées..."
npm run ingest

# Restaurer toutes les images
rm -rf "$CANVAS_DIR"
rm -rf "$MOCKUPS_DIR"
mv "$CANVAS_DIR.old" "$CANVAS_DIR"
mv "$MOCKUPS_DIR.old" "$MOCKUPS_DIR"

# Sauvegarder les nouveaux checksums
> "$CHECKSUM_FILE"
for key in "${!NEW_CHECKSUMS[@]}"; do
    echo "$key=${NEW_CHECKSUMS[$key]}" >> "$CHECKSUM_FILE"
done

# Nettoyer
rm -rf "$TEMP_DIR"
rm -rf "$BACKUP_DIR"

echo "✨ Ingestion terminée! ($TOTAL_CHANGES images traitées)"