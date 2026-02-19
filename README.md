# Zwiebelschneide-Simulator (Zwiebel-Lab)

Eine wissenschaftliche, interaktive 3D-Simulation zur Analyse der Effizienz verschiedener Schneidetechniken bei Zwiebeln. Diese Anwendung untersucht die Hypothese, ob horizontale Schnitte beim Würfeln von Zwiebeln tatsächlich zu einer gleichmäßigeren Stückgröße führen oder ob sie, bedingt durch die natürliche Schalenstruktur der Zwiebel, vernachlässigbar sind.

<img width="1378" height="766" alt="image" src="https://github.com/user-attachments/assets/61e13e59-3b1b-4073-a97d-153eecdf6f0e" />


## 🎯 Zielsetzung

Viele Köche schneiden Zwiebeln horizontal ein, um "feinere Würfel" zu erhalten. Kritiker (und der Autor dieser Idee) argumentieren, dass die konzentrischen Schichten der Zwiebel diesen Schnitt bereits natürlich vorgeben und der horizontale Schnitt daher überflüssig ist. Diese App liefert mathematische Beweise durch Monte-Carlo-Simulationen.

## ✨ Features

- **Realistisches 3D-Zwiebelmodell:** Simulation der Zwiebel nicht als solider Block, sondern als geschichtete Struktur (konzentrische Schalen).
- **Internationale Unterstützung:** Jetzt verfügbar in **12 Sprachen**:
  - 🇩🇪 Deutsch
  - 🇬🇧 Englisch
  - 🇫🇷 Französisch
  - 🇪🇸 Spanisch
  - 🇵🇹 Portugiesisch
  - 🇮🇹 Italienisch
  - 🇷🇺 Russisch
  - 🇨🇳 Chinesisch
  - 🇯🇵 Japanisch
  - 🇰🇷 Koreanisch
  - 🇮🇳 Hindi
  - 🇸🇦 Arabisch
- **Parametrisierbare Schnitte:**
  - Vertikale Schnitte (Streifenabstand)
  - Querschnitte (Würfelabstand)
  - Horizontale Schnitte (Anzahl und Position)
- **Echtzeit-Statistik:**
  - Berechnung der Stückgrößenverteilung (Histogramm).
  - Variationskoeffizient (CV) als Maß für die Gleichmäßigkeit ("Homogenität").
  - Vergleichsmodus: Direkte Gegenüberstellung der Ergebnisse "Mit vs. Ohne" Horizontalschnitt.
- **Explosionsansicht:** Visuelle Trennung der Schichten ("Teleskop-Effekt") zur Analyse der inneren Struktur.
- **Daten-Export:** Generierung umfangreicher CSV-Dateien für Excel zur weiteren Analyse (Datenheaders in gewählter Sprache).

## 🚀 Benutzung

### 1. Sprache wählen
Nutzen Sie das Weltkugel-Symbol im Header, um Ihre bevorzugte Sprache auszuwählen.

### 2. Geometrie einstellen
Wählen Sie in der linken Seitenleiste die Größe der Zwiebel (Klein, Mittel, Groß) und die Dicke der Schichten.
- *Tipp:* Mit dem Augensymbol können Sie die Transparenz der Zwiebel anpassen, um das innere Schnittmuster zu sehen.

### 3. Schnitte simulieren
Verstellen Sie die Slider für:
- **Vertikal (Rot):** Der erste Schnitt längs zur Wurzel.
- **Quer (Blau):** Der Schnitt quer zur Faser (das eigentliche Würfeln).
- **Horizontal (Orange):** Der umstrittene Schnitt parallel zum Brett.

### 4. Analyse
- **Histogramm:** Sehen Sie unten im Bild, wie sich die Größen verteilen. Ein schmaler, hoher Berg bedeutet sehr gleichmäßige Würfel.
- **CV-Wert:** Achten Sie auf den Variationskoeffizient unten links. Ein niedrigerer %-Wert ist besser.
- **Vergleich:** Aktivieren Sie den "Vergleich: Effekt Horizontalschnitt" Button. Die App zeigt nun in Rot die Kurve an, wie sie *ohne* horizontale Schnitte aussehen würde. Überlappen sich die Kurven fast vollständig? Dann bringt der Schnitt nichts.

### 5. Export
Klicken Sie auf "Excel Export". Sie haben drei Optionen:
1.  **Aktuelle Ansicht:** Speichert nur das jetzige Ergebnis.
2.  **Batch (Aktuelle Größe):** Simuliert ~150 Kombinationen für die aktuelle Zwiebelgröße.
3.  **Wissenschaftliche Studie:** Simuliert ~450 Kombinationen über alle drei Standardgrößen. Ideal für akademische Auswertungen.

## 🛠 Technologien

- **Frontend:** React, TypeScript
- **3D Rendering:** Three.js, React Three Fiber
- **Styling:** Tailwind CSS
- **Charts:** Chart.js
- **Icons:** Lucide React

## 🧪 Wissenschaftlicher Hintergrund

Die Simulation verwendet eine Voxel-basierte Monte-Carlo-Methode.
1.  Ein virtueller Raum wird mit Millionen von Testpunkten gefüllt.
2.  Jeder Punkt wird geprüft: Liegt er innerhalb der Zwiebel? In welcher Schale? Zwischen welchen Schnittebenen?
3.  Punkte mit identischen Parametern werden zu einem "Stück" zusammengefasst.
4.  Das Volumen wird durch die Summe der Voxel approximiert.

## 📝 Lizenz

MIT License. Erstellt als Experiment zur kulinarischen Geometrie.
