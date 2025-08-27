#!/bin/bash

# Script pour n'ingérer que les nouvelles images
# Utilise les timestamps pour détecter les nouvelles images

CANVAS_DIR="assets/raw/canvas"
MOCKUPS_DIR="assets/raw/mockups"
TEMP_DIR="assets/raw/temp_new"
BACKUP_DIR="assets/raw/backup"

# Créer les dossiers si nécessaire
mkdir -p "$TEMP_DIR/canvas"
mkdir -p "$TEMP_DIR/mockups"
mkdir -p "$BACKUP_DIR/canvas"
mkdir -p "$BACKUP_DIR/mockups"

# Fichier de timestamp pour tracker la dernière ingestion
TIMESTAMP_FILE=".last_ingest_timestamp"

# Si le fichier timestamp existe, trouver les nouvelles images
if [ -f "$TIMESTAMP_FILE" ]; then
    echo "🔍 Recherche des nouvelles images depuis la dernière ingestion..."
    
    # Trouver et copier les nouvelles images canvas
    find "$CANVAS_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -newer "$TIMESTAMP_FILE" -exec cp {} "$TEMP_DIR/canvas/" \;
    
    # Trouver et copier les nouvelles images mockups
    find "$MOCKUPS_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -newer "$TIMESTAMP_FILE" -exec cp {} "$TEMP_DIR/mockups/" \;
    
    # Compter les nouvelles images
    NEW_CANVAS=$(find "$TEMP_DIR/canvas" -type f | wc -l)
    NEW_MOCKUPS=$(find "$TEMP_DIR/mockups" -type f | wc -l)
    
    if [ "$NEW_CANVAS" -eq 0 ] && [ "$NEW_MOCKUPS" -eq 0 ]; then
        echo "✅ Aucune nouvelle image à traiter"
        rm -rf "$TEMP_DIR"
        exit 0
    fi
    
    echo "📸 Nouvelles images trouvées: $NEW_CANVAS canvas, $NEW_MOCKUPS mockups"
    
    # Backup des images originales
    echo "💾 Sauvegarde des images originales..."
    cp -r "$CANVAS_DIR"/* "$BACKUP_DIR/canvas/" 2>/dev/null || true
    cp -r "$MOCKUPS_DIR"/* "$BACKUP_DIR/mockups/" 2>/dev/null || true
    
    # Remplacer temporairement par seulement les nouvelles images
    rm -rf "$CANVAS_DIR"/*
    rm -rf "$MOCKUPS_DIR"/*
    cp -r "$TEMP_DIR/canvas"/* "$CANVAS_DIR/" 2>/dev/null || true
    cp -r "$TEMP_DIR/mockups"/* "$MOCKUPS_DIR/" 2>/dev/null || true
    
    # Exécuter l'ingestion
    echo "🚀 Ingestion des nouvelles images..."
    npm run ingest
    
    # Restaurer toutes les images
    echo "♻️ Restauration de toutes les images..."
    cp -r "$BACKUP_DIR/canvas"/* "$CANVAS_DIR/" 2>/dev/null || true
    cp -r "$BACKUP_DIR/mockups"/* "$MOCKUPS_DIR/" 2>/dev/null || true
    
else
    echo "🆕 Première ingestion - traitement de toutes les images..."
    npm run ingest
fi

# Mettre à jour le timestamp
touch "$TIMESTAMP_FILE"

# Nettoyer
rm -rf "$TEMP_DIR"

echo "✨ Ingestion terminée!"