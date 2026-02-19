import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Scissors, BarChart3, Info, RefreshCw, FileSpreadsheet, Ruler, Eye, ZoomIn, ZoomOut, RotateCw, MonitorPlay, Layers, Home, Expand, X, FileText, Database, Globe, ChevronDown, HelpCircle, ShieldAlert, Move3d, Grid3X3 } from 'lucide-react';

// Fix for React Three Fiber intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      sphereGeometry: any;
      meshPhysicalMaterial: any;
      planeGeometry: any;
      meshBasicMaterial: any;
      lineSegments: any;
      edgesGeometry: any;
      lineBasicMaterial: any;
      ambientLight: any;
      pointLight: any;
      axesHelper: any;
      instancedMesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      sphereGeometry: any;
      meshPhysicalMaterial: any;
      planeGeometry: any;
      meshBasicMaterial: any;
      lineSegments: any;
      edgesGeometry: any;
      lineBasicMaterial: any;
      ambientLight: any;
      pointLight: any;
      axesHelper: any;
      instancedMesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
    }
  }
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- TRANSLATIONS ---

type Language = 'de' | 'en' | 'fr' | 'es' | 'pt' | 'it' | 'ru' | 'zh' | 'ja' | 'ko' | 'hi' | 'ar';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'it', label: 'Italiano' },
  { code: 'ru', label: 'Русский' },
  { code: 'zh', label: '中文 (Simplified)' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ar', label: 'العربية' }
];

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    appTitle: "Onion Lab",
    appSubtitle: "Scientific analysis of cutting techniques.",
    geoTitle: "Onion Geometry",
    techTitle: "Cutting Parameters",
    sizeSmall: "Small",
    sizeMedium: "Medium",
    sizeLarge: "Large",
    radius: "Radius",
    layer: "Layer",
    transparency: "Transparency",
    vertical: "Vertical (Stripes)",
    cross: "Cross (Dice)",
    horizontal: "Horizontal (Incisions)",
    cuts: "cuts",
    compareBtn: "Compare: Horizontal Cut Effect",
    exportBtn: "Excel Export",
    exporting: "Generating...",
    distTitle: "Piece Size Distribution",
    statsTitle: "Detailed Statistics",
    statCount: "Piece Count",
    statVol: "Ø Volume",
    statMedian: "Median",
    statStdDev: "Std. Deviation",
    statTheoVol: "Theoretical Hemisphere Volume",
    cvTitle: "Coefficient of Variation (CV)",
    cvTooltip: "Measure of relative dispersion. Lower means more uniform cubes.",
    cvImprovement: "Improvement",
    cvNoBenefit: "No Benefit",
    legendTitle: "Legend",
    legendVert: "Vertical",
    legendCross: "Cross",
    legendHorz: "Horizontal",
    modalTitle: "Export Data",
    modalSub: "Choose Excel export scope:",
    modalCancel: "Cancel",
    modeSingleTitle: "Current View",
    modeSingleDesc: "Exports only current parameters (1 record).",
    modeBatchTitle: "Batch (Current Size)",
    modeBatchDesc: "Simulates V (3-7mm), C (3-7mm) and H (0-5) for current radius (~150 records).",
    modeFullTitle: "Scientific Study",
    modeFullDesc: "Full scan of all parameters for Small, Medium, and Large (~450 records).",
    chartLabelCurrent: "Current",
    chartLabelComp: "No Horizontal (0)",
    chartTooltip: "Volume",
    csvRadius: "Radius (mm)",
    csvLayer: "Layer Thickness (mm)",
    csvVert: "Vertical Spacing (mm)",
    csvCross: "Cross Spacing (mm)",
    csvHorz: "Horizontal Cuts Count",
    csvCount: "Piece Count",
    csvVolTotal: "Total Volume (mm3)",
    csvAvg: "Average (mm3)",
    csvMedian: "Median (mm3)",
    csvMax: "Max (mm3)",
    csvStd: "StdDev (mm3)",
    csvCV: "CV (%)",
    csvRating: "Rating",
    ratingGood: "Good",
    ratingUneven: "Uneven",
    ratingHomogen: "Very Homogeneous",
    aboutTitle: "About Onion Lab",
    aboutText: "This application simulates onion cutting using Monte-Carlo methods. It tests the hypothesis whether horizontal incisions are necessary for uniform dicing, considering the onion's natural layered structure.",
    aboutVersion: "Version 1.0.0",
    aboutLicense: "MIT License",
    expSpread: "Spread (Separation)",
    expLift: "Lift (Layers)",
    wireframe: "Wireframe"
  },
  de: {
    appTitle: "Zwiebel-Lab",
    appSubtitle: "Wissenschaftliche Analyse der Schneidetechnik.",
    geoTitle: "Zwiebelgröße",
    techTitle: "Schnitt-Parameter",
    sizeSmall: "Klein",
    sizeMedium: "Mittel",
    sizeLarge: "Groß",
    radius: "Radius",
    layer: "Schicht",
    transparency: "Transparenz",
    vertical: "Vertikal (Streifen)",
    cross: "Quer (Würfeln)",
    horizontal: "Horizontal (Einschneiden)",
    cuts: "Schnitte",
    compareBtn: "Vergleich: Effekt Horizontalschnitt",
    exportBtn: "Excel Export",
    exporting: "Generiere...",
    distTitle: "Stückgrößen-Verteilung",
    statsTitle: "Detail-Statistik",
    statCount: "Stückzahl",
    statVol: "Ø Volumen",
    statMedian: "Median",
    statStdDev: "Std. Abweichung",
    statTheoVol: "Theoretisches Halbkugel-Volumen",
    cvTitle: "Variationskoeffizient (CV)",
    cvTooltip: "Maß für die relative Streuung. Je niedriger, desto gleichmäßiger sind die Würfel.",
    cvImprovement: "Verbesserung",
    cvNoBenefit: "Kein Vorteil",
    legendTitle: "Legende",
    legendVert: "Vertikal",
    legendCross: "Quer",
    legendHorz: "Horizontal",
    modalTitle: "Daten exportieren",
    modalSub: "Wähle den Umfang des Excel-Exports:",
    modalCancel: "Abbrechen",
    modeSingleTitle: "Aktuelle Ansicht",
    modeSingleDesc: "Exportiert nur die aktuell eingestellten Parameter (1 Datensatz).",
    modeBatchTitle: "Batch (Aktuelle Größe)",
    modeBatchDesc: "Simuliert V (3-7mm), Q (3-7mm) und H (0-5) für den aktuellen Radius (~150 Datensätze).",
    modeFullTitle: "Wissenschaftliche Studie",
    modeFullDesc: "Vollständiger Scan aller Parameter für Klein, Mittel und Groß (~450 Datensätze).",
    chartLabelCurrent: "Aktuell",
    chartLabelComp: "Ohne Horizontal (0)",
    chartTooltip: "Volumen",
    csvRadius: "Radius (mm)",
    csvLayer: "Schichtdicke (mm)",
    csvVert: "Vertikal-Abstand (mm)",
    csvCross: "Quer-Abstand (mm)",
    csvHorz: "Anzahl Horizontal-Schnitte",
    csvCount: "Stueckzahl",
    csvVolTotal: "Volumen Gesamt (mm3)",
    csvAvg: "Durchschnitt (mm3)",
    csvMedian: "Median (mm3)",
    csvMax: "Max (mm3)",
    csvStd: "StdAbw (mm3)",
    csvCV: "CV (%)",
    csvRating: "Bewertung",
    ratingGood: "Gut",
    ratingUneven: "Ungleichmaessig",
    ratingHomogen: "Sehr Homogen",
    aboutTitle: "Über Onion Lab",
    aboutText: "Diese App simuliert das Zwiebelschneiden mittels Monte-Carlo-Methoden. Sie prüft die Hypothese, ob horizontale Einschnitte für gleichmäßige Würfel notwendig sind, unter Berücksichtigung der natürlichen Schichtstruktur.",
    aboutVersion: "Version 1.0.0",
    aboutLicense: "MIT Lizenz",
    expSpread: "Spread (Trennung)",
    expLift: "Lift (Schichten)",
    wireframe: "Gittermodell"
  },
  fr: {
    appTitle: "Labo Oignon",
    appSubtitle: "Analyse scientifique de la découpe.",
    geoTitle: "Géométrie de l'oignon",
    techTitle: "Paramètres de coupe",
    sizeSmall: "Petit",
    sizeMedium: "Moyen",
    sizeLarge: "Grand",
    radius: "Rayon",
    layer: "Couche",
    transparency: "Transparence",
    vertical: "Vertical (Ciselage)",
    cross: "Travers (Dés)",
    horizontal: "Horizontal",
    cuts: "coupes",
    compareBtn: "Comparer: Effet Horizontal",
    exportBtn: "Export Excel",
    exporting: "Génération...",
    distTitle: "Distribution des tailles",
    statsTitle: "Statistiques détaillées",
    statCount: "Nombre de pièces",
    statVol: "Ø Volume",
    statMedian: "Médiane",
    statStdDev: "Écart-type",
    statTheoVol: "Volume théorique",
    cvTitle: "Coefficient de variation (CV)",
    cvTooltip: "Mesure de la dispersion relative. Plus bas = cubes plus uniformes.",
    cvImprovement: "Amélioration",
    cvNoBenefit: "Pas d'avantage",
    legendTitle: "Légende",
    legendVert: "Vertical",
    legendCross: "Travers",
    legendHorz: "Horizontal",
    modalTitle: "Exporter les données",
    modalSub: "Choisir l'étendue de l'export:",
    modalCancel: "Annuler",
    modeSingleTitle: "Vue actuelle",
    modeSingleDesc: "Exporte uniquement les paramètres actuels (1 enregistrement).",
    modeBatchTitle: "Lot (Taille actuelle)",
    modeBatchDesc: "Simule V (3-7mm), T (3-7mm) et H (0-5) pour le rayon actuel.",
    modeFullTitle: "Étude Scientifique",
    modeFullDesc: "Scan complet de tous les paramètres pour Petit, Moyen et Grand.",
    chartLabelCurrent: "Actuel",
    chartLabelComp: "Sans Horizontal (0)",
    chartTooltip: "Volume",
    csvRadius: "Rayon (mm)",
    csvLayer: "Epaisseur Couche (mm)",
    csvVert: "Ecart Vertical (mm)",
    csvCross: "Ecart Travers (mm)",
    csvHorz: "Coupes Horizontales",
    csvCount: "Nombre Pieces",
    csvVolTotal: "Volume Total (mm3)",
    csvAvg: "Moyenne (mm3)",
    csvMedian: "Mediane (mm3)",
    csvMax: "Max (mm3)",
    csvStd: "EcartType (mm3)",
    csvCV: "CV (%)",
    csvRating: "Evaluation",
    ratingGood: "Bon",
    ratingUneven: "Irregulier",
    ratingHomogen: "Tres Homogene",
    aboutTitle: "À propos",
    aboutText: "Simulation de coupe d'oignon par méthodes de Monte-Carlo pour tester l'efficacité des coupes horizontales.",
    aboutVersion: "Version 1.0.0",
    aboutLicense: "Licence MIT",
    expSpread: "Écartement",
    expLift: "Soulèvement",
    wireframe: "Fil de fer"
  },
  es: {
    appTitle: "Lab. Cebolla",
    appSubtitle: "Análisis científico del corte.",
    geoTitle: "Geometría",
    techTitle: "Parámetros de corte",
    sizeSmall: "Pequeña",
    sizeMedium: "Mediana",
    sizeLarge: "Grande",
    radius: "Radio",
    layer: "Capa",
    transparency: "Transparencia",
    vertical: "Vertical (Tiras)",
    cross: "Transversal (Dados)",
    horizontal: "Horizontal",
    cuts: "cortes",
    compareBtn: "Comparar: Efecto Horizontal",
    exportBtn: "Exportar Excel",
    exporting: "Generando...",
    distTitle: "Distribución de tamaños",
    statsTitle: "Estadísticas detalladas",
    statCount: "Cantidad",
    statVol: "Ø Volumen",
    statMedian: "Mediana",
    statStdDev: "Desviación Est.",
    statTheoVol: "Volumen teórico",
    cvTitle: "Coeficiente de Variación (CV)",
    cvTooltip: "Medida de dispersión. Más bajo = cubos más uniformes.",
    cvImprovement: "Mejora",
    cvNoBenefit: "Sin beneficio",
    legendTitle: "Leyenda",
    legendVert: "Vertical",
    legendCross: "Transversal",
    legendHorz: "Horizontal",
    modalTitle: "Exportar datos",
    modalSub: "Elegir alcance de exportación:",
    modalCancel: "Cancelar",
    modeSingleTitle: "Vista actual",
    modeSingleDesc: "Exporta solo parámetros actuales.",
    modeBatchTitle: "Lote (Tamaño actual)",
    modeBatchDesc: "Simula V (3-7mm), T (3-7mm) y H (0-5) para radio actual.",
    modeFullTitle: "Estudio Científico",
    modeFullDesc: "Escaneo completo para Pequeña, Mediana y Grande.",
    chartLabelCurrent: "Actual",
    chartLabelComp: "Sin Horizontal (0)",
    chartTooltip: "Volumen",
    csvRadius: "Radio (mm)",
    csvLayer: "Espesor Capa (mm)",
    csvVert: "Espac. Vertical (mm)",
    csvCross: "Espac. Transversal (mm)",
    csvHorz: "Cortes Horizontales",
    csvCount: "Cantidad Piezas",
    csvVolTotal: "Volumen Total (mm3)",
    csvAvg: "Promedio (mm3)",
    csvMedian: "Mediana (mm3)",
    csvMax: "Max (mm3)",
    csvStd: "DesvEst (mm3)",
    csvCV: "CV (%)",
    csvRating: "Evaluacion",
    ratingGood: "Bueno",
    ratingUneven: "Desigual",
    ratingHomogen: "Muy Homogeneo",
    aboutTitle: "Acerca de",
    aboutText: "Simulación de corte de cebolla utilizando métodos de Monte-Carlo para probar la eficacia de los cortes horizontales.",
    aboutVersion: "Versión 1.0.0",
    aboutLicense: "Licencia MIT",
    expSpread: "Separación",
    expLift: "Elevación",
    wireframe: "Alambre"
  },
  pt: {
    appTitle: "Lab. Cebola",
    appSubtitle: "Análise científica do corte.",
    geoTitle: "Geometria",
    techTitle: "Parâmetros de Corte",
    sizeSmall: "Pequena",
    sizeMedium: "Média",
    sizeLarge: "Grande",
    radius: "Raio",
    layer: "Camada",
    transparency: "Transparência",
    vertical: "Vertical (Tiras)",
    cross: "Transversal (Cubos)",
    horizontal: "Horizontal",
    cuts: "cortes",
    compareBtn: "Comparar: Efeito Horizontal",
    exportBtn: "Exportar Excel",
    exporting: "Gerando...",
    distTitle: "Distribuição de Tamanho",
    statsTitle: "Estatísticas Detalhadas",
    statCount: "Quantidade",
    statVol: "Ø Volume",
    statMedian: "Mediana",
    statStdDev: "Desvio Padrão",
    statTheoVol: "Volume Teórico",
    cvTitle: "Coeficiente de Variação (CV)",
    cvTooltip: "Medida de dispersão. Mais baixo = cubos mais uniformes.",
    cvImprovement: "Melhoria",
    cvNoBenefit: "Sem benefício",
    legendTitle: "Legenda",
    legendVert: "Vertical",
    legendCross: "Transversal",
    legendHorz: "Horizontal",
    modalTitle: "Exportar Dados",
    modalSub: "Escolha o escopo:",
    modalCancel: "Cancelar",
    modeSingleTitle: "Vista Atual",
    modeSingleDesc: "Exporta apenas parâmetros atuais.",
    modeBatchTitle: "Lote (Tamanho Atual)",
    modeBatchDesc: "Simula V (3-7mm), T (3-7mm) e H (0-5) para raio atual.",
    modeFullTitle: "Estudo Científico",
    modeFullDesc: "Varredura completa para Pequena, Média e Grande.",
    chartLabelCurrent: "Atual",
    chartLabelComp: "Sem Horizontal (0)",
    chartTooltip: "Volume",
    csvRadius: "Raio (mm)",
    csvLayer: "Espessura Camada (mm)",
    csvVert: "Espac. Vertical (mm)",
    csvCross: "Espac. Transversal (mm)",
    csvHorz: "Cortes Horizontais",
    csvCount: "Qtd Pecas",
    csvVolTotal: "Volume Total (mm3)",
    csvAvg: "Media (mm3)",
    csvMedian: "Mediana (mm3)",
    csvMax: "Max (mm3)",
    csvStd: "DesvPad (mm3)",
    csvCV: "CV (%)",
    csvRating: "Avaliacao",
    ratingGood: "Bom",
    ratingUneven: "Desigual",
    ratingHomogen: "Muito Homogeneo",
    aboutTitle: "Sobre",
    aboutText: "Simulação de corte de cebola usando métodos de Monte-Carlo.",
    aboutVersion: "Versão 1.0.0",
    aboutLicense: "Licença MIT",
    expSpread: "Dispersão",
    expLift: "Elevação",
    wireframe: "Arame"
  },
  it: {
    appTitle: "Laboratorio Cipolla",
    appSubtitle: "Analisi scientifica del taglio.",
    geoTitle: "Geometria",
    techTitle: "Parametri di Taglio",
    sizeSmall: "Piccola",
    sizeMedium: "Media",
    sizeLarge: "Grande",
    radius: "Raggio",
    layer: "Strato",
    transparency: "Trasparenza",
    vertical: "Verticale (Strisce)",
    cross: "Trasversale (Cubetti)",
    horizontal: "Orizzontale",
    cuts: "tagli",
    compareBtn: "Confronta: Effetto Orizzontale",
    exportBtn: "Esporta Excel",
    exporting: "Generazione...",
    distTitle: "Distribuzione Dimensioni",
    statsTitle: "Statistiche Dettagliate",
    statCount: "Quantità",
    statVol: "Ø Volume",
    statMedian: "Mediana",
    statStdDev: "Deviazione Std.",
    statTheoVol: "Volume Teorico",
    cvTitle: "Coefficiente di Variazione (CV)",
    cvTooltip: "Misura della dispersione. Più basso = cubetti più uniformi.",
    cvImprovement: "Miglioramento",
    cvNoBenefit: "Nessun beneficio",
    legendTitle: "Legenda",
    legendVert: "Verticale",
    legendCross: "Trasversale",
    legendHorz: "Orizzontale",
    modalTitle: "Esporta Dati",
    modalSub: "Scegli l'ambito dell'esportazione:",
    modalCancel: "Annulla",
    modeSingleTitle: "Vista Attuale",
    modeSingleDesc: "Esporta solo i parametri attuali.",
    modeBatchTitle: "Batch (Misura Attuale)",
    modeBatchDesc: "Simula V (3-7mm), T (3-7mm) e H (0-5) per raggio attuale.",
    modeFullTitle: "Studio Scientifico",
    modeFullDesc: "Scansione completa per Piccola, Media e Grande.",
    chartLabelCurrent: "Attuale",
    chartLabelComp: "Senza Orizzontale (0)",
    chartTooltip: "Volume",
    csvRadius: "Raggio (mm)",
    csvLayer: "Spessore Strato (mm)",
    csvVert: "Spaz. Verticale (mm)",
    csvCross: "Spaz. Trasversale (mm)",
    csvHorz: "Tagli Orizzontali",
    csvCount: "Qta Pezzi",
    csvVolTotal: "Volume Totale (mm3)",
    csvAvg: "Media (mm3)",
    csvMedian: "Mediana (mm3)",
    csvMax: "Max (mm3)",
    csvStd: "DevStd (mm3)",
    csvCV: "CV (%)",
    csvRating: "Valutazione",
    ratingGood: "Buono",
    ratingUneven: "Irregolare",
    ratingHomogen: "Molto Omogeneo",
    aboutTitle: "Info",
    aboutText: "Simulazione del taglio della cipolla con metodi Monte-Carlo.",
    aboutVersion: "Versione 1.0.0",
    aboutLicense: "Licenza MIT",
    expSpread: "Diffusione",
    expLift: "Sollevamento",
    wireframe: "Filo"
  },
  ru: {
    appTitle: "Луковая Лаборатория",
    appSubtitle: "Научный анализ техники резки.",
    geoTitle: "Геометрия Лука",
    techTitle: "Параметры Резки",
    sizeSmall: "Маленькая",
    sizeMedium: "Средняя",
    sizeLarge: "Большая",
    radius: "Радиус",
    layer: "Слой",
    transparency: "Прозрачность",
    vertical: "Вертикально (Полоски)",
    cross: "Поперек (Кубики)",
    horizontal: "Горизонтально",
    cuts: "надрезов",
    compareBtn: "Сравнить: Эффект Горизонт.",
    exportBtn: "Экспорт Excel",
    exporting: "Генерация...",
    distTitle: "Распределение Размеров",
    statsTitle: "Подробная Статистика",
    statCount: "Количество",
    statVol: "Ø Объем",
    statMedian: "Медиана",
    statStdDev: "Станд. отклон.",
    statTheoVol: "Теор. объем полусферы",
    cvTitle: "Коэфф. Вариации (CV)",
    cvTooltip: "Мера разброса. Чем ниже, тем равномернее кубики.",
    cvImprovement: "Улучшение",
    cvNoBenefit: "Нет выгоды",
    legendTitle: "Легенда",
    legendVert: "Вертикально",
    legendCross: "Поперек",
    legendHorz: "Горизонтально",
    modalTitle: "Экспорт Данных",
    modalSub: "Выберите объем экспорта:",
    modalCancel: "Отмена",
    modeSingleTitle: "Текущий Вид",
    modeSingleDesc: "Экспорт только текущих параметров.",
    modeBatchTitle: "Пакет (Тек. Размер)",
    modeBatchDesc: "Симуляция V, C и H для текущего радиуса.",
    modeFullTitle: "Научное Исследование",
    modeFullDesc: "Полный скан для всех размеров.",
    chartLabelCurrent: "Текущий",
    chartLabelComp: "Без Горизонт. (0)",
    chartTooltip: "Объем",
    csvRadius: "Radius (mm)",
    csvLayer: "Layer Thickness (mm)",
    csvVert: "Vertical Spacing (mm)",
    csvCross: "Cross Spacing (mm)",
    csvHorz: "Horizontal Cuts",
    csvCount: "Count",
    csvVolTotal: "Total Vol (mm3)",
    csvAvg: "Avg (mm3)",
    csvMedian: "Median (mm3)",
    csvMax: "Max (mm3)",
    csvStd: "StdDev (mm3)",
    csvCV: "CV (%)",
    csvRating: "Rating",
    ratingGood: "Good",
    ratingUneven: "Uneven",
    ratingHomogen: "Very Homogeneous",
    aboutTitle: "О программе",
    aboutText: "Симуляция резки лука методом Монте-Карло.",
    aboutVersion: "Версия 1.0.0",
    aboutLicense: "Лицензия MIT",
    expSpread: "Разброс",
    expLift: "Подъем",
    wireframe: "Каркас"
  },
  zh: {
    appTitle: "洋葱实验室",
    appSubtitle: "切割技术的科学分析。",
    geoTitle: "洋葱几何",
    techTitle: "切割参数",
    sizeSmall: "小",
    sizeMedium: "中",
    sizeLarge: "大",
    radius: "半径",
    layer: "层",
    transparency: "透明度",
    vertical: "纵向 (条状)",
    cross: "横向 (丁状)",
    horizontal: "水平 (切口)",
    cuts: "刀",
    compareBtn: "对比: 水平切割效果",
    exportBtn: "Excel 导出",
    exporting: "生成中...",
    distTitle: "碎片大小分布",
    statsTitle: "详细统计",
    statCount: "碎片数量",
    statVol: "Ø 体积",
    statMedian: "中位数",
    statStdDev: "标准差",
    statTheoVol: "理论半球体积",
    cvTitle: "变异系数 (CV)",
    cvTooltip: "相对离散度的度量。越低表示丁越均匀。",
    cvImprovement: "改善",
    cvNoBenefit: "无收益",
    legendTitle: "图例",
    legendVert: "纵向",
    legendCross: "横向",
    legendHorz: "水平",
    modalTitle: "导出数据",
    modalSub: "选择导出范围:",
    modalCancel: "取消",
    modeSingleTitle: "当前视图",
    modeSingleDesc: "仅导出当前参数。",
    modeBatchTitle: "批量 (当前尺寸)",
    modeBatchDesc: "模拟当前半径的所有组合。",
    modeFullTitle: "科学研究",
    modeFullDesc: "对小、中、大尺寸进行全面扫描。",
    chartLabelCurrent: "当前",
    chartLabelComp: "无水平 (0)",
    chartTooltip: "体积",
    csvRadius: "Radius (mm)",
    csvLayer: "Layer Thickness (mm)",
    csvVert: "Vertical Spacing (mm)",
    csvCross: "Cross Spacing (mm)",
    csvHorz: "Horizontal Cuts",
    csvCount: "Count",
    csvVolTotal: "Total Vol (mm3)",
    csvAvg: "Avg (mm3)",
    csvMedian: "Median (mm3)",
    csvMax: "Max (mm3)",
    csvStd: "StdDev (mm3)",
    csvCV: "CV (%)",
    csvRating: "Rating",
    ratingGood: "Good",
    ratingUneven: "Uneven",
    ratingHomogen: "Very Homogeneous",
    aboutTitle: "关于",
    aboutText: "使用蒙特卡罗方法模拟洋葱切割。",
    aboutVersion: "版本 1.0.0",
    aboutLicense: "MIT 许可证",
    expSpread: "扩散",
    expLift: "提升",
    wireframe: "线框"
  },
  ja: {
    appTitle: "オニオンラボ",
    appSubtitle: "切断技術の科学的分析。",
    geoTitle: "玉ねぎの形状",
    techTitle: "カットパラメータ",
    sizeSmall: "小",
    sizeMedium: "中",
    sizeLarge: "大",
    radius: "半径",
    layer: "層",
    transparency: "透明度",
    vertical: "垂直 (千切り)",
    cross: "交差 (さいの目)",
    horizontal: "水平 (切り込み)",
    cuts: "回",
    compareBtn: "比較: 水平カット効果",
    exportBtn: "Excel エクスポート",
    exporting: "生成中...",
    distTitle: "サイズ分布",
    statsTitle: "詳細統計",
    statCount: "個数",
    statVol: "Ø 体積",
    statMedian: "中央値",
    statStdDev: "標準偏差",
    statTheoVol: "理論半球体積",
    cvTitle: "変動係数 (CV)",
    cvTooltip: "ばらつきの尺度。低いほど均一です。",
    cvImprovement: "改善",
    cvNoBenefit: "効果なし",
    legendTitle: "凡例",
    legendVert: "垂直",
    legendCross: "交差",
    legendHorz: "水平",
    modalTitle: "データのエクスポート",
    modalSub: "エクスポート範囲を選択:",
    modalCancel: "キャンセル",
    modeSingleTitle: "現在のビュー",
    modeSingleDesc: "現在のパラメータのみエクスポート。",
    modeBatchTitle: "バッチ (現在のサイズ)",
    modeBatchDesc: "現在の半径のすべての組み合わせをシミュレート。",
    modeFullTitle: "科学的研究",
    modeFullDesc: "小、中、大の完全スキャン。",
    chartLabelCurrent: "現在",
    chartLabelComp: "水平なし (0)",
    chartTooltip: "体積",
    csvRadius: "Radius (mm)",
    csvLayer: "Layer Thickness (mm)",
    csvVert: "Vertical Spacing (mm)",
    csvCross: "Cross Spacing (mm)",
    csvHorz: "Horizontal Cuts",
    csvCount: "Count",
    csvVolTotal: "Total Vol (mm3)",
    csvAvg: "Avg (mm3)",
    csvMedian: "Median (mm3)",
    csvMax: "Max (mm3)",
    csvStd: "StdDev (mm3)",
    csvCV: "CV (%)",
    csvRating: "Rating",
    ratingGood: "Good",
    ratingUneven: "Uneven",
    ratingHomogen: "Very Homogeneous",
    aboutTitle: "について",
    aboutText: "モンテカルロ法を用いた玉ねぎカットのシミュレーション。",
    aboutVersion: "バージョン 1.0.0",
    aboutLicense: "MITライセンス",
    expSpread: "拡散",
    expLift: "リフト",
    wireframe: "ワイヤーフレーム"
  },
  ko: {
    appTitle: "양파 연구소",
    appSubtitle: "커팅 기술의 과학적 분석.",
    geoTitle: "양파 기하학",
    techTitle: "커팅 파라미터",
    sizeSmall: "소",
    sizeMedium: "중",
    sizeLarge: "대",
    radius: "반지름",
    layer: "층 (겹)",
    transparency: "투명도",
    vertical: "수직 (채썰기)",
    cross: "교차 (깍둑썰기)",
    horizontal: "수평 (칼집)",
    cuts: "회",
    compareBtn: "비교: 수평 커팅 효과",
    exportBtn: "Excel 내보내기",
    exporting: "생성 중...",
    distTitle: "조각 크기 분포",
    statsTitle: "상세 통계",
    statCount: "조각 수",
    statVol: "Ø 부피",
    statMedian: "중앙값",
    statStdDev: "표준 편차",
    statTheoVol: "이론적 반구 부피",
    cvTitle: "변동 계수 (CV)",
    cvTooltip: "상대적 분산 척도. 낮을수록 균일함.",
    cvImprovement: "개선됨",
    cvNoBenefit: "이득 없음",
    legendTitle: "범례",
    legendVert: "수직",
    legendCross: "교차",
    legendHorz: "수평",
    modalTitle: "데이터 내보내기",
    modalSub: "내보내기 범위 선택:",
    modalCancel: "취소",
    modeSingleTitle: "현재 뷰",
    modeSingleDesc: "현재 파라미터만 내보냅니다.",
    modeBatchTitle: "배치 (현재 크기)",
    modeBatchDesc: "현재 반지름에 대한 모든 조합 시뮬레이션.",
    modeFullTitle: "과학적 연구",
    modeFullDesc: "소, 중, 대 크기에 대한 전체 스캔.",
    chartLabelCurrent: "현재",
    chartLabelComp: "수평 없음 (0)",
    chartTooltip: "부피",
    csvRadius: "Radius (mm)",
    csvLayer: "Layer Thickness (mm)",
    csvVert: "Vertical Spacing (mm)",
    csvCross: "Cross Spacing (mm)",
    csvHorz: "Horizontal Cuts",
    csvCount: "Count",
    csvVolTotal: "Total Vol (mm3)",
    csvAvg: "Avg (mm3)",
    csvMedian: "Median (mm3)",
    csvMax: "Max (mm3)",
    csvStd: "StdDev (mm3)",
    csvCV: "CV (%)",
    csvRating: "Rating",
    ratingGood: "Good",
    ratingUneven: "Uneven",
    ratingHomogen: "Very Homogeneous",
    aboutTitle: "정보",
    aboutText: "몬테카를로 방법을 사용한 양파 커팅 시뮬레이션.",
    aboutVersion: "버전 1.0.0",
    aboutLicense: "MIT 라이센스",
    expSpread: "확산",
    expLift: "리프트",
    wireframe: "와이어프레임"
  },
  hi: {
    appTitle: "प्याज प्रयोगशाला",
    appSubtitle: "काटने की तकनीक का वैज्ञानिक विश्लेषण।",
    geoTitle: "प्याज ज्यामिति",
    techTitle: "काटने के मापदंड",
    sizeSmall: "छोटा",
    sizeMedium: "मध्यम",
    sizeLarge: "बड़ा",
    radius: "त्रिज्या (Radius)",
    layer: "परत (Layer)",
    transparency: "पारदर्शिता",
    vertical: "लंबवत (Vertical)",
    cross: "अनुप्रस्थ (Cross)",
    horizontal: "क्षैतिज (Horizontal)",
    cuts: "कट",
    compareBtn: "तुलना: क्षैतिज कट प्रभाव",
    exportBtn: "Excel निर्यात",
    exporting: "उत्पन्न हो रहा है...",
    distTitle: "टुकड़ा आकार वितरण",
    statsTitle: "विस्तृत आँकड़े",
    statCount: "टुकड़ों की संख्या",
    statVol: "Ø आयतन",
    statMedian: "माधिका (Median)",
    statStdDev: "मानक विचलन",
    statTheoVol: "सैद्धांतिक आयतन",
    cvTitle: "भिन्नता गुणांक (CV)",
    cvTooltip: "फैलाव का माप। कम मतलब अधिक समान टुकड़े।",
    cvImprovement: "सुधार",
    cvNoBenefit: "कोई लाभ नहीं",
    legendTitle: "संकेत",
    legendVert: "लंबवत",
    legendCross: "अनुप्रस्थ",
    legendHorz: "क्षैतिज",
    modalTitle: "डेटा निर्यात करें",
    modalSub: "निर्यात का दायरा चुनें:",
    modalCancel: "रद्द करें",
    modeSingleTitle: "वर्तमान दृश्य",
    modeSingleDesc: "केवल वर्तमान मापदंड निर्यात करें।",
    modeBatchTitle: "बैच (वर्तमान आकार)",
    modeBatchDesc: "वर्तमान त्रिज्या के लिए सिमुलेशन।",
    modeFullTitle: "वैज्ञानिक अध्ययन",
    modeFullDesc: "सभी आकारों के लिए पूर्ण स्कैन।",
    chartLabelCurrent: "वर्तमान",
    chartLabelComp: "क्षैतिज के बिना (0)",
    chartTooltip: "आयतन",
    csvRadius: "Radius (mm)",
    csvLayer: "Layer Thickness (mm)",
    csvVert: "Vertical Spacing (mm)",
    csvCross: "Cross Spacing (mm)",
    csvHorz: "Horizontal Cuts",
    csvCount: "Count",
    csvVolTotal: "Total Vol (mm3)",
    csvAvg: "Avg (mm3)",
    csvMedian: "Median (mm3)",
    csvMax: "Max (mm3)",
    csvStd: "StdDev (mm3)",
    csvCV: "CV (%)",
    csvRating: "Rating",
    ratingGood: "Good",
    ratingUneven: "Uneven",
    ratingHomogen: "Very Homogeneous",
    aboutTitle: "के बारे में",
    aboutText: "मोंटे कार्लो विधियों का उपयोग करके प्याज काटने का अनुकरण।",
    aboutVersion: "संस्करण 1.0.0",
    aboutLicense: "MIT लाइसेंस",
    expSpread: "फैलाव",
    expLift: "उत्थान",
    wireframe: "वायरफ्रेम"
  },
  ar: {
    appTitle: "مختبر البصل",
    appSubtitle: "تحليل علمي لتقنيات التقطيع.",
    geoTitle: "هندسة البصل",
    techTitle: "معلمات القطع",
    sizeSmall: "صغير",
    sizeMedium: "متوسط",
    sizeLarge: "كبير",
    radius: "نصف القطر",
    layer: "طبقة",
    transparency: "الشفافية",
    vertical: "رأسي",
    cross: "عرضي",
    horizontal: "أفقي",
    cuts: "قطعات",
    compareBtn: "مقارنة: تأثير القطع الأفقي",
    exportBtn: "تصدير Excel",
    exporting: "جاري التوليد...",
    distTitle: "توزيع حجم القطع",
    statsTitle: "إحصائيات مفصلة",
    statCount: "عدد القطع",
    statVol: "Ø الحجم",
    statMedian: "الوسيط",
    statStdDev: "الانحراف المعياري",
    statTheoVol: "الحجم النظري",
    cvTitle: "معامل التباين (CV)",
    cvTooltip: "مقياس للتشتت. أقل يعني مكعبات أكثر تجانساً.",
    cvImprovement: "تحسن",
    cvNoBenefit: "لا فائدة",
    legendTitle: "المفتاح",
    legendVert: "رأسي",
    legendCross: "عرضي",
    legendHorz: "أفقي",
    modalTitle: "تصدير البيانات",
    modalSub: "اختر نطاق التصدير:",
    modalCancel: "إلغاء",
    modeSingleTitle: "العرض الحالي",
    modeSingleDesc: "تصدير المعلمات الحالية فقط.",
    modeBatchTitle: "دفعة (الحجم الحالي)",
    modeBatchDesc: "محاكاة لنصف القطر الحالي.",
    modeFullTitle: "دراسة علمية",
    modeFullDesc: "مسح كامل لجميع الأحجام.",
    chartLabelCurrent: "الحالي",
    chartLabelComp: "بدون أفقي (0)",
    chartTooltip: "الحجم",
    csvRadius: "Radius (mm)",
    csvLayer: "Layer Thickness (mm)",
    csvVert: "Vertical Spacing (mm)",
    csvCross: "Cross Spacing (mm)",
    csvHorz: "Horizontal Cuts",
    csvCount: "Count",
    csvVolTotal: "Total Vol (mm3)",
    csvAvg: "Avg (mm3)",
    csvMedian: "Median (mm3)",
    csvMax: "Max (mm3)",
    csvStd: "StdDev (mm3)",
    csvCV: "CV (%)",
    csvRating: "Rating",
    ratingGood: "Good",
    ratingUneven: "Uneven",
    ratingHomogen: "Very Homogeneous",
    aboutTitle: "حول",
    aboutText: "محاكاة تقطيع البصل باستخدام طرق مونت كارلو.",
    aboutVersion: "الإصدار 1.0.0",
    aboutLicense: "ترخيص MIT",
    expSpread: "انتشار",
    expLift: "رفع",
    wireframe: "إطار سلكي"
  }
};

// --- Typen & Interfaces ---

interface SimulationParams {
  onionRadius: number;       // Radius in mm
  layerThickness: number;    // Dicke einer Zwiebelschicht in mm
  verticalSpacing: number;   // Vertikal (X)
  crossSpacing: number;      // Quer (Z)
  horizontalCuts: number;    // Horizontal (Y)
  onionOpacity: number;      // Deckkraft der Zwiebel
  showCuts: boolean;
}

interface PieceStat {
  id: string;
  volume: number;
  count: number;
}

interface SimulationResult {
  totalVolume: number;
  theoreticalVolume: number; // Zum Abgleich V = 4/3*pi*r^3
  pieceCount: number;
  averageSize: number;
  stdDev: number;
  cv: number; // Variationskoeffizient in %
  median: number;
  maxSize: number;
  histogram: number[];
  labels: string[];
  pieces: PieceStat[];
}

// --- Simulations-Logik (Monte Carlo) ---

const runSimulation = (params: SimulationParams): SimulationResult => {
  const { onionRadius, layerThickness, verticalSpacing, crossSpacing, horizontalCuts } = params;
  
  // Auflösung für Monte Carlo (mm)
  const sampleResolution = 1.0; 
  
  const piecesMap = new Map<string, number>();
  
  // Bounding Box
  const bounds = onionRadius;

  // Theoretisches Volumen der Halbkugel
  const theoreticalVolume = (4/3) * Math.PI * Math.pow(onionRadius, 3);

  // Iteration über Voxel
  for (let x = -bounds; x <= bounds; x += sampleResolution) {
    for (let y = -bounds; y <= bounds; y += sampleResolution) {
      for (let z = -bounds; z <= bounds; z += sampleResolution) {
        
        // 1. Innerhalb der Zwiebel?
        const dist = Math.sqrt(x*x + y*y + z*z);
        if (dist > onionRadius) continue;

        // Wir simulieren das Schneiden einer HALBEN Zwiebel, die auf dem Brett liegt (y > 0)
        if (y < 0) continue; 

        // 2. Schicht-ID (Zwiebelstruktur)
        const layerId = Math.floor((onionRadius - dist) / layerThickness);
        
        // 3. Schnitt-IDs
        const vCutId = Math.floor(x / verticalSpacing); // Vertikal
        const cCutId = Math.floor(z / crossSpacing);    // Quer

        // Horizontal (Parallel zum Brett / Y-Achse)
        let hCutId = 0;
        if (horizontalCuts > 0) {
            const hSpacing = onionRadius / (horizontalCuts + 1);
            hCutId = Math.floor(y / hSpacing);
        }

        const pieceId = `L${layerId}_V${vCutId}_C${cCutId}_H${hCutId}`;
        piecesMap.set(pieceId, (piecesMap.get(pieceId) || 0) + 1);
      }
    }
  }

  // Auswertung
  const voxelVolume = Math.pow(sampleResolution, 3);
  const pieces: PieceStat[] = [];
  let sumVol = 0;
  const volumes: number[] = [];

  piecesMap.forEach((count, id) => {
    const vol = count * voxelVolume;
    // Filtere winzige Fragmente raus ("Staub")
    if (vol > 1) { 
        pieces.push({ id, volume: vol, count });
        volumes.push(vol);
        sumVol += vol;
    }
  });

  const pieceCount = pieces.length;
  const averageSize = pieceCount > 0 ? sumVol / pieceCount : 0;

  // Statistik
  const variance = pieces.reduce((acc, p) => acc + Math.pow(p.volume - averageSize, 2), 0) / pieceCount;
  const stdDev = Math.sqrt(variance);
  
  // Variationskoeffizient (CV)
  const cv = averageSize > 0 ? (stdDev / averageSize) * 100 : 0;

  // Median und Max
  volumes.sort((a, b) => a - b);
  const median = volumes.length > 0 ? volumes[Math.floor(volumes.length / 2)] : 0;
  const maxSize = volumes.length > 0 ? volumes[volumes.length - 1] : 0;

  // Histogramm
  const binCount = 20;
  const binSize = maxSize / binCount;
  const histogram = new Array(binCount).fill(0);
  const labels = new Array(binCount).fill('').map((_, i) => `${Math.round(i * binSize)}-${Math.round((i+1) * binSize)}`);

  pieces.forEach(p => {
    const binIndex = Math.min(Math.floor(p.volume / binSize), binCount - 1);
    histogram[binIndex]++;
  });

  return {
    totalVolume: sumVol,
    theoreticalVolume: theoreticalVolume / 2, 
    pieceCount,
    averageSize,
    stdDev,
    cv,
    median,
    maxSize,
    histogram,
    labels,
    pieces
  };
};

// --- 3D Komponenten ---

const OnionMesh = ({ params }: { params: SimulationParams }) => {
  const { onionRadius, layerThickness, onionOpacity } = params;
  const numLayers = Math.ceil(onionRadius / layerThickness);
  const layers = [];

  for (let i = 0; i < numLayers; i++) {
    const r = onionRadius - (i * layerThickness);
    if (r <= 0) continue;
    
    const isOuter = i === 0;
    // Neue Farbpalette: Gold/Beige statt Lila für besseren Kontrast zu Schnitten
    const color = isOuter ? '#b45309' : (i % 2 === 0 ? '#fde68a' : '#fdf4dc');
    const opacity = isOuter ? onionOpacity * 1.5 : (onionOpacity * 0.5); 
    const finalOpacity = Math.min(Math.max(opacity, 0.02), 0.9);

    layers.push(
      <mesh key={i}>
        <sphereGeometry args={[r, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshPhysicalMaterial 
          color={color}
          transparent
          opacity={finalOpacity}
          side={THREE.DoubleSide}
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.8}
          depthWrite={isOuter} 
        />
      </mesh>
    );
  }

  return <group rotation={[0,0,0]}>{layers}</group>;
};

const VoxelOnion = ({ params, lift, spread, wireframe }: { params: SimulationParams, lift: number, spread: number, wireframe: boolean }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { onionRadius, layerThickness, verticalSpacing, crossSpacing, horizontalCuts } = params;

  // 1. Prepare Data (heavy calculation only when params change)
  const { voxels, boxSize } = useMemo(() => {
    const voxelData: {x: number, y: number, z: number, layerId: number, vCutId: number, cCutId: number, hCutId: number, color: THREE.Color}[] = [];
    
    // Significantly increased voxel count for high detail
    const targetCount = 125000; 
    const vol = (2/3) * Math.PI * Math.pow(onionRadius, 3); 
    let step = Math.pow(vol / targetCount, 1.0/3.0);
    step = Math.max(step, 0.25); // Lower limit for step size
    
    // Adjusted ratio to create "cellular" look with gaps
    const size = step * 0.92; 
    
    const cutGap = Math.max(0.3, step * 0.25);
    
    const bounds = onionRadius;
    const tempColor = new THREE.Color();

    for (let x = -bounds; x <= bounds; x += step) {
      for (let y = 0; y <= bounds; y += step) { 
        for (let z = -bounds; z <= bounds; z += step) {
            
            const dist = Math.sqrt(x*x + y*y + z*z);
            if (dist > onionRadius) continue;

            const layerId = Math.floor((onionRadius - dist) / layerThickness);
            
            const vCutId = Math.floor(x / verticalSpacing);
            const nearestV = Math.round(x / verticalSpacing) * verticalSpacing;
            if (Math.abs(x - nearestV) < cutGap) continue;

            const cCutId = Math.floor(z / crossSpacing);
            const nearestC = Math.round(z / crossSpacing) * crossSpacing;
            if (Math.abs(z - nearestC) < cutGap) continue;

            let hCutId = 0;
            if (horizontalCuts > 0) {
               const hSpacing = onionRadius / (horizontalCuts + 1);
               hCutId = Math.floor(y / hSpacing);
               let isNearH = false;
               for(let k=1; k<=horizontalCuts; k++) {
                   if (Math.abs(y - (k * hSpacing)) < cutGap) {
                       isNearH = true; 
                       break;
                   }
               }
               if (isNearH) continue;
            }
            
            // Contrast Colors with Noise
            const isOuter = layerId === 0;
            if (isOuter) {
                tempColor.set('#d97706'); // Amber 600
            } else {
                // Creamy inner layers
                const t = Math.min((layerId-1) * 0.1, 1);
                tempColor.set('#fef3c7').lerp(new THREE.Color('#ffffff'), t);
            }
            // Add subtle noise for organic texture
            const noise = (Math.random() - 0.5) * 0.15;
            tempColor.offsetHSL(0, 0, noise);

            voxelData.push({ 
                x, y, z, 
                layerId, vCutId, cCutId, hCutId, 
                color: tempColor.clone() 
            });
        }
      }
    }
    return { voxels: voxelData, boxSize: size };
  }, [onionRadius, layerThickness, verticalSpacing, crossSpacing, horizontalCuts]);

  // 2. Update Transforms
  useEffect(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    const tempMatrix = new THREE.Matrix4();
    const hSpacing = horizontalCuts > 0 ? onionRadius / (horizontalCuts + 1) : onionRadius;
    
    voxels.forEach((v, i) => {
        // Correct mathematical explosion:
        // Separation = Index * Real_Spacing * Spread_Factor
        const spreadX = (v.vCutId * verticalSpacing) * spread;
        const spreadZ = (v.cCutId * crossSpacing) * spread;
        const spreadY = (v.hCutId * hSpacing) * spread;
        
        // Radial lift for layers (more natural)
        const liftY = v.layerId * (layerThickness * 2) * lift;

        tempMatrix.identity();
        tempMatrix.setPosition(
            v.x + spreadX, 
            v.y + spreadY + liftY, 
            v.z + spreadZ
        );
        
        mesh.setMatrixAt(i, tempMatrix);
        mesh.setColorAt(i, v.color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [voxels, lift, spread, onionRadius, verticalSpacing, crossSpacing, horizontalCuts, layerThickness]);

  return (
    <instancedMesh 
        ref={meshRef} 
        args={[undefined, undefined, voxels.length]}
        frustumCulled={false} // Prevents disappearing parts when spread wide
    >
        <boxGeometry args={[boxSize, boxSize, boxSize]} />
        <meshStandardMaterial 
          vertexColors
          roughness={0.7} 
          metalness={0.0}
          wireframe={wireframe}
        />
    </instancedMesh>
  );
};

const CuttingPlanes = ({ params, visible }: { params: SimulationParams, visible: boolean }) => {
  const { onionRadius, verticalSpacing, crossSpacing, horizontalCuts } = params;
  if (!visible) return null;

  const planes = [];
  const size = onionRadius * 2.5;

  const colVert = "#ef4444"; 
  const colCross = "#3b82f6"; 
  const colHorz = "#f59e0b"; 

  // Vertikale Schnitte (X)
  const numVCuts = Math.floor(onionRadius / verticalSpacing);
  for (let i = -numVCuts; i <= numVCuts; i++) {
    planes.push(
      <group key={`v${i}`} position={[i * verticalSpacing, size/4, 0]} rotation={[0, Math.PI/2, 0]}>
         <mesh>
            <planeGeometry args={[size, size/2]} />
            <meshBasicMaterial color={colVert} side={THREE.DoubleSide} transparent opacity={0.25} depthWrite={false} />
         </mesh>
         <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(size, size/2)]} />
            <lineBasicMaterial color={colVert} transparent opacity={0.8} />
         </lineSegments>
      </group>
    );
  }

  // Quer Schnitte (Z)
  const numCCuts = Math.floor(onionRadius / crossSpacing);
  for (let i = -numCCuts; i <= numCCuts; i++) {
    planes.push(
      <group key={`c${i}`} position={[0, size/4, i * crossSpacing]}>
        <mesh>
            <planeGeometry args={[size, size/2]} />
            <meshBasicMaterial color={colCross} side={THREE.DoubleSide} transparent opacity={0.25} depthWrite={false} />
        </mesh>
        <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(size, size/2)]} />
            <lineBasicMaterial color={colCross} transparent opacity={0.8} />
         </lineSegments>
      </group>
    );
  }

  // Horizontale Schnitte (Y)
  if (horizontalCuts > 0) {
      const hSpacing = onionRadius / (horizontalCuts + 1);
      for (let i = 1; i <= horizontalCuts; i++) {
        planes.push(
            <group key={`h${i}`} position={[0, i * hSpacing, 0]} rotation={[Math.PI/2, 0, 0]}>
                <mesh>
                    <planeGeometry args={[size, size]} />
                    <meshBasicMaterial color={colHorz} side={THREE.DoubleSide} transparent opacity={0.25} depthWrite={false} />
                </mesh>
                <lineSegments>
                    <edgesGeometry args={[new THREE.PlaneGeometry(size, size)]} />
                    <lineBasicMaterial color={colHorz} transparent opacity={0.9} linewidth={2} />
                </lineSegments>
            </group>
        );
      }
  }

  return <group>{planes}</group>;
};

const CameraController = ({ action, onActionHandled, autoRotate }: { action: string | null, onActionHandled: () => void, autoRotate: boolean }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const defaultPos = new THREE.Vector3(100, 100, 100);

  useEffect(() => {
    if (!action) return;

    if (action === 'RESET') {
        camera.position.copy(defaultPos);
        camera.lookAt(0, 0, 0);
        if (controlsRef.current) controlsRef.current.target.set(0, 10, 0);
    } else if (action === 'ZOOM_IN') {
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        camera.position.addScaledVector(dir, 20);
    } else if (action === 'ZOOM_OUT') {
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        camera.position.addScaledVector(dir, -20);
    } else if (action === 'TOP_VIEW') {
        camera.position.set(0, 180, 0);
        camera.lookAt(0, 0, 0);
    } else if (action === 'SIDE_VIEW') {
        camera.position.set(150, 10, 0);
        camera.lookAt(0, 10, 0);
    }
    
    if (controlsRef.current) controlsRef.current.update();
    onActionHandled();
  }, [action, camera, onActionHandled]);

  return (
    <OrbitControls 
        ref={controlsRef}
        makeDefault 
        target={[0, 10, 0]} 
        maxPolarAngle={Math.PI / 2} 
        minDistance={2} 
        maxDistance={400} 
        autoRotate={autoRotate}
        autoRotateSpeed={1.0}
    />
  );
};

// --- Modals ---

const ExportModal = ({ isOpen, onClose, onExport, lang }: { isOpen: boolean, onClose: () => void, onExport: (mode: 'single' | 'batch_current' | 'batch_full') => void, lang: Language }) => {
  if (!isOpen) return null;
  const t = (key: string) => TRANSLATIONS[lang][key] || key;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-800 border border-gray-600 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-400" /> {t('modalTitle')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-400 mb-4">{t('modalSub')}</p>
          
          <button onClick={() => onExport('single')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-green-500/50 transition-all group text-left">
            <div className="bg-gray-700 group-hover:bg-green-900/30 p-2 rounded text-green-400">
               <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gray-200">{t('modeSingleTitle')}</div>
              <div className="text-xs text-gray-500">{t('modeSingleDesc')}</div>
            </div>
          </button>

          <button onClick={() => onExport('batch_current')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-blue-500/50 transition-all group text-left">
            <div className="bg-gray-700 group-hover:bg-blue-900/30 p-2 rounded text-blue-400">
               <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gray-200">{t('modeBatchTitle')}</div>
              <div className="text-xs text-gray-500">{t('modeBatchDesc')}</div>
            </div>
          </button>

          <button onClick={() => onExport('batch_full')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-purple-500/50 transition-all group text-left">
            <div className="bg-gray-700 group-hover:bg-purple-900/30 p-2 rounded text-purple-400">
               <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gray-200">{t('modeFullTitle')}</div>
              <div className="text-xs text-gray-500">{t('modeFullDesc')}</div>
            </div>
          </button>
        </div>

        <div className="p-4 bg-gray-900/50 border-t border-gray-700 text-center">
            <button onClick={onClose} className="text-xs text-gray-500 hover:text-gray-300">{t('modalCancel')}</button>
        </div>
      </div>
    </div>
  );
};

const InfoModal = ({ isOpen, onClose, lang }: { isOpen: boolean, onClose: () => void, lang: Language }) => {
    if (!isOpen) return null;
    const t = (key: string) => TRANSLATIONS[lang][key] || key;
  
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-gray-800 border border-gray-600 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-5 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-violet-400" /> {t('aboutTitle')}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
          </div>
          
          <div className="p-6 space-y-4 text-gray-300">
            <p className="leading-relaxed">
              {t('aboutText')}
            </p>
            
            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 mt-4">
               <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                  <span>{t('aboutVersion')}</span>
                  <span>{t('aboutLicense')}</span>
               </div>
            </div>

            <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                <ShieldAlert className="w-3 h-3" /> 
                <span>Privacy: No data is collected. Everything runs locally in your browser.</span>
            </div>
          </div>
  
          <div className="p-4 bg-gray-900/50 border-t border-gray-700 text-center">
              <button onClick={onClose} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors">OK</button>
          </div>
        </div>
      </div>
    );
  };

// --- Hauptkomponente ---

const App = () => {
  const [lang, setLang] = useState<Language>('en'); // Default to English
  const t = (key: string) => TRANSLATIONS[lang][key] || key;

  const [params, setParams] = useState<SimulationParams>({
    onionRadius: 40, 
    layerThickness: 3, 
    verticalSpacing: 5, 
    crossSpacing: 5, 
    horizontalCuts: 0, 
    onionOpacity: 0.15,
    showCuts: true,
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [comparisonResult, setComparisonResult] = useState<SimulationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  
  // Explosion state
  const [explosionLift, setExplosionLift] = useState(0.05);
  const [explosionSpread, setExplosionSpread] = useState(0);
  const [showWireframe, setShowWireframe] = useState(false);

  // Camera State
  const [cameraAction, setCameraAction] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);

  // Berechnung
  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => {
      const res = runSimulation(params);
      setResult(res);

      if (compareMode) {
        const compParams = { ...params, horizontalCuts: 0 };
        const compRes = runSimulation(compParams);
        setComparisonResult(compRes);
      } else {
        setComparisonResult(null);
      }
      setIsCalculating(false);
    }, 50);
    return () => clearTimeout(timer);
  }, [params, compareMode]);

  const generateCSVRow = (p: SimulationParams, res: SimulationResult, language: Language) => {
     const loc = (k: string) => TRANSLATIONS[language][k] || k;
     let rating = loc('ratingGood');
     if (res.cv > 80) rating = loc('ratingUneven');
     if (res.cv < 40) rating = loc('ratingHomogen');

     return [
        p.onionRadius,
        p.layerThickness,
        p.verticalSpacing,
        p.crossSpacing,
        p.horizontalCuts,
        res.pieceCount,
        res.totalVolume.toFixed(2),
        res.averageSize.toFixed(2),
        res.median.toFixed(2),
        res.maxSize.toFixed(2),
        res.stdDev.toFixed(2),
        res.cv.toFixed(2),
        rating
      ].join(';');
  };

  const executeExport = async (mode: 'single' | 'batch_current' | 'batch_full') => {
    setShowExportModal(false);
    setIsExporting(true);
    
    // Kurze Pause damit UI updated
    await new Promise(resolve => setTimeout(resolve, 50));

    const loc = (k: string) => TRANSLATIONS[lang][k] || k;
    let csvContent = "\uFEFF"; 
    
    // Header based on language
    const headers = [
        loc('csvRadius'), loc('csvLayer'), loc('csvVert'), loc('csvCross'), loc('csvHorz'),
        loc('csvCount'), loc('csvVolTotal'), loc('csvAvg'), loc('csvMedian'),
        loc('csvMax'), loc('csvStd'), loc('csvCV'), loc('csvRating')
    ];
    csvContent += headers.join(';') + "\n";

    const { onionRadius, layerThickness } = params;

    if (mode === 'single') {
        const row = generateCSVRow(params, result!, lang);
        csvContent += row + "\n";
    } else {
        // Ranges bestimmen
        const radii = mode === 'batch_full' ? [30, 45, 60] : [onionRadius];
        
        for (const r of radii) {
             for (let v = 3; v <= 7; v++) {
                for (let c = 3; c <= 7; c++) {
                    for (let h = 0; h <= 5; h++) {
                         const batchParams: SimulationParams = {
                            onionRadius: r,
                            layerThickness,
                            verticalSpacing: v,
                            crossSpacing: c,
                            horizontalCuts: h,
                            onionOpacity: 0.1,
                            showCuts: false
                        };
                        const res = runSimulation(batchParams);
                        csvContent += generateCSVRow(batchParams, res, lang) + "\n";
                    }
                }
            }
        }
    }

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const filename = `OnionLab_${lang}_${mode === 'batch_full' ? 'FULL' : 'Data'}_${new Date().toISOString().slice(0,10)}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsExporting(false);
  };

  const chartData = useMemo(() => {
    if (!result) return { labels: [], datasets: [] };
    
    const datasets = [
      {
        label: `${t('chartLabelCurrent')} (${params.horizontalCuts})`,
        data: result.histogram,
        backgroundColor: 'rgba(59, 130, 246, 0.6)', 
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      }
    ];

    if (compareMode && comparisonResult) {
       datasets.push({
        label: t('chartLabelComp'),
        data: comparisonResult.histogram, 
        backgroundColor: 'rgba(239, 68, 68, 0.4)', 
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
       });
    }

    return {
      labels: result.labels,
      datasets,
    };
  }, [result, comparisonResult, compareMode, lang]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
      <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} onExport={executeExport} lang={lang} />
      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} lang={lang} />
      
      {/* Sidebar */}
      <div className="w-full md:w-96 flex flex-col p-5 bg-gray-800 shadow-2xl overflow-y-auto border-r border-gray-700 z-10 custom-scrollbar">
        
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-gray-700">
            <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-violet-400">
                <Scissors className="w-6 h-6" /> 
                {t('appTitle')}
                </h1>
                
                <div className="flex gap-2">
                    {/* Help Button */}
                    <button 
                        onClick={() => setShowInfoModal(true)}
                        className="bg-gray-700 hover:bg-gray-600 p-1.5 rounded text-gray-200 border border-gray-600"
                        title={t('aboutTitle')}
                    >
                        <HelpCircle className="w-4 h-4" />
                    </button>

                    {/* Language Dropdown */}
                    <div className="relative group">
                        <div className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-2 py-1.5 rounded cursor-pointer text-xs font-bold text-gray-200 border border-gray-600">
                            <Globe className="w-3 h-3" />
                            <span>{lang.toUpperCase()}</span>
                            <ChevronDown className="w-3 h-3" />
                        </div>
                        
                        <div className="absolute right-0 top-full mt-1 w-40 bg-gray-800 border border-gray-600 rounded shadow-xl hidden group-hover:block z-50 max-h-60 overflow-y-auto custom-scrollbar">
                            {LANGUAGES.map(l => (
                                <button 
                                    key={l.code}
                                    onClick={() => setLang(l.code)}
                                    className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-700 ${lang === l.code ? 'text-violet-400 font-bold bg-gray-900' : 'text-gray-300'}`}
                                >
                                    {l.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-xs text-gray-400">
            {t('appSubtitle')}
            </p>
        </div>

        <div className="space-y-6">
          
          {/* Geometrie */}
          <div className="space-y-3 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Ruler className="w-3 h-3" /> {t('geoTitle')}
            </h2>
            
            <div className="grid grid-cols-3 gap-2 mb-2">
                {[30, 45, 60].map(r => (
                    <button 
                        key={r}
                        onClick={() => setParams({...params, onionRadius: r})}
                        className={`text-xs py-1 px-2 rounded border ${params.onionRadius === r ? 'bg-violet-900 border-violet-500 text-white' : 'border-gray-600 text-gray-400 hover:bg-gray-700'}`}
                    >
                        {r === 30 ? t('sizeSmall') : r === 45 ? t('sizeMedium') : t('sizeLarge')} ({r*2}mm)
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-3">
               <span className="text-xs w-20 text-gray-400">{t('radius')}:</span>
               <input 
                  type="range" min="20" max="70" step="1" 
                  value={params.onionRadius}
                  onChange={(e) => setParams({...params, onionRadius: parseInt(e.target.value)})}
                  className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <span className="w-6 text-right text-xs font-mono">{params.onionRadius}</span>
            </div>
            
             <div className="flex items-center gap-3">
               <span className="text-xs w-20 text-gray-400">{t('layer')}:</span>
               <input 
                  type="range" min="1" max="8" step="0.5" 
                  value={params.layerThickness}
                  onChange={(e) => setParams({...params, layerThickness: parseFloat(e.target.value)})}
                  className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-violet-300"
                />
                <span className="w-6 text-right text-xs font-mono">{params.layerThickness}</span>
            </div>

            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-700">
               <Eye className="w-3 h-3 text-gray-500" />
               <input 
                  type="range" min="0.05" max="0.8" step="0.05" 
                  value={params.onionOpacity}
                  onChange={(e) => setParams({...params, onionOpacity: parseFloat(e.target.value)})}
                  className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-gray-400"
                  title={t('transparency')}
                />
            </div>
          </div>

          {/* Technik */}
          <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 relative">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Scissors className="w-3 h-3" /> {t('techTitle')}
            </h2>
            
            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-red-400 font-semibold">{t('vertical')}</span>
                        <span className="font-mono">{params.verticalSpacing} mm</span>
                    </div>
                    <input 
                        type="range" min="2" max="15" step="0.5" 
                        value={params.verticalSpacing}
                        onChange={(e) => setParams({...params, verticalSpacing: parseFloat(e.target.value)})}
                        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                </div>

                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-blue-400 font-semibold">{t('cross')}</span>
                        <span className="font-mono">{params.crossSpacing} mm</span>
                    </div>
                    <input 
                        type="range" min="2" max="15" step="0.5" 
                        value={params.crossSpacing}
                        onChange={(e) => setParams({...params, crossSpacing: parseFloat(e.target.value)})}
                        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div className={`pt-2 border-t border-gray-700 transition-colors ${params.horizontalCuts > 0 ? 'bg-orange-900/10 -mx-2 px-2 pb-2 rounded' : ''}`}>
                     <div className="flex justify-between text-xs mb-1">
                        <span className="text-orange-400 font-bold">{t('horizontal')}</span>
                        <span className="font-mono">{params.horizontalCuts} {t('cuts')}</span>
                    </div>
                     <input 
                        type="range" min="0" max="10" step="1" 
                        value={params.horizontalCuts}
                        onChange={(e) => setParams({...params, horizontalCuts: parseInt(e.target.value)})}
                        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                </div>
            </div>
          </div>

          <button 
             onClick={() => setCompareMode(!compareMode)}
             className={`w-full py-2 px-3 rounded flex items-center justify-between text-xs font-bold transition-all border ${compareMode ? 'bg-teal-900/30 border-teal-500 text-teal-400' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
          >
             <span className="flex items-center gap-2"><Eye className="w-3 h-3"/> {t('compareBtn')}</span>
             <div className={`w-8 h-4 rounded-full p-0.5 ${compareMode ? 'bg-teal-500' : 'bg-gray-600'}`}>
                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${compareMode ? 'translate-x-4' : ''}`}></div>
             </div>
          </button>

           <button
                onClick={() => setShowExportModal(true)}
                disabled={isExporting}
                className={`w-full py-3 flex items-center justify-center gap-2 rounded-lg font-bold text-sm shadow-lg transition-all ${isExporting ? 'bg-gray-600 cursor-wait' : 'bg-green-700 hover:bg-green-600 text-white'}`}
            >
                {isExporting ? <RefreshCw className="w-4 h-4 animate-spin"/> : <FileSpreadsheet className="w-4 h-4"/>}
                {isExporting ? t('exporting') : t('exportBtn')}
            </button>
        </div>

        {/* Stats Footer */}
        <div className="mt-auto pt-6">
            {isCalculating ? (
                <div className="flex items-center justify-center py-4 text-gray-500 animate-pulse text-xs">
                    <RefreshCw className="w-3 h-3 mr-2 animate-spin" /> ...
                </div>
            ) : result && (
                <div className="space-y-2">
                    <div className="bg-gray-900 p-3 rounded border border-gray-700">
                        <div className="flex justify-between items-center mb-1">
                             <div className="text-xs text-gray-400 flex items-center gap-1">
                                {t('cvTitle')}
                                <div className="group relative">
                                    <Info className="w-3 h-3 cursor-help text-gray-500"/>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black text-xs text-gray-300 rounded shadow-lg hidden group-hover:block z-50">
                                        {t('cvTooltip')}
                                    </div>
                                </div>
                             </div>
                             <div className={`text-lg font-mono font-bold ${result.cv < 45 ? 'text-green-400' : result.cv < 75 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {result.cv.toFixed(1)}%
                             </div>
                        </div>
                        
                        {compareMode && comparisonResult && (
                             <div className="mt-2 pt-2 border-t border-gray-700 text-xs flex justify-between">
                                <span className="text-gray-500">No Horz:</span>
                                <span className="font-mono text-gray-300">{comparisonResult.cv.toFixed(1)}%</span>
                                <span className={`${result.cv < comparisonResult.cv ? 'text-green-400' : 'text-gray-500'} font-bold ml-2`}>
                                   {result.cv < comparisonResult.cv ? `-${(comparisonResult.cv - result.cv).toFixed(1)}%` : t('cvNoBenefit')}
                                </span>
                             </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* 3D Canvas */}
        <div className="flex-1 relative bg-[#0f1115]">
          <Canvas shadows dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[100, 100, 100]} fov={40} />
            <CameraController action={cameraAction} onActionHandled={() => setCameraAction(null)} autoRotate={autoRotate} />
            
            <ambientLight intensity={0.7} color="#ffffff" />
            <pointLight position={[50, 80, 50]} intensity={1.0} color="#ffffff" />
            <pointLight position={[-30, 20, -30]} intensity={0.3} color="#ffffff" />
            
            {isExploded ? 
              <VoxelOnion params={params} lift={explosionLift} spread={explosionSpread} wireframe={showWireframe} /> : 
              <OnionMesh params={params} />
            }
            
            <CuttingPlanes params={params} visible={!isExploded && params.showCuts} />

            <Grid position={[0, -0.1, 0]} args={[200, 200]} cellSize={10} sectionSize={50} fadeDistance={200} sectionColor="#374151" cellColor="#1f2937" />
            <axesHelper args={[20]} />
            
            <Text position={[25, 2, 0]} fontSize={2} color="#ef4444" anchorX="left">X</Text>
            <Text position={[0, 25, 0]} fontSize={2} color="#f59e0b" anchorX="left">Y</Text>
            <Text position={[0, 2, 25]} fontSize={2} color="#3b82f6" anchorX="left">Z</Text>
          </Canvas>

          {/* Viewport Overlay Controls */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
             <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-lg p-1 flex flex-col gap-1 shadow-xl">
                <button onClick={() => setCameraAction('ZOOM_IN')} className="p-2 hover:bg-gray-700 rounded text-gray-300" title="Zoom In"><ZoomIn className="w-5 h-5"/></button>
                <button onClick={() => setCameraAction('ZOOM_OUT')} className="p-2 hover:bg-gray-700 rounded text-gray-300" title="Zoom Out"><ZoomOut className="w-5 h-5"/></button>
                <div className="h-px bg-gray-700 my-1"></div>
                <button onClick={() => setCameraAction('RESET')} className="p-2 hover:bg-gray-700 rounded text-gray-300" title="Reset View"><Home className="w-5 h-5"/></button>
                <button onClick={() => setAutoRotate(!autoRotate)} className={`p-2 rounded transition-colors ${autoRotate ? 'bg-violet-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`} title="Auto Rotate"><RotateCw className={`w-5 h-5 ${autoRotate ? 'animate-spin-slow' : ''}`}/></button>
             </div>

             <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-lg p-1 flex flex-col gap-1 shadow-xl mt-2">
                <button onClick={() => setCameraAction('TOP_VIEW')} className="p-2 hover:bg-gray-700 rounded text-gray-300" title="Top View"><Layers className="w-5 h-5"/></button>
                <button onClick={() => setCameraAction('SIDE_VIEW')} className="p-2 hover:bg-gray-700 rounded text-gray-300" title="Side View"><MonitorPlay className="w-5 h-5"/></button>
             </div>
             
             {/* Explosion Button */}
             <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-lg p-1 flex flex-col gap-1 shadow-xl mt-2">
                <button 
                  onClick={() => setIsExploded(!isExploded)} 
                  className={`p-2 rounded transition-colors ${isExploded ? 'bg-orange-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`} 
                  title="Exploded View (Particles)"
                >
                    <Expand className="w-5 h-5"/>
                </button>
             </div>
          </div>

          <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur p-4 rounded-lg border border-gray-700 text-xs shadow-xl pointer-events-none">
            <h3 className="font-bold text-gray-200 mb-2">{t('legendTitle')}</h3>
            <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-red-500 rounded-sm opacity-50 border border-red-400"></div> 
                <span className="text-gray-300">{t('legendVert')}</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-blue-500 rounded-sm opacity-50 border border-blue-400"></div> 
                <span className="text-gray-300">{t('legendCross')}</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-sm opacity-50 border border-orange-400"></div> 
                <span className="text-gray-300">{t('legendHorz')}</span>
            </div>
          </div>

          {/* Dynamic Explosion Controls */}
          {isExploded && (
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur border border-gray-600 p-4 rounded-xl shadow-2xl flex items-center gap-6 z-10 w-96 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex-1">
                   <label className="text-xs font-bold text-gray-400 block mb-1 flex items-center gap-2"><Move3d className="w-3 h-3"/> {t('expSpread')}</label>
                   <input 
                      type="range" min="0" max="0.5" step="0.01" 
                      value={explosionSpread} 
                      onChange={e => setExplosionSpread(parseFloat(e.target.value))} 
                      className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
                   />
                </div>
                <div className="flex-1">
                   <label className="text-xs font-bold text-gray-400 block mb-1 flex items-center gap-2"><Layers className="w-3 h-3"/> {t('expLift')}</label>
                   <input 
                      type="range" min="0" max="0.3" step="0.01" 
                      value={explosionLift} 
                      onChange={e => setExplosionLift(parseFloat(e.target.value))} 
                      className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-violet-500"
                   />
                </div>
                <button 
                  onClick={() => setShowWireframe(!showWireframe)}
                  className={`p-2 rounded border transition-colors ${showWireframe ? 'bg-gray-700 border-gray-500 text-white' : 'border-gray-700 text-gray-500 hover:text-white'}`}
                  title={t('wireframe')}
                >
                    <Grid3X3 className="w-4 h-4" />
                </button>
             </div>
          )}
        </div>

        {/* Bottom Panel */}
        <div className="h-72 bg-gray-800 border-t border-gray-700 flex flex-col md:flex-row">
             <div className="flex-1 p-4 border-r border-gray-700 min-w-0">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> {t('distTitle')}
                </h3>
                <div className="h-56 relative w-full">
                    {result && <Bar data={chartData} options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: compareMode, position: 'top', labels: { color: '#9ca3af', boxWidth: 10 } },
                            tooltip: { 
                                mode: 'index',
                                intersect: false,
                                callbacks: { title: (items) => `${t('chartTooltip')}: ${items[0].label} mm³` }
                            }
                        },
                        scales: {
                            x: { ticks: { color: '#6b7280', maxTicksLimit: 10 }, grid: { display: false } },
                            y: { ticks: { color: '#6b7280' }, grid: { color: '#374151' } }
                        }
                    }} />}
                </div>
             </div>

             <div className="w-full md:w-80 p-4 bg-gray-800/50 overflow-y-auto">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" /> {t('statsTitle')}
                </h3>
                {result && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-gray-700/30 p-2 rounded">
                            <span className="block text-xs text-gray-500">{t('statCount')}</span>
                            <span className="font-mono font-bold text-gray-200">{result.pieceCount}</span>
                        </div>
                        <div className="bg-gray-700/30 p-2 rounded">
                            <span className="block text-xs text-gray-500">{t('statVol')}</span>
                            <span className="font-mono font-bold text-gray-200">{result.averageSize.toFixed(0)} mm³</span>
                        </div>
                        <div className="bg-gray-700/30 p-2 rounded">
                            <span className="block text-xs text-gray-500">{t('statMedian')}</span>
                            <span className="font-mono text-gray-300">{result.median.toFixed(0)} mm³</span>
                        </div>
                        <div className="bg-gray-700/30 p-2 rounded">
                            <span className="block text-xs text-gray-500">{t('statStdDev')}</span>
                            <span className="font-mono text-gray-300">{result.stdDev.toFixed(1)}</span>
                        </div>
                         <div className="bg-gray-700/30 p-2 rounded col-span-2">
                            <span className="block text-xs text-gray-500">{t('statTheoVol')}</span>
                            <span className="font-mono text-gray-400 text-xs">{(result.theoreticalVolume).toFixed(0)} mm³ (Sim: {result.totalVolume.toFixed(0)})</span>
                        </div>
                    </div>
                )}
             </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);